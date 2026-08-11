import React, { useEffect, useState } from 'react';
import { Database, Download, CheckCircle2 } from 'lucide-react';
import { fetchNexusArtifacts } from '../services/api';

export default function NexusModule() {
  const [artifacts, setArtifacts] = useState([]);

  useEffect(() => {
    loadNexus();
  }, []);

  async function loadNexus() {
    try {
      const res = await fetchNexusArtifacts();
      setArtifacts(res.artifacts || []);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <Database className="w-6 h-6 text-sky-400" />
          Sonatype Nexus Artifact Repository Manager
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Centralized binary repository publishing WAR packages, version tags, and SHA-1 checksum verifications.
        </p>
      </div>

      <div className="p-6 rounded-2xl glass-card space-y-4">
        <h3 className="font-bold text-slate-100 text-base">Published Application Binaries ({artifacts.length})</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Artifact Name</th>
                <th className="p-3">Version</th>
                <th className="p-3">Repository</th>
                <th className="p-3">SHA-1 Checksum</th>
                <th className="p-3">File Size</th>
                <th className="p-3">Uploaded At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {artifacts.map((a) => (
                <tr key={a.artifact_id} className="hover:bg-slate-900/60">
                  <td className="p-3 text-sky-400 font-bold">{a.name}</td>
                  <td className="p-3 text-emerald-400 font-bold">v{a.version}</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold">{a.repository}</span></td>
                  <td className="p-3 text-slate-400 truncate max-w-[200px]">{a.checksum_sha1}</td>
                  <td className="p-3 text-slate-300">{a.file_size_kb} KB</td>
                  <td className="p-3 text-slate-500">{a.uploaded_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
