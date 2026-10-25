import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  Users2,
  Bell,
  UserCheck,
  ShieldAlert,
  Info,
  Radio,
  X
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function DispatcherSidebar({ mobileOpen, onCloseMobile }) {
  const { summaryMetrics, unreadNotificationsCount, dispatcherProfile } = useTasks();

  const navItems = [
    {
      to: '/dispatcher/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/dispatcher/tasks',
      label: 'Task Queue',
      icon: ListTodo,
      badge: summaryMetrics.openTasksCount > 0 ? summaryMetrics.openTasksCount : null,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      to: '/dispatcher/tasks/new',
      label: 'Create Task',
      icon: PlusCircle,
      badge: null
    },
    {
      to: '/dispatcher/staff',
      label: 'Staff Workload',
      icon: Users2,
      badge: `${summaryMetrics.availableStaffCount} avail`,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      to: '/dispatcher/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null,
      badgeColor: 'bg-red-100 text-red-700'
    },
    {
      to: '/dispatcher/profile',
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
            <span className="font-bold text-slate-800 text-sm">Navigation Menu</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Dispatcher Scope Header in Sidebar */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Authorized Scope
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
              <Radio className="w-2.5 h-2.5 text-blue-600 animate-pulse" />
              CH 04 Active
            </span>
          </div>
          <p className="text-xs font-bold text-slate-800">
            {dispatcherProfile.department}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Queue dispatch & staff workload allocation
          </p>
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

      {/* Bottom Dispatcher Compliance & Boundary Notice */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-slate-50/90 border border-slate-200 text-slate-600 text-[11px] space-y-1.5">
        <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
          <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Dispatcher Role Guard</span>
        </div>
        <p className="text-slate-500 leading-tight">
          Restricted from guest billing folios, room rate overrides, and executive configurations.
        </p>
        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
          <span>StayOps v2.4</span>
          <span className="font-mono">EMP-304</span>
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
