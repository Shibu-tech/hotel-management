import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Scale,
  ArrowRight,
  ShieldAlert,
  Trash2
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import FinanceStatusBadge from '../../components/finance/FinanceStatusBadge';

export default function FinanceNotifications() {
  const {
    financialNotifications,
    setFinancialNotifications,
    showToast
  } = useTasks();

  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');

  const filtered = (financialNotifications || []).filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    return true;
  });

  const markAsRead = (id) => {
    setFinancialNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setFinancialNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
    showToast('All financial notifications marked as read.', 'info');
  };

  const clearAll = () => {
    setFinancialNotifications([]);
    showToast('Cleared notifications inbox.', 'info');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
              Operational Alerts
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Real-Time Settlement & Approval Triggers
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Financial Notifications & Action Items
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time notifications for pending refund sign-offs, settlement batch variances, and card declines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={markAllAsRead}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            Mark All Read
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Clear all notifications"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors ${
            filter === 'ALL'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All ({financialNotifications?.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors ${
            filter === 'UNREAD'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Unread ({financialNotifications?.filter((n) => !n.read)?.length || 0})
        </button>
      </div>

      {/* Notification Items */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            No financial notifications in this view.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                markAsRead(item.id);
                if (item.actionRoute) navigate(item.actionRoute);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !item.read
                  ? 'bg-blue-50/40 border-blue-200 shadow-xs'
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    item.type?.includes('refund')
                      ? 'bg-purple-100 text-purple-700'
                      : item.type?.includes('discrepancy')
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.type?.includes('refund') ? (
                    <RotateCcw className="w-4 h-4" />
                  ) : item.type?.includes('discrepancy') ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <Scale className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                    <FinanceStatusBadge status={item.priority} type="priority" />
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-xs text-blue-600 font-semibold group-hover:underline inline-flex items-center gap-1">
                  Action <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
