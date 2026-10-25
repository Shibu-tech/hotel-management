import React, { useState } from 'react';
import { FileText, X, Clock } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function AddNoteModal({ isOpen, onClose, incidentId = null }) {
  const { addSecurityIncidentNote, securityIncidents } = useTasks();
  const [selectedIncidentId, setSelectedIncidentId] = useState(incidentId || securityIncidents[0]?.id || '');
  const [noteText, setNoteText] = useState('');

  if (!isOpen) return null;

  const currentInc = securityIncidents.find((i) => i.id === selectedIncidentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteText.trim() || !selectedIncidentId) return;

    addSecurityIncidentNote(selectedIncidentId, noteText.trim());
    setNoteText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#172B4D] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Add Incident Field Note</h2>
              <p className="text-slate-300 text-xs">Appended to immutable chronological record</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Incident</label>
            <select
              value={selectedIncidentId}
              onChange={(e) => setSelectedIncidentId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs bg-white"
            >
              {securityIncidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.id} — {inc.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Observation / Field Entry *</label>
            <textarea
              required
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g., Interviewed guest in Room 410. Subject stated loud thumping occurred around 22:15. No signs of forced entry."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs"
            />
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-[11px] flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Timestamp will be recorded automatically under Marcus Vance (EMP-601).</span>
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
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-xs"
            >
              Append Field Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
