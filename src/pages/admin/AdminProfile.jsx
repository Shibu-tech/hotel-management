import React from 'react';
import {
  User,
  ShieldCheck,
  Server,
  Lock,
  Mail,
  KeyRound,
  CheckCircle2,
  Clock,
  LogOut,
  HardDrive,
  Cpu
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function AdminProfile() {
  const { adminProfile, adminRoleInfo, logout } = useTasks();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
            AV
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-cyan-100 text-cyan-950 border border-cyan-200">
                Platform Administrator
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {adminProfile.id || 'ADMIN-001'}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{adminProfile.name}</h1>
            <p className="text-xs text-slate-500 font-medium">
              {adminProfile.title} • {adminProfile.department || 'Infrastructure & Architecture'}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          End Admin Session
        </button>
      </div>

      {/* Security & Access Tier */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Technical Clearance Tier
            </span>
            <ShieldCheck className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            Tier-1 Platform Architect
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            WebAuthn FIDO2 Security Key Enforced
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Authorized to configure application parameters, manage RBAC identities, run integration pings, and trigger database recovery snapshots.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Separation of Duties Constraints
            </span>
            <Lock className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            Zero Financial Disbursement Power
          </div>
          <p className="text-xs text-slate-500 mt-2">
            In strict compliance with SOX Section 404, Platform Administrators cannot issue guest refunds, settle folios, or alter append-only audit log histories.
          </p>
        </div>
      </div>

      {/* Permissions Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Technical Privileges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            { label: 'Enterprise User Account Provisioning', desc: 'Create, update, and manage accounts with last-admin deletion protection.' },
            { label: 'Role & Permission Configuration Oversight', desc: 'View 9 canonical roles and audit capability matrices.' },
            { label: 'Service Integration Telemetry & Health Pings', desc: 'Diagnostic testing of databases, vaults, and PMS gateways.' },
            { label: 'Global Property Parameters & Session Policies', desc: 'Manage timeouts, MFA requirements, and localization settings.' },
            { label: 'Disaster Recovery Snapshots', desc: 'Generate encrypted database archives and verify point-in-time restores.' },
            { label: 'Immutable Audit Log Access', desc: 'Read-only access to tamper-proof administrative security trails.' }
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
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
