/**
 * Realistic Mock Staff Dataset for Hotel Department Operations
 * Tracks availability, shift, skill category eligibility, active tasks, and workload status
 */

export const INITIAL_STAFF = [
  {
    id: 'EMP-418',
    name: 'Marcus Alvarez',
    role: 'Attendant & Runner',
    department: 'Housekeeping',
    shift: 'Morning Shift (07:00 – 15:30)',
    availability: 'Available', // Available, Busy, On Break, Off Duty
    skills: ['Housekeeping', 'Amenities', 'Luggage & Bell'],
    phoneExt: 'x418',
    radio: 'CH-04',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    notes: 'Primary floor runner for floors 5–8.'
  },
  {
    id: 'EMP-422',
    name: 'Elena Ramos',
    role: 'Housekeeping Specialist',
    department: 'Housekeeping',
    shift: 'Morning Shift (07:00 – 15:30)',
    availability: 'Busy',
    skills: ['Housekeeping', 'Amenities'],
    phoneExt: 'x422',
    radio: 'CH-04',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    notes: 'Currently servicing VIP suites on 12th floor.'
  },
  {
    id: 'EMP-389',
    name: 'Jamal Ortiz',
    role: 'Bell & Luggage Porter',
    department: 'Luggage & Bell',
    shift: 'Morning Shift (06:30 – 15:00)',
    availability: 'Available',
    skills: ['Luggage & Bell', 'Amenities'],
    phoneExt: 'x389',
    radio: 'CH-02',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    notes: 'Handles lobby luggage dispatch and guest vehicle loading.'
  },
  {
    id: 'EMP-405',
    name: 'Priya Patel',
    role: 'Guest Service Runner',
    department: 'Amenities',
    shift: 'Day Shift (08:00 – 16:30)',
    availability: 'Available',
    skills: ['Amenities', 'Room Service', 'Housekeeping'],
    phoneExt: 'x405',
    radio: 'CH-04',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    notes: 'Fast response for VIP arrival amenities and special requests.'
  },
  {
    id: 'EMP-512',
    name: 'David Kim',
    role: 'Facility Maintenance Tech',
    department: 'Maintenance',
    shift: 'Day Operations (07:30 – 16:00)',
    availability: 'Busy',
    skills: ['Maintenance'],
    phoneExt: 'x512',
    radio: 'CH-06',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    notes: 'HVAC and plumbing certified. Currently addressing 4th floor AC ticket.'
  },
  {
    id: 'EMP-460',
    name: 'Sophia Taylor',
    role: 'Floor Attendant',
    department: 'Housekeeping',
    shift: 'Day Shift (08:00 – 16:30)',
    availability: 'On Break',
    skills: ['Housekeeping', 'Amenities'],
    phoneExt: 'x460',
    radio: 'CH-04',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    notes: 'Scheduled 30-minute break. Returns at 12:45.'
  },
  {
    id: 'EMP-431',
    name: 'Carlos Mendez',
    role: 'In-Room Dining Server',
    department: 'Room Service',
    shift: 'Morning Shift (06:00 – 14:30)',
    availability: 'Busy',
    skills: ['Room Service', 'Amenities'],
    phoneExt: 'x431',
    radio: 'CH-03',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    notes: 'Peak breakfast service runner for Tower A.'
  },
  {
    id: 'EMP-488',
    name: 'Lucas Vance',
    role: 'Luggage Porter',
    department: 'Luggage & Bell',
    shift: 'Evening Shift (15:00 – 23:30)',
    availability: 'Off Duty',
    skills: ['Luggage & Bell'],
    phoneExt: 'x488',
    radio: 'CH-02',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
    notes: 'Evening shift standby. Check-in starts 15:00.'
  }
];
