import React, { useEffect, useState } from 'react';
import { Box, CheckCircle2, FileText } from 'lucide-react';
import { fetchMavenBuilds } from '../services/api';

export default function MavenModule() {
  const [mavenInfo, setMavenInfo] = useState(null);

  useEffect(() => {
    loadMaven();
  }, []);

  async function loadMaven() {
    try {
      const res = await fetchMavenBuilds();
      setMavenInfo(res);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <Box className="w-6 h-6 text-sky-400" />
          Apache Maven Build & Package Manager
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Executes lifecycle phases: clean $\to$ compile $\to$ test $\to$ package generating deployable Java WAR artifacts.
        </p>
      </div>

      {mavenInfo && (
        <div className="p-6 rounded-2xl glass-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-slate-400">{mavenInfo.group_id}:{mavenInfo.artifact_id}</span>
              <h3 className="font-bold text-slate-100 text-base">Target Artifact: {mavenInfo.target_artifact}</h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {mavenInfo.build_status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-slate-400">Packaging Type</div>
              <div className="text-sm font-bold font-mono text-sky-400">WAR (Web Application Archive)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-slate-400">Compiler Target</div>
              <div className="text-sm font-bold font-mono text-slate-200">Java 17 (LTS)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-slate-400">JUnit Unit Tests</div>
              <div className="text-sm font-bold font-mono text-emerald-400">18 / 18 PASSED</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
