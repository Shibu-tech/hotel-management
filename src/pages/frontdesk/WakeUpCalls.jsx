import React, { useState } from 'react';
import {
  AlarmClock,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PhoneCall,
  BellRing,
  RotateCcw,
  User,
  Calendar
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import StatusBadge from '../../components/frontdesk/StatusBadge';
import WakeUpCallModal from '../../components/frontdesk/WakeUpCallModal';

export default function WakeUpCalls() {
  const { wakeUpCalls, recordWakeUpCallAttempt, frontDeskProfile } = useTasks();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredCalls = wakeUpCalls.filter((w) => {
    const matchesSearch =
      !searchQuery.trim() ||
      w.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.roomNumber.includes(searchQuery) ||
      w.scheduledTime.includes(searchQuery);

    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleMarkAnswered = (id) => {
    recordWakeUpCallAttempt(id, {
      status: 'Answered',
      note: 'Guest answered call promptly; morning greeting and time confirmed.'
    });
  };

  const handleMarkNoAnswer = (id) => {
    recordWakeUpCallAttempt(id, {
      status: 'No Answer',
      note: 'Call rang 6 times without answer. Operator scheduled 5-minute callback retry.'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlarmClock className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Guest Wake-Up Call Scheduling & Execution
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
              {filteredCalls.length} Scheduled Calls
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Monitor, execute, and record guest wake-up reminders with response confirmation and retry logging.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Schedule Wake-Up Call
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by guest name, room number, or time..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
            >
              <option value="ALL">All Call Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed / Answered</option>
              <option value="Failed">Failed / No Answer</option>
              <option value="Rescheduled">Rescheduled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Wake-Up Call Cards */}
      <div className="space-y-3">
        {filteredCalls.length > 0 ? (
          filteredCalls.map((w) => {
            const isScheduled = w.status === 'Scheduled';

            return (
              <div
                key={w.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-sm transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-black text-lg flex items-center justify-center">
                      {w.scheduledTime}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">
                          Room {w.roomNumber}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-sm font-semibold text-slate-700">
                          {w.guestName}
                        </span>
                        <StatusBadge type="wakeup" value={w.status} size="xs" />
                      </div>

                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                        <span>Date: <strong>{w.scheduledDate}</strong></span>
                        <span>Operator: {w.createdBy}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for Scheduled Calls */}
                  {isScheduled && (
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button
                        onClick={() => handleMarkAnswered(w.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-2xs transition-colors flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        Log Answered
                      </button>

                      <button
                        onClick={() => handleMarkNoAnswer(w.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        No Answer
                      </button>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
                  <span className="font-semibold text-slate-900 block mb-0.5">
                    Operator Instructions:
                  </span>
                  {w.specialInstructions || 'Standard morning greeting and weather overview.'}
                </div>

                {/* Execution Attempts Log */}
                {w.attempts && w.attempts.length > 0 && (
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                      Attempt & Confirmation Log:
                    </span>
                    {w.attempts.map((a, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[11px] flex items-center justify-between"
                      >
                        <span>
                          <strong>{a.status}:</strong> "{a.note}"
                        </span>
                        <span className="text-slate-400">
                          {a.operator} • {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs text-slate-500">
            <AlarmClock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            No wake-up calls found matching current filters.
          </div>
        )}
      </div>

      <WakeUpCallModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
