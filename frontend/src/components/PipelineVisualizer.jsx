import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, SkipForward, Play } from 'lucide-react';

export default function PipelineVisualizer({ stages, isRunning, onRunPipeline }) {
  const [selectedStage, setSelectedStage] = useState(null);

  const defaultStages = [
    { stage: '1. Git Checkout', status: 'SUCCESS', log: 'Checkout completed successfully from origin/main.' },
    { stage: '2. Maven Build', status: 'SUCCESS', log: 'mvn clean compile - BUILD SUCCESS.' },
    { stage: '3. Unit Tests', status: 'SUCCESS', log: 'Running JUnit test suite... 18/18 Passed.' },
    { stage: '4. SonarQube Analysis', status: 'SUCCESS', log: 'SonarScanner completed. Quality Gate: PASSED.' },
    { stage: '5. Package WAR', status: 'SUCCESS', log: 'Packaging WAR artifact... myweb-1.0.4.war generated.' },
    { stage: '6. Nexus Publish', status: 'SUCCESS', log: 'Publishing WAR to Nexus releases repository.' },
    { stage: '7. Tomcat Deployment', status: 'SUCCESS', log: 'Deployed myweb.war to Tomcat webapps/ and restarted service.' },
  ];

  const activeStages = stages && stages.length > 0 ? stages : defaultStages;

  return (
    <div className="space-y-6">
      {/* Run Pipeline Header Button */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-100 text-base">Continuous Integration & Deployment Pipeline Flow</h3>
        <button
          onClick={onRunPipeline}
          disabled={isRunning}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-sky-500/20 hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          <span>{isRunning ? 'Running Pipeline Execution...' : 'RUN PIPELINE'}</span>
        </button>
      </div>

      {/* Pipeline Stage Nodes Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {activeStages.map((s, idx) => {
          let statusBg = 'bg-slate-950/80 border-slate-800 text-slate-400';
          let icon = <Clock className="w-4 h-4 text-slate-500" />;

          if (s.status === 'SUCCESS') {
            statusBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
          } else if (s.status === 'FAILED') {
            statusBg = 'bg-rose-500/10 border-rose-500/30 text-rose-400';
            icon = <XCircle className="w-4 h-4 text-rose-400" />;
          } else if (s.status === 'SKIPPED') {
            statusBg = 'bg-slate-900 border-slate-800 text-slate-500';
            icon = <SkipForward className="w-4 h-4 text-slate-500" />;
          } else if (s.status === 'RUNNING') {
            statusBg = 'bg-sky-500/10 border-sky-500/30 text-sky-400 animate-pulse';
            icon = <Clock className="w-4 h-4 text-sky-400 animate-spin" />;
          }

          return (
            <button
              key={idx}
              onClick={() => setSelectedStage(s)}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all hover:scale-105 ${statusBg}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase">{s.status}</span>
                {icon}
              </div>
              <div className="font-bold text-xs text-slate-100 truncate">{s.stage}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Console Log Drawer */}
      {selectedStage && (
        <div className="p-4 rounded-xl glass-card border border-sky-500/30 bg-sky-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase font-mono">Console Output: {selectedStage.stage}</span>
            <span className="text-[10px] font-mono text-slate-400">Status: {selectedStage.status}</span>
          </div>
          <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
            {selectedStage.log}
          </pre>
        </div>
      )}
    </div>
  );
}
