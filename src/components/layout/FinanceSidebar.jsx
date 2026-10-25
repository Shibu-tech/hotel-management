import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Receipt,
  Scale,
  RotateCcw,
  AlertTriangle,
  BarChart3,
  History,
  Bell,
  UserCheck,
  Shield,
  Building2,
  X,
  DollarSign,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function FinanceSidebar({ mobileOpen, onCloseMobile }) {
  const {
    financeKPIs,
    financeProfile,
    financialNotifications,
    financialDiscrepancies,
    refundRequests
  } = useTasks();

  const unreadNotifsCount = financialNotifications?.filter((n) => !n.read)?.length || 0;
  const pendingRefundsTotal = refundRequests?.filter(
    (r) => r.status === 'Pending Approval' || r.status === 'Approved'
  )?.length || 0;

  const navItems = [
    {
      to: '/finance/dashboard',
      label: 'Financial Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/finance/folios',
      label: 'Guest Folios',
      icon: FileSpreadsheet,
      badge: null
    },
    {
      to: '/finance/transactions',
      label: 'Transaction Ledger',
      icon: Receipt,
      badge: null
    },
    {
      to: '/finance/reconciliation',
      label: 'Reconciliation Engine',
      icon: Scale,
      badge: financeKPIs?.awaitingReconciliationCount > 0 ? `${financeKPIs.awaitingReconciliationCount} pending` : null,
      badgeColor: 'bg-amber-100 text-amber-800 font-semibold'
    },
    {
      to: '/finance/refunds',
      label: 'Refunds & Approvals',
      icon: RotateCcw,
      badge: pendingRefundsTotal > 0 ? `${pendingRefundsTotal} action` : null,
      badgeColor: 'bg-blue-100 text-blue-800 font-semibold'
    },
    {
      to: '/finance/discrepancies',
      label: 'Discrepancies',
      icon: AlertTriangle,
      badge: financeKPIs?.openDiscrepanciesCount > 0 ? `${financeKPIs.openDiscrepanciesCount} open` : null,
      badgeColor: 'bg-rose-100 text-rose-800 font-bold'
    },
    {
      to: '/finance/reports',
      label: 'Reports & Revenue',
      icon: BarChart3,
      badge: null
    },
    {
      to: '/finance/audit',
      label: 'Audit History',
      icon: History,
      badge: null
    },
    {
      to: '/finance/notifications',
      label: 'Alerts & Notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : null,
      badgeColor: 'bg-rose-500 text-white font-bold'
    },
    {
      to: '/finance/profile',
      label: 'Operator Profile',
      icon: UserCheck,
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
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-slate-900 shadow-sm">
              <DollarSign className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Finance & Accounting
              </span>
              <span className="text-[11px] text-amber-300 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                Authorized Operator Hub
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

        {/* Property & Authorization Banner */}
        <div className="px-3.5 py-2.5 bg-slate-900/50 border-b border-slate-700/40 text-[11px]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-semibold text-[10px] uppercase tracking-wider">Property Scope</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-900/80 text-blue-300 border border-blue-700/60">
              PROP #048
            </span>
          </div>
          <div className="text-white font-medium truncate text-xs">
            Grand Azure Bay Resort
          </div>
          <div className="mt-1.5 flex items-center justify-between pt-1.5 border-t border-slate-800 text-[10px]">
            <span className="text-slate-400">Approval Limit:</span>
            <span className="text-emerald-400 font-bold">${financeProfile?.approvalLimitUSD?.toFixed(2) || '1,000.00'}</span>
          </div>
        </div>

        {/* Quick Financial Snapshot */}
        <div className="px-3 py-2 bg-slate-900/30 border-b border-slate-700/40 grid grid-cols-2 gap-2 text-center text-[10px]">
          <div className="bg-slate-800/60 rounded px-2 py-1">
            <span className="text-slate-400 block font-medium">Reconciled Pct</span>
            <span className="text-emerald-400 font-bold text-xs">88.5%</span>
          </div>
          <div className="bg-slate-800/60 rounded px-2 py-1">
            <span className="text-slate-400 block font-medium">Discrepancies</span>
            <span className="text-amber-400 font-bold text-xs">{financeKPIs?.openDiscrepanciesCount || 0} Open</span>
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
                  <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-white transition-colors" />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                      item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Security Badging */}
        <div className="p-3 border-t border-slate-700/50 bg-[#122340] text-[11px] flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium text-slate-300">PCI-DSS Compliant</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">TLS 1.3 / Enforced</span>
        </div>
      </aside>
    </>
  );
}
