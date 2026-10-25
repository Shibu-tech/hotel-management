import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  KeyRound,
  CreditCard,
  Building2,
  FileCheck2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { ROOM_STATUS, OCCUPANCY_STATUS } from '../../data/mockFrontDeskData';
import StatusBadge from './StatusBadge';

export default function CheckInModal({ isOpen, onClose, reservation }) {
  const { rooms, performCheckIn, frontDeskProfile } = useTasks();

  const [idType, setIdType] = useState('Passport');
  const [idNumber, setIdNumber] = useState('');
  const [issuingCountry, setIssuingCountry] = useState('USA');
  const [idVerifiedCheck, setIdVerifiedCheck] = useState(false);
  const [targetRoomNumber, setTargetRoomNumber] = useState('');
  const [keyCardsIssued, setKeyCardsIssued] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [regCardSigned, setRegCardSigned] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (reservation) {
      setTargetRoomNumber(reservation.assignedRoom || '');
      setSpecialRequests(reservation.specialRequests || '');
      if (reservation.idDocument) {
        setIdType(reservation.idDocument.type || 'Passport');
        setIdNumber(reservation.idDocument.number || '');
        setIssuingCountry(reservation.idDocument.issuingCountry || 'USA');
        setIdVerifiedCheck(true);
      } else {
        setIdNumber('');
        setIdVerifiedCheck(false);
      }
      setRegCardSigned(reservation.registrationSigned || false);
      setFormError('');
    }
  }, [reservation]);

  if (!isOpen || !reservation) return null;

  // Find targeted room object
  const assignedRoomObj = rooms.find((r) => r.roomNumber === targetRoomNumber);
  const isRoomReady = assignedRoomObj?.cleanliness === ROOM_STATUS.READY;
  const isRoomVacant = assignedRoomObj?.occupancy === OCCUPANCY_STATUS.VACANT;
  const canOccupantEnter = isRoomReady && isRoomVacant;

  // Available ready rooms for reassignment if currently assigned room is dirty or occupied
  const alternativeReadyRooms = rooms.filter(
    (r) => r.cleanliness === ROOM_STATUS.READY && r.occupancy === OCCUPANCY_STATUS.VACANT
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!idNumber.trim()) {
      setFormError('Mandatory Guest ID Number is missing. Visual verification is strictly required.');
      return;
    }

    if (!idVerifiedCheck) {
      setFormError('Please check the verification confirmation box acknowledging visual inspection of the physical ID.');
      return;
    }

    if (!targetRoomNumber) {
      setFormError('Please assign a room before proceeding with check-in.');
      return;
    }

    if (!canOccupantEnter) {
      setFormError(
        `Room ${targetRoomNumber} cannot be occupied: Currently "${assignedRoomObj?.cleanliness || 'Unavailable'}". Check-in requires a Ready & Inspected room.`
      );
      return;
    }

    if (!regCardSigned) {
      setFormError('Guest registration card agreement must be acknowledged.');
      return;
    }

    const res = performCheckIn({
      reservationId: reservation.id,
      idType,
      idNumber: idNumber.trim(),
      issuingCountry,
      specialRequests,
      keyCardsIssued,
      targetRoomNumber
    });

    if (res.success) {
      onClose();
    } else {
      setFormError(res.error || 'Failed to complete check-in workflow.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#172B4D] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Verified Guest Check-In</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  {reservation.reference}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Front Desk Operations • Terminal 02 ({frontDeskProfile.name})
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

        {/* Guest Summary Strip */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block">Guest Name</span>
            <span className="font-bold text-slate-900">{reservation.guestName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">VIP Status</span>
            <span className="font-semibold text-blue-700">{reservation.vipStatus}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Dates & Stay</span>
            <span className="font-medium text-slate-900">
              {reservation.arrivalDate} ({reservation.nights} nights)
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Booked Room Type</span>
            <span className="font-medium text-slate-900">{reservation.roomType}</span>
          </div>
        </div>

        {/* Check-In Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="font-medium">{formError}</div>
            </div>
          )}

          {/* STEP 1: IDENTITY VERIFICATION */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Guest Identity Verification (Mandatory)
                </h4>
              </div>
              <span className="text-[10px] text-rose-600 font-semibold uppercase">Cannot Bypass</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ID Document Type *</label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                >
                  <option value="Passport">Passport</option>
                  <option value="Driving License">Driving License</option>
                  <option value="National Identity Card">National Identity Card</option>
                  <option value="Military / Diplomatic ID">Military / Diplomatic ID</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Number *</label>
                <input
                  type="text"
                  placeholder="e.g. US-98421034"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issuing Country / State</label>
                <input
                  type="text"
                  placeholder="e.g. United States"
                  value={issuingCountry}
                  onChange={(e) => setIssuingCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={idVerifiedCheck}
                onChange={(e) => setIdVerifiedCheck(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-700 leading-snug">
                I verify that I have visually examined the guest's physical government ID and confirmed name and photo match.
              </span>
            </label>
          </div>

          {/* STEP 2: ROOM READINESS & CLEARANCE CHECK */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Room Assignment & Cleanliness Clearance
                </h4>
              </div>
              <span className="text-[10px] text-slate-500">Live Housekeeping State</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Room Number *
                </label>
                <select
                  value={targetRoomNumber}
                  onChange={(e) => setTargetRoomNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold"
                >
                  <option value="">-- Select Room --</option>
                  {rooms.map((rm) => (
                    <option key={rm.roomNumber} value={rm.roomNumber}>
                      Room {rm.roomNumber} — {rm.type} ({rm.cleanliness})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-700 mb-1">
                  Cleanliness Clearance Status
                </span>
                <div className="flex items-center gap-2">
                  <StatusBadge type="cleanliness" value={assignedRoomObj?.cleanliness || 'Unknown'} />
                  <StatusBadge type="occupancy" value={assignedRoomObj?.occupancy || 'Unknown'} />
                </div>
              </div>
            </div>

            {/* Room Clearance Guard Notification */}
            {canOccupantEnter ? (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Room {targetRoomNumber} is Cleared:</strong> Inspected and sanitized by Housekeeping. Ready for guest occupancy.
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Occupancy Blocked:</strong>
                  Room {targetRoomNumber || 'N/A'} is currently "{assignedRoomObj?.cleanliness || 'Not Ready'}". Hotel safety policy prohibits guest check-in to uncleared or uninspected rooms.
                  {alternativeReadyRooms.length > 0 && (
                    <div className="mt-1 text-slate-700">
                      💡 Tip: You can switch to available ready rooms:{' '}
                      {alternativeReadyRooms.slice(0, 3).map((r) => (
                        <button
                          key={r.roomNumber}
                          type="button"
                          onClick={() => setTargetRoomNumber(r.roomNumber)}
                          className="font-bold text-blue-700 underline mx-1 hover:text-blue-900"
                        >
                          Room {r.roomNumber}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: REGISTRATION & KEY CARDS */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Key Cards & Registration Sign-Off
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  RFID Key Cards Issued
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setKeyCardsIssued(num)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        keyCardsIssued === num
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {num} {num === 1 ? 'Card' : 'Cards'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payment Card on File
                </label>
                <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                    {reservation.paymentMethod?.brand} ending {reservation.paymentMethod?.last4 || '4812'}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                    Pre-Auth Active
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Special Requests & Front Desk Remarks
              </label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Feather pillows, early wake-up call, luggage assistance"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>

            <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={regCardSigned}
                onChange={(e) => setRegCardSigned(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-700 leading-snug">
                Guest has signed digital registration card, confirmed stay dates, and accepted hotel policies.
              </span>
            </label>
          </div>

          {/* Audit & Staff Stamp */}
          <div className="text-[11px] text-slate-500 flex items-center justify-between px-1">
            <span>Recorded by: {frontDeskProfile.name} ({frontDeskProfile.id})</span>
            <span>Terminal: {frontDeskProfile.terminal}</span>
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
              disabled={!canOccupantEnter || !idVerifiedCheck || !regCardSigned}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all flex items-center gap-2 ${
                canOccupantEnter && idVerifiedCheck && regCardSigned
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-slate-400 cursor-not-allowed opacity-70'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Complete & Confirm Check-In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
