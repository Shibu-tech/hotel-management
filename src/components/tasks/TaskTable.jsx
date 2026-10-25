import React, { useState } from 'react';
import {
  MoreVertical,
  Eye,
  UserCheck,
  Clock,
  ShieldAlert,
  MessageSquare,
  AlertCircle,
  MapPin,
  ChevronRight
} from 'lucide-react';
import TaskStatusBadge, { PriorityBadge } from './TaskStatusBadge';
import { formatTimeRemaining, formatDateTime, isOverdue } from '../../utils/taskStatus';
import Button from '../ui/Button';

export default function TaskTable({
  tasks = [],
  onViewTask,
  onAssignTask,
  onRecordDelay,
  onEscalateTask,
  onGuestUpdate
}) {
  const [activeMenuId, setActiveMenuId] = useState(null);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 font-bold">Task ID</th>
              <th className="py-3.5 px-4 font-bold min-w-[200px]">Task Title & Item</th>
              <th className="py-3.5 px-4 font-bold">Location</th>
              <th className="py-3.5 px-4 font-bold">Category</th>
              <th className="py-3.5 px-4 font-bold">Priority</th>
              <th className="py-3.5 px-4 font-bold">Assignee</th>
              <th className="py-3.5 px-4 font-bold">Due Time</th>
              <th className="py-3.5 px-4 font-bold">Status</th>
              <th className="py-3.5 px-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => {
              const overdue = isOverdue(task.dueAt, task.status);
              const isUrgent = task.priority === 'urgent';

              return (
                <tr
                  key={task.id}
                  className={`hover:bg-slate-50/80 transition-colors group ${
                    overdue ? 'bg-red-50/20' : ''
                  }`}
                >
                  {/* Task ID */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    <button
                      onClick={() => onViewTask(task.id)}
                      className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                    >
                      {task.id}
                    </button>
                  </td>

                  {/* Task Title & Item */}
                  <td className="py-3 px-4">
                    <div
                      onClick={() => onViewTask(task.id)}
                      className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                    >
                      {task.title}
                    </div>
                    {task.item && (
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {task.quantity ? `${task.quantity}x ` : ''}
                        {task.item}
                      </div>
                    )}
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{task.location}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-medium">
                    {task.category}
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <PriorityBadge priority={task.priority} />
                  </td>

                  {/* Assignee */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {task.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                          {task.assignedTo.name[0]}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800 block text-xs">
                            {task.assignedTo.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {task.assignedTo.shift || 'On Duty'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAssignTask(task)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px] hover:bg-amber-100 transition-colors"
                      >
                        <UserCheck className="w-3 h-3" />
                        Assign Staff
                      </button>
                    )}
                  </td>

                  {/* Due Time */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div
                      className={`font-semibold ${
                        overdue ? 'text-red-600 flex items-center gap-1' : 'text-slate-700'
                      }`}
                    >
                      {overdue && <AlertCircle className="w-3.5 h-3.5" />}
                      <span>{formatTimeRemaining(task.dueAt, task.status)}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {formatDateTime(task.dueAt)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <TaskStatusBadge status={task.status} size="sm" />
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => onViewTask(task.id)}
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => onAssignTask(task)}
                        title={task.assignedTo ? 'Change Assignee' : 'Assign Staff'}
                      >
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      </Button>

                      {/* Dropdown Menu for secondary actions */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId(activeMenuId === task.id ? null : task.id)
                          }
                          className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {activeMenuId === task.id && (
                          <div
                            className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30 text-left animate-in fade-in-50 zoom-in-95 duration-100"
                            onClick={() => setActiveMenuId(null)}
                          >
                            <button
                              onClick={() => onRecordDelay(task)}
                              className="w-full px-3 py-1.5 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              Record Delay
                            </button>

                            <button
                              onClick={() => onGuestUpdate(task)}
                              className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              Guest Update
                            </button>

                            <button
                              onClick={() => onEscalateTask(task)}
                              className="w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <ShieldAlert className="w-3.5 h-3.5" />
                              Escalate Task
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
