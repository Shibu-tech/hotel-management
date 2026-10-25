import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Shield,
  DollarSign,
  AlertTriangle,
  Clock,
  Filter,
  Eye,
  Check
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import Button from '../../components/ui/Button';
import RecoveryApprovalModal from '../../components/manager/RecoveryApprovalModal';
import { RECOVERY_STATUS } from '../../data/mockManagerData';
import { formatDateTime } from '../../utils/taskStatus';

export default function Approvals() {
  const { recoveryRequests, managerRoleInfo, managerProfile } = useTasks();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filteredRequests = recoveryRequests.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  });

  const pendingCount = recoveryRequests.filter((r) => r.status === RECOVERY_STATUS.PENDING).length;
  const approvedTotal = recoveryRequests
    .filter((r) => r.status === RECOVERY_STATUS.APPROVED)
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case RECOVERY_STATUS.PENDING:
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case RECOVERY_STATUS.APPROVED:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case RECOVERY_STATUS.REJECTED:
        return 'bg-red-100 text-red-800 border-red-300';
      case RECOVERY_STATUS.ESCALATED:
        return 'bg-purple-100 text-purple-800 border-purple-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Delegated Approvals Workspace
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
              {pendingCount} Pending Authorization
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Department service-recovery gestures, dining credits, and fee waivers within delegated managerial authority.
          </p>
        </div>

        {/* Manager Delegated Limit Badge */}
        <div className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3 text-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">
              Manager Approval Limit
            </div>
            <div className="font-extrabold text-blue-900 text-sm">
              ${managerRoleInfo.delegatedApprovalLimit.toFixed(2)} USD
            </div>
          </div>
        </div>
      </div>

      {/* Governance & Policy Notice */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs text-slate-700 shadow-subtle">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <span className="font-bold text-slate-900">Hospitality Financial Control Rules:</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              1) Requests &gt; $250.00 must be escalated to General Manager Marcus Sterling. 2) Requesters cannot approve their own compensation. 3) Approval authorizes front desk folio adjustment; does not execute direct payment card refunds.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-slate-500 shrink-0">
          Total Authorized Today: <strong className="text-emerald-700">${approvedTotal.toFixed(2)}</strong>
        </span>
      </div>

      {/* Filter Tabs Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle p-3.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Requests' },
            { id: RECOVERY_STATUS.PENDING, label: 'Pending Approval' },
            { id: RECOVERY_STATUS.APPROVED, label: 'Approved' },
            { id: RECOVERY_STATUS.REJECTED, label: 'Rejected' },
            { id: RECOVERY_STATUS.ESCALATED, label: 'Escalated to GM' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-slate-400 text-[11px] hidden sm:inline">
          Showing {filteredRequests.length} requests
        </span>
      </div>

      {/* Approvals Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Proposed Compensation</th>
                <th className="py-3 px-4">Guest Reference</th>
                <th className="py-3 px-4">Requester</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Authority Check</th>
                <th className="py-3 px-4">Submission Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No approval requests in this category</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const isExceeded = Number(req.amount) > managerRoleInfo.delegatedApprovalLimit;
                  const isSelfRequested =
                    req.isSelfRequestedByManager ||
                    req.requestingEmployee?.id === managerProfile.id ||
                    req.requestingEmployee?.name?.includes('Elena Rostova');

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {req.id}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 max-w-xs truncate">
                          {req.proposedGesture}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {req.requestType}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">
                        {req.guestReference}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        {req.requestingEmployee?.name}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-extrabold text-slate-900">
                        ${req.amount.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {isExceeded ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                            Exceeds $250 Limit
                          </span>
                        ) : isSelfRequested ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Self-Requested
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Authorized
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                        {formatDateTime(req.createdAt)}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getStatusBadge(req.status)}`}>
                          {req.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => setSelectedRequest(req)}
                          className={`text-[11px] font-bold ${
                            req.status === RECOVERY_STATUS.PENDING
                              ? isExceeded
                                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-slate-800 hover:bg-slate-900 text-white'
                          }`}
                        >
                          {req.status === RECOVERY_STATUS.PENDING ? 'Review Request' : 'View Audit'}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <RecoveryApprovalModal
          isOpen={Boolean(selectedRequest)}
          onClose={() => setSelectedRequest(null)}
          request={selectedRequest}
        />
      )}
    </div>
  );
}
