import React, { useState } from 'react';
import { Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { DELAY_REASONS } from '../../utils/taskStatus';
import { useTasks } from '../../context/TaskContext';

export default function DelayModal({
  isOpen,
  onClose,
  task,
  onSwitchToEscalate
}) {
  const { recordDelay } = useTasks();

  const [reason, setReason] = useState(DELAY_REASONS[0]);
  const [explanation, setExplanation] = useState('');
  const [revisedTime, setRevisedTime] = useState(() => {
    // Default +45 mins from now
    const d = new Date(Date.now() + 45 * 60 * 1000);
    return d.toISOString().slice(0, 16);
  });
  const [nextAction, setNextAction] = useState('Front desk notified; technician dispatched');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!explanation.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      recordDelay(task.id, {
        reason,
        explanation: explanation.trim(),
        revisedExpectedAt: new Date(revisedTime).toISOString(),
        nextAction: nextAction.trim()
      });
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Operational Delay"
      subtitle={`Log delay reason and revise expected completion SLA for ${task.id}`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Banner */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div className="font-bold text-slate-800">{task.id} — {task.title}</div>
          <div className="text-slate-500 mt-0.5">{task.location} • Assigned to: {task.assignedTo?.name || 'Unassigned'}</div>
        </div>

        {/* Reason Select */}
        <Select
          label="Primary Delay Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          options={DELAY_REASONS}
          required
        />

        {/* Explanation text */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Detailed Operational Explanation <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Explain the specific root cause and current status..."
            required
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Revised Expected Completion Time */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Revised Target Completion Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={revisedTime}
            onChange={(e) => setRevisedTime(e.target.value)}
            required
            className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Next Action */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Next Action / Mitigating Steps <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            placeholder="e.g. Front desk calling guest room..."
            required
            className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Suggest Escalation */}
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs flex items-center justify-between text-blue-900">
          <div>
            <span className="font-bold">Severe or Unresolved SLA Delay?</span>
            <p className="text-[11px] text-blue-700 mt-0.5">You can escalate this task to the Department Supervisor or Hotel Manager.</p>
          </div>
          {onSwitchToEscalate && (
            <button
              type="button"
              onClick={onSwitchToEscalate}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 underline shrink-0 ml-3"
            >
              Escalate Task →
            </button>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="warning"
            size="md"
            icon={Clock}
            disabled={!explanation.trim() || isSubmitting}
            loading={isSubmitting}
          >
            Record Delay & Update SLA
          </Button>
        </div>
      </form>
    </Modal>
  );
}
