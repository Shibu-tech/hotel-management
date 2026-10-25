import React from 'react';
import {
  X,
  CreditCard,
  Shield,
  Clock,
  ArrowRightLeft,
  FileText,
  RotateCcw,
  CheckCircle2,
  Lock,
  ExternalLink,
  Receipt
} from 'lucide-react';
import FinanceStatusBadge from './FinanceStatusBadge';

export default function TransactionDetailModal({
  transaction,
  isOpen,
  onClose,
  onRequestRefund,
  onViewFolio
}) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  Transaction {transaction.id}
                </h3>
                <FinanceStatusBadge status={transaction.status} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Provider Reference: <span className="font-mono font-medium text-slate-700">{transaction.providerReference}</span>
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

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Amount Summary Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Gross Amount
              </span>
              <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                ${transaction.amount?.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400">{transaction.currency}</span>
            </div>
            <div className="border-x border-slate-200 px-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Processor Fee
              </span>
              <span className="text-xl font-bold text-slate-600 mt-0.5 block">
                ${transaction.fee?.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400">Gateway Surcharge</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Settled Net
              </span>
              <span className="text-xl font-bold text-emerald-600 mt-0.5 block">
                ${transaction.net?.toFixed(2)}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">To Property Acct</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="divide-y divide-slate-100">
              <div className="flex justify-between p-3 bg-white">
                <span className="text-slate-500 font-medium">Guest / Stay</span>
                <span className="font-semibold text-slate-900">
                  {transaction.guestName} (Room {transaction.roomNumber})
                </span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50/50">
                <span className="text-slate-500 font-medium">Linked Folio</span>
                <span className="font-mono font-semibold text-blue-600 flex items-center gap-1">
                  {transaction.folioId}
                  {onViewFolio && (
                    <button
                      type="button"
                      onClick={() => onViewFolio(transaction.folioId)}
                      className="hover:underline text-[11px] text-blue-700 ml-1 inline-flex items-center"
                    >
                      (View <ExternalLink className="w-3 h-3 ml-0.5" />)
                    </button>
                  )}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-white">
                <span className="text-slate-500 font-medium">Payment Method</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  {transaction.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50/50">
                <span className="text-slate-500 font-medium">Gateway Provider</span>
                <span className="font-medium text-slate-800">
                  {transaction.provider}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-white">
                <span className="text-slate-500 font-medium">Authorization Code</span>
                <span className="font-mono font-medium text-slate-700">
                  {transaction.authCode || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50/50">
                <span className="text-slate-500 font-medium">Settlement Batch</span>
                <span className="font-mono text-slate-700">
                  {transaction.batchId || 'Unbatched / Pending'}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-white">
                <span className="text-slate-500 font-medium">Idempotency Key</span>
                <span className="font-mono text-slate-500 text-[11px]">
                  {transaction.idempotencyKey || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50/50">
                <span className="text-slate-500 font-medium">Refundable Balance</span>
                <span className="font-bold text-slate-900">
                  ${transaction.refundableBalance?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>

          {/* PCI Compliance Notice */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 flex items-center gap-2 text-xs text-slate-600">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              PCI-DSS Security Notice: Primary account numbers, CVVs, and raw payment credentials are encrypted by the payment gateway and are never exposed to operator workstations.
            </span>
          </div>

          {/* Audit Timeline */}
          {transaction.timeline && transaction.timeline.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Transaction Lifecycle Timeline
              </h4>
              <div className="space-y-3 pl-2 border-l-2 border-slate-200 ml-1">
                {transaction.timeline.map((step, idx) => (
                  <div key={idx} className="relative pl-4 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute -left-[1.35rem] top-1 ring-4 ring-white" />
                    <div className="flex items-center justify-between text-slate-900 font-semibold">
                      <span>{step.event}</span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        {new Date(step.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Actor: {step.actor}
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                      {step.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <div>
            {transaction.refundableBalance > 0 && onRequestRefund && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestRefund(transaction);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Request Refund (${transaction.refundableBalance.toFixed(2)} Available)
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
