import React, { useState } from 'react';
import {
  X,
  ArrowRightLeft,
  AlertTriangle,
  Sparkles,
  Building2,
  ShieldCheck,
  Send,
  CheckCircle2
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { ROOM_STATUS, OCCUPANCY_STATUS } from '../../data/mockFrontDeskData';
import StatusBadge from './StatusBadge';

export default function RoomMoveModal({ isOpen, onClose, defaultReservation }) {
  const {
    createRoomMoveRequest,
    reservations,
    rooms,
    frontDeskProfile
  } = useTasks();

  const inHouseReservations = reservations.filter((r) => r.status === 'Checked-In');

  const [selectedResId, setSelectedResId] = useState(defaultReservation?.id || inHouseReservations[0]?.id || '');
  const [toRoom, setToRoom] = useState('');
  const [reasonCategory, setReasonCategory] = useState('HVAC / Temperature Failure');
  const [reasonDetails, setReasonDetails] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const activeRes = reservations.find((r) => r.id === selectedResId);
  const fromRoom = activeRes ? activeRes.assignedRoom : '';

  // Destination room validation
  const destRoomObj = rooms.find((r) => r.roomNumber === toRoom);
  const isDestReady = destRoomObj?.cleanliness === ROOM_STATUS.READY;
  const isDestVacant = destRoomObj?.occupancy === OCCUPANCY_STATUS.VACANT;
  const canRelocate = isDestReady && isDestVacant;

  // Available ready & vacant rooms
  const readyRooms = rooms.filter(
    (r) => r.cleanliness === ROOM_STATUS.READY && r.occupancy === OCCUPANCY_STATUS.VACANT && r.roomNumber !== fromRoom
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!selectedResId) {
      setFormError('Please select a guest stay to move.');
      return;
    }

    if (!toRoom) {
      setFormError('Please select an available destination room.');
      return;
    }

    if (!canRelocate) {
      setFormError(
        `Destination Room ${toRoom} is unavailable: Currently "${destRoomObj?.cleanliness || 'Not Ready'}". Policy blocks moves to uncleared rooms.`
      );
      return;
    }

    if (!reasonDetails.trim()) {
      setFormError('Please describe the reason for this room relocation.');
      return;
    }

    const res = createRoomMoveRequest({
      reservationId: selectedResId,
      fromRoom,
      toRoom,
      reasonCategory,
      reasonDetails: reasonDetails.trim()
    });

    if (res.success) {
      onClose();
    } else {
      setFormError(res.error || 'Failed to create room move.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#172B4D] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Coordinate Guest Room Move</h3>
              <p className="text-xs text-slate-300">
                Destination Room Readiness Check & Audit Logging
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="font-medium">{formError}</div>
            </div>
          )}

          {/* Current Stay Selection */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Select Active In-House Guest *
              </label>
              <select
                value={selectedResId}
                onChange={(e) => setSelectedResId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
              >
                {inHouseReservations.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.guestName} — Current Room: {r.assignedRoom} ({r.vipStatus})
                  </option>
                ))}
              </select>
            </div>

            {activeRes && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Current Location</span>
                  <span className="font-bold text-slate-900">Room {fromRoom}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Room Category</span>
                  <span className="font-medium text-slate-700">{activeRes.roomType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Stay Departure</span>
                  <span className="font-medium text-slate-700">{activeRes.departureDate}</span>
                </div>
              </div>
            )}
          </div>

          {/* Destination Room Selection */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target Destination Room *
              </label>
              <select
                value={toRoom}
                onChange={(e) => setToRoom(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold"
                required
              >
                <option value="">-- Select Cleared Destination Room --</option>
                {rooms
                  .filter((r) => r.roomNumber !== fromRoom)
                  .map((rm) => (
                    <option key={rm.roomNumber} value={rm.roomNumber}>
                      Room {rm.roomNumber} — {rm.type} ({rm.cleanliness}, {rm.occupancy})
                    </option>
                  ))}
              </select>
            </div>

            {/* Live Destination Readiness Check */}
            {toRoom && (
              <div className="p-3 rounded-xl border flex items-center justify-between text-xs bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">Room {toRoom}:</span>
                  <StatusBadge type="cleanliness" value={destRoomObj?.cleanliness || 'Unknown'} />
                  <StatusBadge type="occupancy" value={destRoomObj?.occupancy || 'Unknown'} />
                </div>
                {canRelocate ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Cleared for Move
                  </span>
                ) : (
                  <span className="text-rose-700 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Move Blocked
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Reason for Relocation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Relocation Reason Category *
              </label>
              <select
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              >
                <option value="HVAC / Temperature Failure">HVAC / Temperature Failure</option>
                <option value="Noise & Neighbor Disturbance">Noise & Neighbor Disturbance</option>
                <option value="Plumbing / Water Leakage">Plumbing / Water Leakage</option>
                <option value="Complimentary VIP Upgrade">Complimentary VIP Upgrade</option>
                <option value="Guest Preference / High Floor">Guest Preference / High Floor</option>
                <option value="Maintenance Emergency">Maintenance Emergency</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Detailed Justification *
              </label>
              <input
                type="text"
                placeholder="e.g. AC compressor loudly rattling; room temperature at 78F"
                value={reasonDetails}
                onChange={(e) => setReasonDetails(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 text-[11px] leading-relaxed">
            <strong>Turnover Protocol:</strong> Upon completion of the move, Room {fromRoom || 'X'} will be marked as <strong>"Dirty / Turnover Required"</strong> and an automatic turnover cleaning task will be dispatched to the Housekeeping department.
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canRelocate}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all flex items-center gap-2 ${
                canRelocate
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-slate-400 cursor-not-allowed opacity-70'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              Request Room Relocation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
