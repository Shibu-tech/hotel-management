/**
 * Centralized Task Status & Workflow Definitions
 * Manages all permitted transitions, status badges, priority styling, and SLA calculations
 */

export const TASK_STATUS = {
  NEW: 'New',
  IN_PROGRESS: 'In Progress',
  ON_THE_WAY: 'On the Way',
  BLOCKED: 'Blocked',
  COMPLETED: 'Completed'
};

export const TASK_PRIORITY = {
  URGENT: 'urgent',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

export const TASK_CATEGORY = {
  HOUSEKEEPING: 'Housekeeping',
  ROOM_SERVICE: 'Room Service',
  LUGGAGE_BELL: 'Luggage & Bell',
  MAINTENANCE: 'Maintenance',
  AMENITIES: 'Amenities'
};

export const DELAY_REASONS = [
  'Room inaccessible / DND active',
  'Required item / linen stockout',
  'Guest requested revised service time',
  'Staff dispatched to urgent VIP/emergency',
  'Equipment malfunction / technical failure',
  'Service area occupied / cleaning in progress',
  'Other operational delay'
];

export const ESCALATION_LEVELS = [
  { id: 'supervisor', label: 'Department Supervisor (Sarah Jenkins)', role: 'Supervisor', sla: '15 min response' },
  { id: 'manager', label: 'Department Operations Manager (Elena Rostova)', role: 'Operations Manager', sla: '30 min response' },
  { id: 'duty_hotel_manager', label: 'Hotel Duty Manager (On-Call 24/7)', role: 'Hotel Duty Manager', sla: '10 min response' },
  { id: 'emergency_security', label: 'Security & Safety Dispatch (Immediate)', role: 'Emergency Security', sla: 'Immediate (Safety incident)' }
];

/**
 * Returns badge styling for task statuses
 */
export function getStatusStyle(status) {
  switch (status) {
    case TASK_STATUS.NEW:
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
        label: 'New'
      };
    case TASK_STATUS.IN_PROGRESS:
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        label: 'In Progress'
      };
    case TASK_STATUS.ON_THE_WAY:
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        dot: 'bg-purple-500',
        label: 'On the Way'
      };
    case TASK_STATUS.BLOCKED:
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-500',
        label: 'Blocked'
      };
    case TASK_STATUS.COMPLETED:
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Completed'
      };
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
        label: status || 'Unknown'
      };
  }
}

/**
 * Returns priority badge styles
 */
export function getPriorityStyle(priority = 'medium') {
  const p = priority.toLowerCase();
  switch (p) {
    case 'urgent':
      return {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200',
        label: 'Urgent',
        iconColor: 'text-red-600'
      };
    case 'high':
      return {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-200',
        label: 'High',
        iconColor: 'text-orange-600'
      };
    case 'medium':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
        label: 'Medium',
        iconColor: 'text-blue-600'
      };
    case 'low':
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-200',
        label: 'Low',
        iconColor: 'text-slate-500'
      };
    default:
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-200',
        label: priority,
        iconColor: 'text-slate-500'
      };
  }
}

/**
 * Checks if a task is overdue
 */
export function isOverdue(dueAt, status) {
  if (!dueAt || status === TASK_STATUS.COMPLETED) return false;
  return new Date(dueAt).getTime() < Date.now();
}

/**
 * Checks if a task is due soon (within 60 minutes)
 */
export function isDueSoon(dueAt, status) {
  if (!dueAt || status === TASK_STATUS.COMPLETED) return false;
  const diffMinutes = (new Date(dueAt).getTime() - Date.now()) / (1000 * 60);
  return diffMinutes > 0 && diffMinutes <= 60;
}

/**
 * Formats a relative deadline label e.g. "Overdue by 15m" or "Due in 25m"
 */
export function formatTimeRemaining(dueAt, status) {
  if (!dueAt) return 'No due time';
  if (status === TASK_STATUS.COMPLETED) return 'Completed';

  const diffMs = new Date(dueAt).getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / (1000 * 60));

  if (diffMinutes < 0) {
    const overdueMins = Math.abs(diffMinutes);
    if (overdueMins >= 60) {
      const hours = Math.floor(overdueMins / 60);
      return `Overdue by ${hours}h ${overdueMins % 60}m`;
    }
    return `Overdue by ${overdueMins}m`;
  }

  if (diffMinutes === 0) return 'Due now';

  if (diffMinutes >= 60) {
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return `Due in ${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  }

  return `Due in ${diffMinutes}m`;
}

/**
 * Formats a timestamp into human-readable date and time
 */
export function formatDateTime(isoString) {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
}

/**
 * Formats time only (e.g. 08:30 AM)
 */
export function formatTimeOnly(isoString) {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
}

/**
 * Inspection Status Constants for Department Supervisor
 */
export const INSPECTION_STATUS = {
  NOT_REQUIRED: 'not_required',
  PENDING: 'pending_inspection',
  PASSED: 'passed',
  REOPENED: 'reopened',
  CORRECTION_REQUESTED: 'correction_requested'
};

export function getInspectionStatusStyle(status) {
  switch (status) {
    case INSPECTION_STATUS.PENDING:
      return {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        border: 'border-amber-300',
        label: 'Awaiting Inspection',
        badge: 'Pending Review'
      };
    case INSPECTION_STATUS.PASSED:
      return {
        bg: 'bg-emerald-100',
        text: 'text-emerald-800',
        border: 'border-emerald-300',
        label: 'Inspection Passed',
        badge: 'Passed'
      };
    case INSPECTION_STATUS.REOPENED:
      return {
        bg: 'bg-rose-100',
        text: 'text-rose-800',
        border: 'border-rose-300',
        label: 'Reopened by Supervisor',
        badge: 'Reopened'
      };
    case INSPECTION_STATUS.CORRECTION_REQUESTED:
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-300',
        label: 'Correction Requested',
        badge: 'Correction Req.'
      };
    case INSPECTION_STATUS.NOT_REQUIRED:
    default:
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        border: 'border-slate-200',
        label: 'No Inspection Required',
        badge: 'N/A'
      };
  }
}

/**
 * Supported Blocker Categories
 */
export const BLOCKER_CATEGORIES = [
  'Room or area inaccessible',
  'Item or supply unavailable',
  'Equipment malfunction',
  'Safety restriction',
  'Guest concern',
  'Staffing or scheduling issue',
  'Other'
];

export const BLOCKER_STATUS = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  PENDING_CLEARANCE: 'Pending Safety Clearance',
  RESOLVED: 'Resolved'
};

export function getBlockerStatusStyle(status) {
  switch (status) {
    case BLOCKER_STATUS.PENDING_CLEARANCE:
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-300',
        label: 'Safety Clearance Required'
      };
    case BLOCKER_STATUS.OPEN:
      return {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        border: 'border-amber-300',
        label: 'Open Blocker'
      };
    case BLOCKER_STATUS.IN_PROGRESS:
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-300',
        label: 'In Progress'
      };
    case BLOCKER_STATUS.RESOLVED:
      return {
        bg: 'bg-emerald-100',
        text: 'text-emerald-800',
        border: 'border-emerald-300',
        label: 'Resolved'
      };
    default:
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-300',
        label: status || 'Unknown'
      };
  }
}

/**
 * Corrective Action Statuses
 */
export const CORRECTIVE_ACTION_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  ESCALATED: 'Escalated'
};

/**
 * Shift Handover Statuses
 */
export const HANDOVER_STATUS = {
  PENDING_ACK: 'Pending Acknowledgement',
  ACKNOWLEDGED: 'Acknowledged',
  COMPLETED: 'Completed'
};

/**
 * Supervisor Escalation Hierarchy
 */
export const SUPERVISOR_ESCALATION_LEVELS = [
  { id: 'supervisor', label: 'Department Supervisor (Sarah Jenkins)', role: 'Supervisor', sla: '15 min response' },
  { id: 'manager', label: 'Department Operations Manager (Elena Rostova)', role: 'Operations Manager', sla: '30 min response' },
  { id: 'duty_hotel_manager', label: 'Hotel Duty Manager (On-Call 24/7)', role: 'Duty Manager', sla: '10 min response' },
  { id: 'general_manager', label: 'General Manager (Marcus Sterling - Executive)', role: 'General Manager', sla: 'Immediate Executive Referral' },
  { id: 'emergency_security', label: 'Safety & Security Dispatch (Immediate Incident Protocol)', role: 'Safety / Security', sla: 'Immediate (Safety incident)' }
];

/**
 * Configurable Workload Thresholds (Demo Assumptions)
 */
export const DEFAULT_WORKLOAD_THRESHOLDS = {
  optimalMax: 2,   // 1-2 active tasks
  moderateMax: 3,  // 3 active tasks
  highMax: 4,      // 4 active tasks
  overloadedMin: 5 // 5+ active tasks or 2+ overdue
};

export function getWorkloadLevel(activeCount = 0, overdueCount = 0, thresholds = DEFAULT_WORKLOAD_THRESHOLDS) {
  if (activeCount >= thresholds.overloadedMin || overdueCount >= 2) {
    return {
      level: 'Overloaded',
      color: 'text-red-700',
      bg: 'bg-red-50',
      badgeBg: 'bg-red-100',
      border: 'border-red-300',
      warning: true,
      message: 'High risk of SLA breach. Immediate rebalancing advised.'
    };
  }
  if (activeCount >= thresholds.highMax) {
    return {
      level: 'High',
      color: 'text-orange-700',
      bg: 'bg-orange-50',
      badgeBg: 'bg-orange-100',
      border: 'border-orange-300',
      warning: true,
      message: 'Near capacity. Avoid assigning urgent tickets.'
    };
  }
  if (activeCount >= thresholds.moderateMax) {
    return {
      level: 'Moderate',
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      badgeBg: 'bg-blue-100',
      border: 'border-blue-300',
      warning: false,
      message: 'Balanced workload. Capacity available for standard tasks.'
    };
  }
  return {
    level: 'Optimal',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    badgeBg: 'bg-emerald-100',
    border: 'border-emerald-300',
    warning: false,
    message: 'Optimal bandwidth available.'
  };
}
