import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  FileText,
  PieChart,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import DateRangeFilter from '../../components/finance/DateRangeFilter';

export default function ReportsPage() {
  const {
    financialTransactions,
    folios,
    refundRequests,
    reconciliationBatches,
    financialDiscrepancies,
    exportFinancialReport,
    financeProfile
  } = useTasks();

  const [selectedReport, setSelectedReport] = useState('revenue_summary');
  const [selectedPeriod, setSelectedPeriod] = useState('mtd');

  // Revenue & Accounting Computations
  const totalGrossCaptures = financialTransactions
    .filter((t) => t.type.includes('Payment') && t.status === 'Settled')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalGatewayFees = financialTransactions
    .filter((t) => t.status === 'Settled')
    .reduce((sum, t) => sum + Number(t.fee || 0), 0);

  const totalCompletedRefunds = refundRequests
    .filter((r) => r.status === 'Completed')
    .reduce((sum, r) => sum + Number(r.amount || 0), 0);

  // Authoritative Net Revenue: Gross - Gateway Fees - Processed Refunds
  const authoritativeNetRevenue = totalGrossCaptures - totalGatewayFees - totalCompletedRefunds;

  const totalOutstandingFolios = folios.reduce((sum, f) => {
    const chg = (f.charges || []).reduce((a, c) => a + Number(c.amount || 0), 0);
    const pay = (f.payments || []).reduce((a, p) => a + Number(p.amount || 0), 0);
    const ref = (f.refunds || []).reduce((a, r) => a + Number(r.amount || 0), 0);
    return sum + Math.max(0, chg - pay + ref);
  }, 0);

  // Method Breakdown
  const methodTotals = {};
  financialTransactions.forEach((t) => {
    if (t.type.includes('Payment') && t.status === 'Settled') {
      const brand = t.paymentMethod.includes('Visa')
        ? 'Visa'
        : t.paymentMethod.includes('Amex')
        ? 'American Express'
        : t.paymentMethod.includes('Mastercard')
        ? 'Mastercard'
        : 'Direct ACH / Other';
      methodTotals[brand] = (methodTotals[brand] || 0) + Number(t.amount || 0);
    }
  });

  const handleExport = () => {
    exportFinancialReport({
      reportType: selectedReport,
      dateRange: selectedPeriod,
      format: 'CSV'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
              Financial Reporting & Analytics
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Property #048 • Audited GAAP Accounting
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Financial Summaries, Revenue & Export Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Authoritative collections accounting distinguishing Gross Collections, Gateway Fees, and Net Revenue.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Audited Report (CSV)
        </button>
      </div>

      {/* Date Filter & Report Category Selector */}
      <DateRangeFilter
        selectedPreset={selectedPeriod}
        onSelectPreset={setSelectedPeriod}
        onExport={handleExport}
        exportLabel="Export Selection"
        extraFilter={
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="revenue_summary">Revenue & Collections Breakdown</option>
            <option value="refunds_reversals">Refunds, Reversals & Losses</option>
            <option value="aging_folios">Outstanding Folios & Aging</option>
            <option value="payment_methods">Payment Method Distribution</option>
          </select>
        }
      />

      {/* Authoritative Accounting Totals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Gross Payments Collected
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            ${totalGrossCaptures.toFixed(2)}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            All settled terminal & GDS transactions
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Gateway Processing Fees
          </span>
          <span className="text-2xl font-bold text-slate-600 mt-1 block">
            -${totalGatewayFees.toFixed(2)}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Merchant acquirer deductions
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Processed Refunds & Reversals
          </span>
          <span className="text-2xl font-bold text-purple-600 mt-1 block">
            -${totalCompletedRefunds.toFixed(2)}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Service recoveries & rate credits
          </span>
        </div>

        <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
            Authoritative Net Revenue
          </span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">
            ${authoritativeNetRevenue.toFixed(2)}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
            GAAP Net Realized Property Revenue
          </span>
        </div>
      </div>

      {/* Breakdown Section: Payment Methods & Outstanding Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Distribution */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              Settled Collections by Payment Method
            </h3>
            <span className="text-xs text-slate-400 font-mono">USD</span>
          </div>

          <div className="space-y-3">
            {Object.entries(methodTotals).map(([method, amt]) => {
              const pct = totalGrossCaptures > 0 ? (amt / totalGrossCaptures) * 100 : 0;
              return (
                <div key={method} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{method}</span>
                    <span className="font-mono font-bold text-slate-900">
                      ${amt.toFixed(2)} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Outstanding Balances & Aging */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-600" />
              Aging Folios & Uncollected Balances
            </h3>
            <span className="text-xs font-bold text-amber-600 font-mono">
              ${totalOutstandingFolios.toFixed(2)} Total
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {folios
              .filter((f) => {
                const chg = (f.charges || []).reduce((a, c) => a + Number(c.amount || 0), 0);
                const pay = (f.payments || []).reduce((a, p) => a + Number(p.amount || 0), 0);
                const ref = (f.refunds || []).reduce((a, r) => a + Number(r.amount || 0), 0);
                return chg - pay + ref > 0;
              })
              .map((f) => {
                const chg = (f.charges || []).reduce((a, c) => a + Number(c.amount || 0), 0);
                const pay = (f.payments || []).reduce((a, p) => a + Number(p.amount || 0), 0);
                const ref = (f.refunds || []).reduce((a, r) => a + Number(r.amount || 0), 0);
                const bal = chg - pay + ref;
                return (
                  <div
                    key={f.folioId}
                    className="p-3 rounded-lg border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{f.guestName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Folio {f.folioId} • Room {f.roomNumber}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-amber-600 font-mono block">
                        ${bal.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400">Due at Check-out</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Export Governance & Auditing Notice */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-3">
        <Shield className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800 font-bold block mb-0.5">
            Export Governance & Access Control Policy
          </strong>
          All report exports are restricted to authorized financial personnel holding the <span className="font-mono font-semibold">report.export</span> permission. Every downloaded file is cryptographically watermarked with operator ID <span className="font-mono font-semibold">{financeProfile.id}</span> and logged in the immutable audit trail to comply with Sarbanes-Oxley & PCI data governance rules.
        </div>
      </div>
    </div>
  );
}
