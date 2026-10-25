import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Plus,
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building2,
  Clock,
  ShieldCheck,
  Brush,
  ArrowRight
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import RoomMoveModal from '../../components/frontdesk/RoomMoveModal';

export default function RoomMoves() {
  const {
    roomMoves,
    completeRoomMove,
    cancelRoomMove,
    rooms,
    frontDeskProfile
  } = useTasks();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredMoves = roomMoves.filter((m) => {
    const matchesSearch =
      !searchQuery.trim() ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.fromRoom.includes(searchQuery) ||
      m.toRoom.includes(searchQuery);

    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ArrowRightLeft className="w-5 h-5 text-purple-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Guest Room Relocations & Moves
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
              {filteredMoves.length} Requests
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Coordinate guest room transfers with real-time destination room cleanliness checks and automated vacated turnover dispatch.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Request Room Move
        </button>
      </div>

      {/* Safety Policy Notice */}
      <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-900 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold">Strict Relocation Clearance Rules:</strong>
          <p className="text-purple-800 leading-relaxed">
            1. Transfers can only target rooms verified as <strong>"Ready / Clean & Inspected"</strong>. Moves to dirty or maintenance-locked rooms are blocked.
          </p>
          <p className="text-purple-800 leading-relaxed">
            2. When a move is completed, the original room is automatically marked <strong>"Dirty / Turnover Required"</strong> and an automated turnover task is dispatched to Housekeeping.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search moves by ID (RMV-201), guest name, or room number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-medium"
            >
              <option value="ALL">All Move Statuses</option>
              <option value="Requested">Requested</option>
              <option value="Approved">Approved</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Moves List */}
      <div className="space-y-4">
        {filteredMoves.length > 0 ? (
          filteredMoves.map((m) => {
            const destRoomObj = rooms.find((r) => r.roomNumber === m.toRoom);
            const isCompleted = m.status === 'Completed';
            const isCancelled = m.status === 'Cancelled';

            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-sm transition-all space-y-4"
              >
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-black text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                        {m.id}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{m.guestName}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                        {m.vipStatus}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isCancelled
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-purple-100 text-purple-800 animate-pulse'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500">
                      Initiated by: <strong>{m.initiatedBy?.name || 'Front Desk'}</strong> • {new Date(m.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Room Transfer Visualizer */}
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">From</span>
                      <span className="text-sm font-black text-slate-800">Room {m.fromRoom}</span>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[90px]">{m.fromRoomType}</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-purple-600 flex-shrink-0" />

                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Destination</span>
                      <span className="text-sm font-black text-purple-700">Room {m.toRoom}</span>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[90px]">{m.toRoomType}</span>
                    </div>
                  </div>
                </div>

                {/* Reason & Clearance Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 block">
                      Relocation Reason: {m.reasonCategory}
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      "{m.reasonDetails || m.notes}"
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Destination Cleanliness & Clearance Verification:
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      Destination Room {m.toRoom} verified as{' '}
                      <strong>{destRoomObj?.cleanliness || 'Clean & Inspected'}</strong>.
                    </p>
                    {m.approvedBy && (
                      <div className="text-[11px] text-purple-700 font-semibold pt-1">
                        Approved by: {m.approvedBy.name} ({m.approvedBy.role})
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {!isCompleted && !isCancelled && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => cancelRoomMove(m.id, 'Cancelled by guest request or issue resolved')}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                    >
                      Cancel Move
                    </button>
                    <button
                      onClick={() => completeRoomMove(m.id)}
                      className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confirm Relocation & Dispatch Turnover
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs text-slate-500">
            <ArrowRightLeft className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            No room relocation requests found matching filters.
          </div>
        )}
      </div>

      <RoomMoveModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
