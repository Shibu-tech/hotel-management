import React from 'react';
import {
  MapPin,
  Clock,
  UserCheck,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  Eye,
  ShieldAlert
} from 'lucide-react';
import TaskStatusBadge, { PriorityBadge } from './TaskStatusBadge';
import { formatTimeRemaining, formatDateTime, isOverdue } from '../../utils/taskStatus';
import Button from '../ui/Button';

export default function TaskCard({
  task,
  onViewTask,
  onAssignTask,
  onRecordDelay,
  onEscalateTask
}) {
  const overdue = isOverdue(task.dueAt, task.status);
  const isUrgent = task.priority === 'urgent';

  return (
    <div
      className={`bg-white rounded-xl border p-4 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between ${
        overdue
          ? 'border-red-300 border-l-4 border-l-red-500'
          : isUrgent
          ? 'border-amber-300 border-l-4 border-l-amber-500'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Header: ID, Priority, Status */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
              {task.id}
            </span>
            <PriorityBadge priority={task.priority} />
          </div>
          <TaskStatusBadge status={task.status} size="sm" />
        </div>

        {/* Title */}
        <h4
          onClick={() => onViewTask(task.id)}
          className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 mb-2"
        >
          {task.title}
        </h4>

        {/* Location & Category info */}
        <div className="space-y-1 text-xs text-slate-600 mb-3">
          <div className="flex items-center gap-1 text-slate-700 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{task.location}</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>{task.category}</span>
            {task.item && <span className="truncate max-w-[150px]">{task.item}</span>}
          </div>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Due & Assignee */}
        <div className="text-xs">
          <div
            className={`font-semibold flex items-center gap-1 ${
              overdue ? 'text-red-600' : 'text-slate-600'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimeRemaining(task.dueAt, task.status)}</span>
          </div>
          <div className="text-[11px] text-slate-500 truncate max-w-[130px]">
            {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="xs"
            onClick={() => onAssignTask(task)}
            title={task.assignedTo ? 'Change Assignee' : 'Assign'}
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Assign</span>
          </Button>

          <Button
            variant="secondary"
            size="xs"
            onClick={() => onViewTask(task.id)}
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
}
