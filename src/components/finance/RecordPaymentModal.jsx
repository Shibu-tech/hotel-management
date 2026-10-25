import React, { useState } from 'react';
import { X, CreditCard, DollarSign, ShieldCheck, Lock } from 'lucide-react';
import { PAYMENT_METHODS } from '../../data/mockFinanceData';

export default function RecordPaymentModal({
  folio,
  isOpen,
  onClose,
  onRecordPayment
}) {
  if (!isOpen || !folio) return null;

  const [amount, setAmount] = useState(folio.balance > 0 ? folio.balance.toFixed(2) : '100.00');
  const [method, setMethod] = useState(PAYMENT_METHODS[0].label);
  const [notes, setNotes] = useState('Front desk terminal checkout payment');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = onRecordPayment({
      folioId: folio.folioId,
      amount: Number(amount),
      paymentMethod: method,
      notes
    });
    setIsSubmitting(false);
    if (res?.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Record Authorized Payment
              </h3>
              <p className="text-xs text-slate-500">
                Folio: <span className="font-mono font-semibold text-slate-700">{folio.folioId}</span> • {folio.guestName}
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
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Payment Amount (USD)
              </label>
              {folio.balance > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(folio.balance.toFixed(2))}
                  className="text-[11px] text-blue-600 hover:underline font-medium"
                >
                  Pay Outstanding (${folio.balance.toFixed(2)})
                </button>
              )}
            </div>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Payment Method & Channel
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm.id} value={pm.label}>
                  {pm.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Transaction Notes / Terminal Ref
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Front desk terminal payment, manual card swipe..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg flex items-start gap-2 text-[11px] text-emerald-800">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Direct gateway integration will generate a secure authorization token (<span className="font-mono font-semibold">AUTH-XXXXX</span>) and update the ledger immediately.
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
              disabled={isSubmitting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Collect ${Number(amount || 0).toFixed(2)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
