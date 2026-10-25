import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../../context/TaskContext';
import {
  Bell,
  CheckCheck,
  Filter,
  Calendar,
  AlertTriangle,
  Clock,
  ArrowRight,
  Info,
  CheckCircle2,
  Trash2,
  Layers
} from 'lucide-react';

export default function Notifications() {
  const navigate = useNavigate();
  const { frontDeskNotifications, setFrontDeskNotifications } = useTaskContext();
  const [filterType, setFilterType] = useState('all');

  const notificationsList = frontDeskNotifications || [];

  const unreadCount = notificationsList.filter(n => !n.read).length;

  const handleMarkAsRead = (id) => {
    setFrontDeskNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllRead = () => {
    setFrontDeskNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const handleClearAll = () => {
    setFrontDeskNotifications([]);
  };

  const filteredNotifications = notificationsList.filter(n => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.read;
    return n.type === filterType;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'urgent':
      case 'escalation':
      case 'complaint':
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'arrival':
      case 'departure':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'wake-up':
        return <Clock className="w-5 h-5 text-purple-500" />;
      case 'approval':
        return <CheckCircle2 className="w-5 h-5 text-amber-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              Live Feed
            </span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Operational Notifications</h1>
          <p className="text-sm text-slate-500">
            Real-time alerts for guest requests, overdue tasks, VIP arrivals, and supervisor escalations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              <CheckCheck className="w-4 h-4 text-blue-600" />
              Mark All Read
            </button>
          )}
          {notificationsList.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-1 border-b border-slate-200">
        {[
          { id: 'all', label: 'All Notifications', count: notificationsList.length },
          { id: 'unread', label: 'Unread Only', count: unreadCount },
          { id: 'request', label: 'Guest Requests' },
          { id: 'complaint', label: 'Complaints / Escalations' },
          { id: 'arrival', label: 'Arrivals & Departures' },
          { id: 'wake-up', label: 'Wake-Up Calls' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              filterType === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filterType === tab.id ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification Stream */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleMarkAsRead(notification.id)}
            className={`p-4 rounded-xl border transition-all flex items-start gap-4 cursor-pointer ${
              notification.read
                ? 'bg-white border-slate-200 opacity-80 hover:opacity-100'
                : 'bg-blue-50/40 border-blue-200 shadow-sm'
            }`}
          >
            <div className={`p-2.5 rounded-xl mt-0.5 ${
              notification.read ? 'bg-slate-100' : 'bg-white shadow-sm border border-blue-100'
            }`}>
              {getTypeIcon(notification.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className={`text-sm font-semibold truncate ${
                  notification.read ? 'text-slate-800' : 'text-slate-900 font-bold'
                }`}>
                  {notification.title}
                </h4>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {notification.time}
                  </span>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {notification.message}
              </p>

              {notification.link && (
                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification.id);
                      navigate(notification.link);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    View details & take action
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    ID: {notification.id}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No notifications found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You are caught up on all operational alerts for the selected category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
