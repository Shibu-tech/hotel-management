import React, { useState, useMemo } from 'react';
import {
  AlertOctagon,
  Search,
  Filter,
  Plus,
  ShieldAlert,
  Clock,
  UserCheck,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  AlertTriangle,
  Send,
  Eye,
  FileCheck2,
  X
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import StatusBadge from '../../components/frontdesk/StatusBadge';
import CreateCaseModal from '../../components/frontdesk/CreateCaseModal';

export default function GuestCases() {
  const {
    complaints,
    recoveryRequests,
    assignComplaintOwner,
    updateComplaintStatus,
    escalateComplaint,
    frontDeskProfile
  } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Resolution Dialog State
  const [resolutionModalOpen, setResolutionModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');

  // Escalation Dialog State
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');

  const filteredCases = useMemo(() => {
    return complaints.filter((c) => {
      // Search
      const matchesSearch =
        !searchQuery.trim() ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.guestReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.owner.toLowerCase().includes(searchQuery.toLowerCase());

      // Status
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

      // Severity
      const matchesSeverity = severityFilter === 'ALL' || c.severity === severityFilter;

      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }, [complaints, searchQuery, statusFilter, severityFilter]);

  const handleOpenResolve = (c) => {
    setSelectedCase(c);
    setResolutionNote('');
    setResolutionModalOpen(true);
  };

  const handleExecuteResolve = (e) => {
    e.preventDefault();
    if (!selectedCase || !resolutionNote.trim()) return;
    updateComplaintStatus(selectedCase.id, 'Resolved', resolutionNote.trim());
    setResolutionModalOpen(false);
  };

  const handleOpenEscalate = (c) => {
    setSelectedCase(c);
    setEscalationReason('');
    setEscalateModalOpen(true);
  };

  const handleExecuteEscalate = (e) => {
    e.preventDefault();
    if (!selectedCase || !escalationReason.trim()) return;
    escalateComplaint(selectedCase.id, escalationReason.trim());
    setEscalateModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Guest Cases & Grievance Resolution
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
              {filteredCases.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Designated case ownership, response target SLAs, guest update logs, and service recovery approval routing.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Open New Case
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search cases by ID (CMP-801), guest, owner, issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
            >
              <option value="ALL">All Case Statuses</option>
              <option value="Open">Open</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Action in Progress">Action in Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalated</option>
            </select>
          </div>

          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
            >
              <option value="ALL">All Severities</option>
              <option value="critical">Critical / Executive</option>
              <option value="high">High Severity</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.length > 0 ? (
          filteredCases.map((c) => {
            // Find any linked service recovery request
            const linkedRecovery = recoveryRequests.find(
              (r) => r.complaintId === c.id || r.guestReference.includes(c.roomNumber)
            );

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-sm transition-all space-y-4"
              >
                {/* Case Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-black text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                        {c.id}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{c.category}</h3>
                      <StatusBadge type="priority" value={c.severity} size="xs" />
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        {c.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      <span className="font-bold text-slate-800">{c.guestReference}</span>
                      <span className="text-blue-700 font-semibold">{c.roomNumber}</span>
                      <span>Department: {c.department}</span>
                      <span>Open: {c.timeOpenDisplay || 'Recently'}</span>
                    </div>
                  </div>

                  {/* Case Ownership Badge */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-right">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                      Designated Case Owner
                    </span>
                    <span className="text-xs font-bold text-slate-900 flex items-center justify-end gap-1.5 mt-0.5">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      {c.owner}
                    </span>
                  </div>
                </div>

                {/* Next Action & SLA Target Countdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
                    <span className="font-bold text-blue-900 block flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      Commitment & Next Immediate Action:
                    </span>
                    <p className="text-blue-800 font-medium">
                      {c.nextAction || 'Investigating issue with department lead.'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 block flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                      SLA Target Deadlines:
                    </span>
                    <div className="text-[11px] text-slate-600 flex items-center justify-between">
                      <span>Response SLA: {c.responseDeadline ? new Date(c.responseDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Approaching'}</span>
                      <span>Resolution Target: {c.resolutionDeadline ? new Date(c.resolutionDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Within 4 Hours'}</span>
                    </div>
                  </div>
                </div>

                {/* Notes Separation: Internal vs Guest-Visible */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      Last Guest Update / Acknowledged Message:
                    </span>
                    <p className="text-slate-600 text-[11px] italic">
                      {c.lastGuestUpdate?.summary || c.guestVisibleNote || 'No public statement sent to guest yet.'}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block flex items-center justify-between">
                      <span>Internal Notes (Staff Only):</span>
                      <span className="text-[10px] text-slate-400">Protected</span>
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      {c.internalNotes || 'Internal investigation records.'}
                    </p>
                  </div>
                </div>

                {/* Linked Service Recovery Approval Card */}
                {linkedRecovery && (
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-amber-700 font-bold" />
                        <span className="font-bold text-amber-900">
                          Linked Service Recovery: {linkedRecovery.id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200/80 text-amber-900">
                          {linkedRecovery.status}
                        </span>
                      </div>
                      <p className="text-amber-800 text-[11px]">
                        Proposed Gesture: <strong>{linkedRecovery.proposedGesture}</strong> (${linkedRecovery.amount.toFixed(2)} USD). Reason: {linkedRecovery.reason}
                      </p>
                    </div>

                    <div className="text-[11px] text-amber-800/80 sm:text-right">
                      {linkedRecovery.status === 'Approved' ? (
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approved by Manager
                        </span>
                      ) : (
                        <span className="italic">
                          Awaiting Manager Authorization
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Bottom Actions Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="text-[11px] text-slate-500">
                    {c.history?.[0]?.action || 'Logged'} • {new Date(c.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    {c.status !== 'Resolved' && c.status !== 'Closed' && (
                      <button
                        onClick={() => handleOpenResolve(c)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-2xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolve Case
                      </button>
                    )}

                    {c.status !== 'Escalated' && (
                      <button
                        onClick={() => handleOpenEscalate(c)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Escalate to Manager
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs text-slate-500">
            <AlertOctagon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            No guest complaints or cases found matching current filters.
          </div>
        )}
      </div>

      {/* Modal: Open New Case */}
      <CreateCaseModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {/* Modal: Resolve Case */}
      {resolutionModalOpen && selectedCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Resolve Guest Case — {selectedCase.id}
              </h3>
              <button
                onClick={() => setResolutionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Record closure summary and resolution outcome for guest <strong>{selectedCase.guestReference}</strong>.
            </p>

            <form onSubmit={handleExecuteResolve} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resolution Notes & Guest Satisfaction Confirmation *
                </label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="e.g. Delivered fresh hypoallergenic bedding; guest confirmed satisfaction and accepted complimentary breakfast voucher."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResolutionModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Escalate Case */}
      {escalateModalOpen && selectedCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 text-rose-700 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Escalate Case — {selectedCase.id}
              </h3>
              <button
                onClick={() => setEscalateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Escalate case to <strong>Operations Manager Elena Rostova / General Manager Marcus Sterling</strong>.
            </p>

            <form onSubmit={handleExecuteEscalate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Escalation Justification *
                </label>
                <textarea
                  rows={3}
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  placeholder="e.g. VIP guest threatening cancellation of corporate account; compensation requested exceeds front desk authority."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEscalateModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700"
                >
                  Submit Escalation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
