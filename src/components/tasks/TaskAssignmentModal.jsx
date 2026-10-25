import React, { useState } from 'react';
import {
  UserCheck,
  AlertTriangle,
  Clock,
  MapPin,
  Calendar,
  X,
  UserX,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import TaskStatusBadge, { PriorityBadge } from './TaskStatusBadge';
import { formatTimeRemaining, formatDateTime } from '../../utils/taskStatus';
import { useTasks } from '../../context/TaskContext';

export default function TaskAssignmentModal({
  isOpen,
  onClose,
  task
}) {
  const { staff, assignTask, unassignTask } = useTasks();

  const [selectedStaffId, setSelectedStaffId] = useState(task?.assignedTo?.id || '');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [scheduledStart, setScheduledStart] = useState(task?.scheduledStart ? task.scheduledStart.slice(0, 16) : '');
  const [conflictOverride, setConflictOverride] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task) return null;

  const currentAssignee = task.assignedTo;
  const selectedMember = staff.find((s) => s.id === selectedStaffId);

  // Check for scheduling conflict
  const hasConflict = selectedMember && (
    selectedMember.availability === 'Off Duty' ||
    selectedMember.availability === 'On Break' ||
    selectedMember.activeTasksCount >= 3
  );

  const conflictReason = selectedMember
    ? selectedMember.availability === 'Off Duty'
      ? `${selectedMember.name} is currently Off Duty (${selectedMember.shift}).`
      : selectedMember.availability === 'On Break'
      ? `${selectedMember.name} is currently on break.`
      : selectedMember.activeTasksCount >= 3
      ? `${selectedMember.name} already has ${selectedMember.activeTasksCount} active tasks (Heavy Workload).`
      : null
    : null;

  const handleConfirm = () => {
    if (!selectedMember) return;
    if (hasConflict && !conflictOverride) return;

    setIsSubmitting(true);
    setTimeout(() => {
      assignTask(
        task.id,
        selectedMember,
        assignmentNotes,
        scheduledStart ? new Date(scheduledStart).toISOString() : null
      );
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  const handleClear = () => {
    unassignTask(task.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign & Schedule Task"
      subtitle={`Configure staff assignment and dispatch schedule for ${task.id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Task Summary Banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                {task.id}
              </span>
              <PriorityBadge priority={task.priority} />
              <TaskStatusBadge status={task.status} size="sm" />
            </div>
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatTimeRemaining(task.dueAt, task.status)}
            </span>
          </div>

          <h4 className="text-sm font-bold text-slate-900 mb-1">{task.title}</h4>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {task.location}
            </span>
            <span>•</span>
            <span>Category: <strong className="text-slate-800">{task.category}</strong></span>
            <span>•</span>
            <span>Due: {formatDateTime(task.dueAt)}</span>
          </div>

          {currentAssignee && (
            <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Currently Assigned: <strong className="text-slate-800">{currentAssignee.name}</strong>
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="text-red-600 hover:text-red-800 font-semibold inline-flex items-center gap-1"
              >
                <UserX className="w-3.5 h-3.5" />
                Clear Assignment
              </button>
            </div>
          )}
        </div>

        {/* Staff Selection List */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Select Eligible Staff ({staff.length} in department)
          </label>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {staff.map((member) => {
              const isSelected = selectedStaffId === member.id;
              const isEligible = member.skills?.includes(task.category) || true;
              const isBusy = member.activeTasksCount >= 3;
              const isOff = member.availability === 'Off Duty' || member.availability === 'On Break';

              return (
                <div
                  key={member.id}
                  onClick={() => setSelectedStaffId(member.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {member.name}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {member.id}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {member.role} • {member.shift}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Workload Indicator */}
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-slate-700">
                        {member.activeTasksCount} active tasks
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Workload: <span className={isBusy ? 'text-amber-600 font-bold' : 'text-emerald-600 font-semibold'}>{member.workloadStatus}</span>
                      </div>
                    </div>

                    {/* Availability Tag */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        member.availability === 'Available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : member.availability === 'Busy'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {member.availability}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scheduling Conflict Alert */}
        {hasConflict && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Potential Scheduling Conflict</span>
            </div>
            <p className="leading-relaxed">{conflictReason}</p>
            <label className="flex items-center gap-2 font-semibold text-amber-950 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={conflictOverride}
                onChange={(e) => setConflictOverride(e.target.checked)}
                className="rounded border-amber-400 text-blue-600 focus:ring-blue-500"
              />
              <span>Supervisor Override: Proceed with assignment despite workload notice</span>
            </label>
          </div>
        )}

        {/* Dispatcher Notes & Scheduled Start */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Scheduled Start Time (Optional)
            </label>
            <input
              type="datetime-local"
              value={scheduledStart}
              onChange={(e) => setScheduledStart(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Internal Dispatch Notes (Optional)
            </label>
            <input
              type="text"
              value={assignmentNotes}
              onChange={(e) => setAssignmentNotes(e.target.value)}
              placeholder="e.g. Prioritize before 10 AM shift change..."
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={UserCheck}
            disabled={!selectedMember || (hasConflict && !conflictOverride) || isSubmitting}
            loading={isSubmitting}
            onClick={handleConfirm}
          >
            Confirm Assignment
          </Button>
        </div>
      </div>
    </Modal>
  );
}
