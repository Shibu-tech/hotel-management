import React from 'react';
import {
  User,
  Shield,
  ShieldCheck,
  ShieldX,
  Building2,
  Clock,
  Phone,
  Radio,
  MapPin,
  Lock,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { DISPATCHER_ROLE_INFO, DISPATCHER_PROFILE } from '../../utils/permissions';
import { useTasks } from '../../context/TaskContext';

export default function DispatcherProfile() {
  const { dispatcherProfile } = useTasks();
  const profile = dispatcherProfile || DISPATCHER_PROFILE;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-150">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
          My Dispatcher Profile & Credentials
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Role authorizations, radio channels, shift coverage, and access boundary policies
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-subtle">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-100 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{profile.name}</h2>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {profile.id}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                {profile.role}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {profile.department} • Grand Azure Resort & Suites
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {profile.accountStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1 w-full sm:w-auto">
            <div>
              Supervisor: <strong className="text-slate-800">{profile.supervisor}</strong>
            </div>
            <div>
              Duty Station: <span className="text-slate-700">{profile.deskLocation}</span>
            </div>
          </div>
        </div>

        {/* Operational Credentials Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Active Shift</span>
            </div>
            <div className="font-bold text-slate-900">{profile.shift}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Radio className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Radio Channel</span>
            </div>
            <div className="font-mono font-bold text-slate-900">{profile.radioChannel}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Phone className="w-4 h-4 text-purple-600" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Internal Extension</span>
            </div>
            <div className="font-mono font-bold text-slate-900">{profile.phoneExt}</div>
          </div>
        </div>
      </div>

      {/* Role Boundaries and Security Permissions */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-subtle space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Role Authority & Permission Scopes
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Clear role isolation enforced by StayOps hotel system security
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Authorized Actions */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Authorized Dispatch Permissions
            </h4>
            <ul className="text-xs text-emerald-800 space-y-1.5 list-disc list-inside">
              <li>Manage and categorize department task queues</li>
              <li>Assign and reassign tasks to eligible floor runners</li>
              <li>Schedule start times and adjust expected arrival SLAs</li>
              <li>Log operational delays and reason justifications</li>
              <li>Formally escalate tickets to Department Supervisor</li>
              <li>Record authorized guest communications via Front Desk</li>
            </ul>
          </div>

          {/* Prohibited / Elevated Boundaries */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Lock className="w-4 h-4 text-slate-500" />
              Protected Security Boundaries
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Cannot modify own role or self-escalate privileges</li>
              <li>Cannot access guest financial ledgers or folios</li>
              <li>Cannot override room rates, POS prices, or issue cash refunds</li>
              <li>Cannot delete immutable event audit history</li>
              <li>Cannot access unrelated guest identity or card data</li>
            </ul>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900 leading-relaxed">
          <strong>Security Compliance Notice:</strong> Role assignment and security scope are managed centrally by the Hotel General Manager & Operations Director. Dispatchers may not edit their own role classification.
        </div>
      </div>
    </div>
  );
}
