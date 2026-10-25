import React, { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  ShieldCheck,
  Lock,
  Download,
  Calendar,
  Eye,
  CheckCircle2,
  XCircle,
  X,
  FileText
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function AdminAuditLogs() {
  const { adminAuditLogs } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);
  const [exportNotice, setExportNotice] = useState('');

  const filteredLogs = adminAuditLogs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.changeSummary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOutcome = outcomeFilter === 'ALL' || log.outcome === outcomeFilter;
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

    return matchesSearch && matchesOutcome && matchesAction;
  });

  const exportAuditTrail = () => {
    const dataString = JSON.stringify(adminAuditLogs, null, 2);
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stayops-admin-audit-trail-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice('Audit trail exported as verified JSON for compliance archiving.');
    setTimeout(() => setExportNotice(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-cyan-100 text-cyan-950 border border-cyan-200">
              Security Compliance Vault
            </span>
            <span className="text-xs text-slate-500 font-medium">Immutable WORM Storage</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Administrative Audit Trail & Security Events
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable, append-only log of technical actions, role assignments, and security configurations. Purging or editing is barred.
          </p>
        </div>

        <button
          onClick={exportAuditTrail}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export Verified Audit Log
        </button>
      </div>

      {exportNotice && (
        <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
          {exportNotice}
        </div>
      )}

      {/* Immutability Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-start gap-3 text-xs">
        <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] block">
            Tamper-Proof Ledger Enforcement
          </span>
          <p className="text-slate-300 mt-0.5">
            Every administrative intervention is stamped with actor, correlation ID, timestamp, and SHA-256 seal. No administrator can alter or delete these records.
          </p>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, actor, resource, or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Outcome:</span>
          </div>
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="ALL">All Outcomes ({adminAuditLogs.length})</option>
            <option value="SUCCESS">Success Only</option>
            <option value="DENIED">Denied / Blocked</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Affected Resource</th>
                <th className="py-3 px-4">Summary of Change</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredLogs.map((log) => {
                const isSuccess = log.outcome === 'SUCCESS';
                return (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{log.id}</td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{log.actor}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{log.resource}</td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-700">{log.changeSummary}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          isSuccess
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.outcome}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1 text-slate-400 hover:text-cyan-700 hover:bg-cyan-50 rounded transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="p-12 text-center">
            <Activity className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No events found</h4>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or search terms.</p>
          </div>
        )}
      </div>

      {/* Inspect Log Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400">Audit Record Detail</span>
                <h3 className="text-base font-bold font-mono">{selectedLog.id}</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="font-mono text-slate-800">{selectedLog.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Actor Identity:</span>
                  <span className="font-semibold text-slate-900">{selectedLog.actor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Action:</span>
                  <span className="font-mono text-slate-800 font-bold">{selectedLog.action}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Resource:</span>
                  <span className="font-mono text-slate-800">{selectedLog.resource}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Outcome:</span>
                  <span className="font-bold text-emerald-700">{selectedLog.outcome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Correlation ID:</span>
                  <span className="font-mono text-[10px] text-slate-600">{selectedLog.correlationId || 'N/A'}</span>
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                  Change Specification
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                  {selectedLog.changeSummary}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
