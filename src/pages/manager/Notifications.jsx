import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Check,
  Trash2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Users,
  FileCheck,
  ExternalLink,
  Filter
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import Button from '../../components/ui/Button';
import { formatDateTime } from '../../utils/taskStatus';

export default function Notifications() {
  const navigate = useNavigate();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    unreadNotificationsCount
  } = useTasks();

  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'UNREAD', 'SLA', 'APPROVALS', 'STAFFING', 'EMERGENCY'

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'UNREAD') return !n.isRead;
    if (filterType === 'SLA') return n.category === 'SLA' || n.type?.includes('sla');
    if (filterType === 'APPROVALS') return n.category === 'Approvals' || n.type?.includes('approval');
    if (filterType === 'STAFFING') return n.category === 'Staffing' || n.type?.includes('staff');
    if (filterType === 'EMERGENCY') return n.priority === 'urgent' || n.type?.includes('emergency');
    return true;
  });

  const getNotificationIcon = (type) => {
    if (type?.includes('emergency')) return <ShieldAlert className="w-4 h-4 text-red-600" />;
    if (type?.includes('sla')) return <Clock className="w-4 h-4 text-amber-600" />;
    if (type?.includes('approval')) return <FileCheck className="w-4 h-4 text-purple-600" />;
    if (type?.includes('staff')) return <Users className="w-4 h-4 text-blue-600" />;
    return <Bell className="w-4 h-4 text-slate-500" />;
  };

  const handleAction = (n) => {
    markNotificationAsRead(n.id);
    if (n.type?.includes('approval')) {
      navigate('/manager/approvals');
    } else if (n.complaintId) {
      navigate('/manager/complaints');
    } else if (n.type?.includes('staff')) {
      navigate('/manager/staffing');
    } else if (n.taskId && n.taskId !== 'N/A') {
      navigate(`/manager/tasks?search=${n.taskId}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Manager Notifications Inbox
            </h1>
            {unreadNotificationsCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                {unreadNotificationsCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Department operational alerts, SLA breaches, delegated approval submissions, and emergency safety notifications.
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <Button
            size="sm"
            variant="secondary"
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Mark All as Read</span>
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
        {[
          { id: 'ALL', label: 'All Notifications' },
          { id: 'UNREAD', label: `Unread (${unreadNotificationsCount})` },
          { id: 'SLA', label: 'SLA Alerts' },
          { id: 'APPROVALS', label: 'Approvals' },
          { id: 'STAFFING', label: 'Staffing' },
          { id: 'EMERGENCY', label: 'Emergency Safety' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              <CheckCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">Inbox Zero</p>
              <p className="text-slate-400 mt-0.5">No notifications matching the selected filter.</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  !n.isRead ? 'bg-blue-50/40' : 'hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getNotificationIcon(n.type)}
                  </div>

                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900">{n.title}</span>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                      {n.priority === 'urgent' && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-100 text-red-800">
                          Urgent
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">
                        {formatDateTime(n.timestamp)}
                      </span>
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed">
                      {n.message}
                    </p>

                    <div className="text-[10px] text-slate-400 flex items-center gap-3 pt-0.5">
                      <span>Category: <strong>{n.category || 'System'}</strong></span>
                      {n.taskId && n.taskId !== 'N/A' && (
                        <span>Task: <strong className="text-blue-600">{n.taskId}</strong></span>
                      )}
                      {n.complaintId && (
                        <span>Case: <strong className="text-purple-600">{n.complaintId}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notification Row Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleAction(n)}
                    className="text-xs"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>

                  {!n.isRead && (
                    <button
                      type="button"
                      onClick={() => markNotificationAsRead(n.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteNotification(n.id)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Dismiss"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
