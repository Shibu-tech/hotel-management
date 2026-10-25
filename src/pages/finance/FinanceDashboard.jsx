import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Scale,
  RotateCcw,
  AlertTriangle,
  Receipt,
  FileSpreadsheet,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  CreditCard,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import FinanceKPICard from '../../components/finance/FinanceKPICard';
import FinanceStatusBadge from '../../components/finance/FinanceStatusBadge';
import DateRangeFilter from '../../components/finance/DateRangeFilter';
import TransactionDetailModal from '../../components/finance/TransactionDetailModal';
import RefundApprovalModal from '../../components/finance/RefundApprovalModal';
import RefundExecutionModal from '../../components/finance/RefundExecutionModal';
import RefundRequestModal from '../../components/finance/RefundRequestModal';

export default function FinanceDashboard() {
  const {
    financeKPIs,
    financialTransactions,
    refundRequests,
    reconciliationBatches,
    financialDiscrepancies,
    financeProfile,
    approveRefundRequest,
    rejectRefundRequest,
    executeRefund,
    submitRefundRequest
  } = useTasks();

  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [approvalModalReq, setApprovalModalReq] = useState(null);
  const [execModalReq, setExecModalReq] = useState(null);
  const [refundReqTxn, setRefundReqTxn] = useState(null);

  // Active batches & actionable items
  const currentBatch = reconciliationBatches[0];
  const pendingRefunds = refundRequests.filter((r) => r.status === 'Pending Approval').slice(0, 3);
  const awaitingExecutionRefunds = refundRequests.filter((r) => r.status === 'Approved').slice(0, 3);
  const activeDiscrepancies = financialDiscrepancies.filter((d) => d.status !== 'Resolved').slice(0, 3);
  const recentTransactions = financialTransactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner & Hotel Property Context */}
      <div className="bg-gradient-to-r from-[#172B4D] via-[#1E3A8A] to-[#172B4D] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-900">
                Financial Operations Console
              </span>
              <span className="text-blue-200 text-xs flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                Grand Azure Bay Resort & Conference Center (Property #048)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hotel Financial Overview & Settlement Hub
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Real-time authoritative ledger, payment reconciliation, multi-stage refund governance, and automated discrepancy tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/finance/reconciliation"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold backdrop-blur-xs transition-colors"
            >
              <Scale className="w-4 h-4 text-amber-300" />
              Reconciliation
            </Link>
            <Link
              to="/finance/folios"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Guest Folios
            </Link>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Date Range & Period Filter */}
      <DateRangeFilter
        selectedPreset={selectedPeriod}
        onSelectPreset={setSelectedPeriod}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Filter transactions or guest folios..."
      />

      {/* 6 Required Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Payments Received */}
        <FinanceKPICard
          title="Payments Collected"
          value={`$${financeKPIs.totalPaymentsReceived.toFixed(2)}`}
          subtext="Net gross captures"
          icon={DollarSign}
          color="emerald"
          trend="up"
          trendValue="+14.2%"
          onClick={() => navigate('/finance/transactions')}
        />

        {/* 2. Transactions Awaiting Reconciliation */}
        <FinanceKPICard
          title="Pending Recon"
          value={financeKPIs.awaitingReconciliationCount}
          subtext="Unmatched gateway txns"
          icon={Scale}
          color="amber"
          badgeText={financeKPIs.awaitingReconciliationCount > 0 ? 'Batch Active' : 'All Matched'}
          onClick={() => navigate('/finance/reconciliation')}
        />

        {/* 3. Refund Requests Pending Approval */}
        <FinanceKPICard
          title="Refunds Pending"
          value={financeKPIs.refundsPendingApprovalCount}
          subtext="Awaiting independent sign-off"
          icon={RotateCcw}
          color="purple"
          badgeText="SoD Guard"
          onClick={() => navigate('/finance/refunds')}
        />

        {/* 4. Approved Refunds Awaiting Execution */}
        <FinanceKPICard
          title="Awaiting Execution"
          value={financeKPIs.refundsAwaitingExecutionCount}
          subtext="Gateway dispatch queued"
          icon={CheckCircle2}
          color="blue"
          badgeText={financeKPIs.refundsAwaitingExecutionCount > 0 ? 'Ready' : 'Zero Queue'}
          onClick={() => navigate('/finance/refunds')}
        />

        {/* 5. Unresolved Discrepancies */}
        <FinanceKPICard
          title="Open Discrepancies"
          value={financeKPIs.openDiscrepanciesCount}
          subtext="Variances under review"
          icon={AlertTriangle}
          color="rose"
          badgeText={financeKPIs.openDiscrepanciesCount > 0 ? 'Triage' : 'Clear'}
          onClick={() => navigate('/finance/discrepancies')}
        />

        {/* 6. Failed or Reversed Transactions */}
        <FinanceKPICard
          title="Declines / Reversals"
          value={financeKPIs.failedReversedCount}
          subtext="Issuer declines & chargebacks"
          icon={Receipt}
          color="rose"
          onClick={() => navigate('/finance/transactions')}
        />
      </div>

      {/* Main Operations Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Transactions & Reconciliation Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Transactions Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                  Recent Ledger Transactions
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Masked card credentials with simulated Stripe / Adyen processor tokens
                </p>
              </div>
              <Link
                to="/finance/transactions"
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
              >
                View Ledger <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[10px] uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Txn ID</th>
                    <th className="py-2.5 px-4">Guest / Folio</th>
                    <th className="py-2.5 px-4">Amount</th>
                    <th className="py-2.5 px-4">Method</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTransactions.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTxn(t)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">
                        {t.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{t.guestName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{t.folioId}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        ${t.amount?.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {t.paymentMethod}
                      </td>
                      <td className="py-3 px-4">
                        <FinanceStatusBadge status={t.status} />
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedTxn(t)}
                          className="px-2.5 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-md font-medium"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reconciliation Status Card */}
          {currentBatch && (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Daily Settlement Reconciliation: {currentBatch.batchId}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Settlement Provider: {currentBatch.provider} • Date: {currentBatch.settlementDate}
                    </p>
                  </div>
                </div>

                <FinanceStatusBadge status={currentBatch.status} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl text-center text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Internal Ledger</span>
                  <span className="text-sm font-bold text-slate-900">${currentBatch.internalGross.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-400 block">{currentBatch.internalCount} transactions</span>
                </div>
                <div className="border-l border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Gateway Settlement</span>
                  <span className="text-sm font-bold text-slate-900">${currentBatch.providerGross.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-400 block">{currentBatch.providerCount} disbursed</span>
                </div>
                <div className="border-l border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Variance</span>
                  <span className={`text-sm font-bold ${currentBatch.variance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    ${currentBatch.variance.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {currentBatch.variance > 0 ? 'Review Needed' : 'Clean Match'}
                  </span>
                </div>
                <div className="border-l border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Match Ratio</span>
                  <span className="text-sm font-bold text-blue-600">
                    {currentBatch.matchedCount} / {currentBatch.internalCount}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Matched Records</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-slate-500 text-[11px] italic">
                  Note: {currentBatch.notes}
                </span>
                <Link
                  to="/finance/reconciliation"
                  className="px-3 py-1.5 bg-[#172B4D] hover:bg-slate-800 text-white rounded-lg font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Open Reconciliation Engine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Refunds Requiring Action & Discrepancies */}
        <div className="space-y-6">
          {/* Actionable Refunds */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-purple-600" />
                Refunds Requiring Action
              </h3>
              <Link to="/finance/refunds" className="text-xs text-blue-600 hover:underline font-semibold">
                View All
              </Link>
            </div>

            {/* Pending Approvals */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Pending Independent Approval ({pendingRefunds.length})
              </span>
              {pendingRefunds.length === 0 ? (
                <div className="text-xs text-slate-400 py-2">No pending approvals.</div>
              ) : (
                pendingRefunds.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-lg bg-purple-50/50 border border-purple-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {r.id}: ${r.amount?.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {r.guestName} • Req by {r.requester?.name}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setApprovalModalReq(r)}
                      className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-[11px] font-semibold transition-colors"
                    >
                      Review
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Awaiting Execution */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Approved — Awaiting Gateway Execution ({awaitingExecutionRefunds.length})
              </span>
              {awaitingExecutionRefunds.length === 0 ? (
                <div className="text-xs text-slate-400 py-2">No refunds awaiting execution.</div>
              ) : (
                awaitingExecutionRefunds.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {r.id}: ${r.amount?.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Appr by {r.approver?.name}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExecModalReq(r)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-semibold transition-colors"
                    >
                      Execute
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Discrepancies */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Active Discrepancies
              </h3>
              <Link to="/finance/discrepancies" className="text-xs text-blue-600 hover:underline font-semibold">
                Manage
              </Link>
            </div>

            <div className="space-y-2.5">
              {activeDiscrepancies.map((d) => (
                <div
                  key={d.id}
                  onClick={() => navigate('/finance/discrepancies')}
                  className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{d.id}</span>
                    <FinanceStatusBadge status={d.priority} type="priority" />
                  </div>
                  <div className="text-slate-700 font-medium truncate">{d.type}</div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Variance: <strong className="text-rose-600">${d.variance?.toFixed(2)}</strong></span>
                    <span>Deadline: {d.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links Nav Card */}
          <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Quick Operations Directory
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/finance/folios"
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                <span>Guest Folios</span>
              </Link>
              <Link
                to="/finance/transactions"
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span>Transactions</span>
              </Link>
              <Link
                to="/finance/reports"
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span>Reports</span>
              </Link>
              <Link
                to="/finance/audit"
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Audit Trail</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Detail & Action Modals */}
      <TransactionDetailModal
        transaction={selectedTxn}
        isOpen={Boolean(selectedTxn)}
        onClose={() => setSelectedTxn(null)}
        onRequestRefund={(txn) => {
          setSelectedTxn(null);
          setRefundReqTxn(txn);
        }}
        onViewFolio={(folioId) => navigate('/finance/folios')}
      />

      <RefundRequestModal
        transaction={refundReqTxn}
        isOpen={Boolean(refundReqTxn)}
        onClose={() => setRefundReqTxn(null)}
        onSubmitRequest={submitRefundRequest}
      />

      <RefundApprovalModal
        refundRequest={approvalModalReq}
        currentOperator={financeProfile}
        isOpen={Boolean(approvalModalReq)}
        onClose={() => setApprovalModalReq(null)}
        onApprove={approveRefundRequest}
        onReject={rejectRefundRequest}
      />

      <RefundExecutionModal
        refundRequest={execModalReq}
        isOpen={Boolean(execModalReq)}
        onClose={() => setExecModalReq(null)}
        onExecuteRefund={executeRefund}
      />
    </div>
  );
}
