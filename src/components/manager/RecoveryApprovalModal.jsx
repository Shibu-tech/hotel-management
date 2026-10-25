import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  DollarSign,
  AlertTriangle,
  Info,
  Clock
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function RecoveryApprovalModal({ isOpen, onClose, request }) {
  const {
    approveRecoveryRequest,
    rejectRecoveryRequest,
    escalateRecoveryRequest,
    managerRoleInfo,
    managerProfile
  } = useTasks();

  const [decisionNotes, setDecisionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [escalateReason, setEscalateReason] = useState('');
  const [activeTab, setActiveTab] = useState('approve'); // 'approve', 'reject', 'escalate'
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  const isExceeded = Number(request.amount) > managerRoleInfo.delegatedApprovalLimit;
  const isSelfRequested =
    request.isSelfRequestedByManager ||
    request.requestingEmployee?.id === managerProfile.id ||
    request.requestingEmployee?.name?.includes('Elena Rostova');

  const canApprove = !isExceeded && !isSelfRequested;

  const handleApprove = () => {
    if (!decisionNotes.trim()) {
      alert('A formal managerial approval reason or policy note is required.');
      return;
    }
    setIsSubmitting(true);
    const success = approveRecoveryRequest(request.id, decisionNotes);
    setIsSubmitting(false);
    if (success) onClose();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('A rejection reason is strictly required.');
      return;
    }
    setIsSubmitting(true);
    const success = rejectRecoveryRequest(request.id, rejectionReason);
    setIsSubmitting(false);
    if (success) onClose();
  };

  const handleEscalate = () => {
    setIsSubmitting(true);
    const success = escalateRecoveryRequest(request.id, {
      destination: 'General Manager (Marcus Sterling)',
      reason: escalateReason.trim() || 'Amount exceeds delegated limit or requires executive sign-off'
    });
    setIsSubmitting(false);
    if (success) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Review Service-Recovery Request: ${request.id}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Request Highlights Card */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 text-xs space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Proposed Gesture
              </span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {request.proposedGesture}
              </div>
              <div className="text-slate-600 mt-0.5 font-medium">
                Type: {request.requestType}
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Amount
              </span>
              <div className="text-lg font-extrabold text-blue-700">
                ${request.amount.toFixed(2)} {request.currency}
              </div>
              <span
                className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mt-1 ${
                  isExceeded ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isExceeded ? 'Exceeds Manager Limit' : 'Within Delegated Limit'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-slate-600">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Guest Reference</span>
              <div className="font-semibold text-slate-800 truncate">{request.guestReference}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Requester</span>
              <div className="font-semibold text-slate-800">
                {request.requestingEmployee?.name} ({request.requestingEmployee?.role})
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Operational Rationale</span>
            <p className="text-slate-700 text-xs mt-0.5 leading-relaxed bg-white p-2 rounded border border-slate-200">
              "{request.reason}"
            </p>
          </div>

          {request.supportingNotes && (
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Supporting Notes</span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                {request.supportingNotes}
              </p>
            </div>
          )}
        </div>

        {/* Policy & Authority Status Alerts */}
        {isExceeded && (
          <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-900 flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Approval Limit Exceeded ($250.00 Max)</div>
              <p className="text-[11px] text-red-800 mt-0.5">
                The requested amount of <strong>${request.amount.toFixed(2)}</strong> exceeds your delegated approval limit of <strong>${managerRoleInfo.delegatedApprovalLimit.toFixed(2)} USD</strong>. By hotel financial control policies, this request must be escalated to General Manager Marcus Sterling.
              </p>
            </div>
          </div>
        )}

        {isSelfRequested && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Governance Check: Self-Approval Prohibited</div>
              <p className="text-[11px] text-amber-800 mt-0.5">
                You cannot approve your own service-recovery request. Independent dual authorization is required. Please escalate this request to the Executive Committee / General Manager.
              </p>
            </div>
          </div>
        )}

        {/* Decision Action Tabs */}
        <div className="border-t border-slate-200 pt-3">
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              disabled={!canApprove}
              onClick={() => setActiveTab('approve')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'approve'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : canApprove
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              Approve Within Limit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reject')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'reject'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Reject Request
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('escalate')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'escalate'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Escalate to GM {isExceeded && '★ Recommended'}
            </button>
          </div>

          {/* Tab 1: Approve Form */}
          {activeTab === 'approve' && canApprove && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Managerial Approval Justification <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="Record policy compliance note (e.g. 'Approved within authorized $250 limit as goodwill gesture for VIP delivery delay.')"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="p-2.5 bg-blue-50/60 rounded-lg text-[11px] text-blue-800 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Approval will authorize front desk staff to credit the guest folio. Does not execute direct credit card refund transactions.
                </span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleApprove}
                  disabled={isSubmitting || !decisionNotes.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5 inline" />
                  Confirm & Approve (${request.amount.toFixed(2)})
                </Button>
              </div>
            </div>
          )}

          {/* Tab 2: Reject Form */}
          {activeTab === 'reject' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide explicit rejection reason (e.g. 'Service gesture not supported by department policy; standard apology letter delivered.')"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleReject}
                  disabled={isSubmitting || !rejectionReason.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <XCircle className="w-4 h-4 mr-1.5 inline" />
                  Confirm Rejection
                </Button>
              </div>
            </div>
          )}

          {/* Tab 3: Escalate Form */}
          {(activeTab === 'escalate' || !canApprove) && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Executive Escalation Notes
                </label>
                <textarea
                  rows={2}
                  value={escalateReason}
                  onChange={(e) => setEscalateReason(e.target.value)}
                  placeholder="Explain why executive approval is requested (e.g. 'Amount ($380.00) exceeds $250 manager limit due to room soakage. Recommend full night credit.')"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="p-2.5 bg-purple-50/70 border border-purple-200 rounded-lg text-[11px] text-purple-900 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  Will route immediately to <strong>Marcus Sterling (General Manager)</strong> executive queue.
                </span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleEscalate}
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <ArrowUpRight className="w-4 h-4 mr-1.5 inline" />
                  Escalate to General Manager
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
