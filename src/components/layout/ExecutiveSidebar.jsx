import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  AlertOctagon,
  CheckCircle2,
  BarChart3,
  ShieldCheck,
  Bell,
  UserCheck,
  X,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function ExecutiveSidebar({ mobileOpen, onCloseMobile }) {
  const {
    executiveKPIs,
    executiveProfile,
    executiveRoleInfo,
    executiveNotifications
  } = useTasks();

  const unreadNotifsCount = executiveNotifications?.filter((n) => !n.isRead)?.length || 0;

  const navItems = [
    {
      to: '/executive/dashboard',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/executive/departments',
      label: 'Department Performance',
      icon: Building2,
      badge: `${executiveKPIs.slaComplianceRate}% SLA`,
      badgeColor: 'bg-emerald-100 text-emerald-800 font-semibold'
    },
    {
      to: '/executive/escalations',
      label: 'Escalations & Incidents',
      icon: AlertOctagon,
      badge: executiveKPIs.activeSeriousIncidentsCount > 0 ? `${executiveKPIs.activeSeriousIncidentsCount} serious` : null,
      badgeColor: 'bg-rose-100 text-rose-800 font-bold animate-pulse'
    },
    {
      to: '/executive/approvals',
      label: 'Delegated Approvals',
      icon: CheckCircle2,
      badge: executiveKPIs.pendingApprovalsCount > 0 ? `${executiveKPIs.pendingApprovalsCount} pending` : null,
      badgeColor: 'bg-indigo-100 text-indigo-800 font-bold'
    },
    {
      to: '/executive/reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      badge: null
    },
    {
      to: '/executive/compliance',
      label: 'Policy & Compliance',
      icon: ShieldCheck,
      badge: null
    },
    {
      to: '/executive/notifications',
      label: 'Executive Inbox',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : null,
      badgeColor: 'bg-rose-500 text-white font-bold'
    },
    {
      to: '/executive/profile',
      label: 'Executive Profile',
      icon: UserCheck,
      badge: null
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Mobile Header Close */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm">Executive Suite</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Executive Authority Banner */}
        <div className="p-4 mx-3 my-3 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white rounded-xl shadow-md border border-indigo-900/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 block">
                Executive Authority
              </span>
              <span className="text-xs font-bold text-white block">
                Up to $10,000.00 Limit
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 leading-tight">
            Hotel-wide oversight, cross-department escalations, and executive recovery authorization.
          </p>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-2 space-y-1">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Governance & Performance
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          isActive ? 'bg-white/20 text-white font-bold' : item.badgeColor || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Role Profile Footnote */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <img
            src={executiveProfile.avatarUrl}
            alt={executiveProfile.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">
              {executiveProfile.name}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {executiveProfile.title}
            </div>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
          <span>Role ID: {executiveRoleInfo.roleId}</span>
          <span className="font-semibold text-indigo-800 font-mono">EXEC-LEAD</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-slate-200/90 shrink-0">
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
