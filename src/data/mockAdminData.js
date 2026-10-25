/**
 * StayOps Platform Administrator Mock Data & Technical Domain Models
 * Contains User Accounts, Integrations, System Settings, Immutable Admin Audit Trail, and Backup Records.
 */

const now = Date.now();
const minutesAgo = (m) => new Date(now - m * 60 * 1000).toISOString();
const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString();
const daysAgo = (d) => new Date(now - d * 86400 * 1000).toISOString();

export const INITIAL_PLATFORM_USERS = [
  {
    id: 'EMP-099',
    name: 'Alexandre Vance',
    email: 'a.vance@stayops-hotel.com',
    role: 'Platform Administrator',
    roleKey: 'platform_admin',
    department: 'Information Technology & Platform Systems',
    status: 'Active',
    accountStatus: 'Active',
    assignedRoles: ['Platform Administrator'],
    phoneExt: 'x9001',
    createdAt: '2025-01-15T08:00:00.000Z',
    lastLogin: minutesAgo(12),
    mfaEnabled: true,
    isProtectedAdmin: true, // Cannot be deleted/deactivated to prevent lockout!
    accessHistory: [
      { timestamp: minutesAgo(12), action: 'Session Initialized', ip: '10.0.4.12', terminal: 'NOC-B1' },
      { timestamp: hoursAgo(14), action: 'Backup Policy Verified', ip: '10.0.4.12', terminal: 'NOC-B1' },
      { timestamp: daysAgo(1), action: 'Integration Health Check Triggered', ip: '10.0.4.12', terminal: 'NOC-B1' }
    ]
  },
  {
    id: 'EMP-001',
    name: 'Victoria Montgomery',
    email: 'v.montgomery@stayops-hotel.com',
    role: 'Executive Viewer/Approver',
    roleKey: 'executive',
    department: 'Executive Leadership & Operations Oversight',
    status: 'Active',
    accountStatus: 'Active',
    assignedRoles: ['Executive Viewer/Approver'],
    phoneExt: 'x1001',
    createdAt: '2025-01-10T09:30:00.000Z',
    lastLogin: hoursAgo(1),
    mfaEnabled: true,
    isProtectedAdmin: false,
    accessHistory: [
      { timestamp: hoursAgo(1), action: 'Executive Dashboard Accessed', ip: '10.0.1.18', terminal: 'Exec-1800' },
      { timestamp: hoursAgo(18), action: 'High-Value Recovery Reviewed', ip: '10.0.1.18', terminal: 'Exec-1800' }
    ]
  },
  {
    id: 'EMP-501',
    name: 'Marcus Sterling',
    email: 'm.sterling@stayops-hotel.com',
    role: 'Financial Operator',
    roleKey: 'financial_operator',
    department: 'Finance & Revenue Operations',
    status: 'Active',
    accountStatus: 'Active',
    assignedRoles: ['Financial Operator'],
    phoneExt: 'x5010',
    createdAt: '2025-02-01T10:00:00.000Z',
    lastLogin: hoursAgo(2),
    mfaEnabled: true,
    isProtectedAdmin: false,
    accessHistory: [
      { timestamp: hoursAgo(2), action: 'Settlement Batch Reconciled', ip: '10.0.2.40', terminal: 'FIN-410' },
      { timestamp: daysAgo(1), action: 'Refund Authorization Executed', ip: '10.0.2.40', terminal: 'FIN-410' }
    ]
  },
  {
    id: 'EMP-401',
    name: 'David Martinez',
    email: 'd.martinez@stayops-hotel.com',
    role: 'Front Desk Coordinator',
    roleKey: 'frontdesk',
    department: 'Front Office & Guest Services',
    status: 'Active',
    accountStatus: 'Active',
    assignedRoles: ['Front Desk Coordinator'],
    phoneExt: 'x4010',
    createdAt: '2025-02-10T11:00:00.000Z',
    lastLogin: hoursAgo(3),
    mfaEnabled: false,
    isProtectedAdmin: false,
    accessHistory: [
      { timestamp: hoursAgo(3), action: 'Guest Check-in Room 1204', ip: '10.0.3.10', terminal: 'FD-01' }
    ]
  },
  {
    id: 'EMP-102',
    name: 'Elena Rostova',
    email: 'e.rostova@stayops-hotel.com',
    role: 'Department Manager',
    roleKey: 'manager',
    department: 'Housekeeping & Guest Services Ops',
    status: 'Active',
    accountStatus: 'Active',
    assignedRoles: ['Department Manager'],
    phoneExt: 'x1020',
    createdAt: '2025-01-20T08:30:00.000Z',
    lastLogin: hoursAgo(4),
    mfaEnabled: true,
    isProtectedAdmin: false,
    accessHistory: [
      { timestamp: hoursAgo(4), action: 'SLA Performance Review', ip: '10.0.2.14', terminal: 'MGR-201' }
    ]
  },
  {
    id: 'EMP-201',
    name: 'Sarah Jenkins',
    email: 's.jenkins@stayops-hotel.com',
    role: 'Department Supervisor',
    roleKey: 'supervisor',
    department: 'Housekeeping & Guest Services Ops',
    status: 'Active',
    accountStatus: 'Active',
    assignedRoles: ['Department Supervisor'],
    phoneExt: 'x2010',
    createdAt: '2025-02-15T07:00:00.000Z',
    lastLogin: hoursAgo(2),
    mfaEnabled: false,
    isProtectedAdmin: false,
    accessHistory: [
      { timestamp: hoursAgo(2), action: 'Shift Inspection Acknowledged', ip: '10.0.2.18', terminal: 'SUP-204' }
    ]
  },
  {
    id: 'EMP-304',
    name: 'Cynthia Vance',
    email: 'c.vance@stayops-hotel.com',
    role: 'Department Dispatcher',
    roleKey: 'dispatcher',
    department: 'Housekeeping & Guest Services',
    status: 'Active',
    accountStatus: 'Active',
    assignedRoles: ['Department Dispatcher'],
    phoneExt: 'x4102',
    createdAt: '2025-02-18T06:45:00.000Z',
    lastLogin: minutesAgo(40),
    mfaEnabled: false,
    isProtectedAdmin: false,
    accessHistory: [
      { timestamp: minutesAgo(40), action: 'Task Queue Dispatched', ip: '10.0.2.30', terminal: 'DISP-104' }
    ]
  },
  {
    id: 'EMP-601',
    name: 'Marcus Vance',
    email: 'm.vance@stayops-hotel.com',
    role: 'Security Responder',
    roleKey: 'security',
    department: 'Safety & Security Operations',
    status: 'Active',
    accountStatus: 'Active',
    assignedRoles: ['Security Responder'],
    phoneExt: 'x6010',
    createdAt: '2025-01-25T14:00:00.000Z',
    lastLogin: minutesAgo(18),
    mfaEnabled: true,
    isProtectedAdmin: false,
    accessHistory: [
      { timestamp: minutesAgo(18), action: 'Security Incident Acknowledged', ip: '10.0.5.10', terminal: 'SEC-NOC' }
    ]
  },
  {
    id: 'EMP-418',
    name: 'Marcus Alvarez',
    email: 'm.alvarez@stayops-hotel.com',
    role: 'Task Fulfiller',
    roleKey: 'task_fulfiller',
    department: 'Housekeeping & Guest Operations Support',
    status: 'Active',
    accountStatus: 'Active',
    assignedRoles: ['Task Fulfiller'],
    phoneExt: 'x4180',
    createdAt: '2025-03-01T07:15:00.000Z',
    lastLogin: minutesAgo(30),
    mfaEnabled: false,
    isProtectedAdmin: false,
    accessHistory: [
      { timestamp: minutesAgo(30), action: 'Delivery Confirmed Room 712', ip: '10.0.6.22', terminal: 'MOB-04' }
    ]
  },
  {
    id: 'EMP-720',
    name: 'Evelyn Reed',
    email: 'e.reed@external-audit.com',
    role: 'Financial Operator',
    roleKey: 'financial_operator',
    department: 'External Compliance & Advisory',
    status: 'Pending Review',
    accountStatus: 'Pending Review',
    assignedRoles: ['Financial Operator'],
    phoneExt: 'x7201',
    createdAt: daysAgo(2),
    lastLogin: null,
    mfaEnabled: false,
    isProtectedAdmin: false,
    accessHistory: []
  }
];

export const INITIAL_INTEGRATIONS = [
  {
    id: 'INT-DB-01',
    name: 'Primary Relational Database Engine',
    provider: 'PostgreSQL Active Replica Cluster (Local Memory / State Bus)',
    category: 'Database & Storage',
    status: 'Operational', // Operational, Degraded, Offline
    latencyMs: 18,
    uptime: '99.98%',
    lastCheck: minutesAgo(2),
    errorSummary: null,
    diagnostic: 'Connection pool normal (38/100 active). Replication lag: 8ms. Write buffers healthy.',
    endpoint: 'internal://db-cluster.stayops.local:5432/hotel_ops'
  },
  {
    id: 'INT-AUTH-02',
    name: 'StayOps Enterprise RBAC & Token Authority',
    provider: 'OIDC / RBAC Session Guard Authority',
    category: 'Identity & Access',
    status: 'Operational',
    latencyMs: 32,
    uptime: '100.0%',
    lastCheck: minutesAgo(4),
    errorSummary: null,
    diagnostic: 'Session tokens validating correctly. Least-privilege role boundaries actively enforced.',
    endpoint: 'https://auth.stayops-enterprise.com/oauth/v2'
  },
  {
    id: 'INT-STORAGE-03',
    name: 'StayOps Tamper-Evident Evidence Vault',
    provider: 'Encrypted S3 WORM Object Storage (us-east-1)',
    category: 'File & Object Storage',
    status: 'Operational',
    latencyMs: 76,
    uptime: '99.99%',
    lastCheck: minutesAgo(9),
    errorSummary: null,
    diagnostic: 'Write-Once-Read-Many policy sealed. SHA-256 chain-of-custody verification active.',
    endpoint: 's3://stayops-vault-protected-us-east-1'
  },
  {
    id: 'INT-NOTIF-04',
    name: 'Staff Dispatch & Email Notification Broker',
    provider: 'StayOps WebSockets & SMTP Gateway',
    category: 'Messaging',
    status: 'Operational',
    latencyMs: 95,
    uptime: '99.94%',
    lastCheck: minutesAgo(6),
    errorSummary: null,
    diagnostic: 'Queue depth: 2 msgs. Average delivery time: 0.8s. All channels reporting ready.',
    endpoint: 'wss://notifications.stayops.local/ws/dispatch'
  },
  {
    id: 'INT-PAY-05',
    name: 'Payment Gateway Settlement API',
    provider: 'Stripe Payments & Adyen Merchant Terminal Simulator',
    category: 'Payment Gateway',
    status: 'Operational',
    latencyMs: 125,
    uptime: '99.95%',
    lastCheck: minutesAgo(11),
    errorSummary: null,
    diagnostic: 'Idempotency validation active. Settlement webhook listeners healthy.',
    endpoint: 'https://api.stripe-simulated.stayops.internal/v1'
  },
  {
    id: 'INT-PMS-06',
    name: 'VingCard RFID & Opera PMS Interface',
    provider: 'ASSA ABLOY Electronic Keycard Controller & PMS Bridge',
    category: 'Hardware & PMS',
    status: 'Degraded',
    latencyMs: 380,
    uptime: '98.84%',
    lastCheck: minutesAgo(14),
    errorSummary: 'Elevated latency on Sub-Level 2 reader interface.',
    diagnostic: 'Controller #3 experiencing packet retry overhead. Failover radio link engaged.',
    endpoint: 'tcp://vingcard-pms-gateway.stayops.local:8088'
  }
];

export const INITIAL_SYSTEM_CONFIG = {
  property: {
    hotelName: 'Grand Azure Bay Resort & Conference Center',
    propertyCode: 'PROP-048',
    address: '1000 Oceanfront Parkway, Bayview Harbor, CA 90210',
    phone: '+1 (555) 019-4800',
    primaryCurrency: 'USD ($)',
    taxId: 'TAX-8921-9941',
    totalRooms: 340,
    contactEmail: 'operations@stayops-hotel.com'
  },
  regional: {
    timeZone: 'America/Los_Angeles (UTC-08:00)',
    timeFormat: '24-Hour (Military Standard)',
    dateFormat: 'YYYY-MM-DD',
    fiscalYearStart: 'January 1'
  },
  notifications: {
    emailDigests: true,
    urgentSmsEscalations: true,
    inAppAudibleChime: true,
    criticalIncidentAutoBroadcast: true,
    dispatcherSlaWarningMinutes: 15
  },
  security: {
    sessionTimeoutMinutes: 30,
    maxConcurrentSessionsPerUser: 2,
    enforceMfaForPrivilegedRoles: true,
    passwordExpiryDays: 90,
    failedLoginLockoutThreshold: 5,
    auditLogRetentionYears: 7
  },
  qrMappings: {
    digitalKeyGeneration: true,
    qrExpiryMinutes: 60,
    autoRevokeOnCheckout: true,
    allowElevatorBypassWithMobile: true
  },
  backupPolicy: {
    automatedDailyBackups: true,
    backupScheduleUtc: '03:00 UTC',
    backupRetentionDays: 30,
    offsiteReplication: true,
    compressionLevel: 'High (gzip-9)'
  }
};

export const INITIAL_ADMIN_AUDIT_LOGS = [
  {
    id: 'ADM-LOG-901',
    timestamp: minutesAgo(12),
    actor: 'Alexandre Vance (EMP-099)',
    action: 'ADMIN_SESSION_LOGIN',
    affectedResource: 'Auth:Session/NOC-B1',
    outcome: 'Success',
    changeSummary: 'Administrator session initiated with certified MFA verification.',
    correlationId: 'req_auth_901842'
  },
  {
    id: 'ADM-LOG-902',
    timestamp: hoursAgo(1),
    actor: 'Alexandre Vance (EMP-099)',
    action: 'INTEGRATION_HEALTH_CHECK',
    affectedResource: 'Integration:INT-PMS-06',
    outcome: 'Warning',
    changeSummary: 'Triggered diagnostic ping on VingCard interface; detected elevated latency (380ms).',
    correlationId: 'req_diag_339104'
  },
  {
    id: 'ADM-LOG-903',
    timestamp: hoursAgo(8),
    actor: 'System Automation Worker',
    action: 'CREATE_BACKUP_SNAPSHOT',
    affectedResource: 'Backup:BKP-2026-10-25-01',
    outcome: 'Success',
    changeSummary: 'Scheduled daily backup snapshot completed successfully (428.4 MB, SHA-256 verified).',
    correlationId: 'cron_bkp_884912'
  },
  {
    id: 'ADM-LOG-904',
    timestamp: daysAgo(1),
    actor: 'Alexandre Vance (EMP-099)',
    action: 'CONFIG_SECURITY_UPDATE',
    affectedResource: 'Config:Security/SessionTimeout',
    outcome: 'Success',
    changeSummary: 'Updated session inactivity timeout from 45 min to 30 min per corporate cyber mandate.',
    correlationId: 'req_cfg_194029'
  },
  {
    id: 'ADM-LOG-905',
    timestamp: daysAgo(2),
    actor: 'Alexandre Vance (EMP-099)',
    action: 'USER_INVITATION_DISPATCH',
    affectedResource: 'User:EMP-720 (Evelyn Reed)',
    outcome: 'Success',
    changeSummary: 'Invited external compliance auditor with scoped read-only financial ledger access.',
    correlationId: 'req_usr_582910'
  }
];

export const INITIAL_BACKUPS = [
  {
    id: 'BKP-2026-10-25-01',
    timestamp: hoursAgo(8),
    status: 'Confirmed Success',
    destination: 'AWS S3 Immutable Vault (us-east-1)',
    sizeMb: 428.4,
    checksum: 'sha256:8f92a10b42c98d7e0129fec88439d01247a3e1b994821c9a',
    triggeredBy: 'Automated Nightly Scheduler',
    retentionDays: 30,
    backupType: 'Full System Snapshot (Ledger, Tasks, Users, Evidence Index)',
    verifyResult: 'Integrity Check Passed (0 corrupted blocks)',
    lastFailure: null
  },
  {
    id: 'BKP-2026-10-24-01',
    timestamp: daysAgo(1),
    status: 'Confirmed Success',
    destination: 'AWS S3 Immutable Vault (us-east-1)',
    sizeMb: 425.1,
    checksum: 'sha256:1a84f39e29b104928dce842109ab72314e019283f9401824',
    triggeredBy: 'Automated Nightly Scheduler',
    retentionDays: 29,
    backupType: 'Full System Snapshot',
    verifyResult: 'Integrity Check Passed',
    lastFailure: null
  },
  {
    id: 'BKP-2026-10-23-01',
    timestamp: daysAgo(2),
    status: 'Confirmed Success',
    destination: 'AWS S3 Immutable Vault (us-east-1)',
    sizeMb: 421.8,
    checksum: 'sha256:5b721839fae0194821098231ab9028471923481239841234',
    triggeredBy: 'Automated Nightly Scheduler',
    retentionDays: 28,
    backupType: 'Full System Snapshot',
    verifyResult: 'Integrity Check Passed',
    lastFailure: null
  }
];
