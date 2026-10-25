import React from 'react';
import {
  X,
  CreditCard,
  Plus,
  Scale,
  Receipt,
  RotateCcw,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import FinanceStatusBadge from './FinanceStatusBadge';

export default function FolioDetailsModal({
  folio,
  isOpen,
  onClose,
  onOpenPaymentModal,
  onOpenAdjustmentModal,
  canRecordPayment = true,
  canAdjust = true
}) {
  if (!isOpen || !folio) return null;

  const totalCharges = (folio.charges || []).reduce((acc, c) => acc + Number(c.amount || 0), 0);
  const totalPayments = (folio.payments || []).reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const totalRefunds = (folio.refunds || []).reduce((acc, r) => acc + Number(r.amount || 0), 0);
  const calculatedBalance = Number((totalCharges - totalPayments + totalRefunds).toFixed(2));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  Guest Folio: {folio.folioId}
                </h3>
                <FinanceStatusBadge status={calculatedBalance <= 0 ? 'Settled' : 'Open'} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Reservation: <span className="font-semibold text-slate-700">{folio.reservationId}</span> • Guest: <span className="font-semibold text-slate-800">{folio.guestName}</span> (Room {folio.roomNumber})
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

        {/* Balance Overview Card */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900 text-white text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Charges</span>
              <span className="text-lg font-bold text-white block mt-0.5">${totalCharges.toFixed(2)}</span>
            </div>
            <div className="border-l border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Payments</span>
              <span className="text-lg font-bold text-emerald-400 block mt-0.5">${totalPayments.toFixed(2)}</span>
            </div>
            <div className="border-l border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Refunds</span>
              <span className="text-lg font-bold text-purple-400 block mt-0.5">${totalRefunds.toFixed(2)}</span>
            </div>
            <div className="border-l border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Outstanding Due</span>
              <span className={`text-xl font-bold block mt-0.5 ${calculatedBalance > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                ${calculatedBalance.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Charges Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <span>Posted Charges & Taxes ({folio.charges?.length || 0})</span>
              </h4>
              {canAdjust && (
                <button
                  type="button"
                  onClick={() => onOpenAdjustmentModal(folio)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Post Adjustment
                </button>
              )}
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[10px] uppercase">
                  <tr>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Description</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {folio.charges?.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-slate-500">{c.date}</td>
                      <td className="py-2 px-3 font-medium text-slate-700">{c.category}</td>
                      <td className="py-2 px-3 text-slate-600">{c.description}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900">
                        ${Number(c.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payments & Credits Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <span>Applied Payments & Credits ({folio.payments?.length || 0})</span>
              </h4>
              {canRecordPayment && calculatedBalance > 0 && (
                <button
                  type="button"
                  onClick={() => onOpenPaymentModal(folio)}
                  className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Collect Payment
                </button>
              )}
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[10px] uppercase">
                  <tr>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Method</th>
                    <th className="py-2 px-3">Auth Code</th>
                    <th className="py-2 px-3">Recorded By</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {folio.payments?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-3 text-center text-slate-400">
                        No payments recorded yet.
                      </td>
                    </tr>
                  ) : (
                    folio.payments?.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 text-slate-500">{p.date}</td>
                        <td className="py-2 px-3 font-medium text-slate-800">{p.method}</td>
                        <td className="py-2 px-3 font-mono text-slate-600">{p.authCode}</td>
                        <td className="py-2 px-3 text-slate-500">{p.recordedBy}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600">
                          ${Number(p.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Refunds Table if any */}
          {folio.refunds && folio.refunds.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Processed Refunds ({folio.refunds.length})
              </h4>
              <div className="border border-purple-200 bg-purple-50/20 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-purple-50 border-b border-purple-200 text-purple-700 font-semibold text-[10px] uppercase">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Reason</th>
                      <th className="py-2 px-3">Provider Ref</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100">
                    {folio.refunds.map((r, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 text-slate-500">{r.date}</td>
                        <td className="py-2 px-3 text-slate-800">{r.reason}</td>
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-600">{r.providerRef}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-purple-700">
                          -${Number(r.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {canRecordPayment && calculatedBalance > 0 && (
              <button
                type="button"
                onClick={() => onOpenPaymentModal(folio)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Collect Payment (${calculatedBalance.toFixed(2)})
              </button>
            )}
            {canAdjust && (
              <button
                type="button"
                onClick={() => onOpenAdjustmentModal(folio)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Post Adjustment
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
