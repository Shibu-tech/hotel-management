import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Receipt,
  Search,
  Filter,
  CreditCard,
  RotateCcw,
  ShieldCheck,
  Lock,
  Download,
  AlertTriangle
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import TransactionTable from '../../components/finance/TransactionTable';
import TransactionDetailModal from '../../components/finance/TransactionDetailModal';
import RefundRequestModal from '../../components/finance/RefundRequestModal';
import DateRangeFilter from '../../components/finance/DateRangeFilter';

export default function TransactionsPage() {
  const {
    financialTransactions,
    financeProfile,
    submitRefundRequest,
    exportFinancialReport
  } = useTasks();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [refundModalTxn, setRefundModalTxn] = useState(null);

  const filteredTransactions = financialTransactions.filter((t) => {
    const matchesSearch =
      !searchQuery.trim() ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.folioId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.providerReference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.paymentMethod?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || t.type.includes(typeFilter);

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleExport = () => {
    exportFinancialReport({
      reportType: 'transaction_ledger',
      dateRange: 'Current View',
      format: 'CSV'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
              Transaction Ledger
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Property #048 • PCI-DSS Level 1 Compliant Masking
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Financial Transactions & Gateway Records
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete itemized record of authorizations, captures, refunds, and adjustments across all payment gateways.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted Tokenization Active</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <DateRangeFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search transaction ID, guest, folio, provider reference..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          { value: 'Settled', label: 'Settled' },
          { value: 'Authorized', label: 'Authorized' },
          { value: 'Captured', label: 'Captured' },
          { value: 'Failed', label: 'Failed (Declined)' },
          { value: 'Refunded', label: 'Refunded' }
        ]}
        onExport={handleExport}
        exportLabel="Export Ledger (CSV)"
        extraFilter={
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Transaction Types</option>
            <option value="Payment">Payments (Captures)</option>
            <option value="Pre-Auth">Pre-Authorizations</option>
            <option value="Refund">Refunds</option>
            <option value="Adjustment">Ledger Adjustments</option>
          </select>
        }
      />

      {/* Transactions Table */}
      <TransactionTable
        transactions={filteredTransactions}
        onSelectTransaction={(txn) => setSelectedTxn(txn)}
        onRequestRefund={(txn) => setRefundModalTxn(txn)}
      />

      {/* Modals */}
      <TransactionDetailModal
        transaction={selectedTxn}
        isOpen={Boolean(selectedTxn)}
        onClose={() => setSelectedTxn(null)}
        onRequestRefund={(txn) => {
          setSelectedTxn(null);
          setRefundModalTxn(txn);
        }}
        onViewFolio={(folioId) => navigate('/finance/folios')}
      />

      <RefundRequestModal
        transaction={refundModalTxn}
        isOpen={Boolean(refundModalTxn)}
        onClose={() => setRefundModalTxn(null)}
        onSubmitRequest={submitRefundRequest}
      />
    </div>
  );
}
