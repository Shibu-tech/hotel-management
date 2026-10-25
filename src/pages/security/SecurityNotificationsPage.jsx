import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  ShieldAlert,
  AlertTriangle,
  Users,
  ArrowUpRight,
  CheckCircle2,
  Lock,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function SecurityNotificationsPage() {
  const {
    securityAlerts,
    securityBackupRequests,
    securityEscalations,
    notifications
  } = useTasks();

  const [filterType, setFilterType] = useState('ALL');

  // Synthesize security notifications from active alerts, backup calls, and escalations
  const securityNotifs = [
    ...securityAlerts.map((a) => ({
      id: `NOTIF-${a.id}`,
      type: 'ALERT',
      title: a.title,
      message: `Triggered at ${a.location} via ${a.source}. ${a.description}`,
      timestamp: a.timestamp,
      severity: a.severity,
      link: '/security/alerts',
      isRead: a.acknowledged
    })),
    ...securityBackupRequests.map((b) => ({
      id: `NOTIF-${b.id}`,
      type: 'BACKUP',
      title: `Backup Request: ${b.requestedSupport}`,
      message: `${b.requestingOfficer} requested assistance at ${b.location} for ${b.incidentId}. Status: ${b.status}`,
      timestamp: b.requestedAt,
      severity: b.priority,
      link: '/security/backup',
      isRead: b.status === 'Completed' || b.status === 'Arrived/Assisting'
    })),
    ...securityEscalations.map((e) => ({
      id: `NOTIF-${e.id}`,
      type: 'ESCALATION',
      title: `Executive Escalation: ${e.incidentTitle}`,
      message: `Escalated to ${e.destinationRole}. Reason: ${e.reason}`,
      timestamp: e.escalatedAt,
      severity: e.severity,
      link: '/security/escalations',
      isRead: e.acknowledged
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredNotifs = securityNotifs.filter((n) => {
    if (filterType === 'UNREAD') return !n.isRead;
    if (filterType === 'ALERT') return n.type === 'ALERT';
    if (filterType === 'BACKUP') return n.type === 'BACKUP';
    if (filterType === 'ESCALATION') return n.type === 'ESCALATION';
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-[#172B4D] rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white">
              Dispatch Alerts
            </span>
            <span className="text-slate-300 text-xs">Security Radio & System Pings</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Security Notifications & Alarms</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-xl">
            Live notification stream for tactical backup dispatches, sensor trips, executive escalations, and room lockouts.
          </p>
        </div>

        <Link
          to="/security/dashboard"
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors shrink-0"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterType === 'ALL' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Pings ({securityNotifs.length})
          </button>
          <button
            onClick={() => setFilterType('UNREAD')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterType === 'UNREAD' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Unacknowledged ({securityNotifs.filter((n) => !n.isRead).length})
          </button>
          <button
            onClick={() => setFilterType('ALERT')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterType === 'ALERT' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Alarms & Sensors
          </button>
          <button
            onClick={() => setFilterType('BACKUP')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterType === 'BACKUP' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Backup Calls
          </button>
          <button
            onClick={() => setFilterType('ESCALATION')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterType === 'ESCALATION' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Escalations
          </button>
        </div>

        <span className="text-slate-500 font-medium">
          Showing {filteredNotifs.length} notification{filteredNotifs.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-slate-500 border border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No security notifications matching current filter.</p>
            <p className="text-xs text-slate-400 mt-1">All dispatched pings are clear.</p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-xl border p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs transition-all ${
                !n.isRead ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    n.type === 'ALERT'
                      ? 'bg-rose-100 text-rose-700'
                      : n.type === 'BACKUP'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {n.type === 'ALERT' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : n.type === 'BACKUP' ? (
                    <Users className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{n.title}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {n.type}
                    </span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium">{n.message}</p>
                  <span className="text-slate-400 text-[10px] block">
                    {new Date(n.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                to={n.link}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 self-start sm:self-auto shrink-0"
              >
                Respond <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
