import React from 'react';
import { Clock, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { isOverdue, formatTimeRemaining, formatDateTime } from '../../utils/taskStatus';
import TaskStatusBadge, { PriorityBadge } from '../tasks/TaskStatusBadge';

export default function UpcomingDeadlines({
  tasks = [],
  onViewTask
}) {
  // Sort non-completed tasks by due time ascending
  const deadlineTasks = [...tasks]
    .filter((t) => t.status !== 'Completed')
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Upcoming Deadlines & SLAs</h3>
            <p className="text-[11px] text-slate-500">Live SLA countdown and breach risk warnings</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {deadlineTasks.map((task) => {
          const overdue = isOverdue(task.dueAt, task.status);

          return (
            <div
              key={task.id}
              onClick={() => onViewTask(task.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                overdue
                  ? 'border-red-200 bg-red-50/40 hover:bg-red-50/70'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-800">{task.id}</span>
                  <PriorityBadge priority={task.priority} size="xs" />
                  <TaskStatusBadge status={task.status} size="xs" />
                </div>
                <h5 className="text-xs font-bold text-slate-900 truncate">{task.title}</h5>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {task.location} • Assignee: {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div
                  className={`text-xs font-bold flex items-center justify-end gap-1 ${
                    overdue ? 'text-red-600' : 'text-slate-800'
                  }`}
                >
                  {overdue ? <AlertCircle className="w-3.5 h-3.5 text-red-600" /> : <Clock className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{formatTimeRemaining(task.dueAt, task.status)}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {formatDateTime(task.dueAt)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
