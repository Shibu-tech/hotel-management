import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Play,
  Truck,
  AlertTriangle,
  RotateCcw,
  Check,
  Shield,
  Building2,
  Package
} from 'lucide-react';
import TaskStatusBadge, { PriorityBadge } from '../../components/tasks/TaskStatusBadge';
import Button from '../../components/ui/Button';
import { formatTimeRemaining, formatDateTime, isOverdue } from '../../utils/taskStatus';
import { useTasks } from '../../context/TaskContext';

export default function TaskFulfillerPage() {
  const { tasks, updateTask, showToast } = useTasks();
  const navigate = useNavigate();

  // Simulated fulfiller: Marcus Alvarez (EMP-418)
  const currentFulfiller = {
    id: 'EMP-418',
    name: 'Marcus Alvarez',
    role: 'Attendant & Runner',
    shift: 'Morning Shift (07:00 – 15:30)'
  };

  const assignedTasks = tasks.filter(
    (t) => t.assignedTo && t.assignedTo.id === currentFulfiller.id
  );

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed'

  const displayedTasks = assignedTasks.filter((t) =>
    activeTab === 'active' ? t.status !== 'Completed' : t.status === 'Completed'
  );

  const handleStatusChange = (task, newStatus) => {
    updateTask(task.id, {
      status: newStatus,
      completedAt: newStatus === 'Completed' ? new Date().toISOString() : task.completedAt
    });
    showToast(`Task ${task.id} status updated to "${newStatus}"`, 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-150">
      {/* Role Switcher Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
            MA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">Role View: Task Fulfiller (Runner / Attendant)</span>
              <span className="text-[10px] uppercase font-bold bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/40">
                Staff Terminal
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Logged in as <strong>{currentFulfiller.name}</strong> ({currentFulfiller.id}) • {currentFulfiller.shift}
            </p>
          </div>
        </div>

        <Link
          to="/dispatcher/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Switch back to Dispatcher UI</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            My Active Tasks ({assignedTasks.filter((t) => t.status !== 'Completed').length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'completed'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Completed ({assignedTasks.filter((t) => t.status === 'Completed').length})
          </button>
        </div>
      </div>

      {/* Tasks List */}
      {displayedTasks.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200/80 shadow-subtle">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No tasks in this view</h3>
          <p className="text-xs text-slate-500 mt-1">
            {activeTab === 'active'
              ? 'You have completed all your assigned work for this shift!'
              : 'No completed tasks yet today.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedTasks.map((task) => {
            const overdue = isOverdue(task.dueAt, task.status);

            return (
              <div
                key={task.id}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-3"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {task.id}
                    </span>
                    <PriorityBadge priority={task.priority} size="xs" />
                    <TaskStatusBadge status={task.status} size="xs" />
                  </div>

                  <span
                    className={`text-xs font-semibold flex items-center gap-1 ${
                      overdue ? 'text-red-600' : 'text-slate-500'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTimeRemaining(task.dueAt, task.status)}</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900">{task.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold mt-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{task.location}</span>
                    <span>•</span>
                    <span className="text-slate-500 font-normal">{task.category}</span>
                  </div>
                </div>

                {task.item && (
                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span>
                      {task.quantity ? `${task.quantity}x ` : ''}
                      {task.item}
                    </span>
                  </div>
                )}

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <strong>Instructions:</strong> {task.instructions}
                </div>

                {/* Workflow Transitions for Fulfiller */}
                {task.status !== 'Completed' && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      Fulfiller Execution Controls:
                    </span>

                    <div className="flex items-center gap-2">
                      {task.status === 'New' && (
                        <Button
                          variant="primary"
                          size="xs"
                          icon={Play}
                          onClick={() => handleStatusChange(task, 'In Progress')}
                        >
                          Accept & Start Work
                        </Button>
                      )}

                      {task.status === 'In Progress' && (
                        <Button
                          variant="outline"
                          size="xs"
                          icon={Truck}
                          onClick={() => handleStatusChange(task, 'On the Way')}
                        >
                          En Route (On the Way)
                        </Button>
                      )}

                      {(task.status === 'In Progress' || task.status === 'On the Way') && (
                        <Button
                          variant="success"
                          size="xs"
                          icon={Check}
                          onClick={() => handleStatusChange(task, 'Completed')}
                        >
                          Confirm Delivery / Done
                        </Button>
                      )}

                      <Link
                        to={`/dispatcher/tasks/${task.id}`}
                        className="text-xs text-slate-500 hover:text-slate-800 font-semibold ml-2 underline"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
