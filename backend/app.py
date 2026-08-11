from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.db_service import initialize_database, query_db, execute_db
from services.pipeline_engine import run_pipeline, rollback_deployment
from services.metrics_service import calculate_dora_metrics

app = Flask(__name__)
CORS(app)

# Initialize Database Schema & Seed Data on Startup
initialize_database()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'platform': 'Enterprise CI/CD Pipeline Automation Platform',
        'pipeline_status': 'ONLINE',
        'services': {
            'git': 'CONNECTED',
            'jenkins': 'CONNECTED',
            'maven': 'AVAILABLE',
            'sonarqube': 'QUALITY_GATE_PASSED',
            'nexus': 'REPOSITORY_ONLINE',
            'tomcat': 'SERVERS_RUNNING'
        }
    })

@app.route('/api/pipeline/run', methods=['POST'])
def execute_pipeline_route():
    req = request.json or {}
    branch = req.get('branch', 'main')
    commit_hash = req.get('commit_hash', None)

    # Check active failure injection
    active_f = query_db("SELECT target_stage FROM failure_injections WHERE is_active = 1", one=True)
    injected_failure = active_f['target_stage'] if active_f else 'NONE'

    res = run_pipeline(branch=branch, commit_hash=commit_hash, injected_failure=injected_failure)
    return jsonify(res)

@app.route('/api/pipeline/inject-failure', methods=['POST'])
def inject_failure():
    req = request.json or {}
    target_stage = req.get('target_stage', 'NONE') # e.g. 'unit_tests', 'sonarqube_analysis', 'tomcat_deploy'

    execute_db("UPDATE failure_injections SET is_active = 0")
    if target_stage != 'NONE':
        execute_db("INSERT INTO failure_injections (target_stage, is_active, reason) VALUES (?, 1, 'Manual Failure Injection')", (target_stage,))

    return jsonify({'status': 'updated', 'active_failure_stage': target_stage})

@app.route('/api/pipeline/history', methods=['GET'])
def pipeline_history():
    runs = [dict(r) for r in query_db("SELECT pr.*, c.author, c.message FROM pipeline_runs pr JOIN commits c ON pr.commit_hash = c.commit_hash ORDER BY pr.run_id DESC")]
    return jsonify({'total_runs': len(runs), 'runs': runs})

@app.route('/api/git/commits', methods=['GET'])
def list_commits():
    commits = [dict(r) for r in query_db("SELECT * FROM commits ORDER BY commit_id DESC")]
    return jsonify({'commits': commits})

@app.route('/api/jenkins/jobs', methods=['GET'])
def jenkins_jobs():
    latest_run = query_db("SELECT * FROM pipeline_runs ORDER BY run_id DESC LIMIT 1", one=True)
    logs = []
    if latest_run:
        logs = [dict(l) for l in query_db("SELECT * FROM stage_logs WHERE run_id = ? ORDER BY log_id ASC", (latest_run['run_id'],))]

    return jsonify({
        'job_name': 'online-shopping-pipeline',
        'pipeline_file': 'Jenkinsfile (Declarative)',
        'latest_run': dict(latest_run) if latest_run else None,
        'logs': logs
    })

@app.route('/api/maven/builds', methods=['GET'])
def maven_builds():
    latest_run = query_db("SELECT * FROM pipeline_runs ORDER BY run_id DESC LIMIT 1", one=True)
    build_num = latest_run['build_number'] if latest_run else 103
    return jsonify({
        'group_id': 'com.enterprise.app',
        'artifact_id': 'myweb',
        'packaging': 'war',
        'target_artifact': f"myweb-1.0.{build_num}.war",
        'build_status': 'BUILD SUCCESS',
        'plugins': ['maven-compiler-plugin', 'maven-surefire-plugin', 'maven-war-plugin']
    })

@app.route('/api/sonarqube/metrics', methods=['GET'])
def sonarqube_metrics():
    latest_m = query_db("SELECT * FROM quality_metrics ORDER BY metric_id DESC LIMIT 1", one=True)
    return jsonify(dict(latest_m) if latest_m else {
        'bugs': 0,
        'vulnerabilities': 0,
        'code_smells': 3,
        'coverage_percent': 89.2,
        'security_rating': 'A',
        'reliability_rating': 'A',
        'quality_gate': 'PASSED'
    })

@app.route('/api/nexus/artifacts', methods=['GET'])
def nexus_artifacts():
    artifacts = [dict(a) for a in query_db("SELECT * FROM artifacts ORDER BY artifact_id DESC")]
    return jsonify({'total_artifacts': len(artifacts), 'artifacts': artifacts})

@app.route('/api/tomcat/deployments', methods=['GET'])
def tomcat_deployments():
    deployments = [dict(d) for d in query_db("SELECT * FROM deployments ORDER BY deployment_id DESC")]
    return jsonify({'total_deployments': len(deployments), 'deployments': deployments})

@app.route('/api/tomcat/rollback', methods=['POST'])
def rollback_route():
    req = request.json or {}
    env = req.get('environment', 'TEST')
    res = rollback_deployment(env)
    return jsonify(res)

@app.route('/api/analytics/dora', methods=['GET'])
def dora_analytics():
    res = calculate_dora_metrics()
    return jsonify(res)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
