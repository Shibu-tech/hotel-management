import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Calendar,
  Filter,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  ExternalLink
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import Button from '../../components/ui/Button';
import SlaConfigModal from '../../components/manager/SlaConfigModal';
import { computeDepartmentSlaMetrics, getTaskSlaAnalysis } from '../../utils/slaCalculations';
import { formatDateTime, formatTimeRemaining } from '../../utils/taskStatus';

export default function SLAPerformance() {
  const { tasks, slaConfig, managerMetrics, complaints } = useTasks();

  const [dateRange, setDateRange] = useState('7d'); // 'today', '7d', '30d', 'month'
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [slaModalOpen, setSlaModalOpen] = useState(false);

  // Filter tasks based on selected criteria
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
      if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
      return true;
    });
  }, [tasks, categoryFilter, priorityFilter]);

  // Dynamic SLA analytics based on filtered subset
  const analytics = useMemo(() => {
    return computeDepartmentSlaMetrics(filteredTasks, slaConfig);
  }, [filteredTasks, slaConfig]);

  // Performance category breakdown
  const categoryBreakdown = useMemo(() => {
    const map = {};
    filteredTasks.forEach((t) => {
      const cat = t.category || 'Other';
      if (!map[cat]) map[cat] = { total: 0, met: 0, breached: 0 };
      map[cat].total++;

      const sla = getTaskSlaAnalysis(t, slaConfig);
      if (sla.isBreached) map[cat].breached++;
      else map[cat].met++;
    });

    return Object.entries(map).map(([category, stats]) => ({
      category,
      total: stats.total,
      met: stats.met,
      breached: stats.breached,
      complianceRate: stats.total > 0 ? Math.round((stats.met / stats.total) * 100) : 0
    }));
  }, [filteredTasks, slaConfig]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            SLA Oversight & Operational Performance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time compliance monitoring, response time analytics, and SLA threshold benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date range selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs p-2 border border-slate-300 rounded-lg bg-white font-medium"
          >
            <option value="today">Reporting Period: Today</option>
            <option value="7d">Reporting Period: Last 7 Days</option>
            <option value="30d">Reporting Period: Last 30 Days</option>
            <option value="month">Reporting Period: This Month</option>
          </select>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setSlaModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-600" />
            <span>Configure SLA Targets</span>
          </Button>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>SLA Compliance Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold mt-1.5 ${(analytics.slaComplianceRate || 0) >= 85 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {analytics.slaComplianceRate !== null ? `${analytics.slaComplianceRate}%` : '—'}
          </div>
          <span className="text-[11px] text-slate-400">
            Target benchmark: ≥ 85%
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tasks At Risk</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1.5">
            {analytics.slaAtRiskCount}
          </div>
          <span className="text-[11px] text-slate-400">
            &gt; {slaConfig.atRiskThresholdPercent}% elapsed duration
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>SLA Breaches</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1.5">
            {analytics.slaBreachedCount}
          </div>
          <span className="text-[11px] text-slate-400">
            Exceeded deadline target
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Avg Initial Response</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-1.5">
            {analytics.avgResponseMinutes !== null ? `${analytics.avgResponseMinutes}m` : '—'}
          </div>
          <span className="text-[11px] text-slate-400">
            Creation to qualifying assignment
          </span>
        </div>
      </div>

      {/* Visual Analytics & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Trend Chart Box (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-subtle p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Hourly Workload & SLA Trend
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution of dispatched work against SLA fulfillment by operational window.
              </p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Live Operations Feed
            </span>
          </div>

          {/* Responsive CSS Bar Chart */}
          <div className="h-44 pt-4 flex items-end justify-between gap-2 border-b border-slate-200">
            {[
              { hour: '06:00', total: 4, met: 4, label: 'Early Turn' },
              { hour: '07:00', total: 7, met: 6, label: 'Shift Start' },
              { hour: '08:00', total: 11, met: 9, label: 'VIP Inbound' },
              { hour: '09:00', total: 14, met: 12, label: 'Breakfast' },
              { hour: '10:00', total: 18, met: 15, label: 'Stayover Peak' },
              { hour: '11:00', total: 15, met: 13, label: 'Checkout' },
              { hour: '12:00', total: 12, met: 11, label: 'Room Turn' },
              { hour: '13:00', total: 9, met: 8, label: 'Midday' }
            ].map((bar, i) => {
              const heightPct = Math.round((bar.total / 20) * 100);
              const metPct = Math.round((bar.met / bar.total) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="text-[10px] text-slate-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.met}/{bar.total}
                  </div>
                  <div className="w-full bg-slate-100 rounded-t-lg relative flex flex-col justify-end overflow-hidden" style={{ height: `${heightPct}%` }}>
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        metPct >= 85 ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ height: `${metPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 mt-1">{bar.hour}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
                <span>Met SLA Benchmark</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
                <span>At Risk / Overdue</span>
              </span>
            </div>
            <span>8-Hour Operational Sample</span>
          </div>
        </div>

        {/* Category Compliance Breakdown (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Compliance by Category
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Target SLA performance by operational pods.
            </p>
          </div>

          <div className="space-y-3">
            {categoryBreakdown.map((cat) => (
              <div key={cat.category} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-800">
                  <span>{cat.category}</span>
                  <span className={`font-bold ${cat.complianceRate >= 85 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {cat.complianceRate}% ({cat.met}/{cat.total})
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      cat.complianceRate >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${cat.complianceRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600">
            <span className="font-bold text-slate-800">Active SLA Policies:</span>
            <div className="text-[11px] grid grid-cols-2 gap-1 pt-1">
              <span>Urgent: <strong>{slaConfig.urgentTargetMinutes}m</strong></span>
              <span>High: <strong>{slaConfig.highTargetMinutes}m</strong></span>
              <span>Medium: <strong>{slaConfig.mediumTargetMinutes}m</strong></span>
              <span>Low: <strong>{slaConfig.lowTargetMinutes}m</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Task SLA Audit Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
            Detailed Task SLA Audit Log ({filteredTasks.length} Records)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase">
              <tr>
                <th className="py-2.5 px-4">Task ID</th>
                <th className="py-2.5 px-4">Title & Location</th>
                <th className="py-2.5 px-4">Priority</th>
                <th className="py-2.5 px-4">Assigned Staff</th>
                <th className="py-2.5 px-4">Created</th>
                <th className="py-2.5 px-4">Due Deadline</th>
                <th className="py-2.5 px-4">SLA Elapsed</th>
                <th className="py-2.5 px-4">SLA State</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTasks.slice(0, 15).map((task) => {
                const sla = getTaskSlaAnalysis(task, slaConfig);
                return (
                  <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {task.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 truncate max-w-xs">{task.title}</div>
                      <div className="text-[11px] text-slate-500">{task.location}</div>
                    </td>
                    <td className="py-3 px-4 capitalize font-semibold whitespace-nowrap">
                      {task.priority}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                      {task.assignedTo?.name || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      {formatDateTime(task.createdAt)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {formatTimeRemaining(task.dueAt, task.status)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">{sla.percentElapsed}%</span>
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              sla.isBreached
                                ? 'bg-rose-500'
                                : sla.isAtRisk
                                ? 'bg-amber-500'
                                : 'bg-blue-600'
                            }`}
                            style={{ width: `${Math.min(sla.percentElapsed, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sla.badgeColor}`}>
                        {sla.state}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLA Policy Modal */}
      {slaModalOpen && (
        <SlaConfigModal
          isOpen={slaModalOpen}
          onClose={() => setSlaModalOpen(false)}
        />
      )}
    </div>
  );
}
