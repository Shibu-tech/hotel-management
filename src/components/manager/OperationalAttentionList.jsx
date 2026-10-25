import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  UserX,
  AlertOctagon,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import Button from '../ui/Button';
import TaskInterventionModal from './TaskInterventionModal';
import { isOverdue, formatTimeRemaining } from '../../utils/taskStatus';

export default function OperationalAttentionList({ tasks = [], onOpenTask }) {
  const [selectedTaskForIntervention, setSelectedTaskForIntervention] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'overdue', 'unassigned', 'blocked'

  // Filter for critical tasks requiring management attention
  const criticalTasks = tasks.filter((t) => {
    if (t.status === 'Completed') return false;

    const overdue = isOverdue(t.dueAt, t.status);
    const unassigned = !t.assignedTo || !t.assignedTo.id;
    const blocked = t.status === 'Blocked' || Boolean(t.blockerInfo);
    const urgent = t.priority === 'urgent';
    const escalated = Boolean(t.escalationInfo);

    if (filterType === 'overdue') return overdue;
    if (filterType === 'unassigned') return unassigned;
    if (filterType === 'blocked') return blocked;

    return overdue || unassigned || blocked || urgent || escalated;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Operational Attention & Bottlenecks
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
              {criticalTasks.length} Requiring Oversight
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Overdue, unassigned, or blocked tasks requiring department manager intervention.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Attention' },
            { id: 'overdue', label: 'Overdue' },
            { id: 'unassigned', label: 'Unassigned' },
            { id: 'blocked', label: 'Blocked' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterType === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
        {criticalTasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="font-bold text-slate-700">No Critical Operational Bottlenecks</div>
            <p className="text-slate-400 mt-1">All department tasks are within target SLA benchmarks and properly assigned.</p>
          </div>
        ) : (
          criticalTasks.map((task) => {
            const overdue = isOverdue(task.dueAt, task.status);
            const unassigned = !task.assignedTo || !task.assignedTo.id;
            const blocked = task.status === 'Blocked' || Boolean(task.blockerInfo);
            const escalated = Boolean(task.escalationInfo);

            return (
              <div
                key={task.id}
                className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">{task.id}</span>
                    <span className="font-semibold text-slate-700 truncate max-w-xs">
                      {task.title}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-medium text-slate-600">{task.location}</span>

                    {/* Flags */}
                    {overdue && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        Overdue ({formatTimeRemaining(task.dueAt, task.status)})
                      </span>
                    )}
                    {unassigned && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Unassigned Pool
                      </span>
                    )}
                    {blocked && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                        Blocked: {task.blockerInfo?.category || 'Supply/Access'}
                      </span>
                    )}
                    {escalated && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        Escalated: {task.escalationInfo.level}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-slate-500 text-[11px] flex-wrap">
                    <span>
                      Owner: <strong className="text-slate-700">{task.assignedTo?.name || 'Unassigned'}</strong>
                    </span>
                    <span>
                      Category: <span className="font-medium text-slate-700">{task.category}</span>
                    </span>
                    <span>
                      Deadline: <strong className={overdue ? 'text-rose-600' : 'text-slate-700'}>
                        {formatTimeRemaining(task.dueAt, task.status)}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {onOpenTask && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onOpenTask(task.id)}
                    >
                      View Details
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setSelectedTaskForIntervention(task)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Intervene
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Intervention Modal */}
      {selectedTaskForIntervention && (
        <TaskInterventionModal
          isOpen={Boolean(selectedTaskForIntervention)}
          onClose={() => setSelectedTaskForIntervention(null)}
          task={selectedTaskForIntervention}
        />
      )}
    </div>
  );
}
