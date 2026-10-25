import React, { useState } from 'react';
import { Users, X, ShieldAlert, Radio, AlertTriangle } from 'lucide-react';
import { INCIDENT_SEVERITY } from '../../data/mockSecurityData';
import { useTasks } from '../../context/TaskContext';

export default function RequestBackupModal({ isOpen, onClose, defaultIncident = null }) {
  const { requestSecurityBackup, securityIncidents } = useTasks();

  const [incidentId, setIncidentId] = useState(defaultIncident?.id || securityIncidents[0]?.id || '');
  const [requestedSupport, setRequestedSupport] = useState('Secondary Certified Officer Standby');
  const [priority, setPriority] = useState(INCIDENT_SEVERITY.HIGH);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const currentInc = securityIncidents.find((i) => i.id === incidentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    requestSecurityBackup({
      incidentId: incidentId || null,
      incidentTitle: currentInc?.title || 'Security Incident Support',
      location: currentInc?.location || 'Hotel Grounds',
      requestedSupport,
      priority,
      reason: reason.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#172B4D] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Request Security Backup</h2>
              <p className="text-slate-300 text-xs">Dispatch Assistance via Radio CH 03</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Incident</label>
            <select
              value={incidentId}
              onChange={(e) => setIncidentId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-xs bg-white"
            >
              {securityIncidents.filter((i) => i.status !== 'Closed').map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.id} — {inc.title} ({inc.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Requested Support / Specialist Unit</label>
            <select
              value={requestedSupport}
              onChange={(e) => setRequestedSupport(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-xs bg-white"
            >
              <option value="Secondary Certified Officer Standby">Secondary Certified Officer Standby</option>
              <option value="Two-Officer Tactial Approach Unit">Two-Officer Tactical Approach Unit</option>
              <option value="CCTV Video Forensic Specialist & IT Security">CCTV Video Forensic Specialist & IT Security</option>
              <option value="Facilities Emergency Hazmat Technician">Facilities Emergency Hazmat Technician</option>
              <option value="Supervisor Escort & Lock Override Authority">Supervisor Escort & Lock Override Authority</option>
              <option value="Emergency Medical / CPR Certified Officer">Emergency Medical / CPR Certified Officer</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Priority Level</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPriority(INCIDENT_SEVERITY.EMERGENCY)}
                className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all ${
                  priority === INCIDENT_SEVERITY.EMERGENCY
                    ? 'bg-red-600 text-white border-red-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Emergency (Immediate)
              </button>
              <button
                type="button"
                onClick={() => setPriority(INCIDENT_SEVERITY.HIGH)}
                className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all ${
                  priority === INCIDENT_SEVERITY.HIGH
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                High (Urgent Standby)
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Reason & Tactical Justification *</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Hostile demeanor behind door, multi-subject altercation, or two-officer mandatory protocol."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-xs"
            />
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
            <span>Radio notification will ping on-duty officers on CH 03. Workflow: Requested → Acknowledged → Responding → Arrived.</span>
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
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-colors shadow-xs"
            >
              Dispatch Backup Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
