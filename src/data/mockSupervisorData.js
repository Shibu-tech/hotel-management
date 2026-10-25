import { BLOCKER_STATUS, CORRECTIVE_ACTION_STATUS, HANDOVER_STATUS } from '../utils/taskStatus';

const now = Date.now();
const minutesAgo = (m) => new Date(now - m * 60 * 1000).toISOString();
const minutesFromNow = (m) => new Date(now + m * 60 * 1000).toISOString();
const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString();

export const INITIAL_BLOCKERS = [
  {
    id: 'BLK-401',
    taskId: 'TSK-1029',
    taskTitle: 'Emergency Solvent Spill Neutralization & Area Lockout',
    location: 'Service Lift B - Shaft Vestibule (Level 3)',
    category: 'Safety restriction',
    description: 'Chemical cleaning solvent bottle fractured during trolley transit. Toxic vapor & slip hazard in shaft vestibule.',
    operationalImpact: 'Service lift B halted. Floor 3-6 luggage transfer routed through guest elevator concourse.',
    responsiblePerson: 'David Kim (Maintenance)',
    status: BLOCKER_STATUS.PENDING_CLEARANCE,
    safetyRestricted: true,
    safetyClearanceRequired: 'Certified Industrial Hygiene / Safety Officer Clearance required before zone release',
    safetyClearanceDetails: null, // PENDING! Cannot release without safety sign-off
    reportedBy: 'Elena Ramos (Attendant)',
    reportedAt: hoursAgo(1.5),
    expectedResolutionTime: minutesFromNow(45),
    nextAction: 'Awaiting Safety Officer atmospheric air test scheduled for 10:30 AM.',
    resolutionNotes: '',
    history: [
      {
        id: 'BH-101',
        event: 'Safety Blocker Created',
        details: 'Service lift B shaft vestibule sealed off with safety barrier tape.',
        actor: 'Elena Ramos (Attendant)',
        timestamp: hoursAgo(1.5)
      },
      {
        id: 'BH-102',
        event: 'Containment Neutralizer Applied',
        details: 'David Kim applied organic absorbent pellets and deployed positive-pressure air blower.',
        actor: 'David Kim (Tech)',
        timestamp: hoursAgo(1)
      }
    ]
  },
  {
    id: 'BLK-302',
    taskId: 'TSK-1031',
    taskTitle: 'Full Stayover Cleaning & Balcony Mop',
    location: 'Ocean View Room 305',
    category: 'Room or area inaccessible',
    description: 'Guest activated electronic Do Not Disturb (DND) switch and deadbolt engaged.',
    operationalImpact: 'Morning floor cleaning route paused for room 305.',
    responsiblePerson: 'Elena Ramos (Attendant)',
    status: BLOCKER_STATUS.IN_PROGRESS,
    safetyRestricted: false,
    safetyClearanceRequired: null,
    safetyClearanceDetails: null,
    reportedBy: 'Elena Ramos (Attendant)',
    reportedAt: hoursAgo(1),
    expectedResolutionTime: minutesFromNow(90),
    nextAction: 'Front desk called guest room; guest requested cleaning post 11:30 AM.',
    resolutionNotes: '',
    history: [
      {
        id: 'BH-201',
        event: 'Blocker Logged',
        details: 'Attendant reported DND active at 08:15.',
        actor: 'Elena Ramos (Attendant)',
        timestamp: hoursAgo(1)
      }
    ]
  },
  {
    id: 'BLK-205',
    taskId: 'TSK-1042',
    taskTitle: 'Hypoallergenic Bedding & Extra Pillows',
    location: 'Executive Suite 712',
    category: 'Item or supply unavailable',
    description: 'Central linen pantry running low on sealed hypoallergenic king duvet covers.',
    operationalImpact: 'Secondary delays possible if VIP requests additional allergen-free sets.',
    responsiblePerson: 'Marcus Alvarez (Attendant)',
    status: BLOCKER_STATUS.OPEN,
    safetyRestricted: false,
    safetyClearanceRequired: null,
    safetyClearanceDetails: null,
    reportedBy: 'Marcus Alvarez (Attendant)',
    reportedAt: minutesAgo(35),
    expectedResolutionTime: minutesFromNow(30),
    nextAction: 'Linen dispatch delivery en route from primary basement laundry depot.',
    resolutionNotes: '',
    history: [
      {
        id: 'BH-301',
        event: 'Stockout Reported',
        details: 'Attendant reported 0 hypoallergenic sets in 7th floor closet.',
        actor: 'Marcus Alvarez',
        timestamp: minutesAgo(35)
      }
    ]
  },
  {
    id: 'BLK-108',
    taskId: 'TSK-1035',
    taskTitle: 'Luggage Transfer to Presidential Suite',
    location: 'Basement Service Elevator Core',
    category: 'Equipment malfunction',
    description: 'Service elevator B safety sensor interlock triggered due to track debris.',
    operationalImpact: 'Luggage carts diverted to Service Lift A.',
    responsiblePerson: 'David Kim (Maintenance)',
    status: BLOCKER_STATUS.RESOLVED,
    safetyRestricted: false,
    safetyClearanceRequired: null,
    safetyClearanceDetails: null,
    reportedBy: 'Jamal Ortiz (Porter)',
    reportedAt: hoursAgo(2),
    expectedResolutionTime: minutesAgo(30),
    nextAction: 'Lift cleared and test run completed.',
    resolutionNotes: 'Track debris extracted, safety interlock reset and verified with maintenance supervisor.',
    resolvedAt: minutesAgo(20),
    resolvedBy: 'Sarah Jenkins (Supervisor)',
    history: [
      {
        id: 'BH-401',
        event: 'Blocker Logged',
        details: 'Elevator sensor failure reported.',
        actor: 'Jamal Ortiz',
        timestamp: hoursAgo(2)
      },
      {
        id: 'BH-402',
        event: 'Blocker Resolved',
        details: 'Maintenance cleared track debris and tested cab operation.',
        actor: 'Sarah Jenkins (Supervisor)',
        timestamp: minutesAgo(20)
      }
    ]
  }
];

export const INITIAL_CORRECTIVE_ACTIONS = [
  {
    id: 'CA-501',
    taskId: 'TSK-1018',
    taskTitle: 'Marble Vanity Polish & Shower Grout Reseal',
    location: 'Penthouse 1602',
    problemIdentified: 'Grout sealant along bottom perimeter was applied unevenly, remained tacky after 2 hours, and missed corners.',
    correctiveActionRequired: 'Scrape defective sealant, re-apply industrial rapid-cure silicone bead, and smooth with finishing tool.',
    responsiblePerson: 'David Kim',
    responsiblePersonId: 'EMP-512',
    targetCompletionTime: minutesFromNow(45),
    notes: 'Supervisor inspection rejected on first round. Tech instructed to use low-odor antimicrobial sealant.',
    status: CORRECTIVE_ACTION_STATUS.IN_PROGRESS,
    createdBy: 'Sarah Jenkins (Supervisor)',
    createdAt: hoursAgo(1.8),
    resolvedAt: null,
    resolutionNotes: ''
  },
  {
    id: 'CA-502',
    taskId: 'TSK-1031',
    taskTitle: 'Full Stayover Cleaning & Balcony Mop',
    location: 'Ocean View Room 305',
    problemIdentified: 'Guest placed DND sign due to housekeeping knocking before agreed 11:30 AM slot on yesterday’s shift.',
    correctiveActionRequired: 'Ensure floor schedule strictly adheres to guest PMS preference notes; place apology welcome card.',
    responsiblePerson: 'Elena Ramos',
    responsiblePersonId: 'EMP-422',
    targetCompletionTime: minutesFromNow(120),
    notes: 'Coordinate with Front Desk concierge before knocking at 11:30 AM.',
    status: CORRECTIVE_ACTION_STATUS.PENDING,
    createdBy: 'Sarah Jenkins (Supervisor)',
    createdAt: hoursAgo(1),
    resolvedAt: null,
    resolutionNotes: ''
  },
  {
    id: 'CA-503',
    taskId: 'TSK-1049',
    taskTitle: 'Welcome Champagne Bucket & Crystal Flutes',
    location: 'Honeymoon Suite 520',
    problemIdentified: 'Ice melted during prolonged staging in pantry before suite placement.',
    correctiveActionRequired: 'Replenish with fresh crushed ice right before room entry; wipe champagne flutes with lint-free microfiber cloth.',
    responsiblePerson: 'Carlos Mendez',
    responsiblePersonId: 'EMP-431',
    targetCompletionTime: minutesFromNow(10),
    notes: 'VIP Honeymoon couple arrival imminent.',
    status: CORRECTIVE_ACTION_STATUS.RESOLVED,
    createdBy: 'Sarah Jenkins (Supervisor)',
    createdAt: minutesAgo(30),
    resolvedAt: minutesAgo(5),
    resolutionNotes: 'Fresh ice bucket prepared and flutes polished; verified in pantry.'
  }
];

export const INITIAL_HANDOVERS = [
  {
    id: 'HND-101',
    taskId: 'TSK-1035',
    taskTitle: 'Luggage Transfer to Presidential Suite',
    location: 'Lobby Staging Area -> Suite 1401',
    currentStatus: 'In Progress / Overdue',
    workCompleted: '3 of 5 luggage pieces tagged and staged in 14th floor service foyer.',
    outstandingActions: 'Deliver remaining 2 hard cases as soon as Service Lift B safety clearance is executed; verify guest satisfaction.',
    risks: 'VIP Ambassador arriving at 14:00; high risk of complaint if luggage is not positioned before check-in.',
    currentOwner: 'Sarah Jenkins (Day Supervisor)',
    nextOwner: 'Marcus Wu (Evening Shift Supervisor)',
    nextOwnerRole: 'Evening Supervisor',
    targetCompletionTime: minutesFromNow(60),
    notes: 'Crossover briefing completed at 09:30. Marcus Wu briefed on elevator re-routing contingency.',
    createdBy: 'Sarah Jenkins (Supervisor)',
    createdAt: minutesAgo(25),
    status: HANDOVER_STATUS.PENDING_ACK,
    acknowledgedBy: null,
    acknowledgedAt: null,
    acknowledgementNotes: ''
  },
  {
    id: 'HND-102',
    taskId: 'TSK-1029',
    taskTitle: 'Emergency Solvent Spill Neutralization & Area Lockout',
    location: 'Service Lift B - Shaft Vestibule (Level 3)',
    currentStatus: 'Blocked / Pending Safety Clearance',
    workCompleted: 'Chemical containment pellets applied, positive pressure blower running, barrier tape secured.',
    outstandingActions: 'Escort Safety Officer for atmospheric testing at 10:30; obtain written gas clearance certificate before unlocking lift vestibule.',
    risks: 'Hazardous vapor inhalation if seal breached prematurely.',
    currentOwner: 'Sarah Jenkins (Day Supervisor)',
    nextOwner: 'David Kim (Maintenance Tech)',
    nextOwnerRole: 'Lead Maintenance Tech',
    targetCompletionTime: minutesFromNow(75),
    notes: 'Strict instructions: DO NOT remove warning tape until certified safety certificate is attached in app.',
    createdBy: 'Sarah Jenkins (Supervisor)',
    createdAt: hoursAgo(1),
    status: HANDOVER_STATUS.ACKNOWLEDGED,
    acknowledgedBy: 'David Kim',
    acknowledgedAt: minutesAgo(40),
    acknowledgementNotes: 'Understood. Air monitor calibrated and standing by for Safety Officer arrival.'
  }
];

export const INITIAL_SUPERVISOR_NOTIFICATIONS = [
  {
    id: 'SNOTIF-1',
    taskId: 'TSK-1020',
    type: 'inspection_pending',
    title: 'Inspection Required: VIP Presidential Suite 1501',
    message: 'Attendant Elena Ramos completed full turnover & sanitization. Awaiting supervisor sign-off before keycard release.',
    timestamp: minutesAgo(35),
    isRead: false,
    priority: 'urgent',
    category: 'Inspection'
  },
  {
    id: 'SNOTIF-2',
    taskId: 'TSK-1035',
    type: 'overdue',
    title: 'Overdue Alert: Luggage Transfer TSK-1035',
    message: 'Task is overdue by 25 minutes. Current assignee: Jamal Ortiz. Elevator delay reported.',
    timestamp: minutesAgo(25),
    isRead: false,
    priority: 'urgent',
    category: 'Overdue'
  },
  {
    id: 'SNOTIF-3',
    taskId: 'TSK-1029',
    type: 'safety_blocker',
    title: 'Safety Restriction Active: Service Lift B',
    message: 'Blocker BLK-401 pending certified safety clearance. Release disabled until certified officer signs off.',
    timestamp: hoursAgo(1.5),
    isRead: false,
    priority: 'urgent',
    category: 'Safety'
  },
  {
    id: 'SNOTIF-4',
    taskId: 'TSK-1018',
    type: 'reopened',
    title: 'Task Reopened: Penthouse 1602 Grout Reseal',
    message: 'Corrective action CA-501 in progress by David Kim following inspection rejection.',
    timestamp: hoursAgo(1.8),
    isRead: true,
    priority: 'high',
    category: 'Quality'
  },
  {
    id: 'SNOTIF-5',
    taskId: 'TSK-1042',
    type: 'handover_pending',
    title: 'Shift Handover Awaiting Acknowledgement',
    message: 'Handover HND-101 (TSK-1035 Luggage Transfer) created for evening crossover.',
    timestamp: minutesAgo(20),
    isRead: false,
    priority: 'medium',
    category: 'Handover'
  }
];
