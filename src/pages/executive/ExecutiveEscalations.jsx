import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Building2,
  UserCheck,
  ArrowRight,
  Filter,
  CheckCircle2,
  FileText,
  Send,
  X,
  Eye,
  Info,
  Shield
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

function formatPersonName(person, fallback = 'Unassigned') {
  if (!person) return fallback;
  if (typeof person === 'string') return person;
  if (typeof person === 'object') {
    return person.name || person.label || person.id || fallback;
  }
  return String(person);
}

export default function ExecutiveEscalations() {
  const {
    securityIncidents,
    complaints,
    recoveryRequests,
    tasks,
    currentUser,
    executiveProfile,
    escalateExecutiveCase
  } = useTasks();

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [selectedCase, setSelectedCase] = useState(null);
  const [followupNote, setFollowupNote] = useState('');
  const [assignedLeader, setAssignedLeader] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Collect cross-module escalations safely
  const criticalIncidents = (securityIncidents || [])
    .filter((inc) => inc && inc.status !== 'Closed')
    .map((inc) => {
      const id = String(inc.id || 'INC-N/A');
      const title = typeof inc.title === 'string' ? inc.title : (typeof inc.description === 'string' ? inc.description : 'Security Incident');
      const severity = inc.severity || 'High';
      const department = 'Security Operations';
      const owner = formatPersonName(inc.assignedTo || inc.leadOfficer || inc.commander, 'Duty Security Officer');
      const timeOpen = inc.reportedAt || inc.createdAt || '2h ago';
      const escalationReason = severity === 'Emergency'
        ? 'Immediate Executive notification triggered by Emergency level'
        : 'Unresolved priority alert requiring command oversight';
      const nextRequiredAction = 'Command Briefing & Cross-department containment';
      const status = inc.status || 'Active';
      const location = inc.location || 'Resort Grounds';
      const details = typeof inc.description === 'string' ? inc.description : (inc.summary || 'Active incident flagged for operational leadership.');

      return {
        id,
        category: 'Security Incident',
        title,
        severity,
        department,
        owner,
        timeOpen,
        escalationReason,
        nextRequiredAction,
        status,
        location,
        details
      };
    });

  const criticalComplaints = (complaints || [])
    .filter((c) => c && c.status !== 'Resolved' && (c.severity === 'critical' || c.severity === 'high' || c.status === 'Escalated'))
    .map((c) => {
      const id = String(c.id || 'CMP-N/A');
      const title = typeof c.summary === 'string' ? c.summary : (typeof c.issue === 'string' ? c.issue : (typeof c.category === 'string' ? c.category : 'Guest Issue'));
      const severity = c.severity === 'critical' ? 'Emergency' : 'High';
      const department = c.department || 'Front Office';
      const owner = formatPersonName(c.owner || c.assignedTo, 'Duty Manager');
      const timeOpen = c.createdAt || c.timeOpenDisplay || '3h ago';
      const escalationReason = `Guest satisfaction risk exceeding threshold: room ${c.roomNumber || 'N/A'}`;
      const nextRequiredAction = 'Executive guest gesture or general manager consultation';
      const status = c.status || 'Open';
      const location = c.roomNumber ? `Room ${c.roomNumber}` : (c.guestReference || 'General');
      const details = typeof c.notes === 'string' ? c.notes : (typeof c.description === 'string' ? c.description : 'Guest complaint escalated from department manager queue.');

      return {
        id,
        category: 'Guest Complaint',
        title,
        severity,
        department,
        owner,
        timeOpen,
        escalationReason,
        nextRequiredAction,
        status,
        location,
        details
      };
    });

  const overdueRecoveries = (recoveryRequests || [])
    .filter((r) => r && (r.status === 'Pending Approval' || r.status === 'Pending' || r.status === 'Pending Executive Review') && (Number(r.amount || r.cost || 0) > 100))
    .map((r) => {
      const id = String(r.id || 'REC-N/A');
      const amountVal = Number(r.amount || r.cost || 0);
      const title = `${r.requestType || 'Compensation'} - $${amountVal.toFixed(2)}`;
      const severity = amountVal > 250 ? 'Emergency' : 'High';
      const department = r.department || 'Front Office';
      const owner = formatPersonName(r.requester || r.requestingEmployee || r.submittedBy, 'Front Desk Lead');
      const timeOpen = r.timestamp || r.createdAt || '4h ago';
      const escalationReason = 'Recovery amount exceeds Department Manager authority threshold ($100)';
      const nextRequiredAction = 'Executive delegated approval sign-off';
      const status = r.status || 'Pending Approval';
      const location = r.roomNumber ? `Room ${r.roomNumber}` : (r.guestReference || 'Front Desk');
      const details = typeof r.reason === 'string' ? r.reason : (typeof r.justification === 'string' ? r.justification : 'Service recovery authorization pending executive review.');

      return {
        id,
        category: 'Service Recovery',
        title,
        severity,
        department,
        owner,
        timeOpen,
        escalationReason,
        nextRequiredAction,
        status,
        location,
        details
      };
    });

  const blockedTasks = (tasks || [])
    .filter((t) => t && (t.isBlocked || (t.priority === 'urgent' && t.status !== 'Completed')))
    .slice(0, 5)
    .map((t) => {
      const id = String(t.id || 'TSK-N/A');
      const title = typeof t.title === 'string' ? t.title : 'Operational Work Order';
      const severity = t.priority === 'urgent' ? 'High' : 'Medium';
      const department = typeof t.category === 'string' ? t.category : 'Operations';
      const owner = formatPersonName(t.assignee || t.assignedTo, 'Unassigned');
      const timeOpen = t.createdAt || '6h ago';
      const escalationReason = t.blockerReason || 'Critical task execution delayed past target SLA';
      const nextRequiredAction = 'Cross-functional resource reallocation';
      const status = t.status || 'In Progress';
      const location = t.location || 'Facility';
      const details = typeof t.description === 'string' ? t.description : 'Inter-departmental dependency bottleneck.';

      return {
        id,
        category: 'Operational Blocker',
        title,
        severity,
        department,
        owner,
        timeOpen,
        escalationReason,
        nextRequiredAction,
        status,
        location,
        details
      };
    });

  const allEscalations = [
    ...criticalIncidents,
    ...criticalComplaints,
    ...overdueRecoveries,
    ...blockedTasks
  ];

  const filteredEscalations = allEscalations.filter((item) => {
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (severityFilter !== 'ALL' && item.severity !== severityFilter) return false;
    if (departmentFilter !== 'ALL' && !item.department.toLowerCase().includes(departmentFilter.toLowerCase())) return false;
    return true;
  });

  const handleEscalationAction = (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    const actorName = executiveProfile?.name || currentUser?.name || 'Victoria Montgomery';
    if (typeof escalateExecutiveCase === 'function') {
      escalateExecutiveCase(
        selectedCase.id,
        followupNote || 'Executive directive issued for immediate resolution.',
        assignedLeader || actorName
      );
    }
    setActionSuccess(`Executive directive recorded for ${selectedCase.id}. Notification dispatched.`);
    setTimeout(() => {
      setActionSuccess('');
      setSelectedCase(null);
      setFollowupNote('');
      setAssignedLeader('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-rose-100 text-rose-900 border border-rose-200">
              Executive Attention Required
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Real-Time Incident & Escalation Feed
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Hotel-Wide Escalations & Critical Cases
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-departmental blockers, high-severity complaints, security emergencies, and threshold-exceeded recoveries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-rose-50 border border-rose-200 rounded-xl text-center">
            <div className="text-xs font-semibold text-rose-700">Urgent Cases</div>
            <div className="text-xl font-black text-rose-900">{filteredEscalations.length}</div>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {actionSuccess}
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Categories ({allEscalations.length})</option>
            <option value="Security Incident">Security Incidents</option>
            <option value="Guest Complaint">Guest Complaints</option>
            <option value="Service Recovery">Service Recoveries</option>
            <option value="Operational Blocker">Operational Blockers</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Severities</option>
            <option value="Emergency">Emergency</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Departments</option>
            <option value="Security">Security</option>
            <option value="Front Office">Front Office</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Escalation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEscalations.map((item) => {
          const isEmergency = item.severity === 'Emergency';
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
                isEmergency ? 'border-rose-300 ring-1 ring-rose-200/60' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {item.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isEmergency
                          ? 'bg-rose-100 text-rose-700'
                          : item.severity === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {item.severity}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2 line-clamp-2">
                  {item.title}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Responsible Dept:</span>
                    <span className="font-semibold text-slate-800">{item.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Current Owner:</span>
                    <span className="font-medium text-slate-700">{item.owner}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-medium text-slate-700">{item.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Time Flagged:</span>
                    <span className="font-medium text-slate-700">{item.timeOpen}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700 mb-0.5">
                    Escalation Reason
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-2">{item.escalationReason}</p>
                </div>

                <div className="mb-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                    Next Required Action
                  </div>
                  <p className="text-xs font-medium text-indigo-700 line-clamp-2">{item.nextRequiredAction}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCase(item)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Review & Direct Escalation
              </button>
            </div>
          );
        })}
      </div>

      {filteredEscalations.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Active Escalations</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            All departments are operating within standard SLA limits and no critical incidents are currently flagged for Executive attention.
          </p>
        </div>
      )}

      {/* Review & Directive Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold">Executive Case Oversight: {selectedCase.id}</h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEscalationAction} className="p-6 space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-800 text-sm">{selectedCase.title}</div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>Category: <span className="font-semibold text-slate-800">{selectedCase.category}</span></div>
                  <div>Severity: <span className="font-bold text-rose-600">{selectedCase.severity}</span></div>
                  <div>Department: <span className="font-semibold text-slate-800">{selectedCase.department}</span></div>
                  <div>Location: <span className="font-semibold text-slate-800">{selectedCase.location}</span></div>
                </div>
                <div className="text-slate-600 pt-1 border-t border-slate-200">
                  <span className="font-semibold text-slate-700">Details: </span>
                  {selectedCase.details}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assign Follow-Up Responsibility (Optional)
                </label>
                <select
                  value={assignedLeader}
                  onChange={(e) => setAssignedLeader(e.target.value)}
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Maintain Current Assignee ({selectedCase.owner})</option>
                  <option value="Marcus Brody (Director of Operations)">Marcus Brody (Director of Operations)</option>
                  <option value="Elena Rostova (Guest Relations Lead)">Elena Rostova (Guest Relations Lead)</option>
                  <option value="Captain Dave Miller (Chief of Security)">Captain Dave Miller (Chief of Security)</option>
                  <option value="Sarah Jenkins (Controller)">Sarah Jenkins (Controller)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Executive Directive / Instructions
                </label>
                <textarea
                  required
                  rows={3}
                  value={followupNote}
                  onChange={(e) => setFollowupNote(e.target.value)}
                  placeholder="Enter authorized directive (e.g. Relocate guest to Penthouse suite, issue direct credit, or request priority dispatch)..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-start gap-2 text-[11px] text-amber-800">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Authorized executive directives are logged in the immutable audit trail and immediately notify the respective department head.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Issue Executive Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
