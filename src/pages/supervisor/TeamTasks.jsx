import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  CheckSquare,
  AlertTriangle,
  UserCheck,
  ClipboardCheck,
  ShieldAlert,
  FileCheck,
  Eye,
  MapPin,
  Clock,
  AlertOctagon,
  User,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import {
  TASK_STATUS,
  TASK_PRIORITY,
  TASK_CATEGORY,
  INSPECTION_STATUS,
  getStatusStyle,
  getPriorityStyle,
  getInspectionStatusStyle,
  formatDateTime,
  formatTimeRemaining,
  isOverdue,
  isDueSoon
} from '../../utils/taskStatus';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import TaskDetailModal from '../../components/supervisor/TaskDetailModal';
import ReassignTaskModal from '../../components/supervisor/ReassignTaskModal';
import InspectionModal from '../../components/supervisor/InspectionModal';
import CorrectiveActionModal from '../../components/supervisor/CorrectiveActionModal';
import SupervisorEscalateModal from '../../components/supervisor/SupervisorEscalateModal';
import BlockerModal from '../../components/supervisor/BlockerModal';

export default function TeamTasks() {
  const { tasks, staff, supervisorProfile } = useTasks();
  const location = useLocation();

  // Query params
  const searchParams = new URLSearchParams(location.search);
  const initialFilter = searchParams.get('filter');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [dueFilter, setDueFilter] = useState(initialFilter === 'overdue' ? 'OVERDUE' : 'ALL');
  const [inspectionFilter, setInspectionFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline' | 'priority' | 'creation' | 'id'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  // Modals state
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [correctiveModalOpen, setCorrectiveModalOpen] = useState(false);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [blockerModalOpen, setBlockerModalOpen] = useState(false);

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // 1. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = t.id.toLowerCase().includes(q);
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesLocation = t.location.toLowerCase().includes(q);
        const matchesAssignee = (t.assignedTo?.name || '').toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesLocation && !matchesAssignee) {
          return false;
        }
      }

      // 2. Status
      if (statusFilter !== 'ALL' && t.status !== statusFilter) {
        return false;
      }

      // 3. Priority
      if (priorityFilter !== 'ALL' && t.priority.toLowerCase() !== priorityFilter.toLowerCase()) {
        return false;
      }

      // 4. Assignee
      if (assigneeFilter === 'ASSIGNED' && (!t.assignedTo || !t.assignedTo.id)) {
        return false;
      }
      if (assigneeFilter === 'UNASSIGNED' && (t.assignedTo && t.assignedTo.id)) {
        return false;
      }
      if (
        assigneeFilter !== 'ALL' &&
        assigneeFilter !== 'ASSIGNED' &&
        assigneeFilter !== 'UNASSIGNED' &&
        t.assignedTo?.id !== assigneeFilter
      ) {
        return false;
      }

      // 5. Category
      if (categoryFilter !== 'ALL' && t.category !== categoryFilter) {
        return false;
      }

      // 6. Due Date
      if (dueFilter === 'OVERDUE' && !isOverdue(t.dueAt, t.status)) {
        return false;
      }
      if (dueFilter === 'DUE_SOON' && !isDueSoon(t.dueAt, t.status)) {
        return false;
      }

      // 7. Inspection state
      if (inspectionFilter !== 'ALL') {
        if (inspectionFilter === 'PENDING' && t.inspectionStatus !== INSPECTION_STATUS.PENDING) {
          return false;
        }
        if (inspectionFilter === 'PASSED' && t.inspectionStatus !== INSPECTION_STATUS.PASSED) {
          return false;
        }
        if (inspectionFilter === 'REOPENED' && t.inspectionStatus !== INSPECTION_STATUS.REOPENED) {
          return false;
        }
        if (
          inspectionFilter === 'CORRECTION_REQ' &&
          t.inspectionStatus !== INSPECTION_STATUS.CORRECTION_REQUESTED
        ) {
          return false;
        }
        if (
          inspectionFilter === 'NOT_REQUIRED' &&
          (t.inspectionRequired === true || t.inspectionStatus !== INSPECTION_STATUS.NOT_REQUIRED)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    tasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    assigneeFilter,
    categoryFilter,
    dueFilter,
    inspectionFilter
  ]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'deadline') {
        const timeA = a.dueAt ? new Date(a.dueAt).getTime() : 0;
        const timeB = b.dueAt ? new Date(b.dueAt).getTime() : 0;
        comparison = timeA - timeB;
      } else if (sortBy === 'priority') {
        const pWeights = { urgent: 4, high: 3, medium: 2, low: 1 };
        comparison = (pWeights[b.priority] || 0) - (pWeights[a.priority] || 0);
      } else if (sortBy === 'creation') {
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'id') {
        comparison = a.id.localeCompare(b.id);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredTasks, sortBy, sortDirection]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setAssigneeFilter('ALL');
    setCategoryFilter('ALL');
    setDueFilter('ALL');
    setInspectionFilter('ALL');
    setSortBy('deadline');
    setSortDirection('asc');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    assigneeFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    dueFilter !== 'ALL' ||
    inspectionFilter !== 'ALL';

  return (
    <div className="space-y-6">
      {/* Header Context Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
              Department Execution Oversight
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Scope: {supervisorProfile.department}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#172033] tracking-tight mt-1">
            Team Tasks Oversight
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Managing <strong className="text-slate-800">{sortedTasks.length}</strong> of{' '}
            <strong className="text-slate-800">{tasks.length}</strong> active & historical department tickets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs">
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Search Row */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Task ID (e.g. TSK-1042), room location, title, or assigned staff member..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(TASK_STATUS).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Assignee
            </label>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Assignees</option>
              <option value="ASSIGNED">Any Assigned</option>
              <option value="UNASSIGNED">Unassigned Only</option>
              <optgroup label="Team Staff">
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Categories</option>
              {Object.values(TASK_CATEGORY).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Due Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Due Date
            </label>
            <select
              value={dueFilter}
              onChange={(e) => setDueFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Deadlines</option>
              <option value="OVERDUE">🚨 Overdue Only</option>
              <option value="DUE_SOON">⏱️ Due Soon (&lt; 60m)</option>
            </select>
          </div>

          {/* Inspection Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Inspection State
            </label>
            <select
              value={inspectionFilter}
              onChange={(e) => setInspectionFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All States</option>
              <option value="PENDING">Pending Review</option>
              <option value="PASSED">Passed</option>
              <option value="REOPENED">Reopened</option>
              <option value="CORRECTION_REQ">Correction Req</option>
              <option value="NOT_REQUIRED">Not Required</option>
            </select>
          </div>
        </div>

        {/* Sort Bar */}
        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">Sort by:</span>
            <button
              onClick={() => {
                if (sortBy === 'deadline') setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
                else {
                  setSortBy('deadline');
                  setSortDirection('asc');
                }
              }}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                sortBy === 'deadline' ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-slate-100'
              }`}
            >
              Deadline {sortBy === 'deadline' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>

            <button
              onClick={() => {
                if (sortBy === 'priority') setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
                else {
                  setSortBy('priority');
                  setSortDirection('desc');
                }
              }}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                sortBy === 'priority' ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-slate-100'
              }`}
            >
              Priority {sortBy === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>

            <button
              onClick={() => {
                if (sortBy === 'creation') setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
                else {
                  setSortBy('creation');
                  setSortDirection('desc');
                }
              }}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                sortBy === 'creation' ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-slate-100'
              }`}
            >
              Creation {sortBy === 'creation' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>

            <button
              onClick={() => {
                if (sortBy === 'id') setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
                else {
                  setSortBy('id');
                  setSortDirection('asc');
                }
              }}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                sortBy === 'id' ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-slate-100'
              }`}
            >
              Task ID {sortBy === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
          </div>

          <span>Showing {sortedTasks.length} results</span>
        </div>
      </div>

      {/* Main Task List Table & Mobile Cards */}
      {sortedTasks.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Task ID</th>
                  <th className="py-3 px-4">Task Details</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Status / Barrier</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {sortedTasks.map((task) => {
                  const statusStyle = getStatusStyle(task.status);
                  const priorityStyle = getPriorityStyle(task.priority);
                  const overdue = isOverdue(task.dueAt, task.status);
                  const inspectionStyle = getInspectionStatusStyle(task.inspectionStatus);

                  return (
                    <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {task.id}
                      </td>

                      {/* Title & Instructions */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 truncate">{task.title}</div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {task.instructions}
                        </div>
                        {task.inspectionRequired && (
                          <div className="mt-1">
                            <span className={`inline-flex px-1.5 py-0.2 rounded text-[9px] font-bold ${inspectionStyle.bg} ${inspectionStyle.text}`}>
                              {inspectionStyle.badge}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{task.location}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                        {task.category}
                      </td>

                      {/* Assignee */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {task.assignedTo ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700">
                              {task.assignedTo.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-slate-900">{task.assignedTo.name}</span>
                          </div>
                        ) : (
                          <span className="italic text-slate-400 font-normal">Unassigned</span>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${priorityStyle.bg} ${priorityStyle.text}`}>
                          {priorityStyle.label}
                        </span>
                      </td>

                      {/* Deadline */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`font-semibold ${overdue ? 'text-red-700 font-bold' : 'text-slate-700'}`}>
                          {formatTimeRemaining(task.dueAt, task.status)}
                        </span>
                      </td>

                      {/* Status / Barrier */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                            {task.status}
                          </span>
                          {(task.blockerInfo || task.delayInfo) && (
                            <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded truncate max-w-[130px]">
                              ⚠️ {task.blockerInfo?.category || task.delayInfo?.reason}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTask(task);
                              setDetailModalOpen(true);
                            }}
                            className="h-7 px-2 text-[11px]"
                            title="View Full Task Details"
                          >
                            <Eye className="w-3 h-3 text-slate-500" />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTask(task);
                              setReassignModalOpen(true);
                            }}
                            className="h-7 px-2 text-[11px]"
                            title="Reassign Task"
                          >
                            <UserCheck className="w-3 h-3 text-blue-600" />
                          </Button>

                          {task.status === TASK_STATUS.COMPLETED && task.inspectionRequired && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTask(task);
                                setInspectModalOpen(true);
                              }}
                              className="h-7 px-2 text-[11px] text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                              title="Inspect Completed Task"
                            >
                              <ClipboardCheck className="w-3 h-3 text-emerald-600" />
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTask(task);
                              setCorrectiveModalOpen(true);
                            }}
                            className="h-7 px-2 text-[11px]"
                            title="Record Corrective Action"
                          >
                            <FileCheck className="w-3 h-3 text-purple-600" />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTask(task);
                              setEscalateModalOpen(true);
                            }}
                            className="h-7 px-2 text-[11px] text-red-600 hover:bg-red-50 border-red-200"
                            title="Escalate Issue"
                          >
                            <ShieldAlert className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="lg:hidden divide-y divide-slate-100">
            {sortedTasks.map((task) => {
              const statusStyle = getStatusStyle(task.status);
              const priorityStyle = getPriorityStyle(task.priority);
              const overdue = isOverdue(task.dueAt, task.status);
              const inspectionStyle = getInspectionStatusStyle(task.inspectionStatus);

              return (
                <div key={task.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {task.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${priorityStyle.bg} ${priorityStyle.text}`}>
                          {priorityStyle.label}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{task.title}</h3>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${statusStyle.bg} ${statusStyle.text}`}>
                      {task.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{task.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className={overdue ? 'text-red-700 font-bold' : ''}>
                        {formatTimeRemaining(task.dueAt, task.status)}
                      </span>
                    </div>

                    <div className="col-span-2 flex items-center justify-between pt-1 border-t border-slate-100">
                      <span>Assignee: <strong className="text-slate-800">{task.assignedTo?.name || 'Unassigned'}</strong></span>
                      <span>Category: {task.category}</span>
                    </div>
                  </div>

                  {(task.blockerInfo || task.delayInfo) && (
                    <div className="p-2 rounded bg-red-50 text-[11px] text-red-900 flex items-center justify-between">
                      <span className="truncate font-semibold">
                        Barrier: {task.blockerInfo?.category || task.delayInfo?.reason}
                      </span>
                      <span className="font-bold text-red-700 uppercase">Blocked</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task);
                        setDetailModalOpen(true);
                      }}
                      className="text-xs h-7 px-2.5"
                    >
                      View Details
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task);
                        setReassignModalOpen(true);
                      }}
                      className="text-xs h-7 px-2.5 text-blue-700"
                    >
                      Reassign
                    </Button>

                    {task.status === TASK_STATUS.COMPLETED && task.inspectionRequired && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedTask(task);
                          setInspectModalOpen(true);
                        }}
                        className="text-xs h-7 px-2.5 bg-emerald-600 text-white"
                      >
                        Inspect
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task);
                        setEscalateModalOpen(true);
                      }}
                      className="text-xs h-7 px-2 text-red-600 hover:bg-red-50 border-red-200"
                    >
                      Escalate
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyState
          title="No tasks match the active filters"
          description="Try modifying search keywords, resetting filter selections, or clearing the due date restriction."
          actionLabel="Clear All Filters"
          onAction={clearFilters}
        />
      )}

      {/* Modals */}
      <TaskDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        task={selectedTask}
        onReassign={(t) => {
          setSelectedTask(t);
          setReassignModalOpen(true);
        }}
        onInspect={(t) => {
          setSelectedTask(t);
          setInspectModalOpen(true);
        }}
        onCorrectiveAction={(t) => {
          setSelectedTask(t);
          setCorrectiveModalOpen(true);
        }}
        onEscalate={(t) => {
          setSelectedTask(t);
          setEscalateModalOpen(true);
        }}
      />

      <ReassignTaskModal
        isOpen={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        task={selectedTask}
      />

      <InspectionModal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        task={selectedTask}
        onEscalate={(t) => {
          setSelectedTask(t);
          setEscalateModalOpen(true);
        }}
      />

      <CorrectiveActionModal
        isOpen={correctiveModalOpen}
        onClose={() => setCorrectiveModalOpen(false)}
        mode="create"
        prefilledTaskId={selectedTask?.id}
      />

      <SupervisorEscalateModal
        isOpen={escalateModalOpen}
        onClose={() => setEscalateModalOpen(false)}
        task={selectedTask}
      />
    </div>
  );
}
