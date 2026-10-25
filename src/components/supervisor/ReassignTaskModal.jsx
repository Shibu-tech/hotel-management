import React, { useState } from 'react';
import {
  X,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  Check,
  Info
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { formatTimeRemaining, formatDateTime, getPriorityStyle } from '../../utils/taskStatus';
import Button from '../ui/Button';

export default function ReassignTaskModal({ isOpen, onClose, task }) {
  const { staff, reassignSupervisorTask, supervisorProfile } = useTasks();

  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [reason, setReason] = useState('');
  const [handoverInstructions, setHandoverInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !task) return null;

  const currentAssigneeId = task.assignedTo?.id;
  const priorityStyle = getPriorityStyle(task.priority);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!selectedStaffId) {
      setError('Please select an eligible team member.');
      return;
    }

    if (selectedStaffId === currentAssigneeId) {
      setError('Selected team member is already the active assignee.');
      return;
    }

    if (!reason.trim()) {
      setError('Reassignment reason is strictly mandatory for the supervisor audit trail.');
      return;
    }

    const candidate = staff.find((s) => s.id === selectedStaffId);
    if (!candidate) {
      setError('Candidate not found in authorized department roster.');
      return;
    }

    if (candidate.availability === 'Off Duty' || candidate.availability === 'On Break') {
      setError(`Cannot reassign to ${candidate.name}: Employee is currently ${candidate.availability}.`);
      return;
    }

    setIsSubmitting(true);
    const success = reassignSupervisorTask(task.id, {
      newAssigneeId: selectedStaffId,
      reason: reason.trim(),
      handoverInstructions: handoverInstructions.trim()
    });

    setIsSubmitting(false);
    if (success) {
      onClose();
      setSelectedStaffId('');
      setReason('');
      setHandoverInstructions('');
    }
  };

  const selectedCandidate = staff.find((s) => s.id === selectedStaffId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-[#172B4D] text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600/90 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Reassign Department Task</h2>
              <p className="text-xs text-slate-300">
                Acting Supervisor: <span className="font-semibold">{supervisorProfile.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Task Snapshot Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {task.id}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{task.title}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${priorityStyle.bg} ${priorityStyle.text}`}>
                {priorityStyle.label} Priority
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-200/70 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{task.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatTimeRemaining(task.dueAt, task.status)}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-500">Current: </span>
                <span className="font-semibold text-slate-800">
                  {task.assignedTo?.name || 'Unassigned'}
                </span>
              </div>
            </div>
          </div>

          {/* Eligible Team Members Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Select Eligible Team Member <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500">
                Department: {supervisorProfile.department}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/50">
              {staff.map((member) => {
                const isCurrent = member.id === currentAssigneeId;
                const isUnavailable = member.availability === 'Off Duty' || member.availability === 'On Break';
                const isSelected = member.id === selectedStaffId;
                const workload = member.workloadAnalysis || { level: 'Optimal', warning: false };

                return (
                  <button
                    key={member.id}
                    type="button"
                    disabled={isUnavailable || isCurrent}
                    onClick={() => {
                      setSelectedStaffId(member.id);
                      setError('');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/30'
                        : isUnavailable || isCurrent
                        ? 'border-slate-200 bg-slate-100/70 opacity-60 cursor-not-allowed'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{member.name}</p>
                          <p className="text-[10px] text-slate-500">{member.role}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          member.availability === 'Available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : member.availability === 'Busy'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {member.availability}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500">
                          {member.activeTasksCount} active
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            workload.warning
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {workload.level}
                        </span>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] text-slate-500 font-semibold mt-1">
                        (Current Assignee)
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Candidate Conflict Warning */}
          {selectedCandidate && selectedCandidate.workloadAnalysis?.warning && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Workload Warning: </span>
                {selectedCandidate.name} has {selectedCandidate.activeTasksCount} active tasks and is classified as{' '}
                <span className="font-semibold underline">{selectedCandidate.workloadAnalysis.level}</span>.
                Ensure priority does not conflict with existing assignments.
              </div>
            </div>
          )}

          {/* Mandatory Reassignment Reason */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Reassignment Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Staff rebalanced due to VIP arrival; Previous assignee occupied on priority HVAC repair..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              This reason will be permanently recorded in the immutable task audit log.
            </p>
          </div>

          {/* Optional Handover Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Handover Instructions & Special Notes <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={handoverInstructions}
              onChange={(e) => setHandoverInstructions(e.target.value)}
              placeholder="e.g., Keycard staged with Front Desk; coordinate with attendant Marcus on 5th floor."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
            />
          </div>

          {/* Supervisor Compliance Banner */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2 text-xs text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Authorized under supervisor delegation scope. Reassignment triggers live notification to the incoming staff member and updates team capacity metrics.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !selectedStaffId || !reason.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? 'Recording Reassignment...' : 'Confirm Reassignment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
