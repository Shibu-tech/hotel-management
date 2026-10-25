/**
 * Role Permissions & Scope Definition for Department Dispatcher
 *
 * The dispatcher may:
 * - View tasks within their authorized department scope.
 * - Create and categorize department tasks.
 * - Assign tasks to eligible staff within their scope.
 * - Schedule work and check staff availability.
 * - Monitor deadlines and workload.
 * - Record delays and authorized guest updates.
 * - Escalate tasks to the appropriate role.
 *
 * The dispatcher must NOT:
 * - Approve unrestricted refunds or compensation.
 * - Override room rates or POS prices.
 * - Access unrestricted financial records.
 * - Delete or conceal audit history.
 * - Reassign tasks outside their authorized scope.
 * - Access unrelated guest profiles or sensitive security records.
 * - Change their own role or privileges.
 */

export const DISPATCHER_ROLE_INFO = {
  roleId: 'ROLE_DEPT_DISPATCHER',
  title: 'Department Dispatcher',
  department: 'Housekeeping & Guest Services Ops',
  departmentCode: 'HKS-GS',
  scope: 'Department Task Queue, Staff Assignment & Workload Scheduling',
  authorizedCategories: [
    'Housekeeping',
    'Room Service',
    'Luggage & Bell',
    'Maintenance',
    'Amenities'
  ],
  restrictedFeatures: [
    'Financial Ledger & Guest Folios',
    'Room Rate Overrides & Billing Adjustments',
    'Payment Card / PCI Sensitive Storage',
    'Platform Super-Admin System Settings',
    'Staff Payroll & HR Disciplinary Records'
  ]
};

export const DISPATCHER_PROFILE = {
  id: 'EMP-304',
  name: 'Cynthia Vance',
  role: 'Department Dispatcher',
  department: 'Housekeeping & Guest Services',
  shift: 'Day Operations (07:00 – 16:00)',
  supervisor: 'Sarah Jenkins (Duty Floor Operations Manager)',
  email: 'c.vance@stayops-hotel.com',
  phoneExt: 'x4102',
  radioChannel: 'CH 04 (Service Ops)',
  accountStatus: 'Active / On Duty',
  deskLocation: 'Operations Center — Sub-level A, Room 104',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'
};

/**
 * Role Permissions & Scope Definition for Department Supervisor
 *
 * The supervisor may:
 * - Monitor tasks within their authorized team & department scope.
 * - Reassign tasks within permitted scope.
 * - Inspect work when review is required and approve or reopen with corrective instructions.
 * - Reopen incomplete or incorrect work while preserving audit logs.
 * - Record and track corrective actions.
 * - Coordinate blocker resolution (with strict safety lockouts).
 * - Escalate issues along the management chain.
 * - Create and manage shift handovers.
 *
 * The supervisor must NOT:
 * - Approve unrestricted refunds or financial compensation.
 * - Override room rates or POS prices.
 * - Access unrestricted financial records.
 * - Delete protected audit history.
 * - Access unrelated guest profiles or security evidence.
 * - Release unsafe rooms/areas without certified safety clearance.
 * - Assign tasks outside authorized scope.
 * - Modify their own role or permissions.
 */

export const SUPERVISOR_ROLE_INFO = {
  roleId: 'ROLE_DEPT_SUPERVISOR',
  title: 'Department Supervisor',
  department: 'Housekeeping & Guest Services Ops',
  departmentCode: 'HKS-GS',
  scope: 'Team Oversight, Reassignment, Quality Inspections, Blockers, Corrective Actions & Shift Handover',
  authorizedCategories: [
    'Housekeeping',
    'Room Service',
    'Luggage & Bell',
    'Maintenance',
    'Amenities'
  ],
  authorizedActions: [
    'Monitor department tasks & staff workload',
    'Reassign tasks within authorized team',
    'Conduct quality inspections & approve/reopen work',
    'Issue corrective actions to responsible staff',
    'Manage operational blockers and safety restrictions',
    'Create, update and acknowledge shift handovers',
    'Escalate severe or cross-department issues'
  ],
  restrictedFeatures: [
    'Unrestricted Financial Ledgers & Guest Folios',
    'Room Rate Overrides & Billing Adjustments',
    'Guest Payment Card / PCI Sensitive Storage',
    'Platform Super-Admin System Settings',
    'Modifying Own Role or Self-Elevating Privileges',
    'Releasing Unsafe Zones Without Certified Safety Clearance',
    'Staff Payroll & HR Disciplinary Records'
  ]
};

export const SUPERVISOR_PROFILE = {
  id: 'EMP-201',
  name: 'Sarah Jenkins',
  role: 'Department Supervisor',
  department: 'Housekeeping & Guest Services Ops',
  shift: 'Day Operations (06:30 – 15:30)',
  manager: 'Elena Rostova (Operations Manager)',
  email: 's.jenkins@stayops-hotel.com',
  phoneExt: 'x2010',
  radioChannel: 'CH 01 (Supervisor Command)',
  accountStatus: 'Active / On Duty',
  officeLocation: '2nd Floor Service Hub – Room 204',
  avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=256&q=80'
};

/**
 * Role Permissions & Scope Definition for Department Manager
 *
 * The Department Manager is responsible for:
 * - Department-wide operational performance oversight.
 * - Staffing & scheduling within authorized department scope.
 * - SLA monitoring & overdue-work intervention.
 * - Complaint coordination & resolution oversight.
 * - Delegated service-recovery approvals (up to $250.00).
 * - Reviewing department workload and performance reports.
 * - Escalating serious, unowned, cross-department, or unresolved cases.
 *
 * The Department Manager must NOT:
 * - Administer platform super-admin configuration or modify user access across other departments.
 * - Approve unrestricted refunds or compensation exceeding delegated limit ($250.00).
 * - Override room rates or POS prices without finance department sign-off.
 * - Access unrestricted financial ledgers or raw guest credit card credentials.
 * - Access unrelated sensitive security incident records.
 * - Delete protected audit history.
 * - Self-approve their own service-recovery requests.
 * - Modify their own role or self-elevate permissions.
 */

export const MANAGER_ROLE_INFO = {
  roleId: 'ROLE_DEPT_MANAGER',
  title: 'Department Manager',
  department: 'Housekeeping & Guest Services Ops',
  departmentCode: 'HKS-GS',
  scope: 'Department Operations, Staff Scheduling, SLA Oversight, Complaint Resolution & Delegated Approvals',
  delegatedApprovalLimit: 250.00, // Maximum USD service-recovery approval authority
  currency: 'USD',
  authorizedCategories: [
    'Housekeeping',
    'Room Service',
    'Luggage & Bell',
    'Maintenance',
    'Amenities'
  ],
  authorizedActions: [
    'Monitor department-wide operational KPIs & SLA compliance',
    'Manage staff schedules, shift rosters & workload balance',
    'Intervene in overdue, unassigned, or blocked tasks',
    'Coordinate guest complaint resolution & assign case owners',
    'Approve eligible service-recovery requests up to $250.00',
    'Escalate requests exceeding delegated authority to General Manager',
    'Review department operational reports & export audit metrics',
    'Trigger immediate emergency & security escalation protocol'
  ],
  restrictedFeatures: [
    'Unrestricted Financial Ledgers & Raw PCI Credit Card Data',
    'Approval of Service Recovery / Compensation Exceeding $250.00',
    'Platform Super-Administrator System Settings',
    'Modifying Own Role or Self-Elevating Security Permissions',
    'Self-Approval of Own Service-Recovery Requests',
    'Deletion or Alteration of Historical Audit Logs',
    'Cross-Department Unrestricted Account Administration'
  ]
};

export const MANAGER_PROFILE = {
  id: 'EMP-102',
  name: 'Elena Rostova',
  role: 'Department Manager',
  department: 'Housekeeping & Guest Services Ops',
  departmentCode: 'HKS-GS',
  shift: 'Executive Day Operations (07:30 – 17:00)',
  manager: 'Marcus Sterling (General Manager)',
  email: 'e.rostova@stayops-hotel.com',
  phoneExt: 'x1020',
  radioChannel: 'CH 01 (Command)',
  accountStatus: 'Active / Authorized',
  officeLocation: 'Executive Operations Suite — 3rd Floor, Room 302',
  delegatedApprovalLimit: 250.00,
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'
};

/**
 * Role Permissions & Scope Definition for Front Desk Coordinator
 *
 * The Front Desk Coordinator manages guest-facing operations:
 * - View and manage hotel reservations within permitted scope.
 * - Register guests and perform verified check-in & check-out workflows.
 * - Check room clearance and block check-in to uncleared/dirty rooms.
 * - Trigger automatic room turnover for housekeeping upon check-out.
 * - Route guest requests to correct hotel departments with unassigned queue support.
 * - Maintain separate assignment status from execution status.
 * - Log guest communications and dispatch simulated alerts.
 * - Manage guest complaints, designate case owners, and coordinate service recovery.
 * - Coordinate room moves subject to destination room readiness and clearance.
 * - Schedule, monitor, and record wake-up calls.
 * - Conditional financial controls (folio viewing, payment recording, refund initiation).
 *
 * Front Desk Coordinator Restrictions:
 * - Never bypass guest identity verification or room-readiness requirements.
 * - Do not permit occupancy of an uncleared or uninspected room.
 * - Do not approve or execute unrestricted refunds (requires Manager approval).
 * - Never view or store raw credit card numbers or CVVs.
 * - Do not delete historical audit records or system logs.
 */
export const FRONTDESK_ROLE_INFO = {
  roleId: 'ROLE_FRONT_DESK_COORDINATOR',
  title: 'Front Desk Coordinator',
  department: 'Front Office & Guest Services',
  departmentCode: 'FO-GS',
  scope: 'Guest Reservations, Verified Check-In/Out, Room Moves, Wake-up Calls, Department Routing & Initial Service Recovery',
  delegatedRefundApprovalLimit: 0.00, // Front desk may initiate refunds but cannot approve them independently
  currency: 'USD',
  authorizedCategories: [
    'Housekeeping',
    'Maintenance',
    'Luggage & Bell',
    'Room Service',
    'Amenities',
    'Front Desk',
    'Transportation',
    'Concierge'
  ],
  financialPermissions: {
    canViewFolio: true,
    canCollectPayment: true,
    canPostCharge: true,
    canInitiateRefund: true,
    canApproveRefund: false,
    canExecuteRefund: false,
    canOverrideRoomRate: false
  },
  authorizedActions: [
    'View and manage reservations within hotel scope',
    'Execute guest identity verification and registration card signing',
    'Perform check-in workflow with mandatory room readiness validation',
    'Perform check-out with automatic housekeeping turnover dispatch',
    'Create guest requests and route to Housekeeping, Maintenance, Concierge',
    'Track unassigned requests queue and assign available department staff',
    'Log multi-channel guest communications (SMS, WhatsApp, In-App, Call)',
    'Open and manage guest complaint cases with response SLA tracking',
    'Initiate service recovery refund requests for Manager approval',
    'Coordinate room moves with real-time clearance and readiness verification',
    'Schedule, execute and track guest wake-up calls with retry history',
    'Review guest folios and collect authorized credit card / cash payments'
  ],
  restrictedFeatures: [
    'Check-in Without ID Verification or Room Cleanliness Clearance',
    'Occupancy or Move to Dirty / Maintenance Locked Rooms',
    'Unrestricted Refund Approvals (Exceeding $0.00 - Routes to Manager)',
    'Viewing Raw Credit Card Numbers or Security CVVs',
    'Room Rate Overrides or POS Adjustments Without Finance Approval',
    'Modifying Own Role or Self-Elevating Security Permissions',
    'Deletion or Alteration of Historical Audit Logs',
    'Platform Super-Administrator System Settings'
  ]
};

export const FRONTDESK_PROFILE = {
  id: 'EMP-401',
  name: 'David Martinez',
  role: 'Front Desk Coordinator',
  department: 'Front Office & Guest Services',
  departmentCode: 'FO-GS',
  shift: 'Morning / Day Operations (07:00 – 15:30)',
  manager: 'Elena Rostova (Operations Manager)',
  email: 'd.martinez@stayops-hotel.com',
  phoneExt: 'x4010',
  radioChannel: 'CH 02 (Front Desk & Concierge)',
  accountStatus: 'Active / On Duty',
  terminal: 'Main Lobby Desk — Terminal 02',
  hasFinancialAccess: true, // Toggleable for permission testing
  financialPermissions: {
    canViewFolio: true,
    canCollectPayment: true,
    canPostCharge: true,
    canInitiateRefund: true,
    canApproveRefund: false,
    canExecuteRefund: false
  },
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
};

/**
 * Role Permissions & Scope Definition for Financial Operator
 *
 * Responsibilities:
 * - View authorized guest folios and charges/payments breakdown.
 * - View detailed payment gateway transactions safely (masked credentials).
 * - Record or collect permitted payments and post authorized adjustments.
 * - Reconcile internal transactions against payment gateway settlement batches.
 * - Investigate, triage, and resolve financial discrepancies.
 * - Submit refund requests and execute approved refunds with strict separation of duties.
 * - Access operational financial reports and export audited metrics.
 * - Inspect the immutable financial audit log.
 *
 * Prohibitions:
 * - Requester cannot approve their own refund request.
 * - Operators cannot execute refunds exceeding their approval limit ($1,000.00).
 * - Cannot view or store raw credit card numbers, CVVs, or gateway API secret keys.
 * - Cannot delete, edit, or tamper with posted financial transactions or audit entries.
 * - Cannot grant themselves unassigned permissions or elevate role scopes.
 */
export const FINANCE_ROLE_INFO = {
  roleId: 'ROLE_FINANCIAL_OPERATOR',
  title: 'Financial Operator',
  department: 'Finance & Revenue Accounting',
  departmentCode: 'FIN-REV',
  propertyScope: 'Grand Azure Bay Resort & Conference Center (Property #048)',
  approvalLimitUSD: 1000.00,
  currency: 'USD',
  granularPermissions: {
    'folio.read': true,
    'folio.adjust': true,
    'transaction.read': true,
    'payment.record': true,
    'reconciliation.manage': true,
    'discrepancy.manage': true,
    'refund.request': true,
    'refund.approve': true,
    'refund.execute': true,
    'report.read': true,
    'report.export': true,
    'financial_audit.read': true
  },
  authorizedActions: [
    'View authorized guest folios, rate breakdowns, and itemized charges',
    'Record and collect authorized guest payments with gateway authorization codes',
    'Post auditable adjustments and ledger reversals with mandatory rationale',
    'View transaction logs with safe masked card credentials (PCI-DSS compliant)',
    'Run automated and manual reconciliation batches against gateway settlements',
    'Triage, investigate, and resolve financial discrepancies and variances',
    'Submit guest refund requests with balance and duplicate execution validation',
    'Approve eligible refund requests up to delegated $1,000.00 policy limit',
    'Execute approved refunds through payment provider with idempotency protection',
    'Generate daily, weekly, and monthly financial summaries and revenue reports',
    'Export financial reports with mandatory access logging and audit tracking',
    'Review the immutable chronological financial audit trail'
  ],
  restrictedFeatures: [
    'Self-Approval of Own Submitted Refund Requests (Strict Separation of Duties)',
    'Refund Execution Exceeding Authorized Limit ($1,000.00 - requires CFO/GM sign-off)',
    'Access or Exposure of Unmasked Primary Account Numbers (PAN) or CVVs',
    'Deletion or In-Place Modification of Posted Ledger Transactions',
    'Platform Super-Administrator User and System Configuration',
    'Cross-Property Data Access Outside Assigned Property #048 Scope',
    'Direct Editing of Historical Financial Audit Records'
  ]
};

export const FINANCE_PROFILE = {
  id: 'EMP-501',
  name: 'Marcus Sterling',
  role: 'Financial Operator',
  title: 'Senior Financial Operations Specialist',
  department: 'Finance & Revenue Operations',
  departmentCode: 'FIN-REV',
  propertyScope: 'Grand Azure Bay Resort & Conference Center (Property #048)',
  propertyId: 'PROP-048',
  shift: 'Finance Core Operations (08:30 – 17:30)',
  manager: 'Julian Thorne (Director of Finance & Controller)',
  email: 'm.sterling@stayops-hotel.com',
  phoneExt: 'x5010',
  accountStatus: 'Active / Authorized',
  workstation: 'Finance Hub — West Wing, Suite 410',
  approvalLimitUSD: 1000.00,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  permissions: {
    'folio.read': true,
    'folio.adjust': true,
    'transaction.read': true,
    'payment.record': true,
    'reconciliation.manage': true,
    'discrepancy.manage': true,
    'refund.request': true,
    'refund.approve': true,
    'refund.execute': true,
    'report.read': true,
    'report.export': true,
    'financial_audit.read': true
  }
};

/**
 * Role Permissions & Scope Definition for Security Responder
 */
export const SECURITY_ROLE_INFO = {
  roleId: 'ROLE_SECURITY_RESPONDER',
  title: 'Security Responder',
  department: 'Safety & Security Operations',
  departmentCode: 'SEC-SAFE',
  scope: 'Emergency Incident Protocol, Asset Protection, Floor Patrols & Safety Lockouts',
  authorizedCategories: [
    'Emergency',
    'Safety',
    'Security',
    'Maintenance Blocker',
    'Incident'
  ],
  authorizedActions: [
    'Receive and acknowledge emergency incident dispatches',
    'Enforce and certify safety lockouts for compromised hotel rooms',
    'Investigate and document hotel security occurrences and incident logs',
    'Coordinate priority medical, fire, and police emergency dispatches',
    'Conduct verified security patrols and floor checks'
  ],
  restrictedFeatures: [
    'Guest Financial Folios & Cashier Transactions',
    'Room Rate Adjustments & Revenue Ledgers',
    'Staff Payroll & HR Disciplinary Records',
    'Payment Card / PCI Sensitive Storage',
    'Platform Super-Admin System Settings'
  ]
};

export const SECURITY_PROFILE = {
  id: 'EMP-601',
  name: 'Marcus Vance',
  role: 'Security Responder',
  title: 'Lead Safety & Security Officer',
  department: 'Safety & Security Operations',
  departmentCode: 'SEC-SAFE',
  shift: 'Emergency On-Duty (20:00 – 06:00)',
  manager: 'Elena Rostova (Operations Manager)',
  email: 'm.vance@stayops-hotel.com',
  phoneExt: 'x6010',
  radioChannel: 'CH 03 (Emergency Command)',
  accountStatus: 'Active / Authorized',
  terminal: 'Security Control Hub — Sub-Level 1',
  avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  permissions: {
    'incident.read': true,
    'incident.create': true,
    'incident.acknowledge': true,
    'incident.respond': true,
    'incident.manage': true,
    'incident.close': true,
    'backup.request': true,
    'backup.respond': true,
    'escalation.create': true,
    'evidence.view': true,
    'evidence.upload': true,
    'handover.manage': true,
    'emergency.dispatch': true,
    'lockout.certify': true,
    'patrol.record': true
  }
};

/**
 * Normalizes any role identifier or role title into a standard internal key:
 * - 'financial_operator'
 * - 'frontdesk'
 * - 'manager'
 * - 'supervisor'
 * - 'dispatcher'
 * - 'security'
 * - 'fulfiller'
 */
export function normalizeRole(roleInput) {
  if (!roleInput) return null;
  const clean = String(roleInput).trim().toLowerCase().replace(/[\s-_]+/g, '_');

  if (
    clean === 'financial_operator' ||
    clean === 'financialoperator' ||
    clean === 'finance' ||
    clean === 'role_financial_operator' ||
    clean.includes('financial')
  ) {
    return 'financial_operator';
  }

  if (
    clean === 'front_desk_coordinator' ||
    clean === 'frontdeskcoordinator' ||
    clean === 'frontdesk' ||
    clean === 'front_desk' ||
    clean === 'role_front_desk_coordinator'
  ) {
    return 'frontdesk';
  }

  if (
    clean === 'department_manager' ||
    clean === 'departmentmanager' ||
    clean === 'manager' ||
    clean === 'operations_manager' ||
    clean === 'role_dept_manager'
  ) {
    return 'manager';
  }

  if (
    clean === 'department_supervisor' ||
    clean === 'departmentsupervisor' ||
    clean === 'supervisor' ||
    clean === 'role_dept_supervisor'
  ) {
    return 'supervisor';
  }

  if (
    clean === 'department_dispatcher' ||
    clean === 'departmentdispatcher' ||
    clean === 'dispatcher' ||
    clean === 'role_dept_dispatcher'
  ) {
    return 'dispatcher';
  }

  if (
    clean === 'security_responder' ||
    clean === 'securityresponder' ||
    clean === 'security' ||
    clean === 'emergency_security' ||
    clean === 'safety_security' ||
    clean === 'role_security_responder'
  ) {
    return 'security';
  }

  if (
    clean === 'task_fulfiller' ||
    clean === 'taskfulfiller' ||
    clean === 'fulfiller' ||
    clean === 'attendant_runner' ||
    clean === 'runner' ||
    clean === 'role_task_fulfiller'
  ) {
    return 'task_fulfiller';
  }

  if (
    clean === 'executive' ||
    clean === 'executive_approver' ||
    clean === 'executive_viewer' ||
    clean === 'executive_viewer_approver' ||
    clean === 'role_executive_approver' ||
    clean === 'executiveapprover' ||
    clean.includes('executive')
  ) {
    return 'executive';
  }

  if (
    clean === 'platform_admin' ||
    clean === 'platform_administrator' ||
    clean === 'platformadmin' ||
    clean === 'platformadministrator' ||
    clean === 'admin' ||
    clean === 'administrator' ||
    clean === 'system_admin' ||
    clean === 'sysadmin' ||
    clean === 'role_platform_admin'
  ) {
    return 'platform_admin';
  }

  return clean;
}

/**
 * Role Permissions & Scope Definition for Task Fulfiller (Attendants, Runners, Bell Staff, Servers)
 */
export const FULFILLER_ROLE_INFO = {
  roleId: 'ROLE_TASK_FULFILLER',
  title: 'Task Fulfiller',
  department: 'Housekeeping & Guest Operations Support',
  departmentCode: 'HKS-OPS',
  scope: 'Assigned Task Execution, En Route Tracking, Delivery/Collection Confirmation & Blocker Reporting',
  authorizedCategories: [
    'Housekeeping',
    'Room Service',
    'Luggage & Bell',
    'Maintenance',
    'Amenities'
  ],
  authorizedActions: [
    'View personally assigned guest service and room tasks',
    'Inspect eligible unassigned task queue and claim eligible department tasks',
    'Advance task lifecycle states: Accept & Start, On the Way, and Confirm Delivery',
    'Record task execution progress notes and observations',
    'Report operational blockers and shortages with structured severity logging',
    'Confirm delivery handover or collection completion'
  ],
  restrictedFeatures: [
    'Guest Financial Folios & Cashier Billing',
    'Payment Card / PCI Sensitive Storage',
    'Room Rate Overrides & Revenue Adjustments',
    'Refund Approvals or Delegated Financial Compensation',
    'Reassigning Other Staff Members Tasks',
    'Modifying Department Staff Schedules or Shift Rosters',
    'Overriding Safety Blockers Without Clearance',
    'Platform Super-Administrator System Settings'
  ]
};

export const FULFILLER_PROFILE = {
  id: 'EMP-418',
  name: 'Marcus Alvarez',
  role: 'Task Fulfiller',
  title: 'Senior Floor Attendant & Runner',
  department: 'Housekeeping & Guest Operations',
  departmentCode: 'HKS-OPS',
  shift: 'Morning Shift (07:00 – 15:30)',
  manager: 'Elena Rostova (Department Manager)',
  supervisor: 'Sarah Jenkins (Department Supervisor)',
  dispatcher: 'Cynthia Vance (Department Dispatcher)',
  email: 'm.alvarez@stayops-hotel.com',
  phoneExt: 'x4180',
  radioChannel: 'CH 04 (Service Ops)',
  accountStatus: 'Active / On Duty',
  terminal: 'Mobile Service Runner Terminal #04',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  skills: ['Housekeeping', 'Amenities', 'Luggage & Bell'],
  permissions: {
    'task.read': true,
    'task.update_status': true,
    'task.claim': true,
    'task.block': true,
    'task.note': true,
    'delivery.confirm': true
  }
};

/**
 * Role Permissions & Scope Definition for Executive Viewer/Approver
 *
 * Responsibilities:
 * - Hotel-wide operational and financial performance oversight
 * - Review and decisioning on delegated executive approvals (up to $10,000.00)
 * - Cross-department escalation oversight & strategic direction
 * - Policy compliance, audit reviews, and high-tier service recovery decisions
 *
 * Prohibitions & Strict Separation of Duties:
 * - Must NOT directly execute financial refunds or gateway disbursements (Financial Operator responsibility)
 * - Must NOT alter technical platform configurations, system settings, or IT integrations (Platform Administrator responsibility)
 * - Cannot self-approve requests they personally submitted
 * - Cannot access unredacted PCI-DSS card credentials or raw security forensics evidence
 */
export const EXECUTIVE_ROLE_INFO = {
  roleId: 'ROLE_EXECUTIVE_APPROVER',
  title: 'Executive Viewer/Approver',
  department: 'Executive Management & Corporate Governance',
  departmentCode: 'EXEC-GOV',
  scope: 'Hotel-wide Performance, Escalations, Reports & Delegated Approvals',
  approvalLimitUSD: 10000.00,
  currency: 'USD',
  authorizedActions: [
    'Review executive KPI overview, cross-department SLA performance, and trends',
    'Review and resolve escalations requiring executive intervention',
    'Decision delegated executive approvals (service recoveries & refunds up to $10,000.00)',
    'Analyze aggregated department performance, task completion velocity, and complaints',
    'Inspect compliance oversight, policy reviews, and access certifications',
    'Export executive-level operational performance and financial compliance reports'
  ],
  restrictedFeatures: [
    'Direct Financial Disbursement / Gateway Execution (Strict Separation of Duties)',
    'Platform Technical Administration, User Directory Deletion & System Configuration',
    'Self-Approval of Personal Reimbursement or Recovery Submissions',
    'Unrestricted Forensic Security Evidence Vault Decryption',
    'Modification of Historical Immutable Audit Trails'
  ]
};

export const EXECUTIVE_PROFILE = {
  id: 'EMP-001',
  name: 'Victoria Montgomery',
  role: 'Executive Viewer/Approver',
  title: 'Executive Vice President & Managing Director',
  department: 'Executive Management & Operations Oversight',
  departmentCode: 'EXEC-LEAD',
  email: 'v.montgomery@stayops-hotel.com',
  phoneExt: 'x1001',
  officeLocation: 'Executive Suite Tower — Level 18, Suite 1800',
  accountStatus: 'Active / Authorized',
  approvalLimitUSD: 10000.00,
  authorityLimit: 10000.00,
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  permissions: {
    'executive.dashboard': true,
    'executive.read': true,
    'executive.departments': true,
    'executive.escalations': true,
    'executive.approvals': true,
    'executive.reports': true,
    'executive.compliance': true,
    'approval.executive': true,
    'refund.approve': true,
    'recovery.approve': true,
    'incident.read': true,
    'task.read': true,
    'sla.read': true
    // Strictly NO 'refund.execute' or 'admin.manage'
  }
};

/**
 * Role Permissions & Scope Definition for Platform Administrator
 *
 * Responsibilities:
 * - Technical platform administration, access controls, user provisioning, and role governance
 * - Integration health monitoring, API service diagnostics, and connection verification
 * - System configuration management, session policies, MFA enforcement, and QR mappings
 * - Protected administrative audit log review (read-only, immutable protection)
 * - Backup scheduling, snapshot tracking, and authorized recovery verification
 *
 * Prohibitions & Strict Separation of Duties:
 * - Must NOT approve guest refunds or financial credits (Executive / Finance responsibility)
 * - Must NOT execute payments, post ledger adjustments, or alter folios
 * - Cannot delete or tamper with protected audit log streams
 * - Cannot deactivate the last remaining administrator account
 * - Cannot grant self-escalating bypasses to financial execution engines
 */
export const ADMIN_ROLE_INFO = {
  roleId: 'ROLE_PLATFORM_ADMIN',
  title: 'Platform Administrator',
  department: 'Information Technology & Enterprise Platform Engineering',
  departmentCode: 'IT-PLATFORM',
  scope: 'User Access, System Configuration, Integrations & Audit Logs',
  authorizedActions: [
    'Provision, invite, update, and manage hotel platform user accounts',
    'Assign and verify authorized role profiles and permission boundaries',
    'Monitor system health, database latency, and third-party integration statuses',
    'Configure property settings, time zones, notification rules, and session policies',
    'Review comprehensive immutable administrative and security audit trails',
    'Monitor backup schedules, trigger manual backup snapshots, and verify recovery states'
  ],
  restrictedFeatures: [
    'Financial Refund Approval or Gateway Execution (Separation of Administration and Finance)',
    'Posting Ledger Adjustments or Modifying Guest Folio Balances',
    'Deletion or In-Place Alteration of Protected Audit Logs',
    'Deactivation or Removal of the Final Platform Administrator Account',
    'Exposure or Export of Raw Cryptographic Keys, Passwords, or PCI-DSS Credentials'
  ]
};

export const ADMIN_PROFILE = {
  id: 'EMP-099',
  name: 'Alexandre Vance',
  role: 'Platform Administrator',
  title: 'Lead Enterprise Systems & Security Architect',
  department: 'Information Technology & Platform Systems',
  departmentCode: 'IT-PLATFORM',
  email: 'a.vance@stayops-hotel.com',
  phoneExt: 'x9001',
  terminal: 'Systems Operations Center — NOC Suite B1',
  accountStatus: 'Active / Authorized',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  permissions: {
    'admin.dashboard': true,
    'admin.users': true,
    'admin.roles': true,
    'admin.integrations': true,
    'admin.settings': true,
    'admin.audit': true,
    'admin.backups': true,
    'admin.profile': true
    // Strictly NO 'refund.approve', 'refund.execute', or 'folio.adjust'
  }
};

/**
 * Standard default entry routes for all roles
 */
export const ROLE_DEFAULT_ROUTES = {
  financial_operator: '/finance/dashboard',
  frontdesk: '/frontdesk/dashboard',
  manager: '/manager/dashboard',
  supervisor: '/supervisor/dashboard',
  dispatcher: '/dispatcher/dashboard',
  security: '/security/dashboard',
  task_fulfiller: '/task-fulfiller/dashboard',
  fulfiller: '/task-fulfiller/dashboard',
  executive: '/executive/dashboard',
  platform_admin: '/admin/dashboard',
  admin: '/admin/dashboard'
};

/**
 * Map of normalized roles to their canonical profile templates
 */
export const ALL_ROLE_PROFILES = {
  financial_operator: FINANCE_PROFILE,
  frontdesk: FRONTDESK_PROFILE,
  manager: MANAGER_PROFILE,
  supervisor: SUPERVISOR_PROFILE,
  dispatcher: DISPATCHER_PROFILE,
  security: SECURITY_PROFILE,
  task_fulfiller: FULFILLER_PROFILE,
  fulfiller: FULFILLER_PROFILE,
  executive: EXECUTIVE_PROFILE,
  executive_approver: EXECUTIVE_PROFILE,
  platform_admin: ADMIN_PROFILE,
  admin: ADMIN_PROFILE
};

/**
 * Checks whether userRole has access to the target role workspace
 */
export function isAuthorizedForRole(userRole, targetRole) {
  const normUser = normalizeRole(userRole);
  const normTarget = normalizeRole(targetRole);
  if (!normUser || !normTarget) return false;
  return normUser === normTarget;
}





