import React from 'react';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export default function Navbar({ health }) {
  return (
    <header className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Pipeline Engine: {health?.pipeline_status || 'ONLINE'}</span>
        </span>
        <span className="text-xs text-slate-400 border-l border-slate-800 pl-3">
          Git: <strong className="text-emerald-400 font-mono">Connected</strong> | SonarQube: <strong className="text-emerald-400 font-mono">Passed</strong> | Nexus: <strong className="text-emerald-400 font-mono">Active</strong>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
          Cluster: Tomcat-Cluster-East
        </span>
      </div>
    </header>
  );
}
