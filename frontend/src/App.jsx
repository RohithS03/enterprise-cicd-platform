import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import GitModule from './pages/GitModule';
import JenkinsModule from './pages/JenkinsModule';
import MavenModule from './pages/MavenModule';
import SonarQubeModule from './pages/SonarQubeModule';
import NexusModule from './pages/NexusModule';
import TomcatModule from './pages/TomcatModule';
import DoraMetrics from './pages/DoraMetrics';
import { fetchHealth } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [health, setHealth] = useState(null);

  useEffect(() => {
    async function loadHealth() {
      try {
        const res = await fetchHealth();
        setHealth(res);
      } catch (err) {
        console.error(err);
      }
    }
    loadHealth();
  }, []);

  return (
    <div className="min-h-screen flex dark bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar health={health} />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'git' && <GitModule setActiveTab={setActiveTab} />}
          {activeTab === 'jenkins' && <JenkinsModule />}
          {activeTab === 'maven' && <MavenModule />}
          {activeTab === 'sonarqube' && <SonarQubeModule />}
          {activeTab === 'nexus' && <NexusModule />}
          {activeTab === 'tomcat' && <TomcatModule />}
          {activeTab === 'dora' && <DoraMetrics />}
        </main>
      </div>
    </div>
  );
}
