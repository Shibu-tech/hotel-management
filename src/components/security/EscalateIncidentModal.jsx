import React, { useState } from 'react';
import { ArrowUpRight, X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { INCIDENT_SEVERITY } from '../../data/mockSecurityData';
import { useTasks } from '../../context/TaskContext';

export default function EscalateIncidentModal({ isOpen, onClose, defaultIncident = null }) {
  const { escalateSecurityIncident, securityIncidents } = useTasks();

  const [incidentId, setIncidentId] = useState(defaultIncident?.id || securityIncidents[0]?.id || '');
  const [destinationRole, setDestinationRole] = useState('Hotel General Manager & Legal Counsel');
  const [destinationContact, setDestinationContact] = useState('Arthur Pendelton (GM x1001) / Legal Counsel');
  const [severity, setSeverity] = useState(INCIDENT_SEVERITY.HIGH);
  const [reason, setReason] = useState('');
  const [nextAction, setNextAction] = useState('Immediate executive guidance or law enforcement coordination.');

  if (!isOpen) return null;

  const currentInc = securityIncidents.find((i) => i.id === incidentId);

  const handleDestinationChange = (e) => {
    const role = e.target.value;
    setDestinationRole(role);
    if (role.includes('Law Enforcement')) {
      setDestinationContact('Metro Police Emergency 911 / Duty Captain (Precinct 4)');
      setSeverity(INCIDENT_SEVERITY.EMERGENCY);
    } else if (role.includes('General Manager')) {
      setDestinationContact('Arthur Pendelton (GM x1001) / Legal Duty Desk');
      setSeverity(INCIDENT_SEVERITY.HIGH);
    } else {
      setDestinationContact('Elena Rostova (Operations Manager x2001)');
      setSeverity(INCIDENT_SEVERITY.HIGH);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    escalateSecurityIncident({
      incidentId: incidentId || null,
      incidentTitle: currentInc?.title || 'Security Escalation',
      severity,
      reason: reason.trim(),
      destinationRole,
      destinationContact,
      nextAction: nextAction.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-red-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Escalate Security Incident</h2>
              <p className="text-red-200 text-xs">Awaiting Higher Authority Intervention</p>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Incident to Escalate</label>
            <select
              value={incidentId}
              onChange={(e) => setIncidentId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-xs bg-white"
            >
              {securityIncidents.filter((i) => i.status !== 'Closed').map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.id} — {inc.title} ({inc.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Escalation Destination</label>
            <select
              value={destinationRole}
              onChange={handleDestinationChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-xs bg-white"
            >
              <option value="Hotel General Manager & Legal Counsel">Hotel General Manager & Legal Counsel</option>
              <option value="Security Director & Local Law Enforcement Dispatch">Security Director & Local Law Enforcement Dispatch</option>
              <option value="Operations Duty Manager">Operations Duty Manager</option>
              <option value="Emergency Medical Services (EMS Dispatch)">Emergency Medical Services (EMS Dispatch)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Contact Reference / Hotline</label>
            <input
              type="text"
              value={destinationContact}
              onChange={(e) => setDestinationContact(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Reason for Escalation *</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Potential legal liability, high-value asset loss over $10k, armed threat, or subject refusal to cooperate."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Next Expected Action / Mandated Order</label>
            <input
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="e.g., File formal police complaint or authorize emergency master key entry."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-xs"
            />
          </div>

          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-900 text-[11px] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Escalation will notify management on-call phone and set a 30-minute SLA response deadline.</span>
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
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-xs"
            >
              Confirm Escalation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
