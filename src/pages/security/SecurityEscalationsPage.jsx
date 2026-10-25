import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ShieldAlert,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Phone
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { INCIDENT_SEVERITY } from '../../data/mockSecurityData';
import EscalateIncidentModal from '../../components/security/EscalateIncidentModal';

export default function SecurityEscalationsPage() {
  const { securityEscalations } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredEscalations = securityEscalations.filter((esc) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        esc.id.toLowerCase().includes(q) ||
        esc.incidentId?.toLowerCase().includes(q) ||
        esc.incidentTitle?.toLowerCase().includes(q) ||
        esc.destinationRole?.toLowerCase().includes(q) ||
        esc.reason?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-[#172B4D] rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white">
              Command Escalation
            </span>
            <span className="text-slate-300 text-xs">Executive & Law Enforcement Escalation Chain</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Security Escalations Requiring Action</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-xl">
            Cases escalated to General Management, Corporate Legal Counsel, and Local Emergency Law Enforcement Dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Escalate Incident
          </button>
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
            placeholder="Search escalation ID, case, destination..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
          />
        </div>

        <span className="text-slate-500 font-medium">
          {filteredEscalations.length} Active Escalation{filteredEscalations.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Escalation Cards */}
      <div className="space-y-4">
        {filteredEscalations.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-slate-500 border border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No active escalations pending executive intervention.</p>
            <p className="text-xs text-slate-400 mt-1">Operational standards are within responder autonomy thresholds.</p>
          </div>
        ) : (
          filteredEscalations.map((esc) => (
            <div
              key={esc.id}
              className="bg-white rounded-xl border border-purple-200 shadow-2xs p-5 space-y-3 text-xs hover:border-purple-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-purple-950 bg-purple-100 px-2 py-0.5 rounded text-xs">
                    {esc.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-600 text-white">
                    {esc.destinationRole}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      esc.severity === INCIDENT_SEVERITY.EMERGENCY
                        ? 'bg-red-600 text-white'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {esc.severity}
                  </span>
                  {esc.acknowledged ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Acknowledged by {esc.acknowledgedBy}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded animate-pulse">
                      Awaiting Response
                    </span>
                  )}
                </div>

                <div className="text-slate-500 text-[11px] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  <span>SLA Response Target: <strong>{new Date(esc.responseDeadline).toLocaleTimeString()}</strong></span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {esc.incidentTitle} ({esc.incidentId})
                </h3>
                <p className="text-slate-700 leading-relaxed mt-1 font-medium bg-purple-50/50 p-2.5 rounded-lg border border-purple-100">
                  <strong>Reason:</strong> {esc.reason}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                <div>
                  <strong>Destination Contact:</strong> {esc.destinationContact}
                </div>
                <div>
                  <strong>Mandated Next Action:</strong> {esc.nextAction}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-purple-100">
                <span className="text-slate-400 text-[10px]">
                  Escalated at: {new Date(esc.escalatedAt).toLocaleString()} by {esc.currentOwner}
                </span>

                {esc.incidentId && (
                  <Link
                    to={`/security/incidents/${esc.incidentId}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1"
                  >
                    Open Case Dossier <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <EscalateIncidentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
