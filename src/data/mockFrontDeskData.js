/**
 * StayOps Front Desk Coordinator Mock Dataset & Domain Models
 * Contains Hotel Rooms, Reservations, Room Moves, Wake-up Calls, Guest Communications, and Folios.
 */

const now = Date.now();
const minutesAgo = (m) => new Date(now - m * 60 * 1000).toISOString();
const minutesFromNow = (m) => new Date(now + m * 60 * 1000).toISOString();
const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString();
const hoursFromNow = (h) => new Date(now + h * 3600 * 1000).toISOString();
const daysAgo = (d) => new Date(now - d * 86400 * 1000).toISOString().split('T')[0];
const daysFromNow = (d) => new Date(now + d * 86400 * 1000).toISOString().split('T')[0];
const todayDate = new Date().toISOString().split('T')[0];

export const ROOM_STATUS = {
  READY: 'Ready / Clean & Inspected',
  DIRTY: 'Dirty / Turnover Required',
  CLEANING: 'Cleaning in Progress',
  INSPECTION: 'Awaiting Inspection',
  MAINTENANCE: 'Maintenance Lock'
};

export const OCCUPANCY_STATUS = {
  VACANT: 'Vacant',
  OCCUPIED: 'Occupied'
};

export const RESERVATION_STATUS = {
  CONFIRMED: 'Confirmed',
  CHECKED_IN: 'Checked-In',
  CHECKED_OUT: 'Checked-Out',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No-Show'
};

export const ROOM_MOVE_STATUS = {
  REQUESTED: 'Requested',
  APPROVED: 'Approved',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

export const WAKE_UP_STATUS = {
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  RESCHEDULED: 'Rescheduled',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled'
};

// Realistic Hotel Inventory across floors 3 - 15
export const INITIAL_ROOMS = [
  {
    roomNumber: '101',
    floor: 1,
    type: 'Standard Queen',
    rate: 165,
    cleanliness: ROOM_STATUS.READY,
    occupancy: OCCUPANCY_STATUS.VACANT,
    currentReservationId: null,
    guestName: null,
    features: ['Ground Floor', 'Courtyard Access', 'Walk-in Shower'],
    keyCardSystem: 'RFID-101'
  },
  {
    roomNumber: '104',
    floor: 1,
    type: 'Standard Queen',
    rate: 165,
    cleanliness: ROOM_STATUS.DIRTY,
    occupancy: OCCUPANCY_STATUS.VACANT,
    currentReservationId: null,
    guestName: null,
    features: ['Ground Floor', 'Accessible Bathroom', 'Near Lobby'],
    keyCardSystem: 'RFID-104'
  },
  {
    roomNumber: '204',
    floor: 2,
    type: 'Deluxe King',
    rate: 220,
    cleanliness: ROOM_STATUS.READY,
    occupancy: OCCUPANCY_STATUS.VACANT,
    currentReservationId: null,
    guestName: null,
    features: ['Balcony', 'City View', 'Work Desk'],
    keyCardSystem: 'RFID-204'
  },
  {
    roomNumber: '304',
    floor: 3,
    type: 'Deluxe King',
    rate: 220,
    cleanliness: ROOM_STATUS.DIRTY,
    occupancy: OCCUPANCY_STATUS.VACANT,
    currentReservationId: null,
    guestName: null,
    features: ['City View', 'Soaking Tub'],
    keyCardSystem: 'RFID-304'
  },
  {
    roomNumber: '308',
    floor: 3,
    type: 'Twin Classic',
    rate: 180,
    cleanliness: ROOM_STATUS.READY,
    occupancy: OCCUPANCY_STATUS.VACANT,
    currentReservationId: null,
    guestName: null,
    features: ['Dual Twin Beds', 'Quiet Wing'],
    keyCardSystem: 'RFID-308'
  },
  {
    roomNumber: '412',
    floor: 4,
    type: 'Deluxe King',
    rate: 235,
    cleanliness: ROOM_STATUS.READY,
    occupancy: OCCUPANCY_STATUS.OCCUPIED,
    currentReservationId: 'RES-8041',
    guestName: 'Sophia Chen',
    features: ['High Floor View', 'Nespresso Bar', 'Quiet Wing'],
    keyCardSystem: 'RFID-412'
  },
  {
    roomNumber: '501',
    floor: 5,
    type: 'Executive Suite',
    rate: 340,
    cleanliness: ROOM_STATUS.MAINTENANCE,
    occupancy: OCCUPANCY_STATUS.VACANT,
    currentReservationId: null,
    guestName: null,
    features: ['Corner Suite', 'Separate Living Area', 'Balcony'],
    keyCardSystem: 'RFID-501',
    maintenanceNote: 'Bathroom plumbing leak under repair by Maintenance department.'
  },
  {
    roomNumber: '506',
    floor: 5,
    type: 'Executive Suite',
    rate: 340,
    cleanliness: ROOM_STATUS.READY,
    occupancy: OCCUPANCY_STATUS.VACANT,
    currentReservationId: null,
    guestName: null,
    features: ['Corner Suite', 'Panoramic View', 'High-Speed Wi-Fi'],
    keyCardSystem: 'RFID-506'
  },
  {
    roomNumber: '712',
    floor: 7,
    type: 'Executive Suite',
    rate: 360,
    cleanliness: ROOM_STATUS.READY,
    occupancy: OCCUPANCY_STATUS.OCCUPIED,
    currentReservationId: 'RES-8043',
    guestName: 'Arthur Pendelton',
    features: ['Executive Floor', 'Ocean View', 'Complimentary Minibar'],
    keyCardSystem: 'RFID-712'
  },
  {
    roomNumber: '804',
    floor: 8,
    type: 'Deluxe King',
    rate: 245,
    cleanliness: ROOM_STATUS.CLEANING,
    occupancy: OCCUPANCY_STATUS.VACANT,
    currentReservationId: null,
    guestName: null,
    features: ['Ocean Front', 'Rain Shower'],
    keyCardSystem: 'RFID-804'
  },
  {
    roomNumber: '902',
    floor: 9,
    type: 'Twin Classic',
    rate: 195,
    cleanliness: ROOM_STATUS.READY,
    occupancy: OCCUPANCY_STATUS.OCCUPIED,
    currentReservationId: 'RES-8047',
    guestName: 'Claire Beauchamp',
    features: ['Quiet Wing', 'Dual Workstations'],
    keyCardSystem: 'RFID-902'
  },
  {
    roomNumber: '1102',
    floor: 11,
    type: 'Deluxe King',
    rate: 260,
    cleanliness: ROOM_STATUS.READY,
    occupancy: OCCUPANCY_STATUS.VACANT,
    currentReservationId: null,
    guestName: null,
    features: ['High Floor', 'Skyline View', 'Smart Lighting'],
    keyCardSystem: 'RFID-1102'
  },
  {
    roomNumber: '1204',
    floor: 12,
    type: 'Executive Suite',
    rate: 390,
    cleanliness: ROOM_STATUS.READY,
    occupancy: OCCUPANCY_STATUS.OCCUPIED,
    currentReservationId: 'RES-8042',
    guestName: 'David Vance',
    features: ['Titanium VIP Wing', 'Panoramic Harbor View', 'Butler Call'],
    keyCardSystem: 'RFID-1204'
  },
  {
    roomNumber: '1401',
    floor: 14,
    type: 'Executive Suite',
    rate: 420,
    cleanliness: ROOM_STATUS.READY,
    occupancy: OCCUPANCY_STATUS.VACANT,
    currentReservationId: null,
    guestName: null,
    features: ['Penthouse Floor', 'Harbor View', 'Soaking Jacuzzi'],
    keyCardSystem: 'RFID-1401'
  },
  {
    roomNumber: '1502',
    floor: 15,
    type: 'Presidential Suite',
    rate: 850,
    cleanliness: ROOM_STATUS.READY,
    occupancy: OCCUPANCY_STATUS.VACANT,
    currentReservationId: null,
    guestName: null,
    features: ['Full Penthouse', 'Private Terrace', 'Chef Kitchen', 'Dining for 8'],
    keyCardSystem: 'RFID-1502'
  }
];

// Realistic Reservations spanning Today's Arrivals, Departures, In-House, Upcoming
export const INITIAL_RESERVATIONS = [
  {
    id: 'RES-8041',
    reference: 'SO-8041',
    guestName: 'Sophia Chen',
    email: 'sophia.chen@novatech.io',
    phone: '+1 (555) 234-8901',
    vipStatus: 'Gold VIP',
    arrivalDate: daysAgo(1),
    departureDate: todayDate, // Departure today
    nights: 2,
    adults: 1,
    children: 0,
    roomType: 'Deluxe King',
    assignedRoom: '412',
    status: RESERVATION_STATUS.CHECKED_IN,
    identityVerified: true,
    idDocument: {
      type: 'Passport',
      number: 'US-98421034',
      issuingCountry: 'USA',
      verifiedAt: daysAgo(1),
      verifiedBy: 'EMP-401 (David Martinez)'
    },
    specialRequests: 'High floor, feather pillows, late departure at 12:30 PM.',
    estimatedArrivalTime: '14:00',
    checkInTimestamp: daysAgo(1) + 'T14:15:00.000Z',
    checkInActor: 'EMP-401 (David Martinez)',
    checkOutTimestamp: null,
    checkOutActor: null,
    folioBalance: 0.00, // Settled
    paymentMethod: {
      brand: 'Visa',
      last4: '4812',
      holder: 'Sophia Chen',
      exp: '09/28'
    },
    registrationSigned: true,
    keyCardsIssued: 2,
    notes: 'Gold member; early check-in granted yesterday without fee.',
    auditLog: [
      {
        timestamp: daysAgo(5),
        actor: 'Online Booking Engine',
        event: 'Reservation Created',
        details: 'Confirmed 2 nights in Deluxe King.'
      },
      {
        timestamp: daysAgo(1) + 'T14:15:00.000Z',
        actor: 'David Martinez (Front Desk)',
        event: 'Guest Checked In',
        details: 'Passport verified. Key cards issued for Room 412.'
      }
    ]
  },
  {
    id: 'RES-8042',
    reference: 'SO-8042',
    guestName: 'David Vance',
    email: 'd.vance@capitalgrowth.com',
    phone: '+1 (555) 345-6789',
    vipStatus: 'Titanium VIP',
    arrivalDate: daysAgo(2),
    departureDate: daysFromNow(2),
    nights: 4,
    adults: 2,
    children: 0,
    roomType: 'Executive Suite',
    assignedRoom: '1204',
    status: RESERVATION_STATUS.CHECKED_IN,
    identityVerified: true,
    idDocument: {
      type: 'Driving License',
      number: 'DL-CA-402910',
      issuingCountry: 'USA',
      verifiedAt: daysAgo(2),
      verifiedBy: 'EMP-401 (David Martinez)'
    },
    specialRequests: 'Hypoallergenic linens, extra duvet, fruit basket on arrival.',
    estimatedArrivalTime: '15:30',
    checkInTimestamp: daysAgo(2) + 'T15:40:00.000Z',
    checkInActor: 'EMP-401 (David Martinez)',
    checkOutTimestamp: null,
    checkOutActor: null,
    folioBalance: 420.00,
    paymentMethod: {
      brand: 'Amex',
      last4: '1004',
      holder: 'David Vance',
      exp: '11/27'
    },
    registrationSigned: true,
    keyCardsIssued: 2,
    notes: 'Subject of complaint CMP-801 regarding hypoallergenic bedding delay.',
    auditLog: [
      {
        timestamp: daysAgo(10),
        actor: 'VIP Reservations Desk',
        event: 'Reservation Created',
        details: 'Booked Executive Suite 1204.'
      },
      {
        timestamp: daysAgo(2) + 'T15:40:00.000Z',
        actor: 'David Martinez (Front Desk)',
        event: 'Guest Checked In',
        details: 'Checked in to Room 1204.'
      }
    ]
  },
  {
    id: 'RES-8043',
    reference: 'SO-8043',
    guestName: 'Arthur Pendelton',
    email: 'pendelton.a@meridian-law.co.uk',
    phone: '+44 20 7946 0912',
    vipStatus: 'Regular',
    arrivalDate: daysAgo(1),
    departureDate: daysFromNow(1),
    nights: 2,
    adults: 1,
    children: 0,
    roomType: 'Executive Suite',
    assignedRoom: '712',
    status: RESERVATION_STATUS.CHECKED_IN,
    identityVerified: true,
    idDocument: {
      type: 'Passport',
      number: 'UK-7892143',
      issuingCountry: 'United Kingdom',
      verifiedAt: daysAgo(1),
      verifiedBy: 'EMP-401 (David Martinez)'
    },
    specialRequests: 'Quiet room away from elevator, extra power adapters.',
    estimatedArrivalTime: '17:00',
    checkInTimestamp: daysAgo(1) + 'T17:20:00.000Z',
    checkInActor: 'EMP-401 (David Martinez)',
    checkOutTimestamp: null,
    checkOutActor: null,
    folioBalance: 145.00,
    paymentMethod: {
      brand: 'Mastercard',
      last4: '7721',
      holder: 'Arthur Pendelton',
      exp: '03/29'
    },
    registrationSigned: true,
    keyCardsIssued: 1,
    notes: 'Linked to task TSK-1042 for hypoallergenic bedding & pillows.',
    auditLog: [
      {
        timestamp: daysAgo(3),
        actor: 'Online Agency GDS',
        event: 'Reservation Created',
        details: 'Booked Executive Suite 712.'
      }
    ]
  },
  {
    id: 'RES-8044',
    reference: 'SO-8044',
    guestName: 'Amanda Miller',
    email: 'amanda.miller@globalreach.org',
    phone: '+1 (555) 456-7890',
    vipStatus: 'Silver VIP',
    arrivalDate: todayDate, // Arrival today!
    departureDate: daysFromNow(3),
    nights: 3,
    adults: 2,
    children: 1,
    roomType: 'Deluxe King',
    assignedRoom: '204', // Ready and Clean
    status: RESERVATION_STATUS.CONFIRMED,
    identityVerified: false,
    idDocument: null,
    specialRequests: 'Crib requested for infant, ground floor or close to elevator.',
    estimatedArrivalTime: '14:00',
    checkInTimestamp: null,
    checkInActor: null,
    checkOutTimestamp: null,
    checkOutActor: null,
    folioBalance: 0.00,
    paymentMethod: {
      brand: 'Visa',
      last4: '9012',
      holder: 'Amanda Miller',
      exp: '05/27'
    },
    registrationSigned: false,
    keyCardsIssued: 0,
    notes: 'Silver VIP member. Room 204 pre-assigned and clean.',
    auditLog: [
      {
        timestamp: daysAgo(4),
        actor: 'Online Direct Portal',
        event: 'Reservation Confirmed',
        details: 'Deluxe King confirmed for 3 nights.'
      }
    ]
  },
  {
    id: 'RES-8045',
    reference: 'SO-8045',
    guestName: 'Robert Sterling',
    email: 'robert.sterling@sterling-partners.com',
    phone: '+1 (555) 678-1234',
    vipStatus: 'Titanium VIP',
    arrivalDate: todayDate, // Arrival today!
    departureDate: daysFromNow(2),
    nights: 2,
    adults: 1,
    children: 0,
    roomType: 'Standard Queen',
    assignedRoom: '104', // Note: Room 104 is currently DIRTY to test room clearance guard!
    status: RESERVATION_STATUS.CONFIRMED,
    identityVerified: false,
    idDocument: null,
    specialRequests: 'Express check-in, newspaper delivered daily.',
    estimatedArrivalTime: '15:00',
    checkInTimestamp: null,
    checkInActor: null,
    checkOutTimestamp: null,
    checkOutActor: null,
    folioBalance: 0.00,
    paymentMethod: {
      brand: 'Amex',
      last4: '3009',
      holder: 'Robert Sterling',
      exp: '08/26'
    },
    registrationSigned: false,
    keyCardsIssued: 0,
    notes: 'Pre-assigned Room 104 requires housekeeping turnover clearance before check-in!',
    auditLog: [
      {
        timestamp: daysAgo(2),
        actor: 'Executive Desk',
        event: 'Reservation Confirmed',
        details: 'Standard Queen reserved for 2 nights.'
      }
    ]
  },
  {
    id: 'RES-8046',
    reference: 'SO-8046',
    guestName: 'Liam Johnson',
    email: 'liam.j@techfounders.io',
    phone: '+1 (555) 789-0123',
    vipStatus: 'Regular',
    arrivalDate: todayDate, // Arrival today!
    departureDate: daysFromNow(1),
    nights: 1,
    adults: 2,
    children: 0,
    roomType: 'Standard Queen',
    assignedRoom: '101', // Ready and Clean
    status: RESERVATION_STATUS.CONFIRMED,
    identityVerified: false,
    idDocument: null,
    specialRequests: 'Late arrival expected at 21:00.',
    estimatedArrivalTime: '21:00',
    checkInTimestamp: null,
    checkInActor: null,
    checkOutTimestamp: null,
    checkOutActor: null,
    folioBalance: 0.00,
    paymentMethod: {
      brand: 'Mastercard',
      last4: '5543',
      holder: 'Liam Johnson',
      exp: '01/28'
    },
    registrationSigned: false,
    keyCardsIssued: 0,
    notes: 'Flight arriving late at 20:15.',
    auditLog: [
      {
        timestamp: daysAgo(1),
        actor: 'Online Portal',
        event: 'Reservation Created',
        details: '1 night stay confirmed.'
      }
    ]
  },
  {
    id: 'RES-8047',
    reference: 'SO-8047',
    guestName: 'Claire Beauchamp',
    email: 'c.beauchamp@inverness-heritage.org',
    phone: '+44 141 496 0122',
    vipStatus: 'Silver VIP',
    arrivalDate: daysAgo(3),
    departureDate: todayDate, // Departure today
    nights: 3,
    adults: 2,
    children: 0,
    roomType: 'Twin Classic',
    assignedRoom: '902',
    status: RESERVATION_STATUS.CHECKED_IN,
    identityVerified: true,
    idDocument: {
      type: 'Passport',
      number: 'UK-6549812',
      issuingCountry: 'United Kingdom',
      verifiedAt: daysAgo(3),
      verifiedBy: 'EMP-401 (David Martinez)'
    },
    specialRequests: 'Twin beds, quiet corner.',
    estimatedArrivalTime: '16:00',
    checkInTimestamp: daysAgo(3) + 'T16:10:00.000Z',
    checkInActor: 'EMP-401 (David Martinez)',
    checkOutTimestamp: null,
    checkOutActor: null,
    folioBalance: 88.50, // Outstanding mini-bar & breakfast charges
    paymentMethod: {
      brand: 'Visa',
      last4: '1102',
      holder: 'Claire Beauchamp',
      exp: '10/27'
    },
    registrationSigned: true,
    keyCardsIssued: 2,
    notes: 'Outstanding breakfast bill pending settlement at check-out.',
    auditLog: [
      {
        timestamp: daysAgo(3) + 'T16:10:00.000Z',
        actor: 'David Martinez (Front Desk)',
        event: 'Guest Checked In',
        details: 'Assigned Room 902.'
      }
    ]
  },
  {
    id: 'RES-8048',
    reference: 'SO-8048',
    guestName: 'Evelyn Reed',
    email: 'evelyn.reed@reedarch.com',
    phone: '+1 (555) 890-1234',
    vipStatus: 'Gold VIP',
    arrivalDate: daysFromNow(1),
    departureDate: daysFromNow(4),
    nights: 3,
    adults: 1,
    children: 0,
    roomType: 'Executive Suite',
    assignedRoom: '506',
    status: RESERVATION_STATUS.CONFIRMED,
    identityVerified: false,
    idDocument: null,
    specialRequests: 'High floor, early arrival around 11:00 AM.',
    estimatedArrivalTime: '11:00',
    checkInTimestamp: null,
    checkInActor: null,
    checkOutTimestamp: null,
    checkOutActor: null,
    folioBalance: 0.00,
    paymentMethod: {
      brand: 'Visa',
      last4: '8834',
      holder: 'Evelyn Reed',
      exp: '04/28'
    },
    registrationSigned: false,
    keyCardsIssued: 0,
    notes: 'Gold VIP; complimentary early check-in if room ready.',
    auditLog: []
  },
  {
    id: 'RES-8049',
    reference: 'SO-8049',
    guestName: 'Marcus Bennett',
    email: 'm.bennett@apexventures.com',
    phone: '+1 (555) 901-2345',
    vipStatus: 'Regular',
    arrivalDate: daysAgo(4),
    departureDate: daysAgo(1),
    nights: 3,
    adults: 1,
    children: 0,
    roomType: 'Deluxe King',
    assignedRoom: '304',
    status: RESERVATION_STATUS.CHECKED_OUT,
    identityVerified: true,
    idDocument: {
      type: 'Driving License',
      number: 'DL-NY-89104',
      issuingCountry: 'USA',
      verifiedAt: daysAgo(4),
      verifiedBy: 'EMP-401 (David Martinez)'
    },
    specialRequests: 'None',
    estimatedArrivalTime: '15:00',
    checkInTimestamp: daysAgo(4) + 'T15:05:00.000Z',
    checkInActor: 'EMP-401 (David Martinez)',
    checkOutTimestamp: daysAgo(1) + 'T10:45:00.000Z',
    checkOutActor: 'EMP-401 (David Martinez)',
    folioBalance: 0.00,
    paymentMethod: {
      brand: 'Mastercard',
      last4: '4491',
      holder: 'Marcus Bennett',
      exp: '07/26'
    },
    registrationSigned: true,
    keyCardsIssued: 1,
    notes: 'Stay completed satisfactorily.',
    auditLog: [
      {
        timestamp: daysAgo(1) + 'T10:45:00.000Z',
        actor: 'David Martinez (Front Desk)',
        event: 'Guest Checked Out',
        details: 'Folio settled in full ($660.00). Room 304 turnover requested.'
      }
    ]
  }
];

// Room Moves history & active workflow
export const INITIAL_ROOM_MOVES = [
  {
    id: 'RMV-201',
    reservationId: 'RES-8042',
    guestName: 'David Vance',
    vipStatus: 'Titanium VIP',
    fromRoom: '1204',
    toRoom: '1401',
    fromRoomType: 'Executive Suite',
    toRoomType: 'Executive Suite',
    reasonCategory: 'AC Malfunction / Noise',
    reasonDetails: 'Severe rattling in AC compressor on 12th floor; room temperature stuck at 78F.',
    status: ROOM_MOVE_STATUS.REQUESTED,
    initiatedBy: {
      id: 'EMP-401',
      name: 'David Martinez',
      role: 'Front Desk Coordinator'
    },
    approvedBy: {
      id: 'EMP-102',
      name: 'Elena Rostova',
      role: 'Department Manager'
    },
    destinationRoomClean: true,
    guestNotified: true,
    createdAt: minutesAgo(40),
    completedAt: null,
    notes: 'Manager approved courtesy room move to high-floor Suite 1401. Bell porter needed for luggage transfer.',
    auditLog: [
      {
        timestamp: minutesAgo(40),
        actor: 'David Martinez (Front Desk)',
        event: 'Room Move Requested',
        details: 'Requested move from Suite 1204 to 1401 due to AC compressor failure.'
      },
      {
        timestamp: minutesAgo(25),
        actor: 'Elena Rostova (Manager)',
        event: 'Room Move Approved',
        details: 'Approved complimentary transfer to Suite 1401.'
      }
    ]
  },
  {
    id: 'RMV-198',
    reservationId: 'RES-8049',
    guestName: 'Marcus Bennett',
    vipStatus: 'Regular',
    fromRoom: '204',
    toRoom: '304',
    fromRoomType: 'Deluxe King',
    toRoomType: 'Deluxe King',
    reasonCategory: 'Street Noise Complaint',
    reasonDetails: 'Late night bar noise on 2nd floor street-facing wing.',
    status: ROOM_MOVE_STATUS.COMPLETED,
    initiatedBy: {
      id: 'EMP-401',
      name: 'David Martinez',
      role: 'Front Desk Coordinator'
    },
    approvedBy: {
      id: 'EMP-201',
      name: 'Sarah Jenkins',
      role: 'Department Supervisor'
    },
    destinationRoomClean: true,
    guestNotified: true,
    createdAt: daysAgo(3),
    completedAt: daysAgo(3),
    notes: 'Luggage moved by Jamal Ortiz. Old room 204 successfully inspected and cleaned.',
    auditLog: [
      {
        timestamp: daysAgo(3),
        actor: 'David Martinez (Front Desk)',
        event: 'Room Move Completed',
        details: 'Transferred guest to quiet wing Room 304.'
      }
    ]
  }
];

// Wake-up Calls Scheduler
export const INITIAL_WAKE_UP_CALLS = [
  {
    id: 'WUC-101',
    reservationId: 'RES-8041',
    guestName: 'Sophia Chen',
    roomNumber: '412',
    scheduledDate: todayDate,
    scheduledTime: '06:30',
    status: WAKE_UP_STATUS.COMPLETED,
    specialInstructions: 'Guest has morning keynote presentation at 08:30. Ensure brisk greeting.',
    attempts: [
      {
        timestamp: hoursAgo(2),
        status: 'Answered',
        operator: 'EMP-401 (David Martinez)',
        note: 'Guest answered on first ring. Wished her a productive day.'
      }
    ],
    createdAt: daysAgo(1),
    createdBy: 'EMP-401 (David Martinez)'
  },
  {
    id: 'WUC-102',
    reservationId: 'RES-8042',
    guestName: 'David Vance',
    roomNumber: '1204',
    scheduledDate: todayDate,
    scheduledTime: '07:15',
    status: WAKE_UP_STATUS.COMPLETED,
    specialInstructions: 'Confirm airport car service pickup scheduled for 09:00.',
    attempts: [
      {
        timestamp: hoursAgo(1),
        status: 'Answered',
        operator: 'EMP-401 (David Martinez)',
        note: 'Confirmed car service driver ETA with guest.'
      }
    ],
    createdAt: daysAgo(1),
    createdBy: 'EMP-401 (David Martinez)'
  },
  {
    id: 'WUC-103',
    reservationId: 'RES-8043',
    guestName: 'Arthur Pendelton',
    roomNumber: '712',
    scheduledDate: todayDate,
    scheduledTime: '17:00',
    status: WAKE_UP_STATUS.SCHEDULED,
    specialInstructions: 'Call back in 5 minutes if unanswered. Court conference call at 17:30.',
    attempts: [],
    createdAt: hoursAgo(3),
    createdBy: 'EMP-401 (David Martinez)'
  },
  {
    id: 'WUC-104',
    reservationId: 'RES-8047',
    guestName: 'Claire Beauchamp',
    roomNumber: '902',
    scheduledDate: daysFromNow(1),
    scheduledTime: '06:00',
    status: WAKE_UP_STATUS.SCHEDULED,
    specialInstructions: 'High-speed rail connection departing central station at 07:15.',
    attempts: [],
    createdAt: hoursAgo(2),
    createdBy: 'EMP-401 (David Martinez)'
  }
];

// Guest Communications Multi-Channel Log
export const INITIAL_GUEST_COMMUNICATIONS = [
  {
    id: 'GCOM-301',
    reservationId: 'RES-8041',
    guestName: 'Sophia Chen',
    roomNumber: '412',
    channel: 'SMS',
    direction: 'Outbound',
    category: 'Wake-Up Reminder',
    message: 'Good morning Ms. Chen! This is your 06:30 AM wake-up reminder from StayOps Front Desk. Have an excellent day!',
    timestamp: hoursAgo(2),
    status: 'Delivered (Simulated Gateway)',
    actor: 'David Martinez (Front Desk)',
    linkedRequestId: null,
    linkedComplaintId: null
  },
  {
    id: 'GCOM-302',
    reservationId: 'RES-8042',
    guestName: 'David Vance',
    roomNumber: '1204',
    channel: 'In-App Concierge',
    direction: 'Outbound',
    category: 'Complaint Apology & Recovery',
    message: 'Dear Mr. Vance, we sincerely apologize for the AC rattling issue. Department Manager Elena Rostova has approved your complimentary transfer to Suite 1401 with a $75 dining credit.',
    timestamp: minutesAgo(20),
    status: 'Read (Simulated Gateway)',
    actor: 'David Martinez (Front Desk)',
    linkedRequestId: 'TSK-1042',
    linkedComplaintId: 'CMP-801'
  },
  {
    id: 'GCOM-303',
    reservationId: 'RES-8044',
    guestName: 'Amanda Miller',
    roomNumber: '204',
    channel: 'WhatsApp',
    direction: 'Outbound',
    category: 'Room Ready Notification',
    message: 'Hello Ms. Miller! Your Deluxe King Room 204 with requested infant crib is clean, inspected, and ready for your arrival. We look forward to welcoming you.',
    timestamp: hoursAgo(1),
    status: 'Delivered (Simulated Gateway)',
    actor: 'David Martinez (Front Desk)',
    linkedRequestId: null,
    linkedComplaintId: null
  },
  {
    id: 'GCOM-304',
    reservationId: 'RES-8047',
    guestName: 'Claire Beauchamp',
    roomNumber: '902',
    channel: 'Phone Call Log',
    direction: 'Inbound',
    category: 'General Inquiry',
    message: 'Guest phoned desk inquiring whether baggage storage is available after 11:00 AM check-out. Confirmed bell captain will hold luggage securely.',
    timestamp: minutesAgo(50),
    status: 'Logged',
    actor: 'David Martinez (Front Desk)',
    linkedRequestId: null,
    linkedComplaintId: null
  }
];

// Itemized Folios & Payments
export const INITIAL_FOLIOS = [
  {
    folioId: 'FOL-8041',
    reservationId: 'RES-8041',
    guestName: 'Sophia Chen',
    roomNumber: '412',
    status: 'Settled',
    charges: [
      { id: 'CHG-101', date: daysAgo(1), category: 'Room Rate', description: 'Deluxe King - Night 1', amount: 235.00 },
      { id: 'CHG-102', date: daysAgo(1), category: 'Tax & City Fee', description: 'Occupancy Tax (14%)', amount: 32.90 },
      { id: 'CHG-103', date: daysAgo(1), category: 'Room Service', description: 'Executive Dinner Order #812', amount: 48.00 },
      { id: 'CHG-104', date: daysAgo(1), category: 'Tax & Service', description: 'Food & Beverage Surcharge', amount: 6.72 }
    ],
    payments: [
      {
        id: 'PAY-201',
        date: daysAgo(1),
        method: 'Visa ending 4812',
        authCode: 'AUTH-89210',
        amount: 322.62,
        status: 'Settled',
        recordedBy: 'EMP-401 (David Martinez)'
      }
    ],
    refunds: [],
    balance: 0.00
  },
  {
    folioId: 'FOL-8042',
    reservationId: 'RES-8042',
    guestName: 'David Vance',
    roomNumber: '1204',
    status: 'Open',
    charges: [
      { id: 'CHG-201', date: daysAgo(2), category: 'Room Rate', description: 'Executive Suite - Night 1', amount: 390.00 },
      { id: 'CHG-202', date: daysAgo(1), category: 'Room Rate', description: 'Executive Suite - Night 2', amount: 390.00 },
      { id: 'CHG-203', date: daysAgo(1), category: 'Tax & City Fee', description: 'Occupancy Tax (14%)', amount: 109.20 },
      { id: 'CHG-204', date: daysAgo(1), category: 'Minibar', description: 'Sparkling Water & Macadamias', amount: 32.00 }
    ],
    payments: [
      {
        id: 'PAY-301',
        date: daysAgo(2),
        method: 'Amex ending 1004',
        authCode: 'AUTH-19042',
        amount: 501.20,
        status: 'Settled',
        recordedBy: 'EMP-401 (David Martinez)'
      }
    ],
    refunds: [],
    balance: 420.00
  },
  {
    folioId: 'FOL-8047',
    reservationId: 'RES-8047',
    guestName: 'Claire Beauchamp',
    roomNumber: '902',
    status: 'Pending Settlement',
    charges: [
      { id: 'CHG-301', date: daysAgo(3), category: 'Room Rate', description: 'Twin Classic - 3 Nights Prepaid', amount: 540.00 },
      { id: 'CHG-302', date: daysAgo(1), category: 'Breakfast Buffet', description: 'Veranda Breakfast x2', amount: 56.00 },
      { id: 'CHG-303', date: todayDate, category: 'Room Service', description: 'Late Night Coffee & Pastries', amount: 32.50 }
    ],
    payments: [
      {
        id: 'PAY-401',
        date: daysAgo(3),
        method: 'Visa ending 1102 (Advance)',
        authCode: 'AUTH-67210',
        amount: 540.00,
        status: 'Settled',
        recordedBy: 'Online Agency GDS'
      }
    ],
    refunds: [],
    balance: 88.50
  }
];

export const INITIAL_FRONTDESK_NOTIFICATIONS = [
  {
    id: 'FNOT-101',
    type: 'arrival',
    title: 'Arrival Alert: Amanda Miller (Silver VIP)',
    message: 'Estimated arrival 14:00. Room 204 is clean and infant crib is placed.',
    timestamp: hoursAgo(1),
    read: false,
    priority: 'high',
    actionRoute: '/frontdesk/check-in'
  },
  {
    id: 'FNOT-102',
    type: 'departure',
    title: 'Departure Pending: Claire Beauchamp (Room 902)',
    message: 'Folio balance of $88.50 pending settlement. Expected departure 11:00 AM.',
    timestamp: hoursAgo(2),
    read: false,
    priority: 'medium',
    actionRoute: '/frontdesk/check-out'
  },
  {
    id: 'FNOT-103',
    type: 'room_move',
    title: 'Manager Approved Room Move: David Vance',
    message: 'Move from Suite 1204 to Suite 1401 approved by Elena Rostova. Assign bell porter.',
    timestamp: minutesAgo(25),
    read: false,
    priority: 'urgent',
    actionRoute: '/frontdesk/room-moves'
  },
  {
    id: 'FNOT-104',
    type: 'request',
    title: 'New Guest Request: Hypoallergenic Bedding',
    message: 'Request TSK-1042 for Suite 712 dispatched to Housekeeping runner Marcus Alvarez.',
    timestamp: hoursAgo(1),
    read: true,
    priority: 'urgent',
    actionRoute: '/frontdesk/requests'
  }
];
