import React from 'react';
import {
  UserCheck,
  Shield,
  ShieldCheck,
  Building2,
  Lock,
  KeyRound,
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function FinanceProfile() {
  const {
    financeProfile,
    financeRoleInfo,
    toggleFinancePermission,
    resetToMockData
  } = useTasks();

  const permissionDescriptions = {
    'folio.read': 'View authorized guest folios, rate breakdowns, and charges',
    'folio.adjust': 'Post auditable adjustments and ledger reversals with mandatory rationale',
    'transaction.read': 'View transaction details & provider tokens safely (masked credentials)',
    'payment.record': 'Authorize & record guest payments with gateway authorization codes',
    'reconciliation.manage': 'Run automated & manual reconciliation batches against gateway settlements',
    'discrepancy.manage': 'Triage, investigate, and resolve financial discrepancies and variances',
    'refund.request': 'Submit guest refund requests with balance and duplicate execution validation',
    'refund.approve': 'Approve eligible refund requests up to delegated $1,000.00 policy limit',
    'refund.execute': 'Execute approved refunds through payment provider with idempotency protection',
    'report.read': 'Generate daily, weekly, and monthly financial summaries and revenue reports',
    'report.export': 'Export financial reports with mandatory access logging and audit tracking',
    'financial_audit.read': 'Review the immutable chronological financial audit trail'
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img
          src={financeProfile.avatarUrl}
          alt={financeProfile.name}
          className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-500/20 shadow-sm"
        />

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  {financeProfile.name}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {financeProfile.accountStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {financeProfile.title} • ID: <span className="font-mono font-semibold text-slate-700">{financeProfile.id}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Delegated Approval Authority
              </span>
              <span className="text-lg font-bold text-emerald-600 block">
                ${financeProfile.approvalLimitUSD?.toFixed(2)} USD
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Department</span>
              <span className="font-medium text-slate-800">{financeProfile.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Property Scope</span>
              <span className="font-medium text-slate-800">{financeProfile.propertyScope}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Reporting To</span>
              <span className="font-medium text-slate-800">{financeProfile.manager}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Granular Permissions Matrix & Interactive Testing Toggles */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Granular Financial Permissions Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enforced server-side on all financial endpoints. Toggle permissions below to test permission guards in demo mode.
            </p>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Interactive Test Mode
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(permissionDescriptions).map(([permKey, desc]) => {
            const isGranted = Boolean(financeProfile.permissions[permKey]);
            return (
              <div
                key={permKey}
                onClick={() => toggleFinancePermission(permKey)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isGranted
                    ? 'bg-emerald-50/30 border-emerald-200 hover:border-emerald-300'
                    : 'bg-rose-50/30 border-rose-200 hover:border-rose-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {permKey}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        isGranted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isGranted ? 'GRANTED' : 'REVOKED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <button
                  type="button"
                  className={`px-2 py-1 rounded text-[11px] font-bold shrink-0 transition-colors ${
                    isGranted
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-rose-600 text-white hover:bg-rose-700'
                  }`}
                >
                  {isGranted ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strict Security Constraints & Prohibitions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Lock className="w-4 h-4 text-rose-600" />
          Mandatory Role Constraints & Prohibitions
        </h3>
        <p className="text-xs text-slate-500">
          The following security safeguards are strictly enforced by system policy and cannot be overridden by this role:
        </p>

        <ul className="space-y-2 text-xs text-slate-700 divide-y divide-slate-100">
          {financeRoleInfo.restrictedFeatures?.map((restr, idx) => (
            <li key={idx} className="pt-2 flex items-start gap-2">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{restr}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Session Security Details */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">Session Security & Terminal Diagnostics</h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono">TLS 1.3 / Authenticated</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Workstation</span>
            <span className="text-slate-200 font-medium">{financeProfile.workstation}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Shift Schedule</span>
            <span className="text-slate-200 font-medium">{financeProfile.shift}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">MFA Method</span>
            <span className="text-slate-200 font-medium">Hardware FIDO2 Security Key</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">IP Address</span>
            <span className="font-mono text-emerald-400">10.48.12.92 (Internal VLAN)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
