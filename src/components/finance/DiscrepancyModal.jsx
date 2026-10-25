import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Scale,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import FinanceStatusBadge from './FinanceStatusBadge';

export default function DiscrepancyModal({
  discrepancy,
  isOpen,
  onClose,
  onUpdateDiscrepancy
}) {
  if (!isOpen || !discrepancy) return null;

  const [status, setStatus] = useState(discrepancy.status || 'Open');
  const [notes, setNotes] = useState(discrepancy.investigationNotes || '');
  const [nextAction, setNextAction] = useState(discrepancy.nextAction || '');
  const [resolutionDetails, setResolutionDetails] = useState(discrepancy.resolutionDetails || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = onUpdateDiscrepancy({
      discrepancyId: discrepancy.id,
      status,
      investigationNotes: notes.trim(),
      nextAction: nextAction.trim(),
      resolutionDetails: status === 'Resolved' ? (resolutionDetails.trim() || 'Variance resolved and documented.') : resolutionDetails.trim()
    });
    setIsSubmitting(false);
    if (res?.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  Investigate Discrepancy: {discrepancy.id}
                </h3>
                <FinanceStatusBadge status={discrepancy.priority} type="priority" />
              </div>
              <p className="text-xs text-slate-500">
                {discrepancy.type}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Variance Comparison Box */}
          <div className="grid grid-cols-3 gap-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Expected Value</span>
              <span className="text-sm font-bold text-slate-800">${discrepancy.expectedValue?.toFixed(2)}</span>
            </div>
            <div className="border-x border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Recorded Value</span>
              <span className="text-sm font-bold text-slate-800">${discrepancy.recordedValue?.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Calculated Variance</span>
              <span className="text-sm font-bold text-rose-600">${discrepancy.variance?.toFixed(2)}</span>
            </div>
          </div>

          {/* Description & Reference */}
          <div className="text-xs space-y-1">
            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Description</span>
            <p className="text-slate-800 p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 leading-relaxed">
              {discrepancy.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Linked Record:</span>
              <span className="font-mono font-semibold text-slate-800">{discrepancy.linkedTransactionId} / {discrepancy.folioId}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Guest / Room:</span>
              <span className="font-semibold text-slate-800">{discrepancy.guestName} (Room {discrepancy.roomNumber})</span>
            </div>
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Investigation Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Open">Open</option>
              <option value="Investigating">Investigating</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalated</option>
            </select>
          </div>

          {/* Investigation Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Investigation Findings & Audit Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record findings, communications with front desk/housekeeping, or sensor audits..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Resolution Details (if marked resolved) */}
          {status === 'Resolved' && (
            <div>
              <label className="block text-xs font-bold text-emerald-800 mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Resolution Action & Ledger Correction Details
              </label>
              <input
                type="text"
                value={resolutionDetails}
                onChange={(e) => setResolutionDetails(e.target.value)}
                placeholder="e.g. Posted adjustment ADJ-8812 to reverse double charge..."
                className="w-full px-3 py-2 bg-emerald-50/40 border border-emerald-300 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Next Action */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Next Action / Follow-up
            </label>
            <input
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="e.g. Contact guest at desk, review Night Audit report..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              Save Investigation Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
