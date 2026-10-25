import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  ArrowRight
} from 'lucide-react';

export default function RefundApprovalModal({
  refundRequest,
  currentOperator,
  isOpen,
  onClose,
  onApprove,
  onReject
}) {
  if (!isOpen || !refundRequest) return null;

  const [notes, setNotes] = useState('');
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Separation of duties rule: Requester cannot approve their own refund
  const isSelfRequester = refundRequest.requester?.id === currentOperator?.id;

  // Approval limit rule: check operator's limit ($1,000 for Senior Financial Operator)
  const operatorLimit = currentOperator?.approvalLimitUSD || 1000.00;
  const exceedsLimit = refundRequest.amount > operatorLimit;

  const handleApprove = () => {
    if (isSelfRequester) {
      alert('Separation of Duties Violation: You cannot approve your own refund request.');
      return;
    }
    if (exceedsLimit) {
      alert(`Approval Limit Exceeded: Amount ($${refundRequest.amount.toFixed(2)}) exceeds your delegated authority limit ($${operatorLimit.toFixed(2)}).`);
      return;
    }
    setIsSubmitting(true);
    const res = onApprove({
      refundId: refundRequest.id,
      approvalNotes: notes.trim()
    });
    setIsSubmitting(false);
    if (res?.success) {
      onClose();
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('A specific reason is mandatory to reject a refund request.');
      return;
    }
    setIsSubmitting(true);
    const res = onReject({
      refundId: refundRequest.id,
      rejectionReason: rejectionReason.trim()
    });
    setIsSubmitting(false);
    if (res?.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Independent Refund Review & Approval
              </h3>
              <p className="text-xs text-slate-500">
                Request: <span className="font-mono font-semibold text-slate-700">{refundRequest.id}</span> • {refundRequest.guestName}
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

        <div className="p-5 space-y-4">
          {/* Key Details Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-baseline">
              <span className="text-slate-500 font-medium">Refund Amount:</span>
              <span className="text-xl font-bold text-slate-900">${refundRequest.amount?.toFixed(2)} {refundRequest.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Original Transaction:</span>
              <span className="font-mono text-slate-700">{refundRequest.originalTransactionId} (Original: ${refundRequest.originalAmount?.toFixed(2)})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Linked Folio:</span>
              <span className="font-mono text-slate-700">{refundRequest.folioId} (Room {refundRequest.roomNumber})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Submitted By:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {refundRequest.requester?.name} ({refundRequest.requester?.role})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Category:</span>
              <span className="font-medium text-slate-700">{refundRequest.category}</span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-medium block mb-1">Reason Stated:</span>
              <p className="p-2.5 rounded bg-white border border-slate-200 text-slate-800 italic leading-relaxed">
                "{refundRequest.reason}"
              </p>
            </div>
          </div>

          {/* Separation of Duties Violation Warning */}
          {isSelfRequester && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-2.5 text-xs text-rose-900">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Separation of Duties Violation:</strong>
                You submitted this refund request ({refundRequest.requester?.name}). To prevent fraud and self-dealing, hotel policy strictly prohibits operators from approving their own financial disbursements. Another authorized supervisor or manager must approve this request.
              </div>
            </div>
          )}

          {/* Exceeds Approval Limit Warning */}
          {!isSelfRequester && exceedsLimit && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Approval Limit Exceeded ($1,000.00 Policy Limit):</strong>
                This refund request of ${refundRequest.amount.toFixed(2)} exceeds your delegated limit of ${operatorLimit.toFixed(2)}. Escalation to General Manager or Corporate Finance is required.
              </div>
            </div>
          )}

          {/* Rejection Mode View */}
          {rejectMode ? (
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  Reason for Rejection <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setRejectMode(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Back to approval
                </button>
              </div>
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="State the explicit justification for denying this refund..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectMode(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={isSubmitting || !rejectionReason.trim()}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Approval Notes / Policy Citation (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Verified disturbance log; approved within policy limit..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Action buttons */}
          {!rejectMode && (
            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectMode(true)}
                className="px-3.5 py-2 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4 text-rose-600" />
                Reject Request
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={isSubmitting || isSelfRequester || exceedsLimit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve (${refundRequest.amount?.toFixed(2)})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
