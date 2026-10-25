import React from 'react';
import { Flame, Clock, MapPin, UserCheck, Eye, ChevronRight } from 'lucide-react';
import TaskStatusBadge, { PriorityBadge } from '../tasks/TaskStatusBadge';
import { formatTimeRemaining, formatDateTime } from '../../utils/taskStatus';
import Button from '../ui/Button';

export default function UrgentTasks({
  tasks = [],
  onViewTask,
  onAssignTask
}) {
  const urgentTasks = tasks
    .filter((t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'Completed')
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-100 text-red-600">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Urgent & High Priority Tasks</h3>
            <p className="text-[11px] text-slate-500">Requires active monitoring and prompt completion</p>
          </div>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
          {urgentTasks.length} active
        </span>
      </div>

      {urgentTasks.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
          🎉 No urgent or high-priority tasks pending in this department right now.
        </div>
      ) : (
        <div className="space-y-3">
          {urgentTasks.map((task) => (
            <div
              key={task.id}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-800">{task.id}</span>
                  <PriorityBadge priority={task.priority} size="xs" />
                  <TaskStatusBadge status={task.status} size="xs" />
                </div>
                <h4
                  onClick={() => onViewTask(task.id)}
                  className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                >
                  {task.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {task.location}
                  </span>
                  <span>•</span>
                  <span>Assigned: <strong className="text-slate-700">{task.assignedTo ? task.assignedTo.name : 'Unassigned'}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-right sm:text-left">
                  <span className="text-xs font-bold text-red-600 block">
                    {formatTimeRemaining(task.dueAt, task.status)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatDateTime(task.dueAt)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onAssignTask(task)}
                    title={task.assignedTo ? 'Change Assignee' : 'Assign Staff'}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span className="hidden md:inline">Assign</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => onViewTask(task.id)}
                  >
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
