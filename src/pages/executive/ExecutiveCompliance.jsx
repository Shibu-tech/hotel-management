import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCheck,
  AlertOctagon,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  Lock,
  ArrowRight,
  ExternalLink,
  Info,
  Key
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function ExecutiveCompliance() {
  const {
    policyReviews,
    accessCertifications,
    complianceActions,
    executiveProfile
  } = useTasks();

  const [activeTab, setActiveTab] = useState('policy'); // 'policy', 'access', 'compliance'
  const [selectedAction, setSelectedAction] = useState(null);
  const [oversightNote, setOversightNote] = useState('');
  const [actionDone, setActionDone] = useState('');

  const handleSignOff = (e) => {
    e.preventDefault();
    if (!selectedAction) return;
    setActionDone(`Executive oversight sign-off recorded for ${selectedAction.id}. Audit trail updated.`);
    setTimeout(() => {
      setActionDone('');
      setSelectedAction(null);
      setOversightNote('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
              Governance & Compliance Oversight
            </span>
            <span className="text-xs text-slate-500 font-medium">Independent Executive Audit Window</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Policy, Access Certification & Regulatory Oversight
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Oversight review of enterprise policies, privileged role certifications, and statutory life safety standards.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Policy Reviews</div>
            <div className="text-lg font-black text-indigo-900">{policyReviews.length}</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Certifications</div>
            <div className="text-lg font-black text-emerald-800">{accessCertifications.length}</div>
          </div>
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center">
            <div className="text-[10px] font-bold text-rose-700 uppercase">Overdue Items</div>
            <div className="text-lg font-black text-rose-900">1</div>
          </div>
        </div>
      </div>

      {actionDone && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {actionDone}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 text-xs">
        <button
          onClick={() => setActiveTab('policy')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
            activeTab === 'policy'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pending Policy Reviews ({policyReviews.length})
        </button>

        <button
          onClick={() => setActiveTab('access')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
            activeTab === 'access'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Access Certifications ({accessCertifications.length})
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
            activeTab === 'compliance'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Overdue Compliance Actions ({complianceActions.length})
        </button>
      </div>

      {/* Policy Tab Content */}
      {activeTab === 'policy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {policyReviews.map((policy) => (
            <div
              key={policy.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {policy.id}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    policy.priority === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {policy.priority}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2">{policy.title}</h3>
                <p className="text-xs text-slate-500 mb-3">{policy.scope}</p>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Department:</span>
                    <span className="font-semibold text-slate-800">{policy.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Due Date:</span>
                    <span className="font-semibold text-slate-800">{policy.dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Review Status:</span>
                    <span className="font-bold text-indigo-700">{policy.status}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedAction(policy)}
                className="w-full py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors cursor-pointer"
              >
                Conduct Oversight Review
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Access Certifications Tab Content */}
      {activeTab === 'access' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Privileged Role & Physical Credential Audits</h3>
            <p className="text-xs text-slate-500">Periodic verification of system administrator privileges and master master-key accounts.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Audit ID</th>
                  <th className="py-3 px-4">Scope & Role Description</th>
                  <th className="py-3 px-4">Target Role</th>
                  <th className="py-3 px-4">Accounts Audited</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Certified</th>
                  <th className="py-3 px-4 text-right">Oversight Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {accessCertifications.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.id}</td>
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-bold text-slate-900">{item.scope}</div>
                      <div className="text-[11px] text-slate-400">{item.notes}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{item.targetRole}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900">
                        {item.certifiedAccounts} / {item.totalAccounts}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'Certified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{item.certifiedBy}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedAction(item)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg border border-indigo-200 transition-colors cursor-pointer text-xs"
                      >
                        Audit Sign-off
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compliance Actions Tab Content */}
      {activeTab === 'compliance' && (
        <div className="space-y-4">
          {complianceActions.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                    {c.id}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase bg-rose-600 text-white px-2 py-0.5 rounded-full">
                    {c.status}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{c.department}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-600 max-w-2xl">{c.actionRequired}</p>
                <div className="text-[11px] text-rose-700 font-semibold pt-1">
                  Responsible Manager: {c.responsibleManager} • Impact: {c.impact}
                </div>
              </div>

              <button
                onClick={() => setSelectedAction(c)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                Executive Escalation Directive
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Action / Review Modal */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="text-sm font-bold">Executive Oversight Action: {selectedAction.id}</h3>
              <button
                onClick={() => setSelectedAction(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSignOff} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                <div className="font-bold text-slate-900 mb-1">{selectedAction.title || selectedAction.scope}</div>
                <div>Category: <span className="font-semibold">{selectedAction.category || selectedAction.targetRole}</span></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Executive Sign-Off Remark
                </label>
                <textarea
                  required
                  rows={3}
                  value={oversightNote}
                  onChange={(e) => setOversightNote(e.target.value)}
                  placeholder="Record executive oversight concurrence or instructions..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAction(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Sign Off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
