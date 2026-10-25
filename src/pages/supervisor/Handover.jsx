import React, { useState } from 'react';
import {
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  AlertTriangle,
  PlusCircle,
  Search,
  FileCheck2,
  ArrowRight,
  Info
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { HANDOVER_STATUS, formatDateTime } from '../../utils/taskStatus';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import HandoverModal from '../../components/supervisor/HandoverModal';

export default function Handover() {
  const { handovers, supervisorProfile } = useTasks();

  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING' | 'ACKNOWLEDGED' | 'ALL'
  const [searchQuery, setSearchQuery] = useState('');
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'acknowledge'
  const [selectedHandover, setSelectedHandover] = useState(null);
  const [handoverModalOpen, setHandoverModalOpen] = useState(false);

  const pendingCount = handovers.filter((h) => h.status === HANDOVER_STATUS.PENDING_ACK).length;
  const ackCount = handovers.filter((h) => h.status === HANDOVER_STATUS.ACKNOWLEDGED).length;

  const filteredHandovers = handovers.filter((h) => {
    if (activeTab === 'PENDING' && h.status !== HANDOVER_STATUS.PENDING_ACK) return false;
    if (activeTab === 'ACKNOWLEDGED' && h.status !== HANDOVER_STATUS.ACKNOWLEDGED) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = h.id.toLowerCase().includes(q);
      const matchTitle = (h.taskTitle || '').toLowerCase().includes(q);
      const matchOwner = (h.nextOwner || '').toLowerCase().includes(q);
      const matchActions = (h.outstandingActions || '').toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchOwner && !matchActions) return false;
    }

    return true;
  });

  const handleOpenAck = (h) => {
    setSelectedHandover(h);
    setModalMode('acknowledge');
    setHandoverModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
              Shift Operational Continuity
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Supervisor: {supervisorProfile.name}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#172033] tracking-tight mt-1">
            Shift Handovers & Operational Crossovers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Formal crossover documentation for in-flight tasks, pending repairs, and incoming supervisor responsibilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => {
              setSelectedHandover(null);
              setModalMode('create');
              setHandoverModalOpen(true);
            }}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            Create Handover Brief
          </Button>
        </div>
      </div>

      {/* Continuity rule notice */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Handover Governance: </strong>
          Creating a shift handover passes formal custody of unresolved work to the incoming supervisor. Handing over
          a task does not complete, cancel, or alter the underlying task’s progress status.
        </p>
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
            <span>Awaiting Acknowledgement</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ACKNOWLEDGED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ACKNOWLEDGED'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Acknowledged ({ackCount})
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ALL'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Briefings ({handovers.length})
          </button>
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search handovers..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Handover Cards Grid */}
      {filteredHandovers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHandovers.map((h) => {
            const isPending = h.status === HANDOVER_STATUS.PENDING_ACK;

            return (
              <div
                key={h.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between gap-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {h.id}
                        </span>
                        {h.taskId && (
                          <span className="font-mono text-xs font-semibold text-slate-600">
                            Task: {h.taskId}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{h.taskTitle}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{h.location}</p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${
                        isPending
                          ? 'bg-amber-100 text-amber-800 border-amber-200 animate-pulse'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {h.status}
                    </span>
                  </div>

                  {/* Owner Crossover Diagram */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        Current Supervisor
                      </p>
                      <p className="font-bold text-slate-800">{h.currentOwner}</p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400" />

                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        Incoming Owner
                      </p>
                      <p className="font-bold text-blue-700">{h.nextOwner}</p>
                      <span className="text-[10px] text-slate-500 font-medium">({h.nextOwnerRole})</span>
                    </div>
                  </div>

                  {/* Work Completed */}
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-slate-700">Work Already Completed:</span>
                    <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {h.workCompleted}
                    </p>
                  </div>

                  {/* Outstanding Actions */}
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-blue-900">Mandatory Next Actions:</span>
                    <p className="text-blue-950 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
                      {h.outstandingActions}
                    </p>
                  </div>

                  {/* Risks or Watchpoints */}
                  {h.risks && (
                    <div className="text-xs text-amber-900 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200">
                      <span className="font-bold">Operational Watchpoints: </span>
                      {h.risks}
                    </div>
                  )}

                  {/* Acknowledgement Statement if present */}
                  {h.acknowledgedAt && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Acknowledged by {h.acknowledgedBy} at {formatDateTime(h.acknowledgedAt)}</span>
                      </div>
                      {h.acknowledgementNotes && (
                        <p className="text-[11px] text-emerald-800 mt-0.5">"{h.acknowledgementNotes}"</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer and Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Target SLA: {formatDateTime(h.targetCompletionTime)}</span>

                  {isPending && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenAck(h)}
                      className="text-xs h-7 px-3 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Acknowledge Briefing
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No shift handover records found"
          description="Create a handover brief to ensure seamless crossover of outstanding tasks across shifts."
          actionLabel="Create Handover"
          onAction={() => {
            setSelectedHandover(null);
            setModalMode('create');
            setHandoverModalOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <HandoverModal
        isOpen={handoverModalOpen}
        onClose={() => setHandoverModalOpen(false)}
        mode={modalMode}
        handover={selectedHandover}
      />
    </div>
  );
}
