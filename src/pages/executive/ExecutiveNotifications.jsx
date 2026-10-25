import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  ShieldAlert,
  Check,
  Filter
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function ExecutiveNotifications() {
  const { executiveNotifications, markExecutiveNotificationAsRead } = useTasks();
  const [filterType, setFilterType] = useState('ALL');

  const filteredNotifs = executiveNotifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'critical') return n.priority === 'urgent' || n.priority === 'high';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              Executive Alerts & Dispatches
            </span>
            <span className="text-xs text-slate-500 font-medium">Broadcast & Exception Feed</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Notifications & Executive Priority Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated alerts triggered by threshold breaches, high-value approval requests, and major incidents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => filteredNotifs.forEach((n) => markExecutiveNotificationAsRead(n.id))}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 text-xs">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
            filterType === 'ALL' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Alerts ({executiveNotifications.length})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
            filterType === 'unread' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread Only ({executiveNotifications.filter((n) => !n.read).length})
        </button>
        <button
          onClick={() => setFilterType('critical')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
            filterType === 'critical' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Critical / Urgent
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              item.read
                ? 'bg-white border-slate-200 text-slate-600'
                : 'bg-indigo-50/40 border-indigo-200/90 text-slate-900 shadow-xs'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  item.type === 'incident'
                    ? 'bg-rose-100 text-rose-700'
                    : item.type === 'approval'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {item.type === 'incident' ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : item.type === 'approval' ? (
                  <DollarSign className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-slate-500">{item.id}</span>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block animate-pulse" />
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.time || item.timestamp || 'Recent'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">{item.message}</p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {!item.read && (
                <button
                  onClick={() => markExecutiveNotificationAsRead(item.id)}
                  title="Mark as Read"
                  className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredNotifs.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No notifications found</h4>
            <p className="text-xs text-slate-500 mt-1">
              You are all caught up with your executive notifications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
