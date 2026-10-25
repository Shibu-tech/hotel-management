import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Plus,
  UserCheck,
  UserX,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Send,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Building2,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import StatusBadge from '../../components/frontdesk/StatusBadge';
import CreateRequestModal from '../../components/frontdesk/CreateRequestModal';

export default function GuestRequests() {
  const {
    tasks,
    staff,
    assignTask,
    unassignTask,
    updateTask,
    recordGuestCommunication,
    escalateTask,
    frontDeskProfile
  } = useTasks();

  const [activeTab, setActiveTab] = useState('ALL'); // ALL, UNASSIGNED, ACTIVE, ESCALATED, COMPLETED
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Quick Action Dialogs inside component
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [newAssigneeId, setNewAssigneeId] = useState('');
  const [guestUpdateModalOpen, setGuestUpdateModalOpen] = useState(false);
  const [guestMessageText, setGuestMessageText] = useState('');
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Tab Filter
      if (activeTab === 'UNASSIGNED') {
        if (t.assignedTo && t.assignedTo.id) return false;
        if (t.status === 'Completed' || t.status === 'Cancelled') return false;
      } else if (activeTab === 'ACTIVE') {
        if (t.status === 'Completed' || t.status === 'Cancelled') return false;
      } else if (activeTab === 'ESCALATED') {
        if (!t.escalationInfo && t.priority !== 'Urgent' && t.priority !== 'Critical') return false;
      } else if (activeTab === 'COMPLETED') {
        if (t.status !== 'Completed') return false;
      }

      // Department Filter
      if (departmentFilter !== 'ALL' && t.category !== departmentFilter) {
        return false;
      }

      // Priority Filter
      if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = t.id.toLowerCase().includes(q);
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesLoc = t.location.toLowerCase().includes(q);
        const matchesAssignee = (t.assignedTo?.name || '').toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesLoc && !matchesAssignee) return false;
      }

      return true;
    });
  }, [tasks, activeTab, departmentFilter, priorityFilter, searchQuery]);

  const unassignedCount = tasks.filter(
    (t) => (!t.assignedTo || !t.assignedTo.id) && t.status !== 'Completed' && t.status !== 'Cancelled'
  ).length;

  const handleOpenAssign = (task) => {
    setSelectedTask(task);
    setNewAssigneeId(task.assignedTo?.id || '');
    setReassignModalOpen(true);
  };

  const handleExecuteAssign = (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    if (newAssigneeId) {
      assignTask(selectedTask.id, newAssigneeId);
    } else {
      unassignTask(selectedTask.id, 'Unassigned by Front Desk Coordinator');
    }
    setReassignModalOpen(false);
  };

  const handleOpenGuestUpdate = (task) => {
    setSelectedTask(task);
    setGuestMessageText('');
    setGuestUpdateModalOpen(true);
  };

  const handleExecuteGuestUpdate = (e) => {
    e.preventDefault();
    if (!selectedTask || !guestMessageText.trim()) return;
    recordGuestCommunication(selectedTask.id, guestMessageText.trim(), 'In-App Concierge');
    setGuestUpdateModalOpen(false);
  };

  const handleOpenEscalate = (task) => {
    setSelectedTask(task);
    setEscalationReason('');
    setEscalateModalOpen(true);
  };

  const handleExecuteEscalate = (e) => {
    e.preventDefault();
    if (!selectedTask || !escalationReason.trim()) return;
    escalateTask(selectedTask.id, escalationReason.trim(), 'Department Manager');
    setEscalateModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Guest Service Requests & Routing
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {tasks.length} Total Department Tasks
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Dispatch, track, and escalate requests across Housekeeping, Maintenance, Luggage, and Concierge with separate assignment status.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Guest Request
        </button>
      </div>

      {/* Tabs and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        {/* Workflow Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              activeTab === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Requests ({tasks.length})
          </button>

          <button
            onClick={() => setActiveTab('UNASSIGNED')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'UNASSIGNED'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            Unassigned Queue ({unassignedCount})
          </button>

          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              activeTab === 'ACTIVE'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            In Progress / Active
          </button>

          <button
            onClick={() => setActiveTab('ESCALATED')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap text-rose-700 hover:bg-rose-50 ${
              activeTab === 'ESCALATED' ? 'bg-rose-600 text-white shadow-xs' : ''
            }`}
          >
            Escalated / Urgent
          </button>

          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              activeTab === 'COMPLETED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Search & Department Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, summary, room, or staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
            >
              <option value="ALL">All Departments</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Maintenance">Maintenance & Engineering</option>
              <option value="Amenities">Amenities & Toiletries</option>
              <option value="Luggage & Bell">Luggage & Bell</option>
              <option value="Room Service">Room Service / F&B</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
            >
              <option value="ALL">All Priorities</option>
              <option value="Urgent">Urgent (SLA 30m)</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Queue Cards List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((t) => {
            const isUnassigned = !t.assignedTo || !t.assignedTo.id;

            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-sm transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {t.id}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{t.title}</h3>
                      <StatusBadge type="priority" value={t.priority} size="xs" />
                      {t.escalationInfo && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-rose-600" />
                          Escalated: {t.escalationInfo.escalatedTo}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        Location: {t.location}
                      </span>
                      <span>Department: <strong>{t.category}</strong></span>
                      <span>Created: {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>Deadline: {new Date(t.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Dual Status Tags: Assignment Status vs Execution Status */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Assignment State
                      </span>
                      {isUnassigned ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <UserX className="w-3.5 h-3.5 text-amber-600" />
                          Unassigned Queue
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          {t.assignedTo.name}
                        </span>
                      )}
                    </div>

                    <div className="text-right pl-3 border-l border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Work Status
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        {t.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instructions & Notes Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-700 block mb-0.5">
                      Fulfillment Instructions
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {t.instructions || t.title}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-700 block mb-0.5 flex items-center justify-between">
                      <span>Internal Notes (Staff Only)</span>
                      <span className="text-[10px] text-slate-400">Strictly Protected</span>
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {t.internalNotes || 'No internal remarks recorded.'}
                    </p>
                  </div>
                </div>

                {/* Guest Visible Message History */}
                {t.guestCommunicationHistory && t.guestCommunicationHistory.length > 0 && (
                  <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-xs space-y-1">
                    <span className="font-bold text-blue-900 block flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      Guest-Facing Communication History:
                    </span>
                    {t.guestCommunicationHistory.map((g, i) => (
                      <div key={i} className="text-blue-800 text-[11px] flex items-center justify-between">
                        <span>"{g.summary}"</span>
                        <span className="text-blue-600/70 text-[10px]">{g.actor} • {new Date(g.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Controls */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="text-[11px] text-slate-500">
                    Last update: {t.history?.[0]?.event || 'Created'} by {t.history?.[0]?.actor || 'Front Desk'}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAssign(t)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                      {isUnassigned ? 'Assign Staff' : 'Reassign'}
                    </button>

                    <button
                      onClick={() => handleOpenGuestUpdate(t)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Send Guest Update
                    </button>

                    <button
                      onClick={() => handleOpenEscalate(t)}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Escalate
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs text-slate-500">
            <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            No service requests found matching current filter criteria.
          </div>
        )}
      </div>

      {/* Modal: Create Request */}
      <CreateRequestModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {/* Inline Modal: Staff Assignment / Reassignment */}
      {reassignModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Assign Staff Runner — {selectedTask.id}
              </h3>
              <button
                onClick={() => setReassignModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Assign eligible staff member for <strong>{selectedTask.title}</strong> at <strong>{selectedTask.location}</strong>.
            </p>

            <form onSubmit={handleExecuteAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Responsible Staff Attendant
                </label>
                <select
                  value={newAssigneeId}
                  onChange={(e) => setNewAssigneeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                >
                  <option value="">-- Unassign (Return to Unassigned Queue) --</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.department} ({s.role}, {s.availability})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReassignModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inline Modal: Guest Update Message */}
      {guestUpdateModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Send Guest Update — {selectedTask.id}
              </h3>
              <button
                onClick={() => setGuestUpdateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Record a guest-visible message dispatched to room {selectedTask.location}.
            </p>

            <form onSubmit={handleExecuteGuestUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message Text
                </label>
                <textarea
                  rows={3}
                  value={guestMessageText}
                  onChange={(e) => setGuestMessageText(e.target.value)}
                  placeholder="e.g. Attendant Marcus Alvarez is on the way with requested items."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGuestUpdateModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700"
                >
                  Dispatch Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inline Modal: Escalate Request */}
      {escalateModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 text-rose-700 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Escalate Request — {selectedTask.id}
              </h3>
              <button
                onClick={() => setEscalateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Escalate overdue, urgent, or blocked request to <strong>Department Manager Elena Rostova</strong>.
            </p>

            <form onSubmit={handleExecuteEscalate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Escalation Reason *
                </label>
                <textarea
                  rows={3}
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  placeholder="e.g. 45-minute delay on VIP suite delivery; staff runner blocked; immediate supervisor intervention required."
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
                  Confirm Escalation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
