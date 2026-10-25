import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  MapPin,
  UserCheck,
  UserX,
  FileEdit,
  ShieldAlert,
  MessageSquare,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Package,
  Shield,
  Phone,
  Info
} from 'lucide-react';
import TaskStatusBadge, { PriorityBadge } from '../../components/tasks/TaskStatusBadge';
import TaskHistory from '../../components/tasks/TaskHistory';
import Button from '../../components/ui/Button';

import TaskAssignmentModal from '../../components/tasks/TaskAssignmentModal';
import TaskEditModal from '../../components/tasks/TaskEditModal';
import DelayModal from '../../components/tasks/DelayModal';
import EscalateModal from '../../components/tasks/EscalateModal';
import GuestCommunicationModal from '../../components/tasks/GuestCommunicationModal';

import {
  formatTimeRemaining,
  formatDateTime,
  isOverdue,
  isDueSoon
} from '../../utils/taskStatus';
import { useTasks } from '../../context/TaskContext';

export default function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks, staff, unassignTask } = useTasks();

  const task = tasks.find((t) => t.id === taskId);

  // Modals state
  const [isAssigning, setIsAssigning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelaying, setIsDelaying] = useState(false);
  const [isEscalating, setIsEscalating] = useState(false);
  const [isGuestComm, setIsGuestComm] = useState(false);

  if (!task) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center bg-white rounded-xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">Task Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">
          Task "{taskId}" does not exist in the active queue or has been archived.
        </p>
        <Button variant="primary" size="md" onClick={() => navigate('/dispatcher/tasks')}>
          Return to Task Queue
        </Button>
      </div>
    );
  }

  const overdue = isOverdue(task.dueAt, task.status);
  const dueSoon = isDueSoon(task.dueAt, task.status);
  const assignedStaff = task.assignedTo
    ? staff.find((s) => s.id === task.assignedTo.id)
    : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in-50 duration-150">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/dispatcher/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Task Queue</span>
        </Link>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={FileEdit}
            onClick={() => setIsEditing(true)}
          >
            Edit Task
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={UserCheck}
            onClick={() => setIsAssigning(true)}
          >
            {task.assignedTo ? 'Change Assignment' : 'Assign Staff'}
          </Button>

          <Button
            variant="warning"
            size="sm"
            icon={Clock}
            onClick={() => setIsDelaying(true)}
          >
            Record Delay
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={MessageSquare}
            onClick={() => setIsGuestComm(true)}
          >
            Guest Update
          </Button>

          <Button
            variant="danger"
            size="sm"
            icon={ShieldAlert}
            onClick={() => setIsEscalating(true)}
          >
            Escalate
          </Button>
        </div>
      </div>

      {/* Main Task Header Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-subtle space-y-4">
        {/* Status + ID + Priority strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 shadow-2xs">
              {task.id}
            </span>
            <PriorityBadge priority={task.priority} size="md" />
            <TaskStatusBadge status={task.status} size="md" />
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                overdue
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : dueSoon
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimeRemaining(task.dueAt, task.status)}</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {task.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1.5">
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {task.location}
            </span>
            <span>•</span>
            <span>Department: <strong className="text-slate-700">{task.category}</strong></span>
            <span>•</span>
            <span>Created: {formatDateTime(task.createdAt)}</span>
          </div>
        </div>

        {/* Item and Quantity if specified */}
        {task.item && (
          <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200/80 flex items-center gap-2.5 text-xs text-blue-900">
            <Package className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Dispatched Item:</strong> {task.quantity ? `${task.quantity}x ` : ''}
              {task.item}
            </span>
          </div>
        )}

        {/* Work Instructions */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Operational Work Instructions
          </h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
            {task.instructions}
          </div>
        </div>

        {/* Internal Dispatcher Notes */}
        {task.internalNotes && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Internal Dispatcher Operational Notes
            </h3>
            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900">
              {task.internalNotes}
            </div>
          </div>
        )}
      </div>

      {/* Grid: Staff Assignment & Delay/Escalation Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assignee Card */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assigned Staff Member
            </h3>
            {task.assignedTo && (
              <button
                type="button"
                onClick={() => unassignTask(task.id)}
                className="text-xs text-red-600 hover:text-red-800 font-semibold"
              >
                Clear Assignment
              </button>
            )}
          </div>

          {task.assignedTo ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={
                    assignedStaff?.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
                  }
                  alt={task.assignedTo.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{task.assignedTo.name}</h4>
                  <div className="text-xs text-slate-500">{assignedStaff?.role || 'Runner'}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Shift: {task.assignedTo.shift || assignedStaff?.shift} • Radio: {assignedStaff?.radio || 'CH-04'}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="xs"
                onClick={() => setIsAssigning(true)}
              >
                Reassign
              </Button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center space-y-2">
              <span className="text-xs font-bold text-amber-800 block">
                ⚠️ This task is currently unassigned
              </span>
              <p className="text-[11px] text-amber-700">
                Staff have not been dispatched to fulfill this room service request.
              </p>
              <Button
                variant="primary"
                size="sm"
                icon={UserCheck}
                onClick={() => setIsAssigning(true)}
              >
                Assign Eligible Staff
              </Button>
            </div>
          )}
        </div>

        {/* Deadlines & SLA Details */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            Target SLA & Timestamps
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">Target Deadline</span>
              <span className="font-bold text-slate-900 block mt-0.5">{formatDateTime(task.dueAt)}</span>
              <span className={`text-[10px] font-bold ${overdue ? 'text-red-600' : 'text-slate-600'}`}>
                {formatTimeRemaining(task.dueAt, task.status)}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">Scheduled Start</span>
              <span className="font-bold text-slate-900 block mt-0.5">
                {task.scheduledStart ? formatDateTime(task.scheduledStart) : 'Immediate Dispatch'}
              </span>
              <span className="text-[10px] text-slate-400">Created: {formatDateTime(task.createdAt)}</span>
            </div>
          </div>

          {/* Active Delay Notice */}
          {task.delayInfo && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Active Delay Logged: {task.delayInfo.reason}</span>
              </div>
              <p className="text-[11px]">{task.delayInfo.notes}</p>
              <div className="text-[10px] text-amber-700 pt-0.5">
                Revised SLA: {formatDateTime(task.delayInfo.revisedExpectedAt)} • Next action: {task.delayInfo.nextAction}
              </div>
            </div>
          )}

          {/* Active Escalation Notice */}
          {task.escalationInfo && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                <span>Formally Escalated: {task.escalationInfo.escalatedTo}</span>
              </div>
              <p className="text-[11px]">{task.escalationInfo.reason}</p>
              <div className="text-[10px] text-red-700 pt-0.5">
                Escalation Status: <strong className="uppercase">{task.escalationInfo.status}</strong> • By: {task.escalationInfo.escalatedBy}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Guest Communication Log Section */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Authorized Guest Communication History ({task.guestCommunicationHistory?.length || 0})
            </h3>
          </div>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setIsGuestComm(true)}
          >
            + Log New Communication
          </Button>
        </div>

        {!task.guestCommunicationHistory || task.guestCommunicationHistory.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
            No guest communications recorded yet for this task.
          </div>
        ) : (
          <div className="space-y-2">
            {task.guestCommunicationHistory.map((gc) => (
              <div
                key={gc.id}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-start justify-between gap-3"
              >
                <div>
                  <div className="font-semibold text-slate-800">{gc.summary}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Logged by: {gc.actor}</div>
                </div>
                <span className="font-mono text-[10px] text-slate-400 shrink-0">
                  {formatDateTime(gc.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Audit Activity Timeline */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-4">
        <div className="border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Task Audit Trail & Event Timeline
          </h3>
          <p className="text-[11px] text-slate-500">
            Immutable operational records for compliance, reassignments, and SLA performance
          </p>
        </div>

        <TaskHistory history={task.history} />
      </div>

      {/* Modals */}
      {isAssigning && (
        <TaskAssignmentModal
          isOpen={isAssigning}
          onClose={() => setIsAssigning(false)}
          task={task}
        />
      )}

      {isEditing && (
        <TaskEditModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          task={task}
        />
      )}

      {isDelaying && (
        <DelayModal
          isOpen={isDelaying}
          onClose={() => setIsDelaying(false)}
          task={task}
          onSwitchToEscalate={() => {
            setIsDelaying(false);
            setIsEscalating(true);
          }}
        />
      )}

      {isEscalating && (
        <EscalateModal
          isOpen={isEscalating}
          onClose={() => setIsEscalating(false)}
          task={task}
        />
      )}

      {isGuestComm && (
        <GuestCommunicationModal
          isOpen={isGuestComm}
          onClose={() => setIsGuestComm(false)}
          task={task}
        />
      )}
    </div>
  );
}
