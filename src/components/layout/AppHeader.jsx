import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  Search,
  Menu,
  Shield,
  RotateCcw,
  LogOut,
  User,
  ChevronDown,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  DollarSign,
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import {
  SUPERVISOR_PROFILE,
  DISPATCHER_PROFILE,
  MANAGER_PROFILE,
  FRONTDESK_PROFILE,
  FINANCE_PROFILE,
  SECURITY_PROFILE,
  EXECUTIVE_PROFILE,
  ADMIN_PROFILE,
  normalizeRole,
  ROLE_DEFAULT_ROUTES
} from '../../utils/permissions';

export default function AppHeader({ onToggleMobileMenu }) {
  const {
    currentUser,
    switchActiveRole,
    logout,
    managerProfile,
    dispatcherProfile,
    supervisorProfile,
    frontDeskProfile,
    financeProfile,
    securityProfile,
    unreadNotificationsCount,
    notifications,
    resetToMockData,
    tasks,
    reservations
  } = useTasks();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isFinance = location.pathname.startsWith('/finance');
  const isFrontDesk = location.pathname.startsWith('/frontdesk');
  const isManager = location.pathname.startsWith('/manager');
  const isSupervisor = location.pathname.startsWith('/supervisor');
  const isDispatcher = location.pathname.startsWith('/dispatcher');
  const isFulfiller = location.pathname.startsWith('/fulfiller') || location.pathname.startsWith('/task-fulfiller');
  const isSecurity = location.pathname.startsWith('/security');
  const isExecutive = location.pathname.startsWith('/executive');
  const isAdmin = location.pathname.startsWith('/admin');

  // Authoritative user profile from authentication context
  const activeUser = currentUser || FINANCE_PROFILE;
  const userRoleKey = normalizeRole(activeUser.role || activeUser.roleId);

  const currentRoleTitle = activeUser.role || (
    isExecutive
      ? 'Executive Viewer/Approver'
      : isAdmin
      ? 'Platform Administrator'
      : isFinance
      ? 'Financial Operator'
      : isFrontDesk
      ? 'Front Desk Coordinator'
      : isManager
      ? 'Department Manager'
      : isSupervisor
      ? 'Department Supervisor'
      : isSecurity
      ? 'Security Responder'
      : isFulfiller
      ? 'Task Fulfiller'
      : 'Department Dispatcher'
  );

  const notificationsLink = isExecutive
    ? '/executive/notifications'
    : isAdmin
    ? '/admin/audit-logs'
    : isFinance
    ? '/finance/notifications'
    : isFrontDesk
    ? '/frontdesk/notifications'
    : isManager
    ? '/manager/notifications'
    : isSupervisor
    ? '/supervisor/notifications'
    : isSecurity
    ? '/security/dashboard'
    : isFulfiller
    ? '/task-fulfiller/notifications'
    : '/dispatcher/notifications';

  const profileLink = isExecutive
    ? '/executive/profile'
    : isAdmin
    ? '/admin/profile'
    : isFinance
    ? '/finance/profile'
    : isFrontDesk
    ? '/frontdesk/profile'
    : isManager
    ? '/manager/profile'
    : isSupervisor
    ? '/supervisor/profile'
    : isSecurity
    ? '/security/dashboard'
    : isFulfiller
    ? '/task-fulfiller/profile'
    : '/dispatcher/profile';

  const dashboardLink = isExecutive
    ? '/executive/dashboard'
    : isAdmin
    ? '/admin/dashboard'
    : isFinance
    ? '/finance/dashboard'
    : isFrontDesk
    ? '/frontdesk/dashboard'
    : isManager
    ? '/manager/dashboard'
    : isSupervisor
    ? '/supervisor/dashboard'
    : isSecurity
    ? '/security/dashboard'
    : isFulfiller
    ? '/task-fulfiller/dashboard'
    : ROLE_DEFAULT_ROUTES[userRoleKey] || '/finance/dashboard';

  // Handle global search typing
  useEffect(() => {
    if (!globalQuery.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    const q = globalQuery.toLowerCase();
    const results = tasks
      .filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          (t.assignedTo?.name || '').toLowerCase().includes(q)
      )
      .slice(0, 5);
    setSearchResults(results);
    setSearchOpen(true);
  }, [globalQuery, tasks]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#172B4D] text-white border-b border-slate-700/60 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + StayOps Brand + Department Tag */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            to={dashboardLink}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm group-hover:bg-blue-500 transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-base text-white">StayOps</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700/50">
                  {isExecutive ? 'Executive Oversight' : isAdmin ? 'Platform Admin' : isFinance ? 'Finance Ops' : isFrontDesk ? 'Front Desk' : isManager ? 'Dept Manager' : isSupervisor ? 'Supervisor Lead' : isSecurity ? 'Security Ops' : isFulfiller ? 'Task Fulfiller' : 'Ops Suite'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                {activeUser.department}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block relative" ref={searchRef}>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks by ID, room, title, or staff..."
              value={globalQuery}
              onChange={(e) => setGlobalQuery(e.target.value)}
              onFocus={() => globalQuery.trim() && setSearchOpen(true)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Quick Search Dropdown */}
          {searchOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="p-2 border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Matching Tasks ({searchResults.length})
              </div>
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {searchResults.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setGlobalQuery('');
                      navigate(isManager ? '/manager/tasks' : isSupervisor ? '/supervisor/tasks' : `/dispatcher/tasks/${task.id}`);
                    }}
                    className="w-full text-left p-2.5 hover:bg-blue-50 transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{task.id}</span>
                        <span className="font-normal text-slate-600 truncate max-w-[200px]">
                          {task.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {task.location} • Assignee: {task.assignedTo?.name || 'Unassigned'}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {task.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Notifications + User Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              aria-label="Open notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Quick Notifications Dropdown */}
            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Notifications
                    </span>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-blue-800">
                        {unreadNotificationsCount} new
                      </span>
                    )}
                  </div>
                  <Link
                    to={notificationsLink}
                    onClick={() => setNotifDropdownOpen(false)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    View All
                  </Link>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setNotifDropdownOpen(false);
                        if (n.type?.includes('inspection')) {
                          navigate('/supervisor/inspections');
                        } else if (n.type?.includes('blocker')) {
                          navigate('/supervisor/blockers');
                        } else if (n.type?.includes('handover')) {
                          navigate('/supervisor/handover');
                        } else if (n.taskId && n.taskId !== 'N/A') {
                          navigate(isSupervisor ? '/supervisor/tasks' : `/dispatcher/tasks/${n.taskId}`);
                        } else {
                          navigate(notificationsLink);
                        }
                      }}
                      className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                        !n.isRead ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800 mb-0.5">
                        <span className="truncate">{n.title}</span>
                        {!n.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                  <Link
                    to={notificationsLink}
                    onClick={() => setNotifDropdownOpen(false)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Go to Notifications Inbox →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1.5 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
            >
              <img
                src={activeUser.avatarUrl}
                alt={activeUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/50"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight">
                  {activeUser.name}
                </span>
                <span className="text-[10px] text-blue-300 font-medium">
                  {currentRoleTitle}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Menu Dropdown with Role Switcher */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-100">
                <div className="p-3.5 border-b border-slate-100 bg-slate-50">
                  <div className="font-bold text-xs text-slate-900">
                    {activeUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500">{activeUser.email}</div>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                    <Shield className="w-3 h-3" />
                    Role: {currentRoleTitle}
                  </div>
                </div>

                <div className="p-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    My Account
                  </div>
                  <Link
                    to={profileLink}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    My Role Profile
                  </Link>

                  <div className="border-t border-slate-100 my-1" />
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Role Switcher (Ops Suite)</span>
                    <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      switchActiveRole('financial_operator');
                      navigate('/finance/dashboard');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      userRoleKey === 'financial_operator' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-amber-600" />
                      <span>Financial Operator</span>
                    </div>
                    {userRoleKey === 'financial_operator' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      switchActiveRole('frontdesk');
                      navigate('/frontdesk/dashboard');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      userRoleKey === 'frontdesk' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span>Front Desk Coordinator</span>
                    </div>
                    {userRoleKey === 'frontdesk' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      switchActiveRole('manager');
                      navigate('/manager/dashboard');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      userRoleKey === 'manager' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span>Department Manager</span>
                    </div>
                    {userRoleKey === 'manager' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      switchActiveRole('supervisor');
                      navigate('/supervisor/dashboard');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      userRoleKey === 'supervisor' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>Department Supervisor</span>
                    </div>
                    {userRoleKey === 'supervisor' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      switchActiveRole('dispatcher');
                      navigate('/dispatcher/dashboard');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      userRoleKey === 'dispatcher' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-600" />
                      <span>Department Dispatcher</span>
                    </div>
                    {userRoleKey === 'dispatcher' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      switchActiveRole('security');
                      navigate('/security/dashboard');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      userRoleKey === 'security' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-rose-600" />
                      <span>Security Responder</span>
                    </div>
                    {userRoleKey === 'security' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      switchActiveRole('task_fulfiller');
                      navigate('/task-fulfiller/dashboard');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      userRoleKey === 'task_fulfiller' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Task Fulfiller</span>
                    </div>
                    {userRoleKey === 'task_fulfiller' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      switchActiveRole('executive');
                      navigate('/executive/dashboard');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      userRoleKey === 'executive' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                      <span>Executive Viewer/Approver</span>
                    </div>
                    {userRoleKey === 'executive' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      switchActiveRole('platform_admin');
                      navigate('/admin/dashboard');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      userRoleKey === 'platform_admin' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-600" />
                      <span>Platform Administrator</span>
                    </div>
                    {userRoleKey === 'platform_admin' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      resetToMockData();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-600" />
                    Reset Demo State
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
