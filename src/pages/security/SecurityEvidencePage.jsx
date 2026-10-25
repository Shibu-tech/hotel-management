import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  Upload,
  Lock,
  FileCheck2,
  FileText,
  Clock,
  ArrowRight,
  ShieldAlert,
  Hash,
  CheckCircle2
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function SecurityEvidencePage() {
  const { securityEvidence = [], securityIncidents = [], uploadSecurityEvidence } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Upload Form state
  const [incidentId, setIncidentId] = useState(securityIncidents[0]?.id || '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Photographic');
  const [fileType, setFileType] = useState('High-Resolution JPEG (4032 x 3024)');
  const [fileSize, setFileSize] = useState('4.8 MB');
  const [notes, setNotes] = useState('');

  const evidenceList = Array.isArray(securityEvidence) ? securityEvidence : [];
  const incidentsList = Array.isArray(securityIncidents) ? securityIncidents : [];

  const filteredEvidence = evidenceList.filter((ev) => {
    if (!ev) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (ev.id && ev.id.toLowerCase().includes(q)) ||
        (ev.title && ev.title.toLowerCase().includes(q)) ||
        (ev.incidentId && ev.incidentId.toLowerCase().includes(q)) ||
        (ev.category && ev.category.toLowerCase().includes(q)) ||
        (ev.notes && ev.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (typeof uploadSecurityEvidence === 'function') {
      uploadSecurityEvidence({
        incidentId: incidentId || null,
        title: title.trim(),
        category,
        fileType,
        fileSize,
        notes: notes.trim() || 'Tamper-evident evidence attached to case file.'
      });
    }

    setTitle('');
    setNotes('');
    setModalOpen(false);
  };

  const formatTimestamp = (ts) => {
    if (!ts) return 'Just now';
    try {
      const date = new Date(ts);
      return isNaN(date.getTime()) ? String(ts) : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return String(ts);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-[#172B4D] rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white">
              Digital Evidence Vault
            </span>
            <span className="text-slate-300 text-xs">Chain of Custody & Cryptographic Seal</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Evidence Management & Custody Records</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-xl">
            Tamper-evident evidentiary repository. Protected records are hashed with SHA-256 for legal integrity and cannot be overwritten.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Upload Evidence
          </button>
        </div>
      </div>

      {/* Security Protection Notice */}
      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200/90 text-xs text-amber-950 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Legal Evidence Chain of Custody Active</p>
          <p className="text-amber-800 text-[11px] mt-0.5">
            Under StayOps Security Compliance SOP-SEC-09, evidence files entered into this vault cannot be deleted, replaced, or purged by responders. Every access and export is permanently sealed in the audit log.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search evidence ID, case, notes..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        <span className="text-slate-500 font-medium">
          {filteredEvidence.length} Vault Artifact{filteredEvidence.length === 1 ? '' : 's'} Protected
        </span>
      </div>

      {/* Evidence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvidence.map((ev) => (
          <div
            key={ev.id}
            className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 flex flex-col justify-between gap-3 text-xs hover:border-slate-300 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {ev.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900">
                    {ev.category}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                  <Hash className="w-3 h-3" /> SHA-256 Sealed
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{ev.title}</h3>
                <p className="text-slate-600 text-[11px] mt-1">{ev.notes}</p>
              </div>

              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[10px] space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>File Format: <strong className="text-slate-700">{ev.fileType}</strong></span>
                  <span>Size: <strong className="text-slate-700">{ev.fileSize}</strong></span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Linked Case: <strong className="text-blue-600 font-mono">{ev.incidentId || 'Unlinked'}</strong></span>
                  <span>Uploaded By: <strong className="text-slate-700">{ev.uploadedBy}</strong></span>
                </div>
              </div>

              {/* Chain of Custody Steps */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Custody Trail
                </span>
                <div className="space-y-1">
                  {(ev.chainOfCustody || []).map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[10px] text-slate-600">
                      <span>• {step.action}</span>
                      <span className="text-slate-400 font-mono">{formatTimestamp(step.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Integrity Verified
              </span>

              {ev.incidentId && (
                <Link
                  to={`/security/incidents/${ev.incidentId}`}
                  className="font-bold text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
                >
                  View Incident Case <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredEvidence.length === 0 && (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">No Evidence Found</h4>
          <p className="text-xs text-slate-500 mt-1">No vault items match your query.</p>
        </div>
      )}

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col">
            <div className="bg-[#172B4D] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white">Upload Protected Evidence</h2>
                  <p className="text-slate-300 text-xs">Sealed with SHA-256 Checksum</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Security Incident</label>
                <select
                  value={incidentId}
                  onChange={(e) => setIncidentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-xs bg-white"
                >
                  {incidentsList.map((inc) => (
                    <option key={inc.id} value={inc.id}>
                      {inc.id} — {inc.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Evidence Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Audio decibel frequency telemetry"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
                  >
                    <option value="Photographic">Photographic</option>
                    <option value="CCTV Video">CCTV Video</option>
                    <option value="Audio Recording">Audio Recording</option>
                    <option value="Digital Telemetry">Digital Telemetry</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Simulated File Size</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chain of Custody Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Note camera angle, decibel spikes, witness names present..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  Encrypt & Vault Artifact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
