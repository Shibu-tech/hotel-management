import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  ShieldAlert,
  Trash2,
  ExternalLink,
  Filter,
  Check
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { formatDateTime } from '../../utils/taskStatus';
import { useTasks } from '../../context/TaskContext';

export default function Notifications() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
  } = useTasks();
  const navigate = useNavigate();

  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'urgent'

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === 'unread') return !n.isRead;
      if (filter === 'urgent') return n.priority === 'urgent' || n.priority === 'high';
      return true;
    });
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type = '', priority = '') => {
    if (type === 'overdue' || priority === 'urgent') {
      return (
        <div className="p-2 rounded-lg bg-red-100 text-red-600">
          <AlertTriangle className="w-4 h-4" />
        </div>
      );
    }
    if (type === 'deadline') {
      return (
        <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
          <Clock className="w-4 h-4" />
        </div>
      );
    }
    if (type === 'assigned' || type === 'unassigned') {
      return (
        <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
          <UserCheck className="w-4 h-4" />
        </div>
      );
    }
    if (type === 'escalation' || type === 'escalation_response') {
      return (
        <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
          <ShieldAlert className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
        <Bell className="w-4 h-4" />
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Department Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Operational alerts, task status shifts, SLA breaches, and supervisor escalation updates
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={Check}
            onClick={markAllNotificationsAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'all', label: `All Alerts (${notifications.length})` },
          { id: 'unread', label: `Unread (${unreadCount})` },
          {
            id: 'urgent',
            label: `Urgent (${
              notifications.filter((n) => n.priority === 'urgent' || n.priority === 'high').length
            })`
          }
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === t.id
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200/80 shadow-subtle">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No notifications to display</h3>
          <p className="text-xs text-slate-500 mt-1">
            You're all caught up with your operational alerts!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle divide-y divide-slate-100 overflow-hidden">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 transition-colors flex items-start justify-between gap-4 ${
                !notif.isRead ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                {getNotificationIcon(notif.type, notif.priority)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                    {notif.category && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                        {notif.category}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                    {notif.message}
                  </p>

                  <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{formatDateTime(notif.timestamp)}</span>
                    {notif.taskId && (
                      <>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            navigate(`/dispatcher/tasks/${notif.taskId}`);
                          }}
                          className="font-bold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                        >
                          Open Task {notif.taskId} →
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {!notif.isRead && (
                  <button
                    type="button"
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4 text-emerald-600" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteNotification(notif.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
        <strong>Dispatch Operations Notice:</strong> Notifications are generated in response to queue events and SLA timers. Simulated client-side notification service for demo environment.
      </div>
    </div>
  );
}
