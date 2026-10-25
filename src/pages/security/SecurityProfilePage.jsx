import React from 'react';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  ShieldAlert,
  Radio,
  Building2,
  Lock,
  CheckCircle2,
  XCircle,
  FileText,
  BadgeCheck,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function SecurityProfilePage() {
  const { securityProfile, securityRoleInfo } = useTasks();

  const permissionsList = Object.entries(securityProfile?.permissions || {}).map(([key, val]) => ({
    key,
    allowed: !!val
  }));

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-[#172B4D] rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={securityProfile?.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80'}
            alt={securityProfile?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-red-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-600 text-white flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" />
                Certified Lead Officer
              </span>
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active / On-Duty
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">{securityProfile?.name || 'Marcus Vance'}</h1>
            <p className="text-slate-300 text-xs mt-0.5">
              {securityProfile?.title || 'Lead Safety & Security Officer'} • {securityProfile?.id || 'EMP-601'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/security/dashboard"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Responder Credentials & Terminal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs space-y-1 text-xs">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Department & Division</span>
          <p className="font-bold text-slate-800 text-sm">{securityProfile?.department || 'Safety & Security Operations'}</p>
          <span className="text-slate-500 font-mono text-[11px]">Division Code: {securityProfile?.departmentCode || 'SEC-SAFE'}</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs space-y-1 text-xs">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Assigned Radio Frequency</span>
          <p className="font-bold text-emerald-600 text-sm font-mono flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            {securityProfile?.radioChannel || 'CH 03 (Emergency Command)'}
          </p>
          <span className="text-slate-500 text-[11px]">Primary Dispatch Priority</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs space-y-1 text-xs">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Terminal Station</span>
          <p className="font-bold text-slate-800 text-sm">{securityProfile?.terminal || 'Security Control Hub — Sub-Level 1'}</p>
          <span className="text-slate-500 text-[11px]">Direct Ext: {securityProfile?.phoneExt || 'x6010'}</span>
        </div>
      </div>

      {/* Permissions Matrix & Scope Boundaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authorized Permissions */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Authorized Role Capabilities</h2>
          </div>

          <div className="p-4 space-y-2.5 text-xs">
            {permissionsList.map((perm) => (
              <div
                key={perm.key}
                className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/40 border border-emerald-100"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-mono font-bold text-slate-800">{perm.key}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Granted
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Restricted Boundaries (RBAC Compliance) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-600" />
            <h2 className="text-sm font-bold text-slate-900">Enforced Scope Boundaries (RBAC)</h2>
          </div>

          <div className="p-4 space-y-3 text-xs">
            <p className="text-slate-600 text-[11px] leading-relaxed">
              To maintain PCI-DSS data compliance, financial separation of duties, and guest privacy, the Security Responder profile has strict system boundaries:
            </p>

            {(securityRoleInfo?.restrictedFeatures || [
              'Guest Financial Folios & Cashier Transactions',
              'Room Rate Adjustments & Revenue Ledgers',
              'Staff Payroll & HR Disciplinary Records',
              'Payment Card / PCI Sensitive Storage',
              'Platform Super-Admin System Settings'
            ]).map((rest, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-rose-50/50 border border-rose-200/80 text-rose-950 font-medium"
              >
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{rest}</span>
              </div>
            ))}

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-500 text-[11px]">
              Evidence records are permanently sealed. Ordinary responders cannot erase or tamper with protected video/audio artifacts or chronological case timelines.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
