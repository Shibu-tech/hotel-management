import React from 'react';
import {
  User,
  ShieldCheck,
  Building2,
  Mail,
  DollarSign,
  KeyRound,
  CheckCircle2,
  Award,
  Clock,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function ExecutiveProfile() {
  const { executiveProfile, executiveRoleInfo, logout } = useTasks();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
            VM
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
                Executive Leadership
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {executiveProfile.id || 'EXEC-001'}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{executiveProfile.name}</h1>
            <p className="text-xs text-slate-500 font-medium">
              {executiveProfile.title} • {executiveProfile.hotelName || 'Grand Azure Bay Resort & Conference Center'}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          End Executive Session
        </button>
      </div>

      {/* Authority & Security Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Delegated Approval Cap */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Delegated Financial Authority
            </span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700">
            ${(executiveProfile.authorityLimit || 10000).toLocaleString()}.00 USD
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Authorized single-transaction threshold for service recoveries, dispute settlements, and operational expenditures. Requests exceeding this require board sign-off.
          </p>
        </div>

        {/* Security & Access Tier */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Security Classification & MFA
            </span>
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            Tier-4 Executive Clearance
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Hardware FIDO2 Token Authenticated
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Restricted access with read-only operational oversight, multi-department visibility, and high-value approvals.
          </p>
        </div>
      </div>

      {/* Permissions Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Authorized Executive Capabilities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            { label: 'Hotel-Wide Cross-Department Visibility', desc: 'Real-time read access to Housekeeping, Maintenance, Front Office, F&B, Security.' },
            { label: 'Executive Incident Oversight & Directives', desc: 'Directive issuance and leadership escalation on critical safety incidents.' },
            { label: 'Delegated Financial & Recovery Sign-Off', desc: 'Authorization of concessions and guest dispute credits up to $10,000.' },
            { label: 'Corporate Compliance & Policy Sign-Off', desc: 'Annual SOX, PCI, and life safety audit oversight approvals.' },
            { label: 'Separation of Duties Enforced', desc: 'Cannot execute financial refunds directly or approve self-submitted requests.' },
            { label: 'No Technical IT Administration', desc: 'Cannot modify IT system configurations, user passwords, or backend integrations.' }
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                {item.label}
              </div>
              <p className="text-[11px] text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
