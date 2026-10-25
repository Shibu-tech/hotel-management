import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  DollarSign,
  Building2,
  FileText,
  User,
  ShieldCheck,
  AlertTriangle,
  Info,
  Filter,
  Check,
  X,
  Send,
  Lock
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

function formatPersonName(person, fallback = 'Unassigned') {
  if (!person) return fallback;
  if (typeof person === 'string') return person;
  if (typeof person === 'object') {
    return person.name || person.label || person.id || fallback;
  }
  return String(person);
}

export default function ExecutiveApprovals() {
  const {
    recoveryRequests,
    refundRequests,
    currentUser,
    executiveProfile,
    approveExecutiveRecovery,
    rejectExecutiveRecovery,
    requestMoreInfoExecutive,
    approveExecutiveRefund,
    rejectExecutiveRefund
  } = useTasks();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'history'
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'recovery', 'refund'
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState('approve'); // 'approve', 'reject', 'more_info'
  const [decisionReason, setDecisionReason] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Delegated authority limit
  const EXECUTIVE_AUTHORITY_LIMIT = executiveProfile?.approvalLimitUSD || executiveProfile?.authorityLimit || 10000;
  const executiveName = executiveProfile?.name || currentUser?.name || 'Victoria Montgomery';

  // Unify recovery requests safely
  const formattedRecoveries = (recoveryRequests || []).map((r) => {
    const cost = Number(r.cost || r.amount || 0);
    const canApprove = cost <= EXECUTIVE_AUTHORITY_LIMIT;
    const requesterName = formatPersonName(
      r.requester || r.requestingEmployee || r.submittedBy,
      'Front Desk Coordinator'
    );
    const isSelf = requesterName === executiveName;

    const decidedByName = formatPersonName(
      r.approvedBy || r.approver || r.rejectedBy || r.decidedBy,
      ''
    );

    const justificationText = typeof r.justification === 'string'
      ? r.justification
      : typeof r.reason === 'string'
      ? r.reason
      : 'Service interruption mitigation gesture.';

    return {
      id: String(r.id || 'REC-N/A'),
      itemType: 'recovery',
      category: 'Service Recovery',
      subCategory: r.requestType || 'Guest Concession',
      requester: requesterName,
      department: r.department || (r.requestingEmployee?.role ? 'Front Office' : 'Operations'),
      justification: justificationText,
      amount: cost,
      policyLimit: '$10,000 Executive Concession Cap',
      timestamp: r.timestamp || r.createdAt || 'Today',
      status: r.status || 'Pending Approval',
      decisionNotes: r.approvalNotes || r.decisionReason || '',
      decidedBy: decidedByName,
      decidedAt: r.approvedAt || r.rejectedAt || r.decidedAt || '',
      canApprove,
      isSelf,
      rawItem: r
    };
  });

  // Unify refund requests safely
  const formattedRefunds = (refundRequests || []).map((r) => {
    const cost = Number(r.amount || 0);
    const canApprove = cost <= EXECUTIVE_AUTHORITY_LIMIT;
    const requesterName = formatPersonName(
      r.requester || r.requestingEmployee,
      'Finance Operator'
    );
    const isSelf = requesterName === executiveName;

    const decidedByName = formatPersonName(
      r.approvedBy || r.approver || r.reviewedBy || r.executor,
      ''
    );

    const justificationText = typeof r.reason === 'string'
      ? r.reason
      : typeof r.justification === 'string'
      ? r.justification
      : 'Guest ledger billing correction authorization.';

    return {
      id: String(r.id || 'REF-N/A'),
      itemType: 'refund',
      category: 'Financial Refund',
      subCategory: r.category || 'Dispute Settlement',
      requester: requesterName,
      department: 'Finance & Accounting',
      justification: justificationText,
      amount: cost,
      policyLimit: '$10,000 High-Value Executive Threshold',
      timestamp: r.requestedAt || r.timestamp || 'Today',
      status: r.status || 'Pending Approval',
      decisionNotes: r.approvalNotes || r.notes || '',
      decidedBy: decidedByName,
      decidedAt: r.approvedAt || '',
      canApprove,
      isSelf,
      rawItem: r
    };
  });

  const allRequests = [...formattedRecoveries, ...formattedRefunds];

  const pendingRequests = allRequests.filter(
    (req) =>
      req.status === 'Pending Approval' ||
      req.status === 'Pending' ||
      req.status === 'Needs Review' ||
      req.status === 'Pending Executive Review'
  );

  const historyRequests = allRequests.filter(
    (req) =>
      req.status !== 'Pending Approval' &&
      req.status !== 'Pending' &&
      req.status !== 'Needs Review' &&
      req.status !== 'Pending Executive Review'
  );

  const activeList = activeTab === 'pending' ? pendingRequests : historyRequests;
  const filteredList = activeList.filter((item) => {
    if (filterType === 'ALL') return true;
    return item.itemType === filterType;
  });

  const handleDecisionSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (actionType === 'approve') {
      if (selectedItem.itemType === 'recovery') {
        if (typeof approveExecutiveRecovery === 'function') {
          approveExecutiveRecovery(selectedItem.id, decisionReason || 'Authorized under Executive Delegated Authority.');
        }
      } else {
        if (typeof approveExecutiveRefund === 'function') {
          approveExecutiveRefund(selectedItem.id, decisionReason || 'Authorized under Executive Delegated Authority.');
        }
      }
      setFeedbackMessage(`Request ${selectedItem.id} approved successfully.`);
    } else if (actionType === 'reject') {
      if (!decisionReason.trim()) {
        alert('A business reason is mandatory for rejection.');
        return;
      }
      if (selectedItem.itemType === 'recovery') {
        if (typeof rejectExecutiveRecovery === 'function') {
          rejectExecutiveRecovery(selectedItem.id, decisionReason);
        }
      } else {
        if (typeof rejectExecutiveRefund === 'function') {
          rejectExecutiveRefund(selectedItem.id, decisionReason);
        }
      }
      setFeedbackMessage(`Request ${selectedItem.id} rejected.`);
    } else if (actionType === 'more_info') {
      if (!decisionReason.trim()) {
        alert('Please specify what additional documentation or explanation is required.');
        return;
      }
      if (typeof requestMoreInfoExecutive === 'function') {
        requestMoreInfoExecutive(selectedItem.id, selectedItem.itemType, decisionReason);
      }
      setFeedbackMessage(`Information request submitted for ${selectedItem.id}.`);
    }

    setSelectedItem(null);
    setDecisionReason('');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              Delegated Authority Center
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Single-Signoff Limit: ${EXECUTIVE_AUTHORITY_LIMIT.toLocaleString()} USD
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Executive Approvals & Sign-Offs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict separation-of-duties enforcement: approvers cannot approve their own requests; financial disbursements remain queued for Finance execution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-right">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Delegated Cap</div>
            <div className="text-lg font-black text-emerald-700">${EXECUTIVE_AUTHORITY_LIMIT.toLocaleString()}</div>
          </div>
          <div className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-right">
            <div className="text-[11px] font-semibold text-indigo-600 uppercase">Pending Queue</div>
            <div className="text-lg font-black text-indigo-900">{pendingRequests.length}</div>
          </div>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {feedbackMessage}
        </div>
      )}

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Pending Executive Approvals ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Decision Audit History ({historyRequests.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Categories</option>
            <option value="recovery">Service Recoveries</option>
            <option value="refund">Financial Refunds</option>
          </select>
        </div>
      </div>

      {/* Approvals Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Category & Scope</th>
                <th className="py-3 px-4">Requester / Dept</th>
                <th className="py-3 px-4">Business Justification</th>
                <th className="py-3 px-4">Requested Amount</th>
                <th className="py-3 px-4">Policy & Authority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredList.map((item) => {
                const isPending =
                  item.status === 'Pending Approval' ||
                  item.status === 'Pending' ||
                  item.status === 'Needs Review' ||
                  item.status === 'Pending Executive Review';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {item.id}
                      <div className="text-[10px] text-slate-400 font-sans">{item.timestamp}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.itemType === 'recovery' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.category}
                      </span>
                      <div className="text-slate-800 font-semibold mt-0.5">{item.subCategory}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{item.requester}</div>
                      <div className="text-[11px] text-slate-400">{item.department}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="line-clamp-2 text-slate-600">{item.justification}</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ${item.amount.toFixed(2)}
                      {item.amount > EXECUTIVE_AUTHORITY_LIMIT && (
                        <div className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Exceeds Cap
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-700 font-medium">{item.policyLimit}</div>
                      <div className="text-[10px] text-slate-400">Executive Delegated</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {item.status}
                      </span>
                      {item.decidedBy && (
                        <div className="text-[10px] text-slate-400 mt-0.5">by {item.decidedBy}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isPending ? (
                        item.isSelf ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                            <Lock className="w-3 h-3" /> Self-Approval Barred
                          </span>
                        ) : !item.canApprove ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                            Exceeds $10k Cap
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setActionType('approve');
                            }}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors cursor-pointer text-xs"
                          >
                            Review & Decide
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setActionType('more_info');
                          }}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer text-xs"
                        >
                          View Audit Note
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredList.length === 0 && (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">Queue is clear</h4>
            <p className="text-xs text-slate-500 mt-1">
              There are no {activeTab} approvals matching the selected filter.
            </p>
          </div>
        )}
      </div>

      {/* Decision Review Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-300">
                  Delegated Executive Review
                </span>
                <h3 className="text-base font-bold">
                  {selectedItem.category} #{selectedItem.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDecisionSubmit} className="p-6 space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Requester:</span>
                  <span className="font-semibold text-slate-800">{selectedItem.requester} ({selectedItem.department})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Amount Requested:</span>
                  <span className="text-sm font-extrabold text-slate-900">${selectedItem.amount.toFixed(2)} USD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Policy Benchmark:</span>
                  <span className="font-medium text-emerald-700">{selectedItem.policyLimit}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 text-slate-600">
                  <div className="font-semibold text-slate-700 mb-0.5">Justification:</div>
                  <p>{selectedItem.justification}</p>
                </div>
              </div>

              {selectedItem.status === 'Pending Approval' ||
              selectedItem.status === 'Pending' ||
              selectedItem.status === 'Needs Review' ||
              selectedItem.status === 'Pending Executive Review' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Decision Action
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setActionType('approve')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                          actionType === 'approve'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-200'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Check className="w-4 h-4 text-emerald-600" />
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() => setActionType('reject')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                          actionType === 'reject'
                            ? 'bg-rose-50 border-rose-300 text-rose-800 ring-2 ring-rose-200'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <X className="w-4 h-4 text-rose-600" />
                        Reject
                      </button>

                      <button
                        type="button"
                        onClick={() => setActionType('more_info')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                          actionType === 'more_info'
                            ? 'bg-amber-50 border-amber-300 text-amber-800 ring-2 ring-amber-200'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <HelpCircle className="w-4 h-4 text-amber-600" />
                        Request Info
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {actionType === 'approve'
                        ? 'Approval Note (Optional)'
                        : actionType === 'reject'
                        ? 'Rejection Reason (Mandatory)'
                        : 'Information Needed (Mandatory)'}
                    </label>
                    <textarea
                      required={actionType !== 'approve'}
                      rows={3}
                      value={decisionReason}
                      onChange={(e) => setDecisionReason(e.target.value)}
                      placeholder={
                        actionType === 'approve'
                          ? 'Add executive remarks or conditions...'
                          : actionType === 'reject'
                          ? 'Provide clear justification for declining this expenditure...'
                          : 'Specify missing receipts, folio numbers, or documentation...'
                      }
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>
                      Decisions are signed with timestamp and user ID <span className="font-semibold text-slate-800">{executiveName}</span>. Financial disbursements are placed in Finance gateway queue and not automatically paid out by this step.
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow-sm transition-colors cursor-pointer ${
                        actionType === 'approve'
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : actionType === 'reject'
                          ? 'bg-rose-600 hover:bg-rose-700'
                          : 'bg-amber-600 hover:bg-amber-700'
                      }`}
                    >
                      Confirm Decision
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Decision Record</div>
                    <div className="text-xs text-slate-800 font-semibold mt-1">
                      Outcome: <span className="uppercase text-indigo-600">{selectedItem.status}</span>
                    </div>
                    {selectedItem.decidedBy && (
                      <div className="text-xs text-slate-600">Decision Actor: {selectedItem.decidedBy}</div>
                    )}
                    {selectedItem.decisionNotes && (
                      <div className="text-xs text-slate-600 mt-1 italic">"{selectedItem.decisionNotes}"</div>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
