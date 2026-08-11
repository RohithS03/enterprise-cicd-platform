import React, { useEffect, useState } from 'react';
import { GitBranch, Cpu, Box, ShieldCheck, Database, Server, AlertTriangle, RefreshCw } from 'lucide-react';
import { runPipeline, fetchPipelineHistory, injectFailure } from '../services/api';
import PipelineVisualizer from '../components/PipelineVisualizer';

export default function Dashboard({ setActiveTab }) {
  const [pipelineState, setPipelineState] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState([]);
  const [failureStage, setFailureStage] = useState('NONE');

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const res = await fetchPipelineHistory();
      setHistory(res.runs || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRunPipeline() {
    setIsRunning(true);
    setPipelineState(null);
    try {
      const res = await runPipeline('main');
      setPipelineState(res);
      await loadHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  }

  async function handleFailureInject(stage) {
    setFailureStage(stage);
    try {
      await injectFailure(stage);
    } catch (err) {
      console.error(err);
    }
  }

  const latestRun = history.length > 0 ? history[0] : null;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-slate-900/80 border border-sky-500/20 glass-card">
        <div className="max-w-3xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 inline-block mb-3">
            Enterprise DevOps Automation
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Enterprise CI/CD Pipeline Automation Platform
          </h1>
          <p className="text-slate-300 text-sm mt-3 leading-relaxed">
            Automated software delivery lifecycle integrating Git version control, Jenkins orchestration, Maven build packaging, JUnit testing, SonarQube quality gates, Nexus artifact distribution, and Tomcat server deployments.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Latest Build</div>
            <div className="text-2xl font-black text-slate-100 mt-1">Build #{latestRun?.build_number || 103}</div>
            <div className="text-xs text-slate-500 mt-0.5">Branch: {latestRun?.branch || 'main'}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-sky-400">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pipeline Status</div>
            <div className={`text-2xl font-black mt-1 ${latestRun?.status === 'SUCCESS' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {latestRun?.status || 'SUCCESS'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Duration: {latestRun?.duration_sec || 42}s</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quality Gate</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">PASSED</div>
            <div className="text-xs text-slate-500 mt-0.5">SonarQube Rating: A</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-indigo-400">
            <Box className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tomcat Deploy</div>
            <div className="text-2xl font-black text-sky-400 mt-1">v1.2.0 WAR</div>
            <div className="text-xs text-slate-500 mt-0.5">Environment: PROD</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-purple-400">
            <Server className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Animated Pipeline Visualizer Section */}
      <div className="p-6 rounded-2xl glass-card">
        <PipelineVisualizer
          stages={pipelineState?.stage_results}
          isRunning={isRunning}
          onRunPipeline={handleRunPipeline}
        />
      </div>

      {/* Failure Injection Controls */}
      <div className="p-6 rounded-2xl glass-card space-y-3">
        <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          DevOps Failure Injection Matrix (Simulate Stage Faults)
        </h3>
        <p className="text-xs text-slate-400">
          Select a stage to intentionally force execution failure and observe automated pipeline halting and rollback behavior.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { label: 'Normal Flow (NONE)', code: 'NONE' },
            { label: 'Fail Maven Build', code: 'maven_build' },
            { label: 'Fail Unit Tests', code: 'unit_tests' },
            { label: 'Fail SonarQube Gate', code: 'sonarqube_analysis' },
            { label: 'Fail Tomcat Deploy', code: 'tomcat_deploy' },
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => handleFailureInject(item.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                failureStage === item.code
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
