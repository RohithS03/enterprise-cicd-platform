import React, { useEffect, useState } from 'react';
import { ShieldCheck, Bug, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { fetchSonarMetrics } from '../services/api';

export default function SonarQubeModule() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    loadSonar();
  }, []);

  async function loadSonar() {
    try {
      const res = await fetchSonarMetrics();
      setMetrics(res);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          SonarQube Static Code Quality & Security Gate
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Static code analysis inspecting Bugs, Vulnerabilities, Code Smells, Security Ratings, and Quality Gate status.
        </p>
      </div>

      {metrics && (
        <div className="space-y-6">
          {/* Quality Gate Banner */}
          <div className="p-6 rounded-2xl glass-card border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-emerald-400 font-mono uppercase">Quality Gate Status</span>
                <h2 className="text-2xl font-black text-slate-100">{metrics.quality_gate}</h2>
              </div>
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Coverage: <strong className="text-emerald-400">{metrics.coverage_percent}%</strong> (Threshold &gt; 80%)
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl glass-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase">Bugs</span>
                <Bug className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-slate-100">{metrics.bugs}</div>
              <div className="text-xs text-slate-500">Rating: A</div>
            </div>

            <div className="p-5 rounded-2xl glass-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase">Vulnerabilities</span>
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-slate-100">{metrics.vulnerabilities}</div>
              <div className="text-xs text-slate-500">Rating: {metrics.security_rating}</div>
            </div>

            <div className="p-5 rounded-2xl glass-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase">Code Smells</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-slate-100">{metrics.code_smells}</div>
              <div className="text-xs text-slate-500">Debt: 15 mins</div>
            </div>

            <div className="p-5 rounded-2xl glass-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase">Reliability Rating</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400">{metrics.reliability_rating}</div>
              <div className="text-xs text-slate-500">Zero Critical Failures</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
