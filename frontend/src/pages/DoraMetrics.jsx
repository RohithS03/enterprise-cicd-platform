import React, { useEffect, useState } from 'react';
import { BarChart2, Zap, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { fetchDoraMetrics } from '../services/api';

export default function DoraMetrics() {
  const [dora, setDora] = useState(null);

  useEffect(() => {
    loadDora();
  }, []);

  async function loadDora() {
    try {
      const res = await fetchDoraMetrics();
      setDora(res);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-sky-400" />
          DORA Four Key DevOps Research & Assessment Metrics
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Industry benchmark metrics evaluating software delivery velocity, stability, and pipeline efficiency.
        </p>
      </div>

      {dora && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl glass-card border border-emerald-500/20 bg-emerald-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">Deployment Frequency</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">{dora.deployment_frequency_rating}</span>
            </div>
            <div className="text-2xl font-black text-slate-100">{dora.deployment_frequency}</div>
            <div className="text-xs text-slate-500">Target: On-Demand</div>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-sky-500/20 bg-sky-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">Lead Time for Changes</span>
              <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[10px] font-bold">{dora.lead_time_rating}</span>
            </div>
            <div className="text-2xl font-black text-slate-100">{dora.lead_time_for_changes}</div>
            <div className="text-xs text-slate-500">Target: &lt; 1 Hour</div>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-indigo-500/20 bg-indigo-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">Mean Time to Recovery</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">{dora.mttr_rating}</span>
            </div>
            <div className="text-2xl font-black text-slate-100">{dora.mean_time_to_recovery_mttr}</div>
            <div className="text-xs text-slate-500">Target: &lt; 1 Hour</div>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-purple-500/20 bg-purple-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">Change Failure Rate</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-bold">{dora.cfr_rating}</span>
            </div>
            <div className="text-2xl font-black text-slate-100">{dora.change_failure_rate}</div>
            <div className="text-xs text-slate-500">Target: 0-15%</div>
          </div>
        </div>
      )}
    </div>
  );
}
