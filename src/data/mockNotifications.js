export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-1',
    taskId: 'TSK-1035',
    type: 'overdue',
    title: 'Task Overdue SLA Alert',
    message: 'TSK-1035 (Luggage Transfer to Presidential Suite) is 25 minutes overdue. Lift inspection reported.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'urgent',
    category: 'Escalation'
  },
  {
    id: 'NOTIF-2',
    taskId: 'TSK-1042',
    type: 'deadline',
    title: 'Urgent Task Due in 20m',
    message: 'TSK-1042 (Hypoallergenic Bedding - Executive Suite 712) deadline is approaching at 08:00 AM.',
    timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'high',
    category: 'Deadline'
  },
  {
    id: 'NOTIF-3',
    taskId: 'TSK-1055',
    type: 'unassigned',
    title: 'New High-Priority Unassigned Task',
    message: 'Guest room AC ticket TSK-1055 created for Deluxe King 418 requires technician assignment.',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'high',
    category: 'Assignment'
  },
  {
    id: 'NOTIF-4',
    taskId: 'TSK-1031',
    type: 'blocked',
    title: 'Task Blocked — Privacy DND Active',
    message: 'Elena Ramos reported TSK-1031 blocked: Guest in Ocean View 305 has DND sign on.',
    timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'medium',
    category: 'Workflow'
  },
  {
    id: 'NOTIF-5',
    taskId: 'TSK-1035',
    type: 'escalation_response',
    title: 'Supervisor Acknowledged Escalation',
    message: 'Supervisor Sarah Jenkins acknowledged TSK-1035 escalation: "Engineering notified to expedite lift 2."',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'medium',
    category: 'Escalation'
  },
  {
    id: 'NOTIF-6',
    taskId: null,
    staffId: 'EMP-460',
    type: 'staff_availability',
    title: 'Staff Availability Changed',
    message: 'Sophia Taylor (Housekeeping) has gone On Break (returns in 30 mins).',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'low',
    category: 'Staff'
  }
];
