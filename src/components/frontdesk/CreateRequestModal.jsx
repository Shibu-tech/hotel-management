import React, { useState } from 'react';
import {
  X,
  ClipboardList,
  AlertTriangle,
  Building2,
  Clock,
  User,
  MessageSquare,
  ShieldAlert,
  Send
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { TASK_CATEGORY, TASK_PRIORITY } from '../../utils/taskStatus';

export default function CreateRequestModal({ isOpen, onClose, defaultRoom, defaultGuest }) {
  const { createFrontDeskGuestRequest, staff, reservations } = useTasks();

  const [guestReference, setGuestReference] = useState(defaultGuest || '');
  const [roomNumber, setRoomNumber] = useState(defaultRoom || '');
  const [category, setCategory] = useState(TASK_CATEGORY.HOUSEKEEPING);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(TASK_PRIORITY.MEDIUM);
  const [assignedStaffId, setAssignedStaffId] = useState(''); // Empty string = Unassigned Queue!
  const [instructions, setInstructions] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [guestVisibleMessage, setGuestVisibleMessage] = useState('');
  const [deadlineMinutes, setDeadlineMinutes] = useState(60);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  // Filter in-house guests for convenience
  const inHouseGuests = reservations.filter((r) => r.status === 'Checked-In');

  const handleSelectInHouseGuest = (resId) => {
    const res = reservations.find((r) => r.id === resId);
    if (res) {
      setGuestReference(`${res.guestName} (${res.reference})`);
      setRoomNumber(res.assignedRoom || '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!description.trim()) {
      setFormError('Please enter a description or requested item for this request.');
      return;
    }

    const res = createFrontDeskGuestRequest({
      guestReference: guestReference || 'In-House Guest',
      roomNumber: roomNumber.trim(),
      category,
      description: description.trim(),
      priority,
      assignedToStaffId: assignedStaffId || null, // explicit null = unassigned state!
      instructions: instructions.trim() || description.trim(),
      internalNotes: internalNotes.trim(),
      guestVisibleMessage: guestVisibleMessage.trim(),
      deadlineMinutes: Number(deadlineMinutes) || 60
    });

    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#172B4D] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Guest Service Request</h3>
              <p className="text-xs text-slate-300">
                Cross-Department Task Routing • Housekeeping, Maintenance & Concierge
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="font-medium">{formError}</div>
            </div>
          )}

          {/* Quick In-House Stay Selector */}
          {inHouseGuests.length > 0 && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center gap-2">
              <span className="text-slate-600 font-semibold whitespace-nowrap">
                Quick Select Stay:
              </span>
              <select
                onChange={(e) => handleSelectInHouseGuest(e.target.value)}
                defaultValue=""
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
              >
                <option value="">-- Or enter guest name & room manually below --</option>
                {inHouseGuests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.guestName} — Room {r.assignedRoom} ({r.roomType})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Guest and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Guest Name / Reference *
              </label>
              <input
                type="text"
                placeholder="e.g. David Vance (Suite 1204)"
                value={guestReference}
                onChange={(e) => setGuestReference(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Room / Service Location *
              </label>
              <input
                type="text"
                placeholder="e.g. 1204 or Main Lobby"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                required
              />
            </div>
          </div>

          {/* Category, Priority & Department Routing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Responsible Department *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
              >
                <option value={TASK_CATEGORY.HOUSEKEEPING}>Housekeeping & Linens</option>
                <option value={TASK_CATEGORY.MAINTENANCE}>Engineering & Maintenance</option>
                <option value={TASK_CATEGORY.AMENITIES}>Amenities & Toiletries</option>
                <option value={TASK_CATEGORY.LUGGAGE_BELL}>Luggage & Bell Services</option>
                <option value={TASK_CATEGORY.ROOM_SERVICE}>Food & Beverage / In-Room Dining</option>
                <option value="Transportation">Transportation & Airport Shuttle</option>
                <option value="Front Desk">Front Desk Concierge</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Priority Level *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold"
              >
                <option value={TASK_PRIORITY.URGENT}>Urgent (SLA 30m)</option>
                <option value={TASK_PRIORITY.HIGH}>High Priority (SLA 60m)</option>
                <option value={TASK_PRIORITY.MEDIUM}>Medium (SLA 120m)</option>
                <option value={TASK_PRIORITY.LOW}>Low / Routine (SLA 240m)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target Deadline (Minutes)
              </label>
              <input
                type="number"
                min={10}
                max={480}
                value={deadlineMinutes}
                onChange={(e) => setDeadlineMinutes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
          </div>

          {/* Description & Detailed Instructions */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Request Summary / Item *
              </label>
              <input
                type="text"
                placeholder="e.g. Extra Hypoallergenic Pillows & Towel Replenishment"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fulfillment Instructions for Staff Runner
              </label>
              <textarea
                rows={2}
                placeholder="Specific instructions for attendant upon arrival at room..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
          </div>

          {/* Staff Assignment (Supports Explicit Unassigned Queue) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Staff Assignment (Optional)
              </label>
              <span className="text-[11px] text-slate-500">
                Leave empty for Unassigned Dispatcher Queue
              </span>
            </div>

            <select
              value={assignedStaffId}
              onChange={(e) => setAssignedStaffId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            >
              <option value="">
                -- Leave Unassigned (Place in Department Dispatcher Queue) --
              </option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.department} ({s.role}, {s.availability})
                </option>
              ))}
            </select>

            <p className="text-[11px] text-slate-500 italic">
              Notice: Work status and assignment status remain distinct. Unassigned requests are tracked in the actionable queue until owned.
            </p>
          </div>

          {/* Guest Visible Message vs Internal Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                Guest-Visible Message / In-App Confirmation
              </label>
              <textarea
                rows={2}
                placeholder="Message displayed to guest on portal / SMS confirmation..."
                value={guestVisibleMessage}
                onChange={(e) => setGuestVisibleMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                Internal Operations Notes (Staff Only)
              </label>
              <textarea
                rows={2}
                placeholder="Confidential internal notes visible only to hotel staff..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
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
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Dispatch Service Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
