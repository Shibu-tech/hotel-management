import React, { useState } from 'react';
import {
  X,
  CreditCard,
  RotateCcw,
  ShieldCheck,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Server
} from 'lucide-react';

export default function RefundExecutionModal({
  refundRequest,
  isOpen,
  onClose,
  onExecuteRefund
}) {
  if (!isOpen || !refundRequest) return null;

  const [isProcessing, setIsProcessing] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  const idempotencyKey = refundRequest.idempotencyKey || `idemp_exec_${refundRequest.id}_${Date.now()}`;

  const handleExecute = () => {
    setIsProcessing(true);
    // Simulate real gateway latency
    setTimeout(() => {
      const res = onExecuteRefund({
        refundId: refundRequest.id,
        idempotencyKey
      });
      setIsProcessing(false);
      setExecutionResult(res);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Execute Gateway Refund
              </h3>
              <p className="text-xs text-slate-500">
                Authorized Request: <span className="font-mono font-semibold text-slate-700">{refundRequest.id}</span>
              </p>
            </div>
          </div>

          {!isProcessing && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-5 space-y-4">
          {executionResult ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900 text-sm">
                  Gateway Refund Completed Successfully
                </h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Disbursed <span className="font-bold">${refundRequest.amount?.toFixed(2)}</span> to guest card.
                </p>
                <div className="mt-3 p-2 bg-white rounded border border-emerald-200 text-left font-mono text-[11px] text-slate-700 space-y-1">
                  <div><strong>Provider Ref:</strong> {executionResult.providerRefundId}</div>
                  <div><strong>Transaction:</strong> {executionResult.transactionId}</div>
                  <div><strong>Idempotency:</strong> {idempotencyKey}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Close & Return to Queue
              </button>
            </div>
          ) : (
            <>
              {/* Summary Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-500">Refund Disbursement:</span>
                  <span className="text-xl font-bold text-emerald-600">${refundRequest.amount?.toFixed(2)} {refundRequest.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Guest:</span>
                  <span className="font-semibold text-slate-800">{refundRequest.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Original Transaction:</span>
                  <span className="font-mono text-slate-700">{refundRequest.originalTransactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Authorized Approver:</span>
                  <span className="font-medium text-slate-800">{refundRequest.approver?.name || 'Department Manager'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Gateway Target:</span>
                  <span className="font-medium text-blue-700 flex items-center gap-1">
                    <Server className="w-3.5 h-3.5" />
                    Stripe Core Payments (Simulated API)
                  </span>
                </div>
              </div>

              {/* Idempotency Protection Box */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  Idempotency Key Protected
                </div>
                <p className="text-[10px] text-blue-800 font-mono break-all">
                  Key: {idempotencyKey}
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed pt-0.5">
                  Prevents duplicate execution even if network requests timeout or operator clicks twice.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleExecute}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Executing Gateway API...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Execute Refund (${refundRequest.amount?.toFixed(2)})
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
