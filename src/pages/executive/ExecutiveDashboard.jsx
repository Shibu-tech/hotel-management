import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Building2,
  ShieldAlert,
  ArrowRight,
  Filter,
  CheckSquare,
  BarChart3,
  RefreshCw,
  FileText,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function ExecutiveDashboard() {
  const {
    executiveKPIs,
    executiveProfile,
    tasks,
    complaints,
    securityIncidents,
    recoveryRequests,
    refundRequests,
    departmentBenchmarks,
    approveExecutiveRecovery,
    rejectExecutiveRecovery,
    approveExecutiveRefund,
    rejectExecutiveRefund
  } = useTasks();

  const [period, setPeriod] = useState('Today');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [approvalModalItem, setApprovalModalItem] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [modalAction, setModalAction] = useState('approve'); // 'approve', 'reject'

  // Filter serious/escalated items requiring Executive Attention
  const criticalIncidents = securityIncidents.filter(
    (inc) => (inc.severity === 'Emergency' || inc.severity === 'High') && inc.status !== 'Closed'
  );

  const escalatedComplaints = complaints.filter(
    (c) => (c.severity === 'critical' || c.severity === 'high' || c.status === 'Escalated') && c.status !== 'Resolved'
  );

  // Pending high-value approvals
  const pendingRecoveries = recoveryRequests.filter((r) => r.status === 'Pending Approval');
  const pendingRefunds = refundRequests.filter((r) => r.status === 'Pending Approval');
  const allPendingApprovals = [
    ...pendingRecoveries.map((r) => ({ ...r, itemType: 'Service Recovery', categoryLabel: r.requestType })),
    ...pendingRefunds.map((r) => ({ ...r, itemType: 'Guest Refund', categoryLabel: r.category, requestingEmployee: r.requester }))
  ];

  // Aggregated department performance data calculated from actual tasks & complaints
  const departmentsList = ['Housekeeping', 'Maintenance', 'Front Office', 'Food & Beverage', 'Guest Services', 'Security'];

  const departmentData = departmentsList.map((deptName) => {
    const deptTasks = tasks.filter((t) => {
      const cat = (t.category || '').toLowerCase();
      const loc = (t.location || '').toLowerCase();
      if (deptName === 'Housekeeping') return cat.includes('housekeeping') || cat.includes('linen') || cat.includes('cleaning');
      if (deptName === 'Maintenance') return cat.includes('maintenance') || cat.includes('repair') || cat.includes('facility');
      if (deptName === 'Front Office') return cat.includes('luggage') || cat.includes('check') || loc.includes('lobby');
      if (deptName === 'Food & Beverage') return cat.includes('room service') || cat.includes('dining') || cat.includes('beverage');
      if (deptName === 'Guest Services') return cat.includes('amenities') || cat.includes('bell');
      if (deptName === 'Security') return cat.includes('security') || cat.includes('safety') || cat.includes('patrol');
      return false;
    });

    const openCount = deptTasks.filter((t) => t.status !== 'Completed').length;
    const completedCount = deptTasks.filter((t) => t.status === 'Completed').length;
    const overdueCount = deptTasks.filter((t) => t.status !== 'Completed' && (t.isOverdue || t.priority === 'urgent')).length;
    const deptComplaints = complaints.filter((c) => (c.department || '').toLowerCase().includes(deptName.toLowerCase()) && c.status !== 'Resolved').length;

    const benchmark = departmentBenchmarks[deptName] || { targetSla: 92, taskVolumeTrend: '+3.5%', complaintTrend: '-5.0%' };
    const calculatedSla = completedCount + openCount > 0
      ? Math.max(78, Math.min(99, Math.round(100 - (overdueCount / Math.max(1, openCount + completedCount)) * 40)))
      : benchmark.targetSla;

    return {
      name: deptName,
      openTasks: openCount,
      completedTasks: completedCount,
      overdueTasks: overdueCount,
      slaPerformance: calculatedSla,
      openComplaints: deptComplaints,
      trend: benchmark.taskVolumeTrend,
      targetSla: benchmark.targetSla
    };
  });

  const filteredDepartments = selectedDeptFilter === 'ALL'
    ? departmentData
    : departmentData.filter((d) => d.name === selectedDeptFilter);

  const handleDecision = () => {
    if (!approvalModalItem) return;
    if (modalAction === 'approve') {
      if (approvalModalItem.itemType === 'Service Recovery') {
        approveExecutiveRecovery(approvalModalItem.id, 'Executive authorization signed off.');
      } else {
        approveExecutiveRefund(approvalModalItem.id, 'Executive authorization signed off.');
      }
    } else {
      if (approvalModalItem.itemType === 'Service Recovery') {
        rejectExecutiveRecovery(approvalModalItem.id, rejectReason || 'Declined under executive review.');
      } else {
        rejectExecutiveRefund(approvalModalItem.id, rejectReason || 'Declined under executive review.');
      }
    }
    setApprovalModalItem(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              Executive Overview
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Grand Azure Bay Resort & Conference Center
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Hotel-Wide Operational & Financial Oversight
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Welcome back, <span className="font-semibold text-slate-700">{executiveProfile.name}</span> • Delegated Executive Approval Limit: <span className="font-semibold text-emerald-600">$10,000.00 USD</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            {['Today', 'This Week', 'This Month', 'Q4 to Date'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  period === p
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Refreshed: <strong className="text-slate-700">{executiveKPIs.lastRefreshTime}</strong></span>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Tasks</span>
            <CheckSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{executiveKPIs.totalActiveTasks}</div>
          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">Live Operational</span> • Across 6 depts
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">SLA Compliance</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{executiveKPIs.slaComplianceRate}%</div>
          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Target: 92%</span> • <span className="text-emerald-600 font-semibold">+2.1% trend</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Overdue Tasks</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{executiveKPIs.overdueTasksCount}</div>
          <div className="text-[10px] text-slate-500 mt-1">
            Immediate dispatch attention
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Open Complaints</span>
            <AlertOctagon className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{executiveKPIs.openComplaintsCount}</div>
          <div className="text-[10px] text-slate-500 mt-1">
            {escalatedComplaints.length} flagged as high priority
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Serious Incidents</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-600">{executiveKPIs.activeSeriousIncidentsCount}</div>
          <div className="text-[10px] text-slate-500 mt-1">
            {criticalIncidents.length > 0 ? 'Requires executive review' : 'No active emergencies'}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Approvals</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-600">{executiveKPIs.pendingApprovalsCount}</div>
          <div className="text-[10px] text-slate-500 mt-1">
            Recoveries & Refunds queued
          </div>
        </div>
      </div>

      {/* Prominent Executive Attention Required Panel */}
      <div className="bg-gradient-to-br from-slate-900 to-[#172554] text-white rounded-2xl p-6 border border-slate-700/80 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/60 mb-5 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/90 text-white flex items-center justify-center font-bold shadow-md">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Executive Attention Required</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                  {criticalIncidents.length + escalatedComplaints.length + pendingRecoveries.filter(r => !r.isWithinManagerAuthority).length} Priority Items
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Serious security incidents, cross-department escalations, and compensation requests exceeding manager authority limits.
              </p>
            </div>
          </div>

          <Link
            to="/executive/escalations"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <span>Escalation Command Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Critical Security Incidents */}
          {criticalIncidents.slice(0, 2).map((inc) => (
            <div key={inc.id} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/30 text-red-200 border border-red-500/40">
                    {inc.severity} Severity
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{inc.id}</span>
                </div>
                <h3 className="font-bold text-sm text-white mb-1">{inc.title}</h3>
                <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                  {inc.summary || inc.description}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 space-y-1">
                  <div>Location: <strong className="text-slate-200">{inc.location}</strong></div>
                  <div>Owner: <strong className="text-slate-200">{inc.leadOfficer || 'Security Command'}</strong></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-[10px] text-amber-300 font-medium">Status: {inc.status}</span>
                <Link
                  to="/executive/escalations"
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
                >
                  Review Case <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}

          {/* High-Value / Exceeded Limit Recovery */}
          {pendingRecoveries.filter((r) => !r.isWithinManagerAuthority || r.isSelfRequestedByManager).slice(0, 2).map((rec) => (
            <div key={rec.id} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/30 text-amber-200 border border-amber-500/40">
                    Exceeds Manager Limit ($250)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{rec.id}</span>
                </div>
                <h3 className="font-bold text-sm text-white mb-1">
                  ${rec.amount.toFixed(2)} — {rec.requestType}
                </h3>
                <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                  Guest: {rec.guestReference} • {rec.reason}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 space-y-1">
                  <div>Requesting Staff: <strong className="text-slate-200">{rec.requestingEmployee?.name}</strong></div>
                  <div>Department: <strong className="text-slate-200">{rec.requestingEmployee?.role}</strong></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Awaiting Executive Authority</span>
                <button
                  type="button"
                  onClick={() => {
                    setApprovalModalItem({ ...rec, itemType: 'Service Recovery' });
                    setModalAction('approve');
                  }}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px]"
                >
                  Decision Case
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Performance Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Department Performance Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated operational throughput, SLA compliance rates, and open complaint volumes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Departments (6)</option>
                {departmentsList.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <Link
              to="/executive/departments"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Full Analytics →
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-3">Open Tasks</th>
                <th className="py-3 px-3">Completed</th>
                <th className="py-3 px-3">Overdue</th>
                <th className="py-3 px-3">SLA Compliance</th>
                <th className="py-3 px-3">Open Complaints</th>
                <th className="py-3 px-3">Volume Trend</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDepartments.map((dept) => {
                const isSlaHealthy = dept.slaPerformance >= dept.targetSla;
                return (
                  <tr key={dept.name} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>{dept.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{dept.openTasks}</td>
                    <td className="py-3 px-3 text-slate-700">{dept.completedTasks}</td>
                    <td className="py-3 px-3">
                      {dept.overdueTasks > 0 ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {dept.overdueTasks} overdue
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isSlaHealthy ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {dept.slaPerformance}%
                        </span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isSlaHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${dept.slaPerformance}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {dept.openComplaints > 0 ? (
                        <span className="font-bold text-rose-600">{dept.openComplaints}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">{dept.trend}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/executive/departments?dept=${encodeURIComponent(dept.name)}`}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-900"
                      >
                        Drill Down →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delegated Approval Centre Quick View */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Pending Executive Approvals ({allPendingApprovals.length})
            </h2>
            <p className="text-xs text-slate-500">
              High-tier compensation and financial refund requests requiring executive authorization.
            </p>
          </div>
          <Link
            to="/executive/approvals"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Open Approval Centre →
          </Link>
        </div>

        {allPendingApprovals.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            <span>All delegated executive approvals have been reviewed and decided.</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {allPendingApprovals.map((req) => (
              <div key={req.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                      {req.itemType}
                    </span>
                    <span className="font-bold text-slate-900">{req.id}</span>
                    <span className="text-slate-400">• Category: {req.categoryLabel}</span>
                  </div>
                  <div className="text-slate-600">
                    Requester: <strong className="text-slate-800">{req.requestingEmployee?.name || 'Frontline Staff'}</strong> • Guest: {req.guestReference || req.guestName || 'Registered Guest'}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 italic">
                    "{req.reason || 'Service recovery justification'}"
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900">${req.amount.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">Policy limit: $10,000</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setApprovalModalItem(req);
                        setModalAction('approve');
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setApprovalModalItem(req);
                        setModalAction('reject');
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Decision Modal */}
      {approvalModalItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {modalAction === 'approve' ? 'Authorize Approval' : 'Reject Request'}
              </h3>
              <span className="text-xs font-mono text-slate-400">{approvalModalItem.id}</span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 text-slate-600">
              <div>Type: <strong className="text-slate-800">{approvalModalItem.itemType}</strong></div>
              <div>Amount: <strong className="text-slate-900 text-sm font-bold">${approvalModalItem.amount.toFixed(2)}</strong></div>
              <div>Requester: <strong className="text-slate-800">{approvalModalItem.requestingEmployee?.name}</strong></div>
              <div>Reason: <span className="text-slate-700">{approvalModalItem.reason}</span></div>
            </div>

            {modalAction === 'reject' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rejection Rationale (Mandatory for Audit Trail)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="State the corporate policy reason for rejection..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  rows={3}
                />
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setApprovalModalItem(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDecision}
                className={`px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm ${
                  modalAction === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                Confirm {modalAction === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
