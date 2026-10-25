import React, { useState } from 'react';
import { X, Scale, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';

export default function PostAdjustmentModal({
  folio,
  isOpen,
  onClose,
  onPostAdjustment
}) {
  if (!isOpen || !folio) return null;

  const [adjustmentType, setAdjustmentType] = useState('credit'); // 'credit' (-) or 'charge' (+)
  const [amount, setAmount] = useState('25.00');
  const [category, setCategory] = useState('Rate Correction');
  const [description, setDescription] = useState('Courtesy discount adjustment');
  const [rationale, setRationale] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Rate Correction',
    'Minibar Sensor Dispute',
    'Parking / Valet Fee Adjustment',
    'Service Recovery Credit',
    'Late Checkout Fee',
    'Incidental Damage Recovery',
    'Tax Recomputation'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rationale.trim()) {
      alert('A valid rationale is mandatory for all ledger adjustments.');
      return;
    }
    const signedAmount = adjustmentType === 'credit' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));
    setIsSubmitting(true);
    const res = onPostAdjustment({
      folioId: folio.folioId,
      amount: signedAmount,
      category,
      description: description.trim(),
      rationale: rationale.trim()
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
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Post Auditable Folio Adjustment
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
          {/* Adjustment Direction */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Adjustment Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAdjustmentType('credit')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all ${
                  adjustmentType === 'credit'
                    ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Credit / Waiver (-)
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType('charge')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all ${
                  adjustmentType === 'charge'
                    ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Debit / Extra Charge (+)
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Adjustment Value (USD)
            </label>
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
            <p className="text-[11px] text-slate-500 mt-1">
              Will {adjustmentType === 'credit' ? 'reduce' : 'increase'} the folio balance by{' '}
              <span className="font-bold text-slate-800">${Number(amount || 0).toFixed(2)}</span>.
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reason Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Line Item Description
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Courtesy dining credit, valet reversal..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mandatory Rationale */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Auditable Rationale & Justification <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-rose-600 font-bold uppercase">Mandatory</span>
            </div>
            <textarea
              rows={3}
              required
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Provide exact justification for this financial correction. Will be immutably recorded in the audit trail..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-2 text-[11px] text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Posted ledger adjustments cannot be deleted or hidden. A permanent non-destructive audit record will be attached to Folio {folio.folioId}.
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
              disabled={isSubmitting || !rationale.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Post Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
