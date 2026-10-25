import { TASK_STATUS, TASK_PRIORITY, TASK_CATEGORY, INSPECTION_STATUS } from '../utils/taskStatus';

// Helper to compute timestamps relative to now for fresh demonstration
const now = Date.now();
const minutesAgo = (m) => new Date(now - m * 60 * 1000).toISOString();
const minutesFromNow = (m) => new Date(now + m * 60 * 1000).toISOString();
const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString();

export const INITIAL_TASKS = [
  {
    id: 'TSK-1042',
    title: 'Hypoallergenic Bedding & Extra Pillows',
    category: TASK_CATEGORY.HOUSEKEEPING,
    location: 'Executive Suite 712',
    item: 'Hypoallergenic Pillow & Duvet Set',
    quantity: 2,
    priority: TASK_PRIORITY.URGENT,
    status: TASK_STATUS.NEW,
    assignedTo: {
      id: 'EMP-418',
      name: 'Marcus Alvarez',
      shift: 'Morning Shift'
    },
    createdAt: hoursAgo(1),
    dueAt: minutesFromNow(20), // Due in 20 minutes (Due Soon)
    scheduledStart: minutesFromNow(5),
    completedAt: null,
    guestUpdateRequired: true,
    inspectionRequired: false,
    inspectionStatus: INSPECTION_STATUS.NOT_REQUIRED,
    instructions: 'Guest has severe dust-mite sensitivity. Ensure linens are sealed in sanitized plastic packaging. Please knock twice, do not ring bell as infant is sleeping.',
    internalNotes: 'VIP guest checked in early. High profile corporate account.',
    delayInfo: null,
    escalationInfo: null,
    blockerInfo: null,
    guestCommunicationHistory: [
      {
        id: 'GCOM-1',
        timestamp: minutesAgo(45),
        actor: 'Front Desk Concierge',
        summary: 'Guest confirmed request at check-in desk; promised delivery before 08:00 AM.'
      }
    ],
    history: [
      {
        id: 'HIS-101',
        event: 'Task Created',
        details: 'Dispatched by Front Desk Concierge system.',
        timestamp: hoursAgo(1),
        actor: 'Front Desk Concierge'
      },
      {
        id: 'HIS-102',
        event: 'Assigned to Staff',
        details: 'Assigned to Marcus Alvarez by Dispatcher Cynthia Vance.',
        timestamp: minutesAgo(50),
        actor: 'Cynthia Vance (Dispatcher)'
      }
    ]
  },
  {
    id: 'TSK-1049',
    title: 'Welcome Champagne Bucket & Crystal Flutes',
    category: TASK_CATEGORY.ROOM_SERVICE,
    location: 'Honeymoon Suite 520',
    item: 'Moët & Chandon with Ice Bucket & 2 Flutes',
    quantity: 1,
    priority: TASK_PRIORITY.URGENT,
    status: TASK_STATUS.IN_PROGRESS,
    assignedTo: {
      id: 'EMP-431',
      name: 'Carlos Mendez',
      shift: 'Morning Shift'
    },
    createdAt: minutesAgo(40),
    dueAt: minutesFromNow(15), // Due soon
    scheduledStart: minutesAgo(20),
    completedAt: null,
    guestUpdateRequired: false,
    inspectionRequired: true,
    inspectionStatus: INSPECTION_STATUS.PENDING,
    instructions: 'Chilled bottle with monogrammed greeting card from General Manager. Place on central coffee table.',
    internalNotes: 'Anniversary couple arriving around 08:00 AM. Keycard active.',
    delayInfo: null,
    escalationInfo: null,
    blockerInfo: null,
    guestCommunicationHistory: [],
    history: [
      {
        id: 'HIS-201',
        event: 'Task Created',
        details: 'Automated VIP amenities workflow triggered by reservations.',
        timestamp: minutesAgo(40),
        actor: 'System / Reservations'
      },
      {
        id: 'HIS-202',
        event: 'Assigned',
        details: 'Assigned to Carlos Mendez by Dispatcher.',
        timestamp: minutesAgo(35),
        actor: 'Cynthia Vance (Dispatcher)'
      },
      {
        id: 'HIS-203',
        event: 'Status Updated',
        details: 'Status changed from New to In Progress.',
        timestamp: minutesAgo(20),
        actor: 'Carlos Mendez (Server)'
      }
    ]
  },
  {
    id: 'TSK-1035',
    title: 'Luggage Transfer to Presidential Suite',
    category: TASK_CATEGORY.LUGGAGE_BELL,
    location: 'Lobby Staging Area -> Suite 1401',
    item: '4 Hardcase Suitcases & 1 Garment Bag',
    quantity: 5,
    priority: TASK_PRIORITY.HIGH,
    status: TASK_STATUS.IN_PROGRESS,
    assignedTo: {
      id: 'EMP-389',
      name: 'Jamal Ortiz',
      shift: 'Morning Shift'
    },
    createdAt: hoursAgo(2),
    dueAt: minutesAgo(25), // OVERDUE!
    scheduledStart: hoursAgo(1.5),
    completedAt: null,
    guestUpdateRequired: true,
    inspectionRequired: false,
    inspectionStatus: INSPECTION_STATUS.NOT_REQUIRED,
    instructions: 'Handle with white gloves. Place suitcases on luggage racks in master walk-in wardrobe.',
    internalNotes: 'Guest is waiting in Executive Lounge on 14th floor.',
    delayInfo: {
      reason: 'Equipment malfunction / technical failure',
      notes: 'Service elevator B taken offline due to safety sensor tripping. Transporting via Service Elevator A.',
      revisedExpectedAt: minutesFromNow(20),
      reportedAt: minutesAgo(20),
      reportedBy: 'Jamal Ortiz (Porter)',
      nextAction: 'Re-routing luggage through staff concourse corridor.'
    },
    escalationInfo: {
      level: 'Department Supervisor',
      escalatedTo: 'Sarah Jenkins (Supervisor)',
      escalatedAt: minutesAgo(10),
      escalatedBy: 'Cynthia Vance (Dispatcher)',
      reason: 'Elevator downtime causing delay for VIP check-in luggage.',
      status: 'Acknowledged'
    },
    blockerInfo: null,
    guestCommunicationHistory: [
      {
        id: 'GCOM-2',
        timestamp: minutesAgo(18),
        actor: 'Cynthia Vance (Dispatcher)',
        summary: 'Notified Executive Lounge Concierge of 15m delay; complimentary beverages offered.'
      }
    ],
    history: [
      {
        id: 'HIS-301',
        event: 'Task Created',
        details: 'Dispatched by Concierge Desk.',
        timestamp: hoursAgo(2),
        actor: 'Front Desk Concierge'
      },
      {
        id: 'HIS-302',
        event: 'Assigned',
        details: 'Assigned to Jamal Ortiz.',
        timestamp: hoursAgo(1.5),
        actor: 'Cynthia Vance (Dispatcher)'
      },
      {
        id: 'HIS-303',
        event: 'Delay Recorded',
        details: 'Service lift downtime reported. Revised completion set.',
        timestamp: minutesAgo(20),
        actor: 'Jamal Ortiz (Porter)'
      },
      {
        id: 'HIS-304',
        event: 'Task Escalated',
        details: 'Escalated to Department Supervisor Sarah Jenkins.',
        timestamp: minutesAgo(10),
        actor: 'Cynthia Vance (Dispatcher)'
      }
    ]
  },
  {
    id: 'TSK-1020',
    title: 'VIP Presidential Suite Turnover & Deep Sanitization',
    category: TASK_CATEGORY.HOUSEKEEPING,
    location: 'Presidential Suite 1501',
    item: 'VIP Linen Restock, Balcony Polish & Bar Setup',
    quantity: 1,
    priority: TASK_PRIORITY.URGENT,
    status: TASK_STATUS.COMPLETED,
    assignedTo: {
      id: 'EMP-422',
      name: 'Elena Ramos',
      shift: 'Morning Shift'
    },
    createdAt: hoursAgo(4),
    dueAt: hoursAgo(1),
    scheduledStart: hoursAgo(3),
    completedAt: minutesAgo(35),
    guestUpdateRequired: true,
    inspectionRequired: true,
    inspectionStatus: INSPECTION_STATUS.PENDING, // Pending Supervisor Inspection!
    completionNotes: 'Full sanitized linen swap completed, balcony glass polished, welcome fruit basket staged, minibar restocked.',
    completionEvidence: [
      { id: 'EV-1', label: 'Sanitization Verification', type: 'checklist', details: 'UV wand inspection completed on headboards and remote controls.' },
      { id: 'EV-2', label: 'Suite Presentation Photo', type: 'photo', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80' }
    ],
    inspectionCriteria: [
      'All high-touch surfaces sanitized & certified',
      'VIP welcome amenities & General Manager greeting card staged',
      'Minibar seal intact & electronic inventory synced',
      'Thermostat set to welcome 21°C mode',
      'Balcony sliding doors polished and child-lock tested'
    ],
    instructions: 'Thorough turnover for Ambassador arrival at 14:00. Mandatory supervisor sign-off before keycard release.',
    internalNotes: 'Guest is a return Dignitary. Zero tolerance for missed checklist points.',
    delayInfo: null,
    escalationInfo: null,
    blockerInfo: null,
    history: [
      {
        id: 'HIS-2001',
        event: 'Task Created',
        details: 'Scheduled by Executive Office for Ambassador arrival.',
        timestamp: hoursAgo(4),
        actor: 'Executive Operations'
      },
      {
        id: 'HIS-2002',
        event: 'Assigned',
        details: 'Assigned to Elena Ramos.',
        timestamp: hoursAgo(3.8),
        actor: 'Sarah Jenkins (Supervisor)'
      },
      {
        id: 'HIS-2003',
        event: 'Work Completed',
        details: 'Attendant Elena Ramos completed work and submitted for supervisor inspection.',
        timestamp: minutesAgo(35),
        actor: 'Elena Ramos (Attendant)'
      }
    ]
  },
  {
    id: 'TSK-1018',
    title: 'Marble Vanity Polish & Shower Grout Reseal',
    category: TASK_CATEGORY.MAINTENANCE,
    location: 'Penthouse 1602',
    item: 'Rapid-set Silicone Sealant & Marble Buffing Kit',
    quantity: 1,
    priority: TASK_PRIORITY.HIGH,
    status: TASK_STATUS.IN_PROGRESS,
    assignedTo: {
      id: 'EMP-512',
      name: 'David Kim',
      shift: 'Day Operations'
    },
    createdAt: hoursAgo(6),
    dueAt: minutesFromNow(45),
    scheduledStart: hoursAgo(5),
    completedAt: null,
    guestUpdateRequired: false,
    inspectionRequired: true,
    inspectionStatus: INSPECTION_STATUS.REOPENED, // REOPENED BY SUPERVISOR!
    instructions: 'Re-caulk perimeter of master bath shower stall and buff etching off Carrara marble counter.',
    internalNotes: 'Initial work failed inspection due to tacky sealant and uneven line.',
    delayInfo: null,
    escalationInfo: null,
    blockerInfo: null,
    history: [
      {
        id: 'HIS-1801',
        event: 'Task Created',
        details: 'Maintenance ticket from Housekeeping morning inspection.',
        timestamp: hoursAgo(6),
        actor: 'Housekeeping Desk'
      },
      {
        id: 'HIS-1802',
        event: 'Assigned',
        details: 'Assigned to David Kim.',
        timestamp: hoursAgo(5.8),
        actor: 'Cynthia Vance (Dispatcher)'
      },
      {
        id: 'HIS-1803',
        event: 'Completed (Initial)',
        details: 'Tech David Kim marked task completed.',
        timestamp: hoursAgo(2.5),
        actor: 'David Kim (Tech)'
      },
      {
        id: 'HIS-1804',
        event: 'Task Reopened Post-Inspection',
        details: 'Supervisor Sarah Jenkins rejected inspection: Grout sealant in master shower stall was still tacky and missing caulking along baseboard. Reopened for corrective finish.',
        timestamp: hoursAgo(1.8),
        actor: 'Sarah Jenkins (Supervisor)',
        reason: 'Sealant incomplete and tacky'
      }
    ]
  },
  {
    id: 'TSK-1029',
    title: 'Emergency Solvent Spill Neutralization & Area Lockout',
    category: TASK_CATEGORY.MAINTENANCE,
    location: 'Service Lift B - Shaft Vestibule (Level 3)',
    item: 'Chemical Neutralizer Spill Kit & Hazardous Air Monitor',
    quantity: 1,
    priority: TASK_PRIORITY.URGENT,
    status: TASK_STATUS.BLOCKED,
    assignedTo: {
      id: 'EMP-512',
      name: 'David Kim',
      shift: 'Day Operations'
    },
    createdAt: hoursAgo(2),
    dueAt: minutesFromNow(40),
    scheduledStart: hoursAgo(1.5),
    completedAt: null,
    guestUpdateRequired: false,
    inspectionRequired: true,
    inspectionStatus: INSPECTION_STATUS.NOT_REQUIRED,
    instructions: 'Strict safety protocol. Neutralize solvent, deploy ventilation blower, and await certified Safety Officer atmospheric test before clearing zone.',
    internalNotes: 'Safety lockout active. Red barrier tape deployed on 3rd floor service vestibule.',
    delayInfo: {
      reason: 'Safety restriction',
      notes: 'Service elevator B vestibule sealed pending air toxicity clearance test.',
      revisedExpectedAt: minutesFromNow(40),
      reportedAt: hoursAgo(1.5),
      reportedBy: 'Elena Ramos (Attendant)',
      nextAction: 'Certified Safety Officer inspection scheduled for 10:15 AM.'
    },
    blockerInfo: {
      id: 'BLK-401',
      category: 'Safety restriction',
      description: 'Chemical cleaning solvent bottle fractured during trolley transit. Vapor buildup in enclosed shaft vestibule.',
      operationalImpact: 'Service lift B halted. Floor 3-6 luggage transfer rerouted through service lift A.',
      responsiblePerson: 'David Kim (Maintenance)',
      status: 'Pending Safety Clearance',
      safetyRestricted: true,
      safetyClearanceRequired: 'Certified Industrial Hygiene / Safety Officer Clearance required before zone release',
      safetyClearanceDetails: null, // PENDING! Supervisor cannot release without this!
      reportedBy: 'Elena Ramos (Attendant)',
      reportedAt: hoursAgo(1.5),
      expectedResolutionTime: minutesFromNow(45),
      history: [
        {
          id: 'BLKH-1',
          event: 'Safety Restriction Imposed',
          details: 'Zone barricaded by Attendant Elena Ramos after chemical spill detected.',
          timestamp: hoursAgo(1.5),
          actor: 'Elena Ramos (Attendant)'
        }
      ]
    },
    escalationInfo: {
      level: 'Emergency Security / Safety',
      escalatedTo: 'Safety & Security Dispatch (Immediate)',
      escalatedAt: hoursAgo(1.4),
      escalatedBy: 'Sarah Jenkins (Supervisor)',
      reason: 'Toxic solvent spill in enclosed vestibule; safety lockout engaged.',
      status: 'In Progress'
    },
    history: [
      {
        id: 'HIS-2901',
        event: 'Task Created',
        details: 'Urgent containment ticket created.',
        timestamp: hoursAgo(2),
        actor: 'Sarah Jenkins (Supervisor)'
      },
      {
        id: 'HIS-2902',
        event: 'Safety Lockout Enforced',
        details: 'Blocker BLK-401 created. Zone flagged as safety hazard.',
        timestamp: hoursAgo(1.5),
        actor: 'Sarah Jenkins (Supervisor)'
      }
    ]
  },
  {
    id: 'TSK-1055',
    title: 'Air Conditioning Thermostat Calibration',
    category: TASK_CATEGORY.MAINTENANCE,
    location: 'Deluxe King Room 418',
    item: 'Digital Thermostat Diagnostic Tool',
    quantity: 1,
    priority: TASK_PRIORITY.HIGH,
    status: TASK_STATUS.NEW,
    assignedTo: null, // UNASSIGNED!
    createdAt: minutesAgo(25),
    dueAt: minutesFromNow(60),
    scheduledStart: null,
    completedAt: null,
    guestUpdateRequired: true,
    inspectionRequired: false,
    inspectionStatus: INSPECTION_STATUS.NOT_REQUIRED,
    instructions: 'Guest reported ambient temperature staying at 26°C despite setting at 20°C. Check chiller valve and filter.',
    internalNotes: 'Guest is currently attending conference and requested repair before 11:00 AM.',
    delayInfo: null,
    escalationInfo: null,
    blockerInfo: null,
    guestCommunicationHistory: [],
    history: [
      {
        id: 'HIS-401',
        event: 'Task Created',
        details: 'Logged via guest app service portal.',
        timestamp: minutesAgo(25),
        actor: 'Guest App Portal'
      }
    ]
  },
  {
    id: 'TSK-1056',
    title: 'Replacement Bathrobe & Spa Slippers',
    category: TASK_CATEGORY.AMENITIES,
    location: 'Standard Room 310',
    item: 'Plush Waffle Robe (Size L) & Velvet Slippers',
    quantity: 2,
    priority: TASK_PRIORITY.MEDIUM,
    status: TASK_STATUS.NEW,
    assignedTo: null, // UNASSIGNED!
    createdAt: minutesAgo(15),
    dueAt: minutesFromNow(90),
    scheduledStart: null,
    completedAt: null,
    guestUpdateRequired: false,
    inspectionRequired: false,
    inspectionStatus: INSPECTION_STATUS.NOT_REQUIRED,
    instructions: 'Hang neatly on bathroom vanity rack.',
    internalNotes: 'Housekeeping laundry trolley refilled.',
    delayInfo: null,
    escalationInfo: null,
    blockerInfo: null,
    guestCommunicationHistory: [],
    history: [
      {
        id: 'HIS-501',
        event: 'Task Created',
        details: 'Guest requested via room phone to Operator.',
        timestamp: minutesAgo(15),
        actor: 'Hotel Operator'
      }
    ]
  },
  {
    id: 'TSK-1031',
    title: 'Full Stayover Cleaning & Balcony Mop',
    category: TASK_CATEGORY.HOUSEKEEPING,
    location: 'Ocean View Room 305',
    item: 'Complete Housekeeping Restock Kit',
    quantity: 1,
    priority: TASK_PRIORITY.MEDIUM,
    status: TASK_STATUS.BLOCKED,
    assignedTo: {
      id: 'EMP-422',
      name: 'Elena Ramos',
      shift: 'Morning Shift'
    },
    createdAt: hoursAgo(3),
    dueAt: minutesFromNow(120),
    scheduledStart: hoursAgo(1),
    completedAt: null,
    guestUpdateRequired: true,
    inspectionRequired: false,
    inspectionStatus: INSPECTION_STATUS.NOT_REQUIRED,
    instructions: 'Daily stayover service. Guest requested extra organic green tea sachets.',
    internalNotes: 'Guest has electronic DND enabled and latch engaged.',
    delayInfo: {
      reason: 'Room inaccessible / DND active',
      notes: 'Attendant Elena knocked at 08:15; privacy sign illuminated on digital doorbell.',
      revisedExpectedAt: minutesFromNow(90),
      reportedAt: hoursAgo(1),
      reportedBy: 'Elena Ramos (Attendant)',
      nextAction: 'Front desk called guest room; guest requested cleaning post 11:30 AM'
    },
    blockerInfo: {
      id: 'BLK-302',
      category: 'Room or area inaccessible',
      description: 'Privacy switch activated and deadbolt engaged. Guest do-not-disturb status verified.',
      operationalImpact: 'Morning floor cleaning route paused for room 305.',
      responsiblePerson: 'Elena Ramos (Attendant)',
      status: 'In Progress',
      safetyRestricted: false,
      reportedBy: 'Elena Ramos (Attendant)',
      reportedAt: hoursAgo(1),
      expectedResolutionTime: minutesFromNow(90),
      history: []
    },
    escalationInfo: null,
    guestCommunicationHistory: [
      {
        id: 'GCOM-3',
        timestamp: minutesAgo(50),
        actor: 'Front Desk Reception',
        summary: 'Front desk contacted guest via mobile; guest requested room cleaned at 11:30 AM.'
      }
    ],
    history: [
      {
        id: 'HIS-601',
        event: 'Task Created',
        details: 'Daily room turnover generated by PMS.',
        timestamp: hoursAgo(3),
        actor: 'PMS Scheduler'
      },
      {
        id: 'HIS-602',
        event: 'Assigned',
        details: 'Assigned to Elena Ramos.',
        timestamp: hoursAgo(2.5),
        actor: 'Cynthia Vance (Dispatcher)'
      },
      {
        id: 'HIS-603',
        event: 'Task Blocked',
        details: 'Blocked due to DND active. Reported by Elena Ramos.',
        timestamp: hoursAgo(1),
        actor: 'Elena Ramos (Attendant)'
      }
    ]
  },
  {
    id: 'TSK-1038',
    title: 'Continental Breakfast Tray & Fresh Juice',
    category: TASK_CATEGORY.ROOM_SERVICE,
    location: 'Junior Suite 604',
    item: 'Continental Basket, Berry Parfait, Pressed Orange Juice',
    quantity: 2,
    priority: TASK_PRIORITY.MEDIUM,
    status: TASK_STATUS.ON_THE_WAY,
    assignedTo: {
      id: 'EMP-418',
      name: 'Marcus Alvarez',
      shift: 'Morning Shift'
    },
    createdAt: minutesAgo(50),
    dueAt: minutesFromNow(10), // Due in 10 minutes
    scheduledStart: minutesAgo(20),
    completedAt: null,
    guestUpdateRequired: false,
    inspectionRequired: false,
    inspectionStatus: INSPECTION_STATUS.NOT_REQUIRED,
    instructions: 'Include gluten-free toast option confirmed by culinary kitchen. Silver cloche service.',
    internalNotes: 'Tray dispatched from kitchen hot pass at 07:45.',
    delayInfo: null,
    escalationInfo: null,
    blockerInfo: null,
    guestCommunicationHistory: [],
    history: [
      {
        id: 'HIS-701',
        event: 'Task Created',
        details: 'Ordered by guest via in-room tablet.',
        timestamp: minutesAgo(50),
        actor: 'Guest In-Room Tablet'
      },
      {
        id: 'HIS-702',
        event: 'Assigned',
        details: 'Assigned to Marcus Alvarez.',
        timestamp: minutesAgo(40),
        actor: 'Cynthia Vance (Dispatcher)'
      },
      {
        id: 'HIS-703',
        event: 'Status Updated to On the Way',
        details: 'Runner picked up hot tray and entered service elevator.',
        timestamp: minutesAgo(10),
        actor: 'Marcus Alvarez (Runner)'
      }
    ]
  },
  {
    id: 'TSK-1025',
    title: 'Replenish Cabana Beach Towels & Sunscreen',
    category: TASK_CATEGORY.AMENITIES,
    location: 'Poolside Cabana 4',
    item: 'Luxury Pool Towels & SPF 50 Spray',
    quantity: 6,
    priority: TASK_PRIORITY.LOW,
    status: TASK_STATUS.COMPLETED,
    assignedTo: {
      id: 'EMP-405',
      name: 'Priya Patel',
      shift: 'Day Shift'
    },
    createdAt: hoursAgo(4),
    dueAt: hoursAgo(2),
    scheduledStart: hoursAgo(3),
    completedAt: hoursAgo(2),
    guestUpdateRequired: false,
    inspectionRequired: false,
    inspectionStatus: INSPECTION_STATUS.NOT_REQUIRED,
    instructions: 'Fold rolled towels on teak lounger. Ensure sunscreen bottles are full.',
    internalNotes: 'Regular morning pool setup routine.',
    delayInfo: null,
    escalationInfo: null,
    blockerInfo: null,
    guestCommunicationHistory: [],
    history: [
      {
        id: 'HIS-801',
        event: 'Task Created',
        details: 'Pool concierge checklist ticket.',
        timestamp: hoursAgo(4),
        actor: 'Pool Manager'
      },
      {
        id: 'HIS-802',
        event: 'Assigned',
        details: 'Assigned to Priya Patel.',
        timestamp: hoursAgo(3.5),
        actor: 'Cynthia Vance (Dispatcher)'
      },
      {
        id: 'HIS-803',
        event: 'Completed',
        details: 'Delivered and confirmed via mobile scanner.',
        timestamp: hoursAgo(2),
        actor: 'Priya Patel (Runner)'
      }
    ]
  }
];
