import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Unlock,
  Clock,
  MapPin,
  User,
  PlusCircle,
  Search,
  Filter,
  FileCheck,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import {
  BLOCKER_CATEGORIES,
  BLOCKER_STATUS,
  getBlockerStatusStyle,
  formatDateTime,
  formatTimeRemaining
} from '../../utils/taskStatus';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import BlockerModal from '../../components/supervisor/BlockerModal';
import CorrectiveActionModal from '../../components/supervisor/CorrectiveActionModal';
import SupervisorEscalateModal from '../../components/supervisor/SupervisorEscalateModal';

export default function Blockers() {
  const { blockers, tasks, supervisorProfile } = useTasks();

  const [activeTab, setActiveTab] = useState('OPEN'); // 'OPEN' | 'SAFETY' | 'RESOLVED' | 'ALL'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'resolve' | 'update_action'
  const [selectedBlocker, setSelectedBlocker] = useState(null);
  const [blockerModalOpen, setBlockerModalOpen] = useState(false);
  const [correctiveModalOpen, setCorrectiveModalOpen] = useState(false);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);

  const openCount = blockers.filter((b) => b.status === BLOCKER_STATUS.OPEN || b.status === BLOCKER_STATUS.IN_PROGRESS).length;
  const safetyCount = blockers.filter((b) => b.status === BLOCKER_STATUS.PENDING_CLEARANCE || b.safetyRestricted && b.status !== BLOCKER_STATUS.RESOLVED).length;
  const resolvedCount = blockers.filter((b) => b.status === BLOCKER_STATUS.RESOLVED).length;

  const filteredBlockers = blockers.filter((b) => {
    // 1. Tab
    if (activeTab === 'OPEN') {
      if (b.status === BLOCKER_STATUS.RESOLVED) return false;
    } else if (activeTab === 'SAFETY') {
      if (!b.safetyRestricted && b.status !== BLOCKER_STATUS.PENDING_CLEARANCE) return false;
    } else if (activeTab === 'RESOLVED') {
      if (b.status !== BLOCKER_STATUS.RESOLVED) return false;
    }

    // 2. Category
    if (categoryFilter !== 'ALL' && b.category !== categoryFilter) {
      return false;
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = b.id.toLowerCase().includes(q);
      const matchTask = (b.taskId || '').toLowerCase().includes(q);
      const matchTitle = (b.taskTitle || '').toLowerCase().includes(q);
      const matchDesc = (b.description || '').toLowerCase().includes(q);
      const matchLocation = (b.location || '').toLowerCase().includes(q);
      const matchPerson = (b.responsiblePerson || '').toLowerCase().includes(q);
      if (!matchId && !matchTask && !matchTitle && !matchDesc && !matchLocation && !matchPerson) {
        return false;
      }
    }

    return true;
  });

  const handleOpenResolve = (blocker) => {
    setSelectedBlocker(blocker);
    setModalMode('resolve');
    setBlockerModalOpen(true);
  };

  const handleOpenUpdateAction = (blocker) => {
    setSelectedBlocker(blocker);
    setModalMode('update_action');
    setBlockerModalOpen(true);
  };

  const handleOpenCorrective = (blocker) => {
    setSelectedBlocker(blocker);
    setCorrectiveModalOpen(true);
  };

  const handleOpenEscalate = (blocker) => {
    setSelectedBlocker(blocker);
    setEscalateModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-100 text-red-800 uppercase tracking-wider">
              Operational Blocker Control
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Supervisor: {supervisorProfile.name}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#172033] tracking-tight mt-1">
            Blockers, Delays & Safety Lockouts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate obstacle resolution, track certified safety clearances, and prevent service disruptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => {
              setSelectedBlocker(null);
              setModalMode('create');
              setBlockerModalOpen(true);
            }}
            className="text-xs bg-red-600 hover:bg-red-700 text-white"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            Log Operational Blocker
          </Button>
        </div>
      </div>

      {/* Safety Clearance Governance Alert */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Safety Restriction Enforcement Protocol: </span>
          Supervisors are strictly prohibited from unlocking or releasing any area under hazardous or safety restriction
          without written sign-off from a certified Safety Officer or Lead Maintenance Engineer.
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('OPEN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'OPEN'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Active Blockers</span>
            {openCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-600 text-white font-bold">
                {openCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('SAFETY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'SAFETY'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Safety Restrictions</span>
            {safetyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                {safetyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('RESOLVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'RESOLVED'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resolved ({resolvedCount})
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ALL'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({blockers.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Categories</option>
            {BLOCKER_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blocker text..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Blockers Cards Grid */}
      {filteredBlockers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBlockers.map((b) => {
            const bStyle = getBlockerStatusStyle(b.status);
            const isResolved = b.status === BLOCKER_STATUS.RESOLVED;
            const isSafety = b.safetyRestricted;

            return (
              <div
                key={b.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-all shadow-sm ${
                  isSafety && !isResolved
                    ? 'border-red-300 ring-1 ring-red-200 bg-red-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Row: ID, Category & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200">
                          {b.id}
                        </span>
                        {b.taskId && (
                          <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Task: {b.taskId}
                          </span>
                        )}
                        <span className="text-xs text-slate-500 font-semibold">{b.category}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{b.taskTitle}</h3>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${bStyle.bg} ${bStyle.text} ${bStyle.border} shrink-0`}
                    >
                      {bStyle.label}
                    </span>
                  </div>

                  {/* Safety Restriction Lockout Alert Banner */}
                  {isSafety && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-950 flex items-start gap-2">
                      <Lock className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Safety Lockout Enforced: </span>
                        {b.safetyClearanceRequired ||
                          'Requires certified atmospheric / physical clearance sign-off.'}
                        {b.safetyClearanceDetails && (
                          <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                            ✓ Cleared by: {b.safetyClearanceDetails.clearedBy} (Cert #{' '}
                            {b.safetyClearanceDetails.certificationId})
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description & Impact */}
                  <div className="space-y-1.5 text-xs">
                    <p className="text-slate-800 leading-relaxed">
                      <span className="font-bold text-slate-900">Barrier Description: </span>
                      {b.description}
                    </p>
                    <p className="text-slate-600">
                      <span className="font-semibold text-slate-800">Operational Impact: </span>
                      {b.operationalImpact}
                    </p>
                  </div>

                  {/* Next Action Box */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-bold text-slate-700">Immediate Next Action:</span>
                      <span>Target: {formatDateTime(b.expectedResolutionTime)}</span>
                    </div>
                    <p className="text-slate-900 font-medium">{b.nextAction || 'Under assessment'}</p>
                  </div>

                  {/* Resolution Notes if Resolved */}
                  {isResolved && b.resolutionNotes && (
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                      <div className="flex items-center justify-between font-bold text-emerald-900">
                        <span>Resolution Logged:</span>
                        <span>{formatDateTime(b.resolvedAt)}</span>
                      </div>
                      <p>{b.resolutionNotes}</p>
                    </div>
                  )}

                  {/* Footer metadata */}
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {b.location}
                    </span>
                    <span>Responsible: <strong className="text-slate-700">{b.responsiblePerson}</strong></span>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    Reported {formatDateTime(b.reportedAt)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {!isResolved && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenUpdateAction(b)}
                          className="text-[11px] h-7 px-2"
                        >
                          Update Action
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenCorrective(b)}
                          className="text-[11px] h-7 px-2 text-purple-700"
                        >
                          <FileCheck className="w-3 h-3 mr-1 text-purple-600" />
                          Corrective Action
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEscalate(b)}
                          className="text-[11px] h-7 px-2 text-red-600 hover:bg-red-50 border-red-200"
                        >
                          Escalate
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenResolve(b)}
                          className={`text-[11px] h-7 px-3 text-white ${
                            isSafety ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                          }`}
                        >
                          {isSafety ? 'Clear & Resolve' : 'Resolve Blocker'}
                        </Button>
                      </>
                    )}

                    {isResolved && (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Resolved & Closed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No blockers found for active filter"
          description="Operational obstacles, room inaccessibility, or safety restrictions will appear here."
          actionLabel="View All Blockers"
          onAction={() => {
            setActiveTab('ALL');
            setCategoryFilter('ALL');
            setSearchQuery('');
          }}
        />
      )}

      {/* Modals */}
      <BlockerModal
        isOpen={blockerModalOpen}
        onClose={() => setBlockerModalOpen(false)}
        mode={modalMode}
        blocker={selectedBlocker}
      />

      <CorrectiveActionModal
        isOpen={correctiveModalOpen}
        onClose={() => setCorrectiveModalOpen(false)}
        mode="create"
        prefilledTaskId={selectedBlocker?.taskId}
      />

      <SupervisorEscalateModal
        isOpen={escalateModalOpen}
        onClose={() => setEscalateModalOpen(false)}
        blocker={selectedBlocker}
      />
    </div>
  );
}
