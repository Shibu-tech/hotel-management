import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Building2,
  Filter,
  CheckSquare,
  Clock,
  AlertOctagon,
  TrendingUp,
  TrendingDown,
  Users,
  ChevronRight,
  X,
  FileText,
  BarChart2,
  Calendar
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function ExecutiveDepartments() {
  const { tasks, complaints, departmentBenchmarks } = useTasks();
  const [searchParams] = useSearchParams();
  const initialDept = searchParams.get('dept') || 'ALL';

  const [selectedDept, setSelectedDept] = useState(initialDept);
  const [reportingPeriod, setReportingPeriod] = useState('Current Shift');
  const [drilldownDept, setDrilldownDept] = useState(null);

  const departmentsList = [
    { name: 'Housekeeping', head: 'Elena Rostova', code: 'HKS-01' },
    { name: 'Maintenance', head: 'David Kim', code: 'MNT-02' },
    { name: 'Front Office', head: 'David Martinez', code: 'FO-03' },
    { name: 'Food & Beverage', head: 'Carlos Mendez', code: 'FB-04' },
    { name: 'Guest Services', head: 'Sarah Jenkins', code: 'GS-05' },
    { name: 'Security', head: 'Marcus Vance', code: 'SEC-06' }
  ];

  const departmentMetrics = departmentsList.map((dept) => {
    const deptTasks = tasks.filter((t) => {
      const cat = (t.category || '').toLowerCase();
      const loc = (t.location || '').toLowerCase();
      if (dept.name === 'Housekeeping') return cat.includes('housekeeping') || cat.includes('linen') || cat.includes('cleaning');
      if (dept.name === 'Maintenance') return cat.includes('maintenance') || cat.includes('repair') || cat.includes('facility');
      if (dept.name === 'Front Office') return cat.includes('luggage') || cat.includes('check') || loc.includes('lobby');
      if (dept.name === 'Food & Beverage') return cat.includes('room service') || cat.includes('dining') || cat.includes('beverage');
      if (dept.name === 'Guest Services') return cat.includes('amenities') || cat.includes('bell');
      if (dept.name === 'Security') return cat.includes('security') || cat.includes('safety') || cat.includes('patrol');
      return false;
    });

    const openTasks = deptTasks.filter((t) => t.status !== 'Completed');
    const completedTasks = deptTasks.filter((t) => t.status === 'Completed');
    const overdueTasks = deptTasks.filter((t) => t.status !== 'Completed' && (t.isOverdue || t.priority === 'urgent'));
    const deptComplaints = complaints.filter(
      (c) => (c.department || '').toLowerCase().includes(dept.name.toLowerCase()) && c.status !== 'Resolved'
    );

    const benchmark = departmentBenchmarks[dept.name] || {
      targetSla: 92,
      prevPeriodSla: 89,
      taskVolumeTrend: '+4.0%',
      complaintTrend: '-5.0%',
      avgResponseMins: 10,
      headcountOnDuty: 5
    };

    const calculatedSla = completedTasks.length + openTasks.length > 0
      ? Math.max(76, Math.min(99, Math.round(100 - (overdueTasks.length / Math.max(1, openTasks.length + completedTasks.length)) * 40)))
      : benchmark.targetSla;

    return {
      ...dept,
      openCount: openTasks.length,
      completedCount: completedTasks.length,
      overdueCount: overdueTasks.length,
      slaRate: calculatedSla,
      targetSla: benchmark.targetSla,
      prevPeriodSla: benchmark.prevPeriodSla,
      openComplaintsCount: deptComplaints.length,
      taskVolumeTrend: benchmark.taskVolumeTrend,
      complaintTrend: benchmark.complaintTrend,
      avgResponseMins: benchmark.avgResponseMins,
      headcountOnDuty: benchmark.headcountOnDuty,
      sampleTasks: deptTasks.slice(0, 4)
    };
  });

  const filteredMetrics = selectedDept === 'ALL'
    ? departmentMetrics
    : departmentMetrics.filter((d) => d.name === selectedDept);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              Department Performance Matrix
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Multi-Department Operational Telemetry
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Operational Benchmarks & Throughput
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare service-level agreements, active task volumes, and resolution velocities across hotel divisions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={reportingPeriod}
              onChange={(e) => setReportingPeriod(e.target.value)}
              className="bg-transparent text-xs text-slate-700 font-semibold focus:outline-none"
            >
              <option value="Current Shift">Current Shift</option>
              <option value="Last 24 Hours">Last 24 Hours</option>
              <option value="Week to Date">Week to Date</option>
              <option value="Month to Date">Month to Date</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent text-xs text-slate-700 font-semibold focus:outline-none"
            >
              <option value="ALL">All Departments ({departmentsList.length})</option>
              {departmentsList.map((d) => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMetrics.map((dept) => {
          const isSlaBeaten = dept.slaRate >= dept.targetSla;
          return (
            <div
              key={dept.name}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">{dept.code}</span>
                    <h2 className="text-base font-bold text-slate-900">{dept.name}</h2>
                    <span className="text-[11px] text-slate-500">Dept Lead: {dept.head}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      isSlaBeaten ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {dept.slaRate}% SLA
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>Performance vs Target ({dept.targetSla}%)</span>
                    <span>{dept.slaRate}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isSlaBeaten ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${dept.slaRate}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Open</span>
                    <span className="text-sm font-black text-slate-900">{dept.openCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Done</span>
                    <span className="text-sm font-black text-emerald-600">{dept.completedCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Overdue</span>
                    <span className={`text-sm font-black ${dept.overdueCount > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                      {dept.overdueCount}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Open Complaints:</span>
                    <span className={dept.openComplaintsCount > 0 ? 'font-bold text-rose-600' : 'text-slate-600'}>
                      {dept.openComplaintsCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Average Response Time:</span>
                    <span className="font-semibold text-slate-800">{dept.avgResponseMins} min</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">On-Duty Headcount:</span>
                    <span className="font-semibold text-slate-800">{dept.headcountOnDuty} staff</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">Volume trend: {dept.taskVolumeTrend}</span>
                <button
                  type="button"
                  onClick={() => setDrilldownDept(dept)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  Inspect Summary <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drill-down Modal */}
      {drilldownDept && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{drilldownDept.name} Division</h3>
                  <span className="text-[11px] text-slate-500">Authorized Executive Overview</span>
                </div>
              </div>
              <button
                onClick={() => setDrilldownDept(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block">SLA COMPLIANCE</span>
                <span className="text-base font-bold text-emerald-600">{drilldownDept.slaRate}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block">OPEN TASKS</span>
                <span className="text-base font-bold text-slate-900">{drilldownDept.openCount}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block">OVERDUE</span>
                <span className="text-base font-bold text-amber-600">{drilldownDept.overdueCount}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block">COMPLAINTS</span>
                <span className="text-base font-bold text-rose-600">{drilldownDept.openComplaintsCount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Division Summary Records
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {drilldownDept.sampleTasks.length > 0 ? (
                  drilldownDept.sampleTasks.map((t) => (
                    <div key={t.id} className="p-2.5 bg-white text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{t.id}</span>
                          <span className="font-normal text-slate-600 truncate max-w-[220px]">{t.title}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {t.location} • Assignee: {t.assignedTo?.name || 'Unassigned'}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {t.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No active sample tasks in this division.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setDrilldownDept(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
