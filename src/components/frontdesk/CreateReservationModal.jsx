import React, { useState, useEffect } from 'react';
import {
  X,
  CalendarCheck,
  Calendar,
  Users,
  CreditCard,
  Building2,
  AlertTriangle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { ROOM_STATUS, OCCUPANCY_STATUS } from '../../data/mockFrontDeskData';

export default function CreateReservationModal({ isOpen, onClose }) {
  const { createReservation, rooms } = useTasks();

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400 * 1000).toISOString().split('T')[0];

  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vipStatus, setVipStatus] = useState('Regular');
  const [arrivalDate, setArrivalDate] = useState(todayStr);
  const [departureDate, setDepartureDate] = useState(tomorrowStr);
  const [nights, setNights] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [roomType, setRoomType] = useState('Deluxe King');
  const [assignedRoom, setAssignedRoom] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [notes, setNotes] = useState('');
  const [cardBrand, setCardBrand] = useState('Visa');
  const [cardLast4, setCardLast4] = useState('4812');
  const [formError, setFormError] = useState('');

  // Recompute nights when dates change
  useEffect(() => {
    if (arrivalDate && departureDate) {
      const arr = new Date(arrivalDate).getTime();
      const dep = new Date(departureDate).getTime();
      const diff = Math.ceil((dep - arr) / (1000 * 3600 * 24));
      setNights(diff > 0 ? diff : 1);
    }
  }, [arrivalDate, departureDate]);

  if (!isOpen) return null;

  // Filter available rooms matching type
  const matchingRooms = rooms.filter((r) => r.type === roomType);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!guestName.trim()) {
      setFormError('Guest name is required.');
      return;
    }

    if (new Date(departureDate).getTime() <= new Date(arrivalDate).getTime()) {
      setFormError('Departure date must be after arrival date.');
      return;
    }

    if (assignedRoom) {
      const rm = rooms.find((r) => r.roomNumber === assignedRoom);
      if (rm && rm.occupancy === OCCUPANCY_STATUS.OCCUPIED) {
        setFormError(`Room ${assignedRoom} is currently occupied.`);
        return;
      }
    }

    const res = createReservation({
      guestName,
      email,
      phone,
      vipStatus,
      arrivalDate,
      departureDate,
      nights,
      adults,
      children,
      roomType,
      assignedRoom: assignedRoom || null,
      specialRequests,
      notes,
      paymentMethod: {
        brand: cardBrand,
        last4: cardLast4.padStart(4, '0').slice(-4),
        holder: guestName.trim(),
        exp: '12/28'
      }
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
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create New Hotel Reservation</h3>
              <p className="text-xs text-slate-300">
                Front Office Booking Desk • Live Room Availability Validation
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

          {/* Guest Identity Information */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Primary Guest Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Guest Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Eleanor Vance"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Loyalty Tier / VIP Status</label>
                <select
                  value={vipStatus}
                  onChange={(e) => setVipStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                >
                  <option value="Regular">Standard Member</option>
                  <option value="Silver VIP">Silver VIP</option>
                  <option value="Gold VIP">Gold VIP</option>
                  <option value="Titanium VIP">Titanium VIP</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. e.vance@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +1 (555) 345-6789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Stay Dates & Room Selection */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Stay Dates & Room Allocation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Arrival Date *</label>
                <input
                  type="date"
                  value={arrivalDate}
                  min={todayStr}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Departure Date *</label>
                <input
                  type="date"
                  value={departureDate}
                  min={arrivalDate || todayStr}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Calculated Nights</label>
                <div className="px-3 py-2 rounded-lg bg-white border border-slate-300 font-bold text-slate-800 text-xs">
                  {nights} {nights === 1 ? 'Night' : 'Nights'}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Adults</label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                >
                  <option value={1}>1 Adult</option>
                  <option value={2}>2 Adults</option>
                  <option value={3}>3 Adults</option>
                  <option value={4}>4 Adults</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Children</label>
                <select
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                >
                  <option value={0}>0 Children</option>
                  <option value={1}>1 Child</option>
                  <option value={2}>2 Children</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Room Category *</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                >
                  <option value="Deluxe King">Deluxe King ($220/nt)</option>
                  <option value="Executive Suite">Executive Suite ($360/nt)</option>
                  <option value="Standard Queen">Standard Queen ($165/nt)</option>
                  <option value="Twin Classic">Twin Classic ($180/nt)</option>
                  <option value="Presidential Suite">Presidential Suite ($850/nt)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Optional Room Pre-Assignment
              </label>
              <select
                value={assignedRoom}
                onChange={(e) => setAssignedRoom(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              >
                <option value="">-- Assign upon check-in (Floating) --</option>
                {matchingRooms.map((r) => (
                  <option key={r.roomNumber} value={r.roomNumber}>
                    Room {r.roomNumber} — Floor {r.floor} ({r.cleanliness}, {r.occupancy})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Special Requests & Billing Guarantee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Special Requests</label>
              <textarea
                rows={2}
                placeholder="e.g. High floor, hypoallergenic pillows, late arrival"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Internal Operations Notes</label>
              <textarea
                rows={2}
                placeholder="Front desk coordination remarks..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
          </div>

          {/* Guarantee Card on File */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Guarantee Card Brand</label>
              <select
                value={cardBrand}
                onChange={(e) => setCardBrand(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
              >
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="Amex">American Express</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Masked Last 4 Digits</label>
              <input
                type="text"
                maxLength={4}
                value={cardLast4}
                onChange={(e) => setCardLast4(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-mono font-bold"
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
              <CalendarCheck className="w-4 h-4" />
              Confirm & Book Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
