import React, { useState, useMemo } from 'react';
import {
  History,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Search,
  Eye,
  Calendar,
  X
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import TaskStatusBadge, { PriorityBadge } from '../../components/tasks/TaskStatusBadge';
import Button from '../../components/ui/Button';
import { formatDateTime, TASK_STATUS } from '../../utils/taskStatus';
import { FULFILLER_PROFILE } from '../../utils/permissions';

export default function TaskHistoryPage() {
  const { tasks, currentUser, fulfillerProfile } = useTasks();

  const activeStaff = currentUser || fulfillerProfile || FULFILLER_PROFILE;
  const staffId = activeStaff.id || 'EMP-418';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  // Completed tasks assigned to this staff member
  const completedTasks = useMemo(() => {
    return tasks.filter(
      (t) => t.assignedTo && t.assignedTo.id === staffId && t.status === TASK_STATUS.COMPLETED
    );
  }, [tasks, staffId]);

  const filteredTasks = useMemo(() => {
    return completedTasks.filter((t) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||
          (t.title || '').toLowerCase().includes(q) ||
          (t.location || '').toLowerCase().includes(q) ||
          (t.item || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [completedTasks, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-teal-600" />
            <span>Task Completion History & Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified completions and delivery logs for {activeStaff.name} ({staffId})
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search completed tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
              Total Verified Completions
            </span>
            <span className="text-xl font-black text-slate-900">
              {completedTasks.length} tasks recorded
            </span>
          </div>
        </div>
        <span className="text-xs text-emerald-700 bg-emerald-50 font-bold px-2.5 py-1 rounded-md border border-emerald-200">
          100% Quality Audited
        </span>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No completed tasks recorded</h3>
            <p className="text-xs text-slate-500 mt-1">
              Completed assignments will appear here with delivery timestamps and confirmation notes.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {task.id}
                    </span>
                    <PriorityBadge priority={task.priority} size="xs" />
                    <TaskStatusBadge status={task.status} size="xs" />
                    <span className="text-xs font-semibold text-slate-500">{task.category}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{task.title}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      {task.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Completed: {formatDateTime(task.completedAt || task.dueAt)}
                    </span>
                    {task.item && (
                      <>
                        <span>•</span>
                        <span className="text-teal-700 font-medium">
                          {task.quantity ? `${task.quantity}x ` : ''}
                          {task.item}
                        </span>
                      </>
                    )}
                  </div>

                  {task.deliveryConfirmation && (
                    <div className="mt-2 text-xs bg-emerald-50 text-emerald-900 p-2.5 rounded-lg border border-emerald-200">
                      <strong>Delivery Handover: </strong>
                      <span>{task.deliveryConfirmation.recipientType}</span>
                      {task.deliveryConfirmation.confirmationNote && (
                        <span> — "{task.deliveryConfirmation.confirmationNote}"</span>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  icon={Eye}
                  onClick={() => setSelectedTask(task)}
                >
                  View Audit History
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* History Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                  {selectedTask.id}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-1">
                  Audit History: {selectedTask.title}
                </h3>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 text-xs">
              <div className="border-l-2 border-slate-200 pl-3 space-y-3">
                {selectedTask.history && selectedTask.history.length > 0 ? (
                  selectedTask.history.map((h, i) => (
                    <div key={h.id || i} className="relative">
                      <div className="font-bold text-slate-800 flex items-center justify-between">
                        <span>{h.event}</span>
                        <span className="text-[10px] text-slate-400">{formatDateTime(h.timestamp)}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{h.details}</p>
                      <p className="text-[10px] text-slate-400 italic">Actor: {h.actor}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400 italic">No history records logged.</div>
                )}
              </div>
            </div>

            <div className="p-3 border-t bg-slate-50 flex justify-end">
              <Button variant="outline" size="xs" onClick={() => setSelectedTask(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
