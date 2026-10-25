import React, { useState } from 'react';
import {
  X,
  LogOut,
  AlertTriangle,
  Receipt,
  CreditCard,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Brush,
  ShieldCheck
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function CheckOutModal({ isOpen, onClose, reservation }) {
  const {
    performCheckOut,
    folios,
    recordFolioPayment,
    frontDeskProfile
  } = useTasks();

  const [keyCardsReturned, setKeyCardsReturned] = useState(true);
  const [settlementNotes, setSettlementNotes] = useState('');
  const [collectPaymentNow, setCollectPaymentNow] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Visa ending 4812');
  const [formError, setFormError] = useState('');

  if (!isOpen || !reservation) return null;

  const linkedFolio = folios.find((f) => f.reservationId === reservation.id);
  const balance = linkedFolio ? linkedFolio.balance : reservation.folioBalance || 0;
  const hasOutstandingBalance = balance > 0;
  const hasFinancialAccess = frontDeskProfile?.hasFinancialAccess !== false;

  const handleCollectPayment = (e) => {
    e.preventDefault();
    if (!linkedFolio) return;
    const amt = Number(paymentAmount) || balance;
    const res = recordFolioPayment({
      folioId: linkedFolio.folioId,
      amount: amt,
      method: paymentMethod,
      authCode: `AUTH-${Math.floor(10000 + Math.random() * 90000)}`
    });
    if (res.success) {
      setCollectPaymentNow(false);
    }
  };

  const handleConfirmCheckOut = () => {
    setFormError('');

    if (hasOutstandingBalance && !settlementNotes && !collectPaymentNow) {
      // Prompt user or record settlement note
      setFormError('Outstanding balance of $' + balance.toFixed(2) + ' detected. Please settle or note authorized billing disposition.');
      return;
    }

    const res = performCheckOut({
      reservationId: reservation.id,
      keyCardsReturned,
      settlementNotes: settlementNotes ? `Note: ${settlementNotes}` : 'Folio settled upon departure.'
    });

    if (res.success) {
      onClose();
    } else {
      setFormError(res.error || 'Failed to complete check-out.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#172B4D] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Process Guest Check-Out</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  Room {reservation.assignedRoom}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Front Desk Operations • Turnover Dispatch Automation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guest & Stay Summary */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 grid grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block">Guest Name</span>
            <span className="font-bold text-slate-900">{reservation.guestName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Stay Duration</span>
            <span className="font-medium text-slate-900">
              {reservation.nights} Nights ({reservation.arrivalDate} – {reservation.departureDate})
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Room</span>
            <span className="font-bold text-blue-700">Room {reservation.assignedRoom}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="font-medium">{formError}</div>
            </div>
          )}

          {/* Folio & Financial Clearance */}
          {hasFinancialAccess ? (
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Folio Balance Review
                  </h4>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    balance === 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800 animate-pulse'
                  }`}
                >
                  {balance === 0 ? 'Fully Settled ($0.00)' : `Outstanding: $${balance.toFixed(2)}`}
                </span>
              </div>

              {hasOutstandingBalance ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                    <div>
                      <strong>Pending Balance:</strong> Mini-bar, room service, or incidentals totaling{' '}
                      <span className="font-bold text-amber-950">${balance.toFixed(2)}</span> are unpaid.
                    </div>
                    {!collectPaymentNow && (
                      <button
                        type="button"
                        onClick={() => {
                          setCollectPaymentNow(true);
                          setPaymentAmount(balance.toFixed(2));
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 text-xs shadow-xs"
                      >
                        Collect Now
                      </button>
                    )}
                  </div>

                  {collectPaymentNow && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-slate-800">
                        Process Settlement Payment
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-slate-600 mb-0.5">Amount ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 mb-0.5">Payment Method</label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                          >
                            <option value="Visa ending 4812">Card on File (Visa •• 4812)</option>
                            <option value="Cash Tendered">Cash Tendered</option>
                            <option value="Corporate Direct Bill">Corporate Direct Bill</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setCollectPaymentNow(false)}
                          className="px-2.5 py-1 rounded border border-slate-300 text-xs text-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleCollectPayment}
                          className="px-3 py-1 rounded bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700"
                        >
                          Record Payment
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Billing Remarks / Late Settlement Authorization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Authorized direct bill to corporate master account"
                      value={settlementNotes}
                      onChange={(e) => setSettlementNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>All room rates, taxes, and incidentals have been settled in full.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 text-xs text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Folio financial ledger handled by hotel cashiering department.</span>
            </div>
          )}

          {/* Key Return */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={keyCardsReturned}
                onChange={(e) => setKeyCardsReturned(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-900 block flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                  Key Cards Returned to Front Desk
                </span>
                <span className="text-slate-500 text-[11px]">
                  Confirmed RFID access cards returned for sanitization & reprogramming.
                </span>
              </div>
            </label>
          </div>

          {/* Housekeeping Turnover Automation Notice */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-blue-950">
              <Brush className="w-4 h-4 text-blue-600" />
              Automated Housekeeping Turnover Protocol
            </div>
            <p className="text-blue-800 leading-relaxed">
              Upon confirming check-out, <strong>Room {reservation.assignedRoom}</strong> will be immediately marked as <strong>"Dirty / Turnover Required"</strong>. A high-priority cleaning & sanitization task will be dispatched to the Housekeeping department queue with mandatory supervisor inspection required before clearing for the next guest.
            </p>
            <p className="text-[11px] text-blue-700 italic">
              Notice: The room is NOT marked clean on check-out. Housekeeping clearance is required.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Responsible staff: {frontDeskProfile.name} ({frontDeskProfile.id})
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmCheckOut}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Confirm Check-Out & Dispatch Turnover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
