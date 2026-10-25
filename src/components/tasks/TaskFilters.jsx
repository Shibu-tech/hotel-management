import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, Filter } from 'lucide-react';
import { TASK_STATUS, TASK_PRIORITY, TASK_CATEGORY } from '../../utils/taskStatus';
import Button from '../ui/Button';

export default function TaskFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  assigneeFilter,
  onAssigneeFilterChange,
  dueDateFilter,
  onDueDateFilterChange,
  sortBy,
  onSortByChange,
  onClearFilters,
  staffList = [],
  totalTasksCount = 0,
  filteredTasksCount = 0
}) {
  const isAnyFilterActive =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    categoryFilter !== 'all' ||
    assigneeFilter !== 'all' ||
    dueDateFilter !== 'all';

  const statusTabs = [
    { id: 'all', label: 'All Tasks' },
    { id: TASK_STATUS.NEW, label: 'New' },
    { id: TASK_STATUS.IN_PROGRESS, label: 'In Progress' },
    { id: TASK_STATUS.ON_THE_WAY, label: 'On the Way' },
    { id: TASK_STATUS.BLOCKED, label: 'Blocked' },
    { id: TASK_STATUS.COMPLETED, label: 'Completed' }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-4 mb-6 space-y-4">
      {/* Top Search bar + Sorting */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Task ID (e.g. TSK-1042), title, room, staff name..."
            className="w-full text-xs sm:text-sm pl-10 pr-9 py-2 rounded-lg border border-slate-300 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 shadow-2xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
          >
            <option value="priority">Priority (Urgent First)</option>
            <option value="due_soon">Due Time (Earliest First)</option>
            <option value="created_desc">Created (Newest First)</option>
            <option value="task_id">Task ID (Numeric)</option>
          </select>

          {isAnyFilterActive && (
            <Button
              variant="ghost"
              size="sm"
              icon={X}
              onClick={onClearFilters}
              className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Status Filter Tab Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100">
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusFilterChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Secondary Dropdown Filter Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {/* Priority Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Priority
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {Object.values(TASK_CATEGORY).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Assignee Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Assignee
          </label>
          <select
            value={assigneeFilter}
            onChange={(e) => onAssigneeFilterChange(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Assignees</option>
            <option value="unassigned">⚠️ Unassigned Only</option>
            <option value="assigned">Assigned Staff</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.department})
              </option>
            ))}
          </select>
        </div>

        {/* Due Date Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Due Schedule
          </label>
          <select
            value={dueDateFilter}
            onChange={(e) => onDueDateFilterChange(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Deadlines</option>
            <option value="overdue">🚨 Overdue Now</option>
            <option value="due_soon">⏰ Due Soon (&lt; 60m)</option>
            <option value="due_today">Today's Shift</option>
          </select>
        </div>
      </div>

      {/* Active Filter Summary Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <div>
          Showing <strong className="text-slate-900">{filteredTasksCount}</strong> of{' '}
          <strong className="text-slate-900">{totalTasksCount}</strong> tasks
          {isAnyFilterActive && (
            <span className="ml-1 text-blue-600 font-semibold">(Filters applied)</span>
          )}
        </div>
        {isAnyFilterActive && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
