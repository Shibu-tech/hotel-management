import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ListTodo,
  PlusCircle,
  LayoutGrid,
  Table as TableIcon,
  X,
  AlertCircle
} from 'lucide-react';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskTable from '../../components/tasks/TaskTable';
import TaskCard from '../../components/tasks/TaskCard';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

import TaskAssignmentModal from '../../components/tasks/TaskAssignmentModal';
import TaskEditModal from '../../components/tasks/TaskEditModal';
import DelayModal from '../../components/tasks/DelayModal';
import EscalateModal from '../../components/tasks/EscalateModal';
import GuestCommunicationModal from '../../components/tasks/GuestCommunicationModal';

import { isOverdue, isDueSoon } from '../../utils/taskStatus';
import { useTasks } from '../../context/TaskContext';

export default function TaskQueue() {
  const { tasks, staff } = useTasks();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // View mode: table or card
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Filter states (initialized from URL if query params present)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || 'all');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [assigneeFilter, setAssigneeFilter] = useState(searchParams.get('assignee') || 'all');
  const [dueDateFilter, setDueDateFilter] = useState(searchParams.get('due') || 'all');
  const [sortBy, setSortBy] = useState('due_soon');

  // Modals state
  const [assigningTask, setAssigningTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [delayingTask, setDelayingTask] = useState(null);
  const [escalatingTask, setEscalatingTask] = useState(null);
  const [guestCommTask, setGuestCommTask] = useState(null);

  // Sync state to URL params for deep-linking
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (priorityFilter !== 'all') params.set('priority', priorityFilter);
    if (categoryFilter !== 'all') params.set('category', categoryFilter);
    if (assigneeFilter !== 'all') params.set('assignee', assigneeFilter);
    if (dueDateFilter !== 'all') params.set('due', dueDateFilter);
    setSearchParams(params, { replace: true });
  }, [
    searchQuery,
    statusFilter,
    priorityFilter,
    categoryFilter,
    assigneeFilter,
    dueDateFilter,
    setSearchParams
  ]);

  // Combined filtering & sorting
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          (t.assignedTo?.name || '').toLowerCase().includes(q) ||
          (t.item || '').toLowerCase().includes(q)
      );
    }

    // 2. Status
    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    // 3. Priority
    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority?.toLowerCase() === priorityFilter.toLowerCase());
    }

    // 4. Category
    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.category === categoryFilter);
    }

    // 5. Assignee
    if (assigneeFilter === 'unassigned') {
      result = result.filter((t) => !t.assignedTo || !t.assignedTo.id);
    } else if (assigneeFilter === 'assigned') {
      result = result.filter((t) => t.assignedTo && t.assignedTo.id);
    } else if (assigneeFilter !== 'all') {
      result = result.filter((t) => t.assignedTo && t.assignedTo.id === assigneeFilter);
    }

    // 6. Due Schedule
    if (dueDateFilter === 'overdue') {
      result = result.filter((t) => isOverdue(t.dueAt, t.status));
    } else if (dueDateFilter === 'due_soon') {
      result = result.filter((t) => isDueSoon(t.dueAt, t.status));
    } else if (dueDateFilter === 'due_today') {
      const today = new Date().toDateString();
      result = result.filter((t) => new Date(t.dueAt).toDateString() === today);
    }

    // 7. Sorting
    result.sort((a, b) => {
      if (sortBy === 'priority') {
        const order = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (order[b.priority?.toLowerCase()] || 0) - (order[a.priority?.toLowerCase()] || 0);
      }
      if (sortBy === 'due_soon') {
        return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
      }
      if (sortBy === 'created_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'task_id') {
        return a.id.localeCompare(b.id, undefined, { numeric: true });
      }
      return 0;
    });

    return result;
  }, [
    tasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    categoryFilter,
    assigneeFilter,
    dueDateFilter,
    sortBy
  ]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setAssigneeFilter('all');
    setDueDateFilter('all');
    setSortBy('due_soon');
  };

  const handleViewTask = (taskId) => {
    navigate(`/dispatcher/tasks/${taskId}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-150">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Department Task Queue
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {tasks.length} total tasks
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage, dispatch, and track room service, housekeeping, luggage, and maintenance requests
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View toggle (desktop) */}
          <div className="hidden md:flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'cards' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={PlusCircle}
            onClick={() => navigate('/dispatcher/tasks/new')}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <TaskFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        assigneeFilter={assigneeFilter}
        onAssigneeFilterChange={setAssigneeFilter}
        dueDateFilter={dueDateFilter}
        onDueDateFilterChange={setDueDateFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onClearFilters={handleClearFilters}
        staffList={staff}
        totalTasksCount={tasks.length}
        filteredTasksCount={filteredTasks.length}
      />

      {/* Main Task List Content */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No matching tasks found"
          description="None of the tasks match your current combination of search terms, status filters, and category selections."
          actionLabel="Clear all filters"
          onAction={handleClearFilters}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className={viewMode === 'table' ? 'hidden md:block' : 'hidden'}>
            <TaskTable
              tasks={filteredTasks}
              onViewTask={handleViewTask}
              onAssignTask={(task) => setAssigningTask(task)}
              onRecordDelay={(task) => setDelayingTask(task)}
              onEscalateTask={(task) => setEscalatingTask(task)}
              onGuestUpdate={(task) => setGuestCommTask(task)}
            />
          </div>

          {/* Responsive Card Grid (always on mobile, optional on desktop) */}
          <div
            className={
              viewMode === 'cards'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden'
            }
          >
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onViewTask={handleViewTask}
                onAssignTask={(task) => setAssigningTask(task)}
                onRecordDelay={(task) => setDelayingTask(task)}
                onEscalateTask={(task) => setEscalatingTask(task)}
              />
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      {assigningTask && (
        <TaskAssignmentModal
          isOpen={Boolean(assigningTask)}
          onClose={() => setAssigningTask(null)}
          task={assigningTask}
        />
      )}

      {editingTask && (
        <TaskEditModal
          isOpen={Boolean(editingTask)}
          onClose={() => setEditingTask(null)}
          task={editingTask}
        />
      )}

      {delayingTask && (
        <DelayModal
          isOpen={Boolean(delayingTask)}
          onClose={() => setDelayingTask(null)}
          task={delayingTask}
          onSwitchToEscalate={() => {
            const t = delayingTask;
            setDelayingTask(null);
            setEscalatingTask(t);
          }}
        />
      )}

      {escalatingTask && (
        <EscalateModal
          isOpen={Boolean(escalatingTask)}
          onClose={() => setEscalatingTask(null)}
          task={escalatingTask}
        />
      )}

      {guestCommTask && (
        <GuestCommunicationModal
          isOpen={Boolean(guestCommTask)}
          onClose={() => setGuestCommTask(null)}
          task={guestCommTask}
        />
      )}
    </div>
  );
}
