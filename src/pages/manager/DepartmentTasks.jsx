import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Clock,
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  AlertOctagon,
  Eye,
  History,
  Shield,
  X,
  ExternalLink
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import TaskInterventionModal from '../../components/manager/TaskInterventionModal';
import {
  TASK_STATUS,
  TASK_PRIORITY,
  TASK_CATEGORY,
  getStatusStyle,
  getPriorityStyle,
  isOverdue,
  isDueSoon,
  formatTimeRemaining,
  formatDateTime
} from '../../utils/taskStatus';
import { getTaskSlaAnalysis } from '../../utils/slaCalculations';

export default function DepartmentTasks() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { tasks, staff, managerProfile, slaConfig } = useTasks();

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');
  const [specialFilter, setSpecialFilter] = useState('ALL'); // 'ALL', 'OVERDUE', 'UNASSIGNED', 'BLOCKED', 'SLA_BREACH', 'DUE_SOON'
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline', 'priority', 'created', 'sla_risk'

  const [detailTask, setDetailTask] = useState(null);
  const [historyTask, setHistoryTask] = useState(null);
  const [interveneTask, setInterveneTask] = useState(null);

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchId = task.id.toLowerCase().includes(q);
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchLoc = task.location.toLowerCase().includes(q);
          const matchStaff = (task.assignedTo?.name || '').toLowerCase().includes(q);
          if (!matchId && !matchTitle && !matchLoc && !matchStaff) return false;
        }

        // Status
        if (statusFilter !== 'ALL' && task.status !== statusFilter) return false;

        // Priority
        if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) return false;

        // Category
        if (categoryFilter !== 'ALL' && task.category !== categoryFilter) return false;

        // Assignee
        if (assigneeFilter !== 'ALL') {
          if (assigneeFilter === 'UNASSIGNED') {
            if (task.assignedTo && task.assignedTo.id) return false;
          } else {
            if (task.assignedTo?.id !== assigneeFilter) return false;
          }
        }

        // Special quick filters
        const sla = getTaskSlaAnalysis(task, slaConfig);
        const overdue = isOverdue(task.dueAt, task.status);
        const dueSoon = isDueSoon(task.dueAt, task.status);
        const unassigned = !task.assignedTo || !task.assignedTo.id;
        const blocked = task.status === TASK_STATUS.BLOCKED || Boolean(task.blockerInfo);

        if (specialFilter === 'OVERDUE' && !overdue) return false;
        if (specialFilter === 'UNASSIGNED' && !unassigned) return false;
        if (specialFilter === 'BLOCKED' && !blocked) return false;
        if (specialFilter === 'SLA_BREACH' && !sla.isBreached) return false;
        if (specialFilter === 'DUE_SOON' && !dueSoon) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          const timeA = a.dueAt ? new Date(a.dueAt).getTime() : Infinity;
          const timeB = b.dueAt ? new Date(b.dueAt).getTime() : Infinity;
          return timeA - timeB;
        }
        if (sortBy === 'priority') {
          const order = { urgent: 0, high: 1, medium: 2, low: 3 };
          return (order[a.priority] || 4) - (order[b.priority] || 4);
        }
        if (sortBy === 'created') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'sla_risk') {
          const slaA = getTaskSlaAnalysis(a, slaConfig);
          const slaB = getTaskSlaAnalysis(b, slaConfig);
          return slaB.percentElapsed - slaA.percentElapsed;
        }
        return 0;
      });
  }, [tasks, searchQuery, statusFilter, priorityFilter, categoryFilter, assigneeFilter, specialFilter, sortBy, slaConfig]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setCategoryFilter('ALL');
    setAssigneeFilter('ALL');
    setSpecialFilter('ALL');
    setSortBy('deadline');
  };

  const isFiltered =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    assigneeFilter !== 'ALL' ||
    specialFilter !== 'ALL';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Department Tasks Oversight
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Department-wide operational oversight across {tasks.length} active service and housekeeping records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isFiltered && (
            <Button size="sm" variant="secondary" onClick={clearFilters} className="text-xs">
              <X className="w-3.5 h-3.5 mr-1" />
              Reset Filters
            </Button>
          )}
          <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
            Showing {filteredTasks.length} of {tasks.length} Tasks
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle p-4 space-y-3">
        {/* Top search & special pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by task ID, title, room/suite, or assigned staff..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quick special filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 md:pb-0">
            {[
              { id: 'ALL', label: 'All Tasks' },
              { id: 'OVERDUE', label: 'Overdue' },
              { id: 'UNASSIGNED', label: 'Unassigned' },
              { id: 'BLOCKED', label: 'Blocked' },
              { id: 'SLA_BREACH', label: 'SLA Breached' },
              { id: 'DUE_SOON', label: 'Due Soon' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSpecialFilter(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  specialFilter === p.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-dropdown filters row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(TASK_STATUS).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs"
            >
              <option value="ALL">All Priorities</option>
              {Object.values(TASK_PRIORITY).map((pr) => (
                <option key={pr} value={pr} className="capitalize">{pr}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs"
            >
              <option value="ALL">All Categories</option>
              {Object.values(TASK_CATEGORY).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Assignee</label>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs"
            >
              <option value="ALL">All Assignees</option>
              <option value="UNASSIGNED">Unassigned Only</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.department})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs"
            >
              <option value="deadline">Earliest Deadline</option>
              <option value="priority">Highest Priority</option>
              <option value="created">Recently Created</option>
              <option value="sla_risk">Highest SLA Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Task Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Task ID</th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">SLA State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600">No tasks match your current criteria</p>
                    <p className="text-xs mt-1">Try clearing filters or search keywords.</p>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const statusStyle = getStatusStyle(task.status);
                  const priorityStyle = getPriorityStyle(task.priority);
                  const sla = getTaskSlaAnalysis(task, slaConfig);
                  const overdue = isOverdue(task.dueAt, task.status);

                  return (
                    <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {task.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 line-clamp-1 max-w-[220px]">
                          {task.title}
                        </div>
                        {task.item && (
                          <div className="text-[11px] text-slate-400">
                            Item: {task.item} (Qty: {task.quantity || 1})
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {task.location}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {task.category}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {task.assignedTo?.name ? (
                          <span className="font-medium text-slate-800">
                            {task.assignedTo.name}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${priorityStyle.bg} ${priorityStyle.text}`}>
                          {priorityStyle.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`font-semibold ${overdue ? 'text-rose-600' : 'text-slate-700'}`}>
                          {formatTimeRemaining(task.dueAt, task.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sla.badgeColor}`}>
                          {sla.state}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setDetailTask(task)}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setHistoryTask(task)}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                          title="Review History Trail"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setInterveneTask(task)}
                          className="text-[11px] py-1 px-2.5 font-bold"
                        >
                          Intervene
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Details Modal */}
      {detailTask && (
        <Modal
          isOpen={Boolean(detailTask)}
          onClose={() => setDetailTask(null)}
          title={`Task Record: ${detailTask.id} — ${detailTask.title}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Location</span>
                <div className="font-bold text-slate-900 mt-0.5">{detailTask.location}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Assignee</span>
                <div className="font-bold text-slate-900 mt-0.5">{detailTask.assignedTo?.name || 'Unassigned'}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Due Deadline</span>
                <div className="font-bold text-slate-900 mt-0.5">{formatDateTime(detailTask.dueAt)}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Created At</span>
                <div className="font-bold text-slate-900 mt-0.5">{formatDateTime(detailTask.createdAt)}</div>
              </div>
            </div>

            {detailTask.instructions && (
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Work Instructions</span>
                <p className="mt-1 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 leading-relaxed">
                  {detailTask.instructions}
                </p>
              </div>
            )}

            {detailTask.internalNotes && (
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Internal & Manager Notes</span>
                <p className="mt-1 p-2.5 bg-blue-50/50 border border-blue-200 rounded-lg text-blue-900">
                  {detailTask.internalNotes}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <Button variant="secondary" onClick={() => setDetailTask(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setInterveneTask(detailTask);
                  setDetailTask(null);
                }}
              >
                Manager Intervention
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Task History Modal */}
      {historyTask && (
        <Modal
          isOpen={Boolean(historyTask)}
          onClose={() => setHistoryTask(null)}
          title={`Audit History Trail: ${historyTask.id}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-500 text-[11px]">
              Complete chronological audit trail for task <strong>{historyTask.id}</strong>.
            </p>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto bg-slate-50 p-3 rounded-xl border border-slate-200">
              {historyTask.history?.map((h) => (
                <div key={h.id} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{h.event}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {formatDateTime(h.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    {h.details}
                  </p>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Actor: {h.actor}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <Button variant="secondary" onClick={() => setHistoryTask(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Task Intervention Modal */}
      {interveneTask && (
        <TaskInterventionModal
          isOpen={Boolean(interveneTask)}
          onClose={() => setInterveneTask(null)}
          task={interveneTask}
        />
      )}
    </div>
  );
}
