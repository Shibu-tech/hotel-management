import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  Activity,
  Settings,
  FileText,
  Database,
  UserCheck,
  X,
  Lock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function AdminSidebar({ mobileOpen, onCloseMobile }) {
  const {
    adminKPIs,
    adminProfile,
    adminRoleInfo,
    platformUsers,
    integrations
  } = useTasks();

  const pendingAccessCount = adminKPIs.pendingAccessCount || 0;
  const unhealthyIntegrationsCount = integrations.filter((i) => i.status !== 'Operational').length;

  const navItems = [
    {
      to: '/admin/dashboard',
      label: 'Platform Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/admin/users',
      label: 'User Management',
      icon: Users,
      badge: pendingAccessCount > 0 ? `${pendingAccessCount} review` : `${platformUsers.length} users`,
      badgeColor: pendingAccessCount > 0 ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-slate-100 text-slate-700'
    },
    {
      to: '/admin/roles',
      label: 'Roles & Permissions',
      icon: Shield,
      badge: '9 Roles',
      badgeColor: 'bg-blue-100 text-blue-800 font-semibold'
    },
    {
      to: '/admin/integrations',
      label: 'Integrations & Services',
      icon: Activity,
      badge: unhealthyIntegrationsCount > 0 ? `${unhealthyIntegrationsCount} degraded` : 'All Healthy',
      badgeColor: unhealthyIntegrationsCount > 0 ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-emerald-100 text-emerald-800 font-semibold'
    },
    {
      to: '/admin/settings',
      label: 'System Configuration',
      icon: Settings,
      badge: null
    },
    {
      to: '/admin/audit-logs',
      label: 'Administrative Audit Trail',
      icon: FileText,
      badge: null
    },
    {
      to: '/admin/backups',
      label: 'Backup & Recovery',
      icon: Database,
      badge: 'Active',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      to: '/admin/profile',
      label: 'Administrator Profile',
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
            <span className="font-bold text-slate-800 text-sm">Platform Administration</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Administration Security Banner */}
        <div className="p-4 mx-3 my-3 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white rounded-xl shadow-md border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300 block">
                Technical Security Guard
              </span>
              <span className="text-xs font-bold text-white block">
                Systems Architecture
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 leading-tight">
            User access control, system settings, cryptographic audit logs, and service integrations.
          </p>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-2 space-y-1">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
            System Administration
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
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
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
            src={adminProfile.avatarUrl}
            alt={adminProfile.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/40"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">
              {adminProfile.name}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {adminProfile.title}
            </div>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
          <span>Role ID: {adminRoleInfo.roleId}</span>
          <span className="font-semibold text-blue-800 font-mono">IT-PLATFORM</span>
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
