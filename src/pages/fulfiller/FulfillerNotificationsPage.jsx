import React, { useMemo } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Radio,
  CheckCheck,
  Trash2,
  Tag
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import Button from '../../components/ui/Button';
import { formatDateTime } from '../../utils/taskStatus';
import { FULFILLER_PROFILE } from '../../utils/permissions';

export default function FulfillerNotificationsPage() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    currentUser,
    fulfillerProfile
  } = useTasks();

  const activeStaff = currentUser || fulfillerProfile || FULFILLER_PROFILE;

  // Filter notifications relevant to task operations & assignments
  const fulfillerNotifs = useMemo(() => {
    return notifications.filter(
      (n) =>
        n.category === 'Task' ||
        n.category === 'Assignment' ||
        n.category === 'Blocker' ||
        n.type?.includes('task') ||
        n.type?.includes('blocker') ||
        !n.category
    );
  }, [notifications]);

  const unreadCount = fulfillerNotifs.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-teal-600" />
            <span>Alerts & Dispatch Broadcasts</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational alerts and supervisor updates for {activeStaff.name} ({activeStaff.id || 'EMP-418'})
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={CheckCheck}
            onClick={markAllNotificationsAsRead}
          >
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Radio Broadcast Channel Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-xl p-4 flex items-center justify-between border border-teal-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
            <Radio className="w-5 h-5 animate-pulse text-teal-400" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Active Radio Dispatch: Channel 04 (Runners & Attendants)
            </div>
            <p className="text-xs text-slate-300">
              Keep radio transmitter active on CH-04 for high-priority VIP tasking and urgent dispatch.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold bg-teal-950 px-2.5 py-1 rounded border border-teal-700 text-teal-300">
          ONLINE
        </span>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {fulfillerNotifs.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">All caught up</h3>
            <p className="text-xs text-slate-500 mt-1">
              No unread dispatch notifications or operational alerts at this time.
            </p>
          </div>
        ) : (
          fulfillerNotifs.map((n) => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                !n.isRead ? 'bg-teal-50/30' : 'hover:bg-slate-50/60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-slate-800">{n.title}</span>
                  {n.category && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {n.category}
                    </span>
                  )}
                  {n.priority === 'urgent' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                      Urgent
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDateTime(n.timestamp)}</span>
                  {n.taskId && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-slate-600 font-bold">
                        Task: {n.taskId}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!n.isRead && (
                  <button
                    type="button"
                    onClick={() => markNotificationAsRead(n.id)}
                    className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-100 text-xs font-semibold"
                    title="Mark as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteNotification(n.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
