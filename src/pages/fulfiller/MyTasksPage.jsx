import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  Clock,
  MapPin,
  Play,
  Truck,
  CheckCircle2,
  AlertOctagon,
  MessageSquare,
  Search,
  Package,
  Eye,
  X,
  FileText
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

export default function MyTasksPage() {
  const {
    tasks,
    currentUser,
    fulfillerProfile,
    fulfillTaskAction,
    showToast
  } = useTasks();

  const activeStaff = currentUser || fulfillerProfile || FULFILLER_PROFILE;
  const staffId = activeStaff.id || 'EMP-418';

  const [activeTab, setActiveTab] = useState('ALL_ACTIVE'); // 'ALL_ACTIVE' | 'NEW' | 'IN_PROGRESS' | 'BLOCKED'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedTask, setSelectedTask] = useState(null);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  const [confirmationNote, setConfirmationNote] = useState('');
  const [recipientType, setRecipientType] = useState('Guest in Room');
  const [deliveredItems, setDeliveredItems] = useState('');

  const [blockReason, setBlockReason] = useState('Room inaccessible / DND active');
  const [blockCategory, setBlockCategory] = useState('Access');
  const [blockSeverity, setBlockSeverity] = useState('High');
  const [blockNotes, setBlockNotes] = useState('');

  const [progressNote, setProgressNote] = useState('');

  // Active tasks assigned to this staff member (not completed)
  const myActiveTasks = useMemo(() => {
    return tasks.filter(
      (t) => t.assignedTo && t.assignedTo.id === staffId && t.status !== TASK_STATUS.COMPLETED
    );
  }, [tasks, staffId]);

  const filteredTasks = useMemo(() => {
    return myActiveTasks.filter((t) => {
      if (activeTab === 'NEW' && t.status !== TASK_STATUS.NEW) return false;
      if (
        activeTab === 'IN_PROGRESS' &&
        t.status !== TASK_STATUS.IN_PROGRESS &&
        t.status !== 'On the Way'
      )
        return false;
      if (activeTab === 'BLOCKED' && t.status !== TASK_STATUS.BLOCKED) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||
          (t.title || '').toLowerCase().includes(q) ||
          (t.location || '').toLowerCase().includes(q) ||
          (t.item || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [myActiveTasks, activeTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-teal-600" />
            <span>My Active Task Roster</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time execution queue for {activeStaff.name} ({staffId}) • Radio CH-04
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('ALL_ACTIVE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'ALL_ACTIVE'
              ? 'bg-[#172B4D] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Active ({myActiveTasks.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('NEW')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'NEW'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          New ({myActiveTasks.filter((t) => t.status === TASK_STATUS.NEW).length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('IN_PROGRESS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'IN_PROGRESS'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          In Progress ({myActiveTasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS || t.status === 'On the Way').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('BLOCKED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'BLOCKED'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Blocked ({myActiveTasks.filter((t) => t.status === TASK_STATUS.BLOCKED).length})
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No active tasks in this queue</h3>
            <p className="text-xs text-slate-500 mt-1">
              You're caught up! Check the dashboard claimable pool or await assignments.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const overdue = isOverdue(task.dueAt, task.status);

            return (
              <div
                key={task.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {task.id}
                    </span>
                    <PriorityBadge priority={task.priority} size="xs" />
                    <TaskStatusBadge status={task.status} size="xs" />
                    <span className="text-xs text-slate-500 font-medium">{task.category}</span>
                  </div>

                  <span
                    className={`text-xs font-semibold flex items-center gap-1 ${
                      overdue ? 'text-red-600' : 'text-slate-500'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTimeRemaining(task.dueAt, task.status)}</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900">{task.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold mt-1">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <span>{task.location}</span>
                  </div>
                </div>

                {task.item && (
                  <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-teal-600" />
                    <span>
                      {task.quantity ? `${task.quantity}x ` : ''}
                      {task.item}
                    </span>
                  </div>
                )}

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <strong>Instructions: </strong> {task.instructions}
                </div>

                {/* Workflow Controls */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Permitted Action:
                  </span>

                  <div className="flex items-center gap-2 flex-wrap">
                    {task.status === TASK_STATUS.NEW && (
                      <Button
                        variant="primary"
                        size="xs"
                        icon={Play}
                        onClick={() => fulfillTaskAction(task.id, 'start')}
                      >
                        Accept & Start
                      </Button>
                    )}

                    {task.status === TASK_STATUS.IN_PROGRESS && (
                      <Button
                        variant="outline"
                        size="xs"
                        icon={Truck}
                        onClick={() => fulfillTaskAction(task.id, 'on_the_way')}
                      >
                        Mark On the Way
                      </Button>
                    )}

                    {(task.status === TASK_STATUS.IN_PROGRESS || task.status === 'On the Way') && (
                      <Button
                        variant="success"
                        size="xs"
                        icon={CheckCircle2}
                        onClick={() => {
                          setSelectedTask(task);
                          setDeliveredItems(task.item || '');
                          setConfirmationNote('');
                          setRecipientType('Guest in Room');
                          setCompleteModalOpen(true);
                        }}
                      >
                        Confirm Delivery / Done
                      </Button>
                    )}

                    {task.status !== TASK_STATUS.BLOCKED && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTask(task);
                          setBlockReason('Room inaccessible / DND active');
                          setBlockCategory('Access');
                          setBlockSeverity('High');
                          setBlockNotes('');
                          setBlockModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded text-red-700 bg-red-50 hover:bg-red-100 border border-red-200"
                      >
                        Report Blocker
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTask(task);
                        setProgressNote('');
                        setNoteModalOpen(true);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold rounded text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                    >
                      Note
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Complete Modal */}
      {completeModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-200 bg-emerald-50 flex items-center justify-between">
              <h3 className="font-bold text-sm text-emerald-950">Confirm Delivery</h3>
              <button onClick={() => setCompleteModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Handover Method</label>
                <select
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="Guest in Room">Guest in Room</option>
                  <option value="Front Desk Handover">Front Desk Handover</option>
                  <option value="Placed Inside Room">Placed Inside Room</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Delivered Items</label>
                <input
                  type="text"
                  value={deliveredItems}
                  onChange={(e) => setDeliveredItems(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Confirmation Note</label>
                <textarea
                  rows={2}
                  value={confirmationNote}
                  onChange={(e) => setConfirmationNote(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="xs" onClick={() => setCompleteModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="success"
                  size="xs"
                  onClick={() => {
                    fulfillTaskAction(selectedTask.id, 'complete', {
                      recipientType,
                      confirmationNote,
                      deliveredItems
                    });
                    setCompleteModalOpen(false);
                  }}
                >
                  Submit Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blocker Modal */}
      {blockModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-200 bg-red-50 flex items-center justify-between">
              <h3 className="font-bold text-sm text-red-950">Report Blocker</h3>
              <button onClick={() => setBlockModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Blocker Reason</label>
                <select
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="Room inaccessible / DND active">Room inaccessible / DND active</option>
                  <option value="Required item / linen stockout">Required item / linen stockout</option>
                  <option value="Keycard failure / lock malfunction">Keycard failure / lock malfunction</option>
                  <option value="Guest requested revised service time">Guest requested revised service time</option>
                  <option value="Other operational delay">Other operational delay</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Explanation</label>
                <textarea
                  rows={3}
                  value={blockNotes}
                  onChange={(e) => setBlockNotes(e.target.value)}
                  required
                  placeholder="Details of impediment..."
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="xs" onClick={() => setBlockModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="xs"
                  onClick={() => {
                    if (!blockNotes.trim()) {
                      showToast('Explanation is required.', 'error');
                      return;
                    }
                    fulfillTaskAction(selectedTask.id, 'block', {
                      reason: blockReason,
                      category: blockCategory,
                      notes: blockNotes,
                      severity: blockSeverity
                    });
                    setBlockModalOpen(false);
                  }}
                >
                  Confirm Blocker
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {noteModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Add Note</h3>
              <button onClick={() => setNoteModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <textarea
                rows={3}
                value={progressNote}
                onChange={(e) => setProgressNote(e.target.value)}
                placeholder="Enter note..."
                className="w-full p-2 border rounded-lg"
              />
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="xs" onClick={() => setNoteModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="xs"
                  onClick={() => {
                    fulfillTaskAction(selectedTask.id, 'add_note', { note: progressNote });
                    setNoteModalOpen(false);
                  }}
                >
                  Save Note
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
