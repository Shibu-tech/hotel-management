/**
 * StayOps Hotel Management App - Safety & Security Operations Mock Data
 * Realistic security incidents, alarms, tactical backup requests, escalations, evidence vault, and shift handovers.
 */

const now = Date.now();
const minutesAgo = (m) => new Date(now - m * 60 * 1000).toISOString();
const minutesFromNow = (m) => new Date(now + m * 60 * 1000).toISOString();
const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString();

export const INCIDENT_SEVERITY = {
  EMERGENCY: 'Emergency',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
};

export const INCIDENT_STATUS = {
  OPEN: 'Open',
  ACKNOWLEDGED: 'Acknowledged',
  RESPONDING: 'Responding',
  INVESTIGATING: 'Investigating',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed'
};

export const BACKUP_STATUS = {
  REQUESTED: 'Requested',
  ACKNOWLEDGED: 'Acknowledged',
  RESPONDING: 'Responding',
  ARRIVED: 'Arrived/Assisting',
  COMPLETED: 'Completed'
};

export const INITIAL_SECURITY_ALERTS = [
  {
    id: 'ALT-101',
    title: 'Panic Alarm Triggered: North Cashier Desk',
    category: 'Duress Alarm',
    severity: INCIDENT_SEVERITY.EMERGENCY,
    location: 'Front Desk - Cashier Station 02',
    timestamp: minutesAgo(8),
    acknowledged: false,
    acknowledgedBy: null,
    acknowledgedAt: null,
    source: 'Silent Under-Counter Button',
    status: 'Active',
    description: 'Silent panic button triggered by cashier desk staff. Possible verbal hostility or duress.',
    recommendedAction: 'Immediate two-officer dispatch with silent approach.'
  },
  {
    id: 'ALT-102',
    title: 'Perimeter Motion Sensor: East Garden Gate',
    category: 'Perimeter Breach',
    severity: INCIDENT_SEVERITY.HIGH,
    location: 'East Wing Garden Gate (Sensor P-08)',
    timestamp: minutesAgo(24),
    acknowledged: true,
    acknowledgedBy: 'Marcus Vance (EMP-601)',
    acknowledgedAt: minutesAgo(20),
    source: 'Infrared Beam Interruption',
    status: 'Investigating',
    description: 'Beam broken after official gate lock hour (22:00). Camera 14 indicates shadow movement near hedge.',
    recommendedAction: 'Officer patrol with flashlight inspection of gate latch and perimeter fence.'
  },
  {
    id: 'ALT-103',
    title: 'Repeated Invalid Keycard Access Attempts',
    category: 'Access Control',
    severity: INCIDENT_SEVERITY.MEDIUM,
    location: 'Executive Suite 814',
    timestamp: minutesAgo(42),
    acknowledged: true,
    acknowledgedBy: 'Sarah O’Connor (EMP-604)',
    acknowledgedAt: minutesAgo(38),
    source: 'VingCard RFID Reader Telemetry',
    status: 'Logged',
    description: '7 consecutive failed access attempts using deactivated staff card key within 3 minutes.',
    recommendedAction: 'Contact registered guest room phone and dispatch floor runner.'
  },
  {
    id: 'ALT-104',
    title: 'Fire Smoke Detector Pre-Alarm: Laundry Dryer Duct',
    category: 'Fire Safety',
    severity: INCIDENT_SEVERITY.HIGH,
    location: 'Sub-Level 2 Laundry Facility',
    timestamp: minutesAgo(12),
    acknowledged: false,
    acknowledgedBy: null,
    acknowledgedAt: null,
    source: 'Simplex 4100ES Optical Smoke Sensor S-24',
    status: 'Active',
    description: 'Thermal rise and optical density threshold exceeded in dryer lint extraction duct.',
    recommendedAction: 'Dispatch security officer and alert engineering duty tech immediately.'
  }
];

export const INITIAL_SECURITY_INCIDENTS = [
  {
    id: 'INC-801',
    title: 'Domestic Verbal Disturbance & Noise Complaint',
    category: 'Guest Disturbance',
    severity: INCIDENT_SEVERITY.HIGH,
    location: 'Room 412 (West Wing, 4th Floor)',
    status: INCIDENT_STATUS.RESPONDING,
    reportedAt: minutesAgo(35),
    assignedTo: {
      id: 'EMP-601',
      name: 'Marcus Vance',
      role: 'Lead Security Responder',
      radioChannel: 'CH 03'
    },
    reportedBy: 'Front Desk Night Lead (EMP-108)',
    acknowledgedAt: minutesAgo(30),
    respondingAt: minutesAgo(25),
    targetResponseMinutes: 5,
    actualResponseMinutes: 4.1,
    description: 'Neighboring guests in Rooms 410 and 414 reported loud shouting, slamming furniture, and crying.',
    nextAction: 'De-escalate verbally with lead officer and verify physical wellbeing of occupants.',
    notes: [
      {
        id: 'NOT-1',
        author: 'Marcus Vance (EMP-601)',
        timestamp: minutesAgo(25),
        text: 'Arrived at 4th floor corridor outside Room 412. Auditory confirmation of heated argument. Requesting standby backup.'
      },
      {
        id: 'NOT-2',
        author: 'Sarah O’Connor (EMP-604)',
        timestamp: minutesAgo(20),
        text: 'Backup arrived on 4th floor. Standing by elevator bank while Officer Vance knocks.'
      }
    ],
    timeline: [
      { event: 'Incident Logged', actor: 'Front Desk Night Lead', timestamp: minutesAgo(35) },
      { event: 'Dispatched to Officer Vance', actor: 'Dispatch System', timestamp: minutesAgo(32) },
      { event: 'Alert Acknowledged', actor: 'Marcus Vance', timestamp: minutesAgo(30) },
      { event: 'Response En Route', actor: 'Marcus Vance', timestamp: minutesAgo(25) },
      { event: 'Backup Requested (BAK-301)', actor: 'Marcus Vance', timestamp: minutesAgo(22) }
    ],
    evidenceIds: ['EVD-101'],
    linkedTask: 'TSK-1029',
    closureDetails: null
  },
  {
    id: 'INC-802',
    title: 'Emergency Solvent Spill & Zone Lockout Sign-Off',
    category: 'Safety Lockout',
    severity: INCIDENT_SEVERITY.EMERGENCY,
    location: 'Service Lift B - Shaft Vestibule (Level 3)',
    status: INCIDENT_STATUS.INVESTIGATING,
    reportedAt: hoursAgo(1.5),
    assignedTo: {
      id: 'EMP-601',
      name: 'Marcus Vance',
      role: 'Lead Security Responder',
      radioChannel: 'CH 03'
    },
    reportedBy: 'Department Supervisor Sarah Jenkins',
    acknowledgedAt: hoursAgo(1.3),
    respondingAt: hoursAgo(1.2),
    targetResponseMinutes: 10,
    actualResponseMinutes: 6.5,
    description: 'Chemical solvent fracture in Service Lift B shaft vestibule. Area sealed under safety lockout BLK-401 pending Certified Safety Officer inspection.',
    nextAction: 'Complete atmospheric volatile organic compound (VOC) vapor test and certify lockout release.',
    notes: [
      {
        id: 'NOT-3',
        author: 'Marcus Vance (EMP-601)',
        timestamp: hoursAgo(0.5),
        text: 'Multi-gas photoionization detector calibrated. Atmospheric reading at doorway shows 12 ppm VOC, down from 85 ppm initial.'
      }
    ],
    timeline: [
      { event: 'Blocker BLK-401 Linked', actor: 'Supervisor Sarah Jenkins', timestamp: hoursAgo(1.5) },
      { event: 'Assigned to Security Command', actor: 'System', timestamp: hoursAgo(1.4) },
      { event: 'Physical Lockout Barricade Verified', actor: 'Marcus Vance', timestamp: hoursAgo(1.1) }
    ],
    evidenceIds: ['EVD-102'],
    linkedBlocker: 'BLK-401',
    closureDetails: null
  },
  {
    id: 'INC-803',
    title: 'Intoxicated Individual Refusing to Vacate Pool Cabana',
    category: 'Trespass & Refusal',
    severity: INCIDENT_SEVERITY.MEDIUM,
    location: 'Main Resort Pool Deck - VIP Cabana 04',
    status: INCIDENT_STATUS.ACKNOWLEDGED,
    reportedAt: minutesAgo(50),
    assignedTo: {
      id: 'EMP-603',
      name: 'Carlos Ruiz',
      role: 'Patrol Officer',
      radioChannel: 'CH 03'
    },
    reportedBy: 'Pool & Beverage Supervisor (EMP-502)',
    acknowledgedAt: minutesAgo(40),
    respondingAt: null,
    targetResponseMinutes: 15,
    actualResponseMinutes: null,
    description: 'Non-resident guest refuses to leave cabana after pool closing hour (21:00). Verbally hostile to pool attendants.',
    nextAction: 'Officer Ruiz en route with hotel guest verification protocol.',
    notes: [
      {
        id: 'NOT-4',
        author: 'Carlos Ruiz (EMP-603)',
        timestamp: minutesAgo(38),
        text: 'Contacted pool attendant by radio. Subject is sitting with beverage, refusing ID check.'
      }
    ],
    timeline: [
      { event: 'Incident Reported', actor: 'Pool Supervisor', timestamp: minutesAgo(50) },
      { event: 'Acknowledged', actor: 'Carlos Ruiz', timestamp: minutesAgo(40) }
    ],
    evidenceIds: [],
    closureDetails: null
  },
  {
    id: 'INC-804',
    title: 'Theft Report: Designer Watch Missing from Room Safe',
    category: 'Theft / Asset Loss',
    severity: INCIDENT_SEVERITY.HIGH,
    location: 'Presidential Suite 901',
    status: INCIDENT_STATUS.INVESTIGATING,
    reportedAt: hoursAgo(3),
    assignedTo: {
      id: 'EMP-601',
      name: 'Marcus Vance',
      role: 'Lead Security Responder',
      radioChannel: 'CH 03'
    },
    reportedBy: 'Guest Concierge Desk',
    acknowledgedAt: hoursAgo(2.8),
    respondingAt: hoursAgo(2.5),
    targetResponseMinutes: 15,
    actualResponseMinutes: 11.0,
    description: 'VIP guest reported Rolex Submariner timepiece ($14,500) absent from electronic in-room safe upon return from dinner.',
    nextAction: 'Download electronic lock & safe audit logs; review CCTV corridor Camera 9-B.',
    notes: [
      {
        id: 'NOT-5',
        author: 'Marcus Vance (EMP-601)',
        timestamp: hoursAgo(2.1),
        text: 'Safe interrogation tool connected. Lock serial #901-S extracted. Audit reveals master code entry at 19:42 by unknown card.'
      }
    ],
    timeline: [
      { event: 'Case Opened', actor: 'Duty Manager Elena Rostova', timestamp: hoursAgo(3) },
      { event: 'Safe Audit Log Interrogated', actor: 'Marcus Vance', timestamp: hoursAgo(2.1) },
      { event: 'Escalated to Hotel General Manager', actor: 'Marcus Vance', timestamp: hoursAgo(1.8) }
    ],
    evidenceIds: ['EVD-103'],
    closureDetails: null
  },
  {
    id: 'INC-800',
    title: 'Unauthorized Roof Access Door Forced Open',
    category: 'Perimeter Breach',
    severity: INCIDENT_SEVERITY.HIGH,
    location: 'North Tower Stairwell 4 - Roof Landing',
    status: INCIDENT_STATUS.CLOSED,
    reportedAt: hoursAgo(6),
    assignedTo: {
      id: 'EMP-601',
      name: 'Marcus Vance',
      role: 'Lead Security Responder',
      radioChannel: 'CH 03'
    },
    reportedBy: 'Building Automation System (BAS)',
    acknowledgedAt: hoursAgo(5.9),
    respondingAt: hoursAgo(5.7),
    targetResponseMinutes: 5,
    actualResponseMinutes: 3.5,
    description: 'Magnetic reed switch broken on roof exit door. Two juveniles discovered taking photos on helipad.',
    nextAction: 'Case resolved; juveniles escorted to lobby and released to parents with trespass advisory.',
    notes: [
      {
        id: 'NOT-0',
        author: 'Marcus Vance (EMP-601)',
        timestamp: hoursAgo(5),
        text: 'Magnetic lock latch secured with secondary padlock. Maintenance requisition REQ-449 submitted for latch sensor repair.'
      }
    ],
    timeline: [
      { event: 'Alarm Triggered', actor: 'BAS Sensor', timestamp: hoursAgo(6) },
      { event: 'Arrived on Scene', actor: 'Marcus Vance', timestamp: hoursAgo(5.7) },
      { event: 'Subjects Detained & Escorted', actor: 'Marcus Vance', timestamp: hoursAgo(5.3) },
      { event: 'Case Closed by Officer Vance', actor: 'Marcus Vance', timestamp: hoursAgo(4.8) }
    ],
    evidenceIds: ['EVD-104'],
    closureDetails: {
      closedBy: 'Marcus Vance (EMP-601)',
      closedAt: hoursAgo(4.8),
      resolutionSummary: 'Subjects identified as hotel guests in Room 610. Escorted off roof. No property damage. Padlock installed.',
      policeNotified: false
    }
  }
];

export const INITIAL_BACKUP_REQUESTS = [
  {
    id: 'BAK-301',
    incidentId: 'INC-801',
    incidentTitle: 'Domestic Verbal Disturbance & Noise Complaint',
    location: 'Room 412 (West Wing, 4th Floor)',
    requestedSupport: 'Secondary Armed / Certified Officer',
    priority: INCIDENT_SEVERITY.HIGH,
    requestingOfficer: 'Marcus Vance (EMP-601)',
    requestedAt: minutesAgo(22),
    assignedBackupOfficer: 'Sarah O’Connor (EMP-604)',
    status: BACKUP_STATUS.ARRIVED,
    acknowledgedAt: minutesAgo(21),
    arrivedAt: minutesAgo(18),
    reason: 'Audible volatile physical aggression behind closed hotel door. Two-officer approach mandatory under Standard Operating Procedure SOP-SEC-12.'
  },
  {
    id: 'BAK-302',
    incidentId: 'INC-804',
    incidentTitle: 'Theft Report: Designer Watch Missing from Room Safe',
    location: 'Presidential Suite 901',
    requestedSupport: 'CCTV Video Forensic Specialist & IT Security',
    priority: INCIDENT_SEVERITY.MEDIUM,
    requestingOfficer: 'Marcus Vance (EMP-601)',
    requestedAt: hoursAgo(2),
    assignedBackupOfficer: 'Kevin Thorne (IT / Surveillance)',
    status: BACKUP_STATUS.RESPONDING,
    acknowledgedAt: hoursAgo(1.8),
    arrivedAt: null,
    reason: 'Corridor Camera 9-B angle review and safe cryptographic keycard audit timestamp cross-referencing needed.'
  },
  {
    id: 'BAK-303',
    incidentId: 'INC-802',
    incidentTitle: 'Emergency Solvent Spill & Zone Lockout Sign-Off',
    location: 'Service Lift B - Shaft Vestibule (Level 3)',
    requestedSupport: 'Facilities Emergency Hazmat Technician',
    priority: INCIDENT_SEVERITY.HIGH,
    requestingOfficer: 'Marcus Vance (EMP-601)',
    requestedAt: minutesAgo(40),
    assignedBackupOfficer: null,
    status: BACKUP_STATUS.REQUESTED,
    acknowledgedAt: null,
    arrivedAt: null,
    reason: 'Assistance needed with positive air ventilation fan removal and secondary seal test.'
  }
];

export const INITIAL_SECURITY_ESCALATIONS = [
  {
    id: 'ESC-201',
    incidentId: 'INC-804',
    incidentTitle: 'Theft Report: Designer Watch Missing from Room Safe',
    severity: INCIDENT_SEVERITY.HIGH,
    reason: 'High-value property loss ($14,500) involving potential unauthorized master keycard usage inside luxury suite.',
    currentOwner: 'Marcus Vance (EMP-601)',
    destinationRole: 'Hotel General Manager & Legal Counsel',
    destinationContact: 'Arthur Pendelton (GM) / Legal Duty Desk',
    escalatedAt: hoursAgo(1.8),
    acknowledged: true,
    acknowledgedBy: 'Elena Rostova (Operations Manager)',
    acknowledgedAt: hoursAgo(1.5),
    responseDeadline: minutesFromNow(45),
    nextAction: 'File formal sworn police report (Metro Police Dept Case #2026-OCT-8821) if internal audit fails to locate asset by 12:00.'
  },
  {
    id: 'ESC-202',
    incidentId: 'INC-801',
    incidentTitle: 'Domestic Verbal Disturbance & Noise Complaint',
    severity: INCIDENT_SEVERITY.HIGH,
    reason: 'Subject refusing officer request to open door; sound of breaking glass detected inside room.',
    currentOwner: 'Marcus Vance (EMP-601)',
    destinationRole: 'Security Director & Local Law Enforcement Dispatch',
    destinationContact: 'Metro Police Emergency 911 / Duty Captain',
    escalatedAt: minutesAgo(10),
    acknowledged: false,
    acknowledgedBy: null,
    acknowledgedAt: null,
    responseDeadline: minutesFromNow(10),
    nextAction: 'Command authorization required for master emergency key override entry with active backup.'
  }
];

export const INITIAL_SECURITY_EVIDENCE = [
  {
    id: 'EVD-101',
    incidentId: 'INC-801',
    title: 'Audio Recording: 4th Floor Corridor Disturbance Decibel Log',
    category: 'Audio Recording',
    fileType: 'Audio / Decibel Telemetry (WAV)',
    fileSize: '4.2 MB',
    uploadedBy: 'Marcus Vance (EMP-601)',
    uploadedAt: minutesAgo(20),
    isProtected: true,
    chainOfCustody: [
      { action: 'Recorded & Encrypted', actor: 'Marcus Vance', timestamp: minutesAgo(20) },
      { action: 'Hashed SHA-256 for Evidentiary Integrity', actor: 'StayOps Vault', timestamp: minutesAgo(19) }
    ],
    notes: 'Corridor microphone captured decibel levels reaching 82 dB (breach of hotel quiet hours policy).'
  },
  {
    id: 'EVD-102',
    incidentId: 'INC-802',
    title: 'Photo Evidence: Broken Solvent Bottle & Barricade Latch',
    category: 'Photographic',
    fileType: 'High-Resolution JPEG (4032 x 3024)',
    fileSize: '8.7 MB',
    uploadedBy: 'Marcus Vance (EMP-601)',
    uploadedAt: hoursAgo(1.2),
    isProtected: true,
    chainOfCustody: [
      { action: 'Captured on Body Terminal', actor: 'Marcus Vance', timestamp: hoursAgo(1.2) },
      { action: 'Attached to Blocker BLK-401', actor: 'StayOps Vault', timestamp: hoursAgo(1.1) }
    ],
    notes: 'Shows chemical solvent fracture on ceramic floor tiles before application of neutralizer pellets.'
  },
  {
    id: 'EVD-103',
    incidentId: 'INC-804',
    title: 'Digital Cryptographic Audit Interrogation: Room 901 Safe',
    category: 'Digital Telemetry',
    fileType: 'Encrypted Safe Log CSV',
    fileSize: '184 KB',
    uploadedBy: 'Marcus Vance (EMP-601)',
    uploadedAt: hoursAgo(2),
    isProtected: true,
    chainOfCustody: [
      { action: 'Optical Handheld Interrogation', actor: 'Marcus Vance', timestamp: hoursAgo(2) },
      { action: 'Copied to Incident File INC-804', actor: 'StayOps Security Vault', timestamp: hoursAgo(1.9) }
    ],
    notes: 'Safe serial #901-S audit record showing 4 events on 23-Oct. Master code entry logged at 19:42:11.'
  },
  {
    id: 'EVD-104',
    incidentId: 'INC-800',
    title: 'Surveillance Clip: Roof Access Helipad Entry',
    category: 'CCTV Video',
    fileType: 'Video Stream (MP4 / H.264)',
    fileSize: '45.1 MB',
    uploadedBy: 'Surveillance Server (CAM-ROOF-01)',
    uploadedAt: hoursAgo(5.8),
    isProtected: true,
    chainOfCustody: [
      { action: 'Auto-Exported from NVR', actor: 'System', timestamp: hoursAgo(5.8) },
      { action: 'Archived for Closed Case', actor: 'Marcus Vance', timestamp: hoursAgo(4.8) }
    ],
    notes: 'Clear visual of two teenagers pushing roof fire door at 10:18 PM.'
  }
];

export const INITIAL_SECURITY_HANDOVERS = [
  {
    id: 'SHO-501',
    outgoingOfficer: 'Marcus Vance (EMP-601)',
    outgoingShift: 'Evening / Night Shift (16:00 – 00:30)',
    incomingOfficer: 'Gabriel Thorne (EMP-607)',
    incomingShift: 'Graveyard Shift (00:00 – 08:30)',
    status: 'Pending Acceptance', // 'Pending Acceptance' | 'Accepted'
    submittedAt: minutesAgo(15),
    acceptedAt: null,
    watchSummary: 'Watch was elevated due to Domestic Disturbance INC-801 on floor 4 and Safety Lockout BLK-401 on Level 3. West perimeter check complete.',
    unresolvedItems: [
      'INC-801 active on floor 4 — standby backup in position.',
      'BLK-401 Level 3 chemical lockout awaiting morning VOC sign-off.',
      'Radio terminal #04 docked on charging station bay 2.'
    ],
    equipmentChecklist: {
      radioHandsets: '8 / 8 accounted for',
      masterKeys: 'All 4 security override fobs secured in safe',
      bodyCameras: '6 units docked and uploading footage',
      firstAidDefibrillator: 'AED battery tested green / pads sealed'
    }
  }
];

export const SECURITY_EMERGENCY_PROTOCOLS = [
  {
    code: 'CODE RED',
    title: 'Fire / Active Smoke Hazard',
    color: 'bg-red-600 text-white',
    badge: 'FIRE EMERGENCY',
    steps: [
      'Activate nearest manual pull station if not automatically tripped.',
      'Notify Fire Dispatch via Emergency Line 911 / Direct Fire Dept extension #9911.',
      'Clear designated evacuation stairwells North 2 & South 4.',
      'Check fire shutter deployment at elevator concourses.',
      'Establish incident command post at Main Front Gate.'
    ]
  },
  {
    code: 'CODE BLUE',
    title: 'Medical Emergency / Cardiac Arrest',
    color: 'bg-blue-600 text-white',
    badge: 'MEDICAL CRITICAL',
    steps: [
      'Grab automated external defibrillator (AED) and trauma kit from Security Hub.',
      'Dispatch officer with CPR/First Aid certification immediately to victim coordinates.',
      'Have secondary officer hold ground elevator for EMS paramedic team.',
      'Contact 911 EMS Dispatch with age, gender, breathing status, and room entry path.'
    ]
  },
  {
    code: 'CODE BLACK',
    title: 'Active Security Threat / Armed Hostility',
    color: 'bg-slate-950 text-white',
    badge: 'SECURITY THREAT',
    steps: [
      'Enforce immediate silent lockdown of lobby and corridor guest access doors.',
      'Notify local police department with active shooter / weapon alert.',
      'Broadcast silent radio evacuation code on Channel 03.',
      'Do not attempt unarmed solo intervention. Guide guests to shelter-in-place.'
    ]
  },
  {
    code: 'CODE ORANGE',
    title: 'Hazardous Chemical Spill / Gas Leak',
    color: 'bg-amber-600 text-white',
    badge: 'HAZMAT CONTAINMENT',
    steps: [
      'Isolate area with caution tape and enforce strict mechanical ventilation.',
      'Turn off HVAC air recirculation dampers for affected floor zone.',
      'Ensure certified Hazmat / Safety Officer performs atmospheric gas clearance test.'
    ]
  }
];
