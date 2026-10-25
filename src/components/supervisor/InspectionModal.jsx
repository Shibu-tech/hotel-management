import React, { useState } from 'react';
import {
  X,
  ClipboardCheck,
  CheckCircle2,
  RotateCcw,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Camera,
  FileCheck,
  User,
  Clock,
  MapPin,
  Check
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { formatDateTime, formatTimeRemaining } from '../../utils/taskStatus';
import Button from '../ui/Button';

export default function InspectionModal({ isOpen, onClose, task, onEscalate }) {
  const { inspectTask, supervisorProfile, staff } = useTasks();

  const [activeAction, setActiveAction] = useState('passed'); // 'passed' | 'reopen' | 'correction_requested'
  const [checklistState, setChecklistState] = useState(() => {
    if (task?.inspectionCriteria && Array.isArray(task.inspectionCriteria)) {
      return task.inspectionCriteria.map((item) => ({ text: item, checked: true }));
    }
    return [
      { text: 'All standard service deliverables completed', checked: true },
      { text: 'Room presentation and cleanliness verified', checked: true },
      { text: 'Guest safety and inventory verified', checked: true }
    ];
  });
  const [notes, setNotes] = useState('');
  const [targetAssigneeId, setTargetAssigneeId] = useState(task?.assignedTo?.id || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !task) return null;

  const toggleChecklist = (index) => {
    setChecklistState((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleActionSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (activeAction === 'passed') {
      const allChecked = checklistState.every((item) => item.checked);
      if (!allChecked && !notes.trim()) {
        setError('If any checklist criteria is unchecked, explanatory inspection notes are required.');
        return;
      }
    }

    if (activeAction === 'reopen') {
      if (!notes.trim()) {
        setError('A clear reason and corrective instructions are strictly mandatory to reopen a task.');
        return;
      }
    }

    if (activeAction === 'correction_requested') {
      if (!notes.trim()) {
        setError('Please describe the specific deficiency and the required correction.');
        return;
      }
    }

    setIsSubmitting(true);
    const success = inspectTask(task.id, {
      outcome: activeAction,
      notes: notes.trim(),
      checklist: checklistState,
      targetAssigneeId: activeAction === 'reopen' ? targetAssigneeId : null
    });

    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-[#172B4D] text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Supervisor Quality Inspection</h2>
              <p className="text-xs text-slate-300">
                Reviewing task: <span className="font-mono font-semibold text-blue-300">{task.id}</span>
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

        <form onSubmit={handleActionSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Task Snapshot */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{task.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {task.location}
                  </span>
                  <span>•</span>
                  <span>Category: {task.category}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Awaiting Inspection
              </span>
            </div>

            {/* Completion Details */}
            <div className="pt-2 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <div>
                <span className="text-slate-500">Completed By: </span>
                <span className="font-semibold text-slate-800">
                  {task.assignedTo?.name || 'Assigned Staff'}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Completed At: </span>
                <span className="font-semibold text-slate-800">
                  {formatDateTime(task.completedAt || task.updatedAt)}
                </span>
              </div>
            </div>

            {task.completionNotes && (
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-slate-900">Staff Completion Notes: </span>
                <span>{task.completionNotes}</span>
              </div>
            )}

            {/* Attached Evidence / Photos */}
            {task.completionEvidence && task.completionEvidence.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-slate-500" />
                  Attached Evidence & Photos ({task.completionEvidence.length})
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {task.completionEvidence.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-2 text-xs"
                    >
                      {ev.type === 'photo' && ev.url ? (
                        <img
                          src={ev.url}
                          alt={ev.label}
                          className="w-10 h-10 rounded object-cover ring-1 ring-slate-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      <div className="truncate">
                        <p className="font-semibold text-slate-800 truncate">{ev.label}</p>
                        <p className="text-[10px] text-slate-400">Verified by staff</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Inspection Decision Mode Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Inspection Determination <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveAction('passed')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  activeAction === 'passed'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/30'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Accept Completion</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAction('reopen')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  activeAction === 'reopen'
                    ? 'border-rose-600 bg-rose-50 text-rose-800 ring-2 ring-rose-500/30'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>Reopen Task</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAction('correction_requested')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  activeAction === 'correction_requested'
                    ? 'border-purple-600 bg-purple-50 text-purple-800 ring-2 ring-purple-500/30'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <FileCheck className="w-4 h-4 text-purple-600" />
                <span>Request Correction</span>
              </button>
            </div>
          </div>

          {/* Criteria Checklist (Shown for Accept Completion) */}
          {activeAction === 'passed' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Quality Criteria Verification
              </label>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                {checklistState.map((item, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 hover:text-slate-900 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleChecklist(index)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className={item.checked ? 'font-medium' : 'text-slate-400 line-through'}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Responsible Owner Selection when Reopening */}
          {activeAction === 'reopen' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Assign Responsible Owner for Rework <span className="text-red-500">*</span>
              </label>
              <select
                value={targetAssigneeId}
                onChange={(e) => setTargetAssigneeId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {staff
                  .filter((s) => s.availability !== 'Off Duty')
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role} - {s.shift}) {s.id === task.assignedTo?.id ? '[Original Attendant]' : ''}
                    </option>
                  ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                The task will return to <span className="font-semibold text-amber-700">In Progress</span> with previous completion preserved in history.
              </p>
            </div>
          )}

          {/* Notes / Reason Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              {activeAction === 'passed'
                ? 'Supervisor Approval Notes (Optional)'
                : activeAction === 'reopen'
                ? 'Mandatory Reopening Reason & Corrective Instructions *'
                : 'Correction Details & Deficiencies Identified *'}
            </label>
            <textarea
              required={activeAction !== 'passed'}
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                activeAction === 'passed'
                  ? 'e.g., Executive room standard approved; UV wand verification completed.'
                  : activeAction === 'reopen'
                  ? 'e.g., Sealant in bathroom was still tacky; missed cleaning behind lounge coffee table. Corrective rework required.'
                  : 'e.g., Linens properly placed but pillowcases missing monogram fold; adjust before room release.'
              }
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            {onEscalate && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEscalate(task);
                }}
                className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1.5 p-2 rounded-lg hover:bg-red-50"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Escalate Issue</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className={
                  activeAction === 'passed'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : activeAction === 'reopen'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }
              >
                {isSubmitting
                  ? 'Processing...'
                  : activeAction === 'passed'
                  ? 'Approve & Pass Inspection'
                  : activeAction === 'reopen'
                  ? 'Confirm Reopening'
                  : 'Submit Correction Request'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
