import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import {
  AlertOctagon,
  ShieldAlert,
  UserCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Send,
  ExternalLink
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { COMPLAINT_STATUS, COMPLAINT_SEVERITY } from '../../data/mockManagerData';
import { formatDateTime } from '../../utils/taskStatus';

export default function ComplaintDetailModal({ isOpen, onClose, complaint, onOpenTask }) {
  const {
    assignComplaintOwner,
    updateComplaintStatus,
    escalateComplaint,
    staff,
    managerProfile
  } = useTasks();

  const [selectedOwnerId, setSelectedOwnerId] = useState('');
  const [reassignOpen, setReassignOpen] = useState(false);
  const [reassignNote, setReassignNote] = useState('');
  const [newStatus, setNewStatus] = useState(complaint?.status || COMPLAINT_STATUS.OPEN);
  const [statusNote, setStatusNote] = useState('');
  const [emergencyEscalateOpen, setEmergencyEscalateOpen] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState('');

  if (!complaint) return null;

  const isEmergency = complaint.isEmergency || complaint.severity === COMPLAINT_SEVERITY.CRITICAL;

  const handleReassign = (e) => {
    e.preventDefault();
    const foundStaff = staff.find((s) => s.id === selectedOwnerId);
    if (!foundStaff) {
      alert('Please select an authorized employee.');
      return;
    }
    assignComplaintOwner(complaint.id, `${foundStaff.name} (${foundStaff.role})`, foundStaff.id, reassignNote);
    setReassignOpen(false);
    setReassignNote('');
  };

  const handleStatusUpdate = (e) => {
    e.preventDefault();
    updateComplaintStatus(complaint.id, newStatus, statusNote);
    setStatusNote('');
  };

  const handleEmergencyProtocol = () => {
    if (!emergencyReason.trim()) {
      alert('A security/safety justification is required to activate immediate emergency escalation.');
      return;
    }
    escalateComplaint(complaint.id, {
      escalationTarget: 'Safety & Security Command / Hotel General Manager',
      reason: emergencyReason.trim(),
      isEmergency: true
    });
    setEmergencyEscalateOpen(false);
    setEmergencyReason('');
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300 font-bold animate-pulse';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300 font-bold';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Complaint & Guest Case Oversight: ${complaint.id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Top Header Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase font-bold ${getSeverityBadge(complaint.severity)}`}>
                  {complaint.severity} Severity
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">
                  {complaint.status}
                </span>
                {complaint.isEmergency && (
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    EMERGENCY
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                {complaint.category}
              </h3>
              <p className="text-slate-600 font-medium mt-0.5">
                {complaint.guestReference}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Response Deadline</span>
              <div className="font-bold text-slate-800 mt-0.5">
                {formatDateTime(complaint.responseDeadline)}
              </div>
              <span className="text-[10px] text-slate-500">
                Time Open: {complaint.timeOpenDisplay}
              </span>
            </div>
          </div>

          {/* Current Owner & Next Action */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Responsible Case Owner</span>
              <div className="font-semibold text-slate-900 mt-0.5 flex items-center justify-between">
                <span>{complaint.owner}</span>
                <button
                  type="button"
                  onClick={() => setReassignOpen(!reassignOpen)}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-bold"
                >
                  {reassignOpen ? 'Cancel' : 'Reassign Owner'}
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Next Operational Action</span>
              <div className="text-slate-700 font-medium text-[11px] mt-0.5">
                {complaint.nextAction}
              </div>
            </div>
          </div>

          {/* Reassign Owner Dropdown */}
          {reassignOpen && (
            <form onSubmit={handleReassign} className="p-3 bg-white border border-blue-200 rounded-lg space-y-2 mt-2">
              <label className="block text-xs font-semibold text-slate-700">
                Delegate Case Ownership to Department Staff
              </label>
              <select
                value={selectedOwnerId}
                onChange={(e) => setSelectedOwnerId(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                required
              >
                <option value="">— Select Responsible Staff Member —</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role}) — {s.department} [{s.availability}]
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Reason for reassignment (optional note)"
                value={reassignNote}
                onChange={(e) => setReassignNote(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded"
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="secondary" type="button" onClick={() => setReassignOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Confirm Ownership Delegation
                </Button>
              </div>
            </form>
          )}

          {complaint.relatedTaskId && (
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 text-xs">
                Linked Department Task: <strong className="text-slate-800">{complaint.relatedTaskId}</strong>
              </span>
              {onOpenTask && (
                <button
                  type="button"
                  onClick={() => onOpenTask(complaint.relatedTaskId)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Open Task Details</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Emergency Incident Banner */}
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-900">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              Safety and security incidents must use designated security escalation immediately.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setEmergencyEscalateOpen(!emergencyEscalateOpen)}
            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shrink-0 transition-colors"
          >
            {emergencyEscalateOpen ? 'Close Alert' : 'Trigger Emergency Protocol'}
          </button>
        </div>

        {/* Emergency Confirmation Form */}
        {emergencyEscalateOpen && (
          <div className="p-3 bg-red-100/60 border border-red-300 rounded-lg space-y-2 text-xs">
            <div className="font-bold text-red-950">Activate Emergency / Security Escalation</div>
            <textarea
              rows={2}
              value={emergencyReason}
              onChange={(e) => setEmergencyReason(e.target.value)}
              placeholder="State reason for emergency safety escalation (e.g. active flood hazard, physical injury risk, security altercation)..."
              className="w-full p-2 border border-red-300 rounded bg-white text-xs"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="secondary" onClick={() => setEmergencyEscalateOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="danger" onClick={handleEmergencyProtocol}>
                Dispatch Immediate Safety Protocol
              </Button>
            </div>
          </div>
        )}

        {/* Status Update Control */}
        <form onSubmit={handleStatusUpdate} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800">Update Complaint Resolution Status</span>
            <span className="text-[10px] text-slate-400">Acting: {managerProfile.name}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              COMPLAINT_STATUS.OPEN,
              COMPLAINT_STATUS.INVESTIGATING,
              COMPLAINT_STATUS.ACTION_IN_PROGRESS,
              COMPLAINT_STATUS.RESOLVED
            ].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setNewStatus(st)}
                className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all ${
                  newStatus === st
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Resolution or status transition notes..."
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            className="w-full text-xs p-2 border border-slate-300 rounded-lg"
          />
          <div className="flex justify-end">
            <Button size="sm" variant="primary" type="submit">
              Save Status Update
            </Button>
          </div>
        </form>

        {/* Action History Trail */}
        <div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Case Audit & Action History
          </span>
          <div className="mt-2 divide-y divide-slate-100 max-h-48 overflow-y-auto bg-slate-50 rounded-xl border border-slate-200 p-2.5">
            {complaint.history?.map((h) => (
              <div key={h.id} className="py-2 first:pt-0 last:pb-0 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-800">
                  <span>{h.action}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {formatDateTime(h.timestamp)}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                  {h.details}
                </p>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Actor: {h.actor}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-200">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
