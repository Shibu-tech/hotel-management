import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldAlert,
  Plus,
  Search,
  Radio,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { BACKUP_STATUS, INCIDENT_SEVERITY } from '../../data/mockSecurityData';
import RequestBackupModal from '../../components/security/RequestBackupModal';

export default function SecurityBackupPage() {
  const {
    securityBackupRequests,
    updateBackupRequestStatus,
    securityIncidents
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredRequests = securityBackupRequests.filter((b) => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.id.toLowerCase().includes(q) ||
        b.incidentId?.toLowerCase().includes(q) ||
        b.incidentTitle?.toLowerCase().includes(q) ||
        b.location?.toLowerCase().includes(q) ||
        b.requestedSupport?.toLowerCase().includes(q)
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
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
              Tactical Support Grid
            </span>
            <span className="text-slate-300 text-xs">Radio Channel 03 Dispatches</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Security Backup Requests</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-xl">
            Live lifecycle monitoring for secondary officer backup, CCTV forensics assistance, and hazmat technician dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Request Backup
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
              placeholder="Search request ID, incident, location..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 font-medium bg-white focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value={BACKUP_STATUS.REQUESTED}>Requested</option>
            <option value={BACKUP_STATUS.ACKNOWLEDGED}>Acknowledged</option>
            <option value={BACKUP_STATUS.RESPONDING}>Responding</option>
            <option value={BACKUP_STATUS.ARRIVED}>Arrived/Assisting</option>
            <option value={BACKUP_STATUS.COMPLETED}>Completed</option>
          </select>
        </div>

        <span className="text-slate-500 font-medium">
          {filteredRequests.length} Request{filteredRequests.length === 1 ? '' : 's'} Active
        </span>
      </div>

      {/* Lifecycle Stage Cards */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-slate-500 border border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No active backup requests matching criteria.</p>
            <p className="text-xs text-slate-400 mt-1">All officers are currently on nominal patrol positions.</p>
          </div>
        ) : (
          filteredRequests.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-slate-300 transition-all"
            >
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {b.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                    {b.status}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.priority === INCIDENT_SEVERITY.EMERGENCY
                        ? 'bg-red-600 text-white'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {b.priority}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    Linked: <Link to={`/security/incidents/${b.incidentId}`} className="text-blue-600 hover:underline font-bold">{b.incidentId}</Link>
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm">{b.requestedSupport}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{b.reason}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-[11px] pt-1">
                  <span><strong>Location:</strong> {b.location}</span>
                  <span><strong>Requested By:</strong> {b.requestingOfficer}</span>
                  <span><strong>Assigned Officer:</strong> {b.assignedBackupOfficer || 'Awaiting Responder Pickup'}</span>
                  <span><strong>Time:</strong> {new Date(b.requestedAt).toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Lifecycle State Controls */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {b.status === BACKUP_STATUS.REQUESTED && (
                  <button
                    type="button"
                    onClick={() => updateBackupRequestStatus(b.id, BACKUP_STATUS.ACKNOWLEDGED)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
                  >
                    Acknowledge
                  </button>
                )}

                {b.status === BACKUP_STATUS.ACKNOWLEDGED && (
                  <button
                    type="button"
                    onClick={() => updateBackupRequestStatus(b.id, BACKUP_STATUS.RESPONDING)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    En Route
                  </button>
                )}

                {b.status === BACKUP_STATUS.RESPONDING && (
                  <button
                    type="button"
                    onClick={() => updateBackupRequestStatus(b.id, BACKUP_STATUS.ARRIVED)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Mark Arrived / Assisting
                  </button>
                )}

                {b.status === BACKUP_STATUS.ARRIVED && (
                  <button
                    type="button"
                    onClick={() => updateBackupRequestStatus(b.id, BACKUP_STATUS.COMPLETED)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                  >
                    Complete Assistance
                  </button>
                )}

                {b.incidentId && (
                  <Link
                    to={`/security/incidents/${b.incidentId}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1"
                  >
                    Case File <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <RequestBackupModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
