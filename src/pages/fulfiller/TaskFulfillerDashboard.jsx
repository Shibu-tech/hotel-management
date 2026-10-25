import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardCheck,
  Clock,
  MapPin,
  Play,
  Truck,
  CheckCircle2,
  AlertOctagon,
  MessageSquare,
  Search,
  Filter,
  Package,
  Radio,
  UserCheck,
  ArrowRight,
  PlusCircle,
  Eye,
  AlertTriangle,
  FileText,
  X,
  History,
  Sparkles
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import TaskStatusBadge, { PriorityBadge } from '../../components/tasks/TaskStatusBadge';
import Button from '../../components/ui/Button';
import {
  formatTimeRemaining,
  formatDateTime,
  isOverdue,
  TASK_STATUS
} from '../../utils/taskStatus';
import { FULFILLER_PROFILE } from '../../utils/permissions';

export default function TaskFulfillerDashboard() {
  const {
    tasks,
    currentUser,
    fulfillerProfile,
    fulfillTaskAction,
    showToast
  } = useTasks();

  const activeStaff = currentUser || fulfillerProfile || FULFILLER_PROFILE;
  const staffId = activeStaff.id || 'EMP-418';

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals state
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  // Form states for modals
  const [confirmationNote, setConfirmationNote] = useState('');
  const [recipientType, setRecipientType] = useState('Guest in Room');
  const [deliveredItems, setDeliveredItems] = useState('');

  const [blockReason, setBlockReason] = useState('Room inaccessible / DND active');
  const [blockCategory, setBlockCategory] = useState('Access');
  const [blockSeverity, setBlockSeverity] = useState('High');
  const [blockNotes, setBlockNotes] = useState('');

  const [progressNote, setProgressNote] = useState('');

  // 1. Current user's authorized tasks
  const myTasks = useMemo(() => {
    return tasks.filter((t) => t.assignedTo && t.assignedTo.id === staffId);
  }, [tasks, staffId]);

  // 2. Calculated KPI summary metrics directly from authorized task records
  const kpiMetrics = useMemo(() => {
    const totalAssigned = myTasks.length;
    const newTasks = myTasks.filter((t) => t.status === TASK_STATUS.NEW).length;
    const inProgress = myTasks.filter(
      (t) => t.status === TASK_STATUS.IN_PROGRESS || t.status === 'On the Way'
    ).length;
    const blockedTasks = myTasks.filter((t) => t.status === TASK_STATUS.BLOCKED).length;
    const completedToday = myTasks.filter((t) => t.status === TASK_STATUS.COMPLETED).length;

    return {
      totalAssigned,
      newTasks,
      inProgress,
      blockedTasks,
      completedToday
    };
  }, [myTasks]);

  // 3. Main filtered task list
  const filteredMyTasks = useMemo(() => {
    return myTasks.filter((task) => {
      // Status filter
      if (statusFilter !== 'ALL' && task.status !== statusFilter) {
        return false;
      }
      // Priority filter
      if (priorityFilter !== 'ALL' && (task.priority || '').toLowerCase() !== priorityFilter.toLowerCase()) {
        return false;
      }
      // Category filter
      if (categoryFilter !== 'ALL' && task.category !== categoryFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = task.id.toLowerCase().includes(q);
        const matchTitle = (task.title || '').toLowerCase().includes(q);
        const matchLoc = (task.location || '').toLowerCase().includes(q);
        const matchItem = (task.item || '').toLowerCase().includes(q);
        if (!matchId && !matchTitle && !matchLoc && !matchItem) {
          return false;
        }
      }
      return true;
    });
  }, [myTasks, statusFilter, priorityFilter, categoryFilter, searchQuery]);

  // 4. Claimable open tasks pool (unassigned tasks)
  const claimableTasks = useMemo(() => {
    return tasks.filter(
      (t) => (!t.assignedTo || !t.assignedTo.id) && t.status !== TASK_STATUS.COMPLETED
    );
  }, [tasks]);

  // Handlers for Task Actions
  const handleStartTask = (task) => {
    fulfillTaskAction(task.id, 'start');
  };

  const handleEnRoute = (task) => {
    fulfillTaskAction(task.id, 'on_the_way');
  };

  const openCompleteModal = (task) => {
    setSelectedTask(task);
    setDeliveredItems(task.item || '');
    setConfirmationNote('');
    setRecipientType('Guest in Room');
    setCompleteModalOpen(true);
  };

  const handleConfirmCompletion = (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    fulfillTaskAction(selectedTask.id, 'complete', {
      recipientType,
      confirmationNote,
      deliveredItems
    });
    setCompleteModalOpen(false);
    setSelectedTask(null);
  };

  const openBlockModal = (task) => {
    setSelectedTask(task);
    setBlockReason('Room inaccessible / DND active');
    setBlockCategory('Access');
    setBlockSeverity('High');
    setBlockNotes('');
    setBlockModalOpen(true);
  };

  const handleConfirmBlocker = (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    if (!blockNotes.trim()) {
      showToast('Please provide a specific operational explanation for the blocker.', 'error');
      return;
    }
    fulfillTaskAction(selectedTask.id, 'block', {
      reason: blockReason,
      category: blockCategory,
      notes: blockNotes,
      severity: blockSeverity
    });
    setBlockModalOpen(false);
    setSelectedTask(null);
  };

  const openNoteModal = (task) => {
    setSelectedTask(task);
    setProgressNote('');
    setNoteModalOpen(true);
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!selectedTask || !progressNote.trim()) return;
    fulfillTaskAction(selectedTask.id, 'add_note', {
      note: progressNote
    });
    setNoteModalOpen(false);
    setSelectedTask(null);
  };

  const handleClaim = (taskId) => {
    fulfillTaskAction(taskId, 'claim');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Shift Context */}
      <div className="bg-gradient-to-r from-[#172B4D] via-[#1A365D] to-[#0D9488] rounded-2xl p-6 text-white shadow-lg border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-white shadow-inner">
            <ClipboardCheck className="w-7 h-7 text-teal-300" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-200 border border-teal-300/30">
                TASK FULFILLER
              </span>
              <span className="text-xs text-slate-300 font-semibold">•</span>
              <span className="text-xs text-teal-100 font-medium">Task Operations Terminal</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-teal-950/50 text-[11px] font-mono text-teal-300 border border-teal-800/60">
                <Radio className="w-3 h-3 text-teal-400 animate-pulse" />
                Radio CH-04
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              {activeStaff.name} ({staffId})
            </h1>
            <p className="text-xs text-slate-200 mt-0.5">
              Role: <strong>{activeStaff.role || 'Task Fulfiller'}</strong> • {activeStaff.shift || 'Morning Shift (07:00 – 15:30)'} • {activeStaff.department || 'Housekeeping & Guest Operations Support'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <Link
            to="/task-fulfiller/tasks"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all shadow-xs"
          >
            <span>My Active Tasks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2. KPI Summary Cards (Calculated directly from authorized task records) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Assigned Tasks */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Assigned Tasks</span>
            <UserCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{kpiMetrics.totalAssigned}</span>
            <span className="text-[11px] text-slate-500 font-medium">total rostered</span>
          </div>
        </div>

        {/* Card 2: New Tasks */}
        <div className="bg-white rounded-xl p-4 border border-blue-200/80 bg-blue-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">New Tasks</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-800">{kpiMetrics.newTasks}</span>
            <span className="text-[11px] text-blue-600 font-medium">ready to accept</span>
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div className="bg-white rounded-xl p-4 border border-amber-200/80 bg-amber-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">In Progress</span>
            <Play className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-800">{kpiMetrics.inProgress}</span>
            <span className="text-[11px] text-amber-600 font-medium">active service</span>
          </div>
        </div>

        {/* Card 4: Blocked Tasks */}
        <div className="bg-white rounded-xl p-4 border border-red-200/80 bg-red-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-red-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Blocked Tasks</span>
            <AlertOctagon className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-800">{kpiMetrics.blockedTasks}</span>
            <span className="text-[11px] text-red-600 font-medium">escalated to lead</span>
          </div>
        </div>

        {/* Card 5: Completed Today */}
        <div className="bg-white rounded-xl p-4 border border-emerald-200/80 bg-emerald-50/20 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-800">{kpiMetrics.completedToday}</span>
            <span className="text-[11px] text-emerald-600 font-medium">verified done</span>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Task Operations Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Controls Bar: Search & Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>My Assigned Tasks</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                  {filteredMyTasks.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Authorized task assignments for {activeStaff.name} ({staffId})
              </p>
            </div>

            {/* Quick Status Pill Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'New', 'In Progress', 'On the Way', 'Blocked', 'Completed'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    statusFilter === st
                      ? 'bg-[#172B4D] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {st === 'ALL' ? 'All Status' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-200/60">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ID, title, room, or item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                Priority:
              </span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full text-xs py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="ALL">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                Category:
              </span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full text-xs py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="ALL">All Categories</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Room Service">Room Service</option>
                <option value="Luggage & Bell">Luggage & Bell</option>
                <option value="Amenities">Amenities</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Cards List */}
        <div className="divide-y divide-slate-100">
          {filteredMyTasks.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No matching tasks found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {myTasks.length === 0
                  ? "You currently have no tasks assigned to you. Check the claimable queue below or await dispatch."
                  : "No tasks matched your active filter or search criteria. Try resetting filters."}
              </p>
              {myTasks.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('ALL');
                    setPriorityFilter('ALL');
                    setCategoryFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            filteredMyTasks.map((task) => {
              const overdue = isOverdue(task.dueAt, task.status);

              return (
                <div
                  key={task.id}
                  className={`p-4 sm:p-5 transition-colors hover:bg-slate-50/80 ${
                    task.status === TASK_STATUS.BLOCKED ? 'bg-red-50/30' : ''
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Task Identity, Location & Details */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded border border-slate-200">
                          {task.id}
                        </span>
                        <PriorityBadge priority={task.priority} size="xs" />
                        <TaskStatusBadge status={task.status} size="xs" />
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {task.category}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {task.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-teal-600" />
                            {task.location}
                          </span>
                          <span>•</span>
                          <span
                            className={`flex items-center gap-1 font-semibold ${
                              overdue ? 'text-red-600 font-bold' : 'text-slate-500'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            {formatTimeRemaining(task.dueAt, task.status)}
                          </span>
                          {task.item && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                <Package className="w-3 h-3 text-teal-600" />
                                {task.quantity ? `${task.quantity}x ` : ''}
                                {task.item}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Essential Instructions */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                        <span className="font-bold text-slate-900">Instructions: </span>
                        <span>{task.instructions}</span>
                      </div>

                      {/* Existing notes preview if any */}
                      {task.internalNotes && (
                        <div className="text-[11px] text-slate-500 italic pl-2 border-l-2 border-teal-500">
                          Latest notes: {task.internalNotes.split('\n').pop()}
                        </div>
                      )}
                    </div>

                    {/* Right: Permitted Workflow Action Controls */}
                    <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end justify-end shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Step 1: New -> Start Work */}
                        {task.status === TASK_STATUS.NEW && (
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Play}
                            onClick={() => handleStartTask(task)}
                          >
                            Accept & Start Work
                          </Button>
                        )}

                        {/* Step 2: In Progress -> Mark En Route */}
                        {task.status === TASK_STATUS.IN_PROGRESS && (
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Truck}
                            onClick={() => handleEnRoute(task)}
                          >
                            En Route (On the Way)
                          </Button>
                        )}

                        {/* Step 3: In Progress / On the Way -> Complete Delivery */}
                        {(task.status === TASK_STATUS.IN_PROGRESS || task.status === 'On the Way') && (
                          <Button
                            variant="success"
                            size="sm"
                            icon={CheckCircle2}
                            onClick={() => openCompleteModal(task)}
                          >
                            Confirm Delivery / Done
                          </Button>
                        )}

                        {/* Blocker Action (only if not already completed) */}
                        {task.status !== TASK_STATUS.COMPLETED && task.status !== TASK_STATUS.BLOCKED && (
                          <button
                            type="button"
                            onClick={() => openBlockModal(task)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                          >
                            <AlertOctagon className="w-3.5 h-3.5" />
                            <span>Report Blocker</span>
                          </button>
                        )}

                        {/* Add Note Button */}
                        <button
                          type="button"
                          onClick={() => openNoteModal(task)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                          <span>Note</span>
                        </button>

                        {/* View Full Details Drawer */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTask(task);
                            setDetailModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-600" />
                          <span>Details</span>
                        </button>
                      </div>

                      {task.status === TASK_STATUS.BLOCKED && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100/70 px-2.5 py-1 rounded-md border border-red-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                          <span>Blocker Logged with Supervisor Lead</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Eligible Claimable Tasks Queue (Step 6) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Shared Claimable Pool (Unassigned Department Tasks)</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                {claimableTasks.length} available
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tasks eligible to be claimed and taken into personal roster under department dispatch policy.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {claimableTasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No unassigned tasks currently waiting in the claimable queue.
            </div>
          ) : (
            claimableTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {task.id}
                    </span>
                    <PriorityBadge priority={task.priority} size="xs" />
                    <span className="text-xs font-semibold text-slate-500">{task.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">{task.title}</h4>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{task.location}</span>
                    <span>•</span>
                    <span>{task.instructions}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  icon={PlusCircle}
                  onClick={() => handleClaim(task.id)}
                >
                  Claim Task
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: TASK DETAIL DRAWER                              */}
      {/* ======================================================== */}
      {detailModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-200 px-2 py-0.5 rounded text-slate-800">
                      {selectedTask.id}
                    </span>
                    <TaskStatusBadge status={selectedTask.status} size="xs" />
                    <PriorityBadge priority={selectedTask.priority} size="xs" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedTask.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Service Location
                  </span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    {selectedTask.location}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Category & Department
                  </span>
                  <span className="font-semibold text-slate-800 block mt-0.5">
                    {selectedTask.category} ({selectedTask.department || 'Guest Ops'})
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Scheduled Due Time
                  </span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {formatDateTime(selectedTask.dueAt)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Current Assignee
                  </span>
                  <span className="font-semibold text-slate-800 block mt-0.5">
                    {selectedTask.assignedTo?.name || 'Unassigned'}
                  </span>
                </div>
              </div>

              {selectedTask.item && (
                <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200/80">
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
                    Items / Materials for Service
                  </span>
                  <div className="flex items-center gap-2 font-semibold text-teal-900">
                    <Package className="w-4 h-4 text-teal-600" />
                    <span>
                      {selectedTask.quantity ? `${selectedTask.quantity}x ` : ''}
                      {selectedTask.item}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Detailed Instructions
                </span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedTask.instructions}
                </div>
              </div>

              {selectedTask.deliveryConfirmation && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Delivery Record
                  </span>
                  <div className="space-y-1 text-emerald-900">
                    <div>
                      <strong>Recipient: </strong> {selectedTask.deliveryConfirmation.recipientType}
                    </div>
                    {selectedTask.deliveryConfirmation.confirmationNote && (
                      <div>
                        <strong>Confirmation Note: </strong> {selectedTask.deliveryConfirmation.confirmationNote}
                      </div>
                    )}
                    <div className="text-[10px] text-emerald-700">
                      Confirmed by: {selectedTask.deliveryConfirmation.confirmedBy} at {formatDateTime(selectedTask.deliveryConfirmation.confirmedAt)}
                    </div>
                  </div>
                </div>
              )}

              {/* Status History & Audit Log */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  Task Lifecycle & Audit History
                </span>
                <div className="space-y-2 border-l-2 border-slate-200 pl-3">
                  {selectedTask.history && selectedTask.history.length > 0 ? (
                    selectedTask.history.map((h, i) => (
                      <div key={h.id || i} className="relative pb-2">
                        <div className="font-bold text-slate-800 flex items-center justify-between">
                          <span>{h.event}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {formatDateTime(h.timestamp)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{h.details}</p>
                        <p className="text-[10px] text-slate-400 italic">Actor: {h.actor}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 italic">No history records logged yet.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setDetailModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CONFIRM DELIVERY / COMPLETE MODAL               */}
      {/* ======================================================== */}
      {completeModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-200 bg-emerald-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-emerald-950">
                  Confirm Delivery & Complete Task
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCompleteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmCompletion} className="p-5 space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-800">Task: </span>
                <span className="font-mono text-slate-600">[{selectedTask.id}]</span> {selectedTask.title}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Recipient Type / Handover Method <span className="text-red-500">*</span>
                </label>
                <select
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Guest in Room">Guest in Room (Direct In-Person Handover)</option>
                  <option value="Front Desk Handover">Front Desk Handover</option>
                  <option value="Placed Inside Room (Authorized Entry)">Placed Inside Room (Authorized Entry)</option>
                  <option value="Placed at Room Door per Guest Request">Placed at Room Door per Guest Request</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Delivered Items / Materials
                </label>
                <input
                  type="text"
                  value={deliveredItems}
                  onChange={(e) => setDeliveredItems(e.target.value)}
                  placeholder="e.g. 2x Extra Towels, Foam Pillow"
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Completion / Delivery Confirmation Note
                </label>
                <textarea
                  rows={3}
                  value={confirmationNote}
                  onChange={(e) => setConfirmationNote(e.target.value)}
                  placeholder="e.g. Delivered directly to guest, inspected and verified satisfaction."
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCompleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="success" size="sm" icon={CheckCircle2}>
                  Record Verified Completion
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: REPORT OPERATIONAL BLOCKER                      */}
      {/* ======================================================== */}
      {blockModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-200 bg-red-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-sm text-red-950">
                  Report Blocker & Escalate to Lead
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBlockModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmBlocker} className="p-5 space-y-4 text-xs">
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed">
                <strong>Notice: </strong> Marking a task as Blocked will immediately update the status to Blocked and register a ticket in the Department Supervisor's Blocker queue.
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Primary Blocker Reason <span className="text-red-500">*</span>
                </label>
                <select
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-red-500"
                >
                  <option value="Room inaccessible / DND active">Room inaccessible / DND sign on door</option>
                  <option value="Required item / linen stockout">Required item / linen stockout in pantry</option>
                  <option value="Guest requested revised service time">Guest requested revised service time later</option>
                  <option value="Keycard failure / lock malfunction">Keycard failure / door lock malfunction</option>
                  <option value="Maintenance obstruction / water leak">Maintenance obstruction / active defect</option>
                  <option value="Safety or Security incident">Safety or Security incident in area</option>
                  <option value="Other operational delay">Other operational delay</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={blockCategory}
                    onChange={(e) => setBlockCategory(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                  >
                    <option value="Access">Room Access</option>
                    <option value="Stockout">Inventory / Stock</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Safety">Safety & Security</option>
                    <option value="Guest Preference">Guest Request</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Severity</label>
                  <select
                    value={blockSeverity}
                    onChange={(e) => setBlockSeverity(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                  >
                    <option value="Standard">Standard Impediment</option>
                    <option value="High">High Severity</option>
                    <option value="Emergency">Emergency Safety Lockout</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Detailed Explanation & Context <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={blockNotes}
                  onChange={(e) => setBlockNotes(e.target.value)}
                  placeholder="Explain exactly what obstructed the service and what assistance is needed..."
                  required
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setBlockModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="danger" size="sm" icon={AlertOctagon}>
                  Register Blocker
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: ADD PROGRESS NOTE                               */}
      {/* ======================================================== */}
      {noteModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Add Operational Note to Task [{selectedTask.id}]
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setNoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Internal Staff Note <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                  placeholder="Enter status update, guest feedback, or coordination remarks..."
                  required
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNoteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" icon={FileText}>
                  Append Note
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
