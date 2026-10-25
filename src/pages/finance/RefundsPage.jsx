import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  ShieldAlert,
  Plus,
  Search,
  Filter,
  DollarSign,
  AlertTriangle,
  FileText,
  User,
  ArrowRight,
  X
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import FinanceStatusBadge from '../../components/finance/FinanceStatusBadge';
import RefundApprovalModal from '../../components/finance/RefundApprovalModal';
import RefundExecutionModal from '../../components/finance/RefundExecutionModal';
import RefundRequestModal from '../../components/finance/RefundRequestModal';
import DateRangeFilter from '../../components/finance/DateRangeFilter';

export default function RefundsPage() {
  const {
    refundRequests,
    financialTransactions,
    financeProfile,
    approveRefundRequest,
    rejectRefundRequest,
    executeRefund,
    submitRefundRequest
  } = useTasks();

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [approvalModalReq, setApprovalModalReq] = useState(null);
  const [execModalReq, setExecModalReq] = useState(null);
  const [requestModalTxn, setRequestModalTxn] = useState(null);
  const [showTxnPicker, setShowTxnPicker] = useState(false);

  // Tabs count
  const pendingCount = refundRequests.filter((r) => r.status === 'Pending Approval').length;
  const approvedCount = refundRequests.filter((r) => r.status === 'Approved').length;
  const completedCount = refundRequests.filter((r) => r.status === 'Completed').length;
  const rejectedCount = refundRequests.filter((r) => r.status === 'Rejected').length;

  const filteredRefunds = refundRequests.filter((r) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'PENDING' && r.status === 'Pending Approval') ||
      (activeTab === 'APPROVED' && r.status === 'Approved') ||
      (activeTab === 'COMPLETED' && r.status === 'Completed') ||
      (activeTab === 'REJECTED' && r.status === 'Rejected');

    const matchesSearch =
      !searchQuery.trim() ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.originalTransactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.folioId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Eligible transactions for refund
  const eligibleTransactions = financialTransactions.filter(
    (t) => (t.refundableBalance || 0) > 0 && t.status !== 'Failed' && t.status !== 'Reversed'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
              Separation of Duties
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Multi-Stage Refund Governance Pipeline
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Refunds, Authorizations & Gateway Execution
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict two-person review rule: requesters cannot approve their own disbursements. Server-side limits enforced.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowTxnPicker(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Submit Refund Request
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'ALL'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Requests ({refundRequests.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('PENDING')}
          className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'PENDING'
              ? 'border-amber-500 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Pending Approval</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-100 text-amber-800">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('APPROVED')}
          className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'APPROVED'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Awaiting Execution</span>
          {approvedCount > 0 && (
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-800">
              {approvedCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('COMPLETED')}
          className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'COMPLETED'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Completed ({completedCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('REJECTED')}
          className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'REJECTED'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Rejected ({rejectedCount})
        </button>
      </div>

      {/* Search & Filter */}
      <DateRangeFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by Refund ID, guest, transaction, reason..."
      />

      {/* Refunds Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Refund ID</th>
                <th className="py-3 px-4">Original Txn</th>
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Requester</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Approver</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRefunds.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">
                    No refund records found in this view.
                  </td>
                </tr>
              ) : (
                filteredRefunds.map((req) => {
                  const isPending = req.status === 'Pending Approval';
                  const isApproved = req.status === 'Approved';
                  const isCompleted = req.status === 'Completed';

                  return (
                    <tr key={req.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-purple-700">
                        {req.id}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {req.originalTransactionId}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{req.guestName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">Rm {req.roomNumber}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        ${req.amount?.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="font-medium">{req.requester?.name}</div>
                        <div className="text-[10px] text-slate-400">{req.requester?.role}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <FinanceStatusBadge status={req.status} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {req.approver ? (
                          <div>
                            <span className="font-medium">{req.approver.name}</span>
                            <span className="block text-[10px] text-slate-400">{req.approver.role}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unapproved</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[180px] truncate" title={req.reason}>
                        {req.approvalNotes || req.reason}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {isPending && (
                          <button
                            type="button"
                            onClick={() => setApprovalModalReq(req)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-semibold transition-colors"
                          >
                            Review & Decide
                          </button>
                        )}
                        {isApproved && (
                          <button
                            type="button"
                            onClick={() => setExecModalReq(req)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Execute
                          </button>
                        )}
                        {isCompleted && (
                          <span className="text-[11px] font-mono text-emerald-700 font-semibold" title={req.providerRefundId}>
                            {req.providerRefundId ? `${req.providerRefundId.slice(0, 10)}...` : 'Settled'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Picker Modal for New Refund */}
      {showTxnPicker && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                Select Transaction to Refund
              </h3>
              <button
                type="button"
                onClick={() => setShowTxnPicker(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto divide-y divide-slate-100">
              {eligibleTransactions.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No settled transactions with available refundable balance found.
                </div>
              ) : (
                eligibleTransactions.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setShowTxnPicker(false);
                      setRequestModalTxn(t);
                    }}
                    className="p-3 hover:bg-blue-50 cursor-pointer rounded-lg transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {t.id}: {t.guestName}
                      </div>
                      <div className="text-slate-500 font-mono text-[11px]">
                        Folio: {t.folioId} • Capture: ${t.amount?.toFixed(2)} • Method: {t.paymentMethod}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600 block">
                        ${t.refundableBalance?.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400">Available</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
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

      <RefundRequestModal
        transaction={requestModalTxn}
        isOpen={Boolean(requestModalTxn)}
        onClose={() => setRequestModalTxn(null)}
        onSubmitRequest={submitRefundRequest}
      />
    </div>
  );
}
