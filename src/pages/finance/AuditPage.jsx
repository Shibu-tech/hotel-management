import React, { useState } from 'react';
import {
  History,
  Search,
  Shield,
  Lock,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  FileText
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function AuditPage() {
  const { financialAuditLogs } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = financialAuditLogs.filter((log) => {
    const matchesSearch =
      !searchQuery.trim() ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.recordReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-800">
              Immutable Ledger
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Read-Only Financial Event Stream
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Financial Audit History & Governance Trail
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically sealed chronological log of every payment, adjustment, refund review, and export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-slate-900 text-white rounded-xl flex items-center gap-2 text-xs font-medium">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Append-Only Protection Enforced</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit ID, actor, record reference, reason..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Financial Actions</option>
            <option value="RECORD_PAYMENT">RECORD_PAYMENT</option>
            <option value="POST_LEDGER_ADJUSTMENT">POST_LEDGER_ADJUSTMENT</option>
            <option value="SUBMIT_REFUND_REQUEST">SUBMIT_REFUND_REQUEST</option>
            <option value="APPROVE_REFUND">APPROVE_REFUND</option>
            <option value="REJECT_REFUND">REJECT_REFUND</option>
            <option value="EXECUTE_REFUND">EXECUTE_REFUND</option>
            <option value="RUN_RECONCILIATION">RUN_RECONCILIATION</option>
            <option value="UPDATE_DISCREPANCY">UPDATE_DISCREPANCY</option>
            <option value="EXPORT_FINANCIAL_REPORT">EXPORT_FINANCIAL_REPORT</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Audit ID / Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Record Ref</th>
                <th className="py-3 px-4">State Transition (Before &rarr; After)</th>
                <th className="py-3 px-4">Reason / Authorization</th>
                <th className="py-3 px-4">Provider Ref</th>
                <th className="py-3 px-4 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    No financial audit entries match your search.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-800">{log.id}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(log.timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{log.actor}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">
                      {log.recordReference}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-[11px]">
                      <div className="text-slate-500 line-clamp-1">Prev: {log.previousValue}</div>
                      <div className="font-medium text-slate-800 line-clamp-1">New: {log.newValue}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-slate-700 italic truncate" title={log.reason}>
                        "{log.reason}"
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Auth: {log.approvalReference}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 truncate max-w-[120px]" title={log.providerReference}>
                      {log.providerReference}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        {log.executionResult}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
