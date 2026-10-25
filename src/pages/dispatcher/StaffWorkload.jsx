import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users2,
  Search,
  X,
  Phone,
  Radio,
  Clock,
  AlertCircle,
  CheckCircle2,
  Shield,
  Eye,
  UserCheck
} from 'lucide-react';
import Button from '../../components/ui/Button';
import StaffDetailModal from '../../components/staff/StaffDetailModal';
import TaskAssignmentModal from '../../components/tasks/TaskAssignmentModal';
import { useTasks } from '../../context/TaskContext';

export default function StaffWorkload() {
  const { staff, tasks } = useTasks();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [workloadFilter, setWorkloadFilter] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [reassigningTask, setReassigningTask] = useState(null);

  // Filtered Staff
  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = member.name.toLowerCase().includes(q);
        const matchesId = member.id.toLowerCase().includes(q);
        const matchesDept = member.department.toLowerCase().includes(q);
        const matchesRole = member.role.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesDept && !matchesRole) return false;
      }

      // 2. Availability Filter
      if (availabilityFilter !== 'all' && member.availability !== availabilityFilter) {
        return false;
      }

      // 3. Workload Filter
      if (workloadFilter !== 'all' && member.workloadStatus !== workloadFilter) {
        return false;
      }

      return true;
    });
  }, [staff, searchQuery, availabilityFilter, workloadFilter]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setAvailabilityFilter('all');
    setWorkloadFilter('all');
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-150">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Staff Workload & Shift Allocation
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {staff.filter((s) => s.availability === 'Available').length} Available
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor floor staff capacity, live assigned tickets, and prevent runner burnout
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            icon={UserCheck}
            onClick={() => navigate('/dispatcher/tasks')}
          >
            Go to Task Queue
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff by name, ID (e.g. EMP-418), or role..."
            className="w-full text-xs sm:text-sm pl-10 pr-9 py-2 rounded-lg border border-slate-300 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Availabilities</option>
            <option value="Available">🟢 Available Now</option>
            <option value="Busy">🟡 Busy</option>
            <option value="On Break">☕ On Break</option>
            <option value="Off Duty">⚪ Off Duty</option>
          </select>

          <select
            value={workloadFilter}
            onChange={(e) => setWorkloadFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Workload Levels</option>
            <option value="Normal">Normal Workload</option>
            <option value="Heavy">Heavy Workload (3+ tasks)</option>
            <option value="Max">Max Capacity (4+ tasks)</option>
            <option value="Unavailable">Unavailable / Off</option>
          </select>

          {(searchQuery || availabilityFilter !== 'all' || workloadFilter !== 'all') && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Staff List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((member) => {
          const isBusy = member.activeTasksCount >= 3;
          const isAvailable = member.availability === 'Available';
          const pct = Math.min(100, Math.round((member.activeTasksCount / 4) * 100));

          return (
            <div
              key={member.id}
              onClick={() => setSelectedStaff(member)}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle hover:shadow-card transition-all cursor-pointer flex flex-col justify-between group hover:border-blue-300"
            >
              <div>
                {/* Header: Photo + Name + Shift */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-blue-200 transition-all"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {member.name}
                        </h3>
                      </div>
                      <div className="font-mono text-[10px] text-slate-500">{member.id}</div>
                      <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                        {member.role}
                      </div>
                    </div>
                  </div>

                  {/* Availability Badge */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
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

                {/* Shift & Radio Info */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Department:</span>
                    <strong className="text-slate-800">{member.department}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Current Shift:</span>
                    <span className="text-slate-700">{member.shift}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Radio Channel:</span>
                    <span className="font-mono text-blue-600 font-semibold">{member.radio}</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold">
                      Workload: <strong className="text-slate-800">{member.workloadStatus}</strong>
                    </span>
                    <span className="font-bold text-slate-800">
                      {member.activeTasksCount} active task{member.activeTasksCount === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
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

                {/* Overdue alert if any */}
                {member.overdueTasksCount > 0 && (
                  <div className="p-2 rounded-lg bg-red-50 border border-red-200 flex items-center gap-1.5 text-xs text-red-700 font-bold mb-3">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{member.overdueTasksCount} overdue task assigned</span>
                  </div>
                )}
              </div>

              {/* Card Footer Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {member.skills?.length} eligible skills
                </span>
                <span className="text-xs font-bold text-blue-600 group-hover:text-blue-800 inline-flex items-center gap-1">
                  View Schedule & Tasks →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Detail Drawer / Modal */}
      {selectedStaff && (
        <StaffDetailModal
          isOpen={Boolean(selectedStaff)}
          onClose={() => setSelectedStaff(null)}
          staffMember={selectedStaff}
          onViewTask={(id) => navigate(`/dispatcher/tasks/${id}`)}
          onReassignTask={(task) => setReassigningTask(task)}
        />
      )}

      {/* Reassign Modal */}
      {reassigningTask && (
        <TaskAssignmentModal
          isOpen={Boolean(reassigningTask)}
          onClose={() => setReassigningTask(null)}
          task={reassigningTask}
        />
      )}
    </div>
  );
}
