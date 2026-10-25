import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  UserCheck,
  ArrowRightLeft,
  Flame,
  Info
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { formatDateTime } from '../../utils/taskStatus';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

export default function Notifications() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    supervisorProfile
  } = useTasks();

  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'UNREAD' | 'INSPECTION' | 'SAFETY' | 'HANDOVER'

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'UNREAD' && n.isRead) return false;
    if (filterType === 'INSPECTION' && !n.type?.includes('inspection')) return false;
    if (filterType === 'SAFETY' && !n.type?.includes('safety') && n.priority !== 'urgent') return false;
    if (filterType === 'HANDOVER' && !n.type?.includes('handover')) return false;
    return true;
  });

  const getNotificationIcon = (n) => {
    if (n.type?.includes('safety') || n.priority === 'urgent') {
      return <Flame className="w-4 h-4 text-red-600" />;
    }
    if (n.type?.includes('inspection')) {
      return <ClipboardCheck className="w-4 h-4 text-purple-600" />;
    }
    if (n.type?.includes('handover')) {
      return <ArrowRightLeft className="w-4 h-4 text-blue-600" />;
    }
    if (n.type?.includes('reassign')) {
      return <UserCheck className="w-4 h-4 text-amber-600" />;
    }
    return <Bell className="w-4 h-4 text-slate-500" />;
  };

  const handleNotificationClick = (n) => {
    markNotificationAsRead(n.id);
    if (n.type?.includes('inspection')) {
      navigate('/supervisor/inspections');
    } else if (n.type?.includes('safety') || n.type?.includes('blocker')) {
      navigate('/supervisor/blockers');
    } else if (n.type?.includes('handover')) {
      navigate('/supervisor/handover');
    } else if (n.taskId && n.taskId !== 'N/A') {
      navigate(`/supervisor/tasks`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
              Operational Dispatch Stream
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Supervisor: {supervisorProfile.name}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#172033] tracking-tight mt-1">
            Supervisor Notifications & Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time triggers for urgent task SLA breaches, pending inspections, blocker lockouts, and handovers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadNotificationsCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllNotificationsAsRead}
              className="text-xs"
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {/* Demo simulation notice */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Demo Architecture: </strong>
          Notifications are managed through client-side state and localStorage simulation. No external push server is
          connected in this prototype demo.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              filterType === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Alerts ({notifications.length})
          </button>

          <button
            onClick={() => setFilterType('UNREAD')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              filterType === 'UNREAD'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Unread</span>
            {unreadNotificationsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setFilterType('SAFETY')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              filterType === 'SAFETY'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Urgent / Safety
          </button>

          <button
            onClick={() => setFilterType('INSPECTION')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              filterType === 'INSPECTION'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Inspections
          </button>

          <button
            onClick={() => setFilterType('HANDOVER')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              filterType === 'HANDOVER'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Handovers
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-medium">
          Showing {filteredNotifications.length} items
        </span>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-4 transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                !n.isRead ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                    !n.isRead ? 'bg-white border border-slate-200' : 'bg-slate-100'
                  }`}
                >
                  {getNotificationIcon(n)}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs ${!n.isRead ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-700'}`}>
                      {n.title}
                    </h3>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                    {n.priority === 'urgent' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-100 text-red-700 uppercase">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{n.message}</p>
                  <p className="text-[10px] text-slate-400 font-medium pt-1">
                    {formatDateTime(n.timestamp)} • Category: {n.category || 'General'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                {!n.isRead && (
                  <button
                    onClick={() => markNotificationAsRead(n.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-100/50 text-xs"
                    title="Mark as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs"
                  title="Delete alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No alerts in this view"
          description="You are fully caught up with department notifications."
          actionLabel="View All Alerts"
          onAction={() => setFilterType('ALL')}
        />
      )}
    </div>
  );
}
