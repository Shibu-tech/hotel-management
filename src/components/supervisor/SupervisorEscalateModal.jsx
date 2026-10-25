import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  ArrowUpRight,
  Flame,
  Clock,
  User,
  Info
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { SUPERVISOR_ESCALATION_LEVELS } from '../../utils/taskStatus';
import Button from '../ui/Button';

export default function SupervisorEscalateModal({ isOpen, onClose, task, blocker = null }) {
  const { escalateSupervisorTask, supervisorProfile } = useTasks();

  const [targetRoleId, setTargetRoleId] = useState(SUPERVISOR_ESCALATION_LEVELS[1].id); // Default to Dept Operations Manager
  const [severity, setSeverity] = useState('high'); // 'routine' | 'high' | 'critical' | 'emergency'
  const [reason, setReason] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [expectedResponseTime, setExpectedResponseTime] = useState('30 minutes');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || (!task && !blocker)) return null;

  const targetTask = task || { id: blocker?.taskId, title: blocker?.taskTitle, location: blocker?.location };

  const handleTargetChange = (e) => {
    const val = e.target.value;
    setTargetRoleId(val);
    const selected = SUPERVISOR_ESCALATION_LEVELS.find((l) => l.id === val);
    if (selected) {
      setExpectedResponseTime(selected.sla);
      if (val === 'emergency_security') {
        setSeverity('emergency');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!reason.trim()) {
      setError('Please provide a specific justification for this escalation.');
      return;
    }

    const selectedTarget = SUPERVISOR_ESCALATION_LEVELS.find((l) => l.id === targetRoleId);

    setIsSubmitting(true);
    escalateSupervisorTask(targetTask.id, {
      escalationReason: reason.trim(),
      severity,
      targetRole: selectedTarget ? selectedTarget.label : 'Management',
      nextAction: nextAction.trim(),
      expectedResponseTime,
      notes: notes.trim()
    });

    setIsSubmitting(false);
    onClose();
  };

  const isEmergency = severity === 'emergency' || targetRoleId === 'emergency_security';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div
          className={`px-6 py-4 text-white flex items-center justify-between border-b ${
            isEmergency ? 'bg-red-950 border-red-800' : 'bg-[#172B4D] border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                isEmergency ? 'bg-red-600' : 'bg-orange-600'
              }`}
            >
              {isEmergency ? <Flame className="w-5 h-5 text-white" /> : <ShieldAlert className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {isEmergency ? 'EMERGENCY INCIDENT ESCALATION' : 'Formal Management Escalation'}
              </h2>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Incident / Task Details */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-blue-600">{targetTask.id}</span>
              <span className="text-slate-500 font-medium">{targetTask.location}</span>
            </div>
            <p className="font-bold text-slate-900">{targetTask.title}</p>
          </div>

          {/* Severity Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Escalation Severity Level <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSeverity('routine')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  severity === 'routine'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold ring-2 ring-blue-500/30'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                Routine Dept
              </button>
              <button
                type="button"
                onClick={() => setSeverity('high')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  severity === 'high'
                    ? 'border-orange-600 bg-orange-50 text-orange-800 font-bold ring-2 ring-orange-500/30'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                High / Operational
              </button>
              <button
                type="button"
                onClick={() => {
                  setSeverity('emergency');
                  setTargetRoleId('emergency_security');
                  setExpectedResponseTime('Immediate Protocol');
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  severity === 'emergency'
                    ? 'border-red-600 bg-red-50 text-red-800 font-bold ring-2 ring-red-500/30'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                🚨 Emergency / Safety
              </button>
            </div>
          </div>

          {/* Target Role in Escalation Chain */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Target Authority / Recipient <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={targetRoleId}
              onChange={handleTargetChange}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
            >
              {SUPERVISOR_ESCALATION_LEVELS.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.label} — [SLA: {level.sla}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Escalation Reason & Immediate Context <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State reason for escalating beyond supervisor delegated authority..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Requested Management Action
              </label>
              <input
                type="text"
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder="e.g. Authorize contractor emergency access"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Expected Response Time
              </label>
              <input
                type="text"
                value={expectedResponseTime}
                onChange={(e) => setExpectedResponseTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>
          </div>

          {/* Emergency SLA Notice */}
          {isEmergency && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-red-700">
                <Flame className="w-4 h-4 text-red-600" />
                Immediate Safety & Security Protocol
              </span>
              <p className="text-[11px] leading-relaxed">
                Emergency incidents bypass standard routine SLAs and immediately dispatch to Security, Duty Manager,
                and Safety response teams.
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !reason.trim()}
              className={
                isEmergency
                  ? 'bg-red-600 hover:bg-red-700 text-white font-bold'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }
            >
              {isSubmitting ? 'Transmitting Escalation...' : isEmergency ? 'Dispatch Emergency Protocol' : 'Submit Escalation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
