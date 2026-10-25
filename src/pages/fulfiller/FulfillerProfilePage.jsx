import React from 'react';
import {
  UserCheck,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Radio,
  Clock,
  Building2,
  CheckCircle2,
  XCircle,
  FileText,
  Lock,
  RotateCcw
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { FULFILLER_PROFILE, FULFILLER_ROLE_INFO } from '../../utils/permissions';
import Button from '../../components/ui/Button';

export default function FulfillerProfilePage() {
  const { currentUser, fulfillerProfile, resetToMockData } = useTasks();

  const activeStaff = currentUser || fulfillerProfile || FULFILLER_PROFILE;
  const roleInfo = FULFILLER_ROLE_INFO;

  const permissionsList = [
    { key: 'task.read', label: 'View Assigned Tasks & Details', granted: true, note: 'Authorized to view assigned task instructions, room numbers, and item requirements.' },
    { key: 'task.update_status', label: 'Update Task Lifecycle Status', granted: true, note: 'Permitted to transition tasks (New -> In Progress -> En Route -> Completed).' },
    { key: 'task.claim', label: 'Claim Eligible Pool Tasks', granted: true, note: 'Authorized to claim unassigned department tasks from the open queue.' },
    { key: 'task.block', label: 'Report Blocker to Supervisor', granted: true, note: 'Can mark tasks as Blocked and escalate impediments to Floor Supervisor.' },
    { key: 'task.note', label: 'Add Task Progress Notes', granted: true, note: 'Permitted to append operational status notes and execution observations.' },
    { key: 'delivery.confirm', label: 'Record Delivery Confirmation', granted: true, note: 'Authorized to log handover evidence and recipient verification.' }
  ];

  const restrictedList = [
    { key: 'finance.folios', label: 'Guest Folios & Payment Data', note: 'Strictly restricted. Financial ledgers and credit card details are locked.' },
    { key: 'refund.approve', label: 'Refund & Compensation Approvals', note: 'Restricted. Financial compensations require Department Manager sign-off.' },
    { key: 'report.financial', label: 'Hotel Financial Reporting', note: 'Restricted to Financial Operator and General Management.' },
    { key: 'task.reassign_others', label: 'Reassigning Colleagues Tasks', note: 'Restricted to Dispatcher and Supervisor command roles.' },
    { key: 'staff.schedule_edit', label: 'Modify Hotel Staffing Rosters', note: 'Restricted. Only Department Managers can edit schedules.' },
    { key: 'security.override', label: 'Modify Security Policies & Lockouts', note: 'Restricted to Security Responders and Certified Safety Officers.' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-teal-600" />
          <span>Task Fulfiller Staff Profile & Credentials</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Staff authentication details, shift parameters, and role-based permissions matrix.
        </p>
      </div>

      {/* Staff Identity Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src={activeStaff.avatarUrl}
            alt={activeStaff.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-teal-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{activeStaff.name}</h2>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {activeStaff.id || 'EMP-418'}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {activeStaff.role} • {activeStaff.department}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{activeStaff.email}</p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1 text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            {activeStaff.shift || 'Morning Shift (07:00 – 15:30)'}
          </span>
          <span className="font-semibold text-teal-700 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-teal-600" />
            Radio Channel 04 (Ops Support)
          </span>
          <span className="font-semibold text-slate-500 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            {activeStaff.propertyScope || 'Grand Horizon Hotel & Suites'}
          </span>
        </div>
      </div>

      {/* Role Specifications */}
      <div className="bg-gradient-to-r from-teal-950 to-slate-900 rounded-2xl p-5 text-white border border-teal-800 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-teal-300 font-bold text-xs uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Role Scope & Architecture</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          {roleInfo.description}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {roleInfo.categories?.map((cat) => (
            <span
              key={cat}
              className="text-[11px] font-semibold bg-teal-900/60 text-teal-200 px-2.5 py-1 rounded-md border border-teal-700/50"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Authorized Permissions */}
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-emerald-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Authorized Operational Permissions
              </h3>
              <p className="text-[11px] text-slate-500">
                Granted based on role assignment
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {permissionsList.map((perm) => (
              <div
                key={perm.key}
                className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200/60 space-y-0.5"
              >
                <div className="flex items-center justify-between font-bold text-xs text-emerald-900">
                  <span>{perm.label}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="font-mono text-[10px] text-emerald-700">{perm.key}</div>
                <p className="text-[11px] text-slate-600 leading-snug">{perm.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RBAC Restrictions & Safeguards */}
        <div className="bg-white rounded-2xl border border-red-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-red-100">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-sm font-bold text-red-950">
                Enforced RBAC Restrictions
              </h3>
              <p className="text-[11px] text-slate-500">
                Protected administrative & financial domains
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {restrictedList.map((rest) => (
              <div
                key={rest.key}
                className="p-2.5 rounded-lg bg-red-50/40 border border-red-200/60 space-y-0.5"
              >
                <div className="flex items-center justify-between font-bold text-xs text-red-900">
                  <span>{rest.label}</span>
                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                </div>
                <div className="font-mono text-[10px] text-red-600">{rest.key}</div>
                <p className="text-[11px] text-slate-600 leading-snug">{rest.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
