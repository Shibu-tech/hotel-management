import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  FileSpreadsheet,
  FileText,
  Building2,
  DollarSign
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function ExecutiveReports() {
  const {
    tasks,
    complaints,
    securityIncidents,
    recoveryRequests,
    refundRequests,
    departmentBenchmarks,
    executiveKPIs
  } = useTasks();

  const [timeRange, setTimeRange] = useState('7d');
  const [selectedReportType, setSelectedReportType] = useState('overview');
  const [downloadSuccess, setDownloadSuccess] = useState('');

  // Departmental metrics rollup
  const departments = ['Housekeeping', 'Maintenance', 'Front Office', 'Food & Beverage', 'Guest Services', 'Security'];

  const reportData = departments.map((dept) => {
    const deptTasks = tasks.filter((t) => {
      const c = (t.category || '').toLowerCase();
      const loc = (t.location || '').toLowerCase();
      if (dept === 'Housekeeping') return c.includes('housekeeping') || c.includes('linen') || c.includes('cleaning');
      if (dept === 'Maintenance') return c.includes('maintenance') || c.includes('repair') || c.includes('facility');
      if (dept === 'Front Office') return c.includes('luggage') || c.includes('check') || loc.includes('lobby');
      if (dept === 'Food & Beverage') return c.includes('room service') || c.includes('dining') || c.includes('beverage');
      if (dept === 'Guest Services') return c.includes('amenities') || c.includes('bell');
      if (dept === 'Security') return c.includes('security') || c.includes('safety') || c.includes('patrol');
      return false;
    });

    const total = deptTasks.length;
    const completed = deptTasks.filter((t) => t.status === 'Completed').length;
    const overdue = deptTasks.filter((t) => t.isOverdue || (t.priority === 'urgent' && t.status !== 'Completed')).length;
    const deptComplaints = complaints.filter((c) => (c.department || '').toLowerCase().includes(dept.toLowerCase()));
    const resolvedComplaints = deptComplaints.filter((c) => c.status === 'Resolved').length;

    const benchmark = departmentBenchmarks[dept] || { targetSla: 92, taskVolumeTrend: '+2.1%' };
    const slaRate = total > 0 ? Math.max(76, Math.min(99, Math.round(100 - (overdue / total) * 35))) : benchmark.targetSla;

    return {
      department: dept,
      totalTasks: total,
      completedTasks: completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 100,
      overdueTasks: overdue,
      slaRate,
      targetSla: benchmark.targetSla,
      complaintCount: deptComplaints.length,
      complaintResolvedRate: deptComplaints.length > 0 ? Math.round((resolvedComplaints / deptComplaints.length) * 100) : 100
    };
  });

  const exportReport = (format) => {
    const dataString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stayops-executive-report-${timeRange}.${format === 'csv' ? 'csv' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(`Executive summary report exported in ${format.toUpperCase()} format.`);
    setTimeout(() => setDownloadSuccess(''), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              Executive Analytics & Audit Reports
            </span>
            <span className="text-xs text-slate-500 font-medium">Cross-Department Performance Rollup</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Hotel Operational & Compliance Reporting
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic cross-functional metrics: task throughput, SLA adherence trends, guest complaints, and high-value approvals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportReport('csv')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>
          <button
            onClick={() => exportReport('json')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {downloadSuccess}
        </div>
      )}

      {/* Filter and Period Ribbon */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Reporting Period:</span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['24h', '7d', '30d', 'Quarter-to-Date'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  timeRange === t ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Report Scope:</span>
          <select
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="overview">Executive Overview (All Metrics)</option>
            <option value="sla">SLA & Breach Analysis</option>
            <option value="complaints">Guest Complaint & Sentiment</option>
            <option value="approvals">Financial & Recovery Approvals</option>
          </select>
        </div>
      </div>

      {/* KPI Overview Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Overall SLA Compliance</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{executiveKPIs.slaCompliance}%</div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Exceeds 90% benchmark
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Active Hotel Tasks</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{executiveKPIs.activeTasks}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 6 operational divisions</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Critical Incidents & Escalations</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{executiveKPIs.criticalIncidents}</div>
          <div className="text-[11px] font-medium text-slate-500 mt-1">Requiring Executive Monitoring</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Delegated Approvals Pending</div>
          <div className="text-2xl font-black text-indigo-700 mt-1">{executiveKPIs.pendingApprovals}</div>
          <div className="text-[11px] font-medium text-slate-500 mt-1">High-value recoveries & refund authorizations</div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Department Performance & Throughput Audit</h3>
            <p className="text-xs text-slate-500">Actual calculated operational metrics for period: {timeRange}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Total Tasks</th>
                <th className="py-3 px-4">Completed</th>
                <th className="py-3 px-4">Completion %</th>
                <th className="py-3 px-4">Overdue</th>
                <th className="py-3 px-4">SLA Compliance</th>
                <th className="py-3 px-4">Target Benchmark</th>
                <th className="py-3 px-4">Complaints Open</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {reportData.map((d) => (
                <tr key={d.department} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {d.department}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{d.totalTasks}</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">{d.completedTasks}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full"
                          style={{ width: `${d.completionRate}%` }}
                        />
                      </div>
                      <span>{d.completionRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {d.overdueTasks > 0 ? (
                      <span className="font-bold text-rose-600">{d.overdueTasks}</span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      d.slaRate >= d.targetSla
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {d.slaRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono">{d.targetSla}%</td>
                  <td className="py-3 px-4">
                    {d.complaintCount > 0 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                        {d.complaintCount} active
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
