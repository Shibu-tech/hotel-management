import React, { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import {
  User,
  Shield,
  Key,
  Clock,
  Laptop,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  DollarSign,
  Phone,
  Mail,
  Building,
  Save,
  RefreshCw
} from 'lucide-react';

export default function FrontDeskProfile() {
  const {
    frontDeskProfile,
    updateFrontDeskProfile,
    toggleFinancialAccess
  } = useTaskContext();

  const [formData, setFormData] = useState({
    name: frontDeskProfile?.name || 'Sarah Jenkins',
    email: frontDeskProfile?.email || 'sarah.jenkins@grandazure.hotel',
    station: frontDeskProfile?.station || 'Terminal-01 (Lobby Main Desk)',
    phone: frontDeskProfile?.phone || '+1 (555) 234-5678 ext 102'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFrontDeskProfile({
      ...formData
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            SJ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{frontDeskProfile.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                Front Desk Coordinator
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Employee ID: <span className="font-mono text-slate-700 font-semibold">{frontDeskProfile.employeeId}</span> &bull; Shift: <span className="text-slate-700 font-medium">{frontDeskProfile.shift}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            On-Duty &bull; Terminal Active
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Details & Station Config */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Coordinator Station & Contact Info
            </h2>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Station settings successfully updated and logged to audit trail.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Station / Hardware Terminal</label>
                <input
                  type="text"
                  value={formData.station}
                  onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Internal Phone Extension</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Station Preferences
              </button>
            </div>
          </form>

          {/* Operational Boundaries & Authority */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              Role Authority & Operational Scope
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg">
                <div className="flex items-center gap-2 font-semibold text-emerald-900 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  Permitted Operations
                </div>
                <ul className="space-y-1 text-emerald-800 list-disc list-inside">
                  <li>Check-in with verified identity</li>
                  <li>Check-out with automatic turnover dispatch</li>
                  <li>Room moves to verified clean rooms</li>
                  <li>Guest service requests & department routing</li>
                  <li>Wake-up call scheduling and tracking</li>
                  <li>Operational reports and CSV exports</li>
                </ul>
              </div>

              <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg">
                <div className="flex items-center gap-2 font-semibold text-rose-900 mb-1">
                  <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  Restricted Operations
                </div>
                <ul className="space-y-1 text-rose-800 list-disc list-inside">
                  <li>Bypassing ID verification is strictly prohibited</li>
                  <li>Assigning uncleared or dirty rooms is blocked</li>
                  <li>Front Desk refund authority limit: $0.00</li>
                  <li>Independent refund approvals require Department Manager</li>
                  <li>Raw credit card credentials are never exposed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security Controls & Financial Access Toggle */}
        <div className="space-y-6">
          {/* Interactive Financial Permission Toggle (Section 2 & 12 Demo Verification) */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-xl shadow-md border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm">Financial Permission Guard</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                frontDeskProfile.hasFinancialAccess
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {frontDeskProfile.hasFinancialAccess ? 'Authorized' : 'Restricted'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Section 2 & 12 requirement: Hide or guard <code className="text-indigo-300 bg-indigo-950/80 px-1 py-0.5 rounded">/frontdesk/payments</code> and financial actions when permission is absent.
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-200">
                Financial Operations Access:
              </span>
              <button
                type="button"
                onClick={toggleFinancialAccess}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  frontDeskProfile.hasFinancialAccess ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    frontDeskProfile.hasFinancialAccess ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Toggle this switch to test the permission guard behavior in the sidebar navigation and routes.
            </p>
          </div>

          {/* Supervisor Escalation Chain */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Escalation Chain & Management
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-blue-600 uppercase">Immediate Shift Supervisor</span>
                <p className="font-semibold text-slate-900 mt-0.5">Marcus Vance</p>
                <p className="text-slate-500">Ext: 110 &bull; Radio Ch: 2</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Department Manager</span>
                <p className="font-semibold text-slate-900 mt-0.5">Elena Rostova</p>
                <p className="text-slate-500">Ext: 101 &bull; Executive Suite 4B</p>
                <p className="text-[11px] text-amber-600 mt-1 font-medium">&bull; Authorized for refunds &gt; $0.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
