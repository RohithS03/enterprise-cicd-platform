-- Enterprise CI/CD Pipeline Platform Database Schema

CREATE TABLE IF NOT EXISTS commits (
    commit_id INTEGER PRIMARY KEY AUTOINCREMENT,
    commit_hash VARCHAR(40) UNIQUE NOT NULL,
    branch VARCHAR(50) NOT NULL DEFAULT 'main',
    author VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    committed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pipeline_runs (
    run_id INTEGER PRIMARY KEY AUTOINCREMENT,
    build_number INTEGER UNIQUE NOT NULL,
    commit_hash VARCHAR(40) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    finished_at DATETIME,
    duration_sec INTEGER DEFAULT 0,
    triggered_by VARCHAR(50) DEFAULT 'GIT_PUSH',
    FOREIGN KEY (commit_hash) REFERENCES commits(commit_hash)
);

CREATE TABLE IF NOT EXISTS stage_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id INTEGER NOT NULL,
    stage_name VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'RUNNING',
    log_output TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (run_id) REFERENCES pipeline_runs(run_id)
);

CREATE TABLE IF NOT EXISTS quality_metrics (
    metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id INTEGER NOT NULL,
    bugs INTEGER DEFAULT 0,
    vulnerabilities INTEGER DEFAULT 0,
    code_smells INTEGER DEFAULT 0,
    coverage_percent REAL DEFAULT 85.5,
    security_rating VARCHAR(5) DEFAULT 'A',
    reliability_rating VARCHAR(5) DEFAULT 'A',
    quality_gate VARCHAR(20) DEFAULT 'PASSED',
    FOREIGN KEY (run_id) REFERENCES pipeline_runs(run_id)
);

CREATE TABLE IF NOT EXISTS artifacts (
    artifact_id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    repository VARCHAR(50) DEFAULT 'releases',
    checksum_sha1 VARCHAR(40) NOT NULL,
    file_size_kb INTEGER DEFAULT 14200,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (run_id) REFERENCES pipeline_runs(run_id)
);

CREATE TABLE IF NOT EXISTS deployments (
    deployment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id INTEGER NOT NULL,
    environment VARCHAR(20) NOT NULL,
    artifact_name VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    deployed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deployed_by VARCHAR(50) DEFAULT 'JENKINS_CI',
    FOREIGN KEY (run_id) REFERENCES pipeline_runs(run_id)
);

CREATE TABLE IF NOT EXISTS failure_injections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    target_stage VARCHAR(50) NOT NULL,
    is_active INTEGER DEFAULT 0,
    reason TEXT
);
