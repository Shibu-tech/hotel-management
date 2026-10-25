import React, { useState, useMemo } from 'react';
import {
  Users2,
  Search,
  Filter,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  UserCheck,
  Radio,
  Eye,
  X,
  Phone,
  ArrowRight,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { getPriorityStyle, getStatusStyle, formatTimeRemaining } from '../../utils/taskStatus';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import WorkloadThresholdsModal from '../../components/supervisor/WorkloadThresholdsModal';
import ReassignTaskModal from '../../components/supervisor/ReassignTaskModal';
import TaskDetailModal from '../../components/supervisor/TaskDetailModal';

export default function TeamWorkload() {
  const { staff, tasks, supervisorProfile, workloadThresholds } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');
  const [workloadFilter, setWorkloadFilter] = useState('ALL');
  const [shiftFilter, setShiftFilter] = useState('ALL');
  const [hasOverdueFilter, setHasOverdueFilter] = useState(false);

  // Selected Employee Detail Drawer/Panel
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Modals
  const [thresholdsModalOpen, setThresholdsModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [reassignTask, setReassignTask] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailTask, setDetailTask] = useState(null);

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = member.name.toLowerCase().includes(q);
        const matchId = member.id.toLowerCase().includes(q);
        const matchRole = member.role.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchRole) return false;
      }

      // Availability
      if (availabilityFilter !== 'ALL' && member.availability !== availabilityFilter) {
        return false;
      }

      // Workload Level
      if (workloadFilter !== 'ALL' && member.workloadAnalysis?.level !== workloadFilter) {
        return false;
      }

      // Shift
      if (shiftFilter !== 'ALL' && !member.shift.toLowerCase().includes(shiftFilter.toLowerCase())) {
        return false;
      }

      // Has Overdue
      if (hasOverdueFilter && member.overdueTasksCount === 0) {
        return false;
      }

      return true;
    });
  }, [staff, searchQuery, availabilityFilter, workloadFilter, shiftFilter, hasOverdueFilter]);

  const activeStaffTasks = useMemo(() => {
    if (!selectedStaff) return [];
    return tasks.filter(
      (t) => t.assignedTo?.id === selectedStaff.id && t.status !== 'Completed'
    );
  }, [tasks, selectedStaff]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
              Department Capacity Matrix
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Supervisor: {supervisorProfile.name}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#172033] tracking-tight mt-1">
            Team Workload & Capacity Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time task saturation, eliminate bottlenecks, and rebalance tickets across active floor attendants.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setThresholdsModalOpen(true)}
            className="text-xs"
          >
            <Sliders className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            Capacity Thresholds
          </Button>
        </div>
      </div>

      {/* Thresholds Demo Banner */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs text-blue-900 gap-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Active Capacity Modeling: </strong>
            Optimal (1–{workloadThresholds.optimalMax} tasks) • Moderate ({workloadThresholds.optimalMax + 1}–
            {workloadThresholds.moderateMax}) • High ({workloadThresholds.highMax}) • Overloaded ({workloadThresholds.overloadedMin}+ or 2+ overdue).
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 shrink-0">
          Demo Assumptions
        </span>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee by name, ID, or role..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Availability */}
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Availabilities</option>
            <option value="Available">Available Only</option>
            <option value="Busy">Busy</option>
            <option value="On Break">On Break</option>
            <option value="Off Duty">Off Duty</option>
          </select>

          {/* Workload Level */}
          <select
            value={workloadFilter}
            onChange={(e) => setWorkloadFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Workload Levels</option>
            <option value="Optimal">Optimal</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
            <option value="Overloaded">🚨 Overloaded</option>
          </select>

          {/* Shift */}
          <select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Shifts</option>
            <option value="Morning">Morning Shift</option>
            <option value="Day">Day Shift</option>
            <option value="Evening">Evening Shift</option>
          </select>

          {/* Overdue toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 select-none">
            <input
              type="checkbox"
              checked={hasOverdueFilter}
              onChange={(e) => setHasOverdueFilter(e.target.checked)}
              className="w-3.5 h-3.5 text-red-600 rounded border-slate-300"
            />
            <span className="font-semibold text-slate-700">Has Overdue</span>
          </label>
        </div>
      </div>

      {/* Main Staff Grid + Detail Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff Cards List */}
        <div className={`space-y-3 ${selectedStaff ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {filteredStaff.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredStaff.map((member) => {
                const analysis = member.workloadAnalysis || { level: 'Optimal', warning: false };
                const isSelected = selectedStaff?.id === member.id;

                return (
                  <div
                    key={member.id}
                    onClick={() => setSelectedStaff(member)}
                    className={`bg-white rounded-2xl border p-4.5 cursor-pointer transition-all shadow-sm ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20'
                        : analysis.warning
                        ? 'border-red-200 hover:border-red-300'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-sm">{member.name}</h3>
                            <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                              {member.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{member.role}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{member.shift}</p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          member.availability === 'Available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : member.availability === 'Busy'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {member.availability}
                      </span>
                    </div>

                    {/* Workload Metric Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-slate-50">
                        <span className="font-bold text-slate-900 text-sm">{member.activeTasksCount}</span>
                        <p className="text-[10px] text-slate-500">Active</p>
                      </div>

                      <div className={`p-2 rounded-lg ${member.overdueTasksCount > 0 ? 'bg-red-50 text-red-900' : 'bg-slate-50'}`}>
                        <span className="font-bold text-sm">{member.overdueTasksCount}</span>
                        <p className="text-[10px] text-slate-500">Overdue</p>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50">
                        <span className="font-bold text-slate-900 text-sm">{member.blockedTasksCount || 0}</span>
                        <p className="text-[10px] text-slate-500">Blocked</p>
                      </div>
                    </div>

                    {/* Warning / Level Footnote */}
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          analysis.warning
                            ? 'bg-red-100 text-red-800'
                            : analysis.level === 'Moderate'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {analysis.level} Workload
                      </span>

                      <span className="text-blue-600 font-semibold text-[11px] flex items-center gap-1 group-hover:underline">
                        <span>Inspect Tasks</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No staff members match filter criteria"
              description="Adjust availability, shift, or workload filter selections."
              actionLabel="Reset Search"
              onAction={() => {
                setSearchQuery('');
                setAvailabilityFilter('ALL');
                setWorkloadFilter('ALL');
                setShiftFilter('ALL');
                setHasOverdueFilter(false);
              }}
            />
          )}
        </div>

        {/* Selected Staff Detail Drawer Panel */}
        {selectedStaff && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 space-y-4 self-start sticky top-20">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStaff.avatarUrl}
                  alt={selectedStaff.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div>
                  <h3 className="font-bold text-base text-slate-900">{selectedStaff.name}</h3>
                  <p className="text-xs text-slate-500">{selectedStaff.role} • {selectedStaff.department}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Ext: {selectedStaff.phoneExt || 'x400'} | Radio: {selectedStaff.radio || 'CH 04'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStaff(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Workload Status Box */}
            <div
              className={`p-3.5 rounded-xl border text-xs ${
                selectedStaff.workloadAnalysis?.warning
                  ? 'bg-red-50 border-red-200 text-red-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between font-bold mb-1">
                <span>Workload Saturation:</span>
                <span>{selectedStaff.workloadAnalysis?.level}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {selectedStaff.workloadAnalysis?.message}
              </p>
            </div>

            {/* Active Tasks Assigned to Staff */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Active Tickets ({activeStaffTasks.length})
                </h4>
                <span className="text-[10px] text-slate-400">Click to reassign</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto border border-slate-200 rounded-xl bg-slate-50/50">
                {activeStaffTasks.length > 0 ? (
                  activeStaffTasks.map((t) => (
                    <div key={t.id} className="p-3 text-xs hover:bg-white transition-colors space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                          {t.id}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {formatTimeRemaining(t.dueAt, t.status)}
                        </span>
                      </div>
                      <p className="font-bold text-slate-900 truncate">{t.title}</p>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {t.location}
                      </p>

                      <div className="pt-1.5 flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDetailTask(t);
                            setDetailModalOpen(true);
                          }}
                          className="text-[10px] h-6 px-2"
                        >
                          Details
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setReassignTask(t);
                            setReassignModalOpen(true);
                          }}
                          className="text-[10px] h-6 px-2.5 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Reassign
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active tasks currently assigned to this attendant.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <WorkloadThresholdsModal
        isOpen={thresholdsModalOpen}
        onClose={() => setThresholdsModalOpen(false)}
      />

      <ReassignTaskModal
        isOpen={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        task={reassignTask}
      />

      <TaskDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        task={detailTask}
        onReassign={(t) => {
          setReassignTask(t);
          setReassignModalOpen(true);
        }}
      />
    </div>
  );
}
