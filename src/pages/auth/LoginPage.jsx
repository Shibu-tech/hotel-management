import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Building2,
  DollarSign,
  Shield,
  Users2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Lock,
  ClipboardCheck,
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import {
  ALL_ROLE_PROFILES,
  ROLE_DEFAULT_ROUTES,
  normalizeRole
} from '../../utils/permissions';

export default function LoginPage() {
  const { login, currentUser } = useTasks();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

  const [selectedRole, setSelectedRole] = useState(
    currentUser ? normalizeRole(currentUser.role) : 'financial_operator'
  );

  const rolesList = [
    {
      key: 'financial_operator',
      title: 'Financial Operator',
      name: ALL_ROLE_PROFILES.financial_operator?.name || 'Marcus Sterling',
      department: ALL_ROLE_PROFILES.financial_operator?.department || 'Finance & Revenue Operations',
      scope: 'Folios, Transactions, Gateway Reconciliation, Discrepancies & Refunds',
      icon: DollarSign,
      color: 'amber',
      route: '/finance/dashboard',
      badge: 'Target Role'
    },
    {
      key: 'frontdesk',
      title: 'Front Desk Coordinator',
      name: ALL_ROLE_PROFILES.frontdesk?.name || 'David Martinez',
      department: ALL_ROLE_PROFILES.frontdesk?.department || 'Front Office & Guest Services',
      scope: 'Reservations, Check-In/Out, Room Moves, Guest Requests & Wake-Up Calls',
      icon: Building2,
      color: 'emerald',
      route: '/frontdesk/dashboard'
    },
    {
      key: 'task_fulfiller',
      title: 'Task Fulfiller',
      subtitle: 'Attendants, Runners, Bell Staff & Servers',
      name: ALL_ROLE_PROFILES.task_fulfiller?.name || 'Marcus Alvarez',
      department: ALL_ROLE_PROFILES.task_fulfiller?.department || 'Housekeeping & Guest Operations Support',
      scope: 'View assigned tasks, update task progress, confirm deliveries and collections, and report blockers.',
      icon: ClipboardCheck,
      color: 'teal',
      route: '/task-fulfiller/dashboard'
    },
    {
      key: 'manager',
      title: 'Department Manager',
      name: ALL_ROLE_PROFILES.manager?.name || 'Elena Rostova',
      department: ALL_ROLE_PROFILES.manager?.department || 'Housekeeping & Guest Services Ops',
      scope: 'Operations Oversight, Staff Rosters, SLA Performance & Approvals',
      icon: Shield,
      color: 'purple',
      route: '/manager/dashboard'
    },
    {
      key: 'supervisor',
      title: 'Department Supervisor',
      name: ALL_ROLE_PROFILES.supervisor?.name || 'Sarah Jenkins',
      department: ALL_ROLE_PROFILES.supervisor?.department || 'Housekeeping & Guest Services Ops',
      scope: 'Task Reassignment, Quality Inspections, Blockers & Shift Handovers',
      icon: Users2,
      color: 'blue',
      route: '/supervisor/dashboard'
    },
    {
      key: 'dispatcher',
      title: 'Department Dispatcher',
      name: ALL_ROLE_PROFILES.dispatcher?.name || 'Cynthia Vance',
      department: ALL_ROLE_PROFILES.dispatcher?.department || 'Housekeeping & Guest Services',
      scope: 'Task Creation, Dispatch Queue, Staff Workload & SLA Timers',
      icon: Building2,
      color: 'slate',
      route: '/dispatcher/dashboard'
    },
    {
      key: 'security',
      title: 'Security Responder',
      name: ALL_ROLE_PROFILES.security?.name || 'Marcus Vance',
      department: ALL_ROLE_PROFILES.security?.department || 'Safety & Security Operations',
      scope: 'Emergency Incident Dispatch, Safety Lockouts, Floor Patrols',
      icon: ShieldAlert,
      color: 'red',
      route: '/security/dashboard'
    },
    {
      key: 'executive',
      title: 'Executive Viewer/Approver',
      name: ALL_ROLE_PROFILES.executive?.name || 'Victoria Montgomery',
      department: ALL_ROLE_PROFILES.executive?.department || 'Executive Leadership & Operations Oversight',
      scope: 'Hotel-wide Performance, Escalations, Reports & Delegated Approvals',
      icon: BarChart3,
      color: 'indigo',
      route: '/executive/dashboard'
    },
    {
      key: 'platform_admin',
      title: 'Platform Administrator',
      name: ALL_ROLE_PROFILES.platform_admin?.name || 'Alexandre Vance',
      department: ALL_ROLE_PROFILES.platform_admin?.department || 'Information Technology & Platform Systems',
      scope: 'User Access, System Configuration, Integrations & Audit Logs',
      icon: ShieldCheck,
      color: 'cyan',
      route: '/admin/dashboard'
    }
  ];

  const handleSignIn = (roleKey) => {
    const profile = ALL_ROLE_PROFILES[roleKey];
    if (!profile) return;
    login(profile);

    // If redirected from an authorized route matching this role, go there
    const prefix =
      roleKey === 'financial_operator'
        ? 'finance'
        : roleKey === 'task_fulfiller'
        ? 'task-fulfiller'
        : roleKey === 'platform_admin'
        ? 'admin'
        : roleKey;

    if (redirectTarget && redirectTarget.startsWith(`/${prefix}`)) {
      navigate(redirectTarget, { replace: true });
    } else {
      navigate(ROLE_DEFAULT_ROUTES[roleKey] || '/finance/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-semibold mb-4">
          <Lock className="w-3.5 h-3.5" />
          Enterprise Role-Based Access Control
        </div>

        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            StayOps Hotel Platform
          </h1>
        </div>

        <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          Select an authorized role to initialize or restore your session. Direct access and default routing will route automatically according to your authenticated permissions.
        </p>

        {redirectTarget && (
          <div className="mt-4 inline-block bg-amber-950/60 border border-amber-800/80 rounded-lg px-3.5 py-1.5 text-xs text-amber-200">
            Sign in required to access: <code className="font-mono text-white">{redirectTarget}</code>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Select Authorized User Profile
            </h2>
            <span className="text-xs text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
              {rolesList.length} Configured Workspaces
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rolesList.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.key;

              return (
                <div
                  key={r.key}
                  onClick={() => setSelectedRole(r.key)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                      : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white shadow-xs ${
                            r.color === 'amber'
                              ? 'bg-amber-600'
                              : r.color === 'emerald'
                              ? 'bg-emerald-600'
                              : r.color === 'teal'
                              ? 'bg-teal-600'
                              : r.color === 'purple'
                              ? 'bg-purple-600'
                              : r.color === 'red'
                              ? 'bg-rose-600'
                              : r.color === 'indigo'
                              ? 'bg-indigo-600'
                              : r.color === 'cyan'
                              ? 'bg-cyan-600'
                              : 'bg-blue-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white">{r.title}</h3>
                          {r.subtitle && (
                            <p className="text-[10px] text-teal-300 font-medium">{r.subtitle}</p>
                          )}
                          <p className="text-[11px] text-slate-400 font-medium">{r.name}</p>
                        </div>
                      </div>

                      {r.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                          {r.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                      {r.scope}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">
                      Destination: {r.route}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSignIn(r.key);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-xs"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Multi-Role Hotel Operational Architecture • {rolesList.length} Workspaces</span>
            </div>
            <div>Grand Azure Bay Resort & Conference Center</div>
          </div>
        </div>
      </div>
    </div>
  );
}
