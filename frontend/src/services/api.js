const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function runPipeline(branch = 'main', commitHash = null) {
  const res = await fetch(`${API_BASE}/pipeline/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ branch, commit_hash: commitHash })
  });
  return res.json();
}

export async function injectFailure(targetStage = 'NONE') {
  const res = await fetch(`${API_BASE}/pipeline/inject-failure`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target_stage: targetStage })
  });
  return res.json();
}

export async function fetchPipelineHistory() {
  const res = await fetch(`${API_BASE}/pipeline/history`);
  return res.json();
}

export async function fetchCommits() {
  const res = await fetch(`${API_BASE}/git/commits`);
  return res.json();
}

export async function fetchJenkinsJobs() {
  const res = await fetch(`${API_BASE}/jenkins/jobs`);
  return res.json();
}

export async function fetchMavenBuilds() {
  const res = await fetch(`${API_BASE}/maven/builds`);
  return res.json();
}

export async function fetchSonarMetrics() {
  const res = await fetch(`${API_BASE}/sonarqube/metrics`);
  return res.json();
}

export async function fetchNexusArtifacts() {
  const res = await fetch(`${API_BASE}/nexus/artifacts`);
  return res.json();
}

export async function fetchTomcatDeployments() {
  const res = await fetch(`${API_BASE}/tomcat/deployments`);
  return res.json();
}

export async function rollbackTomcat(environment = 'TEST') {
  const res = await fetch(`${API_BASE}/tomcat/rollback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ environment })
  });
  return res.json();
}

export async function fetchDoraMetrics() {
  const res = await fetch(`${API_BASE}/analytics/dora`);
  return res.json();
}
