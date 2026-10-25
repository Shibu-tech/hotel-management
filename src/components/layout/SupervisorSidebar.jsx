import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  ClipboardCheck,
  AlertOctagon,
  Users2,
  ArrowRightLeft,
  Bell,
  UserCheck,
  ShieldAlert,
  Info,
  Radio,
  X
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function SupervisorSidebar({ mobileOpen, onCloseMobile }) {
  const { supervisorMetrics, unreadNotificationsCount, supervisorProfile } = useTasks();

  const navItems = [
    {
      to: '/supervisor/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/supervisor/tasks',
      label: 'Team Tasks',
      icon: CheckSquare,
      badge: supervisorMetrics.activeTasksCount > 0 ? supervisorMetrics.activeTasksCount : null,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      to: '/supervisor/inspections',
      label: 'Inspections',
      icon: ClipboardCheck,
      badge: supervisorMetrics.pendingInspectionCount > 0 ? `${supervisorMetrics.pendingInspectionCount} review` : null,
      badgeColor: 'bg-amber-100 text-amber-800 animate-pulse'
    },
    {
      to: '/supervisor/blockers',
      label: 'Blockers & Issues',
      icon: AlertOctagon,
      badge: supervisorMetrics.blockedTasksCount > 0 ? supervisorMetrics.blockedTasksCount : null,
      badgeColor: 'bg-red-100 text-red-700 font-bold'
    },
    {
      to: '/supervisor/team',
      label: 'Team Workload',
      icon: Users2,
      badge: null
    },
    {
      to: '/supervisor/handover',
      label: 'Handover',
      icon: ArrowRightLeft,
      badge: null
    },
    {
      to: '/supervisor/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null,
      badgeColor: 'bg-red-100 text-red-700'
    },
    {
      to: '/supervisor/profile',
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
            <span className="font-bold text-slate-800 text-sm">Supervisor Navigation</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Supervisor Department Scope */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Department Scope
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
              <Radio className="w-2.5 h-2.5 text-blue-600 animate-pulse" />
              CH 01 Lead
            </span>
          </div>
          <p className="text-xs font-bold text-slate-800">
            {supervisorProfile.department}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-700 font-semibold">
            <span>Role: Department Supervisor</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== null && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor
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

      {/* Bottom Supervisor Authority & Boundary Notice */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-slate-50/90 border border-slate-200 text-slate-600 text-[11px] space-y-1.5">
        <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
          <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Supervisor Governance</span>
        </div>
        <p className="text-slate-500 leading-tight">
          Authorized for reassignments, quality inspections, corrective actions & safety lockouts.
        </p>
        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200/60">
          <span>StayOps Supervisor</span>
          <span className="font-mono">EMP-201</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed/Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white border-r border-slate-200/80 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
