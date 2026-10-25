import React from 'react';
import { Link } from 'react-router-dom';
import { Users2, ArrowRight } from 'lucide-react';

export default function StaffWorkloadSummary({
  staff = [],
  onSelectStaff
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
            <Users2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Staff Workload Distribution</h3>
            <p className="text-[11px] text-slate-500">Live active capacity & assigned tasks by staff</p>
          </div>
        </div>
        <Link
          to="/dispatcher/staff"
          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <span>View All Staff</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {staff.slice(0, 5).map((member) => {
          const isBusy = member.activeTasksCount >= 3;
          const isAvailable = member.availability === 'Available';
          // Progress bar percentage (max capacity assumed at 4 tasks)
          const pct = Math.min(100, Math.round((member.activeTasksCount / 4) * 100));

          return (
            <div
              key={member.id}
              onClick={() => onSelectStaff && onSelectStaff(member)}
              className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 transition-all cursor-pointer flex items-center justify-between gap-3 bg-white"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {member.name}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded">
                      {member.id}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {member.role} • {member.department}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Visual Capacity Bar */}
                <div className="hidden sm:block w-24">
                  <div className="flex justify-between text-[10px] text-slate-500 font-semibold mb-1">
                    <span>{member.activeTasksCount} active</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct >= 100
                          ? 'bg-red-500'
                          : pct >= 75
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isAvailable
                      ? 'bg-emerald-100 text-emerald-800'
                      : member.availability === 'Busy'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {member.availability}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
