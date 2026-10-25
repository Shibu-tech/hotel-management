import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, ArrowUpRight, Clock, Shield } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { ESCALATION_LEVELS } from '../../utils/taskStatus';
import { useTasks } from '../../context/TaskContext';

export default function EscalateModal({
  isOpen,
  onClose,
  task
}) {
  const { escalateTask } = useTasks();

  const [selectedLevelId, setSelectedLevelId] = useState(ESCALATION_LEVELS[0].id);
  const [reason, setReason] = useState('');
  const [urgency, setUrgency] = useState('high');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task) return null;

  const currentLevel = ESCALATION_LEVELS.find((l) => l.id === selectedLevelId) || ESCALATION_LEVELS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      escalateTask(task.id, {
        level: currentLevel.role,
        destination: currentLevel.label,
        reason: reason.trim(),
        urgency
      });
      setIsSubmitting(false);
      onClose();
    }, 250);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Escalate Operational Task"
      subtitle={`Formally route ${task.id} through hotel incident management SLA`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Details */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div className="font-bold text-slate-800">{task.id} — {task.title}</div>
          <div className="text-slate-500 mt-0.5">{task.location} • Current Priority: <strong className="uppercase">{task.priority}</strong></div>
        </div>

        {/* Escalation Destination */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Escalation Destination (Hierarchy Path)
          </label>
          <div className="space-y-2">
            {ESCALATION_LEVELS.map((lvl) => {
              const isSelected = selectedLevelId === lvl.id;
              const isSecurity = lvl.id === 'emergency_security';
              return (
                <div
                  key={lvl.id}
                  onClick={() => setSelectedLevelId(lvl.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? isSecurity
                        ? 'border-red-500 bg-red-50 ring-2 ring-red-400/20'
                        : 'border-blue-500 bg-blue-50 ring-2 ring-blue-400/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSecurity ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isSecurity ? <ShieldAlert className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{lvl.label}</div>
                      <div className="text-[11px] text-slate-500">{lvl.role}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                    SLA: {lvl.sla}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgency Level */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Escalation Urgency
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'medium', label: 'Medium Priority', desc: 'Standard SLA' },
              { id: 'high', label: 'High Priority', desc: 'SLA Exceeded / Impasse' },
              { id: 'immediate', label: 'Urgent / Immediate', desc: 'Safety / VIP Hazard' }
            ].map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => setUrgency(u.id)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  urgency === u.id
                    ? 'border-red-500 bg-red-50/70 text-red-900 font-semibold ring-1 ring-red-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold">{u.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{u.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Escalation Reason */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Formal Escalation Justification <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Document why routine department dispatch cannot resolve this issue..."
            required
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Standard Escalation Notice */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
          <strong>Protocol Reminder:</strong> Front desk remains primary contact with guest unless direct supervisor intervention is requested. Emergency or safety incidents alert Security Dispatch directly.
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            size="md"
            icon={ShieldAlert}
            disabled={!reason.trim() || isSubmitting}
            loading={isSubmitting}
          >
            Confirm & Dispatch Escalation
          </Button>
        </div>
      </form>
    </Modal>
  );
}
