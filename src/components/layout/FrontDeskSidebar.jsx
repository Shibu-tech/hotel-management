import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  LogIn,
  LogOut,
  ClipboardList,
  AlertOctagon,
  ArrowLeftRight,
  AlarmClock,
  MessageSquare,
  CreditCard,
  BarChart3,
  Bell,
  User,
  Shield,
  Lock,
  Building2,
  X,
  Sparkles
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function FrontDeskSidebar({ mobileOpen, onCloseMobile }) {
  const {
    frontDeskMetrics,
    frontDeskProfile,
    unreadNotificationsCount,
    frontDeskRoleInfo
  } = useTasks();

  const hasFinancialAccess = frontDeskProfile?.hasFinancialAccess !== false;

  const navItems = [
    {
      to: '/frontdesk/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/frontdesk/reservations',
      label: 'Reservations',
      icon: CalendarCheck,
      badge: null
    },
    {
      to: '/frontdesk/check-in',
      label: 'Check-In',
      icon: LogIn,
      badge: frontDeskMetrics.arrivalsCount > 0 ? `${frontDeskMetrics.arrivalsCount} today` : null,
      badgeColor: 'bg-emerald-100 text-emerald-800 font-semibold'
    },
    {
      to: '/frontdesk/check-out',
      label: 'Check-Out',
      icon: LogOut,
      badge: frontDeskMetrics.departuresCount > 0 ? `${frontDeskMetrics.departuresCount} today` : null,
      badgeColor: 'bg-blue-100 text-blue-800 font-semibold'
    },
    {
      to: '/frontdesk/requests',
      label: 'Guest Requests',
      icon: ClipboardList,
      badge: frontDeskMetrics.openRequestsCount > 0 ? frontDeskMetrics.openRequestsCount : null,
      badgeColor: frontDeskMetrics.unassignedRequestsCount > 0 ? 'bg-amber-100 text-amber-800 font-semibold' : 'bg-slate-100 text-slate-700'
    },
    {
      to: '/frontdesk/cases',
      label: 'Guest Cases',
      icon: AlertOctagon,
      badge: frontDeskMetrics.unresolvedComplaintsCount > 0 ? `${frontDeskMetrics.unresolvedComplaintsCount} open` : null,
      badgeColor: frontDeskMetrics.escalatedCasesCount > 0 ? 'bg-rose-100 text-rose-800 font-bold animate-pulse' : 'bg-amber-100 text-amber-800'
    },
    {
      to: '/frontdesk/room-moves',
      label: 'Room Moves',
      icon: ArrowLeftRight,
      badge: frontDeskMetrics.activeMovesCount > 0 ? frontDeskMetrics.activeMovesCount : null,
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      to: '/frontdesk/wake-up-calls',
      label: 'Wake-Up Calls',
      icon: AlarmClock,
      badge: frontDeskMetrics.upcomingWakeUpCallsCount > 0 ? frontDeskMetrics.upcomingWakeUpCallsCount : null,
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      to: '/frontdesk/communications',
      label: 'Guest Messaging',
      icon: MessageSquare,
      badge: null
    },
    // Conditionally included financial route:
    ...(hasFinancialAccess
      ? [
          {
            to: '/frontdesk/payments',
            label: 'Folios & Payments',
            icon: CreditCard,
            badge: null
          }
        ]
      : []),
    {
      to: '/frontdesk/reports',
      label: 'Reports',
      icon: BarChart3,
      badge: null
    },
    {
      to: '/frontdesk/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null,
      badgeColor: 'bg-rose-500 text-white font-bold'
    },
    {
      to: '/frontdesk/profile',
      label: 'Coordinator Profile',
      icon: User,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#172B4D] text-slate-100 flex flex-col border-r border-slate-700/60 shadow-xl transition-transform duration-200 ease-in-out lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:z-30 shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-700/50 bg-[#122340]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Front Office Desk
              </span>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Terminal 02 • On Duty
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

        {/* Quick Operations Metrics Bar */}
        <div className="px-3 py-2 bg-slate-900/40 border-b border-slate-700/40 grid grid-cols-2 gap-2 text-center text-[10px]">
          <div className="bg-slate-800/60 rounded px-2 py-1">
            <span className="text-slate-400 block font-medium">In-House Stays</span>
            <span className="text-white font-bold text-xs">{frontDeskMetrics.inHouseStaysCount}</span>
          </div>
          <div className="bg-slate-800/60 rounded px-2 py-1">
            <span className="text-slate-400 block font-medium">Occupancy</span>
            <span className="text-emerald-400 font-bold text-xs">{frontDeskMetrics.occupancyRate}%</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto custom-scrollbar">
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
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 flex-shrink-0 text-slate-400 group-hover:text-slate-200" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-full whitespace-nowrap ${
                      item.badgeColor || 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {!hasFinancialAccess && (
            <div className="mt-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Folio Ledger: Restricted by Policy</span>
            </div>
          )}
        </nav>

        {/* Active Coordinator Badge Card */}
        <div className="p-3 border-t border-slate-700/60 bg-[#122340]">
          <div className="bg-slate-800/70 rounded-xl p-2.5 border border-slate-700/60 flex items-center gap-2.5">
            <img
              src={frontDeskProfile.avatarUrl}
              alt={frontDeskProfile.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-600"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {frontDeskProfile.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-emerald-400" />
                {frontDeskRoleInfo.title}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
