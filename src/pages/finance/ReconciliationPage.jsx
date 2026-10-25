import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Download,
  Play,
  RotateCcw,
  Building2,
  ArrowRight,
  Server,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import FinanceStatusBadge from '../../components/finance/FinanceStatusBadge';
import TransactionDetailModal from '../../components/finance/TransactionDetailModal';

export default function ReconciliationPage() {
  const {
    reconciliationBatches,
    runReconciliationBatch,
    exportFinancialReport,
    financialTransactions
  } = useTasks();

  const [selectedBatchId, setSelectedBatchId] = useState(
    reconciliationBatches[0]?.batchId || ''
  );
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const activeBatch =
    reconciliationBatches.find((b) => b.batchId === selectedBatchId) ||
    reconciliationBatches[0];

  const handleRunRecon = () => {
    if (!activeBatch) return;
    setIsRunning(true);
    setTimeout(() => {
      runReconciliationBatch({ batchId: activeBatch.batchId });
      setIsRunning(false);
    }, 600);
  };

  const handleExport = () => {
    exportFinancialReport({
      reportType: `reconciliation_${activeBatch.batchId}`,
      dateRange: activeBatch.settlementDate,
      format: 'CSV'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
              Settlement Reconciliation Engine
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Stripe & Adyen Simulated Provider Settlement
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Automated & Manual Transaction Reconciliation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare hotel internal ledger captures against merchant payout batches to detect timing differences and variances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Settlement Report
          </button>
          <button
            type="button"
            onClick={handleRunRecon}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            {isRunning ? 'Running Reconciliation...' : 'Run Reconciliation Check'}
          </button>
        </div>
      </div>

      {/* Settlement Batch Selector & Overview */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Select Settlement Batch / Date
            </label>
            <div className="flex items-center gap-2">
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {reconciliationBatches.map((b) => (
                  <option key={b.batchId} value={b.batchId}>
                    {b.batchId} — {b.settlementDate} ({b.provider})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Status:</span>
            <FinanceStatusBadge status={activeBatch.status} />
          </div>
        </div>

        {/* 4-Box Comparison Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Internal Ledger
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              ${activeBatch.internalGross.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {activeBatch.internalCount} Transactions recorded
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Gateway Settlement
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              ${activeBatch.providerGross.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {activeBatch.providerCount} Payout line items
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Variance / Difference
            </span>
            <span
              className={`text-2xl font-bold mt-1 block ${
                activeBatch.variance > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              ${activeBatch.variance.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {activeBatch.variance > 0 ? 'Requires Investigation' : 'Zero Variance Balance'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Reconciliation Matching
            </span>
            <span className="text-2xl font-bold text-blue-600 mt-1 block">
              {activeBatch.matchedCount} / {activeBatch.internalCount}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {activeBatch.unmatchedCount > 0 ? `${activeBatch.unmatchedCount} Unmatched Item` : '100% Matched'}
            </span>
          </div>
        </div>

        {/* Auditor & Timestamp metadata */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 border-t border-slate-100 gap-2">
          <div>
            <span>Merchant Account: <strong className="text-slate-800 font-mono">{activeBatch.merchantAccountId}</strong></span>
            {activeBatch.reviewedBy && (
              <span className="ml-3">Reviewer: <strong className="text-slate-800">{activeBatch.reviewedBy}</strong></span>
            )}
          </div>
          {activeBatch.reconciledAt && (
            <span className="text-slate-400">
              Last Reconciled: {new Date(activeBatch.reconciledAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Itemized Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Line-Item Settlement Records in Batch
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified 1:1 match between internal transaction ID and payment gateway capture references
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Internal ID</th>
                <th className="py-3 px-4">Provider Reference</th>
                <th className="py-3 px-4">Recorded Amount</th>
                <th className="py-3 px-4">Match Status</th>
                <th className="py-3 px-4">Variance</th>
                <th className="py-3 px-4">Audit Note / Exception</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeBatch.items?.map((item, idx) => {
                const isMatched = item.status === 'MATCHED';
                return (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-50 transition-colors ${
                      !isMatched ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {item.internalId}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {item.providerRef}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      ${Number(item.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {isMatched ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Matched
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Unmatched Exception
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={item.difference > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                        ${Number(item.difference || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.reason || 'Verified gateway settlement capture.'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demonstration notice */}
      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 flex items-start gap-3">
        <Server className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800 font-bold block mb-0.5">
            Simulated Settlement Demonstration Environment
          </strong>
          Provider-supplied transaction records are generated by the hotel financial simulation engine. In production, this module securely ingests Daily Settlement Files (DSF) and Merchant Reconciliation Reports via automated SFTP or Stripe/Adyen Webhooks.
        </div>
      </div>

      <TransactionDetailModal
        transaction={selectedTxn}
        isOpen={Boolean(selectedTxn)}
        onClose={() => setSelectedTxn(null)}
      />
    </div>
  );
}
