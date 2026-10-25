import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckSquare,
  AlertTriangle,
  AlertOctagon,
  ClipboardCheck,
  Users2,
  ArrowRightLeft,
  Clock,
  MapPin,
  ArrowUpRight,
  ShieldAlert,
  RotateCcw,
  PlusCircle,
  Eye,
  CheckCircle2,
  FileCheck,
  Building2,
  Shield
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import SupervisorSummaryCard from '../../components/supervisor/SupervisorSummaryCard';
import TaskDetailModal from '../../components/supervisor/TaskDetailModal';
import InspectionModal from '../../components/supervisor/InspectionModal';
import ReassignTaskModal from '../../components/supervisor/ReassignTaskModal';
import BlockerModal from '../../components/supervisor/BlockerModal';
import HandoverModal from '../../components/supervisor/HandoverModal';
import SupervisorEscalateModal from '../../components/supervisor/SupervisorEscalateModal';
import CorrectiveActionModal from '../../components/supervisor/CorrectiveActionModal';
import Button from '../../components/ui/Button';
import {
  formatDateTime,
  formatTimeRemaining,
  getStatusStyle,
  getPriorityStyle,
  getInspectionStatusStyle,
  getBlockerStatusStyle,
  isOverdue,
  TASK_STATUS,
  INSPECTION_STATUS,
  BLOCKER_STATUS
} from '../../utils/taskStatus';

export default function SupervisorDashboard() {
  const navigate = useNavigate();
  const {
    tasks,
    staff,
    blockers,
    supervisorMetrics,
    supervisorProfile,
    recentActivities
  } = useTasks();

  // Modal states
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [blockerModalOpen, setBlockerModalOpen] = useState(false);
  const [handoverModalOpen, setHandoverModalOpen] = useState(false);
  const [correctiveModalOpen, setCorrectiveModalOpen] = useState(false);

  // Urgent and Overdue Tasks
  const urgentAndOverdueTasks = tasks.filter(
    (t) =>
      t.status !== TASK_STATUS.COMPLETED &&
      (t.priority === 'urgent' || isOverdue(t.dueAt, t.status))
  );

  // Pending Inspections (only tasks that require inspection and are awaiting review)
  const pendingInspections = tasks.filter(
    (t) => t.inspectionRequired === true && t.inspectionStatus === INSPECTION_STATUS.PENDING
  );

  // Active Blocked Tasks
  const activeBlockers = blockers.filter((b) => b.status !== BLOCKER_STATUS.RESOLVED);

  const handleOpenDetail = (task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  const handleOpenInspect = (task) => {
    setSelectedTask(task);
    setInspectModalOpen(true);
  };

  const handleOpenReassign = (task) => {
    setSelectedTask(task);
    setReassignModalOpen(true);
  };

  const handleOpenEscalate = (task) => {
    setSelectedTask(task);
    setEscalateModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
              Lead Command Hub
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Supervisor: {supervisorProfile.name} (EMP-201)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#172033] tracking-tight mt-1">
            Department Supervisor Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time execution monitoring, quality inspections, blocker mitigation, and capacity balancing for{' '}
            <span className="font-semibold text-slate-700">{supervisorProfile.department}</span>.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/supervisor/tasks')}
            className="text-xs"
          >
            <CheckSquare className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            Team Tasks
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/supervisor/inspections')}
            className="text-xs"
          >
            <ClipboardCheck className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
            Review Inspections
          </Button>

          <Button
            variant="outline"
            onClick={() => setBlockerModalOpen(true)}
            className="text-xs text-red-700 border-red-200 hover:bg-red-50"
          >
            <AlertOctagon className="w-3.5 h-3.5 mr-1.5 text-red-600" />
            Resolve Blocker
          </Button>

          <Button
            variant="primary"
            onClick={() => setHandoverModalOpen(true)}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5" />
            Create Handover
          </Button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SupervisorSummaryCard
          title="Active Tasks"
          value={supervisorMetrics.activeTasksCount}
          subtitle="Executing in department"
          icon={CheckSquare}
          color="blue"
          onClick={() => navigate('/supervisor/tasks')}
        />

        <SupervisorSummaryCard
          title="Overdue Tasks"
          value={supervisorMetrics.overdueTasksCount}
          subtitle="Past targeted SLA"
          icon={Clock}
          color="amber"
          badge={supervisorMetrics.overdueTasksCount > 0 ? 'Action Req' : null}
          onClick={() => navigate('/supervisor/tasks?filter=overdue')}
        />

        <SupervisorSummaryCard
          title="Blocked Tasks"
          value={supervisorMetrics.blockedTasksCount}
          subtitle="Operational / safety barriers"
          icon={AlertOctagon}
          color="red"
          badge={supervisorMetrics.blockedTasksCount > 0 ? 'Critical' : null}
          onClick={() => navigate('/supervisor/blockers')}
        />

        <SupervisorSummaryCard
          title="Pending Inspection"
          value={supervisorMetrics.pendingInspectionCount}
          subtitle="Awaiting supervisor sign-off"
          icon={ClipboardCheck}
          color="purple"
          badge={supervisorMetrics.pendingInspectionCount > 0 ? 'Review Ready' : null}
          onClick={() => navigate('/supervisor/inspections')}
        />
      </div>

      {/* Grid: 2 Columns for Sections A & B */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION A: Urgent & Overdue Tasks */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Urgent & Overdue Tasks ({urgentAndOverdueTasks.length})
              </h2>
            </div>
            <Link
              to="/supervisor/tasks"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[380px]">
            {urgentAndOverdueTasks.length > 0 ? (
              urgentAndOverdueTasks.map((t) => {
                const priorityStyle = getPriorityStyle(t.priority);
                const statusStyle = getStatusStyle(t.status);
                const overdue = isOverdue(t.dueAt, t.status);

                return (
                  <div key={t.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {t.id}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900">{t.title}</h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${priorityStyle.bg} ${priorityStyle.text}`}>
                        {priorityStyle.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {t.location}
                        </span>
                        <span>•</span>
                        <span>Assignee: <strong className="text-slate-800">{t.assignedTo?.name || 'Unassigned'}</strong></span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className={`font-semibold ${overdue ? 'text-red-700' : 'text-slate-700'}`}>
                          {formatTimeRemaining(t.dueAt, t.status)}
                        </span>
                      </div>
                    </div>

                    {/* Delay or Blocker badge if present */}
                    {(t.delayInfo || t.blockerInfo) && (
                      <div className="p-2 rounded-lg bg-red-50 text-[11px] text-red-900 flex items-center justify-between">
                        <span className="font-semibold truncate">
                          Barrier: {t.blockerInfo?.category || t.delayInfo?.reason}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-red-700">Blocked</span>
                      </div>
                    )}

                    {/* Card Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDetail(t)}
                        className="text-[11px] h-7 px-2.5"
                      >
                        <Eye className="w-3 h-3 mr-1 text-slate-500" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenReassign(t)}
                        className="text-[11px] h-7 px-2.5"
                      >
                        Reassign
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEscalate(t)}
                        className="text-[11px] h-7 px-2.5 text-red-600 hover:bg-red-50 border-red-200"
                      >
                        <ShieldAlert className="w-3 h-3 mr-1" />
                        Escalate
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-slate-700">No urgent or overdue tasks currently.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Team execution is operating within SLA limits.</p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION B: Pending Inspections */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Pending Inspections ({pendingInspections.length})
              </h2>
            </div>
            <Link
              to="/supervisor/inspections"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Manage Inspections</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[380px]">
            {pendingInspections.length > 0 ? (
              pendingInspections.map((task) => (
                <div key={task.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {task.id}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 mt-1">{task.title}</h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {task.location}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                      Awaiting Review
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 text-xs text-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500">Completed by: </span>
                      <strong className="text-slate-900">{task.assignedTo?.name || 'Staff'}</strong>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {formatDateTime(task.completedAt)}
                    </span>
                  </div>

                  {task.completionNotes && (
                    <p className="text-xs text-slate-600 italic line-clamp-1">
                      "{task.completionNotes}"
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetail(task)}
                      className="text-[11px] h-7 px-2.5"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenInspect(task)}
                      className="text-[11px] h-7 px-3 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <ClipboardCheck className="w-3 h-3 mr-1" />
                      Review & Verify
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No inspections currently pending.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Completed tasks requiring review appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns for Sections C & D */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION C: Blocked Tasks & Issues */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-red-600" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Blocked Tasks & Barriers ({activeBlockers.length})
              </h2>
            </div>
            <Link
              to="/supervisor/blockers"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Manage Blockers</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[380px]">
            {activeBlockers.length > 0 ? (
              activeBlockers.map((b) => {
                const bStyle = getBlockerStatusStyle(b.status);
                const isSafety = b.safetyRestricted;

                return (
                  <div key={b.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            {b.id}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            Task: {b.taskId}
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 mt-1">{b.taskTitle}</h3>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {b.location}
                        </p>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${bStyle.bg} ${bStyle.text} border ${bStyle.border} shrink-0`}>
                        {bStyle.label}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-red-50/50 border border-red-100 text-xs text-red-950 space-y-1">
                      <p><span className="font-bold">Reason: </span>{b.description}</p>
                      <p className="text-[11px] text-red-800">
                        <span className="font-semibold">Next Action: </span>{b.nextAction}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Owner: <strong className="text-slate-800">{b.responsiblePerson}</strong></span>
                      <span>Target: {formatDateTime(b.expectedResolutionTime)}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/supervisor/blockers')}
                        className="text-[11px] h-7 px-3 text-red-700 hover:bg-red-50 border-red-200"
                      >
                        Review Blocker
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-slate-700">No active blockers reported.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">All service corridors and task flows clear.</p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION D: Team Workload */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Users2 className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Team Workload & Capacity ({staff.length} staff)
              </h2>
            </div>
            <Link
              to="/supervisor/team"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Workload Matrix</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[380px]">
            {staff.map((member) => {
              const analysis = member.workloadAnalysis || { level: 'Optimal', warning: false };

              return (
                <div key={member.id} className="p-3.5 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{member.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">{member.id}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{member.role} • {member.shift}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="font-bold text-slate-800">{member.activeTasksCount} active</span>
                        {member.overdueTasksCount > 0 && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 rounded">
                            {member.overdueTasksCount} overdue
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          analysis.warning
                            ? 'bg-red-100 text-red-800'
                            : analysis.level === 'Moderate'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {analysis.level}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/supervisor/team')}
                      className="text-[11px] h-7 px-2"
                    >
                      Tasks
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION E: Recent Activity Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Operational Activity Feed
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Live event log</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
          {recentActivities.slice(0, 8).map((event) => (
            <div key={event.id} className="py-2.5 text-xs flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{event.event}</span>
                  {event.taskId && (
                    <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-1.5 rounded">
                      {event.taskId}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-[11px] font-semibold text-slate-700">{event.actor}</span>
                </div>
                <p className="text-slate-600 text-[11px]">{event.details}</p>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">
                {formatDateTime(event.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MODALS */}
      <TaskDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        task={selectedTask}
        onReassign={handleOpenReassign}
        onInspect={handleOpenInspect}
        onEscalate={handleOpenEscalate}
        onCorrectiveAction={(t) => {
          setSelectedTask(t);
          setCorrectiveModalOpen(true);
        }}
      />

      <InspectionModal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        task={selectedTask}
        onEscalate={handleOpenEscalate}
      />

      <ReassignTaskModal
        isOpen={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        task={selectedTask}
      />

      <SupervisorEscalateModal
        isOpen={escalateModalOpen}
        onClose={() => setEscalateModalOpen(false)}
        task={selectedTask}
      />

      <BlockerModal
        isOpen={blockerModalOpen}
        onClose={() => setBlockerModalOpen(false)}
        mode="create"
      />

      <HandoverModal
        isOpen={handoverModalOpen}
        onClose={() => setHandoverModalOpen(false)}
        mode="create"
      />

      <CorrectiveActionModal
        isOpen={correctiveModalOpen}
        onClose={() => setCorrectiveModalOpen(false)}
        mode="create"
        prefilledTaskId={selectedTask?.id}
      />
    </div>
  );
}
