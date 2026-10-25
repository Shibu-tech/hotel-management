import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  CheckCircle2,
  XCircle,
  Info,
  Building2,
  Users,
  Award,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { ALL_ROLE_PROFILES } from '../../utils/permissions';

export default function AdminRoles() {
  const [selectedRoleKey, setSelectedRoleKey] = useState('platform_admin');

  const rolesData = [
    {
      key: 'platform_admin',
      name: 'Platform Administrator',
      category: 'System & Technical Administration',
      description: 'Enterprise IT infrastructure, user provisioning, integration health, system configuration, backups, and audit security.',
      badgeColor: 'bg-cyan-100 text-cyan-950 border-cyan-200',
      permittedScopes: ['Enterprise IT Infrastructure', 'System Directories', 'Audit Vaults'],
      separationOfDuties: [
        'BARRED from Financial Refund Execution or Disbursement',
        'BARRED from Direct Guest Folio Settlements or Cash Handling',
        'Cannot modify append-only administrative audit log entries'
      ],
      permissions: [
        { name: 'User Management (Provision, Suspend, Edit)', granted: true },
        { name: 'Role Assignment & Scope Delegation', granted: true },
        { name: 'Integration Monitoring & Health Diagnostic Pings', granted: true },
        { name: 'System Settings & Property Parameters Configuration', granted: true },
        { name: 'Database Snapshots & Disaster Recovery Restore', granted: true },
        { name: 'Read-Only Audit Trail Oversight', granted: true },
        { name: 'Financial Refund Approval & Execution', granted: false },
        { name: 'Guest Room Keycard Physical Issuance', granted: false }
      ]
    },
    {
      key: 'executive',
      name: 'Executive Viewer/Approver',
      category: 'Executive Leadership & Oversight',
      description: 'Hotel-wide operational performance, critical escalations, delegated approvals ($10k cap), reports, and compliance oversight.',
      badgeColor: 'bg-indigo-100 text-indigo-950 border-indigo-200',
      permittedScopes: ['Hotel-Wide Operations', 'Financial Recoveries up to $10,000', 'Enterprise Compliance'],
      separationOfDuties: [
        'BARRED from Direct Payment Execution (Disbursement handled by Finance)',
        'BARRED from Self-Approving submitted recovery or refund requests',
        'BARRED from Technical IT System Configuration'
      ],
      permissions: [
        { name: 'Hotel-Wide Cross-Department Visibility', granted: true },
        { name: 'Delegated Approvals (Up to $10,000 USD limit)', granted: true },
        { name: 'Executive Directives on Critical Incidents', granted: true },
        { name: 'Multi-Department Performance Analytics & Exports', granted: true },
        { name: 'Policy & Access Certification Oversight', granted: true },
        { name: 'Direct Financial Disbursement Execution', granted: false },
        { name: 'Self-Approval of Personal Concessions', granted: false },
        { name: 'Platform Database & IT Configuration', granted: false }
      ]
    },
    {
      key: 'finance',
      name: 'Financial Operator',
      category: 'Finance & Revenue Accounting',
      description: 'Guest billing ledger, folio settlements, payment reconciliation, discrepancy audits, and refund execution.',
      badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-200',
      permittedScopes: ['Billing Ledger', 'Payment Gateways', 'Folio Reconciliation'],
      separationOfDuties: [
        'Executes approved disbursements within configured gateway limits',
        'BARRED from Modifying System Technical Parameters'
      ],
      permissions: [
        { name: 'Record & Settle Guest Folio Payments', granted: true },
        { name: 'Dispatch Gateway Refund Disbursements', granted: true },
        { name: 'Daily Payment Reconciliation Batches', granted: true },
        { name: 'Ledger Discrepancy Audits & Adjustments', granted: true },
        { name: 'Platform User Provisioning', granted: false }
      ]
    },
    {
      key: 'security',
      name: 'Security Responder',
      category: 'Safety & Physical Asset Protection',
      description: 'Physical security incidents, priority alarms, guest safety escalations, digital evidence custody, and shift handovers.',
      badgeColor: 'bg-rose-100 text-rose-950 border-rose-200',
      permittedScopes: ['Resort Property Security', 'Evidence Locker', 'Access Alarms'],
      separationOfDuties: [
        'Evidence files stored in secure S3 vault with SHA-256 integrity seal',
        'BARRED from Modifying Financial Records or Ledgers'
      ],
      permissions: [
        { name: 'Create & Triage Security Incidents', granted: true },
        { name: 'Dispatch Backup Units & Emergency Alarms', granted: true },
        { name: 'Upload & Seal Digital Evidence', granted: true },
        { name: 'Conduct Security Shift Handovers', granted: true },
        { name: 'Financial Refund Execution', granted: false }
      ]
    },
    {
      key: 'frontdesk',
      name: 'Front Desk Coordinator',
      category: 'Guest Experience & Front Office',
      description: 'Arrivals, departures, room assignments, keycard issuance, guest folios, and service recovery requests up to $50.',
      badgeColor: 'bg-blue-100 text-blue-950 border-blue-200',
      permittedScopes: ['Lobby & Front Office', 'Guest Room Allocations', 'Folio Charges'],
      separationOfDuties: [
        'Concessions over $50 require Manager approval; over $100 require Executive approval',
        'BARRED from System Administrator Controls'
      ],
      permissions: [
        { name: 'Guest Check-In / Check-Out Processing', granted: true },
        { name: 'Room Keycard Encoding & Allocation', granted: true },
        { name: 'Initial Service Recovery Submission ($50 limit)', granted: true },
        { name: 'Post Incidentals to Guest Folio', granted: true },
        { name: 'Disaster Recovery Database Backups', granted: false }
      ]
    },
    {
      key: 'manager',
      name: 'Department Manager',
      category: 'Departmental Leadership',
      description: 'Operational team oversight, schedule management, guest complaint escalations, and recoveries up to $100.',
      badgeColor: 'bg-purple-100 text-purple-950 border-purple-200',
      permittedScopes: ['Assigned Department', 'Complaints Queue', 'Staff Scheduling'],
      separationOfDuties: [
        'Approvals capped at $100; larger items auto-escalate to Executive',
        'BARRED from Cross-Department Override without Executive sign-off'
      ],
      permissions: [
        { name: 'Department Staff Scheduling & Shifts', granted: true },
        { name: 'Guest Complaint Triage & Resolution', granted: true },
        { name: 'Service Recovery Approval (Up to $100)', granted: true },
        { name: 'SLA Performance Monitoring', granted: true },
        { name: 'Platform Integration Reconfiguration', granted: false }
      ]
    },
    {
      key: 'supervisor',
      name: 'Department Supervisor',
      category: 'Shift Execution & Quality Assurance',
      description: 'Shift coordination, blocker clearing, task quality audits, corrective action plans, and shift handovers.',
      badgeColor: 'bg-teal-100 text-teal-950 border-teal-200',
      permittedScopes: ['Shift Operations', 'Quality Audits', 'Floor Blockers'],
      separationOfDuties: ['Operational shift focus; no direct financial approval authority'],
      permissions: [
        { name: 'Task Blocker Clearing & Escalation', granted: true },
        { name: 'Quality Inspection Audit Logging', granted: true },
        { name: 'Shift Handover Dispatches', granted: true },
        { name: 'Staff Workload Rebalancing', granted: true },
        { name: 'Financial Refund Execution', granted: false }
      ]
    },
    {
      key: 'dispatcher',
      name: 'Department Dispatcher',
      category: 'Dispatch & Intake Coordination',
      description: 'Task triage, priority routing, automated assignment to fulfillers, and real-time operational communications.',
      badgeColor: 'bg-amber-100 text-amber-950 border-amber-200',
      permittedScopes: ['Task Intake', 'Routing Rules', 'Fulfiller Queues'],
      separationOfDuties: ['Intake coordination only; cannot approve financial compensations'],
      permissions: [
        { name: 'Create & Assign Operational Tasks', granted: true },
        { name: 'Triage Priority & Category Allocation', granted: true },
        { name: 'Reassign Overdue Task Workload', granted: true },
        { name: 'System User Administration', granted: false }
      ]
    },
    {
      key: 'fulfiller',
      name: 'Task Fulfiller',
      category: 'Frontline Field Execution',
      description: 'Mobile execution of housekeeping requests, maintenance work orders, room service, and guest deliveries.',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
      permittedScopes: ['Personal Task Queue', 'Assigned Rooms', 'Field Status Updates'],
      separationOfDuties: ['Task fulfillment only; read-only on broader hotel financial/system records'],
      permissions: [
        { name: 'Accept & Update Assigned Tasks', granted: true },
        { name: 'Mark Tasks Completed with Resolution Notes', granted: true },
        { name: 'Report Field Blockers or Obstacles', granted: true },
        { name: 'Executive Level Metric Access', granted: false }
      ]
    }
  ];

  const currentRole = rolesData.find((r) => r.key === selectedRoleKey) || rolesData[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-cyan-100 text-cyan-950 border border-cyan-200">
              Role-Based Access Control (RBAC)
            </span>
            <span className="text-xs text-slate-500 font-medium">9 Canonical Enterprise Roles</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Roles & Permission Scopes Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict separation-of-duties governance: technical administration, financial execution, and executive authority remain strictly bounded.
          </p>
        </div>
      </div>

      {/* Role Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
        {rolesData.map((role) => {
          const isSelected = role.key === selectedRoleKey;
          return (
            <button
              key={role.key}
              onClick={() => setSelectedRoleKey(role.key)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-cyan-400'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-cyan-300'
              }`}
            >
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-70 mb-1">
                  {role.key.replace('_', ' ')}
                </div>
                <div className="text-xs font-black leading-tight">{role.name}</div>
              </div>
              <div className="mt-2 text-[10px] font-medium opacity-60">
                {role.permissions.filter((p) => p.granted).length} Perms
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Role Detail Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border ${currentRole.badgeColor}`}>
                {currentRole.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">Role ID: ROLE_{currentRole.key.toUpperCase()}</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">{currentRole.name}</h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">{currentRole.description}</p>
          </div>
        </div>

        {/* Permitted Scopes and Separation of Duties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyan-600" />
              Authorized Scopes & Domains
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {currentRole.permittedScopes.map((scope, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{scope}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200">
            <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              Separation of Duties & Restrictions
            </h4>
            <ul className="space-y-1.5 text-xs text-rose-950 font-medium">
              {currentRole.separationOfDuties.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Permissions Table */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Granular Capability Entitlements
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {currentRole.permissions.map((p, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  p.granted
                    ? 'bg-white border-slate-200 text-slate-800'
                    : 'bg-slate-50/60 border-slate-100 text-slate-400 line-through'
                }`}
              >
                <span className="font-semibold">{p.name}</span>
                {p.granted ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    Granted
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-600">
                    Restricted
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
