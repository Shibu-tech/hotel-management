import React, { useState } from 'react';
import {
  X,
  FileCheck,
  AlertTriangle,
  Clock,
  User,
  ShieldAlert,
  Info,
  CheckCircle2
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { CORRECTIVE_ACTION_STATUS } from '../../utils/taskStatus';
import Button from '../ui/Button';

export default function CorrectiveActionModal({
  isOpen,
  onClose,
  mode = 'create', // 'create' | 'resolve' | 'update'
  action = null,
  prefilledTaskId = null
}) {
  const { tasks, staff, createCorrectiveAction, resolveCorrectiveAction, updateCorrectiveAction, supervisorProfile } = useTasks();

  const [selectedTaskId, setSelectedTaskId] = useState(
    prefilledTaskId || (action ? action.taskId : '')
  );
  const [problemIdentified, setProblemIdentified] = useState(action?.problemIdentified || '');
  const [correctiveActionRequired, setCorrectiveActionRequired] = useState(action?.correctiveActionRequired || '');
  const [responsiblePersonId, setResponsiblePersonId] = useState(action?.responsiblePersonId || '');
  const [targetCompletionTime, setTargetCompletionTime] = useState(
    action?.targetCompletionTime
      ? new Date(action.targetCompletionTime).toISOString().slice(0, 16)
      : new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [notes, setNotes] = useState(action?.notes || '');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'create') {
      if (!problemIdentified.trim()) {
        setError('Please describe the problem or deficiency identified.');
        return;
      }
      if (!correctiveActionRequired.trim()) {
        setError('Please specify the required corrective action.');
        return;
      }
      if (!responsiblePersonId) {
        setError('Please assign a responsible team member for the corrective action.');
        return;
      }

      const assignedStaff = staff.find((s) => s.id === responsiblePersonId);
      const relatedTask = tasks.find((t) => t.id === selectedTaskId);

      setIsSubmitting(true);
      createCorrectiveAction({
        taskId: selectedTaskId || 'N/A',
        taskTitle: relatedTask ? relatedTask.title : 'Department Area Task',
        location: relatedTask ? relatedTask.location : 'Service Floor',
        problemIdentified: problemIdentified.trim(),
        correctiveActionRequired: correctiveActionRequired.trim(),
        responsiblePerson: assignedStaff ? assignedStaff.name : 'Attendant',
        responsiblePersonId,
        targetCompletionTime: new Date(targetCompletionTime).toISOString(),
        notes: notes.trim()
      });

      setIsSubmitting(false);
      onClose();
    } else if (mode === 'resolve') {
      if (!resolutionNotes.trim()) {
        setError('Resolution notes are required to verify the corrective action was completed.');
        return;
      }

      setIsSubmitting(true);
      resolveCorrectiveAction(action.id, { resolutionNotes: resolutionNotes.trim() });
      setIsSubmitting(false);
      onClose();
    } else if (mode === 'update') {
      setIsSubmitting(true);
      updateCorrectiveAction(action.id, {
        notes: notes.trim(),
        targetCompletionTime: new Date(targetCompletionTime).toISOString()
      });
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-[#172B4D] text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {mode === 'create'
                  ? 'Issue Corrective Action'
                  : mode === 'resolve'
                  ? 'Verify & Close Corrective Action'
                  : 'Update Corrective Action'}
              </h2>
              <p className="text-xs text-slate-300">
                Supervisor: <span className="font-semibold">{supervisorProfile.name}</span>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'create' && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Related Task <span className="text-slate-400 font-normal">(Optional if general)</span>
                </label>
                <select
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No specific task (General department procedure)</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id} - {t.title} ({t.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Problem / Deficiency Identified <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={problemIdentified}
                  onChange={(e) => setProblemIdentified(e.target.value)}
                  placeholder="e.g. Linen trolley left unattended in guest elevator vestibule..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Corrective Action Required <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={correctiveActionRequired}
                  onChange={(e) => setCorrectiveActionRequired(e.target.value)}
                  placeholder="e.g. Move trolley to service closet B4; verify clear passage in corridor..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Responsible Person <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={responsiblePersonId}
                    onChange={(e) => setResponsiblePersonId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select team member...</option>
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Target Completion Time
                  </label>
                  <input
                    type="datetime-local"
                    value={targetCompletionTime}
                    onChange={(e) => setTargetCompletionTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Supervisor Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional context or expectations..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
              </div>

              {/* Security & Financial Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                  Authority Boundary Notice
                </span>
                <p>
                  Corrective actions are restricted to operational and service execution. Supervisors do not have
                  authority to issue guest monetary refunds, pricing changes, or billing credits.
                </p>
              </div>
            </>
          )}

          {mode === 'resolve' && action && (
            <>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div>
                  <span className="text-slate-500">Problem: </span>
                  <span className="font-semibold text-slate-900">{action.problemIdentified}</span>
                </div>
                <div>
                  <span className="text-slate-500">Required Action: </span>
                  <span className="font-semibold text-slate-900">{action.correctiveActionRequired}</span>
                </div>
                <div>
                  <span className="text-slate-500">Responsible: </span>
                  <span className="font-semibold text-slate-900">{action.responsiblePerson}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Resolution Verification Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Confirm how the corrective action was executed and verified by supervisor..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className={
                mode === 'resolve'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }
            >
              {isSubmitting
                ? 'Processing...'
                : mode === 'resolve'
                ? 'Mark Resolved'
                : 'Issue Action Ticket'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
