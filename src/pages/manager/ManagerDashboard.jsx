import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckSquare,
  AlertTriangle,
  AlertOctagon,
  Users,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sliders,
  DollarSign,
  Building2,
  ExternalLink
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import ManagerSummaryCard from '../../components/manager/ManagerSummaryCard';
import OperationalAttentionList from '../../components/manager/OperationalAttentionList';
import ActivityTimeline from '../../components/manager/ActivityTimeline';
import RecoveryApprovalModal from '../../components/manager/RecoveryApprovalModal';
import ComplaintDetailModal from '../../components/manager/ComplaintDetailModal';
import SlaConfigModal from '../../components/manager/SlaConfigModal';
import Button from '../../components/ui/Button';
import { formatTimeRemaining, isOverdue } from '../../utils/taskStatus';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const {
    tasks,
    complaints,
    recoveryRequests,
    staff,
    staffSchedules,
    managerMetrics,
    recentActivities,
    managerProfile,
    managerRoleInfo,
    slaConfig
  } = useTasks();

  const [selectedRecovery, setSelectedRecovery] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [slaModalOpen, setSlaModalOpen] = useState(false);

  // High-priority complaints for quick overview
  const urgentComplaints = complaints
    .filter((c) => c.status !== 'Resolved')
    .slice(0, 4);

  // Pending service-recovery requests
  const pendingApprovals = recoveryRequests
    .filter((r) => r.status === 'Pending Approval')
    .slice(0, 4);

  // Staffing summary highlights
  const morningStaff = staffSchedules.filter((s) => s.weeklySchedule?.Mon?.shift === 'morning').length;
  const dayStaff = staffSchedules.filter((s) => s.weeklySchedule?.Mon?.shift === 'day').length;
  const eveningStaff = staffSchedules.filter((s) => s.weeklySchedule?.Mon?.shift === 'evening').length;
  const nightStaff = staffSchedules.filter((s) => s.weeklySchedule?.Mon?.shift === 'night').length;

  return (
    <div className="space-y-6">
      {/* Page Title & Scope Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Operations Management Workspace
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              {managerProfile.department}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Department operational performance, staffing coverage, SLA oversight, and delegated service recoveries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setSlaModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-600" />
            <span>SLA Policies</span>
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/manager/tasks')}
            className="flex items-center gap-1.5"
          >
            <span>Department Tasks Oversight</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* 6 Top Summary Cards (Compact, Data-Driven) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <ManagerSummaryCard
          title="Open Tasks"
          value={managerMetrics.openTasksCount}
          subtitle={`${tasks.length} total tasks`}
          icon={CheckSquare}
          onClick={() => navigate('/manager/tasks')}
        />

        <ManagerSummaryCard
          title="SLA At Risk"
          value={managerMetrics.slaAtRiskCount}
          subtitle="Approaching deadline"
          icon={Clock}
          badgeText={managerMetrics.slaAtRiskCount > 0 ? 'Action Soon' : 'Clear'}
          badgeColor={managerMetrics.slaAtRiskCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}
          onClick={() => navigate('/manager/performance')}
        />

        <ManagerSummaryCard
          title="SLA Breaches"
          value={managerMetrics.slaBreachedCount}
          subtitle="Past target SLA"
          icon={AlertTriangle}
          alert={managerMetrics.slaBreachedCount > 0}
          badgeText={managerMetrics.slaBreachedCount > 0 ? 'Breached' : '0 Breaches'}
          badgeColor="bg-rose-100 text-rose-800"
          onClick={() => navigate('/manager/performance')}
        />

        <ManagerSummaryCard
          title="Open Complaints"
          value={managerMetrics.openComplaintsCount}
          subtitle={`${managerMetrics.highSeverityComplaintsCount} high severity`}
          icon={AlertOctagon}
          alert={managerMetrics.highSeverityComplaintsCount > 0}
          onClick={() => navigate('/manager/complaints')}
        />

        <ManagerSummaryCard
          title="Staff Coverage"
          value={`${managerMetrics.staffingCoveragePercent}%`}
          subtitle={`${managerMetrics.availableStaffCount} available now`}
          icon={Users}
          badgeText={`${managerMetrics.onDutyStaffCount}/${managerMetrics.totalStaffCount} on-duty`}
          badgeColor="bg-emerald-100 text-emerald-800"
          onClick={() => navigate('/manager/staffing')}
        />

        <ManagerSummaryCard
          title="Pending Approvals"
          value={managerMetrics.pendingApprovalsCount}
          subtitle={`$${managerMetrics.pendingApprovalsTotalAmount.toFixed(0)} total pending`}
          icon={CheckCircle2}
          badgeText={`Limit: $${managerRoleInfo.delegatedApprovalLimit.toFixed(0)}`}
          badgeColor="bg-purple-100 text-purple-800 font-bold"
          onClick={() => navigate('/manager/approvals')}
        />
      </div>

      {/* Main Operational Section: Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Operational Attention & Approval Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section A: Operational Attention (Bottlenecks, Overdue, Unassigned) */}
          <OperationalAttentionList
            tasks={tasks}
            onOpenTask={(taskId) => navigate(`/manager/tasks?search=${taskId}`)}
          />

          {/* Section D: Pending Service-Recovery Approvals Queue */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle p-4 sm:p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    Service-Recovery Approval Queue
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                    {pendingApprovals.length} Pending Decision
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manager delegated authority limit: <strong>${managerRoleInfo.delegatedApprovalLimit.toFixed(2)} USD</strong>. Requests exceeding limit must be escalated.
                </p>
              </div>

              <Link
                to="/manager/approvals"
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
              >
                <span>View Full Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                No pending recovery authorizations awaiting managerial sign-off.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingApprovals.map((req) => {
                  const isExceeded = Number(req.amount) > managerRoleInfo.delegatedApprovalLimit;
                  return (
                    <div
                      key={req.id}
                      className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{req.id}</span>
                          <span className="font-medium text-slate-700 truncate">{req.proposedGesture}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              isExceeded ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            ${req.amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-3">
                          <span>Requester: <strong className="text-slate-700">{req.requestingEmployee?.name}</strong></span>
                          <span>Guest: <span className="text-slate-700">{req.guestReference}</span></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant={isExceeded ? 'secondary' : 'primary'}
                          onClick={() => setSelectedRecovery(req)}
                          className={!isExceeded ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                        >
                          {isExceeded ? 'Review & Escalate' : 'Review & Decide'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section E: Department SLA Performance Highlights */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle p-4 sm:p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Performance & SLA Compliance Overview
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calculated dynamically from verified request creation and completion timestamps.
                </p>
              </div>

              <Link
                to="/manager/performance"
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
              >
                <span>Analytics Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400">Compliance Rate</span>
                <div className={`text-xl font-extrabold mt-1 ${(managerMetrics.slaComplianceRate || 0) >= 85 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {managerMetrics.slaComplianceRate !== null ? `${managerMetrics.slaComplianceRate}%` : '—'}
                </div>
                <span className="text-[10px] text-slate-500">Benchmark: ≥ 85%</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400">Avg First Response</span>
                <div className="text-xl font-extrabold text-blue-700 mt-1">
                  {managerMetrics.avgResponseMinutes !== null ? `${managerMetrics.avgResponseMinutes}m` : '—'}
                </div>
                <span className="text-[10px] text-slate-500">Target: &lt; 15m</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400">Avg Completion</span>
                <div className="text-xl font-extrabold text-slate-800 mt-1">
                  {managerMetrics.avgCompletionMinutes !== null ? `${managerMetrics.avgCompletionMinutes}m` : '—'}
                </div>
                <span className="text-[10px] text-slate-500">Across all categories</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400">Overdue Task Rate</span>
                <div className="text-xl font-extrabold text-rose-700 mt-1">
                  {tasks.length > 0 ? `${Math.round((managerMetrics.overdueTasksCount / tasks.length) * 100)}%` : '0%'}
                </div>
                <span className="text-[10px] text-slate-500">{managerMetrics.overdueTasksCount} overdue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Complaints, Staffing, Activity */}
        <div className="space-y-6">
          {/* Section B: Complaint & Guest Case Oversight */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle p-4 sm:p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Guest Complaints
                </h2>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {managerMetrics.openComplaintsCount} Open
                </span>
              </div>

              <Link
                to="/manager/complaints"
                className="text-xs text-blue-600 hover:text-blue-800 font-bold"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {urgentComplaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedComplaint(c)}
                  className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition-all text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="truncate">{c.category}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                        c.severity === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : c.severity === 'high'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.severity}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 truncate">
                    {c.guestReference}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-100">
                    <span>Owner: <strong>{c.owner}</strong></span>
                    <span className="text-rose-600 font-semibold">{c.timeOpenDisplay}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section C: Staffing Coverage Overview */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle p-4 sm:p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Shift Coverage Breakdown
              </h2>
              <Link
                to="/manager/staffing"
                className="text-xs text-blue-600 hover:text-blue-800 font-bold"
              >
                Manage Roster →
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Morning Shift (07:00 – 15:30)</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">{morningStaff} Staff</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Day Operations (08:00 – 16:30)</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">{dayStaff} Staff</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Evening Shift (15:00 – 23:30)</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">{eveningStaff} Staff (Tight)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Night Audit (23:00 – 07:30)</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">{nightStaff} Staff</span>
              </div>
            </div>

            <div className="mt-3 p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-900 flex items-center justify-between">
              <span>Roster Coverage Status</span>
              <span className="font-bold text-emerald-700">Optimal Morning Bandwidth</span>
            </div>
          </div>

          {/* Section F: Live Recent Activity Timeline */}
          <ActivityTimeline activities={recentActivities} />
        </div>
      </div>

      {/* Modals */}
      {selectedRecovery && (
        <RecoveryApprovalModal
          isOpen={Boolean(selectedRecovery)}
          onClose={() => setSelectedRecovery(null)}
          request={selectedRecovery}
        />
      )}

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

      {slaModalOpen && (
        <SlaConfigModal
          isOpen={slaModalOpen}
          onClose={() => setSlaModalOpen(false)}
        />
      )}
    </div>
  );
}
