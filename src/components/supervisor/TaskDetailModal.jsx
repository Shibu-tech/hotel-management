import React from 'react';
import {
  X,
  MapPin,
  Clock,
  User,
  Calendar,
  AlertOctagon,
  ClipboardCheck,
  CheckCircle2,
  RotateCcw,
  Camera,
  History,
  FileCheck,
  ShieldAlert,
  ArrowRightLeft
} from 'lucide-react';
import {
  formatDateTime,
  formatTimeRemaining,
  getStatusStyle,
  getPriorityStyle,
  getInspectionStatusStyle
} from '../../utils/taskStatus';
import Button from '../ui/Button';

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onReassign,
  onInspect,
  onCorrectiveAction,
  onEscalate,
  onBlocker
}) {
  if (!isOpen || !task) return null;

  const statusStyle = getStatusStyle(task.status);
  const priorityStyle = getPriorityStyle(task.priority);
  const inspectionStyle = getInspectionStatusStyle(task.inspectionStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#172B4D] text-white flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-900 text-blue-200 border border-blue-700">
              {task.id}
            </span>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${priorityStyle.bg} ${priorityStyle.text}`}>
                {priorityStyle.label} Priority
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                {task.status}
              </span>
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Title & Location */}
          <div>
            <h2 className="text-xl font-bold text-slate-900">{task.title}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-800">{task.location}</span>
              </div>
              <div>•</div>
              <div>
                Category: <span className="font-semibold text-slate-800">{task.category}</span>
              </div>
              <div>•</div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Deadline: {formatTimeRemaining(task.dueAt, task.status)}</span>
              </div>
            </div>
          </div>

          {/* Key Assignee & Schedule Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <p className="text-slate-500 font-medium">Assigned Staff</p>
              <div className="flex items-center gap-2 mt-1">
                <User className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-900">
                  {task.assignedTo?.name || 'Unassigned'}
                </span>
              </div>
              {task.assignedTo?.shift && (
                <p className="text-[11px] text-slate-500 mt-0.5">{task.assignedTo.shift}</p>
              )}
            </div>

            <div>
              <p className="text-slate-500 font-medium">Created Time</p>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-slate-800">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{formatDateTime(task.createdAt)}</span>
              </div>
            </div>

            <div>
              <p className="text-slate-500 font-medium">Inspection State</p>
              <div className="mt-1">
                <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${inspectionStyle.bg} ${inspectionStyle.text} border ${inspectionStyle.border}`}>
                  {inspectionStyle.label}
                </span>
              </div>
            </div>
          </div>

          {/* Instructions & Deliverables */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Instructions & Standard Operating Deliverables
            </h3>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed">
              {task.instructions || 'Standard departmental procedure applies.'}
            </div>
            {task.internalNotes && (
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                <span className="font-bold">Internal Operational Notes: </span>
                {task.internalNotes}
              </div>
            )}
          </div>

          {/* Completion Details & Evidence (if completed) */}
          {(task.completedAt || task.completionNotes || (task.completionEvidence && task.completionEvidence.length > 0)) && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Completion Submission
              </h3>
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
                <div className="flex items-center justify-between text-emerald-950 font-semibold">
                  <span>Completed At: {formatDateTime(task.completedAt)}</span>
                  <span>By: {task.assignedTo?.name || 'Staff Attendant'}</span>
                </div>
                {task.completionNotes && (
                  <p className="text-emerald-900 bg-white/70 p-2.5 rounded-lg border border-emerald-100">
                    "{task.completionNotes}"
                  </p>
                )}
                {task.completionEvidence && task.completionEvidence.length > 0 && (
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    {task.completionEvidence.map((ev) => (
                      <div key={ev.id} className="p-2 bg-white rounded-lg border border-emerald-200 flex items-center gap-2">
                        {ev.type === 'photo' && ev.url ? (
                          <img src={ev.url} alt={ev.label} className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <Camera className="w-5 h-5 text-emerald-600" />
                        )}
                        <span className="font-semibold text-slate-800 truncate">{ev.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Blocker or Delay */}
          {(task.blockerInfo || task.delayInfo) && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-red-600" />
                Active Barrier / Operational Blocker
              </h3>
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-950 space-y-2">
                <div className="font-bold flex items-center justify-between">
                  <span>Reason: {task.blockerInfo?.category || task.delayInfo?.reason}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-red-200 text-red-900 font-bold">
                    {task.blockerInfo?.status || 'Active Delay'}
                  </span>
                </div>
                <p>{task.blockerInfo?.description || task.delayInfo?.notes}</p>
                <div className="pt-1 flex items-center justify-between text-[11px] text-red-800 border-t border-red-200">
                  <span>Responsible: {task.blockerInfo?.responsiblePerson || task.delayInfo?.reportedBy}</span>
                  <span>Next: {task.blockerInfo?.nextAction || task.delayInfo?.nextAction}</span>
                </div>
              </div>
            </div>
          )}

          {/* Complete Audit History Timeline */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-500" />
              Protected Audit Trail ({task.history?.length || 0} events)
            </h3>
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-56 overflow-y-auto bg-slate-50/50">
              {task.history && task.history.length > 0 ? (
                task.history.map((h, i) => (
                  <div key={h.id || i} className="p-3 text-xs flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{h.event}</span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-[11px] text-blue-700 font-semibold">{h.actor}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{h.details}</p>
                      {h.reason && (
                        <p className="text-amber-800 text-[10px] font-semibold mt-0.5">
                          Reason: {h.reason}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {formatDateTime(h.timestamp)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">No activity history recorded.</div>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {onInspect && task.status === 'Completed' && (
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  onInspect(task);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
              >
                <ClipboardCheck className="w-4 h-4 mr-1.5" />
                Inspect & Verify
              </Button>
            )}

            {onReassign && (
              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  onReassign(task);
                }}
                className="text-xs"
              >
                <User className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                Reassign Task
              </Button>
            )}

            {onCorrectiveAction && (
              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  onCorrectiveAction(task);
                }}
                className="text-xs"
              >
                <FileCheck className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                Corrective Action
              </Button>
            )}

            {onEscalate && (
              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  onEscalate(task);
                }}
                className="text-xs text-red-600 hover:bg-red-50 border-red-200"
              >
                <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-red-600" />
                Escalate
              </Button>
            )}
          </div>

          <Button variant="outline" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
