import React, { useState } from 'react';
import { CheckCircle2, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function CloseIncidentModal({ isOpen, onClose, incident = null }) {
  const { closeSecurityIncident, securityProfile } = useTasks();
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [policeNotified, setPoliceNotified] = useState(false);

  if (!isOpen || !incident) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resolutionSummary.trim()) return;

    closeSecurityIncident(incident.id, {
      closedBy: `${securityProfile?.name || 'Marcus Vance'} (${securityProfile?.id || 'EMP-601'})`,
      resolutionSummary: resolutionSummary.trim(),
      policeNotified
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-emerald-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Authorized Incident Closure</h2>
              <p className="text-emerald-100 text-xs">Formally Seals Case File {incident.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-mono font-bold text-slate-800">{incident.id}</div>
            <div className="font-semibold text-slate-900 text-sm mt-0.5">{incident.title}</div>
            <div className="text-slate-500 text-[11px] mt-1">Location: {incident.location}</div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Final Resolution Summary *</label>
            <textarea
              required
              rows={4}
              value={resolutionSummary}
              onChange={(e) => setResolutionSummary(e.target.value)}
              placeholder="Detail final actions, guest interview outcomes, physical scene restoration, and concluding disposition..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="policeNotifiedCheck"
              checked={policeNotified}
              onChange={(e) => setPoliceNotified(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <label htmlFor="policeNotifiedCheck" className="font-medium text-slate-700 cursor-pointer text-xs">
              External Law Enforcement (Police) Dispatched or Sworn Report Filed
            </label>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Closure will archive this file to Incident History. All uploaded evidence and audit entries will remain permanently preserved.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs"
            >
              Authorize & Seal Closure
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
