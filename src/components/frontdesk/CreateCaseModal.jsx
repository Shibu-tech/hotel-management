import React, { useState } from 'react';
import {
  X,
  AlertOctagon,
  AlertTriangle,
  User,
  ShieldAlert,
  Clock,
  DollarSign,
  Send,
  MessageSquare
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function CreateCaseModal({ isOpen, onClose, defaultGuest, defaultRoom }) {
  const { createFrontDeskCase, staff, reservations, frontDeskRoleInfo } = useTasks();

  const [guestReference, setGuestReference] = useState(defaultGuest || '');
  const [roomNumber, setRoomNumber] = useState(defaultRoom || '');
  const [category, setCategory] = useState('Room Cleanliness & Amenities');
  const [severity, setSeverity] = useState('high');
  const [description, setDescription] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [guestVisibleMessage, setGuestVisibleMessage] = useState('');
  const [requestServiceRecovery, setRequestServiceRecovery] = useState(false);
  const [recoveryAmount, setRecoveryAmount] = useState('50.00');
  const [recoveryType, setRecoveryType] = useState('Veranda Dining Credit');
  const [recoveryReason, setRecoveryReason] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

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

    if (!guestReference.trim()) {
      setFormError('Please specify guest reference or stay.');
      return;
    }

    if (!description.trim()) {
      setFormError('Please detail the guest complaint.');
      return;
    }

    const recAmt = requestServiceRecovery ? Number(recoveryAmount) : 0;

    const res = createFrontDeskCase({
      guestReference: guestReference.trim(),
      roomNumber: roomNumber.trim(),
      category,
      severity,
      description: description.trim(),
      ownerId: ownerId || null,
      nextAction: nextAction.trim(),
      internalNotes: internalNotes.trim(),
      guestVisibleMessage: guestVisibleMessage.trim(),
      recoveryAmount: recAmt,
      recoveryReason: recoveryReason.trim() || description.trim(),
      recoveryType
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
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-sm">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Log Guest Case & Complaint</h3>
              <p className="text-xs text-slate-300">
                Service Recovery Tracking • Clear Case Ownership & Manager Escalation
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
                    {r.guestName} — Room {r.assignedRoom} ({r.vipStatus})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Guest and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Guest Reference *
              </label>
              <input
                type="text"
                placeholder="e.g. David Vance (Suite 1204 - Titanium VIP)"
                value={guestReference}
                onChange={(e) => setGuestReference(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Room Number / Location
              </label>
              <input
                type="text"
                placeholder="e.g. Suite 1204"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
              />
            </div>
          </div>

          {/* Category, Severity & Ownership */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Complaint Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
              >
                <option value="Room Cleanliness & Amenities">Room Cleanliness & Amenities</option>
                <option value="HVAC / Climate Control Failure">HVAC / Temperature / AC Failure</option>
                <option value="Noise & Disturbance">Noise & Neighbor Disturbance</option>
                <option value="Billing & Folio Discrepancy">Billing & Folio Discrepancy</option>
                <option value="Food & Beverage Quality">Food & Beverage Quality</option>
                <option value="Keycard / Lock Access Failure">Keycard / Lock Access Failure</option>
                <option value="Staff Conduct / Service Delay">Staff Conduct / Service Delay</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Severity Level *
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold"
              >
                <option value="low">Low (Response SLA 90m)</option>
                <option value="medium">Medium (Response SLA 60m)</option>
                <option value="high">High (Response SLA 45m)</option>
                <option value="critical">Critical / Executive (Response SLA 20m)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Designated Case Owner *
              </label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              >
                <option value="">Default: Front Desk Coordinator</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description & Immediate Next Action */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Complaint Statement & Root Issue *
              </label>
              <textarea
                rows={2}
                placeholder="Detailed summary of guest complaint and expressed grievance..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Immediate Next Action & Commitment
              </label>
              <input
                type="text"
                placeholder="e.g. Inspect AC unit with engineering supervisor; offer room move or dining credit"
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
          </div>

          {/* Guest Visible Message vs Internal Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                Guest-Visible Message / Official Apology
              </label>
              <textarea
                rows={2}
                placeholder="Formal acknowledgement and empathetic response to guest..."
                value={guestVisibleMessage}
                onChange={(e) => setGuestVisibleMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                Confidential Internal Notes (Staff Only)
              </label>
              <textarea
                rows={2}
                placeholder="Internal facts, guest demeanor, operational context..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
          </div>

          {/* Service Recovery Request Workflow (Routes to Manager) */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950">
                <input
                  type="checkbox"
                  checked={requestServiceRecovery}
                  onChange={(e) => setRequestServiceRecovery(e.target.checked)}
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <span>Initiate Service Recovery / Compensation Request</span>
              </label>
              <span className="text-[10px] text-amber-800 font-semibold uppercase">
                Requires Manager Approval
              </span>
            </div>

            {requestServiceRecovery && (
              <div className="space-y-3 pt-2 border-t border-amber-200/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-amber-900 mb-1">
                      Gesture / Compensation Type
                    </label>
                    <select
                      value={recoveryType}
                      onChange={(e) => setRecoveryType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white text-xs"
                    >
                      <option value="Veranda Dining Credit">Dining Room Credit ($)</option>
                      <option value="Spa Treatment Voucher">Complimentary Spa Treatment</option>
                      <option value="Folio Room Rate Discount">Room Night Rate Adjustment</option>
                      <option value="Complimentary Airport Car Service">Complimentary Car Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-amber-900 mb-1">
                      Proposed Amount (USD)
                    </label>
                    <input
                      type="number"
                      step="5.00"
                      value={recoveryAmount}
                      onChange={(e) => setRecoveryAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white font-mono font-bold text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-amber-900 mb-1">
                    Justification for Department Manager
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. VIP guest experienced significant delay and noise; gesture recommended to protect account retention"
                    value={recoveryReason}
                    onChange={(e) => setRecoveryReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white text-xs"
                  />
                </div>

                <p className="text-[11px] text-amber-800 italic">
                  Policy Note: Front Desk Coordinator has $0.00 independent refund approval authority. This request will be routed directly to Department Manager Elena Rostova's approval queue.
                </p>
              </div>
            )}
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
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Open Case & Record Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
