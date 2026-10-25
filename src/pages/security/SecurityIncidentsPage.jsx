import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  Lock,
  ArrowUpRight,
  Users
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { INCIDENT_SEVERITY, INCIDENT_STATUS } from '../../data/mockSecurityData';
import SecurityIncidentModal from '../../components/security/SecurityIncidentModal';
import RequestBackupModal from '../../components/security/RequestBackupModal';
import EscalateIncidentModal from '../../components/security/EscalateIncidentModal';
import AddNoteModal from '../../components/security/AddNoteModal';
import CloseIncidentModal from '../../components/security/CloseIncidentModal';

export default function SecurityIncidentsPage() {
  const {
    securityIncidents,
    securityProfile,
    updateSecurityIncidentStatus
  } = useTasks();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [selectedIncidentForBackup, setSelectedIncidentForBackup] = useState(null);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [selectedIncidentForEscalate, setSelectedIncidentForEscalate] = useState(null);
  const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);
  const [selectedIncidentForNote, setSelectedIncidentForNote] = useState(null);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [selectedIncidentForClose, setSelectedIncidentForClose] = useState(null);

  const [scopeFilter, setScopeFilter] = useState('ALL'); // 'ALL' | 'MINE'
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [search, setSearch] = useState('');

  const filteredIncidents = securityIncidents.filter((inc) => {
    if (scopeFilter === 'MINE') {
      const isMine =
        inc.assignedTo?.id === securityProfile?.id ||
        (inc.assignedTo?.name && inc.assignedTo.name.includes(securityProfile?.name || 'Marcus Vance'));
      if (!isMine) return false;
    }

    if (severityFilter !== 'ALL' && inc.severity !== severityFilter) return false;

    if (statusFilter === 'ACTIVE' && inc.status === INCIDENT_STATUS.CLOSED) return false;
    if (statusFilter === 'CLOSED' && inc.status !== INCIDENT_STATUS.CLOSED) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        inc.id.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.location.toLowerCase().includes(q) ||
        inc.category.toLowerCase().includes(q)
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
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white">
              Incident Registry
            </span>
            <span className="text-slate-300 text-xs">Official StayOps Case Log</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Security Incidents & Investigations</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-xl">
            Authorized case files, responder dispatches, room lockout verifications, and on-scene resolution records.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Create Incident
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search case ID, title, room..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setScopeFilter('ALL')}
              className={`px-3 py-1 rounded-md transition-all ${
                scopeFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Cases
            </button>
            <button
              onClick={() => setScopeFilter('MINE')}
              className={`px-3 py-1 rounded-md transition-all ${
                scopeFilter === 'MINE' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Incidents
            </button>
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 font-medium bg-white focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value={INCIDENT_SEVERITY.EMERGENCY}>Emergency</option>
            <option value={INCIDENT_SEVERITY.HIGH}>High</option>
            <option value={INCIDENT_SEVERITY.MEDIUM}>Medium</option>
            <option value={INCIDENT_SEVERITY.LOW}>Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 font-medium bg-white focus:outline-none"
          >
            <option value="ACTIVE">Active Incidents Only</option>
            <option value="ALL">All (Active & Closed)</option>
            <option value="CLOSED">Closed Cases Only</option>
          </select>
        </div>

        <span className="text-slate-500 font-medium">
          {filteredIncidents.length} Incident{filteredIncidents.length === 1 ? '' : 's'} Listed
        </span>
      </div>

      {/* Incidents Grid */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-slate-500 border border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No security incidents matching current filters.</p>
            <p className="text-xs text-slate-400 mt-1">Change search parameters or view archived cases.</p>
          </div>
        ) : (
          filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs hover:border-slate-300 transition-all"
            >
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {inc.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {inc.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inc.severity === INCIDENT_SEVERITY.EMERGENCY
                        ? 'bg-red-600 text-white'
                        : inc.severity === INCIDENT_SEVERITY.HIGH
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    {inc.severity}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800">
                    {inc.status}
                  </span>
                  {inc.linkedBlocker && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-600" />
                      Locked: {inc.linkedBlocker}
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm">{inc.title}</h3>
                <p className="text-slate-600 leading-relaxed">{inc.description}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-[11px] pt-1">
                  <span><strong>Location:</strong> {inc.location}</span>
                  <span><strong>Reported:</strong> {new Date(inc.reportedAt).toLocaleTimeString()}</span>
                  <span><strong>Lead Responder:</strong> {inc.assignedTo?.name || 'Unassigned'}</span>
                  <span><strong>Target SLA:</strong> {inc.targetResponseMinutes}m</span>
                  {inc.actualResponseMinutes && (
                    <span className="text-emerald-700 font-semibold">
                      Actual: {inc.actualResponseMinutes}m
                    </span>
                  )}
                </div>

                {inc.nextAction && (
                  <p className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 font-medium">
                    <strong className="text-slate-900">Next Action:</strong> {inc.nextAction}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {inc.status === INCIDENT_STATUS.OPEN && (
                  <button
                    type="button"
                    onClick={() => updateSecurityIncidentStatus(inc.id, INCIDENT_STATUS.ACKNOWLEDGED)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    Acknowledge
                  </button>
                )}

                {inc.status === INCIDENT_STATUS.ACKNOWLEDGED && (
                  <button
                    type="button"
                    onClick={() => updateSecurityIncidentStatus(inc.id, INCIDENT_STATUS.RESPONDING)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    Start Response
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedIncidentForBackup(inc);
                    setBackupModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs"
                >
                  Backup
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedIncidentForEscalate(inc);
                    setEscalateModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-red-900 font-bold text-xs"
                >
                  Escalate
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedIncidentForNote(inc);
                    setAddNoteModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs"
                >
                  Add Note
                </button>

                {inc.status !== INCIDENT_STATUS.CLOSED && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIncidentForClose(inc);
                      setCloseModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs"
                  >
                    Close Case
                  </button>
                )}

                <Link
                  to={`/security/incidents/${inc.id}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                >
                  Dossier <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <SecurityIncidentModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <RequestBackupModal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
        defaultIncident={selectedIncidentForBackup}
      />

      <EscalateIncidentModal
        isOpen={escalateModalOpen}
        onClose={() => setEscalateModalOpen(false)}
        defaultIncident={selectedIncidentForEscalate}
      />

      <AddNoteModal
        isOpen={addNoteModalOpen}
        onClose={() => setAddNoteModalOpen(false)}
        incidentId={selectedIncidentForNote?.id}
      />

      <CloseIncidentModal
        isOpen={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        incident={selectedIncidentForClose}
      />
    </div>
  );
}
