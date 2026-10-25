import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  Search,
  CreditCard,
  Plus,
  Eye,
  DollarSign,
  Scale,
  Receipt,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import FinanceStatusBadge from '../../components/finance/FinanceStatusBadge';
import FolioDetailsModal from '../../components/finance/FolioDetailsModal';
import RecordPaymentModal from '../../components/finance/RecordPaymentModal';
import PostAdjustmentModal from '../../components/finance/PostAdjustmentModal';
import DateRangeFilter from '../../components/finance/DateRangeFilter';

export default function FoliosPage() {
  const {
    folios,
    financeProfile,
    recordFinancialPayment,
    postFolioAdjustment
  } = useTasks();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [selectedFolio, setSelectedFolio] = useState(null);
  const [paymentModalFolio, setPaymentModalFolio] = useState(null);
  const [adjustmentModalFolio, setAdjustmentModalFolio] = useState(null);

  // Authoritative balance calculations & filtering
  const enrichedFolios = folios.map((f) => {
    const totalCharges = (f.charges || []).reduce((acc, c) => acc + Number(c.amount || 0), 0);
    const totalPayments = (f.payments || []).reduce((acc, p) => acc + Number(p.amount || 0), 0);
    const totalRefunds = (f.refunds || []).reduce((acc, r) => acc + Number(r.amount || 0), 0);
    const calculatedBalance = Number((totalCharges - totalPayments + totalRefunds).toFixed(2));
    const effectiveStatus = calculatedBalance <= 0 ? 'Settled' : 'Open';

    return {
      ...f,
      totalCharges,
      totalPayments,
      totalRefunds,
      calculatedBalance,
      effectiveStatus
    };
  });

  const filteredFolios = enrichedFolios.filter((f) => {
    const matchesSearch =
      !searchQuery.trim() ||
      f.folioId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.reservationId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.roomNumber?.includes(searchQuery);

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'OPEN' && f.calculatedBalance > 0) ||
      (statusFilter === 'SETTLED' && f.calculatedBalance <= 0);

    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = enrichedFolios.reduce((acc, f) => acc + Math.max(0, f.calculatedBalance), 0);
  const settledCount = enrichedFolios.filter((f) => f.calculatedBalance <= 0).length;
  const openCount = enrichedFolios.filter((f) => f.calculatedBalance > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
              Folio Management
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Property #048 • Authoritative Accounting Ledger
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Guest Folios & Line-Item Balances
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time authoritative balance calculations, auditable adjustments, and checkout settlement.
          </p>
        </div>

        {/* Quick totals banner */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-center shadow-xs">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Outstanding</span>
            <span className="text-sm font-bold text-amber-600 block mt-0.5">${totalOutstanding.toFixed(2)}</span>
          </div>
          <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-center shadow-xs">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Open Folios</span>
            <span className="text-sm font-bold text-slate-900 block mt-0.5">{openCount} active</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <DateRangeFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by Folio ID, guest name, room, reservation..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          { value: 'OPEN', label: 'Open Balances (> $0)' },
          { value: 'SETTLED', label: 'Settled ($0.00)' }
        ]}
      />

      {/* Folios Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Folio ID</th>
                <th className="py-3 px-4">Guest / Room</th>
                <th className="py-3 px-4">Reservation</th>
                <th className="py-3 px-4">Charges</th>
                <th className="py-3 px-4">Payments</th>
                <th className="py-3 px-4">Refunds</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFolios.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">
                    No guest folios match the criteria.
                  </td>
                </tr>
              ) : (
                filteredFolios.map((folio) => (
                  <tr
                    key={folio.folioId}
                    onClick={() => setSelectedFolio(folio)}
                    className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {folio.folioId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{folio.guestName}</div>
                      <div className="text-[11px] text-slate-500">Room {folio.roomNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {folio.reservationId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                      ${folio.totalCharges.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-emerald-600">
                      ${folio.totalPayments.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-purple-600">
                      ${folio.totalRefunds.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className={folio.calculatedBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                        ${folio.calculatedBalance.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <FinanceStatusBadge status={folio.effectiveStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedFolio(folio)}
                          className="px-2 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md font-medium inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        {folio.calculatedBalance > 0 && (
                          <button
                            type="button"
                            onClick={() => setPaymentModalFolio(folio)}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md font-semibold inline-flex items-center gap-1"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Pay
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setAdjustmentModalFolio(folio)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium inline-flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Adjust
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <FolioDetailsModal
        folio={selectedFolio}
        isOpen={Boolean(selectedFolio)}
        onClose={() => setSelectedFolio(null)}
        onOpenPaymentModal={(f) => {
          setSelectedFolio(null);
          setPaymentModalFolio(f);
        }}
        onOpenAdjustmentModal={(f) => {
          setSelectedFolio(null);
          setAdjustmentModalFolio(f);
        }}
        canRecordPayment={financeProfile.permissions['payment.record']}
        canAdjust={financeProfile.permissions['folio.adjust']}
      />

      <RecordPaymentModal
        folio={paymentModalFolio}
        isOpen={Boolean(paymentModalFolio)}
        onClose={() => setPaymentModalFolio(null)}
        onRecordPayment={recordFinancialPayment}
      />

      <PostAdjustmentModal
        folio={adjustmentModalFolio}
        isOpen={Boolean(adjustmentModalFolio)}
        onClose={() => setAdjustmentModalFolio(null)}
        onPostAdjustment={postFolioAdjustment}
      />
    </div>
  );
}
