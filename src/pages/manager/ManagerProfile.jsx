import React from 'react';
import {
  User,
  Shield,
  Building2,
  Mail,
  Phone,
  Radio,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function ManagerProfile() {
  const { managerProfile, managerRoleInfo } = useTasks();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Department Manager Profile & Authority Scope
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Identity credentials, department authorization scope, and financial governance boundaries.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-200">
          <img
            src={managerProfile.avatarUrl}
            alt={managerProfile.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-500/20 shadow-md"
          />

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-extrabold text-slate-900">
                {managerProfile.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                {managerProfile.role}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {managerProfile.accountStatus}
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Employee ID: <strong className="text-slate-800">{managerProfile.id}</strong> • Reports to: <strong>{managerProfile.manager}</strong>
            </p>

            <div className="pt-1 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{managerProfile.department}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{managerProfile.officeLocation}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Operational Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-5 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Shift Schedule
            </span>
            <div className="font-bold text-slate-800 mt-1">
              {managerProfile.shift}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Delegated Approval Limit
            </span>
            <div className="font-extrabold text-blue-700 text-sm mt-0.5">
              ${managerRoleInfo.delegatedApprovalLimit.toFixed(2)} USD
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <Radio className="w-3 h-3" /> Radio Comm
            </span>
            <div className="font-bold text-slate-800 mt-1">
              {managerProfile.radioChannel}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
              <Phone className="w-3 h-3" /> Internal Ext
            </span>
            <div className="font-bold text-slate-800 mt-1">
              {managerProfile.phoneExt}
            </div>
          </div>
        </div>

        {/* Authority & Governance Safeguards Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-slate-200 text-xs">
          {/* Authorized Actions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Authorized Operational Permissions</span>
            </div>
            <ul className="space-y-2 text-slate-600">
              {managerRoleInfo.authorizedActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Strict Safeguards & Enforced Prohibitions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Security Safeguards & Enforced Restrictions</span>
            </div>
            <ul className="space-y-2 text-slate-600">
              {managerRoleInfo.restrictedFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Role Elevation Protection Banner */}
        <div className="mt-6 p-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-500 text-xs flex items-center gap-2">
          <Shield className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            <strong>Role Elevation Safeguard:</strong> This role profile is governed by enterprise authorization policies. Managers cannot modify their own permissions, approve requests beyond their delegated limit ($250), or modify their own role.
          </span>
        </div>
      </div>
    </div>
  );
}
