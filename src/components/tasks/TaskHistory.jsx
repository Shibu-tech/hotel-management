import React from 'react';
import {
  History,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  UserX,
  Clock,
  ShieldAlert,
  MessageSquare,
  FileEdit,
  PlusCircle
} from 'lucide-react';
import { formatDateTime } from '../../utils/taskStatus';

export default function TaskHistory({ history = [] }) {
  if (!history || history.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-400">
        No logged audit events recorded for this task.
      </div>
    );
  }

  const getEventIcon = (event = '') => {
    const e = event.toLowerCase();
    if (e.includes('create')) return <PlusCircle className="w-3.5 h-3.5 text-blue-600" />;
    if (e.includes('assign')) return <UserCheck className="w-3.5 h-3.5 text-emerald-600" />;
    if (e.includes('clear') || e.includes('unassign')) return <UserX className="w-3.5 h-3.5 text-slate-500" />;
    if (e.includes('delay')) return <Clock className="w-3.5 h-3.5 text-amber-600" />;
    if (e.includes('escalat')) return <ShieldAlert className="w-3.5 h-3.5 text-red-600" />;
    if (e.includes('guest') || e.includes('communicat')) return <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />;
    if (e.includes('complete')) return <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />;
    if (e.includes('block')) return <AlertTriangle className="w-3.5 h-3.5 text-red-600" />;
    return <FileEdit className="w-3.5 h-3.5 text-slate-500" />;
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {history.map((item, index) => (
        <div key={item.id || index} className="relative group">
          {/* Dot / Icon */}
          <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center">
            {getEventIcon(item.event)}
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-slate-900">{item.event}</span>
              <span className="text-[11px] font-mono text-slate-400">
                {formatDateTime(item.timestamp)}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{item.details}</p>

            <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
              <span>Actor: <strong className="text-slate-600 font-semibold">{item.actor}</strong></span>
              {item.previousValue && item.newValue && (
                <span>
                  • Changed from <span className="line-through">{item.previousValue}</span> to <strong>{item.newValue}</strong>
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
