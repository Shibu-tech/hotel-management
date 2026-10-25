import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Send,
  AlertTriangle,
  Smartphone,
  Mail,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function SendCommunicationModal({ isOpen, onClose, defaultReservation }) {
  const { sendGuestMessage, reservations } = useTasks();

  const inHouseGuests = reservations.filter((r) => r.status === 'Checked-In' || r.status === 'Confirmed');

  const [selectedResId, setSelectedResId] = useState(defaultReservation?.id || inHouseGuests[0]?.id || '');
  const [guestName, setGuestName] = useState(defaultReservation?.guestName || '');
  const [roomNumber, setRoomNumber] = useState(defaultReservation?.assignedRoom || '');
  const [channel, setChannel] = useState('SMS');
  const [category, setCategory] = useState('Room Ready Notification');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleSelectGuest = (resId) => {
    setSelectedResId(resId);
    const found = reservations.find((r) => r.id === resId);
    if (found) {
      setGuestName(found.guestName);
      setRoomNumber(found.assignedRoom || 'Unassigned');
    }
  };

  const handleApplyTemplate = (tmplKey) => {
    switch (tmplKey) {
      case 'ready':
        setCategory('Room Ready Notification');
        setMessage(
          `Hello ${guestName || 'Guest'}! Your room at StayOps Hotel is now clean, inspected, and ready for check-in. We look forward to welcoming you!`
        );
        break;
      case 'request':
        setCategory('Service Request Update');
        setMessage(
          `Dear ${guestName || 'Guest'}, your requested items have been dispatched and our staff attendant is on the way to Room ${roomNumber || ''}.`
        );
        break;
      case 'apology':
        setCategory('Complaint Apology & Recovery');
        setMessage(
          `Dear ${guestName || 'Guest'}, we sincerely apologize for the service disruption. Front Desk operations has recorded your feedback and our team is actively addressing it.`
        );
        break;
      case 'checkout':
        setCategory('Departure Information');
        setMessage(
          `Good morning ${guestName || 'Guest'}! Standard check-out time is 11:00 AM. If you require luggage storage or transportation, please dial extension 0.`
        );
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!guestName.trim()) {
      setFormError('Guest name is required.');
      return;
    }

    if (!message.trim()) {
      setFormError('Message text cannot be empty.');
      return;
    }

    const res = sendGuestMessage({
      reservationId: selectedResId || null,
      guestName: guestName.trim(),
      roomNumber: roomNumber.trim(),
      channel,
      category,
      message: message.trim()
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
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Dispatch Guest Message</h3>
              <p className="text-xs text-slate-300">
                Multi-Channel Gateway • Simulated Operational Logging
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

          {/* Quick Select Stay */}
          {inHouseGuests.length > 0 && (
            <div className="text-xs">
              <label className="block font-semibold text-slate-700 mb-1">
                Select Guest Stay
              </label>
              <select
                value={selectedResId}
                onChange={(e) => handleSelectGuest(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              >
                <option value="">-- Or enter recipient manually below --</option>
                {inHouseGuests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.guestName} — Room {r.assignedRoom || 'Unassigned'} ({r.status})
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
              <label className="block font-semibold text-slate-700 mb-1">Room Number</label>
              <input
                type="text"
                placeholder="e.g. 412"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Communication Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              >
                <option value="SMS">SMS Cellular</option>
                <option value="WhatsApp">WhatsApp Business</option>
                <option value="In-App Concierge">In-App Concierge Chat</option>
                <option value="Email">Official Hotel Email</option>
                <option value="Phone Call Log">Front Desk Phone Call Log</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Message Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              >
                <option value="Room Ready Notification">Room Ready Notification</option>
                <option value="Service Request Update">Service Request Update</option>
                <option value="Complaint Apology & Recovery">Complaint Apology & Recovery</option>
                <option value="Departure Information">Departure Information</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>
          </div>

          {/* Quick Message Templates */}
          <div className="text-xs">
            <span className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Quick Templates:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleApplyTemplate('ready')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium"
              >
                Room Ready
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('request')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium"
              >
                Request En Route
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('apology')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium"
              >
                Service Apology
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('checkout')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium"
              >
                Check-Out Notice
              </button>
            </div>
          </div>

          {/* Message Content */}
          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">Message Text *</label>
            <textarea
              rows={3}
              placeholder="Type message text..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              required
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600">
            <strong>Simulated Gateway:</strong> Records message in real-time hotel communications audit log without sending live telecommunication SMS/email.
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
              Dispatch Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
