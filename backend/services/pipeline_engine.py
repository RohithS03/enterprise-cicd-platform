import hashlib
import time
from datetime import datetime
from .db_service import query_db, execute_db

def run_pipeline(branch='main', commit_hash=None, injected_failure='NONE'):
    """
    Executes the 7-Stage Enterprise CI/CD Pipeline
    Stages: Git Checkout -> Maven Build -> Unit Tests -> SonarQube -> Package WAR -> Nexus Publish -> Tomcat Deploy
    """
    if not commit_hash:
        latest_c = query_db("SELECT commit_hash FROM commits ORDER BY commit_id DESC LIMIT 1", one=True)
        commit_hash = latest_c['commit_hash'] if latest_c else 'a1b2c3d4e5f67890123456789abcdef012345678'

    # Get max build number
    max_b = query_db("SELECT MAX(build_number) as max_b FROM pipeline_runs", one=True)
    build_num = (max_b['max_b'] or 100) + 1

    run_id = execute_db(
        "INSERT INTO pipeline_runs (build_number, commit_hash, branch, status, started_at, triggered_by) VALUES (?, ?, ?, 'RUNNING', DATETIME('now'), 'WEB_TRIGGER')",
        (build_num, commit_hash, branch)
    )

    stages = [
        ('1. Git Checkout', 'git_checkout'),
        ('2. Maven Build', 'maven_build'),
        ('3. Unit Tests', 'unit_tests'),
        ('4. SonarQube Analysis', 'sonarqube_analysis'),
        ('5. Package WAR', 'package_war'),
        ('6. Nexus Publish', 'nexus_publish'),
        ('7. Tomcat Deployment', 'tomcat_deploy')
    ]

    pipeline_failed = False
    failed_stage_name = None
    stage_results = []

    for display_name, code_name in stages:
        if pipeline_failed:
            # Skip downstream stages if prior stage failed
            stage_results.append({
                'stage': display_name,
                'status': 'SKIPPED',
                'log': f"[{datetime.now().strftime('%H:%M:%S')}] Stage skipped due to upstream failure in {failed_stage_name}."
            })
            execute_db(
                "INSERT INTO stage_logs (run_id, stage_name, status, log_output) VALUES (?, ?, 'SKIPPED', ?)",
                (run_id, display_name, f"Stage skipped due to upstream failure in {failed_stage_name}.")
            )
            continue

        # Check failure injection
        if injected_failure.lower() == code_name.lower():
            pipeline_failed = True
            failed_stage_name = display_name
            log_out = f"[{datetime.now().strftime('%H:%M:%S')}] ERROR: Failure injected at stage {display_name}! Pipeline execution aborted."
            stage_results.append({
                'stage': display_name,
                'status': 'FAILED',
                'log': log_out
            })
            execute_db(
                "INSERT INTO stage_logs (run_id, stage_name, status, log_output) VALUES (?, ?, 'FAILED', ?)",
                (run_id, display_name, log_out)
            )
            continue

        # Successful stage execution
        log_out = f"[{datetime.now().strftime('%H:%M:%S')}] Executing {display_name}... SUCCESS."
        stage_results.append({
            'stage': display_name,
            'status': 'SUCCESS',
            'log': log_out
        })
        execute_db(
            "INSERT INTO stage_logs (run_id, stage_name, status, log_output) VALUES (?, ?, 'SUCCESS', ?)",
            (run_id, display_name, log_out)
        )

    final_status = 'FAILED' if pipeline_failed else 'SUCCESS'
    execute_db(
        "UPDATE pipeline_runs SET status = ?, finished_at = DATETIME('now'), duration_sec = 42 WHERE run_id = ?",
        (final_status, run_id)
    )

    if final_status == 'SUCCESS':
        # Record SonarQube Metrics
        execute_db(
            "INSERT INTO quality_metrics (run_id, bugs, vulnerabilities, code_smells, coverage_percent, security_rating, reliability_rating, quality_gate) VALUES (?, 0, 0, 3, 89.2, 'A', 'A', 'PASSED')",
            (run_id,)
        )

        # Record Nexus Artifact
        sha1_hash = hashlib.sha1(f"myweb-1.0.{build_num}.war".encode()).hexdigest()
        execute_db(
            "INSERT INTO artifacts (run_id, name, version, repository, checksum_sha1, file_size_kb) VALUES (?, 'myweb.war', ?, 'releases', ?, 14450)",
            (run_id, f"1.0.{build_num}", sha1_hash)
        )

        # Record Tomcat Deployment
        execute_db(
            "INSERT INTO deployments (run_id, environment, artifact_name, version, status) VALUES (?, 'DEV', 'myweb.war', ?, 'SUCCESS')",
            (run_id, f"1.0.{build_num}")
        )

    return {
        'run_id': run_id,
        'build_number': build_num,
        'branch': branch,
        'commit_hash': commit_hash[:8],
        'status': final_status,
        'duration_sec': 42,
        'stage_results': stage_results
    }

def rollback_deployment(environment='TEST'):
    """
    Restores the previous successful version on target Tomcat environment
    """
    deps = query_db(
        "SELECT * FROM deployments WHERE environment = ? AND status = 'SUCCESS' ORDER BY deployment_id DESC LIMIT 2",
        (environment,)
    )

    if len(deps) < 2:
        return {'status': 'error', 'message': f"Insufficient deployment history on {environment} to perform rollback."}

    prev_dep = dict(deps[1])
    # Perform rollback
    new_dep_id = execute_db(
        "INSERT INTO deployments (run_id, environment, artifact_name, version, status, deployed_by) VALUES (?, ?, ?, ?, 'SUCCESS', 'ROLLBACK_TRIGGER')",
        (prev_dep['run_id'], environment, prev_dep['artifact_name'], prev_dep['version'])
    )

    return {
        'status': 'success',
        'rollback_id': new_dep_id,
        'environment': environment,
        'restored_version': prev_dep['version'],
        'artifact_name': prev_dep['artifact_name']
    }
