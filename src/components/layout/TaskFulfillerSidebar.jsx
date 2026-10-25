import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  History,
  Bell,
  UserCheck,
  Package,
  X,
  Radio,
  ClipboardCheck,
  ShieldAlert
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function TaskFulfillerSidebar({ mobileOpen, onCloseMobile }) {
  const { tasks, currentUser, fulfillerProfile, notifications } = useTasks();

  const activeUser = currentUser || fulfillerProfile;
  const myTasks = tasks.filter((t) => t.assignedTo && t.assignedTo.id === activeUser.id);
  const activeCount = myTasks.filter((t) => t.status !== 'Completed').length;
  const completedCount = myTasks.filter((t) => t.status === 'Completed').length;
  const unreadNotifs = notifications?.filter((n) => !n.isRead && (n.category === 'Task' || n.category === 'Assignment'))?.length || 0;

  const navItems = [
    {
      to: '/task-fulfiller/dashboard',
      label: 'Fulfiller Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/task-fulfiller/tasks',
      label: 'My Tasks',
      icon: ClipboardList,
      badge: activeCount > 0 ? `${activeCount} active` : null,
      badgeColor: 'bg-emerald-500 text-white font-bold'
    },
    {
      to: '/task-fulfiller/history',
      label: 'Task History',
      icon: History,
      badge: completedCount > 0 ? `${completedCount} done` : null,
      badgeColor: 'bg-slate-700 text-slate-200'
    },
    {
      to: '/task-fulfiller/notifications',
      label: 'Alerts & Dispatches',
      icon: Bell,
      badge: unreadNotifs > 0 ? unreadNotifs : null,
      badgeColor: 'bg-amber-500 text-slate-900 font-bold'
    },
    {
      to: '/task-fulfiller/profile',
      label: 'Staff Profile & Skills',
      icon: UserCheck,
      badge: null
    }
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#172B4D] text-slate-100 flex flex-col border-r border-slate-700/60 shadow-xl transition-transform duration-200 ease-in-out lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:z-30 shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-700/50 bg-[#122340]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-slate-900 shadow-xs">
              <ClipboardCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Task Operations
              </span>
              <span className="text-[11px] text-teal-300 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                Attendants & Runners
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close navigation sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fulfiller Staff Card */}
        <div className="px-3.5 py-2.5 bg-slate-900/50 border-b border-slate-700/40 text-[11px]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-semibold text-[10px] uppercase tracking-wider">On-Duty Runner</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-900/80 text-teal-300 border border-teal-700/60 font-mono">
              {activeUser.id || 'EMP-418'}
            </span>
          </div>
          <div className="text-white font-medium truncate text-xs">
            {activeUser.name || 'Marcus Alvarez'}
          </div>
          <div className="mt-1.5 flex items-center justify-between pt-1.5 border-t border-slate-800 text-[10px]">
            <span className="text-slate-400">Radio Channel:</span>
            <span className="text-emerald-400 font-bold">{activeUser.radioChannel || 'CH-04 (Service)'}</span>
          </div>
        </div>

        {/* Active Shift Stats */}
        <div className="px-3 py-2 bg-slate-900/30 border-b border-slate-700/40 grid grid-cols-2 gap-2 text-center text-[10px]">
          <div className="bg-slate-800/60 rounded px-2 py-1">
            <span className="text-slate-400 block font-medium">Pending Tasks</span>
            <span className="text-teal-300 font-bold text-xs">{activeCount}</span>
          </div>
          <div className="bg-slate-800/60 rounded px-2 py-1">
            <span className="text-slate-400 block font-medium">Done Today</span>
            <span className="text-emerald-400 font-bold text-xs">{completedCount}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-white transition-colors" />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] shrink-0 ${item.badgeColor || 'bg-slate-800'}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-700/50 bg-[#122340] text-[11px] flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-medium text-slate-300">Terminal Connected</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">CH-04 Online</span>
        </div>
      </aside>
    </>
  );
}
