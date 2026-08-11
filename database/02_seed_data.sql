-- Enterprise CI/CD Pipeline Platform Seed Data

-- Git Commits
INSERT INTO commits (commit_id, commit_hash, branch, author, message, committed_at) VALUES
(1, 'a1b2c3d4e5f67890123456789abcdef012345678', 'main', 'Sarah Connor', 'feat: Add secure OAuth2 authentication flow', DATETIME('now', '-2 days')),
(2, 'b2c3d4e5f67890123456789abcdef012345678a', 'feature/payment-api', 'Alex Mercer', 'feat: Integrate Stripe payment gateway webhook', DATETIME('now', '-1 day')),
(3, 'c3d4e5f67890123456789abcdef012345678ab2', 'release/v1.2', 'David Miller', 'release: Bump application version to 1.2.0-WAR', DATETIME('now', '-3 hours'));

-- Historical Pipeline Runs
INSERT INTO pipeline_runs (run_id, build_number, commit_hash, branch, status, started_at, finished_at, duration_sec, triggered_by) VALUES
(1, 101, 'a1b2c3d4e5f67890123456789abcdef012345678', 'main', 'SUCCESS', DATETIME('now', '-2 days'), DATETIME('now', '-2 days', '+42 seconds'), 42, 'GIT_PUSH'),
(2, 102, 'b2c3d4e5f67890123456789abcdef012345678a', 'feature/payment-api', 'SUCCESS', DATETIME('now', '-1 day'), DATETIME('now', '-1 day', '+38 seconds'), 38, 'GIT_PUSH'),
(3, 103, 'c3d4e5f67890123456789abcdef012345678ab2', 'release/v1.2', 'SUCCESS', DATETIME('now', '-3 hours'), DATETIME('now', '-3 hours', '+45 seconds'), 45, 'MANUAL_TRIGGER');

-- Quality Metrics
INSERT INTO quality_metrics (metric_id, run_id, bugs, vulnerabilities, code_smells, coverage_percent, security_rating, reliability_rating, quality_gate) VALUES
(1, 101, 0, 0, 4, 88.5, 'A', 'A', 'PASSED'),
(2, 102, 1, 0, 7, 84.0, 'A', 'B', 'PASSED'),
(3, 103, 0, 0, 2, 91.2, 'A', 'A', 'PASSED');

-- Artifacts in Nexus
INSERT INTO artifacts (artifact_id, run_id, name, version, repository, checksum_sha1, file_size_kb, uploaded_at) VALUES
(1, 101, 'myweb.war', '1.0.1', 'releases', '7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a', 14200, DATETIME('now', '-2 days')),
(2, 102, 'myweb.war', '1.0.2', 'releases', '8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', 14350, DATETIME('now', '-1 day')),
(3, 103, 'myweb.war', '1.2.0', 'releases', '9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8', 14500, DATETIME('now', '-3 hours'));

-- Deployments on Tomcat
INSERT INTO deployments (deployment_id, run_id, environment, artifact_name, version, status, deployed_at) VALUES
(1, 101, 'DEV', 'myweb.war', '1.0.1', 'SUCCESS', DATETIME('now', '-2 days')),
(2, 102, 'TEST', 'myweb.war', '1.0.2', 'SUCCESS', DATETIME('now', '-1 day')),
(3, 103, 'PROD', 'myweb.war', '1.2.0', 'SUCCESS', DATETIME('now', '-3 hours'));

-- Failure Injections Config
INSERT INTO failure_injections (id, target_stage, is_active, reason) VALUES
(1, 'NONE', 0, 'Normal execution flow.');
