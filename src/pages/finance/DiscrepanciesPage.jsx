import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Scale,
  Plus,
  Eye,
  Calendar
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import FinanceStatusBadge from '../../components/finance/FinanceStatusBadge';
import DiscrepancyModal from '../../components/finance/DiscrepancyModal';
import DateRangeFilter from '../../components/finance/DateRangeFilter';

export default function DiscrepanciesPage() {
  const {
    financialDiscrepancies,
    updateFinancialDiscrepancy
  } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState(null);

  const filtered = financialDiscrepancies.filter((d) => {
    const matchesSearch =
      !searchQuery.trim() ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.linkedTransactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.folioId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || d.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openCount = financialDiscrepancies.filter((d) => d.status === 'Open').length;
  const investigatingCount = financialDiscrepancies.filter((d) => d.status === 'Investigating').length;
  const resolvedCount = financialDiscrepancies.filter((d) => d.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800">
              Audit & Triage
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Property #048 • Discrepancy Resolution Protocol
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Financial Discrepancies & Ledger Variances
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Investigate, document, and reconcile discrepancies without silent deletion or tampering with protected financial records.
          </p>
        </div>

        {/* Triage Count Badges */}
        <div className="flex items-center gap-2">
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-center shadow-xs">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Open</span>
            <span className="text-sm font-bold text-rose-600 block">{openCount} active</span>
          </div>
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-center shadow-xs">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Investigating</span>
            <span className="text-sm font-bold text-amber-600 block">{investigatingCount} in review</span>
          </div>
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-center shadow-xs">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Resolved</span>
            <span className="text-sm font-bold text-emerald-600 block">{resolvedCount} settled</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <DateRangeFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search discrepancy ID, description, guest, folio..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          { value: 'Open', label: 'Open' },
          { value: 'Investigating', label: 'Investigating' },
          { value: 'Resolved', label: 'Resolved' },
          { value: 'Escalated', label: 'Escalated' }
        ]}
        extraFilter={
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        }
      />

      {/* Discrepancies Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Discrepancy ID</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Variance Type & Description</th>
                <th className="py-3 px-4">Linked Record</th>
                <th className="py-3 px-4">Variance</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">
                    No discrepancies found.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr
                    key={d.id}
                    onClick={() => setSelectedDiscrepancy(d)}
                    className="hover:bg-rose-50/20 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-700">
                      {d.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <FinanceStatusBadge status={d.priority} type="priority" />
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">{d.type}</div>
                      <div className="text-[11px] text-slate-500 truncate">{d.description}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      {d.linkedTransactionId} / {d.folioId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-600">
                      ${d.variance?.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {d.assignedReviewer}
                    </td>
                    <td className="py-3.5 px-4">
                      <FinanceStatusBadge status={d.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {d.deadline}
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setSelectedDiscrepancy(d)}
                        className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-md font-semibold transition-colors"
                      >
                        Investigate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <DiscrepancyModal
        discrepancy={selectedDiscrepancy}
        isOpen={Boolean(selectedDiscrepancy)}
        onClose={() => setSelectedDiscrepancy(null)}
        onUpdateDiscrepancy={updateFinancialDiscrepancy}
      />
    </div>
  );
}
