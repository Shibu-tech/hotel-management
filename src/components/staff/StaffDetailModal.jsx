import React from 'react';
import {
  User,
  Clock,
  Radio,
  Phone,
  Shield,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import TaskStatusBadge, { PriorityBadge } from '../tasks/TaskStatusBadge';
import { formatTimeRemaining, isOverdue } from '../../utils/taskStatus';

export default function StaffDetailModal({
  isOpen,
  onClose,
  staffMember,
  onViewTask,
  onReassignTask
}) {
  if (!staffMember) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Staff Workload & Schedule Overview"
      subtitle={`Operational dispatch profile for ${staffMember.name} (${staffMember.id})`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Profile Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={staffMember.avatarUrl}
              alt={staffMember.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-900">{staffMember.name}</h4>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                  {staffMember.id}
                </span>
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {staffMember.role} • <strong>{staffMember.department}</strong>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {staffMember.phoneExt}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Radio className="w-3 h-3 text-blue-500" />
                  Radio: {staffMember.radio}
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                staffMember.availability === 'Available'
                  ? 'bg-emerald-100 text-emerald-800'
                  : staffMember.availability === 'Busy'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {staffMember.availability}
            </span>
            <span className="text-[11px] text-slate-500 mt-1">{staffMember.shift}</span>
          </div>
        </div>

        {/* Workload Stats & Skill Coverage */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div className="text-xl font-extrabold text-slate-900">
              {staffMember.activeTasksCount}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Active Tasks
            </div>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div
              className={`text-xl font-extrabold ${
                staffMember.overdueTasksCount > 0 ? 'text-red-600' : 'text-slate-900'
              }`}
            >
              {staffMember.overdueTasksCount}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Overdue Tasks
            </div>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div
              className={`text-sm font-bold mt-1 ${
                staffMember.workloadStatus === 'Max'
                  ? 'text-red-600'
                  : staffMember.workloadStatus === 'Heavy'
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            >
              {staffMember.workloadStatus}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Workload Level
            </div>
          </div>
        </div>

        {/* Skill Category Eligibility */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Eligible Task Categories
          </label>
          <div className="flex flex-wrap gap-1.5">
            {staffMember.skills?.map((sk) => (
              <span
                key={sk}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Currently Assigned Tasks List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Currently Assigned Active Tasks ({staffMember.assignedTasks?.length || 0})
            </label>
          </div>

          {!staffMember.assignedTasks || staffMember.assignedTasks.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
              No tasks currently assigned to this staff member.
            </div>
          ) : (
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {staffMember.assignedTasks.map((t) => {
                const overdue = isOverdue(t.dueAt, t.status);
                return (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs hover:border-blue-400 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-bold text-slate-800">{t.id}</span>
                        <PriorityBadge priority={t.priority} size="xs" />
                        <TaskStatusBadge status={t.status} size="xs" />
                      </div>
                      <div className="font-semibold text-slate-900">{t.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{t.location}</span>
                        <span>•</span>
                        <span className={overdue ? 'text-red-600 font-bold' : ''}>
                          {formatTimeRemaining(t.dueAt, t.status)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                          onClose();
                          onViewTask(t.id);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => {
                          onClose();
                          onReassignTask(t);
                        }}
                      >
                        Reassign
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Operational Note */}
        {staffMember.notes && (
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <strong>Dispatcher Shift Note:</strong> {staffMember.notes}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-100">
          <Button variant="outline" size="md" onClick={onClose}>
            Close Panel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
