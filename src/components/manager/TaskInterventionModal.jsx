import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { Shield, AlertTriangle, UserCheck, Clock, ArrowRight } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { formatTimeRemaining, TASK_PRIORITY } from '../../utils/taskStatus';

export default function TaskInterventionModal({ isOpen, onClose, task }) {
  const { staff, managerInterveneTask, managerProfile } = useTasks();

  const [actionType, setActionType] = useState('reassign');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [priorityChange, setPriorityChange] = useState(task?.priority || 'urgent');
  const [managerNote, setManagerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task) return null;

  const eligibleStaff = staff.filter((s) => s.availability !== 'Off Duty');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!managerNote.trim()) {
      alert('A managerial directive or rationale is required.');
      return;
    }

    setIsSubmitting(true);
    const success = managerInterveneTask(task.id, {
      actionType,
      newAssigneeId: actionType === 'reassign' ? selectedStaffId : null,
      priorityChange: actionType === 'priority' ? priorityChange : null,
      managerNote: managerNote.trim()
    });

    setIsSubmitting(false);
    if (success) {
      setManagerNote('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manager Operational Intervention: ${task.id}`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Summary Banner */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
          <div className="flex items-center justify-between font-bold text-slate-800">
            <span className="text-sm">{task.title}</span>
            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 uppercase text-[10px]">
              {task.status}
            </span>
          </div>
          <div className="text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
            <span>Location: <strong className="text-slate-700">{task.location}</strong></span>
            <span>Assignee: <strong className="text-slate-700">{task.assignedTo?.name || 'Unassigned'}</strong></span>
            <span>Deadline: <strong className="text-rose-600">{formatTimeRemaining(task.dueAt, task.status)}</strong></span>
          </div>
        </div>

        {/* Manager Authority Notice */}
        <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs flex items-center gap-2 text-blue-900">
          <Shield className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Acting under <strong>{managerProfile.role}</strong> delegated authority. This operational directive will be permanently recorded in the immutable audit log.
          </span>
        </div>

        {/* Action Type Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Intervention Action Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'reassign', label: 'Reassign Staff' },
              { id: 'priority', label: 'Elevate Priority' },
              { id: 'directive', label: 'Direct Override' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActionType(tab.id)}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                  actionType === tab.id
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reassignment Target */}
        {actionType === 'reassign' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select New Assigned Staff <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={actionType === 'reassign'}
            >
              <option value="">— Choose eligible department staff —</option>
              {eligibleStaff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.department}) — {s.availability} [{s.activeTasksCount} active tasks]
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Select available personnel to break the operational bottleneck.
            </p>
          </div>
        )}

        {/* Priority Elevation */}
        {actionType === 'priority' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Elevate Priority Level <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['urgent', 'high', 'medium', 'low'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriorityChange(p)}
                  className={`py-2 px-2 text-xs font-bold uppercase rounded-lg border transition-all ${
                    priorityChange === p
                      ? 'bg-red-500 text-white border-red-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Manager Directive Note (Mandatory) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Managerial Directive & Justification <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={managerNote}
            onChange={(e) => setManagerNote(e.target.value)}
            placeholder="Explain reason for intervention (e.g. 'Task breached 45-min SLA threshold. Reassigned to available morning runner to ensure guest satisfaction before 09:00 AM.')"
            className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting || !managerNote.trim()}>
            {isSubmitting ? 'Recording Directive...' : 'Enforce Manager Directive'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
