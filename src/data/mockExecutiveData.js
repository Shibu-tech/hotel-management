/**
 * StayOps Executive Viewer/Approver Mock Data & Governance Models
 * Contains Policy Reviews, Access Certifications, Executive Compliance Actions, and Historical Department Benchmarks.
 */

const now = Date.now();
const minutesAgo = (m) => new Date(now - m * 60 * 1000).toISOString();
const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString();
const daysAgo = (d) => new Date(now - d * 86400 * 1000).toISOString();

export const INITIAL_POLICY_REVIEWS = [
  {
    id: 'POL-REV-101',
    title: 'Executive Financial Delegation Thresholds & Separation-of-Duties Review',
    category: 'Corporate Finance & Governance',
    department: 'Finance & Executive Operations',
    assignedReviewer: 'Victoria Montgomery (Executive VP)',
    dueDate: '2026-11-15',
    status: 'Pending Executive Sign-off',
    priority: 'High',
    scope: 'Review of $250 Manager / $1,000 Finance / $10,000 Executive delegation tiers.',
    notes: 'Required annual SOX & PCI compliance calibration.'
  },
  {
    id: 'POL-REV-102',
    title: 'Hospitality Emergency Response & Crisis Escalation Protocol',
    category: 'Safety & Security Operations',
    department: 'Safety & Security',
    assignedReviewer: 'Victoria Montgomery (Executive VP)',
    dueDate: '2026-11-30',
    status: 'In Review',
    priority: 'Critical',
    scope: 'Protocol update for cross-department lockouts, AED access, and police liaison procedures.',
    notes: 'Jointly drafted with Security Supervisor Marcus Vance.'
  },
  {
    id: 'POL-REV-103',
    title: 'Guest Service Recovery & VIP Compensation Policy 2026',
    category: 'Guest Experience Standards',
    department: 'Front Office & Housekeeping',
    assignedReviewer: 'Victoria Montgomery (Executive VP)',
    dueDate: '2026-12-01',
    status: 'Scheduled',
    priority: 'Medium',
    scope: 'Guidelines for comp suites, transportation waivers, and spa vouchers.',
    notes: 'Q4 standard operational refresh.'
  }
];

export const INITIAL_ACCESS_CERTIFICATIONS = [
  {
    id: 'ACC-CERT-401',
    scope: 'Q4 Privileged Access Certification (Executive & Administrator Accounts)',
    targetRole: 'Platform Administrator & Executive Approver',
    totalAccounts: 2,
    certifiedAccounts: 2,
    status: 'Certified',
    certifiedBy: 'Victoria Montgomery (Executive VP)',
    certifiedAt: daysAgo(5),
    notes: 'All privileged IT and Executive credentials audited and verified active.'
  },
  {
    id: 'ACC-CERT-402',
    scope: 'Financial Operator Gateway Disbursement Authorization Scopes',
    targetRole: 'Financial Operator',
    totalAccounts: 2,
    certifiedAccounts: 1,
    status: 'Action Required',
    certifiedBy: 'Pending Executive Review',
    certifiedAt: null,
    notes: 'External Auditor Evelyn Reed access request awaiting executive confirmation.'
  },
  {
    id: 'ACC-CERT-403',
    scope: 'Master RFID Electronic Keycard & Physical Override Keys',
    targetRole: 'Security Responder & Duty Supervisors',
    totalAccounts: 14,
    certifiedAccounts: 14,
    status: 'Certified',
    certifiedBy: 'Marcus Vance & Elena Rostova',
    certifiedAt: daysAgo(2),
    notes: '100% accountability on all 14 physical master keys and emergency badges.'
  }
];

export const INITIAL_COMPLIANCE_ACTIONS = [
  {
    id: 'CMPL-ACT-01',
    title: 'Sub-Level 2 Laundry Duct Mechanical Safety Clearance',
    department: 'Maintenance & Facility Engineering',
    category: 'Fire Safety & Life Safety Code',
    status: 'Overdue (48h Breached)',
    urgency: 'Critical',
    deadline: hoursAgo(48),
    responsibleManager: 'David Kim (Facility Tech Lead)',
    actionRequired: 'Submit certified HVAC duct airflow inspection report to clear pre-alarm status.',
    impact: 'Potential safety shutdown if unverified.'
  },
  {
    id: 'CMPL-ACT-02',
    title: 'Semi-Annual Payment Terminal PCI Point-to-Point Encryption Verification',
    department: 'Finance & IT Platform',
    category: 'PCI-DSS Compliance',
    status: 'Pending Sign-off',
    urgency: 'Medium',
    deadline: daysAgo(-10),
    responsibleManager: 'Marcus Sterling (Financial Operator)',
    actionRequired: 'Verify tamper-evident physical inspection seals on all 6 front desk card terminals.',
    impact: 'Compliance certificate renewal due next week.'
  },
  {
    id: 'CMPL-ACT-03',
    title: 'Overdue Guest Complaint Escalation SLA Remediation',
    department: 'Housekeeping & Front Office',
    category: 'Service Quality Governance',
    status: 'In Progress',
    urgency: 'High',
    deadline: daysAgo(-2),
    responsibleManager: 'Elena Rostova (Department Manager)',
    actionRequired: 'Resolve root cause of delayed hypoallergenic duvet turnover in Suite 1204.',
    impact: 'Guest satisfaction retention.'
  }
];

export const INITIAL_EXECUTIVE_NOTIFICATIONS = [
  {
    id: 'EXEC-NOTIF-01',
    title: 'High-Value Recovery Escalation Awaiting Decision',
    message: 'REC-504 ($380.00 - Plumbing Leak Room 410) exceeds Department Manager limit ($250.00) and requires Executive sign-off.',
    timestamp: minutesAgo(15),
    priority: 'urgent',
    isRead: false,
    category: 'Approval',
    actionRoute: '/executive/approvals'
  },
  {
    id: 'EXEC-NOTIF-02',
    title: 'Incident Review: Silent Panic Alarm Triggered',
    message: 'ALT-101 at Front Desk Cashier Station 02 was acknowledged by Security Responder. Security incident under investigation.',
    timestamp: minutesAgo(28),
    priority: 'high',
    isRead: false,
    category: 'Escalation',
    actionRoute: '/executive/escalations'
  },
  {
    id: 'EXEC-NOTIF-03',
    title: 'SLA Performance Variance in Maintenance',
    message: 'Maintenance department average response time climbed to 24 min (target: 15 min) due to HVAC harmonic resonance calls.',
    timestamp: hoursAgo(2),
    priority: 'medium',
    isRead: true,
    category: 'Performance',
    actionRoute: '/executive/departments'
  },
  {
    id: 'EXEC-NOTIF-04',
    title: 'System Backup Snapshot Verified',
    message: 'Scheduled backup snapshot BKP-2026-10-25-01 confirmed successful with SHA-256 seal.',
    timestamp: hoursAgo(8),
    priority: 'low',
    isRead: true,
    category: 'Compliance',
    actionRoute: '/executive/compliance'
  }
];

export const DEPARTMENT_HISTORICAL_BENCHMARKS = {
  'Housekeeping': {
    targetSla: 92,
    prevPeriodSla: 89,
    taskVolumeTrend: '+4.2%',
    complaintTrend: '-12.5%',
    avgResponseMins: 9,
    headcountOnDuty: 8
  },
  'Maintenance': {
    targetSla: 90,
    prevPeriodSla: 86,
    taskVolumeTrend: '+11.8%',
    complaintTrend: '+5.0%',
    avgResponseMins: 22,
    headcountOnDuty: 3
  },
  'Front Office': {
    targetSla: 95,
    prevPeriodSla: 94,
    taskVolumeTrend: '+1.5%',
    complaintTrend: '-8.3%',
    avgResponseMins: 4,
    headcountOnDuty: 5
  },
  'Food & Beverage': {
    targetSla: 90,
    prevPeriodSla: 91,
    taskVolumeTrend: '+8.0%',
    complaintTrend: '0.0%',
    avgResponseMins: 14,
    headcountOnDuty: 6
  },
  'Guest Services': {
    targetSla: 94,
    prevPeriodSla: 92,
    taskVolumeTrend: '+2.1%',
    complaintTrend: '-16.0%',
    avgResponseMins: 7,
    headcountOnDuty: 4
  },
  'Security': {
    targetSla: 98,
    prevPeriodSla: 97,
    taskVolumeTrend: '+0.5%',
    complaintTrend: '0.0%',
    avgResponseMins: 3,
    headcountOnDuty: 4
  }
};
