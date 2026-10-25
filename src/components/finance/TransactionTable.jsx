import React, { useState } from 'react';
import {
  CreditCard,
  Eye,
  RotateCcw,
  ArrowUpDown,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import FinanceStatusBadge from './FinanceStatusBadge';

export default function TransactionTable({
  transactions = [],
  onSelectTransaction,
  onRequestRefund
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(transactions.length / itemsPerPage) || 1;
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Folio / Guest</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Provider Ref</th>
              <th className="py-3 px-4">Date / Time</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-slate-400">
                  No transactions match the selected filter criteria.
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((txn) => {
                const isPositive = txn.amount > 0 && !txn.type.includes('Refund');
                return (
                  <tr
                    key={txn.id}
                    className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectTransaction && onSelectTransaction(txn)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {txn.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{txn.guestName || 'Direct Billing'}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {txn.folioId} {txn.roomNumber ? `• Rm ${txn.roomNumber}` : ''}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {txn.type}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={`font-bold ${
                          txn.type.includes('Refund')
                            ? 'text-purple-600'
                            : txn.status === 'Failed'
                            ? 'text-slate-400 line-through'
                            : 'text-slate-900'
                        }`}
                      >
                        {txn.type.includes('Refund') ? '-' : ''}${Math.abs(txn.amount).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">{txn.currency}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{txn.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <FinanceStatusBadge status={txn.status} />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 max-w-[120px] truncate" title={txn.providerReference}>
                      {txn.providerReference}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(txn.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectTransaction && onSelectTransaction(txn)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Transaction Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {txn.refundableBalance > 0 && onRequestRefund && (
                          <button
                            type="button"
                            onClick={() => onRequestRefund(txn)}
                            className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Request Refund"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, transactions.length)} of {transactions.length} records
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-100 transition-colors"
            >
              Previous
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-100 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
