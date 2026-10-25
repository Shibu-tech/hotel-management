import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Users, Clock, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { SHIFT_TYPES } from '../../data/mockManagerData';

export default function ScheduleEditModal({ isOpen, onClose, staffMember, day }) {
  const { updateStaffSchedule, staffSchedules, managerProfile } = useTasks();

  const [selectedShift, setSelectedShift] = useState('morning');
  const [reason, setReason] = useState('');
  const [confirmStep, setConfirmStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!staffMember || !day) return null;

  const staffSched = staffSchedules.find((s) => s.staffId === staffMember.id);
  const currentShiftObj = staffSched?.weeklySchedule?.[day] || { shift: 'off', hours: 'Off Duty' };

  // Calculate warnings
  const isNightShift = selectedShift === 'night';
  const isSettingOff = selectedShift === 'off';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('A schedule change justification is strictly required for the audit trail.');
      return;
    }

    if (!confirmStep) {
      setConfirmStep(true);
      return;
    }

    setIsSubmitting(true);
    const success = updateStaffSchedule(staffMember.id, day, selectedShift, reason.trim());
    setIsSubmitting(false);

    if (success) {
      setReason('');
      setConfirmStep(false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setConfirmStep(false);
        onClose();
      }}
      title={`Edit Staff Schedule: ${staffMember.name} (${day})`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Employee Info Card */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div className="flex items-center justify-between font-bold text-slate-800">
            <span className="text-sm">{staffMember.name}</span>
            <span className="text-[11px] text-slate-500">{staffMember.id}</span>
          </div>
          <div className="text-slate-600">
            {staffMember.role} • {staffMember.department}
          </div>
          <div className="text-slate-500 pt-1 border-t border-slate-200 flex items-center justify-between">
            <span>Scheduled Day: <strong>{day}</strong></span>
            <span>Current: <strong className="text-slate-700">{currentShiftObj.hours} ({currentShiftObj.shift})</strong></span>
          </div>
        </div>

        {/* Shift Selection */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            Select Assigned Shift for {day} <span className="text-red-500">*</span>
          </label>
          <div className="space-y-1.5">
            {Object.values(SHIFT_TYPES).map((st) => (
              <label
                key={st.id}
                className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                  selectedShift === st.id
                    ? 'bg-blue-50 border-blue-600 text-blue-900 font-semibold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="shift_selection"
                    value={st.id}
                    checked={selectedShift === st.id}
                    onChange={(e) => {
                      setSelectedShift(e.target.value);
                      setConfirmStep(false);
                    }}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>{st.label}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {st.hours}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Known Scheduling Warnings */}
        {isNightShift && (
          <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Rest Period Compliance Notice:</span>
              <p className="text-[11px] mt-0.5 text-amber-800 leading-relaxed">
                Night shift (23:00 – 07:30) requires a mandatory 11-hour consecutive rest window before any following morning shift assignment.
              </p>
            </div>
          </div>
        )}

        {isSettingOff && (
          <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900 flex items-start gap-2">
            <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Department Coverage Check:</span>
              <p className="text-[11px] mt-0.5 text-blue-800 leading-relaxed">
                Setting this staff member to Scheduled Off will adjust the active floor coverage for {day}. Ensure backup runners are available for peak check-in hours.
              </p>
            </div>
          </div>
        )}

        {/* Change Reason (Mandatory Audit Requirement) */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Manager Justification / Operational Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setConfirmStep(false);
            }}
            placeholder="e.g. 'Coverage adjustment for VIP state arrival protocol' or 'Shift swap approved per employee request'"
            className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Confirmation Step Preview */}
        {confirmStep && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1 text-purple-900 animate-in fade-in duration-100">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span>Confirm Permanent Schedule Mutation</span>
            </div>
            <p className="text-[11px] text-purple-800 leading-relaxed">
              Actor <strong>{managerProfile.name} (Department Manager)</strong> will record a schedule transition from <em>{currentShiftObj.shift}</em> to <strong>{selectedShift}</strong> on <em>{day}</em> for <strong>{staffMember.name}</strong>.
            </p>
          </div>
        )}

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setConfirmStep(false);
              onClose();
            }}
          >
            Cancel
          </Button>

          {!confirmStep ? (
            <Button
              type="submit"
              variant="primary"
              disabled={!reason.trim()}
            >
              Review & Confirm
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSubmitting ? 'Recording Shift Change...' : 'Confirm Schedule Change'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
