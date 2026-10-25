import React, { useState } from 'react';
import {
  X,
  AlarmClock,
  Clock,
  Calendar,
  AlertTriangle,
  Building2,
  CheckCircle2,
  BellRing
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function WakeUpCallModal({ isOpen, onClose, defaultReservation }) {
  const { scheduleWakeUpCall, reservations } = useTasks();

  const todayStr = new Date().toISOString().split('T')[0];
  const inHouseGuests = reservations.filter((r) => r.status === 'Checked-In');

  const [selectedResId, setSelectedResId] = useState(defaultReservation?.id || inHouseGuests[0]?.id || '');
  const [guestName, setGuestName] = useState(defaultReservation?.guestName || '');
  const [roomNumber, setRoomNumber] = useState(defaultReservation?.assignedRoom || '');
  const [scheduledDate, setScheduledDate] = useState(todayStr);
  const [scheduledTime, setScheduledTime] = useState('07:00');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleSelectGuest = (resId) => {
    setSelectedResId(resId);
    const found = reservations.find((r) => r.id === resId);
    if (found) {
      setGuestName(found.guestName);
      setRoomNumber(found.assignedRoom || '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!guestName.trim()) {
      setFormError('Guest name is required.');
      return;
    }

    if (!roomNumber.trim()) {
      setFormError('Room number is required.');
      return;
    }

    if (!scheduledTime) {
      setFormError('Please select a scheduled wake-up time.');
      return;
    }

    const res = scheduleWakeUpCall({
      reservationId: selectedResId || null,
      guestName: guestName.trim(),
      roomNumber: roomNumber.trim(),
      scheduledDate,
      scheduledTime,
      specialInstructions: specialInstructions.trim()
    });

    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#172B4D] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <AlarmClock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Schedule Wake-Up Call</h3>
              <p className="text-xs text-slate-300">
                Front Desk Automated Concierge Dispatch
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="font-medium">{formError}</div>
            </div>
          )}

          {/* Quick Select */}
          {inHouseGuests.length > 0 && (
            <div className="text-xs">
              <label className="block font-semibold text-slate-700 mb-1">
                Select In-House Stay
              </label>
              <select
                value={selectedResId}
                onChange={(e) => handleSelectGuest(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              >
                <option value="">-- Or enter manually below --</option>
                {inHouseGuests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.guestName} — Room {r.assignedRoom}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Guest Name *</label>
              <input
                type="text"
                placeholder="e.g. Sophia Chen"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Room Number *</label>
              <input
                type="text"
                placeholder="e.g. 412"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Scheduled Date *</label>
              <input
                type="date"
                min={todayStr}
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Wake-Up Time (24h) *</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold font-mono"
                required
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">
              Operator Instructions & Special Requests
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Flight departure at 09:30; confirm airport shuttle pickup, call back in 10 mins if unanswered"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

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
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <BellRing className="w-4 h-4" />
              Schedule Wake-Up Call
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
