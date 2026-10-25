import React, { useState } from 'react';
import { ShieldAlert, X, AlertTriangle, Building2, User, Radio, FileText } from 'lucide-react';
import { INCIDENT_SEVERITY } from '../../data/mockSecurityData';
import { useTasks } from '../../context/TaskContext';

export default function SecurityIncidentModal({ isOpen, onClose, initialData = null }) {
  const { createSecurityIncident, blockers } = useTasks();

  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || 'Security Occurrence');
  const [severity, setSeverity] = useState(initialData?.severity || INCIDENT_SEVERITY.HIGH);
  const [location, setLocation] = useState(initialData?.location || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [initialNote, setInitialNote] = useState('');
  const [linkedBlocker, setLinkedBlocker] = useState(initialData?.linkedBlocker || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    createSecurityIncident({
      title: title.trim(),
      category,
      severity,
      location: location.trim(),
      description: description.trim(),
      initialNote: initialNote.trim(),
      linkedBlocker: linkedBlocker || null
    });

    onClose();
  };

  const safetyBlockers = (blockers || []).filter((b) => b.safetyRestricted || b.isSafetyRestricted);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#172B4D] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Create Security Incident</h2>
              <p className="text-slate-300 text-xs">Logged into StayOps Official Chain of Custody</p>
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
            <label className="block font-bold text-slate-700 mb-1">Incident Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Physical Altercation in North Bar Lounge"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-xs bg-white"
              >
                <option value="Duress Alarm">Duress Alarm</option>
                <option value="Perimeter Breach">Perimeter Breach</option>
                <option value="Keycard / Access Security">Keycard / Access Security</option>
                <option value="Fire / Smoke Alert">Fire / Smoke Alert</option>
                <option value="Safety Lockout">Safety Lockout</option>
                <option value="Domestic Disturbance">Domestic Disturbance</option>
                <option value="Trespass & Refusal">Trespass & Refusal</option>
                <option value="Theft / Asset Loss">Theft / Asset Loss</option>
                <option value="Medical Critical">Medical Critical</option>
                <option value="Security Occurrence">Security Occurrence</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Severity Tier</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-xs bg-white"
              >
                <option value={INCIDENT_SEVERITY.EMERGENCY}>Emergency (5m Response Target)</option>
                <option value={INCIDENT_SEVERITY.HIGH}>High Priority (10m Response)</option>
                <option value={INCIDENT_SEVERITY.MEDIUM}>Medium Priority (15m Response)</option>
                <option value={INCIDENT_SEVERITY.LOW}>Low Priority (30m Response)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Location Coordinates *</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Room 412 or Service Lift B Shaft"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-xs"
            />
          </div>

          {safetyBlockers.length > 0 && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Link to Department Safety Lockout (Optional)</label>
              <select
                value={linkedBlocker}
                onChange={(e) => setLinkedBlocker(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-xs bg-white"
              >
                <option value="">None (Independent Security Incident)</option>
                {safetyBlockers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} — {b.title || b.reason} ({b.location || 'Location'})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Incident Summary & Initial Findings</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide objective factual description of the incident..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">First Responder Initial Note (Optional)</label>
            <input
              type="text"
              value={initialNote}
              onChange={(e) => setInitialNote(e.target.value)}
              placeholder="e.g., Contacted concierge. Heading to 4th floor stairwell."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-xs"
            />
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
              Log Incident & Assign Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
