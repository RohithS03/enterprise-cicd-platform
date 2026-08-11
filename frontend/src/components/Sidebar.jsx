import React from 'react';
import { LayoutDashboard, GitBranch, Cpu, Box, ShieldCheck, Database, Server, BarChart2 } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'DevOps Dashboard', icon: LayoutDashboard },
    { id: 'git', label: 'Git Repository', icon: GitBranch },
    { id: 'jenkins', label: 'Jenkins Pipeline', icon: Cpu },
    { id: 'maven', label: 'Maven Build', icon: Box },
    { id: 'sonarqube', label: 'SonarQube Quality', icon: ShieldCheck },
    { id: 'nexus', label: 'Nexus Repository', icon: Database },
    { id: 'tomcat', label: 'Tomcat Deployments', icon: Server },
    { id: 'dora', label: 'DORA DevOps Metrics', icon: BarChart2 },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-20">
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 font-bold text-lg font-mono">
            CI
          </div>
          <div>
            <h1 className="font-bold text-slate-100 tracking-tight text-base leading-none">Enterprise CI/CD</h1>
            <span className="text-xs text-sky-400 font-semibold">DevOps Control Center</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 m-4 bg-slate-950/60 border border-slate-800/80 rounded-xl text-center">
        <div className="text-xs font-bold text-slate-300">Toolchain Integrated</div>
        <div className="text-[11px] text-slate-500 mt-0.5">Git • Jenkins • Sonar • Nexus • Tomcat</div>
      </div>
    </aside>
  );
}
