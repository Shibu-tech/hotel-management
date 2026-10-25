import React from 'react';
import { Activity, Clock, PlusCircle, UserCheck, ShieldAlert, MessageSquare } from 'lucide-react';
import { formatDateTime } from '../../utils/taskStatus';

export default function RecentActivity({
  tasks = [],
  onViewTask
}) {
  // Aggregate history events across all tasks
  const allEvents = tasks.flatMap((t) =>
    (t.history || []).map((h) => ({
      ...h,
      taskId: t.id,
      taskTitle: t.title
    }))
  );

  // Sort descending by timestamp
  allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const recentEvents = allEvents.slice(0, 6);

  const getEventBadge = (event = '') => {
    const e = event.toLowerCase();
    if (e.includes('create')) {
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">Created</span>;
    }
    if (e.includes('assign')) {
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Assigned</span>;
    }
    if (e.includes('delay')) {
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">Delayed</span>;
    }
    if (e.includes('escalat')) {
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">Escalated</span>;
    }
    if (e.includes('guest')) {
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">Guest Update</span>;
    }
    return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">{event}</span>;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Recent Department Activity</h3>
          <p className="text-[11px] text-slate-500">Live operational timeline across all room queues</p>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {recentEvents.map((evt, idx) => (
          <div key={evt.id || idx} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3 text-xs">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                {getEventBadge(evt.event)}
                <button
                  type="button"
                  onClick={() => onViewTask(evt.taskId)}
                  className="font-mono font-bold text-blue-600 hover:underline"
                >
                  {evt.taskId}
                </button>
                <span className="text-slate-400">•</span>
                <span className="text-[11px] font-medium text-slate-500">{evt.actor}</span>
              </div>
              <p className="text-slate-700 text-xs leading-snug line-clamp-2">
                {evt.details}
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 shrink-0">
              {formatDateTime(evt.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
