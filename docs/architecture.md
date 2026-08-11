# Enterprise CI/CD Platform Architecture

```
+-------------------------------------------------------------+
|              React + Vite DevOps Dashboard                  |
|   (Pipeline Visualizer, Git, Sonar, Nexus, Tomcat UI)       |
+------------------------------+------------------------------+
                               | REST API (JSON)
                               v
+-------------------------------------------------------------+
|                     Flask Backend Engine                    |
|   - 7-Stage Pipeline Animator                               |
|   - Maven Packaging & SonarQube Quality Evaluator           |
|   - Nexus Repository Publisher                              |
|   - Tomcat Deployment & Rollback Engine                     |
|   - DORA Metrics Generator                                  |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                   SQLite Relational Database                |
| (commits, pipeline_runs, stage_logs, artifacts, deployments)|
+-------------------------------------------------------------+
```
