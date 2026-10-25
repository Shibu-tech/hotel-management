import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Receipt,
  Plus,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ShieldAlert,
  Send,
  Building2,
  FileCheck2,
  X
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import PermissionGuard from '../../components/ui/PermissionGuard';

export default function Payments() {
  const {
    folios,
    recordFolioPayment,
    postFolioCharge,
    initiateFolioRefund,
    frontDeskProfile,
    frontDeskRoleInfo
  } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolioId, setSelectedFolioId] = useState(folios[0]?.folioId || '');

  // Record Payment Dialog
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Visa ending 4812');

  // Post Charge Dialog
  const [chargeModalOpen, setChargeModalOpen] = useState(false);
  const [chargeCategory, setChargeCategory] = useState('Room Service');
  const [chargeDescription, setChargeDescription] = useState('');
  const [chargeAmount, setChargeAmount] = useState('');

  // Refund Request Dialog
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState('50.00');
  const [refundReason, setRefundReason] = useState('');

  const filteredFolios = folios.filter(
    (f) =>
      !searchQuery.trim() ||
      f.folioId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.roomNumber.includes(searchQuery)
  );

  const activeFolio = folios.find((f) => f.folioId === selectedFolioId) || filteredFolios[0];

  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault();
    if (!activeFolio) return;
    const res = recordFolioPayment({
      folioId: activeFolio.folioId,
      amount: Number(paymentAmount),
      method: paymentMethod
    });
    if (res.success) {
      setPaymentModalOpen(false);
      setPaymentAmount('');
    }
  };

  const handlePostChargeSubmit = (e) => {
    e.preventDefault();
    if (!activeFolio) return;
    const res = postFolioCharge({
      folioId: activeFolio.folioId,
      category: chargeCategory,
      description: chargeDescription.trim(),
      amount: Number(chargeAmount)
    });
    if (res.success) {
      setChargeModalOpen(false);
      setChargeDescription('');
      setChargeAmount('');
    }
  };

  const handleInitiateRefundSubmit = (e) => {
    e.preventDefault();
    if (!activeFolio) return;
    const res = initiateFolioRefund({
      folioId: activeFolio.folioId,
      amount: Number(refundAmount),
      reason: refundReason.trim(),
      supportingNotes: 'Submitted through Front Desk Payments Terminal.'
    });
    if (res.success) {
      setRefundModalOpen(false);
      setRefundReason('');
    }
  };

  return (
    <PermissionGuard requireFinancial={true}>
      <div className="space-y-6 animate-in fade-in-50 duration-200">
        {/* Top Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Guest Folios & Financial Settlement
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Cashiering Authorized
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Manage room rates, itemized incidentals, payment recording, and manager refund requests with PCI credential masking.
            </p>
          </div>

          {/* Authority Limit Badge */}
          <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Refund Approval Authority
            </span>
            <span className="font-bold text-slate-800">
              $0.00 (Initiate Only — Routes to Manager)
            </span>
          </div>
        </div>

        {/* Security & PCI Compliance Banner */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>PCI Security Standard:</strong> Full credit card numbers and CVVs are strictly masked. Tokenized authorizations only.
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Gateway: StayOps-Pay PCI-DSS Level 1
          </span>
        </div>

        {/* Main Content Split: Folio List on Left, Active Folio Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Folios List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
            <div className="p-3.5 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search folio, guest, room..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
              {filteredFolios.map((f) => (
                <div
                  key={f.folioId}
                  onClick={() => setSelectedFolioId(f.folioId)}
                  className={`p-3.5 cursor-pointer transition-colors text-xs space-y-1 ${
                    (activeFolio?.folioId === f.folioId)
                      ? 'bg-blue-50/80 border-l-4 border-blue-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{f.guestName}</span>
                    <span
                      className={`font-mono font-bold text-xs ${
                        f.balance === 0 ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      ${f.balance.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Room {f.roomNumber}</span>
                    <span className="font-mono text-slate-400">{f.folioId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Folio Detail Panel */}
          {activeFolio ? (
            <div className="lg:col-span-2 space-y-5">
              {/* Folio Header Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        {activeFolio.guestName}
                      </h2>
                      <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {activeFolio.folioId}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      Room {activeFolio.roomNumber} • Folio Status: <strong>{activeFolio.status}</strong>
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Current Outstanding Balance
                    </span>
                    <span
                      className={`text-xl font-mono font-black ${
                        activeFolio.balance === 0 ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      ${activeFolio.balance.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Quick Folio Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setPaymentAmount(activeFolio.balance.toFixed(2));
                      setPaymentModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CreditCard className="w-4 h-4" />
                    Record Payment
                  </button>

                  <button
                    onClick={() => setChargeModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Post Charge / Incidental
                  </button>

                  <button
                    onClick={() => setRefundModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    Initiate Refund Request
                  </button>
                </div>
              </div>

              {/* Itemized Charges Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-blue-600" />
                    Itemized Charges & Taxes
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    {activeFolio.charges.length} Line Items
                  </span>
                </div>

                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                      <th className="py-2.5 px-4">Date</th>
                      <th className="py-2.5 px-4">Category</th>
                      <th className="py-2.5 px-4">Description</th>
                      <th className="py-2.5 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeFolio.charges.length > 0 ? (
                      activeFolio.charges.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">{c.date}</td>
                          <td className="py-2.5 px-4 font-semibold text-blue-700">{c.category}</td>
                          <td className="py-2.5 px-4 text-slate-800">{c.description}</td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                            ${Number(c.amount).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-slate-400">
                          No charges posted to this folio yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Payments & Transactions Log */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Recorded Payments & Settlements
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    {activeFolio.payments.length} Transactions
                  </span>
                </div>

                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                      <th className="py-2.5 px-4">Date</th>
                      <th className="py-2.5 px-4">Method</th>
                      <th className="py-2.5 px-4">Auth Reference</th>
                      <th className="py-2.5 px-4">Cashier / Agent</th>
                      <th className="py-2.5 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeFolio.payments.length > 0 ? (
                      activeFolio.payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">{p.date}</td>
                          <td className="py-2.5 px-4 font-semibold text-slate-800">{p.method}</td>
                          <td className="py-2.5 px-4 font-mono text-slate-500 text-[11px]">{p.authCode}</td>
                          <td className="py-2.5 px-4 text-slate-600 text-[11px]">{p.recordedBy}</td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-700">
                            -${Number(p.amount).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400">
                          No payments recorded on this folio.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs text-slate-500">
              Select a guest folio from the left to view itemized accounting details.
            </div>
          )}
        </div>

        {/* Modal: Record Payment */}
        {paymentModalOpen && activeFolio && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Record Payment — {activeFolio.folioId}
                </h3>
                <button
                  onClick={() => setPaymentModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tender / Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  >
                    <option value="Visa ending 4812">Card on File (Visa ending 4812)</option>
                    <option value="Mastercard ending 7721">Mastercard ending 7721</option>
                    <option value="Amex ending 1004">Amex ending 1004</option>
                    <option value="Cash Tendered">Cash Tendered at Front Desk</option>
                    <option value="Direct Corporate Billing">Direct Corporate Billing</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                  Transaction will be recorded under staff operator: <strong>{frontDeskProfile.name} ({frontDeskProfile.id})</strong>.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700"
                  >
                    Confirm Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Post Charge */}
        {chargeModalOpen && activeFolio && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-blue-600" />
                  Post Charge / Incidental — {activeFolio.folioId}
                </h3>
                <button
                  onClick={() => setChargeModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handlePostChargeSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Charge Category *</label>
                  <select
                    value={chargeCategory}
                    onChange={(e) => setChargeCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  >
                    <option value="Room Service">Room Service / In-Room Dining</option>
                    <option value="Minibar">Minibar Refreshment</option>
                    <option value="Laundry & Dry Cleaning">Laundry & Dry Cleaning</option>
                    <option value="Spa & Wellness">Spa & Wellness Treatment</option>
                    <option value="Late Check-Out Fee">Late Check-Out Surcharge</option>
                    <option value="Parking / Valet">Parking / Valet Service</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                  <input
                    type="text"
                    placeholder="e.g. Executive Lunch In-Room #8142"
                    value={chargeDescription}
                    onChange={(e) => setChargeDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={chargeAmount}
                    onChange={(e) => setChargeAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-sm"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setChargeModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700"
                  >
                    Post to Folio
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Initiate Refund Request */}
        {refundModalOpen && activeFolio && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 text-amber-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Initiate Refund Request — {activeFolio.folioId}
                </h3>
                <button
                  onClick={() => setRefundModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1">
                <strong>Separation of Authority:</strong> Front Desk Coordinators can initiate refund requests. Independent approval is strictly required from <strong>Department Manager Elena Rostova</strong>.
              </div>

              <form onSubmit={handleInitiateRefundSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Refund Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grievance Justification *</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. AC compressor breakdown during stay night 2; approved as courtesy adjustment for Titanium VIP."
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRefundModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700"
                  >
                    Submit for Approval
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}
