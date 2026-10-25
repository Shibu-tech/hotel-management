import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  DollarSign,
  FileSpreadsheet
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import Button from '../../components/ui/Button';
import { computeDepartmentSlaMetrics, getTaskSlaAnalysis } from '../../utils/slaCalculations';

export default function Reports() {
  const {
    tasks,
    complaints,
    recoveryRequests,
    staff,
    staffSchedules,
    slaConfig,
    managerProfile
  } = useTasks();

  const [dateRange, setDateRange] = useState('7d');
  const [reportType, setReportType] = useState('tasks'); // 'tasks', 'sla', 'complaints', 'staffing', 'recoveries'

  const slaMetrics = useMemo(() => computeDepartmentSlaMetrics(tasks, slaConfig), [tasks, slaConfig]);

  // CSV Export utility
  const handleExportCSV = () => {
    let headers = [];
    let rows = [];
    let filename = `stayops_report_${reportType}_${dateRange}.csv`;

    if (reportType === 'tasks') {
      headers = ['Task ID', 'Title', 'Category', 'Location', 'Priority', 'Status', 'Assignee', 'Created At', 'Due At', 'SLA State'];
      rows = tasks.map((t) => {
        const sla = getTaskSlaAnalysis(t, slaConfig);
        return [
          t.id,
          `"${t.title.replace(/"/g, '""')}"`,
          t.category,
          `"${t.location}"`,
          t.priority,
          t.status,
          `"${t.assignedTo?.name || 'Unassigned'}"`,
          t.createdAt,
          t.dueAt,
          sla.state
        ];
      });
    } else if (reportType === 'complaints') {
      headers = ['Case ID', 'Guest Reference', 'Category', 'Severity', 'Owner', 'Status', 'Created At', 'Response Deadline'];
      rows = complaints.map((c) => [
        c.id,
        `"${c.guestReference.replace(/"/g, '""')}"`,
        `"${c.category}"`,
        c.severity,
        `"${c.owner}"`,
        c.status,
        c.createdAt,
        c.responseDeadline
      ]);
    } else if (reportType === 'recoveries') {
      headers = ['Request ID', 'Guest Reference', 'Request Type', 'Amount (USD)', 'Status', 'Requester', 'Created At', 'Decided By'];
      rows = recoveryRequests.map((r) => [
        r.id,
        `"${r.guestReference.replace(/"/g, '""')}"`,
        `"${r.requestType}"`,
        r.amount.toFixed(2),
        r.status,
        `"${r.requestingEmployee?.name}"`,
        r.createdAt,
        `"${r.decidedBy || 'N/A'}"`
      ]);
    } else if (reportType === 'staffing') {
      headers = ['Employee ID', 'Name', 'Role', 'Department', 'Availability', 'Active Tasks', 'Overdue Tasks', 'Workload'];
      rows = staff.map((s) => [
        s.id,
        `"${s.name}"`,
        `"${s.role}"`,
        s.department,
        s.availability,
        s.activeTasksCount,
        s.overdueTasksCount,
        s.workloadStatus
      ]);
    } else {
      // SLA Report
      headers = ['Priority Target', 'Target Minutes', 'Current Compliance %', 'At Risk Count', 'Breach Count'];
      rows = [
        ['Urgent', slaConfig.urgentTargetMinutes, slaMetrics.slaComplianceRate || 85, slaMetrics.slaAtRiskCount, slaMetrics.slaBreachedCount],
        ['High', slaConfig.highTargetMinutes, slaMetrics.slaComplianceRate || 85, slaMetrics.slaAtRiskCount, slaMetrics.slaBreachedCount],
        ['Medium', slaConfig.mediumTargetMinutes, slaMetrics.slaComplianceRate || 85, slaMetrics.slaAtRiskCount, slaMetrics.slaBreachedCount],
        ['Low', slaConfig.lowTargetMinutes, slaMetrics.slaComplianceRate || 85, slaMetrics.slaAtRiskCount, slaMetrics.slaBreachedCount]
      ];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Department Operations Reports & Exports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Auditable management analytics and compliance reporting for {managerProfile.department}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs p-2 border border-slate-300 rounded-lg bg-white font-medium"
          >
            <option value="today">Period: Today</option>
            <option value="7d">Period: Last 7 Days</option>
            <option value="30d">Period: Last 30 Days</option>
            <option value="month">Period: This Month</option>
          </select>

          <Button
            size="sm"
            variant="primary"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Report Category Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'tasks', label: 'Task Volume & Completion', icon: BarChart3 },
          { id: 'sla', label: 'SLA Performance & Benchmarks', icon: Clock },
          { id: 'complaints', label: 'Complaint Resolution', icon: AlertTriangle },
          { id: 'staffing', label: 'Staffing Coverage & Workload', icon: Users },
          { id: 'recoveries', label: 'Service-Recovery Spend', icon: DollarSign }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all ${
                reportType === tab.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Summary KPI Banner based on Report Type */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-subtle text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px]">
            {reportType === 'tasks' ? 'Total Volume' : reportType === 'sla' ? 'Compliance Rate' : reportType === 'complaints' ? 'Total Cases' : reportType === 'staffing' ? 'Active Roster' : 'Total Requests'}
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {reportType === 'tasks' ? tasks.length : reportType === 'sla' ? `${slaMetrics.slaComplianceRate}%` : reportType === 'complaints' ? complaints.length : reportType === 'staffing' ? staff.length : recoveryRequests.length}
          </div>
          <span className="text-[11px] text-slate-500">Report sample</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-subtle text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px]">
            {reportType === 'tasks' ? 'Completed Work' : reportType === 'sla' ? 'SLA Breaches' : reportType === 'complaints' ? 'Resolved Cases' : reportType === 'staffing' ? 'On Duty' : 'Approved Total'}
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {reportType === 'tasks' ? slaMetrics.completedTasksCount : reportType === 'sla' ? slaMetrics.slaBreachedCount : reportType === 'complaints' ? complaints.filter(c => c.status === 'Resolved').length : reportType === 'staffing' ? staff.filter(s => s.availability !== 'Off Duty').length : `$${recoveryRequests.filter(r => r.status === 'Approved').reduce((s, r) => s + r.amount, 0).toFixed(0)}`}
          </div>
          <span className="text-[11px] text-slate-500">Fulfillment indicator</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-subtle text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px]">
            {reportType === 'tasks' ? 'Open Tasks' : reportType === 'sla' ? 'At Risk Tasks' : reportType === 'complaints' ? 'High Severity' : reportType === 'staffing' ? 'Available Staff' : 'Pending Approvals'}
          </span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {reportType === 'tasks' ? slaMetrics.openTasksCount : reportType === 'sla' ? slaMetrics.slaAtRiskCount : reportType === 'complaints' ? complaints.filter(c => c.severity === 'high' || c.severity === 'critical').length : reportType === 'staffing' ? staff.filter(s => s.availability === 'Available').length : recoveryRequests.filter(r => r.status === 'Pending Approval').length}
          </div>
          <span className="text-[11px] text-slate-500">Active monitoring</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-subtle text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Reporting Period</span>
          <div className="text-sm font-bold text-slate-800 mt-2 capitalize">
            {dateRange === '7d' ? 'Last 7 Days' : dateRange === '30d' ? 'Last 30 Days' : dateRange}
          </div>
          <span className="text-[11px] text-slate-400">Department Scope Only</span>
        </div>
      </div>

      {/* Underlying Records Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-slate-500" />
            <span>Underlying Reporting Records Table</span>
          </h2>
          <Button size="sm" variant="secondary" onClick={handleExportCSV} className="text-xs">
            <Download className="w-3.5 h-3.5 mr-1" />
            Download Spreadsheet (.CSV)
          </Button>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'tasks' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-4">Task ID</th>
                  <th className="py-2.5 px-4">Title</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Location</th>
                  <th className="py-2.5 px-4">Assignee</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">SLA State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.slice(0, 15).map((t) => {
                  const sla = getTaskSlaAnalysis(t, slaConfig);
                  return (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-slate-900">{t.id}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{t.title}</td>
                      <td className="py-2.5 px-4 text-slate-600">{t.category}</td>
                      <td className="py-2.5 px-4 text-slate-700">{t.location}</td>
                      <td className="py-2.5 px-4 text-slate-700">{t.assignedTo?.name || 'Unassigned'}</td>
                      <td className="py-2.5 px-4">{t.status}</td>
                      <td className="py-2.5 px-4 font-bold">{sla.state}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {reportType === 'complaints' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-4">Case ID</th>
                  <th className="py-2.5 px-4">Guest Reference</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Severity</th>
                  <th className="py-2.5 px-4">Case Owner</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">{c.id}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800">{c.guestReference}</td>
                    <td className="py-2.5 px-4 text-slate-700">{c.category}</td>
                    <td className="py-2.5 px-4 capitalize">{c.severity}</td>
                    <td className="py-2.5 px-4 text-slate-700">{c.owner}</td>
                    <td className="py-2.5 px-4">{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'recoveries' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-4">Request ID</th>
                  <th className="py-2.5 px-4">Proposed Compensation</th>
                  <th className="py-2.5 px-4">Guest Reference</th>
                  <th className="py-2.5 px-4">Requester</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recoveryRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">{r.id}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800">{r.proposedGesture}</td>
                    <td className="py-2.5 px-4 text-slate-700">{r.guestReference}</td>
                    <td className="py-2.5 px-4 text-slate-600">{r.requestingEmployee?.name}</td>
                    <td className="py-2.5 px-4 font-bold">${r.amount.toFixed(2)}</td>
                    <td className="py-2.5 px-4">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'staffing' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-4">Employee</th>
                  <th className="py-2.5 px-4">Department</th>
                  <th className="py-2.5 px-4">Availability</th>
                  <th className="py-2.5 px-4">Active Tasks</th>
                  <th className="py-2.5 px-4">Workload Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staff.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">{s.name} ({s.id})</td>
                    <td className="py-2.5 px-4 text-slate-700">{s.department}</td>
                    <td className="py-2.5 px-4">{s.availability}</td>
                    <td className="py-2.5 px-4 font-bold">{s.activeTasksCount}</td>
                    <td className="py-2.5 px-4">{s.workloadStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'sla' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-4">Priority Target</th>
                  <th className="py-2.5 px-4">Configured SLA Window</th>
                  <th className="py-2.5 px-4">Department Compliance Rate</th>
                  <th className="py-2.5 px-4">Active At Risk</th>
                  <th className="py-2.5 px-4">Active Breached</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-rose-700">Urgent Priority</td>
                  <td className="py-2.5 px-4 font-semibold">{slaConfig.urgentTargetMinutes} minutes</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-700">{slaMetrics.slaComplianceRate}%</td>
                  <td className="py-2.5 px-4 text-amber-700 font-bold">{slaMetrics.slaAtRiskCount}</td>
                  <td className="py-2.5 px-4 text-rose-700 font-bold">{slaMetrics.slaBreachedCount}</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-orange-700">High Priority</td>
                  <td className="py-2.5 px-4 font-semibold">{slaConfig.highTargetMinutes} minutes</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-700">{slaMetrics.slaComplianceRate}%</td>
                  <td className="py-2.5 px-4 text-amber-700 font-bold">{slaMetrics.slaAtRiskCount}</td>
                  <td className="py-2.5 px-4 text-rose-700 font-bold">{slaMetrics.slaBreachedCount}</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-blue-700">Medium Priority</td>
                  <td className="py-2.5 px-4 font-semibold">{slaConfig.mediumTargetMinutes} minutes</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-700">{slaMetrics.slaComplianceRate}%</td>
                  <td className="py-2.5 px-4 text-amber-700 font-bold">{slaMetrics.slaAtRiskCount}</td>
                  <td className="py-2.5 px-4 text-rose-700 font-bold">{slaMetrics.slaBreachedCount}</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700">Low Priority</td>
                  <td className="py-2.5 px-4 font-semibold">{slaConfig.lowTargetMinutes} minutes</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-700">{slaMetrics.slaComplianceRate}%</td>
                  <td className="py-2.5 px-4 text-amber-700 font-bold">{slaMetrics.slaAtRiskCount}</td>
                  <td className="py-2.5 px-4 text-rose-700 font-bold">{slaMetrics.slaBreachedCount}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
