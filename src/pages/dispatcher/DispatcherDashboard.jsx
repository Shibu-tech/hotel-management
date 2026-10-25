import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ListTodo,
  UserX,
  AlertTriangle,
  Users2,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import SummaryCard from '../../components/dashboard/SummaryCard';
import UrgentTasks from '../../components/dashboard/UrgentTasks';
import UpcomingDeadlines from '../../components/dashboard/UpcomingDeadlines';
import StaffWorkloadSummary from '../../components/dashboard/StaffWorkloadSummary';
import RecentActivity from '../../components/dashboard/RecentActivity';
import QuickActions from '../../components/dashboard/QuickActions';

import TaskAssignmentModal from '../../components/tasks/TaskAssignmentModal';
import DelayModal from '../../components/tasks/DelayModal';
import EscalateModal from '../../components/tasks/EscalateModal';
import StaffDetailModal from '../../components/staff/StaffDetailModal';
import { useTasks } from '../../context/TaskContext';

export default function DispatcherDashboard() {
  const { tasks, staff, summaryMetrics } = useTasks();
  const navigate = useNavigate();

  // Active modals state
  const [assigningTask, setAssigningTask] = useState(null);
  const [delayingTask, setDelayingTask] = useState(null);
  const [escalatingTask, setEscalatingTask] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const handleViewTask = (taskId) => {
    navigate(`/dispatcher/tasks/${taskId}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-150">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Operations Dispatcher Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time queue monitoring, workload balancing, and SLA adherence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Shift • Floor Dispatch On Duty
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <QuickActions />

      {/* 4 Summary Cards (Data-driven, derived from context) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Open Tasks"
          count={summaryMetrics.openTasksCount}
          subtext="In active pipeline"
          icon={ListTodo}
          variant="blue"
          onClick={() => navigate('/dispatcher/tasks')}
        />

        <SummaryCard
          title="Unassigned Tasks"
          count={summaryMetrics.unassignedTasksCount}
          subtext="Need runner dispatch"
          icon={UserX}
          variant="amber"
          onClick={() => navigate('/dispatcher/tasks?assignee=unassigned')}
        />

        <SummaryCard
          title="Overdue Tasks"
          count={summaryMetrics.overdueTasksCount}
          subtext="SLA exceeded"
          icon={AlertTriangle}
          variant="red"
          onClick={() => navigate('/dispatcher/tasks?due=overdue')}
        />

        <SummaryCard
          title="Available Staff"
          count={summaryMetrics.availableStaffCount}
          subtext={`of ${staff.length} on shift`}
          icon={Users2}
          variant="emerald"
          onClick={() => navigate('/dispatcher/staff')}
        />
      </div>

      {/* Main Grid: Urgent Tasks & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UrgentTasks
          tasks={tasks}
          onViewTask={handleViewTask}
          onAssignTask={(task) => setAssigningTask(task)}
        />

        <UpcomingDeadlines
          tasks={tasks}
          onViewTask={handleViewTask}
        />
      </div>

      {/* Bottom Grid: Staff Workload Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StaffWorkloadSummary
          staff={staff}
          onSelectStaff={(member) => setSelectedStaff(member)}
        />

        <RecentActivity
          tasks={tasks}
          onViewTask={handleViewTask}
        />
      </div>

      {/* Modals */}
      {assigningTask && (
        <TaskAssignmentModal
          isOpen={Boolean(assigningTask)}
          onClose={() => setAssigningTask(null)}
          task={assigningTask}
        />
      )}

      {delayingTask && (
        <DelayModal
          isOpen={Boolean(delayingTask)}
          onClose={() => setDelayingTask(null)}
          task={delayingTask}
          onSwitchToEscalate={() => {
            const t = delayingTask;
            setDelayingTask(null);
            setEscalatingTask(t);
          }}
        />
      )}

      {escalatingTask && (
        <EscalateModal
          isOpen={Boolean(escalatingTask)}
          onClose={() => setEscalatingTask(null)}
          task={escalatingTask}
        />
      )}

      {selectedStaff && (
        <StaffDetailModal
          isOpen={Boolean(selectedStaff)}
          onClose={() => setSelectedStaff(null)}
          staffMember={selectedStaff}
          onViewTask={handleViewTask}
          onReassignTask={(task) => setAssigningTask(task)}
        />
      )}
    </div>
  );
}
