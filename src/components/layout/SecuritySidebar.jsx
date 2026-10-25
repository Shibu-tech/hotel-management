import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  Radio,
  Lock,
  History,
  Bell,
  UserCheck,
  X,
  Users,
  ArrowUpRight,
  ShieldCheck,
  CalendarCheck2,
  Flame,
  FileText
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import EmergencyProtocolModal from '../security/EmergencyProtocolModal';

export default function SecuritySidebar({ mobileOpen, onCloseMobile }) {
  const {
    securityProfile,
    securityKPIs,
    securityAlerts,
    securityIncidents,
    securityBackupRequests,
    securityEscalations,
    securityHandovers
  } = useTasks();

  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  const navItems = [
    {
      to: '/security/dashboard',
      label: 'Security Incident Hub',
      icon: ShieldAlert,
      badge: null
    },
    {
      to: '/security/alerts',
      label: 'Active Alerts',
      icon: AlertTriangle,
      badge: securityKPIs.activeAlertsCount > 0 ? `${securityKPIs.activeAlertsCount}` : null,
      badgeColor: 'bg-rose-500 text-white font-bold animate-pulse'
    },
    {
      to: '/security/incidents',
      label: 'My Incidents',
      icon: ShieldAlert,
      badge: securityKPIs.myActiveIncidentsCount > 0 ? `${securityKPIs.myActiveIncidentsCount}` : null,
      badgeColor: 'bg-blue-600 text-white font-bold'
    },
    {
      to: '/security/backup',
      label: 'Backup Requests',
      icon: Users,
      badge: securityKPIs.backupAwaitingCount > 0 ? `${securityKPIs.backupAwaitingCount}` : null,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold'
    },
    {
      to: '/security/escalations',
      label: 'Escalations',
      icon: ArrowUpRight,
      badge: securityKPIs.escalationsAwaitingCount > 0 ? `${securityKPIs.escalationsAwaitingCount}` : null,
      badgeColor: 'bg-purple-600 text-white font-bold'
    },
    {
      to: '/security/evidence',
      label: 'Evidence Vault',
      icon: ShieldCheck,
      badge: null
    },
    {
      to: '/security/handover',
      label: 'Shift Handover',
      icon: CalendarCheck2,
      badge: securityKPIs.pendingHandoversCount > 0 ? `${securityKPIs.pendingHandoversCount}` : null,
      badgeColor: 'bg-emerald-500 text-white font-bold'
    },
    {
      to: '/security/history',
      label: 'Incident History',
      icon: History,
      badge: null
    },
    {
      to: '/security/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: null
    },
    {
      to: '/security/profile',
      label: 'My Profile',
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
        {/* Sidebar Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-700/50 bg-[#122340]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white shadow-xs">
              <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Safety & Security
              </span>
              <span className="text-[11px] text-red-300 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                Emergency Command
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

        {/* Security Officer Info Card */}
        <div className="px-3.5 py-2.5 bg-slate-900/50 border-b border-slate-700/40 text-[11px]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-semibold text-[10px] uppercase tracking-wider">Responder Scope</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-900/80 text-red-300 border border-red-700/60">
              {securityProfile?.departmentCode || 'SEC-SAFE'}
            </span>
          </div>
          <div className="text-white font-medium truncate text-xs">
            {securityProfile?.name || 'Marcus Vance'}
          </div>
          <div className="mt-1.5 flex items-center justify-between pt-1.5 border-t border-slate-800 text-[10px]">
            <span className="text-slate-400">Radio Channel:</span>
            <span className="text-emerald-400 font-bold">{securityProfile?.radioChannel || 'CH 03'}</span>
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
                      ? 'bg-red-600 text-white shadow-xs font-semibold'
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

        {/* Emergency Protocol Trigger Button (Functional) */}
        <div className="p-3 border-t border-slate-700/50 bg-[#122340]">
          <button
            type="button"
            onClick={() => setEmergencyModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-xs group"
          >
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-200 group-hover:scale-110 transition-transform" />
              <span>Emergency Protocols</span>
            </div>
            <span className="text-[10px] bg-red-800 px-1.5 py-0.5 rounded text-red-100 font-mono">
              CH 03
            </span>
          </button>
        </div>
      </aside>

      <EmergencyProtocolModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />
    </>
  );
}
