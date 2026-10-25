import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  ShieldAlert,
  UserCheck,
  FileCheck,
  Calendar,
  Filter
} from 'lucide-react';
import { formatDateTime } from '../../utils/taskStatus';

export default function ActivityTimeline({ activities = [] }) {
  const [filterType, setFilterType] = useState('all');

  const filtered = activities.filter((act) => {
    if (filterType === 'all') return true;
    if (filterType === 'approval') return act.type === 'approval';
    if (filterType === 'complaint') return act.type === 'complaint';
    if (filterType === 'intervention') return act.type === 'manager_intervention' || act.type === 'reassign';
    if (filterType === 'handover') return act.type === 'handover';
    if (filterType === 'blocker') return act.type === 'blocker';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'approval':
        return <FileCheck className="w-3.5 h-3.5 text-purple-600" />;
      case 'complaint':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      case 'manager_intervention':
        return <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />;
      case 'reassign':
        return <UserCheck className="w-3.5 h-3.5 text-blue-600" />;
      case 'handover':
        return <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />;
      case 'blocker':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Department Activity & Audit Trail
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of manager directives, service recovery decisions, and operations events.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'approval', label: 'Approvals' },
            { id: 'complaint', label: 'Complaints' },
            { id: 'intervention', label: 'Interventions' },
            { id: 'handover', label: 'Handovers' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterType === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline items */}
      <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No audit records matching selected filter.
          </div>
        ) : (
          filtered.slice(0, 30).map((act) => (
            <div key={act.id} className="p-3 sm:p-4 hover:bg-slate-50/70 transition-colors flex items-start gap-3 text-xs">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(act.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 truncate">
                    {act.event}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal shrink-0">
                    {formatDateTime(act.timestamp)}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                  {act.details}
                </p>
                <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>Actor: <strong className="text-slate-600">{act.actor}</strong></span>
                  {act.location && (
                    <>
                      <span>•</span>
                      <span>Location: {act.location}</span>
                    </>
                  )}
                  {act.taskId && act.taskId !== 'N/A' && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-blue-600">{act.taskId}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
