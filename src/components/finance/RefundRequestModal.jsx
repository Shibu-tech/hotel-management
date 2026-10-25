import React, { useState } from 'react';
import { X, RotateCcw, AlertCircle, Shield, DollarSign } from 'lucide-react';

export default function RefundRequestModal({
  transaction,
  isOpen,
  onClose,
  onSubmitRequest
}) {
  if (!isOpen || !transaction) return null;

  const maxRefundable = transaction.refundableBalance || transaction.amount || 0;
  const [amount, setAmount] = useState(maxRefundable > 0 ? (maxRefundable > 100 ? '100.00' : maxRefundable.toFixed(2)) : '0.00');
  const [category, setCategory] = useState('Service Recovery');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Service Recovery',
    'Room Facility Defect / Noise',
    'Early Departure Waiver',
    'Billing / Rate Overcharge',
    'F&B Quality Dissatisfaction',
    'Key Card / Access Failure',
    'Special Management Discretion'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('A clear reason is required for refund requests.');
      return;
    }
    const numAmount = Number(amount);
    if (numAmount <= 0 || numAmount > maxRefundable) {
      alert(`Refund amount must be between $0.01 and $${maxRefundable.toFixed(2)}.`);
      return;
    }

    setIsSubmitting(true);
    const res = onSubmitRequest({
      originalTransactionId: transaction.id,
      amount: numAmount,
      reason: reason.trim(),
      category
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
            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Submit Refund Request
              </h3>
              <p className="text-xs text-slate-500">
                Original Txn: <span className="font-mono font-semibold text-slate-700">{transaction.id}</span> ({transaction.guestName})
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
          {/* Transaction Metadata Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Original Capture</span>
              <span className="font-bold text-slate-800">${transaction.amount?.toFixed(2)}</span>
            </div>
            <div className="border-x border-slate-200">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Refundable Max</span>
              <span className="font-bold text-emerald-600">${maxRefundable.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Payment Method</span>
              <span className="font-semibold text-slate-700 truncate block text-[11px]">{transaction.paymentMethod}</span>
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Requested Refund Amount (USD)
              </label>
              <button
                type="button"
                onClick={() => setAmount(maxRefundable.toFixed(2))}
                className="text-[11px] text-purple-600 hover:underline font-semibold"
              >
                Max (${maxRefundable.toFixed(2)})
              </button>
            </div>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={maxRefundable}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Refund Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Detailed Reason & Guest Circumstances <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">Required</span>
            </div>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the exact factual reason for this refund request..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Separation of Duties Notice */}
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg flex items-start gap-2 text-[11px] text-purple-900 leading-relaxed">
            <Shield className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <span>
              <strong>Hotel Separation of Duties Policy:</strong> Submitting this request places it into the <span className="font-semibold">Pending Approval</span> queue. As requester, you cannot approve this refund; an independent authorized approver (Department Manager or Senior Financial Officer) must review and authorize it before gateway execution.
            </span>
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
              disabled={isSubmitting || !reason.trim() || Number(amount) <= 0 || Number(amount) > maxRefundable}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Submit Request (${Number(amount || 0).toFixed(2)})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
