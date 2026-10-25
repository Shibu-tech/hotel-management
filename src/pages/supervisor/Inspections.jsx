import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  RotateCcw,
  AlertTriangle,
  FileCheck,
  Camera,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  Search,
  Eye
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import {
  INSPECTION_STATUS,
  getInspectionStatusStyle,
  formatDateTime,
  formatTimeRemaining
} from '../../utils/taskStatus';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import InspectionModal from '../../components/supervisor/InspectionModal';
import TaskDetailModal from '../../components/supervisor/TaskDetailModal';
import SupervisorEscalateModal from '../../components/supervisor/SupervisorEscalateModal';

export default function Inspections() {
  const { tasks, supervisorProfile } = useTasks();

  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING' | 'PASSED' | 'REOPENED' | 'ALL'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);

  // Filter tasks that require inspection or have an inspection history
  const inspectionTasks = tasks.filter((t) => t.inspectionRequired || t.inspectionStatus !== INSPECTION_STATUS.NOT_REQUIRED);

  const filteredTasks = inspectionTasks.filter((t) => {
    // 1. Tab filter
    if (activeTab === 'PENDING' && t.inspectionStatus !== INSPECTION_STATUS.PENDING) {
      return false;
    }
    if (activeTab === 'PASSED' && t.inspectionStatus !== INSPECTION_STATUS.PASSED) {
      return false;
    }
    if (
      activeTab === 'REOPENED' &&
      t.inspectionStatus !== INSPECTION_STATUS.REOPENED &&
      t.inspectionStatus !== INSPECTION_STATUS.CORRECTION_REQUESTED
    ) {
      return false;
    }

    // 2. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = t.id.toLowerCase().includes(q);
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchLocation = t.location.toLowerCase().includes(q);
      const matchStaff = (t.assignedTo?.name || '').toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchLocation && !matchStaff) return false;
    }

    return true;
  });

  const pendingCount = inspectionTasks.filter((t) => t.inspectionStatus === INSPECTION_STATUS.PENDING).length;
  const passedCount = inspectionTasks.filter((t) => t.inspectionStatus === INSPECTION_STATUS.PASSED).length;
  const reopenedCount = inspectionTasks.filter(
    (t) =>
      t.inspectionStatus === INSPECTION_STATUS.REOPENED ||
      t.inspectionStatus === INSPECTION_STATUS.CORRECTION_REQUESTED
  ).length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-100 text-purple-800 uppercase tracking-wider">
              Quality Assurance & Verification
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Supervisor: {supervisorProfile.name}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#172033] tracking-tight mt-1">
            Department Inspections & Sign-Offs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Mandatory supervisor sign-offs for VIP turnovers, deep sanitization, and maintenance repairs before key release.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <div className="text-center px-2">
            <span className="text-lg font-bold text-amber-600">{pendingCount}</span>
            <p className="text-[10px] text-slate-500 font-medium">Pending Review</p>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-center px-2">
            <span className="text-lg font-bold text-emerald-600">{passedCount}</span>
            <p className="text-[10px] text-slate-500 font-medium">Passed</p>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-center px-2">
            <span className="text-lg font-bold text-rose-600">{reopenedCount}</span>
            <p className="text-[10px] text-slate-500 font-medium">Reopened</p>
          </div>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'PENDING'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pending Review</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('PASSED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'PASSED'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Passed ({passedCount})
          </button>

          <button
            onClick={() => setActiveTab('REOPENED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'REOPENED'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reopened / Corrections ({reopenedCount})
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ALL'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Inspected ({inspectionTasks.length})
          </button>
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inspections..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Cards List */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const inspStyle = getInspectionStatusStyle(task.inspectionStatus);
            const isPending = task.inspectionStatus === INSPECTION_STATUS.PENDING;

            return (
              <div
                key={task.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between gap-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {task.id}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">{task.category}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{task.title}</h3>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${inspStyle.bg} ${inspStyle.text} ${inspStyle.border} shrink-0`}
                    >
                      {inspStyle.badge}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium">{task.location}</span>
                    </div>
                    <span>•</span>
                    <div>
                      Completed by: <strong className="text-slate-800">{task.assignedTo?.name || 'Staff'}</strong>
                    </div>
                  </div>

                  {/* Completion Notes */}
                  {task.completionNotes && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <span className="font-bold text-slate-900">Completion Statement: </span>
                      <span>"{task.completionNotes}"</span>
                    </div>
                  )}

                  {/* Evidence indicator */}
                  {task.completionEvidence && task.completionEvidence.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold">
                        {task.completionEvidence.length} verification items & photos attached
                      </span>
                    </div>
                  )}

                  {/* Quality Checklist Criteria Preview */}
                  {task.inspectionCriteria && task.inspectionCriteria.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Inspection Checklist ({task.inspectionCriteria.length} items)
                      </p>
                      <ul className="text-xs text-slate-600 space-y-1">
                        {task.inspectionCriteria.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span className="truncate">{item}</span>
                          </li>
                        ))}
                        {task.inspectionCriteria.length > 3 && (
                          <li className="text-[11px] text-blue-600 font-semibold">
                            +{task.inspectionCriteria.length - 3} more criteria
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Updated {formatDateTime(task.completedAt || task.updatedAt)}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task);
                        setDetailModalOpen(true);
                      }}
                      className="text-xs h-8"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      Details
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task);
                        setInspectModalOpen(true);
                      }}
                      className={`text-xs h-8 text-white ${
                        isPending
                          ? 'bg-emerald-600 hover:bg-emerald-700 animate-pulse'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      <ClipboardCheck className="w-3.5 h-3.5 mr-1" />
                      {isPending ? 'Conduct Inspection' : 'Review History'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No inspection records found"
          description="Tasks requiring supervisor quality sign-off will populate here once marked completed by attendants."
          actionLabel="View All Tasks"
          onAction={() => setActiveTab('ALL')}
        />
      )}

      {/* Modals */}
      <InspectionModal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        task={selectedTask}
        onEscalate={(t) => {
          setSelectedTask(t);
          setEscalateModalOpen(true);
        }}
      />

      <TaskDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        task={selectedTask}
        onInspect={(t) => {
          setSelectedTask(t);
          setInspectModalOpen(true);
        }}
      />

      <SupervisorEscalateModal
        isOpen={escalateModalOpen}
        onClose={() => setEscalateModalOpen(false)}
        task={selectedTask}
      />
    </div>
  );
}
