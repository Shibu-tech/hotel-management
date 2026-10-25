import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Eye,
  ArrowRight,
  ExternalLink,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import Button from '../../components/ui/Button';
import ComplaintDetailModal from '../../components/manager/ComplaintDetailModal';
import { COMPLAINT_STATUS, COMPLAINT_SEVERITY } from '../../data/mockManagerData';
import { formatDateTime } from '../../utils/taskStatus';

export default function ComplaintsRecovery() {
  const navigate = useNavigate();
  const { complaints, managerProfile } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Filtered complaints
  const filteredComplaints = complaints.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchGuest = c.guestReference.toLowerCase().includes(q);
      const matchCat = c.category.toLowerCase().includes(q);
      const matchOwner = c.owner.toLowerCase().includes(q);
      if (!matchId && !matchGuest && !matchCat && !matchOwner) return false;
    }
    if (severityFilter !== 'ALL' && c.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    return true;
  });

  const openCount = complaints.filter((c) => c.status !== COMPLAINT_STATUS.RESOLVED).length;
  const criticalCount = complaints.filter(
    (c) => c.severity === COMPLAINT_SEVERITY.CRITICAL && c.status !== COMPLAINT_STATUS.RESOLVED
  ).length;

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300 font-bold';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300 font-bold';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case COMPLAINT_STATUS.OPEN:
        return 'bg-blue-100 text-blue-800';
      case COMPLAINT_STATUS.ACTION_IN_PROGRESS:
        return 'bg-amber-100 text-amber-800';
      case COMPLAINT_STATUS.INVESTIGATING:
        return 'bg-purple-100 text-purple-800';
      case COMPLAINT_STATUS.RESOLVED:
        return 'bg-emerald-100 text-emerald-800';
      case COMPLAINT_STATUS.ESCALATED:
        return 'bg-red-100 text-red-800 font-bold';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Guest Complaints & Incident Coordination
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {openCount} Open Cases
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Departmental guest dispute resolution, case ownership delegation, response deadline monitoring, and emergency escalations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate('/manager/approvals')}
            className="flex items-center gap-1.5"
          >
            <span>Review Service Recoveries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 bg-red-50/80 border border-red-200 rounded-xl flex items-center justify-between gap-3 text-xs text-red-900 shadow-subtle">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <span className="font-bold">Safety & Security Escalation Protocol:</span>
            <p className="text-[11px] text-red-800 mt-0.5">
              Emergency incidents (e.g. hazardous fluid leaks, security disturbances, guest injuries) must be escalated immediately without waiting for standard SLA timers.
            </p>
          </div>
        </div>

        {criticalCount > 0 && (
          <span className="px-3 py-1 rounded-lg bg-red-600 text-white font-extrabold text-xs whitespace-nowrap animate-pulse">
            {criticalCount} Critical Active
          </span>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by case ID, guest reference, category, or owner..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg bg-white text-xs"
          >
            <option value="ALL">All Severities</option>
            <option value="critical">Critical / Emergency</option>
            <option value="high">High Severity</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg bg-white text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value={COMPLAINT_STATUS.OPEN}>Open</option>
            <option value={COMPLAINT_STATUS.INVESTIGATING}>Under Investigation</option>
            <option value={COMPLAINT_STATUS.ACTION_IN_PROGRESS}>Action in Progress</option>
            <option value={COMPLAINT_STATUS.RESOLVED}>Resolved</option>
            <option value={COMPLAINT_STATUS.ESCALATED}>Escalated</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Guest Reference</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Case Owner</th>
                <th className="py-3 px-4">Time Open</th>
                <th className="py-3 px-4">Response Deadline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No active guest complaints matching filters</p>
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {c.id}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 line-clamp-1 max-w-[200px]">
                        {c.guestReference}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Privacy Protected • No Raw Folio
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-700 max-w-[180px] truncate">
                      {c.category}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold ${getSeverityBadge(c.severity)}`}>
                        {c.severity}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-700 font-medium">
                      {c.owner}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-semibold">
                      {c.timeOpenDisplay}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-800">
                        {formatDateTime(c.responseDeadline)}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setSelectedComplaint(c)}
                        className="text-[11px] font-bold"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 inline" />
                        Oversee Case
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          isOpen={Boolean(selectedComplaint)}
          onClose={() => setSelectedComplaint(null)}
          complaint={selectedComplaint}
          onOpenTask={(taskId) => {
            setSelectedComplaint(null);
            navigate(`/manager/tasks?search=${taskId}`);
          }}
        />
      )}
    </div>
  );
}
