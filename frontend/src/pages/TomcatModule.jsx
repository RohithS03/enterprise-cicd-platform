import React, { useEffect, useState } from 'react';
import { Server, RotateCcw, CheckCircle2 } from 'lucide-react';
import { fetchTomcatDeployments, rollbackTomcat } from '../services/api';

export default function TomcatModule() {
  const [deployments, setDeployments] = useState([]);
  const [rollbackLog, setRollbackLog] = useState(null);

  useEffect(() => {
    loadTomcat();
  }, []);

  async function loadTomcat() {
    try {
      const res = await fetchTomcatDeployments();
      setDeployments(res.deployments || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRollback(env) {
    try {
      const res = await rollbackTomcat(env);
      setRollbackLog(res);
      await loadTomcat();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <Server className="w-6 h-6 text-purple-400" />
          Apache Tomcat Server Deployment & 1-Click Rollback Manager
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Deploys compiled WAR packages to target environments (DEV, TEST, PROD) with automated server restart and instant rollback capabilities.
        </p>
      </div>

      {rollbackLog && (
        <div className="p-5 rounded-2xl glass-card border border-amber-500/30 bg-amber-500/10 space-y-1 font-mono text-xs text-amber-300">
          <div className="font-bold flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            <span>Rollback Successful on {rollbackLog.environment} Server</span>
          </div>
          <div>Restored Artifact Version: <strong className="text-emerald-400">v{rollbackLog.restored_version}</strong></div>
        </div>
      )}

      {/* Target Server Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['DEV', 'TEST', 'PROD'].map((env) => {
          const envDep = deployments.find((d) => d.environment === env);
          return (
            <div key={env} className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400">Tomcat Node: {env}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ONLINE
                </span>
              </div>

              <h3 className="font-bold text-slate-100 text-base">{env} Server Environment</h3>

              <div className="space-y-1.5 text-xs font-mono text-slate-300">
                <div className="flex justify-between"><span>Current Version:</span> <strong className="text-emerald-400">v{envDep?.version || '1.0.1'}</strong></div>
                <div className="flex justify-between"><span>Artifact:</span> <span>{envDep?.artifact_name || 'myweb.war'}</span></div>
                <div className="flex justify-between"><span>Status:</span> <span className="text-emerald-400 font-bold">{envDep?.status || 'SUCCESS'}</span></div>
              </div>

              <button
                onClick={() => handleRollback(env)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Trigger 1-Click Rollback</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
