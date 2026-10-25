import React, { useState } from 'react';
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Plus,
  ShieldAlert,
  Radio,
  KeyRound,
  Video,
  HeartPulse,
  UserCheck
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function SecurityHandoverPage() {
  const {
    securityHandovers,
    createSecurityHandover,
    acknowledgeSecurityHandover,
    securityProfile
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [outgoingShift, setOutgoingShift] = useState('Night Shift (20:00 – 04:00)');
  const [incomingOfficer, setIncomingOfficer] = useState('Gabriel Thorne (EMP-607)');
  const [incomingShift, setIncomingShift] = useState('Graveyard Shift (04:00 – 12:00)');
  const [watchSummary, setWatchSummary] = useState('');
  const [unresolvedItemText, setUnresolvedItemText] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!watchSummary.trim()) return;

    createSecurityHandover({
      outgoingShift,
      incomingOfficer,
      incomingShift,
      watchSummary: watchSummary.trim(),
      unresolvedItems: unresolvedItemText
        ? unresolvedItemText.split('\n').filter((s) => s.trim())
        : ['Corridor lock checks nominal.', 'Perimeter gate checked.']
    });

    setWatchSummary('');
    setUnresolvedItemText('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-[#172B4D] rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white">
              Shift Operations
            </span>
            <span className="text-slate-300 text-xs">Security Watch Transfer Protocol</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Shift Handover & Watch Transfer</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-xl">
            Audit-sealed transition of security watch command, open incident dossiers, radio channels, and master emergency override keys.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Log Shift Handover
          </button>
        </div>
      </div>

      {/* Handovers List */}
      <div className="space-y-4">
        {securityHandovers.map((h) => {
          const isPending = h.status === 'Pending Acceptance';
          return (
            <div
              key={h.id}
              className={`bg-white rounded-xl border p-5 shadow-2xs space-y-4 text-xs transition-all ${
                isPending ? 'border-amber-300' : 'border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded text-xs">
                    {h.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isPending ? 'bg-amber-100 text-amber-900 animate-pulse' : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {h.status}
                  </span>
                </div>

                <div className="text-slate-400 text-[11px] flex items-center gap-2">
                  <span>Logged: <strong>{new Date(h.submittedAt).toLocaleTimeString()}</strong></span>
                  {h.acceptedAt && (
                    <span className="text-emerald-700">
                      • Accepted: <strong>{new Date(h.acceptedAt).toLocaleTimeString()}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Shift Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Relieving Officer (Outgoing)</span>
                  <span className="font-bold text-slate-800 text-xs">{h.outgoingOfficer}</span>
                  <span className="text-slate-500 block">{h.outgoingShift}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Assuming Officer (Incoming)</span>
                  <span className="font-bold text-slate-800 text-xs">{h.incomingOfficer}</span>
                  <span className="text-slate-500 block">{h.incomingShift}</span>
                </div>
              </div>

              {/* Watch Summary */}
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Watch Briefing Summary</h4>
                <p className="text-slate-600 leading-relaxed font-medium bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                  {h.watchSummary}
                </p>
              </div>

              {/* Unresolved Items */}
              <div>
                <h4 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  Carried-Over Open Tasks & Watch Concerns
                </h4>
                <ul className="space-y-1.5">
                  {(h.unresolvedItems || []).map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-slate-700 bg-white p-2 rounded border border-slate-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Equipment Verification Grid */}
              <div>
                <h4 className="font-bold text-slate-800 mb-1.5">Mandatory Equipment Accountability</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[9px]">Radio Handsets</span>
                      <strong className="text-slate-800">{h.equipmentChecklist?.radioHandsets || '8 / 8 Active'}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[9px]">Master Override Keys</span>
                      <strong className="text-slate-800">{h.equipmentChecklist?.masterKeys || '4 Secured'}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2">
                    <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[9px]">Body Cameras</span>
                      <strong className="text-slate-800">{h.equipmentChecklist?.bodyCameras || '6 Docked'}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[9px]">AED Defibrillator</span>
                      <strong className="text-slate-800">{h.equipmentChecklist?.firstAidDefibrillator || 'Tested Green'}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              {isPending && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">
                    Current responsibility remains with Officer Vance until recipient formally accepts.
                  </span>
                  <button
                    type="button"
                    onClick={() => acknowledgeSecurityHandover(h.id)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs"
                  >
                    Accept Watch Responsibility
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Log Handover Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col">
            <div className="bg-[#172B4D] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold">
                  <CalendarCheck2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white">Log Security Shift Handover</h2>
                  <p className="text-slate-300 text-xs">Official Watch Transfer Protocol</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Incoming Officer</label>
                  <input
                    type="text"
                    value={incomingOfficer}
                    onChange={(e) => setIncomingOfficer(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-medium text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Incoming Shift</label>
                  <input
                    type="text"
                    value={incomingShift}
                    onChange={(e) => setIncomingShift(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-medium text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Watch Briefing Summary *</label>
                <textarea
                  required
                  rows={3}
                  value={watchSummary}
                  onChange={(e) => setWatchSummary(e.target.value)}
                  placeholder="Detail high-risk guests, ongoing investigations, perimeter anomalies, and staff coordination..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Open Items to Track (1 per line)</label>
                <textarea
                  rows={3}
                  value={unresolvedItemText}
                  onChange={(e) => setUnresolvedItemText(e.target.value)}
                  placeholder="INC-801 active standby on 4th floor&#10;Service Lift B chemical barricade&#10;Radio terminal bay 2 charging"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Submit Handover Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
