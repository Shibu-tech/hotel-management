/**
 * StayOps Department Manager Mock Dataset & Domain Models
 * Contains Complaints, Service Recovery Requests, Weekly Staff Schedules, SLA Policy Configuration, and Manager Audit Logs.
 */

import { TASK_CATEGORY, TASK_PRIORITY } from '../utils/taskStatus';

const now = Date.now();
const minutesAgo = (m) => new Date(now - m * 60 * 1000).toISOString();
const minutesFromNow = (m) => new Date(now + m * 60 * 1000).toISOString();
const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString();
const hoursFromNow = (h) => new Date(now + h * 3600 * 1000).toISOString();

export const COMPLAINT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const COMPLAINT_STATUS = {
  OPEN: 'Open',
  INVESTIGATING: 'Under Investigation',
  ACTION_IN_PROGRESS: 'Action in Progress',
  RESOLVED: 'Resolved',
  ESCALATED: 'Escalated'
};

export const RECOVERY_STATUS = {
  PENDING: 'Pending Approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ESCALATED: 'Escalated to GM'
};

export const SHIFT_TYPES = {
  MORNING: { id: 'morning', label: 'Morning Shift', hours: '07:00 – 15:30', code: 'AM' },
  DAY: { id: 'day', label: 'Day Shift', hours: '08:00 – 16:30', code: 'DAY' },
  EVENING: { id: 'evening', label: 'Evening Shift', hours: '15:00 – 23:30', code: 'PM' },
  NIGHT: { id: 'night', label: 'Night Audit / Turn', hours: '23:00 – 07:30', code: 'NT' },
  OFF: { id: 'off', label: 'Scheduled Off', hours: 'Off Duty', code: 'OFF' }
};

export const DEFAULT_SLA_CONFIG = {
  urgentTargetMinutes: 30,
  highTargetMinutes: 60,
  mediumTargetMinutes: 120,
  lowTargetMinutes: 240,
  atRiskThresholdPercent: 70, // >= 70% elapsed target is marked At Risk
  allowEmergencyBypass: true
};

export const INITIAL_COMPLAINTS = [
  {
    id: 'CMP-801',
    guestReference: 'Mr. David Vance (Suite 1204 - Titanium VIP)',
    roomNumber: 'Suite 1204',
    category: 'Hypoallergenic Linens & Dust Sensitivity',
    severity: COMPLAINT_SEVERITY.HIGH,
    department: 'Housekeeping & Guest Services Ops',
    owner: 'Sarah Jenkins (Supervisor)',
    ownerId: 'EMP-201',
    status: COMPLAINT_STATUS.ACTION_IN_PROGRESS,
    createdAt: hoursAgo(1.8),
    responseDeadline: minutesAgo(20), // Response breached or approaching
    resolutionDeadline: minutesFromNow(40),
    timeOpenDisplay: '1h 48m',
    lastGuestUpdate: {
      timestamp: minutesAgo(30),
      by: 'Front Desk Concierge',
      summary: 'Guest contacted front desk inquiring on hypoallergenic bedding status. Apologized for delay and dispatched priority runner.'
    },
    nextAction: 'Confirm delivery with Marcus Alvarez; deliver complimentary executive breakfast voucher.',
    relatedTaskId: 'TSK-1042',
    escalationState: 'None',
    isEmergency: false,
    serviceRecoveryId: 'REC-501',
    notes: 'Guest has acute respiratory dust allergy. Room was turned over with standard down duvet. Urgent linen swap requested.',
    history: [
      {
        id: 'CHIS-101',
        timestamp: hoursAgo(1.8),
        actor: 'Front Desk (Frontline Intake)',
        action: 'Case Registered',
        details: 'Guest called reception regarding incorrect down duvet in Suite 1204.'
      },
      {
        id: 'CHIS-102',
        timestamp: hoursAgo(1.2),
        actor: 'Sarah Jenkins (Supervisor)',
        action: 'Assigned Case Owner',
        details: 'Claimed case ownership. Dispatched expedited replacement order.'
      },
      {
        id: 'CHIS-103',
        timestamp: minutesAgo(35),
        actor: 'Sarah Jenkins (Supervisor)',
        action: 'Service Recovery Submitted',
        details: 'Submitted REC-501 ($75 Breakfast & Lounge Credit) for Manager Approval.'
      }
    ]
  },
  {
    id: 'CMP-802',
    guestReference: 'Ms. Clara Sterling (Room 712 - Extended Stay)',
    roomNumber: 'Room 712',
    category: 'HVAC Air Temperature & Noise Rattle',
    severity: COMPLAINT_SEVERITY.HIGH,
    department: 'Housekeeping & Guest Services Ops',
    owner: 'David Kim (Maintenance)',
    ownerId: 'EMP-512',
    status: COMPLAINT_STATUS.OPEN,
    createdAt: hoursAgo(2.2),
    responseDeadline: minutesAgo(45), // BREACHED RESPONSE SLA
    resolutionDeadline: minutesFromNow(15),
    timeOpenDisplay: '2h 12m',
    lastGuestUpdate: {
      timestamp: hoursAgo(1),
      by: 'Guest Services Operator',
      summary: 'Informed guest that technician was inspecting primary condenser blower on floor 7.'
    },
    nextAction: 'Supervisor intervention required: maintenance parts requisition delay. Assign backup technician or offer room move.',
    relatedTaskId: 'TSK-1029',
    escalationState: 'Approaching Escalation',
    isEmergency: false,
    serviceRecoveryId: 'REC-502',
    notes: 'HVAC fan blade rattling above 68°F. Guest unable to rest before afternoon business conference.',
    history: [
      {
        id: 'CHIS-201',
        timestamp: hoursAgo(2.2),
        actor: 'Guest Direct / Web App',
        action: 'Case Opened',
        details: 'Automated ticket logged via StayOps Guest Portal.'
      },
      {
        id: 'CHIS-202',
        timestamp: hoursAgo(1.5),
        actor: 'Cynthia Vance (Dispatcher)',
        action: 'Maintenance Assigned',
        details: 'Dispatched David Kim for acoustic decibel check.'
      }
    ]
  },
  {
    id: 'CMP-803',
    guestReference: 'Ambassador Pierre Dubois (Penthouse 1601 - Head of State Protocol)',
    roomNumber: 'Penthouse 1601',
    category: 'VIP Arrival Champagne & Florals Omission',
    severity: COMPLAINT_SEVERITY.CRITICAL,
    department: 'Housekeeping & Guest Services Ops',
    owner: 'Elena Rostova (Department Manager)',
    ownerId: 'EMP-102',
    status: COMPLAINT_STATUS.INVESTIGATING,
    createdAt: minutesAgo(45),
    responseDeadline: minutesFromNow(15),
    resolutionDeadline: minutesFromNow(75),
    timeOpenDisplay: '45m',
    lastGuestUpdate: {
      timestamp: minutesAgo(20),
      by: 'Elena Rostova (Manager)',
      summary: 'Personal managerial phone call to ambassador private secretary. Assured immediate replacement delivery within 15 minutes.'
    },
    nextAction: 'Escort champagne service personally; verify custom floral arrangement from refrigerated cellar.',
    relatedTaskId: 'TSK-1049',
    escalationState: 'Manager Coordinated',
    isEmergency: false,
    serviceRecoveryId: 'REC-503',
    notes: 'Bespoke welcome basket and Dom Pérignon not in suite upon private motorcade arrival at 08:30 AM.',
    history: [
      {
        id: 'CHIS-301',
        timestamp: minutesAgo(45),
        actor: 'VIP Protocol Concierge',
        action: 'High Priority Alert',
        details: 'Ambassador entourage arrived early; suite setup incomplete.'
      },
      {
        id: 'CHIS-302',
        timestamp: minutesAgo(25),
        actor: 'Elena Rostova (Manager)',
        action: 'Manager Stepped In',
        details: 'Department Manager took personal coordination of Penthouse service recovery.'
      }
    ]
  },
  {
    id: 'CMP-804',
    guestReference: 'Family Robertson (Connecting Deluxe 410 & 412)',
    roomNumber: 'Rooms 410/412',
    category: 'Water Leak / Slippery Bathroom Tile',
    severity: COMPLAINT_SEVERITY.CRITICAL,
    department: 'Housekeeping & Guest Services Ops',
    owner: 'Safety & Security Team / Supervisor',
    ownerId: 'EMP-SEC-01',
    status: COMPLAINT_STATUS.ACTION_IN_PROGRESS,
    createdAt: minutesAgo(50),
    responseDeadline: minutesAgo(35),
    resolutionDeadline: minutesFromNow(10),
    timeOpenDisplay: '50m',
    lastGuestUpdate: {
      timestamp: minutesAgo(15),
      by: 'David Kim (Tech)',
      summary: 'Isolation valve closed under bathroom sink. Floor towel barriers placed. Wet vacuum in operation.'
    },
    nextAction: 'Safety inspection sign-off before re-clearing bathroom zone; evaluate room relocation.',
    relatedTaskId: 'TSK-1033',
    escalationState: 'Emergency Safety Protocol',
    isEmergency: true,
    serviceRecoveryId: 'REC-504',
    notes: 'Under-basin braided hose rupture caused water pooling. Slip hazard flagged for 2 young children.',
    history: [
      {
        id: 'CHIS-401',
        timestamp: minutesAgo(50),
        actor: 'Guest Direct Call',
        action: 'Water Hazard Reported',
        details: 'Urgent leak reported in room 410 bathroom.'
      },
      {
        id: 'CHIS-402',
        timestamp: minutesAgo(40),
        actor: 'Safety Team',
        action: 'Emergency Dispatch',
        details: 'Bypassed routine SLA. Main line shutoff valve isolated.'
      }
    ]
  },
  {
    id: 'CMP-805',
    guestReference: 'Dr. Michael Chen (Executive Suite 808)',
    roomNumber: 'Suite 808',
    category: 'Missing Express Laundry Garments',
    severity: COMPLAINT_SEVERITY.MEDIUM,
    department: 'Housekeeping & Guest Services Ops',
    owner: 'Priya Patel (Guest Runner)',
    ownerId: 'EMP-405',
    status: COMPLAINT_STATUS.OPEN,
    createdAt: hoursAgo(3.5),
    responseDeadline: hoursAgo(1),
    resolutionDeadline: minutesFromNow(60),
    timeOpenDisplay: '3h 30m',
    lastGuestUpdate: {
      timestamp: hoursAgo(1.5),
      by: 'Priya Patel',
      summary: 'Searched 8th floor linen sorting bays. Tag matched laundry cart #3 in dry-cleaning annex.'
    },
    nextAction: 'Confirm press completion at dry cleaner; deliver pressed suit before 11:00 AM presentation.',
    relatedTaskId: null,
    escalationState: 'None',
    isEmergency: false,
    serviceRecoveryId: 'REC-505',
    notes: 'Guest submitted 2 business suits for 3-hour express press; dry cleaning tracking tag temporarily misplaced.',
    history: [
      {
        id: 'CHIS-501',
        timestamp: hoursAgo(3.5),
        actor: 'Guest Services Operator',
        action: 'Ticket Created',
        details: 'Guest inquired on express suits promised by 09:00 AM.'
      }
    ]
  },
  {
    id: 'CMP-806',
    guestReference: 'Mr. Ronald Evans (Standard King 315)',
    roomNumber: 'Room 315',
    category: 'Late Housekeeping Service',
    severity: COMPLAINT_SEVERITY.LOW,
    department: 'Housekeeping & Guest Services Ops',
    owner: 'Elena Ramos (Attendant)',
    ownerId: 'EMP-422',
    status: COMPLAINT_STATUS.RESOLVED,
    createdAt: hoursAgo(5),
    responseDeadline: hoursAgo(4),
    resolutionDeadline: hoursAgo(2),
    timeOpenDisplay: 'Resolved (Took 1h 40m)',
    lastGuestUpdate: {
      timestamp: hoursAgo(2),
      by: 'Elena Ramos',
      summary: 'Full stayover service completed. Complimentary luxury bath salts and welcome card placed on vanity.'
    },
    nextAction: 'Case resolved and closed. Guest verified satisfaction.',
    relatedTaskId: null,
    escalationState: 'None',
    isEmergency: false,
    serviceRecoveryId: null,
    notes: 'Guest was working in room until 10:30 AM; DND cleared and room serviced promptly once available.',
    history: [
      {
        id: 'CHIS-601',
        timestamp: hoursAgo(5),
        actor: 'Reception',
        action: 'Stayover Request',
        details: 'Guest requested cleaning turnover.'
      },
      {
        id: 'CHIS-602',
        timestamp: hoursAgo(2),
        actor: 'Elena Ramos',
        action: 'Completed & Closed',
        details: 'Turnover inspected and passed.'
      }
    ]
  }
];

export const INITIAL_RECOVERY_REQUESTS = [
  {
    id: 'REC-501',
    complaintId: 'CMP-801',
    taskId: 'TSK-1042',
    guestReference: 'Mr. David Vance (Suite 1204 - Titanium VIP)',
    requestingEmployee: {
      id: 'EMP-201',
      name: 'Sarah Jenkins',
      role: 'Department Supervisor'
    },
    requestType: 'Complimentary Dining & Lounge Credit',
    proposedGesture: '$75.00 Veranda Dining Room Credit',
    amount: 75.00,
    currency: 'USD',
    policyLimit: 250.00,
    isWithinManagerAuthority: true,
    reason: 'Guest experienced 48-minute delay on allergen-free bed delivery and expressed significant irritation.',
    supportingNotes: 'Titanium status guest (40+ nights/yr). High risk of negative brand review if not acknowledged immediately.',
    status: RECOVERY_STATUS.PENDING,
    createdAt: minutesAgo(35),
    decidedAt: null,
    decidedBy: null,
    decisionReason: '',
    history: [
      {
        id: 'RHIS-101',
        timestamp: minutesAgo(35),
        actor: 'Sarah Jenkins (Supervisor)',
        action: 'Request Submitted',
        details: 'Submitted $75.00 dining voucher request for manager delegated approval.'
      }
    ]
  },
  {
    id: 'REC-502',
    complaintId: 'CMP-802',
    taskId: 'TSK-1029',
    guestReference: 'Ms. Clara Sterling (Room 712)',
    requestingEmployee: {
      id: 'EMP-201',
      name: 'Sarah Jenkins',
      role: 'Department Supervisor'
    },
    requestType: 'Late Checkout Waiver & Spa Credit',
    proposedGesture: 'Guaranteed 4:00 PM Late Checkout + $50 Spa Facility Pass',
    amount: 50.00,
    currency: 'USD',
    policyLimit: 250.00,
    isWithinManagerAuthority: true,
    reason: 'HVAC fan blade rattling noise prevented sleep before an important conference.',
    supportingNotes: 'Guest was courteous despite disturbance. Maintenance technician verified mechanical harmonic noise.',
    status: RECOVERY_STATUS.PENDING,
    createdAt: minutesAgo(25),
    decidedAt: null,
    decidedBy: null,
    decisionReason: '',
    history: [
      {
        id: 'RHIS-201',
        timestamp: minutesAgo(25),
        actor: 'Sarah Jenkins (Supervisor)',
        action: 'Request Submitted',
        details: 'Submitted $50 Spa Pass + Late Checkout waiver for approval.'
      }
    ]
  },
  {
    id: 'REC-503',
    complaintId: 'CMP-803',
    taskId: 'TSK-1049',
    guestReference: 'Ambassador Pierre Dubois (Penthouse 1601)',
    requestingEmployee: {
      id: 'EMP-102',
      name: 'Elena Rostova',
      role: 'Department Manager'
    },
    requestType: 'Premium Wine & Culinary Degustation Upgrade',
    proposedGesture: 'Dom Pérignon 2013 + Chef Private Amuse-Bouche Setup',
    amount: 185.00,
    currency: 'USD',
    policyLimit: 250.00,
    isWithinManagerAuthority: true,
    isSelfRequestedByManager: true, // DEMO GUARD: Tests self-approval prevention!
    reason: 'Omission of protocol welcome gift for state diplomatic delegation arrival.',
    supportingNotes: 'Self-initiated by Elena Rostova; requires co-authorization or executive sign-off due to corporate governance rules.',
    status: RECOVERY_STATUS.PENDING,
    createdAt: minutesAgo(15),
    decidedAt: null,
    decidedBy: null,
    decisionReason: '',
    history: [
      {
        id: 'RHIS-301',
        timestamp: minutesAgo(15),
        actor: 'Elena Rostova (Manager)',
        action: 'Request Drafted',
        details: 'Manager initiated protocol service recovery.'
      }
    ]
  },
  {
    id: 'REC-504',
    complaintId: 'CMP-804',
    taskId: 'TSK-1033',
    guestReference: 'Family Robertson (Rooms 410/412)',
    requestingEmployee: {
      id: 'EMP-201',
      name: 'Sarah Jenkins',
      role: 'Department Supervisor'
    },
    requestType: 'Full Night Room Rate Credit & Family Suite Upgrade',
    proposedGesture: '1 Night Room Refund Credit ($380.00) + Presidential Family Suite Move',
    amount: 380.00, // EXCEEDS MANAGER $250 LIMIT!
    currency: 'USD',
    policyLimit: 250.00,
    isWithinManagerAuthority: false, // Requires Escalation to General Manager Marcus Sterling
    reason: 'Plumbing leak in room 410 bathroom soaked carpet and luggage. Emergency safety incident involving children.',
    supportingNotes: 'Water soaked personal luggage. Amount exceeds $250 Department Manager limit. Must be escalated to GM.',
    status: RECOVERY_STATUS.PENDING,
    createdAt: minutesAgo(40),
    decidedAt: null,
    decidedBy: null,
    decisionReason: '',
    history: [
      {
        id: 'RHIS-401',
        timestamp: minutesAgo(40),
        actor: 'Sarah Jenkins (Supervisor)',
        action: 'Request Submitted',
        details: 'Submitted $380 compensation. Flagged as exceeding manager approval limit ($250).'
      }
    ]
  },
  {
    id: 'REC-505',
    complaintId: 'CMP-805',
    taskId: null,
    guestReference: 'Dr. Michael Chen (Executive Suite 808)',
    requestingEmployee: {
      id: 'EMP-304',
      name: 'Cynthia Vance',
      role: 'Department Dispatcher'
    },
    requestType: 'Express Dry Cleaning Fee Reimbursement',
    proposedGesture: 'Full Waiver of Express Laundry Fee + Garment Bag',
    amount: 45.00,
    currency: 'USD',
    policyLimit: 250.00,
    isWithinManagerAuthority: true,
    reason: 'Express dry cleaning tracking delay caused 1.5-hour anxiety prior to keynote speech.',
    supportingNotes: 'Suits recovered and delivered intact. Fee waiver recommended as goodwill gesture.',
    status: RECOVERY_STATUS.APPROVED,
    createdAt: hoursAgo(2),
    decidedAt: hoursAgo(1),
    decidedBy: 'Elena Rostova (Department Manager)',
    decisionReason: 'Approved within delegated authority. Reasonable service compensation for delivery anxiety.',
    history: [
      {
        id: 'RHIS-501',
        timestamp: hoursAgo(2),
        actor: 'Cynthia Vance (Dispatcher)',
        action: 'Request Submitted',
        details: 'Submitted $45 fee waiver.'
      },
      {
        id: 'RHIS-502',
        timestamp: hoursAgo(1),
        actor: 'Elena Rostova (Manager)',
        action: 'Approved',
        details: 'Approved by Elena Rostova. Transmitted to Front Desk billing adjustment folio.'
      }
    ]
  }
];

export const INITIAL_STAFF_SCHEDULES = [
  {
    staffId: 'EMP-418',
    name: 'Marcus Alvarez',
    role: 'Attendant & Runner',
    department: 'Housekeeping',
    weeklySchedule: {
      Mon: { shift: 'morning', hours: '07:00 – 15:30', status: 'Scheduled' },
      Tue: { shift: 'morning', hours: '07:00 – 15:30', status: 'Scheduled' },
      Wed: { shift: 'morning', hours: '07:00 – 15:30', status: 'Scheduled' },
      Thu: { shift: 'morning', hours: '07:00 – 15:30', status: 'Scheduled' },
      Fri: { shift: 'morning', hours: '07:00 – 15:30', status: 'Scheduled' },
      Sat: { shift: 'off', hours: 'Off Duty', status: 'Scheduled Off' },
      Sun: { shift: 'off', hours: 'Off Duty', status: 'Scheduled Off' }
    },
    conflictFlag: null
  },
  {
    staffId: 'EMP-422',
    name: 'Elena Ramos',
    role: 'Housekeeping Specialist',
    department: 'Housekeeping',
    weeklySchedule: {
      Mon: { shift: 'morning', hours: '07:00 – 15:30', status: 'Scheduled' },
      Tue: { shift: 'morning', hours: '07:00 – 15:30', status: 'Scheduled' },
      Wed: { shift: 'off', hours: 'Off Duty', status: 'Scheduled Off' },
      Thu: { shift: 'morning', hours: '07:00 – 15:30', status: 'Scheduled' },
      Fri: { shift: 'morning', hours: '07:00 – 15:30', status: 'Scheduled' },
      Sat: { shift: 'day', hours: '08:00 – 16:30', status: 'Scheduled' },
      Sun: { shift: 'off', hours: 'Off Duty', status: 'Scheduled Off' }
    },
    conflictFlag: null
  },
  {
    staffId: 'EMP-389',
    name: 'Jamal Ortiz',
    role: 'Bell & Luggage Porter',
    department: 'Luggage & Bell',
    weeklySchedule: {
      Mon: { shift: 'morning', hours: '06:30 – 15:00', status: 'Scheduled' },
      Tue: { shift: 'morning', hours: '06:30 – 15:00', status: 'Scheduled' },
      Wed: { shift: 'morning', hours: '06:30 – 15:00', status: 'Scheduled' },
      Thu: { shift: 'off', hours: 'Off Duty', status: 'Scheduled Off' },
      Fri: { shift: 'evening', hours: '15:00 – 23:30', status: 'Scheduled' },
      Sat: { shift: 'evening', hours: '15:00 – 23:30', status: 'Scheduled' },
      Sun: { shift: 'off', hours: 'Off Duty', status: 'Scheduled Off' }
    },
    conflictFlag: null
  },
  {
    staffId: 'EMP-405',
    name: 'Priya Patel',
    role: 'Guest Service Runner',
    department: 'Amenities',
    weeklySchedule: {
      Mon: { shift: 'day', hours: '08:00 – 16:30', status: 'Scheduled' },
      Tue: { shift: 'day', hours: '08:00 – 16:30', status: 'Scheduled' },
      Wed: { shift: 'day', hours: '08:00 – 16:30', status: 'Scheduled' },
      Thu: { shift: 'day', hours: '08:00 – 16:30', status: 'Scheduled' },
      Fri: { shift: 'off', hours: 'Off Duty', status: 'Scheduled Off' },
      Sat: { shift: 'off', hours: 'Off Duty', status: 'Scheduled Off' },
      Sun: { shift: 'day', hours: '08:00 – 16:30', status: 'Scheduled' }
    },
    conflictFlag: null
  },
  {
    staffId: 'EMP-512',
    name: 'David Kim',
    role: 'Facility Maintenance Tech',
    department: 'Maintenance',
    weeklySchedule: {
      Mon: { shift: 'day', hours: '07:30 – 16:00', status: 'Scheduled' },
      Tue: { shift: 'day', hours: '07:30 – 16:00', status: 'Scheduled' },
      Wed: { shift: 'day', hours: '07:30 – 16:00', status: 'Scheduled' },
      Thu: { shift: 'day', hours: '07:30 – 16:00', status: 'Scheduled' },
      Fri: { shift: 'day', hours: '07:30 – 16:00', status: 'Scheduled' },
      Sat: { shift: 'off', hours: 'Off Duty', status: 'Scheduled Off' },
      Sun: { shift: 'off', hours: 'Off Duty', status: 'Scheduled Off' }
    },
    conflictFlag: null
  },
  {
    staffId: 'EMP-460',
    name: 'Sophia Taylor',
    role: 'Floor Attendant',
    department: 'Housekeeping',
    weeklySchedule: {
      Mon: { shift: 'evening', hours: '15:00 – 23:30', status: 'Scheduled' },
      Tue: { shift: 'evening', hours: '15:00 – 23:30', status: 'Scheduled' },
      Wed: { shift: 'evening', hours: '15:00 – 23:30', status: 'Scheduled' },
      Thu: { shift: 'evening', hours: '15:00 – 23:30', status: 'Scheduled' },
      Fri: { shift: 'off', hours: 'Off Duty', status: 'Scheduled Off' },
      Sat: { shift: 'off', hours: 'Off Duty', status: 'Scheduled Off' },
      Sun: { shift: 'evening', hours: '15:00 – 23:30', status: 'Scheduled' }
    },
    conflictFlag: null
  },
  {
    staffId: 'EMP-431',
    name: 'Carlos Mendez',
    role: 'Room Service Lead',
    department: 'Room Service',
    weeklySchedule: {
      Mon: { shift: 'morning', hours: '06:30 – 15:00', status: 'Scheduled' },
      Tue: { shift: 'morning', hours: '06:30 – 15:00', status: 'Scheduled' },
      Wed: { shift: 'morning', hours: '06:30 – 15:00', status: 'Scheduled' },
      Thu: { shift: 'morning', hours: '06:30 – 15:00', status: 'Scheduled' },
      Fri: { shift: 'morning', hours: '06:30 – 15:00', status: 'Scheduled' },
      Sat: { shift: 'off', hours: 'Off Duty', status: 'Scheduled Off' },
      Sun: { shift: 'off', hours: 'Off Duty', status: 'Scheduled Off' }
    },
    conflictFlag: null
  }
];

export const INITIAL_MANAGER_NOTIFICATIONS = [
  {
    id: 'MNOTIF-901',
    taskId: 'TSK-1042',
    complaintId: 'CMP-801',
    type: 'sla_breach_risk',
    title: 'SLA At Risk: Hypoallergenic Bedding (Suite 712)',
    message: 'Task TSK-1042 is at 80% elapsed SLA target. Due in 15m. VIP guest complaint registered.',
    timestamp: minutesAgo(10),
    isRead: false,
    priority: 'urgent',
    category: 'SLA'
  },
  {
    id: 'MNOTIF-902',
    taskId: null,
    complaintId: 'CMP-801',
    type: 'approval_request',
    title: 'Pending Recovery Approval: $75.00 Dining Credit',
    message: 'Supervisor Sarah Jenkins submitted REC-501 for guest David Vance. Delegated approval requested.',
    timestamp: minutesAgo(30),
    isRead: false,
    priority: 'high',
    category: 'Approvals'
  },
  {
    id: 'MNOTIF-903',
    taskId: 'TSK-1029',
    complaintId: 'CMP-802',
    type: 'sla_breach',
    title: 'SLA Breached: Emergency Solvent Spill Area Lockout',
    message: 'Lift B safety blocker exceeded standard 60m clearance window. Air quality inspection pending.',
    timestamp: minutesAgo(40),
    isRead: false,
    priority: 'urgent',
    category: 'SLA'
  },
  {
    id: 'MNOTIF-904',
    taskId: null,
    complaintId: null,
    type: 'staffing_coverage',
    title: 'Evening Shift Staffing Gap Alert',
    message: 'Only 2 staff scheduled for Evening Shift (15:00 – 23:30). Expected room turnover volume requires at least 3.',
    timestamp: hoursAgo(1),
    isRead: false,
    priority: 'medium',
    category: 'Staffing'
  },
  {
    id: 'MNOTIF-905',
    taskId: 'TSK-1033',
    complaintId: 'CMP-804',
    type: 'emergency_security',
    title: 'EMERGENCY Protocol: Water Leak Hazard (Rooms 410/412)',
    message: 'Bathroom water pipe failure with slip hazard. Safety protocol enacted; $380 compensation exceeds manager limit.',
    timestamp: minutesAgo(45),
    isRead: false,
    priority: 'urgent',
    category: 'Emergency'
  }
];
