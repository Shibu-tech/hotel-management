import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  BarChart3,
  Bell,
  UserCheck,
  Shield,
  DollarSign,
  AlertTriangle,
  X
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function ManagerSidebar({ mobileOpen, onCloseMobile }) {
  const { managerMetrics, unreadNotificationsCount, managerProfile, managerRoleInfo } = useTasks();

  const navItems = [
    {
      to: '/manager/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/manager/tasks',
      label: 'Department Tasks',
      icon: CheckSquare,
      badge: managerMetrics.openTasksCount > 0 ? managerMetrics.openTasksCount : null,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      to: '/manager/staffing',
      label: 'Staffing & Scheduling',
      icon: Users,
      badge: managerMetrics.availableStaffCount !== undefined ? `${managerMetrics.availableStaffCount} avail` : null,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      to: '/manager/performance',
      label: 'SLA & Performance',
      icon: TrendingUp,
      badge: managerMetrics.slaBreachedCount > 0 ? `${managerMetrics.slaBreachedCount} breach` : null,
      badgeColor: 'bg-rose-100 text-rose-800 font-bold'
    },
    {
      to: '/manager/complaints',
      label: 'Complaints & Recovery',
      icon: AlertOctagon,
      badge: managerMetrics.openComplaintsCount > 0 ? `${managerMetrics.openComplaintsCount} open` : null,
      badgeColor: managerMetrics.highSeverityComplaintsCount > 0 ? 'bg-red-100 text-red-800 font-bold animate-pulse' : 'bg-amber-100 text-amber-800'
    },
    {
      to: '/manager/approvals',
      label: 'Approvals',
      icon: CheckCircle2,
      badge: managerMetrics.pendingApprovalsCount > 0 ? `${managerMetrics.pendingApprovalsCount} pend` : null,
      badgeColor: 'bg-purple-100 text-purple-800 font-bold'
    },
    {
      to: '/manager/reports',
      label: 'Reports',
      icon: BarChart3,
      badge: null
    },
    {
      to: '/manager/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null,
      badgeColor: 'bg-red-100 text-red-700'
    },
    {
      to: '/manager/profile',
      label: 'My Profile',
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
            <span className="font-bold text-slate-800 text-sm">Manager Workspace</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Manager Operational Scope Pill */}
        <div className="p-3.5 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Department Scope
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
              <Shield className="w-3 h-3" />
              Manager
            </span>
          </div>
          <div className="font-bold text-xs text-slate-900 leading-tight">
            {managerProfile.department}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>Staff Roster: {managerMetrics.totalStaffCount} active</span>
            <span className="font-semibold text-emerald-700">{managerMetrics.staffingCoveragePercent}% on-duty</span>
          </div>
        </div>

        {/* Delegated Approval Authority Pill */}
        <div className="px-3 py-2 mx-3 mb-2 rounded-lg bg-blue-50/70 border border-blue-200/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-blue-900 font-semibold">
            <DollarSign className="w-3.5 h-3.5 text-blue-600" />
            <span>Delegated Limit</span>
          </div>
          <span className="font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 text-[11px]">
            ${managerRoleInfo.delegatedApprovalLimit.toFixed(2)} USD
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-white' : 'text-slate-500'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeColor || 'bg-slate-100 text-slate-700'
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
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-3 m-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center justify-between font-semibold text-slate-700">
          <span>SLA Compliance Target</span>
          <span className={`${(managerMetrics.slaComplianceRate || 0) >= 85 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {managerMetrics.slaComplianceRate !== null ? `${managerMetrics.slaComplianceRate}%` : '—'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <Shield className="w-3 h-3 text-slate-400" />
          <span>Restricted to Authorized Dept Scope</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block w-64 bg-white border-r border-slate-200/80 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
