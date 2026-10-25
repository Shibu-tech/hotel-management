import React, { useState } from 'react';
import {
  X,
  ArrowRightLeft,
  AlertTriangle,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import Button from '../ui/Button';

export default function HandoverModal({
  isOpen,
  onClose,
  mode = 'create', // 'create' | 'acknowledge'
  handover = null,
  prefilledTaskId = null
}) {
  const { tasks, createHandover, acknowledgeHandover, supervisorProfile } = useTasks();

  const [selectedTaskId, setSelectedTaskId] = useState(
    prefilledTaskId || (handover ? handover.taskId : '')
  );
  const [workCompleted, setWorkCompleted] = useState(handover?.workCompleted || '');
  const [outstandingActions, setOutstandingActions] = useState(handover?.outstandingActions || '');
  const [risks, setRisks] = useState(handover?.risks || '');
  const [nextOwner, setNextOwner] = useState(handover?.nextOwner || '');
  const [nextOwnerRole, setNextOwnerRole] = useState(handover?.nextOwnerRole || 'Evening Shift Supervisor');
  const [targetCompletionTime, setTargetCompletionTime] = useState(
    handover?.targetCompletionTime
      ? new Date(handover.targetCompletionTime).toISOString().slice(0, 16)
      : new Date(Date.now() + 120 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [notes, setNotes] = useState(handover?.notes || '');
  const [ackNotes, setAckNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'create') {
      if (!workCompleted.trim()) {
        setError('Please outline work already completed.');
        return;
      }
      if (!outstandingActions.trim()) {
        setError('Please specify the outstanding actions remaining.');
        return;
      }
      if (!nextOwner.trim()) {
        setError('Next responsible person name is required.');
        return;
      }

      const task = tasks.find((t) => t.id === selectedTaskId);

      setIsSubmitting(true);
      createHandover({
        taskId: selectedTaskId || 'N/A',
        taskTitle: task ? task.title : 'Department Shift Handover',
        location: task ? task.location : 'Authorized Department Scope',
        currentStatus: task ? task.status : 'In Progress',
        workCompleted: workCompleted.trim(),
        outstandingActions: outstandingActions.trim(),
        risks: risks.trim(),
        nextOwner: nextOwner.trim(),
        nextOwnerRole: nextOwnerRole.trim(),
        targetCompletionTime: new Date(targetCompletionTime).toISOString(),
        notes: notes.trim()
      });

      setIsSubmitting(false);
      onClose();
    } else if (mode === 'acknowledge') {
      setIsSubmitting(true);
      acknowledgeHandover(handover.id, {
        acknowledgementNotes: ackNotes.trim()
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
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {mode === 'create' ? 'Create Shift Handover Record' : 'Acknowledge Shift Handover'}
              </h2>
              <p className="text-xs text-slate-300">
                {mode === 'create'
                  ? `Current Supervisor: ${supervisorProfile.name}`
                  : `Handover ID: ${handover?.id}`}
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
                  Related Task or Service Area <span className="text-slate-400 font-normal">(Optional if shift-wide)</span>
                </label>
                <select
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">General department shift crossover</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id} - {t.title} ({t.location}) [{t.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Work Completed During Shift <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={workCompleted}
                  onChange={(e) => setWorkCompleted(e.target.value)}
                  placeholder="Summarize actions already executed during current shift..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Outstanding Actions for Next Shift <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={outstandingActions}
                  onChange={(e) => setOutstandingActions(e.target.value)}
                  placeholder="Detail exact next steps required by the incoming team..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Risks, Blockers, or Watchpoints
                </label>
                <textarea
                  rows={2}
                  value={risks}
                  onChange={(e) => setRisks(e.target.value)}
                  placeholder="e.g. Guest arriving at 16:00; elevator lift B offline; VIP sensitivities..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Next Responsible Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nextOwner}
                    onChange={(e) => setNextOwner(e.target.value)}
                    placeholder="e.g. Marcus Wu"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Next Owner Role
                  </label>
                  <input
                    type="text"
                    value={nextOwnerRole}
                    onChange={(e) => setNextOwnerRole(e.target.value)}
                    placeholder="e.g. Evening Supervisor"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Target Completion SLA
                  </label>
                  <input
                    type="datetime-local"
                    value={targetCompletionTime}
                    onChange={(e) => setTargetCompletionTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Handover Notes
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Briefing delivered on radio channel 01"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Informational rule notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  Handover maintains complete ownership continuity. Creating a handover does not close, complete,
                  or cancel underlying tasks.
                </p>
              </div>
            </>
          )}

          {mode === 'acknowledge' && handover && (
            <>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
                <div>
                  <span className="text-slate-500">Handover Item: </span>
                  <span className="font-bold text-slate-900">{handover.taskTitle}</span>
                </div>
                <div>
                  <span className="text-slate-500">Current Owner: </span>
                  <span className="font-semibold text-slate-800">{handover.currentOwner}</span>
                </div>
                <div>
                  <span className="text-slate-500">Work Already Completed: </span>
                  <p className="font-medium text-slate-800 mt-0.5">{handover.workCompleted}</p>
                </div>
                <div>
                  <span className="text-slate-500">Outstanding Actions: </span>
                  <p className="font-medium text-blue-900 mt-0.5">{handover.outstandingActions}</p>
                </div>
                {handover.risks && (
                  <div>
                    <span className="text-slate-500">Risks / Watchpoints: </span>
                    <p className="font-medium text-amber-800 mt-0.5">{handover.risks}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Acknowledgement Notes & Confirmation
                </label>
                <textarea
                  rows={3}
                  value={ackNotes}
                  onChange={(e) => setAckNotes(e.target.value)}
                  placeholder="e.g. Briefing received and confirmed on floor crossover. Tech dispatched."
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
                mode === 'acknowledge'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            >
              {isSubmitting
                ? 'Processing...'
                : mode === 'acknowledge'
                ? 'Confirm Acknowledgement'
                : 'Create Shift Handover'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
