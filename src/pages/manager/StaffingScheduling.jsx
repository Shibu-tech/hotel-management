import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Shield,
  Edit2,
  UserCheck,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import Button from '../../components/ui/Button';
import ScheduleEditModal from '../../components/manager/ScheduleEditModal';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StaffingScheduling() {
  const { staff, staffSchedules, managerMetrics, managerProfile } = useTasks();

  const [activeTab, setActiveTab] = useState('weekly_grid'); // 'weekly_grid', 'roster_table'
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [selectedStaffForEdit, setSelectedStaffForEdit] = useState(null);
  const [selectedDayForEdit, setSelectedDayForEdit] = useState('Mon');

  // Filter staff
  const filteredStaff = staff.filter((s) => {
    if (availabilityFilter !== 'ALL' && s.availability !== availabilityFilter) return false;
    if (departmentFilter !== 'ALL' && s.department !== departmentFilter) return false;
    return true;
  });

  const getShiftBadge = (shiftId) => {
    switch (shiftId) {
      case 'morning':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'day':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'evening':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'night':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const getAvailabilityBadge = (av) => {
    switch (av) {
      case 'Available':
        return 'bg-emerald-100 text-emerald-800';
      case 'Busy':
        return 'bg-amber-100 text-amber-800';
      case 'On Break':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Staffing & Scheduling Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Department roster management, weekly shift allocation, availability monitoring, and labor rest compliance.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
            <button
              onClick={() => setActiveTab('weekly_grid')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                activeTab === 'weekly_grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly Schedule Grid
            </button>
            <button
              onClick={() => setActiveTab('roster_table')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                activeTab === 'roster_table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Staff Workload Roster
            </button>
          </div>
        </div>
      </div>

      {/* Coverage Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Overall Coverage</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {managerMetrics.staffingCoveragePercent}%
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            {managerMetrics.onDutyStaffCount} of {managerMetrics.totalStaffCount} staff active today
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Available for Dispatch</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {managerMetrics.availableStaffCount} Staff
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Immediate runner bandwidth
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Evening Shift Alert</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            2 Scheduled
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Tight coverage post 18:00
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Scheduling Policy</span>
            <Shield className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 mt-2">
            11-Hour Rest Rule
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Mandatory turn intervals
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Filters:
          </span>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-lg bg-white text-xs"
          >
            <option value="ALL">All Availability</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="On Break">On Break</option>
            <option value="Off Duty">Off Duty</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-lg bg-white text-xs"
          >
            <option value="ALL">All Roles / Pods</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Room Service">Room Service</option>
            <option value="Luggage & Bell">Luggage & Bell</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Amenities">Amenities</option>
          </select>
        </div>

        <span className="text-slate-500 text-[11px]">
          Click any day slot in the schedule grid to adjust staff shift assignments with audit reasons.
        </span>
      </div>

      {/* View 1: Weekly Schedule Grid */}
      {activeTab === 'weekly_grid' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                Current Operational Week Shift Allocation
              </h2>
            </div>
            <span className="text-[11px] text-slate-500">
              Authorized Scheduler: <strong>{managerProfile.name}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 text-[10px] font-bold uppercase">
                  <th className="py-2.5 px-4 sticky left-0 bg-slate-50/90 z-10 w-56">Staff Member</th>
                  {DAYS_OF_WEEK.map((d) => (
                    <th key={d} className="py-2.5 px-3 text-center min-w-[110px]">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((member) => {
                  const scheduleObj = staffSchedules.find((s) => s.staffId === member.id);

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Member Info Sticky Column */}
                      <td className="py-3 px-4 sticky left-0 bg-white shadow-xs z-10">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 leading-tight">
                              {member.name}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {member.role} ({member.id})
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 7 Days of the Week */}
                      {DAYS_OF_WEEK.map((day) => {
                        const daySchedule = scheduleObj?.weeklySchedule?.[day] || {
                          shift: 'off',
                          hours: 'Off Duty'
                        };
                        const isOff = daySchedule.shift === 'off';

                        return (
                          <td key={day} className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStaffForEdit(member);
                                setSelectedDayForEdit(day);
                              }}
                              className={`w-full py-1.5 px-2 rounded-lg border text-[11px] font-medium transition-all group hover:ring-2 hover:ring-blue-400 ${
                                isOff
                                  ? 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                                  : getShiftBadge(daySchedule.shift)
                              }`}
                              title={`Click to edit ${member.name}'s schedule on ${day}`}
                            >
                              <div className="font-bold capitalize truncate">
                                {daySchedule.shift}
                              </div>
                              <div className="text-[9px] opacity-80 truncate">
                                {isOff ? 'Off' : daySchedule.hours.split('–')[0]}
                              </div>
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Staff Workload Roster Table */}
      {activeTab === 'roster_table' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Role & Dept</th>
                  <th className="py-3 px-4">Current Shift</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4 text-center">Active Tasks</th>
                  <th className="py-3 px-4 text-center">Overdue Tasks</th>
                  <th className="py-3 px-4">Workload Level</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{member.name}</div>
                          <div className="text-[10px] text-slate-400">{member.id} • Ext: {member.phoneExt}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-700">
                      <div>{member.role}</div>
                      <div className="text-[10px] text-slate-400">{member.department}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {member.shift}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getAvailabilityBadge(member.availability)}`}>
                        {member.availability}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {member.activeTasksCount}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${member.overdueTasksCount > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                        {member.overdueTasksCount}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${member.workloadAnalysis?.badgeBg} ${member.workloadAnalysis?.color}`}>
                        {member.workloadStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedStaffForEdit(member);
                          setSelectedDayForEdit('Mon');
                        }}
                        className="text-[11px] font-bold"
                      >
                        <Edit2 className="w-3 h-3 mr-1 inline" />
                        Edit Schedule
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Edit Modal */}
      {selectedStaffForEdit && (
        <ScheduleEditModal
          isOpen={Boolean(selectedStaffForEdit)}
          onClose={() => setSelectedStaffForEdit(null)}
          staffMember={selectedStaffForEdit}
          day={selectedDayForEdit}
        />
      )}
    </div>
  );
}
