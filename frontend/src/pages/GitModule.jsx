import React, { useEffect, useState } from 'react';
import { GitBranch, GitCommit, Play } from 'lucide-react';
import { fetchCommits, runPipeline } from '../services/api';

export default function GitModule({ setActiveTab }) {
  const [commits, setCommits] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('main');

  useEffect(() => {
    loadCommits();
  }, []);

  async function loadCommits() {
    try {
      const res = await fetchCommits();
      setCommits(res.commits || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleTrigger(commitHash) {
    try {
      await runPipeline(selectedBranch, commitHash);
      setActiveTab('dashboard');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-sky-400" />
          Git Version Control & Webhook Triggers
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Inspect source branches, recent commits, author signatures, and simulate Git Push webhook events.
        </p>
      </div>

      {/* Branch Selector */}
      <div className="p-4 rounded-2xl glass-card flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Branch:</span>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-sky-400 focus:outline-none focus:border-sky-500"
        >
          <option value="main">main (Production Release)</option>
          <option value="feature/payment-api">feature/payment-api (Active Feature)</option>
          <option value="release/v1.2">release/v1.2 (Release Candidate)</option>
        </select>
      </div>

      {/* Commits List */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-100 text-base">Recent Commit History ({commits.length})</h3>
        <div className="space-y-3">
          {commits.map((c) => (
            <div key={c.commit_id} className="p-5 rounded-2xl glass-card border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-400">{c.commit_hash.slice(0, 8)}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">
                    {c.branch}
                  </span>
                </div>
                <h4 className="font-bold text-slate-100 text-sm">{c.message}</h4>
                <div className="text-xs text-slate-500">Committed by <strong className="text-slate-300">{c.author}</strong> on {c.committed_at}</div>
              </div>

              <button
                onClick={() => handleTrigger(c.commit_hash)}
                className="px-4 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-bold border border-sky-500/20 flex items-center gap-2 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Trigger Git Webhook</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
