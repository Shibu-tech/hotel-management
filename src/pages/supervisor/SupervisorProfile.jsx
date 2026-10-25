import React from 'react';
import {
  User,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Clock,
  Mail,
  Phone,
  Radio,
  MapPin,
  CheckCircle2,
  Lock,
  RotateCcw
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { SUPERVISOR_ROLE_INFO, SUPERVISOR_PROFILE } from '../../utils/permissions';
import Button from '../../components/ui/Button';

export default function SupervisorProfile() {
  const { supervisorProfile, resetToMockData } = useTasks();
  const profile = supervisorProfile || SUPERVISOR_PROFILE;
  const roleInfo = SUPERVISOR_ROLE_INFO || {};
  const authorizedActions = roleInfo.authorizedActions || [];
  const restrictedFeatures = roleInfo.restrictedFeatures || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Navy Cover Bar */}
        <div className="h-32 bg-gradient-to-r from-[#172B4D] via-[#1E3A8A] to-[#2563EB] relative">
          <div className="absolute right-4 top-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm border border-white/30">
              Department Operations Authority
            </span>
          </div>
        </div>

        {/* Profile Avatar & Primary Info */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-lg bg-white"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {profile.name}
                </h1>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {profile.id}
                </span>
              </div>
              <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                {profile.role}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {profile.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {profile.accountStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact & Operational Assignment */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            Operational Assignment & Shifts
          </h2>

          <div className="divide-y divide-slate-100 text-xs text-slate-700">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Department Scope</span>
              <span className="font-bold text-slate-900">{profile.department}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Current Shift</span>
              <span className="font-bold text-slate-900">{profile.shift}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Reporting Manager</span>
              <span className="font-bold text-slate-900">{profile.manager}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Command Post / Office</span>
              <span className="font-semibold text-slate-900">{profile.officeLocation}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Radio Dispatch Channel</span>
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {profile.radioChannel}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Internal Phone Ext</span>
              <span className="font-mono font-semibold text-slate-900">{profile.phoneExt}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Official Email</span>
              <span className="font-mono text-slate-900">{profile.email}</span>
            </div>
          </div>
        </div>

        {/* Delegated Authorities */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Delegated Operational Authorities
          </h2>

          <div className="space-y-2 text-xs">
            {authorizedActions.map((action, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100 text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Protection & Authority Boundaries Notice */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-900">
          <Lock className="w-4 h-4 text-amber-600" />
          <h2 className="text-sm font-bold tracking-tight">
            Security & Authority Boundaries (Non-Elevated Guard)
          </h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          In strict compliance with StayOps security architecture, supervisors operate within delegated floor
          execution parameters. Role permissions cannot be self-elevated or modified.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {restrictedFeatures.map((feat, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Need to reset demo state or test alternative roles?</span>
          <Button
            variant="outline"
            size="sm"
            onClick={resetToMockData}
            className="text-xs text-amber-800 border-amber-300 hover:bg-amber-50"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Reset Demo Dataset
          </Button>
        </div>
      </div>
    </div>
  );
}
