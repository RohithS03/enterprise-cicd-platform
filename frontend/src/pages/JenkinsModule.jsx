import React, { useEffect, useState } from 'react';
import { Cpu, Terminal, FileCode } from 'lucide-react';
import { fetchJenkinsJobs } from '../services/api';

export default function JenkinsModule() {
  const [jobInfo, setJobInfo] = useState(null);

  useEffect(() => {
    loadJenkins();
  }, []);

  async function loadJenkins() {
    try {
      const res = await fetchJenkinsJobs();
      setJobInfo(res);
    } catch (err) {
      console.error(err);
    }
  }

  const sampleJenkinsfile = `pipeline {
    agent any
    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/enterprise/online-shopping.git'
            }
        }
        stage('Maven Build') {
            steps {
                sh 'mvn clean compile'
            }
        }
        stage('Unit Tests') {
            steps {
                sh 'mvn test'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQubeServer') {
                    sh 'mvn sonar:sonar'
                }
            }
        }
        stage('Package WAR') {
            steps {
                sh 'mvn package'
            }
        }
        stage('Nexus Publish') {
            steps {
                nexusArtifactUploader artifacts: [[artifactId: 'myweb', file: 'target/myweb.war', type: 'war']], repository: 'releases'
            }
        }
        stage('Tomcat Deployment') {
            steps {
                sh 'ssh tomcat@prod-server "cp /tmp/myweb.war /opt/tomcat/webapps/ && systemctl restart tomcat"'
            }
        }
    }
}`;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <Cpu className="w-6 h-6 text-sky-400" />
          Jenkins Automation Server & Declarative Pipeline
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Inspect Jenkinsfile declarative structure, stage execution steps, and live console output.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jenkinsfile Editor */}
        <div className="p-6 rounded-2xl glass-card space-y-3">
          <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <FileCode className="w-5 h-5 text-sky-400" />
            Declarative Jenkinsfile Configuration
          </h3>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300 overflow-x-auto leading-relaxed max-h-[460px]">
            {sampleJenkinsfile}
          </pre>
        </div>

        {/* Live Logs Stream */}
        <div className="p-6 rounded-2xl glass-card space-y-3">
          <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            Jenkins Console Output Stream
          </h3>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-y-auto max-h-[460px] space-y-2">
            {jobInfo?.logs && jobInfo.logs.length > 0 ? (
              jobInfo.logs.map((l) => (
                <div key={l.log_id} className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-sky-400 font-bold">{l.stage_name} [{l.status}]</div>
                  <div className="text-slate-200 mt-0.5">{l.log_output}</div>
                </div>
              ))
            ) : (
              <div className="text-slate-500 italic">No console logs recorded for current build.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
