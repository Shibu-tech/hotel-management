import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_TASKS } from '../data/mockTasks';
import { INITIAL_STAFF } from '../data/mockStaff';
import { INITIAL_NOTIFICATIONS } from '../data/mockNotifications';
import {
  INITIAL_BLOCKERS,
  INITIAL_CORRECTIVE_ACTIONS,
  INITIAL_HANDOVERS,
  INITIAL_SUPERVISOR_NOTIFICATIONS
} from '../data/mockSupervisorData';
import {
  INITIAL_COMPLAINTS,
  INITIAL_RECOVERY_REQUESTS,
  INITIAL_STAFF_SCHEDULES,
  DEFAULT_SLA_CONFIG,
  INITIAL_MANAGER_NOTIFICATIONS,
  RECOVERY_STATUS,
  COMPLAINT_STATUS
} from '../data/mockManagerData';
import {
  INITIAL_ROOMS,
  INITIAL_RESERVATIONS,
  INITIAL_ROOM_MOVES,
  INITIAL_WAKE_UP_CALLS,
  INITIAL_GUEST_COMMUNICATIONS,
  INITIAL_FOLIOS,
  INITIAL_FRONTDESK_NOTIFICATIONS,
  ROOM_STATUS,
  OCCUPANCY_STATUS,
  RESERVATION_STATUS,
  ROOM_MOVE_STATUS,
  WAKE_UP_STATUS
} from '../data/mockFrontDeskData';
import {
  DISPATCHER_PROFILE,
  SUPERVISOR_PROFILE,
  MANAGER_PROFILE,
  MANAGER_ROLE_INFO,
  FRONTDESK_PROFILE,
  FRONTDESK_ROLE_INFO,
  FINANCE_PROFILE,
  FINANCE_ROLE_INFO,
  SECURITY_PROFILE,
  SECURITY_ROLE_INFO,
  FULFILLER_PROFILE,
  FULFILLER_ROLE_INFO,
  EXECUTIVE_PROFILE,
  EXECUTIVE_ROLE_INFO,
  ADMIN_PROFILE,
  ADMIN_ROLE_INFO,
  normalizeRole,
  ALL_ROLE_PROFILES
} from '../utils/permissions';
import {
  INITIAL_PLATFORM_USERS,
  INITIAL_INTEGRATIONS,
  INITIAL_SYSTEM_CONFIG,
  INITIAL_ADMIN_AUDIT_LOGS,
  INITIAL_BACKUPS
} from '../data/mockAdminData';
import {
  INITIAL_POLICY_REVIEWS,
  INITIAL_ACCESS_CERTIFICATIONS,
  INITIAL_COMPLIANCE_ACTIONS,
  INITIAL_EXECUTIVE_NOTIFICATIONS,
  DEPARTMENT_HISTORICAL_BENCHMARKS
} from '../data/mockExecutiveData';
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  REFUND_STATUS,
  DISCREPANCY_STATUS,
  DISCREPANCY_PRIORITY,
  RECONCILIATION_STATUS,
  PAYMENT_METHODS,
  INITIAL_FINANCIAL_TRANSACTIONS,
  INITIAL_REFUND_REQUESTS,
  INITIAL_RECONCILIATION_BATCHES,
  INITIAL_FINANCIAL_DISCREPANCIES,
  INITIAL_FINANCIAL_AUDIT_LOGS,
  INITIAL_FINANCIAL_NOTIFICATIONS
} from '../data/mockFinanceData';
import {
  INCIDENT_SEVERITY,
  INCIDENT_STATUS,
  BACKUP_STATUS,
  INITIAL_SECURITY_ALERTS,
  INITIAL_SECURITY_INCIDENTS,
  INITIAL_BACKUP_REQUESTS,
  INITIAL_SECURITY_ESCALATIONS,
  INITIAL_SECURITY_EVIDENCE,
  INITIAL_SECURITY_HANDOVERS,
  SECURITY_EMERGENCY_PROTOCOLS
} from '../data/mockSecurityData';
import {
  TASK_STATUS,
  TASK_PRIORITY,
  TASK_CATEGORY,
  INSPECTION_STATUS,
  BLOCKER_STATUS,
  CORRECTIVE_ACTION_STATUS,
  HANDOVER_STATUS,
  DEFAULT_WORKLOAD_THRESHOLDS,
  isOverdue,
  getWorkloadLevel
} from '../utils/taskStatus';
import { computeDepartmentSlaMetrics, getTaskSlaAnalysis } from '../utils/slaCalculations';

const TaskContext = createContext(null);

const STORAGE_KEY_TASKS = 'stayops_shared_tasks_v3';
const STORAGE_KEY_STAFF = 'stayops_shared_staff_v3';
const STORAGE_KEY_NOTIFS = 'stayops_shared_notifs_v3';
const STORAGE_KEY_BLOCKERS = 'stayops_supervisor_blockers_v3';
const STORAGE_KEY_CORRECTIVE = 'stayops_supervisor_corrective_v3';
const STORAGE_KEY_HANDOVERS = 'stayops_supervisor_handovers_v3';
const STORAGE_KEY_THRESHOLDS = 'stayops_supervisor_thresholds_v3';
const STORAGE_KEY_COMPLAINTS = 'stayops_manager_complaints_v3';
const STORAGE_KEY_RECOVERIES = 'stayops_manager_recoveries_v3';
const STORAGE_KEY_SCHEDULES = 'stayops_manager_schedules_v3';
const STORAGE_KEY_SLACONFIG = 'stayops_manager_slaconfig_v3';

// Front Desk Storage Keys
const STORAGE_KEY_ROOMS = 'stayops_frontdesk_rooms_v4';
const STORAGE_KEY_RESERVATIONS = 'stayops_frontdesk_reservations_v4';
const STORAGE_KEY_ROOM_MOVES = 'stayops_frontdesk_moves_v4';
const STORAGE_KEY_WAKE_UP_CALLS = 'stayops_frontdesk_wakeups_v4';
const STORAGE_KEY_GUEST_COMMS = 'stayops_frontdesk_comms_v4';
const STORAGE_KEY_FOLIOS = 'stayops_frontdesk_folios_v4';
const STORAGE_KEY_FRONTDESK_PROFILE = 'stayops_frontdesk_profile_v4';

// Financial Operator Storage Keys
const STORAGE_KEY_FINANCE_PROFILE = 'stayops_finance_profile_v5';
const STORAGE_KEY_FINANCE_TRANSACTIONS = 'stayops_finance_transactions_v5';
const STORAGE_KEY_REFUND_REQUESTS = 'stayops_finance_refund_requests_v5';
const STORAGE_KEY_RECONCILIATION_BATCHES = 'stayops_finance_reconciliation_batches_v5';
const STORAGE_KEY_DISCREPANCIES = 'stayops_finance_discrepancies_v5';
const STORAGE_KEY_FINANCE_AUDIT = 'stayops_finance_audit_logs_v5';
const STORAGE_KEY_FINANCE_NOTIFICATIONS = 'stayops_finance_notifications_v5';
const STORAGE_KEY_AUTH_SESSION = 'stayops_auth_session_v5';

// Security Operations Storage Keys
const STORAGE_KEY_SECURITY_INCIDENTS = 'stayops_security_incidents_v6';
const STORAGE_KEY_SECURITY_ALERTS = 'stayops_security_alerts_v6';
const STORAGE_KEY_SECURITY_BACKUP = 'stayops_security_backup_v6';
const STORAGE_KEY_SECURITY_ESCALATIONS = 'stayops_security_escalations_v6';
const STORAGE_KEY_SECURITY_EVIDENCE = 'stayops_security_evidence_v6';
const STORAGE_KEY_SECURITY_HANDOVERS = 'stayops_security_handovers_v6';

// Platform Administrator Storage Keys
const STORAGE_KEY_PLATFORM_USERS = 'stayops_platform_users_v7';
const STORAGE_KEY_SYSTEM_CONFIG = 'stayops_system_config_v7';
const STORAGE_KEY_INTEGRATIONS = 'stayops_integrations_v7';
const STORAGE_KEY_ADMIN_AUDIT = 'stayops_admin_audit_logs_v7';
const STORAGE_KEY_BACKUPS = 'stayops_backups_v7';

// Executive Viewer/Approver Storage Keys
const STORAGE_KEY_EXECUTIVE_POLICY = 'stayops_executive_policy_v7';
const STORAGE_KEY_EXECUTIVE_ACCESS_CERT = 'stayops_executive_access_cert_v7';
const STORAGE_KEY_EXECUTIVE_COMPLIANCE = 'stayops_executive_compliance_v7';
const STORAGE_KEY_EXECUTIVE_NOTIFS = 'stayops_executive_notifs_v7';




export function TaskProvider({ children }) {
  // 1. Tasks State
  const [tasks, setTasks] = useState(() => {

    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse tasks from localStorage', e);
    }
    return INITIAL_TASKS;
  });

  // 2. Staff State
  const [staffList, setStaffList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STAFF);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse staff from localStorage', e);
    }
    return INITIAL_STAFF;
  });

  // 3. Notifications State (Combines manager, supervisor & dispatcher notifications)
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse notifications from localStorage', e);
    }
    return [
      ...INITIAL_FRONTDESK_NOTIFICATIONS,
      ...INITIAL_MANAGER_NOTIFICATIONS,
      ...INITIAL_SUPERVISOR_NOTIFICATIONS,
      ...INITIAL_NOTIFICATIONS
    ];
  });

  // 4. Blockers State
  const [blockers, setBlockers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BLOCKERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse blockers from localStorage', e);
    }
    return INITIAL_BLOCKERS;
  });

  // 5. Corrective Actions State
  const [correctiveActions, setCorrectiveActions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CORRECTIVE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse corrective actions from localStorage', e);
    }
    return INITIAL_CORRECTIVE_ACTIONS;
  });

  // 6. Handovers State
  const [handovers, setHandovers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HANDOVERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse handovers from localStorage', e);
    }
    return INITIAL_HANDOVERS;
  });

  // 7. Configurable Workload Thresholds (Demo assumptions)
  const [workloadThresholds, setWorkloadThresholds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THRESHOLDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse thresholds', e);
    }
    return DEFAULT_WORKLOAD_THRESHOLDS;
  });

  // 8. Department Manager - Complaints State
  const [complaints, setComplaints] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse complaints from localStorage', e);
    }
    return INITIAL_COMPLAINTS;
  });

  // 9. Department Manager - Service Recovery Requests State
  const [recoveryRequests, setRecoveryRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECOVERIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse recovery requests from localStorage', e);
    }
    return INITIAL_RECOVERY_REQUESTS;
  });

  // 10. Department Manager - Staff Weekly Schedules State
  const [staffSchedules, setStaffSchedules] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCHEDULES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse schedules from localStorage', e);
    }
    return INITIAL_STAFF_SCHEDULES;
  });

  // 11. Department Manager - SLA Thresholds & Configuration State
  const [slaConfig, setSlaConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SLACONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse SLA config', e);
    }
    return DEFAULT_SLA_CONFIG;
  });

  // 12. Front Desk - Rooms Inventory State
  const [rooms, setRooms] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROOMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse rooms from localStorage', e);
    }
    return INITIAL_ROOMS;
  });

  // 13. Front Desk - Reservations State
  const [reservations, setReservations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESERVATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse reservations from localStorage', e);
    }
    return INITIAL_RESERVATIONS;
  });

  // 14. Front Desk - Room Moves State
  const [roomMoves, setRoomMoves] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROOM_MOVES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse room moves from localStorage', e);
    }
    return INITIAL_ROOM_MOVES;
  });

  // 15. Front Desk - Wake-Up Calls State
  const [wakeUpCalls, setWakeUpCalls] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WAKE_UP_CALLS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse wake-up calls from localStorage', e);
    }
    return INITIAL_WAKE_UP_CALLS;
  });

  // 16. Front Desk - Guest Communications State
  const [guestCommunications, setGuestCommunications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GUEST_COMMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse guest communications from localStorage', e);
    }
    return INITIAL_GUEST_COMMUNICATIONS;
  });

  // 17. Front Desk - Folios State
  const [folios, setFolios] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FOLIOS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse folios from localStorage', e);
    }
    return INITIAL_FOLIOS;
  });

  // 18. Front Desk - Profile & Permissions State
  const [frontDeskProfile, setFrontDeskProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FRONTDESK_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse front desk profile from localStorage', e);
    }
    return FRONTDESK_PROFILE;
  });

  // 19. Financial Operator State Hooks
  const [financeProfile, setFinanceProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FINANCE_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse finance profile from localStorage', e);
    }
    return FINANCE_PROFILE;
  });

  const [financialTransactions, setFinancialTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FINANCE_TRANSACTIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse financial transactions from localStorage', e);
    }
    return INITIAL_FINANCIAL_TRANSACTIONS;
  });

  const [refundRequests, setRefundRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REFUND_REQUESTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse refund requests from localStorage', e);
    }
    return INITIAL_REFUND_REQUESTS;
  });

  const [reconciliationBatches, setReconciliationBatches] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECONCILIATION_BATCHES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse reconciliation batches from localStorage', e);
    }
    return INITIAL_RECONCILIATION_BATCHES;
  });

  const [financialDiscrepancies, setFinancialDiscrepancies] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DISCREPANCIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse financial discrepancies from localStorage', e);
    }
    return INITIAL_FINANCIAL_DISCREPANCIES;
  });

  const [financialAuditLogs, setFinancialAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FINANCE_AUDIT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse financial audit logs from localStorage', e);
    }
    return INITIAL_FINANCIAL_AUDIT_LOGS;
  });

  const [financialNotifications, setFinancialNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FINANCE_NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse financial notifications from localStorage', e);
    }
    return INITIAL_FINANCIAL_NOTIFICATIONS;
  });

  // Security Operations States
  const [securityIncidents, setSecurityIncidents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SECURITY_INCIDENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse security incidents from localStorage', e);
    }
    return INITIAL_SECURITY_INCIDENTS;
  });

  const [securityAlerts, setSecurityAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SECURITY_ALERTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse security alerts from localStorage', e);
    }
    return INITIAL_SECURITY_ALERTS;
  });

  const [securityBackupRequests, setSecurityBackupRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SECURITY_BACKUP);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse security backup requests from localStorage', e);
    }
    return INITIAL_BACKUP_REQUESTS;
  });

  const [securityEscalations, setSecurityEscalations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SECURITY_ESCALATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse security escalations from localStorage', e);
    }
    return INITIAL_SECURITY_ESCALATIONS;
  });

  const [securityEvidence, setSecurityEvidence] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SECURITY_EVIDENCE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse security evidence from localStorage', e);
    }
    return INITIAL_SECURITY_EVIDENCE;
  });

  const [securityHandovers, setSecurityHandovers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SECURITY_HANDOVERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse security handovers from localStorage', e);
    }
    return INITIAL_SECURITY_HANDOVERS;
  });

  // Platform Administrator States
  const [platformUsers, setPlatformUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLATFORM_USERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse platform users from localStorage', e);
    }
    return INITIAL_PLATFORM_USERS;
  });

  const [systemConfig, setSystemConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SYSTEM_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse system config from localStorage', e);
    }
    return INITIAL_SYSTEM_CONFIG;
  });

  const [integrations, setIntegrations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INTEGRATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse integrations from localStorage', e);
    }
    return INITIAL_INTEGRATIONS;
  });

  const [adminAuditLogs, setAdminAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADMIN_AUDIT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse admin audit logs from localStorage', e);
    }
    return INITIAL_ADMIN_AUDIT_LOGS;
  });

  const [backups, setBackups] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BACKUPS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse backups from localStorage', e);
    }
    return INITIAL_BACKUPS;
  });

  // Executive Viewer/Approver States
  const [policyReviews, setPolicyReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXECUTIVE_POLICY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse policy reviews from localStorage', e);
    }
    return INITIAL_POLICY_REVIEWS;
  });

  const [accessCertifications, setAccessCertifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXECUTIVE_ACCESS_CERT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse access certs from localStorage', e);
    }
    return INITIAL_ACCESS_CERTIFICATIONS;
  });

  const [complianceActions, setComplianceActions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXECUTIVE_COMPLIANCE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse compliance actions from localStorage', e);
    }
    return INITIAL_COMPLIANCE_ACTIONS;
  });

  const [executiveNotifications, setExecutiveNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXECUTIVE_NOTIFS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse executive notifs from localStorage', e);
    }
    return INITIAL_EXECUTIVE_NOTIFICATIONS;
  });

  // Toast Notification Flash
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Authenticated User Session & Role State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH_SESSION);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.role || parsed.roleId)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse auth session from localStorage', e);
    }
    // Default to Financial Operator for this workspace application
    return FINANCE_PROFILE;
  });

  const login = useCallback((userOrRole) => {
    let profileToSet = FINANCE_PROFILE;
    if (typeof userOrRole === 'string') {
      const norm = normalizeRole(userOrRole);
      profileToSet = ALL_ROLE_PROFILES[norm] || FINANCE_PROFILE;
    } else if (userOrRole && typeof userOrRole === 'object') {
      profileToSet = userOrRole;
    }
    setCurrentUser(profileToSet);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH_SESSION, JSON.stringify(profileToSet));
    } catch (e) {
      console.warn('Failed to save auth session to localStorage', e);
    }
    showToast(`Signed in as ${profileToSet.name} (${profileToSet.role})`, 'success');
    return profileToSet;
  }, [showToast]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH_SESSION);
    } catch (e) {
      console.warn('Failed to clear auth session', e);
    }
    showToast('Signed out of StayOps session', 'info');
  }, [showToast]);

  const switchActiveRole = useCallback((targetRole) => {
    const norm = normalizeRole(targetRole);
    const newProfile = ALL_ROLE_PROFILES[norm] || FINANCE_PROFILE;
    setCurrentUser(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH_SESSION, JSON.stringify(newProfile));
    } catch (e) {
      console.warn('Failed to persist switched role', e);
    }
    if (norm === 'financial_operator') {
      setFinanceProfile(newProfile);
    } else if (norm === 'frontdesk') {
      setFrontDeskProfile(newProfile);
    }
    showToast(`Active role switched to: ${newProfile.role}`, 'success');
    return newProfile;
  }, [showToast]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('LocalStorage sync error (tasks)', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(staffList));
    } catch (e) {
      console.error('LocalStorage sync error (staff)', e);
    }
  }, [staffList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    } catch (e) {
      console.error('LocalStorage sync error (notifs)', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BLOCKERS, JSON.stringify(blockers));
    } catch (e) {
      console.error('LocalStorage sync error (blockers)', e);
    }
  }, [blockers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CORRECTIVE, JSON.stringify(correctiveActions));
    } catch (e) {
      console.error('LocalStorage sync error (correctiveActions)', e);
    }
  }, [correctiveActions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HANDOVERS, JSON.stringify(handovers));
    } catch (e) {
      console.error('LocalStorage sync error (handovers)', e);
    }
  }, [handovers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THRESHOLDS, JSON.stringify(workloadThresholds));
    } catch (e) {
      console.error('LocalStorage sync error (thresholds)', e);
    }
  }, [workloadThresholds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(complaints));
    } catch (e) {
      console.error('LocalStorage sync error (complaints)', e);
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECOVERIES, JSON.stringify(recoveryRequests));
    } catch (e) {
      console.error('LocalStorage sync error (recoveryRequests)', e);
    }
  }, [recoveryRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(staffSchedules));
    } catch (e) {
      console.error('LocalStorage sync error (staffSchedules)', e);
    }
  }, [staffSchedules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SLACONFIG, JSON.stringify(slaConfig));
    } catch (e) {
      console.error('LocalStorage sync error (slaConfig)', e);
    }
  }, [slaConfig]);

  // Front Desk LocalStorage Sync Effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
    } catch (e) {
      console.error('LocalStorage sync error (rooms)', e);
    }
  }, [rooms]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RESERVATIONS, JSON.stringify(reservations));
    } catch (e) {
      console.error('LocalStorage sync error (reservations)', e);
    }
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROOM_MOVES, JSON.stringify(roomMoves));
    } catch (e) {
      console.error('LocalStorage sync error (roomMoves)', e);
    }
  }, [roomMoves]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WAKE_UP_CALLS, JSON.stringify(wakeUpCalls));
    } catch (e) {
      console.error('LocalStorage sync error (wakeUpCalls)', e);
    }
  }, [wakeUpCalls]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GUEST_COMMS, JSON.stringify(guestCommunications));
    } catch (e) {
      console.error('LocalStorage sync error (guestCommunications)', e);
    }
  }, [guestCommunications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FOLIOS, JSON.stringify(folios));
    } catch (e) {
      console.error('LocalStorage sync error (folios)', e);
    }
  }, [folios]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FRONTDESK_PROFILE, JSON.stringify(frontDeskProfile));
    } catch (e) {
      console.error('LocalStorage sync error (frontDeskProfile)', e);
    }
  }, [frontDeskProfile]);

  // Financial Operator localStorage sync effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FINANCE_PROFILE, JSON.stringify(financeProfile));
    } catch (e) {
      console.error('LocalStorage sync error (financeProfile)', e);
    }
  }, [financeProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FINANCE_TRANSACTIONS, JSON.stringify(financialTransactions));
    } catch (e) {
      console.error('LocalStorage sync error (financialTransactions)', e);
    }
  }, [financialTransactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REFUND_REQUESTS, JSON.stringify(refundRequests));
    } catch (e) {
      console.error('LocalStorage sync error (refundRequests)', e);
    }
  }, [refundRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECONCILIATION_BATCHES, JSON.stringify(reconciliationBatches));
    } catch (e) {
      console.error('LocalStorage sync error (reconciliationBatches)', e);
    }
  }, [reconciliationBatches]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DISCREPANCIES, JSON.stringify(financialDiscrepancies));
    } catch (e) {
      console.error('LocalStorage sync error (financialDiscrepancies)', e);
    }
  }, [financialDiscrepancies]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FINANCE_AUDIT, JSON.stringify(financialAuditLogs));
    } catch (e) {
      console.error('LocalStorage sync error (financialAuditLogs)', e);
    }
  }, [financialAuditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FINANCE_NOTIFICATIONS, JSON.stringify(financialNotifications));
    } catch (e) {
      console.error('LocalStorage sync error (financialNotifications)', e);
    }
  }, [financialNotifications]);

  // Security LocalStorage Sync Effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SECURITY_INCIDENTS, JSON.stringify(securityIncidents));
    } catch (e) {
      console.error('LocalStorage sync error (securityIncidents)', e);
    }
  }, [securityIncidents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SECURITY_ALERTS, JSON.stringify(securityAlerts));
    } catch (e) {
      console.error('LocalStorage sync error (securityAlerts)', e);
    }
  }, [securityAlerts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SECURITY_BACKUP, JSON.stringify(securityBackupRequests));
    } catch (e) {
      console.error('LocalStorage sync error (securityBackupRequests)', e);
    }
  }, [securityBackupRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SECURITY_ESCALATIONS, JSON.stringify(securityEscalations));
    } catch (e) {
      console.error('LocalStorage sync error (securityEscalations)', e);
    }
  }, [securityEscalations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SECURITY_EVIDENCE, JSON.stringify(securityEvidence));
    } catch (e) {
      console.error('LocalStorage sync error (securityEvidence)', e);
    }
  }, [securityEvidence]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SECURITY_HANDOVERS, JSON.stringify(securityHandovers));
    } catch (e) {
      console.error('LocalStorage sync error (securityHandovers)', e);
    }
  }, [securityHandovers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLATFORM_USERS, JSON.stringify(platformUsers));
    } catch (e) {
      console.error('LocalStorage sync error (platformUsers)', e);
    }
  }, [platformUsers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SYSTEM_CONFIG, JSON.stringify(systemConfig));
    } catch (e) {
      console.error('LocalStorage sync error (systemConfig)', e);
    }
  }, [systemConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INTEGRATIONS, JSON.stringify(integrations));
    } catch (e) {
      console.error('LocalStorage sync error (integrations)', e);
    }
  }, [integrations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_AUDIT, JSON.stringify(adminAuditLogs));
    } catch (e) {
      console.error('LocalStorage sync error (adminAuditLogs)', e);
    }
  }, [adminAuditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BACKUPS, JSON.stringify(backups));
    } catch (e) {
      console.error('LocalStorage sync error (backups)', e);
    }
  }, [backups]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EXECUTIVE_POLICY, JSON.stringify(policyReviews));
    } catch (e) {
      console.error('LocalStorage sync error (policyReviews)', e);
    }
  }, [policyReviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EXECUTIVE_ACCESS_CERT, JSON.stringify(accessCertifications));
    } catch (e) {
      console.error('LocalStorage sync error (accessCertifications)', e);
    }
  }, [accessCertifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EXECUTIVE_COMPLIANCE, JSON.stringify(complianceActions));
    } catch (e) {
      console.error('LocalStorage sync error (complianceActions)', e);
    }
  }, [complianceActions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EXECUTIVE_NOTIFS, JSON.stringify(executiveNotifications));
    } catch (e) {
      console.error('LocalStorage sync error (executiveNotifications)', e);
    }
  }, [executiveNotifications]);




  // Derived Staff with Live Workload Counts and configured thresholds
  const enrichedStaff = useMemo(() => {
    return staffList.map((member) => {
      const assignedTasks = tasks.filter(
        (t) => t.assignedTo && t.assignedTo.id === member.id && t.status !== TASK_STATUS.COMPLETED
      );
      const overdueTasks = assignedTasks.filter((t) => isOverdue(t.dueAt, t.status));
      const blockedTasks = assignedTasks.filter((t) => t.status === TASK_STATUS.BLOCKED || Boolean(t.blockerInfo));
      const activeCount = assignedTasks.length;
      const overdueCount = overdueTasks.length;

      const workloadAnalysis = getWorkloadLevel(activeCount, overdueCount, workloadThresholds);

      return {
        ...member,
        activeTasksCount: activeCount,
        overdueTasksCount: overdueCount,
        blockedTasksCount: blockedTasks.length,
        workloadStatus: workloadAnalysis.level,
        workloadAnalysis,
        assignedTasks
      };
    });
  }, [staffList, tasks, workloadThresholds]);

  // Derived Dashboard Metrics for Dispatcher
  const summaryMetrics = useMemo(() => {
    const openTasks = tasks.filter((t) => t.status !== TASK_STATUS.COMPLETED);
    const unassignedTasks = tasks.filter(
      (t) => (!t.assignedTo || !t.assignedTo.id) && t.status !== TASK_STATUS.COMPLETED
    );
    const overdueTasks = tasks.filter((t) => isOverdue(t.dueAt, t.status));
    const availableStaff = enrichedStaff.filter((s) => s.availability === 'Available');

    return {
      openTasksCount: openTasks.length,
      unassignedTasksCount: unassignedTasks.length,
      overdueTasksCount: overdueTasks.length,
      availableStaffCount: availableStaff.length
    };
  }, [tasks, enrichedStaff]);

  // Derived Dashboard Metrics for Supervisor
  const supervisorMetrics = useMemo(() => {
    const activeTasks = tasks.filter((t) => t.status !== TASK_STATUS.COMPLETED);
    const overdueTasks = tasks.filter((t) => isOverdue(t.dueAt, t.status));
    const blockedTasks = tasks.filter(
      (t) => t.status === TASK_STATUS.BLOCKED || (t.blockerInfo && t.blockerInfo.status !== BLOCKER_STATUS.RESOLVED)
    );
    const pendingInspections = tasks.filter(
      (t) => t.inspectionRequired === true && t.inspectionStatus === INSPECTION_STATUS.PENDING
    );

    return {
      activeTasksCount: activeTasks.length,
      overdueTasksCount: overdueTasks.length,
      blockedTasksCount: blockedTasks.length,
      pendingInspectionCount: pendingInspections.length
    };
  }, [tasks]);

  // Derived Dashboard Metrics for Department Manager
  const managerMetrics = useMemo(() => {
    const openTasks = tasks.filter((t) => t.status !== TASK_STATUS.COMPLETED);
    const overdueTasks = tasks.filter((t) => isOverdue(t.dueAt, t.status));
    const slaAnalysis = computeDepartmentSlaMetrics(tasks, slaConfig);
    const openComplaints = complaints.filter((c) => c.status !== COMPLAINT_STATUS.RESOLVED);
    const highSeverityComplaints = openComplaints.filter(
      (c) => c.severity === 'high' || c.severity === 'critical'
    );
    const pendingRecoveries = recoveryRequests.filter((r) => r.status === RECOVERY_STATUS.PENDING);
    const pendingRecoveriesAmount = pendingRecoveries.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    const onDutyStaff = enrichedStaff.filter((s) => s.availability !== 'Off Duty');
    const availableStaff = enrichedStaff.filter((s) => s.availability === 'Available');
    const totalStaffCount = enrichedStaff.length;
    const staffingCoverage = totalStaffCount > 0 ? Math.round((onDutyStaff.length / totalStaffCount) * 100) : 100;

    return {
      openTasksCount: openTasks.length,
      overdueTasksCount: overdueTasks.length,
      slaAtRiskCount: slaAnalysis.slaAtRiskCount,
      slaBreachedCount: slaAnalysis.slaBreachedCount,
      slaComplianceRate: slaAnalysis.slaComplianceRate,
      avgResponseMinutes: slaAnalysis.avgResponseMinutes,
      avgCompletionMinutes: slaAnalysis.avgCompletionMinutes,
      openComplaintsCount: openComplaints.length,
      highSeverityComplaintsCount: highSeverityComplaints.length,
      pendingApprovalsCount: pendingRecoveries.length,
      pendingApprovalsTotalAmount: pendingRecoveriesAmount,
      onDutyStaffCount: onDutyStaff.length,
      availableStaffCount: availableStaff.length,
      totalStaffCount,
      staffingCoveragePercent: staffingCoverage
    };
  }, [tasks, complaints, recoveryRequests, enrichedStaff, slaConfig]);

  // Unified Activity History derived from tasks, blockers, inspections, handovers, complaints, and recoveries
  const recentActivities = useMemo(() => {
    const events = [];

    // From tasks history
    tasks.forEach((task) => {
      if (Array.isArray(task.history)) {
        task.history.forEach((h) => {
          events.push({
            id: h.id || `EV-${Math.random()}`,
            taskId: task.id,
            taskTitle: task.title,
            location: task.location,
            event: h.event,
            details: h.details,
            actor: h.actor,
            timestamp: h.timestamp || task.createdAt,
            type: h.event.toLowerCase().includes('manager')
              ? 'manager_intervention'
              : h.event.toLowerCase().includes('reassigned')
              ? 'reassign'
              : h.event.toLowerCase().includes('inspection')
              ? 'inspection'
              : h.event.toLowerCase().includes('reopened')
              ? 'reopen'
              : h.event.toLowerCase().includes('block')
              ? 'blocker'
              : h.event.toLowerCase().includes('escalat')
              ? 'escalation'
              : 'status'
          });
        });
      }
    });

    // From handovers
    handovers.forEach((h) => {
      events.push({
        id: `ACT-HND-${h.id}`,
        taskId: h.taskId,
        taskTitle: h.taskTitle,
        location: h.location,
        event: 'Shift Handover Created',
        details: `Handover created for ${h.nextOwner} (${h.nextOwnerRole}). Status: ${h.status}`,
        actor: h.createdBy,
        timestamp: h.createdAt,
        type: 'handover'
      });
      if (h.acknowledgedAt) {
        events.push({
          id: `ACT-HND-ACK-${h.id}`,
          taskId: h.taskId,
          taskTitle: h.taskTitle,
          location: h.location,
          event: 'Shift Handover Acknowledged',
          details: `Acknowledged by ${h.acknowledgedBy}. Note: "${h.acknowledgementNotes || 'Acknowledged'}"`,
          actor: h.acknowledgedBy,
          timestamp: h.acknowledgedAt,
          type: 'handover'
        });
      }
    });

    // From corrective actions
    correctiveActions.forEach((ca) => {
      events.push({
        id: `ACT-CA-${ca.id}`,
        taskId: ca.taskId,
        taskTitle: ca.taskTitle,
        location: ca.location,
        event: 'Corrective Action Logged',
        details: `Assigned to ${ca.responsiblePerson}. Problem: ${ca.problemIdentified}`,
        actor: ca.createdBy,
        timestamp: ca.createdAt,
        type: 'corrective'
      });
      if (ca.resolvedAt) {
        events.push({
          id: `ACT-CA-RES-${ca.id}`,
          taskId: ca.taskId,
          taskTitle: ca.taskTitle,
          location: ca.location,
          event: 'Corrective Action Resolved',
          details: `Resolved by ${ca.responsiblePerson}. Notes: ${ca.resolutionNotes}`,
          actor: ca.responsiblePerson,
          timestamp: ca.resolvedAt,
          type: 'corrective'
        });
      }
    });

    // From complaints
    complaints.forEach((c) => {
      if (Array.isArray(c.history)) {
        c.history.forEach((ch) => {
          events.push({
            id: `ACT-CMP-${ch.id || Math.random()}`,
            taskId: c.relatedTaskId || 'N/A',
            taskTitle: `Complaint: ${c.category}`,
            location: c.roomNumber || 'Department Zone',
            event: `Guest Case: ${ch.action}`,
            details: `[${c.id}] ${ch.details} (Guest: ${c.guestReference})`,
            actor: ch.actor,
            timestamp: ch.timestamp,
            type: 'complaint'
          });
        });
      }
    });

    // From recovery requests
    recoveryRequests.forEach((r) => {
      if (Array.isArray(r.history)) {
        r.history.forEach((rh) => {
          events.push({
            id: `ACT-REC-${rh.id || Math.random()}`,
            taskId: r.taskId || 'N/A',
            taskTitle: `Service Recovery: ${r.requestType}`,
            location: r.guestReference,
            event: `Recovery: ${rh.action}`,
            details: `[${r.id}] ${rh.details} (${r.currency} $${r.amount.toFixed(2)})`,
            actor: rh.actor,
            timestamp: rh.timestamp,
            type: 'approval'
          });
        });
      }
    });

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [tasks, handovers, correctiveActions, complaints, recoveryRequests]);

  // ==========================================
  // DISPATCHER ACTIONS (PRESERVED INTACT)
  // ==========================================
  const createTask = useCallback(
    (newTaskData) => {
      const nextNum = 1040 + tasks.length + Math.floor(Math.random() * 10) + 1;
      const newId = `TSK-${nextNum}`;

      const createdTask = {
        id: newId,
        title: newTaskData.title.trim(),
        category: newTaskData.category,
        location: newTaskData.location.trim(),
        item: newTaskData.item ? newTaskData.item.trim() : '',
        quantity: newTaskData.quantity ? Number(newTaskData.quantity) : 1,
        priority: newTaskData.priority || 'medium',
        status: TASK_STATUS.NEW,
        assignedTo: newTaskData.assignedStaff
          ? {
              id: newTaskData.assignedStaff.id,
              name: newTaskData.assignedStaff.name,
              shift: newTaskData.assignedStaff.shift
            }
          : null,
        createdAt: new Date().toISOString(),
        dueAt: newTaskData.dueAt,
        scheduledStart: newTaskData.scheduledStart || null,
        completedAt: null,
        guestUpdateRequired: Boolean(newTaskData.guestUpdateRequired),
        inspectionRequired: Boolean(newTaskData.inspectionRequired),
        inspectionStatus: newTaskData.inspectionRequired
          ? INSPECTION_STATUS.NOT_REQUIRED
          : INSPECTION_STATUS.NOT_REQUIRED,
        instructions: newTaskData.instructions.trim(),
        internalNotes: newTaskData.internalNotes ? newTaskData.internalNotes.trim() : '',
        delayInfo: null,
        escalationInfo: null,
        blockerInfo: null,
        guestCommunicationHistory: [],
        history: [
          {
            id: `HIS-${Date.now()}-1`,
            event: 'Task Created',
            details: `Created by Dispatcher ${DISPATCHER_PROFILE.name}.`,
            timestamp: new Date().toISOString(),
            actor: `${DISPATCHER_PROFILE.name} (Dispatcher)`
          }
        ]
      };

      if (newTaskData.assignedStaff) {
        createdTask.history.push({
          id: `HIS-${Date.now()}-2`,
          event: 'Initial Assignment',
          details: `Assigned directly at creation to ${newTaskData.assignedStaff.name}.`,
          timestamp: new Date().toISOString(),
          actor: `${DISPATCHER_PROFILE.name} (Dispatcher)`
        });
      }

      setTasks((prev) => [createdTask, ...prev]);

      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now()}`,
          taskId: newId,
          type: newTaskData.assignedStaff ? 'assigned' : 'unassigned',
          title: `Task ${newId} Created`,
          message: `${createdTask.title} (${createdTask.location}) created successfully.`,
          timestamp: new Date().toISOString(),
          isRead: false,
          priority: createdTask.priority,
          category: 'Task'
        },
        ...prev
      ]);

      showToast(`Task ${newId} successfully dispatched!`, 'success');
      return createdTask;
    },
    [tasks.length, showToast]
  );

  const assignTask = useCallback(
    (taskId, selectedStaff, assignmentNotes = '', scheduledStart = null) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) return task;

          const prevAssignee = task.assignedTo?.name || 'Unassigned';
          const newAssignee = selectedStaff.name;

          const historyEntry = {
            id: `HIS-${Date.now()}`,
            event: task.assignedTo ? 'Assignment Changed' : 'Task Assigned',
            details: `Reassigned from ${prevAssignee} to ${newAssignee}.${
              assignmentNotes ? ` Notes: "${assignmentNotes}"` : ''
            }`,
            timestamp: new Date().toISOString(),
            actor: `${DISPATCHER_PROFILE.name} (Dispatcher)`,
            previousValue: prevAssignee,
            newValue: newAssignee
          };

          return {
            ...task,
            assignedTo: {
              id: selectedStaff.id,
              name: selectedStaff.name,
              shift: selectedStaff.shift
            },
            scheduledStart: scheduledStart || task.scheduledStart,
            internalNotes: assignmentNotes
              ? `${task.internalNotes ? task.internalNotes + ' | ' : ''}Assignment note: ${assignmentNotes}`
              : task.internalNotes,
            history: [historyEntry, ...task.history]
          };
        })
      );

      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now()}`,
          taskId,
          type: 'assigned',
          title: `Task ${taskId} Assigned`,
          message: `Assigned to ${selectedStaff.name} (${selectedStaff.shift}).`,
          timestamp: new Date().toISOString(),
          isRead: false,
          priority: 'medium',
          category: 'Assignment'
        },
        ...prev
      ]);

      showToast(`Assigned ${taskId} to ${selectedStaff.name}`, 'success');
    },
    [showToast]
  );

  const unassignTask = useCallback(
    (taskId) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) return task;
          const prevAssignee = task.assignedTo?.name || 'Unknown';

          const historyEntry = {
            id: `HIS-${Date.now()}`,
            event: 'Assignment Cleared',
            details: `Unassigned from ${prevAssignee}. Returned to unassigned pool.`,
            timestamp: new Date().toISOString(),
            actor: `${DISPATCHER_PROFILE.name} (Dispatcher)`,
            previousValue: prevAssignee,
            newValue: 'Unassigned'
          };

          return {
            ...task,
            assignedTo: null,
            history: [historyEntry, ...task.history]
          };
        })
      );

      showToast(`Cleared assignment for ${taskId}. Task is now unassigned.`, 'warning');
    },
    [showToast]
  );

  const updateTask = useCallback(
    (taskId, updates) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) return task;

          const historyEntry = {
            id: `HIS-${Date.now()}`,
            event: 'Task Details Updated',
            details: `Task parameters updated.`,
            timestamp: new Date().toISOString(),
            actor: `${SUPERVISOR_PROFILE.name} (Supervisor)`
          };

          return {
            ...task,
            ...updates,
            history: [historyEntry, ...task.history]
          };
        })
      );

      showToast(`Updated ${taskId} successfully`, 'success');
    },
    [showToast]
  );

  const recordDelay = useCallback(
    (taskId, { reason, explanation, revisedExpectedAt, nextAction }) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) return task;

          const delayInfo = {
            reason,
            notes: explanation,
            revisedExpectedAt,
            reportedAt: new Date().toISOString(),
            reportedBy: `${DISPATCHER_PROFILE.name} (Dispatcher)`,
            nextAction
          };

          const historyEntry = {
            id: `HIS-${Date.now()}`,
            event: 'Delay Recorded',
            details: `Reason: ${reason}. Revised target: ${new Date(revisedExpectedAt).toLocaleTimeString()}. Next action: ${nextAction}`,
            timestamp: new Date().toISOString(),
            actor: `${DISPATCHER_PROFILE.name} (Dispatcher)`,
            newValue: reason
          };

          return {
            ...task,
            delayInfo,
            dueAt: revisedExpectedAt || task.dueAt,
            history: [historyEntry, ...task.history]
          };
        })
      );

      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now()}`,
          taskId,
          type: 'delay',
          title: `Delay Logged for ${taskId}`,
          message: `Reason: ${reason}. Revised completion: ${new Date(revisedExpectedAt).toLocaleTimeString()}`,
          timestamp: new Date().toISOString(),
          isRead: false,
          priority: 'high',
          category: 'Delay'
        },
        ...prev
      ]);

      showToast(`Delay recorded for ${taskId}. Expected SLA updated.`, 'warning');
    },
    [showToast]
  );

  const recordGuestCommunication = useCallback(
    (taskId, { summary, contactChannel = 'Front Desk' }) => {
      const gcom = {
        id: `GCOM-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: `${DISPATCHER_PROFILE.name} (${contactChannel})`,
        summary
      };

      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) return task;

          const historyEntry = {
            id: `HIS-${Date.now()}`,
            event: 'Guest Update Recorded',
            details: `Logged guest communication: "${summary}"`,
            timestamp: new Date().toISOString(),
            actor: `${DISPATCHER_PROFILE.name} (Dispatcher)`
          };

          return {
            ...task,
            guestCommunicationHistory: [gcom, ...(task.guestCommunicationHistory || [])],
            history: [historyEntry, ...task.history]
          };
        })
      );

      showToast(`Guest communication update logged for ${taskId}`, 'success');
    },
    [showToast]
  );

  const escalateTask = useCallback(
    (taskId, { level, destination, reason, urgency = 'high' }) => {
      const escalationInfo = {
        level,
        escalatedTo: destination,
        escalatedAt: new Date().toISOString(),
        escalatedBy: `${DISPATCHER_PROFILE.name} (Dispatcher)`,
        reason,
        status: 'Pending Review'
      };

      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) return task;

          const historyEntry = {
            id: `HIS-${Date.now()}`,
            event: 'Task Escalated',
            details: `Escalated to ${destination} (${level}). Reason: ${reason}`,
            timestamp: new Date().toISOString(),
            actor: `${DISPATCHER_PROFILE.name} (Dispatcher)`
          };

          return {
            ...task,
            priority: urgency === 'immediate' ? 'urgent' : task.priority,
            escalationInfo,
            history: [historyEntry, ...task.history]
          };
        })
      );

      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now()}`,
          taskId,
          type: 'escalation',
          title: `Task ${taskId} Escalated`,
          message: `Escalated to ${destination}. Reason: ${reason}`,
          timestamp: new Date().toISOString(),
          isRead: false,
          priority: 'urgent',
          category: 'Escalation'
        },
        ...prev
      ]);

      showToast(`Task ${taskId} successfully escalated to ${destination}`, 'error');
    },
    [showToast]
  );

  // ==========================================
  // SUPERVISOR ACTIONS & WORKFLOWS
  // ==========================================

  // 1. Supervisor Reassignment with Validation & Audit
  const reassignSupervisorTask = useCallback(
    (taskId, { newAssigneeId, reason, handoverInstructions }) => {
      const staffMember = staffList.find((s) => s.id === newAssigneeId);
      if (!staffMember) {
        showToast('Selected employee was not found in authorized department roster.', 'error');
        return false;
      }

      if (staffMember.availability === 'Off Duty' || staffMember.availability === 'On Break') {
        showToast(`Cannot assign to ${staffMember.name}: currently ${staffMember.availability}.`, 'error');
        return false;
      }

      if (!reason || !reason.trim()) {
        showToast('A specific reassignment reason is required for the audit trail.', 'error');
        return false;
      }

      let updated = false;

      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) return task;

          const prevAssignee = task.assignedTo?.name || 'Unassigned';
          const newAssignee = staffMember.name;

          const historyEntry = {
            id: `HIS-${Date.now()}`,
            event: 'Task Reassigned (Supervisor)',
            details: `Reassigned from ${prevAssignee} to ${newAssignee}. Reason: "${reason}".${
              handoverInstructions ? ` Instructions: "${handoverInstructions}"` : ''
            }`,
            timestamp: new Date().toISOString(),
            actor: `${SUPERVISOR_PROFILE.name} (Supervisor)`,
            previousValue: prevAssignee,
            newValue: newAssignee,
            reason: reason.trim(),
            notes: handoverInstructions || ''
          };

          updated = true;
          return {
            ...task,
            assignedTo: {
              id: staffMember.id,
              name: staffMember.name,
              shift: staffMember.shift
            },
            history: [historyEntry, ...task.history]
          };
        })
      );

      if (updated) {
        setNotifications((prev) => [
          {
            id: `SNOTIF-${Date.now()}`,
            taskId,
            type: 'reassignment',
            title: `Task ${taskId} Reassigned`,
            message: `Reassigned to ${staffMember.name}. Reason: ${reason} (Acting: Supervisor ${SUPERVISOR_PROFILE.name})`,
            timestamp: new Date().toISOString(),
            isRead: false,
            priority: 'medium',
            category: 'Reassignment'
          },
          ...prev
        ]);

        showToast(`Task ${taskId} successfully reassigned to ${staffMember.name}`, 'success');
        return true;
      }
      return false;
    },
    [staffList, showToast]
  );

  // 2. Inspection Workflow: Approve, Reopen, or Request Correction
  const inspectTask = useCallback(
    (taskId, { outcome, notes, checklist = [], targetAssigneeId = null }) => {
      let success = false;

      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) return task;

          const nowIso = new Date().toISOString();
          const reviewer = `${SUPERVISOR_PROFILE.name} (Supervisor)`;

          if (outcome === 'passed') {
            const historyEntry = {
              id: `HIS-INSP-${Date.now()}`,
              event: 'Inspection Passed',
              details: `Supervisor approved completed work. Quality criteria verified.${
                notes ? ` Notes: "${notes}"` : ''
              }`,
              timestamp: nowIso,
              actor: reviewer,
              outcome: 'Passed'
            };

            success = true;
            return {
              ...task,
              status: TASK_STATUS.COMPLETED,
              inspectionStatus: INSPECTION_STATUS.PASSED,
              inspectionDetails: {
                reviewer,
                reviewedAt: nowIso,
                outcome: 'Passed',
                notes: notes || 'All quality standards verified and approved.',
                checklist
              },
              history: [historyEntry, ...task.history]
            };
          }

          if (outcome === 'reopen') {
            if (!notes || !notes.trim()) {
              showToast('Corrective instructions and reopening reason are strictly required.', 'error');
              return task;
            }

            const targetStaff = targetAssigneeId
              ? staffList.find((s) => s.id === targetAssigneeId)
              : task.assignedTo;

            const historyEntry = {
              id: `HIS-REOPEN-${Date.now()}`,
              event: 'Task Reopened Post-Inspection',
              details: `Work rejected during quality inspection by Supervisor. Reopened for corrective finish: "${notes}"`,
              timestamp: nowIso,
              actor: reviewer,
              previousValue: TASK_STATUS.COMPLETED,
              newValue: TASK_STATUS.IN_PROGRESS,
              reason: notes
            };

            success = true;

            // Automatically create a linked corrective action!
            const newCa = {
              id: `CA-${Math.floor(100 + Math.random() * 900)}`,
              taskId: task.id,
              taskTitle: task.title,
              location: task.location,
              problemIdentified: `Inspection Deficiency: ${notes}`,
              correctiveActionRequired: notes,
              responsiblePerson: targetStaff?.name || 'Assigned Staff',
              responsiblePersonId: targetStaff?.id || '',
              targetCompletionTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
              notes: 'Generated automatically from supervisor inspection rejection.',
              status: CORRECTIVE_ACTION_STATUS.IN_PROGRESS,
              createdBy: reviewer,
              createdAt: nowIso,
              resolvedAt: null,
              resolutionNotes: ''
            };

            setCorrectiveActions((cPrev) => [newCa, ...cPrev]);

            return {
              ...task,
              status: TASK_STATUS.IN_PROGRESS,
              inspectionStatus: INSPECTION_STATUS.REOPENED,
              assignedTo: targetStaff || task.assignedTo,
              history: [historyEntry, ...task.history]
            };
          }

          if (outcome === 'correction_requested') {
            const historyEntry = {
              id: `HIS-CORR-${Date.now()}`,
              event: 'Correction Requested',
              details: `Quality deficiency flagged by Supervisor: "${notes}". Corrective action ticket assigned.`,
              timestamp: nowIso,
              actor: reviewer
            };

            success = true;

            const newCa = {
              id: `CA-${Math.floor(100 + Math.random() * 900)}`,
              taskId: task.id,
              taskTitle: task.title,
              location: task.location,
              problemIdentified: notes || 'Quality discrepancy flagged by supervisor',
              correctiveActionRequired: notes,
              responsiblePerson: task.assignedTo?.name || 'Team Member',
              responsiblePersonId: task.assignedTo?.id || '',
              targetCompletionTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
              notes: 'Corrective action required before final turnover approval.',
              status: CORRECTIVE_ACTION_STATUS.PENDING,
              createdBy: reviewer,
              createdAt: nowIso,
              resolvedAt: null,
              resolutionNotes: ''
            };

            setCorrectiveActions((cPrev) => [newCa, ...cPrev]);

            return {
              ...task,
              status: TASK_STATUS.IN_PROGRESS,
              inspectionStatus: INSPECTION_STATUS.CORRECTION_REQUESTED,
              history: [historyEntry, ...task.history]
            };
          }

          return task;
        })
      );

      if (success) {
        if (outcome === 'passed') {
          showToast(`Inspection passed! Task ${taskId} approved & verified.`, 'success');
        } else if (outcome === 'reopen') {
          showToast(`Task ${taskId} reopened. Audit history preserved & corrective action created.`, 'warning');
        } else {
          showToast(`Correction requested for ${taskId}. Corrective ticket created.`, 'info');
        }
        return true;
      }
      return false;
    },
    [staffList, showToast]
  );

  // 3. Blocker Management with Strict Safety Clearance Rule
  const createBlocker = useCallback(
    ({
      taskId,
      category,
      description,
      operationalImpact,
      responsiblePerson,
      nextAction,
      expectedResolutionTime,
      safetyRestricted = false,
      reportedBy = null
    }) => {
      const nowIso = new Date().toISOString();
      const newBlockerId = `BLK-${Math.floor(100 + Math.random() * 900)}`;
      const reporter = reportedBy || `${SUPERVISOR_PROFILE.name} (Supervisor)`;

      const task = tasks.find((t) => t.id === taskId);
      const blockerObj = {
        id: newBlockerId,
        taskId,
        taskTitle: task ? task.title : 'Department Task',
        location: task ? task.location : 'Service Area',
        category,
        description: description.trim(),
        operationalImpact: operationalImpact ? operationalImpact.trim() : 'Operational impediment reported',
        responsiblePerson: responsiblePerson ? responsiblePerson.trim() : 'Service Team',
        status: safetyRestricted ? BLOCKER_STATUS.PENDING_CLEARANCE : BLOCKER_STATUS.OPEN,
        safetyRestricted: Boolean(safetyRestricted),
        safetyClearanceRequired: safetyRestricted
          ? 'Certified Safety Officer or Maintenance Engineer Sign-Off Required Before Release'
          : null,
        safetyClearanceDetails: null,
        reportedBy: reporter,
        reportedAt: nowIso,
        expectedResolutionTime: expectedResolutionTime || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        nextAction: nextAction ? nextAction.trim() : 'Under assessment by supervisor',
        resolutionNotes: '',
        history: [
          {
            id: `BH-${Date.now()}`,
            event: safetyRestricted ? 'Safety Lockout Enforced' : 'Blocker Created',
            details: `Blocker opened under category "${category}". ${
              safetyRestricted ? 'Zone locked out pending certified clearance.' : ''
            }`,
            actor: reporter,
            timestamp: nowIso
          }
        ]
      };

      setBlockers((prev) => [blockerObj, ...prev]);

      // Update the related task to BLOCKED
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;

          const historyEntry = {
            id: `HIS-BLK-${Date.now()}`,
            event: 'Task Blocked',
            details: `Blocker ${newBlockerId} logged: [${category}] ${description}`,
            timestamp: nowIso,
            actor: reporter,
            newValue: category
          };

          return {
            ...t,
            status: TASK_STATUS.BLOCKED,
            blockerInfo: blockerObj,
            history: [historyEntry, ...t.history]
          };
        })
      );

      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now()}`,
          taskId,
          type: safetyRestricted ? 'safety_blocker' : 'blocker',
          title: `Blocker Logged: ${taskId}`,
          message: `${category}: ${description}`,
          timestamp: nowIso,
          isRead: false,
          priority: safetyRestricted ? 'urgent' : 'high',
          category: 'Blocker'
        },
        ...prev
      ]);

      showToast(`Blocker ${newBlockerId} registered for ${taskId}`, safetyRestricted ? 'error' : 'warning');
      return blockerObj;
    },
    [tasks, showToast]
  );

  const updateBlocker = useCallback(
    (blockerId, updates) => {
      const nowIso = new Date().toISOString();
      setBlockers((prev) =>
        prev.map((b) => {
          if (b.id !== blockerId) return b;

          const historyEntry = {
            id: `BH-${Date.now()}`,
            event: 'Blocker Action Updated',
            details: updates.nextAction ? `Next action: "${updates.nextAction}"` : 'Blocker parameters updated',
            actor: `${SUPERVISOR_PROFILE.name} (Supervisor)`,
            timestamp: nowIso
          };

          return {
            ...b,
            ...updates,
            history: [historyEntry, ...(b.history || [])]
          };
        })
      );

      showToast(`Updated blocker ${blockerId}`, 'info');
    },
    [showToast]
  );

  const resolveBlocker = useCallback(
    (blockerId, { resolutionNotes, safetyClearanceCert, clearedBy }) => {
      const blocker = blockers.find((b) => b.id === blockerId);
      if (!blocker) {
        showToast('Blocker not found', 'error');
        return false;
      }

      // STRICT SAFETY RESTRICTION RULE:
      // A supervisor must not release an unsafe room or area without required clearance
      // from the authorized safety or maintenance workflow.
      if (blocker.safetyRestricted) {
        if (!safetyClearanceCert || !safetyClearanceCert.trim() || !clearedBy || !clearedBy.trim()) {
          showToast(
            'SAFETY VIOLATION PREVENTED: Cannot release an unsafe zone without certified Safety Officer clearance ID and cert number.',
            'error',
            6000
          );
          return false;
        }
      }

      if (!resolutionNotes || !resolutionNotes.trim()) {
        showToast('Detailed resolution notes are required to close an operational blocker.', 'error');
        return false;
      }

      const nowIso = new Date().toISOString();

      // Update Blocker
      setBlockers((prev) =>
        prev.map((b) => {
          if (b.id !== blockerId) return b;

          const historyEntry = {
            id: `BH-${Date.now()}`,
            event: b.safetyRestricted ? 'Safety Clearance Verified & Resolved' : 'Blocker Resolved',
            details: `Blocker closed by Supervisor. Notes: "${resolutionNotes}".${
              b.safetyRestricted ? ` Safety Officer Clearance: ${clearedBy} (Cert #${safetyClearanceCert})` : ''
            }`,
            actor: `${SUPERVISOR_PROFILE.name} (Supervisor)`,
            timestamp: nowIso
          };

          return {
            ...b,
            status: BLOCKER_STATUS.RESOLVED,
            resolutionNotes: resolutionNotes.trim(),
            resolvedAt: nowIso,
            resolvedBy: `${SUPERVISOR_PROFILE.name} (Supervisor)`,
            safetyClearanceDetails: b.safetyRestricted
              ? {
                  clearedBy: clearedBy.trim(),
                  certificationId: safetyClearanceCert.trim(),
                  clearedAt: nowIso
                }
              : null,
            history: [historyEntry, ...(b.history || [])]
          };
        })
      );

      // Update Task: Clear blocker state, RETURN to active In Progress (DO NOT mark completed!)
      if (blocker.taskId) {
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id !== blocker.taskId) return t;

            const historyEntry = {
              id: `HIS-UNBLK-${Date.now()}`,
              event: 'Blocker Resolved',
              details: `Blocker ${blockerId} resolved by Supervisor. Task returned to active state. Notes: "${resolutionNotes}"`,
              timestamp: nowIso,
              actor: `${SUPERVISOR_PROFILE.name} (Supervisor)`
            };

            return {
              ...t,
              status: t.assignedTo ? TASK_STATUS.IN_PROGRESS : TASK_STATUS.NEW,
              blockerInfo: null,
              delayInfo: null,
              history: [historyEntry, ...t.history]
            };
          })
        );
      }

      showToast(
        `Blocker ${blockerId} successfully resolved. Task returned to active pipeline.`,
        'success'
      );
      return true;
    },
    [blockers, showToast]
  );

  // 4. Corrective Actions Workflow
  const createCorrectiveAction = useCallback(
    ({
      taskId,
      taskTitle,
      location,
      problemIdentified,
      correctiveActionRequired,
      responsiblePerson,
      responsiblePersonId,
      targetCompletionTime,
      notes
    }) => {
      const nowIso = new Date().toISOString();
      const newCaId = `CA-${Math.floor(100 + Math.random() * 900)}`;

      const newAction = {
        id: newCaId,
        taskId: taskId || 'N/A',
        taskTitle: taskTitle || 'Operational Issue',
        location: location || 'Department Zone',
        problemIdentified: problemIdentified.trim(),
        correctiveActionRequired: correctiveActionRequired.trim(),
        responsiblePerson: responsiblePerson.trim(),
        responsiblePersonId: responsiblePersonId || '',
        targetCompletionTime: targetCompletionTime || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        notes: notes ? notes.trim() : '',
        status: CORRECTIVE_ACTION_STATUS.PENDING,
        createdBy: `${SUPERVISOR_PROFILE.name} (Supervisor)`,
        createdAt: nowIso,
        resolvedAt: null,
        resolutionNotes: ''
      };

      setCorrectiveActions((prev) => [newAction, ...prev]);

      if (taskId && taskId !== 'N/A') {
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              history: [
                {
                  id: `HIS-CA-${Date.now()}`,
                  event: 'Corrective Action Assigned',
                  details: `Corrective Action ${newCaId} assigned to ${responsiblePerson}: "${correctiveActionRequired}"`,
                  timestamp: nowIso,
                  actor: `${SUPERVISOR_PROFILE.name} (Supervisor)`
                },
                ...t.history
              ]
            };
          })
        );
      }

      showToast(`Corrective action ${newCaId} assigned to ${responsiblePerson}`, 'warning');
      return newAction;
    },
    [showToast]
  );

  const updateCorrectiveAction = useCallback(
    (actionId, updates) => {
      setCorrectiveActions((prev) =>
        prev.map((ca) => (ca.id === actionId ? { ...ca, ...updates } : ca))
      );
      showToast(`Updated corrective action ${actionId}`, 'info');
    },
    [showToast]
  );

  const resolveCorrectiveAction = useCallback(
    (actionId, { resolutionNotes }) => {
      const nowIso = new Date().toISOString();
      setCorrectiveActions((prev) =>
        prev.map((ca) => {
          if (ca.id !== actionId) return ca;
          return {
            ...ca,
            status: CORRECTIVE_ACTION_STATUS.RESOLVED,
            resolutionNotes: resolutionNotes ? resolutionNotes.trim() : 'Corrective action verified by supervisor.',
            resolvedAt: nowIso
          };
        })
      );
      showToast(`Corrective action ${actionId} marked resolved`, 'success');
    },
    [showToast]
  );

  // 5. Shift Handover Workflow
  const createHandover = useCallback(
    ({
      taskId,
      taskTitle,
      location,
      currentStatus,
      workCompleted,
      outstandingActions,
      risks,
      nextOwner,
      nextOwnerRole,
      targetCompletionTime,
      notes
    }) => {
      const nowIso = new Date().toISOString();
      const newHandoverId = `HND-${Math.floor(100 + Math.random() * 900)}`;

      const newHandover = {
        id: newHandoverId,
        taskId: taskId || 'N/A',
        taskTitle: taskTitle || 'General Shift Handover',
        location: location || 'Department Scope',
        currentStatus: currentStatus || 'In Progress',
        workCompleted: workCompleted.trim(),
        outstandingActions: outstandingActions.trim(),
        risks: risks ? risks.trim() : 'None reported',
        currentOwner: `${SUPERVISOR_PROFILE.name} (Supervisor)`,
        nextOwner: nextOwner.trim(),
        nextOwnerRole: nextOwnerRole || 'Incoming Supervisor',
        targetCompletionTime: targetCompletionTime || new Date(Date.now() + 120 * 60 * 1000).toISOString(),
        notes: notes ? notes.trim() : '',
        createdBy: `${SUPERVISOR_PROFILE.name} (Supervisor)`,
        createdAt: nowIso,
        status: HANDOVER_STATUS.PENDING_ACK,
        acknowledgedBy: null,
        acknowledgedAt: null,
        acknowledgementNotes: ''
      };

      setHandovers((prev) => [newHandover, ...prev]);

      if (taskId && taskId !== 'N/A') {
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              history: [
                {
                  id: `HIS-HND-${Date.now()}`,
                  event: 'Shift Handover Created',
                  details: `Handover logged for ${nextOwner} (${nextOwnerRole}). Actions: "${outstandingActions}"`,
                  timestamp: nowIso,
                  actor: `${SUPERVISOR_PROFILE.name} (Supervisor)`
                },
                ...t.history
              ]
            };
          })
        );
      }

      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now()}`,
          taskId: taskId || 'N/A',
          type: 'handover_pending',
          title: `Handover Created: ${newHandoverId}`,
          message: `Created for ${nextOwner}. Target SLA: ${new Date(newHandover.targetCompletionTime).toLocaleTimeString()}`,
          timestamp: nowIso,
          isRead: false,
          priority: 'medium',
          category: 'Handover'
        },
        ...prev
      ]);

      showToast(`Handover record ${newHandoverId} created for ${nextOwner}`, 'success');
      return newHandover;
    },
    [showToast]
  );

  const acknowledgeHandover = useCallback(
    (handoverId, { acknowledgementNotes = '', acknowledgedBy = '' }) => {
      const nowIso = new Date().toISOString();
      const ackUser = acknowledgedBy || SUPERVISOR_PROFILE.name;

      setHandovers((prev) =>
        prev.map((h) => {
          if (h.id !== handoverId) return h;
          return {
            ...h,
            status: HANDOVER_STATUS.ACKNOWLEDGED,
            acknowledgedBy: ackUser,
            acknowledgedAt: nowIso,
            acknowledgementNotes: acknowledgementNotes ? acknowledgementNotes.trim() : 'Confirmed shift briefing'
          };
        })
      );

      showToast(`Handover ${handoverId} acknowledged by ${ackUser}`, 'success');
    },
    [showToast]
  );

  // 6. Supervisor Escalation Workflow
  const escalateSupervisorTask = useCallback(
    (taskId, { escalationReason, severity = 'high', targetRole, nextAction, expectedResponseTime, notes }) => {
      const nowIso = new Date().toISOString();
      const isEmergency = severity === 'emergency' || severity === 'critical';

      const escalationInfo = {
        level: targetRole,
        escalatedTo: targetRole,
        escalatedAt: nowIso,
        escalatedBy: `${SUPERVISOR_PROFILE.name} (Supervisor)`,
        reason: escalationReason,
        severity,
        nextAction,
        expectedResponseTime,
        status: 'Escalated / Pending Review'
      };

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;

          const historyEntry = {
            id: `HIS-ESC-${Date.now()}`,
            event: isEmergency ? 'EMERGENCY PROTOCOL ESCALATION' : 'Task Escalated along Chain',
            details: `Escalated to ${targetRole} [${severity.toUpperCase()}]. Reason: ${escalationReason}.${
              nextAction ? ` Action: ${nextAction}` : ''
            }`,
            timestamp: nowIso,
            actor: `${SUPERVISOR_PROFILE.name} (Supervisor)`
          };

          return {
            ...t,
            priority: isEmergency ? 'urgent' : t.priority,
            escalationInfo,
            history: [historyEntry, ...t.history]
          };
        })
      );

      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now()}`,
          taskId,
          type: isEmergency ? 'emergency_security' : 'escalation',
          title: `${isEmergency ? 'EMERGENCY' : 'Escalation'}: ${taskId}`,
          message: `Escalated to ${targetRole}. Reason: ${escalationReason}`,
          timestamp: nowIso,
          isRead: false,
          priority: isEmergency ? 'urgent' : 'high',
          category: 'Escalation'
        },
        ...prev
      ]);

      showToast(
        isEmergency
          ? `EMERGENCY incident logged & dispatched to Security / GM immediately!`
          : `Task ${taskId} successfully escalated to ${targetRole}`,
        isEmergency ? 'error' : 'warning'
      );
    },
    [showToast]
  );

  // ==========================================
  // TASK FULFILLER WORKFLOWS & ACTIONS
  // ==========================================
  const fulfillTaskAction = useCallback(
    (taskId, action, payload = {}) => {
      const nowIso = new Date().toISOString();
      const actorName = `${FULFILLER_PROFILE.name} (Task Fulfiller)`;
      let toastMsg = '';
      let toastType = 'success';

      if (action === 'accept' || action === 'start') {
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id !== taskId) return t;
            const historyEntry = {
              id: `HIS-${Date.now()}`,
              event: 'Task Started',
              details: `Fulfiller accepted task and initiated service.`,
              timestamp: nowIso,
              actor: actorName,
              newValue: TASK_STATUS.IN_PROGRESS
            };
            return {
              ...t,
              status: TASK_STATUS.IN_PROGRESS,
              startedAt: t.startedAt || nowIso,
              history: [historyEntry, ...t.history]
            };
          })
        );
        toastMsg = `Task ${taskId} accepted & marked In Progress.`;
      } else if (action === 'on_the_way') {
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id !== taskId) return t;
            const historyEntry = {
              id: `HIS-${Date.now()}`,
              event: 'En Route',
              details: `Fulfiller marked On the Way to ${t.location}.`,
              timestamp: nowIso,
              actor: actorName,
              newValue: 'On the Way'
            };
            return {
              ...t,
              status: 'On the Way',
              history: [historyEntry, ...t.history]
            };
          })
        );
        toastMsg = `Task ${taskId} marked En Route (On the Way).`;
      } else if (action === 'complete') {
        const { confirmationNote = '', recipientType = 'Guest in Room', deliveredItems = '' } = payload;
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id !== taskId) return t;
            const historyEntry = {
              id: `HIS-${Date.now()}`,
              event: 'Task Completed',
              details: `Delivery/service confirmed (${recipientType}). ${confirmationNote ? `Note: "${confirmationNote}"` : ''}`,
              timestamp: nowIso,
              actor: actorName,
              newValue: TASK_STATUS.COMPLETED
            };
            return {
              ...t,
              status: TASK_STATUS.COMPLETED,
              completedAt: nowIso,
              deliveryConfirmation: {
                recipientType,
                confirmationNote,
                deliveredItems: deliveredItems || t.item,
                confirmedBy: actorName,
                confirmedAt: nowIso
              },
              history: [historyEntry, ...t.history]
            };
          })
        );
        toastMsg = `Task ${taskId} marked completed with verified delivery record.`;
      } else if (action === 'block') {
        const { reason = 'Operational Blocker', notes = '', severity = 'High', category = 'Maintenance' } = payload;
        createBlocker({
          taskId,
          category,
          description: reason,
          operationalImpact: notes || 'Delivery delayed due to operational blocker',
          responsiblePerson: FULFILLER_PROFILE.name,
          nextAction: 'Under review by floor supervisor',
          reportedBy: actorName,
          safetyRestricted: severity === 'Emergency'
        });
        return; // createBlocker displays toast and updates status to Blocked
      } else if (action === 'add_note') {
        const { note } = payload;
        if (!note || !note.trim()) return;
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id !== taskId) return t;
            const historyEntry = {
              id: `HIS-${Date.now()}`,
              event: 'Fulfiller Note Added',
              details: note.trim(),
              timestamp: nowIso,
              actor: actorName
            };
            return {
              ...t,
              internalNotes: t.internalNotes ? `${t.internalNotes}\n[${nowIso.slice(11, 16)}] ${note.trim()}` : note.trim(),
              history: [historyEntry, ...t.history]
            };
          })
        );
        toastMsg = `Progress note recorded on ${taskId}.`;
      } else if (action === 'claim') {
        assignTask(taskId, FULFILLER_PROFILE, 'Self-claimed by Fulfiller from eligible pool');
        return;
      }

      if (toastMsg) {
        showToast(toastMsg, toastType);
      }
    },
    [assignTask, createBlocker, showToast]
  );

  // ==========================================
  // DEPARTMENT MANAGER WORKFLOWS & ACTIONS
  // ==========================================


  // 1. Service-Recovery Approvals (Enforces Delegated Limit & Self-Approval Prevention)
  const approveRecoveryRequest = useCallback(
    (requestId, decisionReason = '') => {
      const request = recoveryRequests.find((r) => r.id === requestId);
      if (!request) {
        showToast('Service recovery request not found.', 'error');
        return false;
      }

      if (request.status !== RECOVERY_STATUS.PENDING) {
        showToast(`Request is already in "${request.status}" state. Duplicate action prevented.`, 'warning');
        return false;
      }

      // Check Delegated Authority Limit ($250.00 USD)
      if (Number(request.amount) > MANAGER_ROLE_INFO.delegatedApprovalLimit) {
        showToast(
          `AUTHORITY LIMIT EXCEEDED: Amount of $${request.amount.toFixed(
            2
          )} exceeds Manager limit ($${MANAGER_ROLE_INFO.delegatedApprovalLimit.toFixed(
            2
          )}). Request must be escalated to General Manager Marcus Sterling.`,
          'error',
          6000
        );
        return false;
      }

      // Prevent Self-Approval (If requester is Elena Rostova or matches manager ID)
      if (
        request.isSelfRequestedByManager ||
        request.requestingEmployee?.id === MANAGER_PROFILE.id ||
        request.requestingEmployee?.name?.includes('Elena Rostova')
      ) {
        showToast(
          'GOVERNANCE VIOLATION PREVENTED: You cannot approve your own service-recovery request. Independent approval by General Manager is strictly required.',
          'error',
          6000
        );
        return false;
      }

      if (!decisionReason || !decisionReason.trim()) {
        showToast('A formal managerial approval reason or policy note is required.', 'error');
        return false;
      }

      const nowIso = new Date().toISOString();
      const approverName = `${MANAGER_PROFILE.name} (${MANAGER_PROFILE.role})`;

      setRecoveryRequests((prev) =>
        prev.map((r) => {
          if (r.id !== requestId) return r;

          const historyEntry = {
            id: `RHIS-${Date.now()}`,
            timestamp: nowIso,
            actor: approverName,
            action: 'Approved within Delegated Authority',
            details: `Approved by Department Manager. Reason: "${decisionReason.trim()}". Forwarded to Front Desk folio adjustments.`
          };

          return {
            ...r,
            status: RECOVERY_STATUS.APPROVED,
            decidedAt: nowIso,
            decidedBy: approverName,
            decisionReason: decisionReason.trim(),
            history: [historyEntry, ...r.history]
          };
        })
      );

      // Create notification for requesting staff
      setNotifications((prev) => [
        {
          id: `MNOTIF-APPR-${Date.now()}`,
          taskId: request.taskId,
          complaintId: request.complaintId,
          type: 'approval_decision',
          title: `Recovery Request ${requestId} Approved`,
          message: `Manager Elena Rostova approved $${request.amount.toFixed(2)} (${request.requestType}) for ${request.guestReference}.`,
          timestamp: nowIso,
          isRead: false,
          priority: 'medium',
          category: 'Approvals'
        },
        ...prev
      ]);

      showToast(`Recovery request ${requestId} ($${request.amount.toFixed(2)}) approved successfully.`, 'success');
      return true;
    },
    [recoveryRequests, showToast]
  );

  const rejectRecoveryRequest = useCallback(
    (requestId, rejectionReason = '') => {
      const request = recoveryRequests.find((r) => r.id === requestId);
      if (!request) {
        showToast('Service recovery request not found.', 'error');
        return false;
      }

      if (!rejectionReason || !rejectionReason.trim()) {
        showToast('A rejection rationale is strictly required for the audit trail.', 'error');
        return false;
      }

      const nowIso = new Date().toISOString();
      const managerName = `${MANAGER_PROFILE.name} (${MANAGER_PROFILE.role})`;

      setRecoveryRequests((prev) =>
        prev.map((r) => {
          if (r.id !== requestId) return r;

          const historyEntry = {
            id: `RHIS-${Date.now()}`,
            timestamp: nowIso,
            actor: managerName,
            action: 'Request Rejected',
            details: `Rejected by Department Manager. Reason: "${rejectionReason.trim()}".`
          };

          return {
            ...r,
            status: RECOVERY_STATUS.REJECTED,
            decidedAt: nowIso,
            decidedBy: managerName,
            decisionReason: rejectionReason.trim(),
            history: [historyEntry, ...r.history]
          };
        })
      );

      setNotifications((prev) => [
        {
          id: `MNOTIF-REJ-${Date.now()}`,
          taskId: request.taskId,
          complaintId: request.complaintId,
          type: 'approval_decision',
          title: `Recovery Request ${requestId} Rejected`,
          message: `Manager Elena Rostova rejected request ${requestId}. Reason: ${rejectionReason}`,
          timestamp: nowIso,
          isRead: false,
          priority: 'medium',
          category: 'Approvals'
        },
        ...prev
      ]);

      showToast(`Recovery request ${requestId} marked as Rejected.`, 'warning');
      return true;
    },
    [recoveryRequests, showToast]
  );

  const escalateRecoveryRequest = useCallback(
    (requestId, { destination = 'General Manager (Marcus Sterling)', reason = '' }) => {
      const request = recoveryRequests.find((r) => r.id === requestId);
      if (!request) {
        showToast('Service recovery request not found.', 'error');
        return false;
      }

      const nowIso = new Date().toISOString();
      const managerName = `${MANAGER_PROFILE.name} (${MANAGER_PROFILE.role})`;

      setRecoveryRequests((prev) =>
        prev.map((r) => {
          if (r.id !== requestId) return r;

          const historyEntry = {
            id: `RHIS-${Date.now()}`,
            timestamp: nowIso,
            actor: managerName,
            action: 'Escalated to Executive Authority',
            details: `Escalated to ${destination}. Notes: "${reason || 'Amount exceeds manager approval authority'}".`
          };

          return {
            ...r,
            status: RECOVERY_STATUS.ESCALATED,
            decidedAt: nowIso,
            decidedBy: managerName,
            decisionReason: `Escalated to ${destination}: ${reason}`,
            history: [historyEntry, ...r.history]
          };
        })
      );

      setNotifications((prev) => [
        {
          id: `MNOTIF-ESC-${Date.now()}`,
          taskId: request.taskId,
          complaintId: request.complaintId,
          type: 'escalation',
          title: `Recovery Request ${requestId} Escalated`,
          message: `Escalated to ${destination} for executive review. Reason: ${reason}`,
          timestamp: nowIso,
          isRead: false,
          priority: 'urgent',
          category: 'Approvals'
        },
        ...prev
      ]);

      showToast(`Request ${requestId} escalated to ${destination}.`, 'info');
      return true;
    },
    [recoveryRequests, showToast]
  );

  const createRecoveryRequest = useCallback(
    (newRequest) => {
      const nextId = `REC-${Math.floor(510 + recoveryRequests.length + Math.random() * 20)}`;
      const nowIso = new Date().toISOString();

      const createdObj = {
        id: nextId,
        complaintId: newRequest.complaintId || null,
        taskId: newRequest.taskId || null,
        guestReference: newRequest.guestReference.trim(),
        requestingEmployee: {
          id: MANAGER_PROFILE.id,
          name: MANAGER_PROFILE.name,
          role: MANAGER_PROFILE.role
        },
        requestType: newRequest.requestType,
        proposedGesture: newRequest.proposedGesture.trim(),
        amount: Number(newRequest.amount) || 0,
        currency: 'USD',
        policyLimit: MANAGER_ROLE_INFO.delegatedApprovalLimit,
        isWithinManagerAuthority: Number(newRequest.amount) <= MANAGER_ROLE_INFO.delegatedApprovalLimit,
        isSelfRequestedByManager: true, // Manager created it, so self-approval check applies
        reason: newRequest.reason.trim(),
        supportingNotes: newRequest.supportingNotes ? newRequest.supportingNotes.trim() : '',
        status: RECOVERY_STATUS.PENDING,
        createdAt: nowIso,
        decidedAt: null,
        decidedBy: null,
        decisionReason: '',
        history: [
          {
            id: `RHIS-${Date.now()}`,
            timestamp: nowIso,
            actor: `${MANAGER_PROFILE.name} (${MANAGER_PROFILE.role})`,
            action: 'Request Drafted',
            details: `Created service recovery proposal for ${newRequest.guestReference}.`
          }
        ]
      };

      setRecoveryRequests((prev) => [createdObj, ...prev]);

      setNotifications((prev) => [
        {
          id: `MNOTIF-NEWREC-${Date.now()}`,
          taskId: createdObj.taskId,
          complaintId: createdObj.complaintId,
          type: 'approval_request',
          title: `New Service Recovery Request: ${nextId}`,
          message: `Proposed ${createdObj.requestType} ($${createdObj.amount.toFixed(2)}) for ${createdObj.guestReference}.`,
          timestamp: nowIso,
          isRead: false,
          priority: 'medium',
          category: 'Approvals'
        },
        ...prev
      ]);

      showToast(`Service recovery proposal ${nextId} submitted for review.`, 'success');
      return createdObj;
    },
    [recoveryRequests.length, showToast]
  );

  // 2. Complaint Coordination & Resolution Oversight
  const assignComplaintOwner = useCallback(
    (complaintId, ownerName, ownerId, note = '') => {
      const nowIso = new Date().toISOString();
      let updated = false;

      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id !== complaintId) return c;

          const prevOwner = c.owner || 'Unassigned';
          const historyEntry = {
            id: `CHIS-${Date.now()}`,
            timestamp: nowIso,
            actor: `${MANAGER_PROFILE.name} (Department Manager)`,
            action: 'Case Ownership Reassigned',
            details: `Manager reassigned case from "${prevOwner}" to "${ownerName}".${note ? ` Note: "${note}"` : ''}`
          };

          updated = true;
          return {
            ...c,
            owner: ownerName,
            ownerId: ownerId || c.ownerId,
            history: [historyEntry, ...c.history]
          };
        })
      );

      if (updated) {
        showToast(`Assigned complaint ${complaintId} to ${ownerName}.`, 'success');
        return true;
      }
      return false;
    },
    [showToast]
  );

  const updateComplaintStatus = useCallback(
    (complaintId, newStatus, note = '') => {
      const nowIso = new Date().toISOString();
      let updated = false;

      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id !== complaintId) return c;

          const historyEntry = {
            id: `CHIS-${Date.now()}`,
            timestamp: nowIso,
            actor: `${MANAGER_PROFILE.name} (Department Manager)`,
            action: `Status Updated to ${newStatus}`,
            details: `Manager updated case status to ${newStatus}.${note ? ` Details: "${note}"` : ''}`
          };

          updated = true;
          return {
            ...c,
            status: newStatus,
            resolutionNotes: newStatus === COMPLAINT_STATUS.RESOLVED ? note || c.notes : c.notes,
            history: [historyEntry, ...c.history]
          };
        })
      );

      if (updated) {
        showToast(`Complaint ${complaintId} status updated to "${newStatus}".`, 'info');
        return true;
      }
      return false;
    },
    [showToast]
  );

  const escalateComplaint = useCallback(
    (complaintId, { escalationTarget = 'Hotel Duty Manager', reason = '', isEmergency = false }) => {
      const nowIso = new Date().toISOString();
      let updated = false;

      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id !== complaintId) return c;

          const historyEntry = {
            id: `CHIS-${Date.now()}`,
            timestamp: nowIso,
            actor: `${MANAGER_PROFILE.name} (Department Manager)`,
            action: isEmergency ? 'EMERGENCY SAFETY ESCALATION' : `Escalated to ${escalationTarget}`,
            details: `Manager escalated case to ${escalationTarget}. Reason: "${reason}".`
          };

          updated = true;
          return {
            ...c,
            status: COMPLAINT_STATUS.ESCALATED,
            escalationState: isEmergency ? 'Emergency Security Protocol' : `Escalated: ${escalationTarget}`,
            isEmergency: isEmergency || c.isEmergency,
            severity: isEmergency ? COMPLAINT_SEVERITY.CRITICAL : c.severity,
            history: [historyEntry, ...c.history]
          };
        })
      );

      if (updated) {
        setNotifications((prev) => [
          {
            id: `MNOTIF-CMPESC-${Date.now()}`,
            taskId: null,
            complaintId,
            type: isEmergency ? 'emergency_security' : 'escalation',
            title: `${isEmergency ? 'EMERGENCY PROTOCOL' : 'Escalation'}: Case ${complaintId}`,
            message: `Escalated to ${escalationTarget}. Reason: ${reason}`,
            timestamp: nowIso,
            isRead: false,
            priority: isEmergency ? 'urgent' : 'high',
            category: 'Complaint'
          },
          ...prev
        ]);

        showToast(
          isEmergency
            ? `EMERGENCY protocol active: Safety & Security dispatched immediately!`
            : `Complaint ${complaintId} escalated to ${escalationTarget}.`,
          isEmergency ? 'error' : 'warning'
        );
        return true;
      }
      return false;
    },
    [showToast]
  );

  // 3. Staffing & Scheduling Oversight (With Shift Conflict Validation)
  const updateStaffSchedule = useCallback(
    (staffId, day, newShiftId, reason = '') => {
      const staffMember = staffList.find((s) => s.id === staffId);
      if (!staffMember) {
        showToast('Staff member not found in department roster.', 'error');
        return false;
      }

      if (!reason || !reason.trim()) {
        showToast('A schedule change justification is strictly required for the audit log.', 'error');
        return false;
      }

      const nowIso = new Date().toISOString();
      const managerName = `${MANAGER_PROFILE.name} (Department Manager)`;

      // Map shift id to readable label & hours
      let shiftLabel = 'Scheduled Off';
      let shiftHours = 'Off Duty';
      let shiftCode = 'OFF';

      if (newShiftId === 'morning') {
        shiftLabel = 'Morning Shift';
        shiftHours = '07:00 – 15:30';
        shiftCode = 'AM';
      } else if (newShiftId === 'day') {
        shiftLabel = 'Day Shift';
        shiftHours = '08:00 – 16:30';
        shiftCode = 'DAY';
      } else if (newShiftId === 'evening') {
        shiftLabel = 'Evening Shift';
        shiftHours = '15:00 – 23:30';
        shiftCode = 'PM';
      } else if (newShiftId === 'night') {
        shiftLabel = 'Night Audit / Turn';
        shiftHours = '23:00 – 07:30';
        shiftCode = 'NT';
      }

      let conflictWarning = null;
      if (newShiftId === 'night') {
        conflictWarning = 'Night shift assigned. Ensure mandatory 11-hour rest before next scheduled shift.';
      }

      setStaffSchedules((prev) =>
        prev.map((item) => {
          if (item.staffId !== staffId) return item;

          const prevShift = item.weeklySchedule[day] || { shift: 'off', hours: 'Off Duty' };

          return {
            ...item,
            conflictFlag: conflictWarning,
            weeklySchedule: {
              ...item.weeklySchedule,
              [day]: {
                shift: newShiftId,
                hours: shiftHours,
                status: newShiftId === 'off' ? 'Scheduled Off' : 'Scheduled',
                lastModified: nowIso,
                modifiedBy: managerName,
                changeReason: reason.trim(),
                previousShift: prevShift.shift
              }
            }
          };
        })
      );

      // Notification
      setNotifications((prev) => [
        {
          id: `MNOTIF-SCH-${Date.now()}`,
          taskId: null,
          complaintId: null,
          type: 'staffing_change',
          title: `Schedule Updated: ${staffMember.name}`,
          message: `${day} shift changed to ${shiftLabel} (${shiftHours}). Reason: ${reason}`,
          timestamp: nowIso,
          isRead: false,
          priority: conflictWarning ? 'high' : 'medium',
          category: 'Staffing'
        },
        ...prev
      ]);

      showToast(
        `Updated ${day} schedule for ${staffMember.name} to ${shiftLabel}.${
          conflictWarning ? ` Note: ${conflictWarning}` : ''
        }`,
        conflictWarning ? 'warning' : 'success'
      );
      return true;
    },
    [staffList, showToast]
  );

  // 4. Department Manager Operational Task Intervention
  const managerInterveneTask = useCallback(
    (taskId, { actionType = 'reassign', newAssigneeId = null, priorityChange = null, managerNote = '' }) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) {
        showToast('Task not found.', 'error');
        return false;
      }

      if (!managerNote || !managerNote.trim()) {
        showToast('A managerial directive or intervention note is required.', 'error');
        return false;
      }

      const nowIso = new Date().toISOString();
      const managerName = `${MANAGER_PROFILE.name} (Department Manager)`;

      let newAssigneeObj = task.assignedTo;
      if (newAssigneeId) {
        const foundStaff = staffList.find((s) => s.id === newAssigneeId);
        if (foundStaff) {
          newAssigneeObj = {
            id: foundStaff.id,
            name: foundStaff.name,
            shift: foundStaff.shift
          };
        }
      }

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;

          const historyEntry = {
            id: `HIS-MGR-${Date.now()}`,
            event: 'Manager Operational Intervention',
            details: `Manager Elena Rostova intervened [${actionType}]: "${managerNote.trim()}".${
              newAssigneeId ? ` Reassigned to ${newAssigneeObj?.name}.` : ''
            }${priorityChange ? ` Priority set to ${priorityChange}.` : ''}`,
            timestamp: nowIso,
            actor: managerName
          };

          return {
            ...t,
            priority: priorityChange || t.priority,
            assignedTo: newAssigneeObj,
            internalNotes: `${t.internalNotes ? t.internalNotes + ' | ' : ''}Manager Directive: ${managerNote.trim()}`,
            history: [historyEntry, ...t.history]
          };
        })
      );

      setNotifications((prev) => [
        {
          id: `MNOTIF-INT-${Date.now()}`,
          taskId,
          type: 'manager_intervention',
          title: `Manager Intervened on ${taskId}`,
          message: `${managerNote.trim()} (Action: ${actionType})`,
          timestamp: nowIso,
          isRead: false,
          priority: 'high',
          category: 'Intervention'
        },
        ...prev
      ]);

      showToast(`Manager intervention recorded for ${taskId}.`, 'success');
      return true;
    },
    [tasks, staffList, showToast]
  );

  // 5. Configurable SLA Thresholds
  const updateSlaConfig = useCallback(
    (newConfig) => {
      setSlaConfig((prev) => ({
        ...prev,
        ...newConfig
      }));
      showToast('Department SLA thresholds updated successfully.', 'info');
    },
    [showToast]
  );

  // Notification management
  const markNotificationAsRead = useCallback((notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'info');
  }, [showToast]);

  const deleteNotification = useCallback((notifId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  }, []);

  // Clean Reset State
  const resetToMockData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_TASKS);
    localStorage.removeItem(STORAGE_KEY_STAFF);
    localStorage.removeItem(STORAGE_KEY_NOTIFS);
    localStorage.removeItem(STORAGE_KEY_BLOCKERS);
    localStorage.removeItem(STORAGE_KEY_CORRECTIVE);
    localStorage.removeItem(STORAGE_KEY_HANDOVERS);
    localStorage.removeItem(STORAGE_KEY_THRESHOLDS);
    localStorage.removeItem(STORAGE_KEY_COMPLAINTS);
    localStorage.removeItem(STORAGE_KEY_RECOVERIES);
    localStorage.removeItem(STORAGE_KEY_SCHEDULES);
    localStorage.removeItem(STORAGE_KEY_SLACONFIG);
    localStorage.removeItem(STORAGE_KEY_ROOMS);
    localStorage.removeItem(STORAGE_KEY_RESERVATIONS);
    localStorage.removeItem(STORAGE_KEY_ROOM_MOVES);
    localStorage.removeItem(STORAGE_KEY_WAKE_UP_CALLS);
    localStorage.removeItem(STORAGE_KEY_GUEST_COMMS);
    localStorage.removeItem(STORAGE_KEY_FOLIOS);
    localStorage.removeItem(STORAGE_KEY_FRONTDESK_PROFILE);

    localStorage.removeItem(STORAGE_KEY_FINANCE_PROFILE);
    localStorage.removeItem(STORAGE_KEY_FINANCE_TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEY_REFUND_REQUESTS);
    localStorage.removeItem(STORAGE_KEY_RECONCILIATION_BATCHES);
    localStorage.removeItem(STORAGE_KEY_DISCREPANCIES);
    localStorage.removeItem(STORAGE_KEY_FINANCE_AUDIT);
    localStorage.removeItem(STORAGE_KEY_FINANCE_NOTIFICATIONS);

    setTasks(INITIAL_TASKS);
    setStaffList(INITIAL_STAFF);
    setNotifications([
      ...INITIAL_FRONTDESK_NOTIFICATIONS,
      ...INITIAL_MANAGER_NOTIFICATIONS,
      ...INITIAL_SUPERVISOR_NOTIFICATIONS,
      ...INITIAL_NOTIFICATIONS
    ]);
    setBlockers(INITIAL_BLOCKERS);
    setCorrectiveActions(INITIAL_CORRECTIVE_ACTIONS);
    setHandovers(INITIAL_HANDOVERS);
    setWorkloadThresholds(DEFAULT_WORKLOAD_THRESHOLDS);
    setComplaints(INITIAL_COMPLAINTS);
    setRecoveryRequests(INITIAL_RECOVERY_REQUESTS);
    setStaffSchedules(INITIAL_STAFF_SCHEDULES);
    setSlaConfig(DEFAULT_SLA_CONFIG);
    setRooms(INITIAL_ROOMS);
    setReservations(INITIAL_RESERVATIONS);
    setRoomMoves(INITIAL_ROOM_MOVES);
    setWakeUpCalls(INITIAL_WAKE_UP_CALLS);
    setGuestCommunications(INITIAL_GUEST_COMMUNICATIONS);
    setFolios(INITIAL_FOLIOS);
    setFrontDeskProfile(FRONTDESK_PROFILE);

    setFinanceProfile(FINANCE_PROFILE);
    setFinancialTransactions(INITIAL_FINANCIAL_TRANSACTIONS);
    setRefundRequests(INITIAL_REFUND_REQUESTS);
    setReconciliationBatches(INITIAL_RECONCILIATION_BATCHES);
    setFinancialDiscrepancies(INITIAL_FINANCIAL_DISCREPANCIES);
    setFinancialAuditLogs(INITIAL_FINANCIAL_AUDIT_LOGS);
    setFinancialNotifications(INITIAL_FINANCIAL_NOTIFICATIONS);

    // Platform Admin & Executive storage keys removal
    localStorage.removeItem(STORAGE_KEY_PLATFORM_USERS);
    localStorage.removeItem(STORAGE_KEY_SYSTEM_CONFIG);
    localStorage.removeItem(STORAGE_KEY_INTEGRATIONS);
    localStorage.removeItem(STORAGE_KEY_ADMIN_AUDIT);
    localStorage.removeItem(STORAGE_KEY_BACKUPS);
    localStorage.removeItem(STORAGE_KEY_EXECUTIVE_POLICY);
    localStorage.removeItem(STORAGE_KEY_EXECUTIVE_ACCESS_CERT);
    localStorage.removeItem(STORAGE_KEY_EXECUTIVE_COMPLIANCE);
    localStorage.removeItem(STORAGE_KEY_EXECUTIVE_NOTIFS);

    setPlatformUsers(INITIAL_PLATFORM_USERS);
    setSystemConfig(INITIAL_SYSTEM_CONFIG);
    setIntegrations(INITIAL_INTEGRATIONS);
    setAdminAuditLogs(INITIAL_ADMIN_AUDIT_LOGS);
    setBackups(INITIAL_BACKUPS);
    setPolicyReviews(INITIAL_POLICY_REVIEWS);
    setAccessCertifications(INITIAL_ACCESS_CERTIFICATIONS);
    setComplianceActions(INITIAL_COMPLIANCE_ACTIONS);
    setExecutiveNotifications(INITIAL_EXECUTIVE_NOTIFICATIONS);

    showToast('Reset workspace state to clean demo baseline', 'info');
  }, [showToast]);


  // ==========================================
  // FRONT DESK COORDINATOR - COMPUTED METRICS
  // ==========================================
  const frontDeskMetrics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    // Today's arrivals: confirmed reservations arriving today (or today and not yet checked in)
    const arrivalsToday = reservations.filter(
      (r) => r.arrivalDate === today && r.status === RESERVATION_STATUS.CONFIRMED
    );

    // Today's departures: currently checked-in reservations departing today
    const departuresToday = reservations.filter(
      (r) => r.departureDate === today && r.status === RESERVATION_STATUS.CHECKED_IN
    );

    // In-house stays
    const inHouseStays = reservations.filter(
      (r) => r.status === RESERVATION_STATUS.CHECKED_IN
    );

    // Total in-house guest headcount
    const totalInHouseGuests = inHouseStays.reduce(
      (sum, r) => sum + (Number(r.adults) || 1) + (Number(r.children) || 0),
      0
    );

    // Open guest requests (all department tasks active)
    const openRequests = tasks.filter(
      (t) => t.status !== TASK_STATUS.COMPLETED && t.status !== TASK_STATUS.CANCELLED
    );

    // Unassigned requests queue (explicit unassigned state)
    const unassignedRequests = tasks.filter(
      (t) => (!t.assignedTo || !t.assignedTo.id) && t.status !== TASK_STATUS.COMPLETED && t.status !== TASK_STATUS.CANCELLED
    );

    // Overdue requests
    const overdueRequests = tasks.filter(
      (t) => isOverdue(t.dueAt, t.status) && t.status !== TASK_STATUS.COMPLETED
    );

    // Unresolved complaints
    const unresolvedComplaints = complaints.filter(
      (c) => c.status !== COMPLAINT_STATUS.RESOLVED && c.status !== 'Closed'
    );

    // Escalated or critical cases
    const escalatedOrOverdueCases = complaints.filter(
      (c) => c.status === COMPLAINT_STATUS.ESCALATED || c.severity === 'critical'
    );

    // Upcoming wake-up calls today
    const upcomingWakeUpCalls = wakeUpCalls.filter(
      (w) => w.scheduledDate === today && (w.status === WAKE_UP_STATUS.SCHEDULED || w.status === WAKE_UP_STATUS.IN_PROGRESS)
    );

    // Active room moves
    const activeMoves = roomMoves.filter(
      (m) => m.status === ROOM_MOVE_STATUS.REQUESTED || m.status === ROOM_MOVE_STATUS.APPROVED || m.status === ROOM_MOVE_STATUS.IN_PROGRESS
    );

    // Room metrics
    const totalRooms = rooms.length || 1;
    const occupiedRooms = rooms.filter((r) => r.occupancy === OCCUPANCY_STATUS.OCCUPIED).length;
    const vacantReadyRooms = rooms.filter((r) => r.occupancy === OCCUPANCY_STATUS.VACANT && r.cleanliness === ROOM_STATUS.READY).length;
    const dirtyRooms = rooms.filter((r) => r.cleanliness === ROOM_STATUS.DIRTY).length;
    const cleaningRooms = rooms.filter((r) => r.cleanliness === ROOM_STATUS.CLEANING).length;
    const maintenanceRooms = rooms.filter((r) => r.cleanliness === ROOM_STATUS.MAINTENANCE).length;
    const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

    return {
      today,
      arrivalsCount: arrivalsToday.length,
      arrivalsList: arrivalsToday,
      departuresCount: departuresToday.length,
      departuresList: departuresToday,
      inHouseStaysCount: inHouseStays.length,
      inHouseStaysList: inHouseStays,
      totalInHouseGuests,
      openRequestsCount: openRequests.length,
      openRequestsList: openRequests,
      unassignedRequestsCount: unassignedRequests.length,
      unassignedRequestsList: unassignedRequests,
      overdueRequestsCount: overdueRequests.length,
      overdueRequestsList: overdueRequests,
      unresolvedComplaintsCount: unresolvedComplaints.length,
      unresolvedComplaintsList: unresolvedComplaints,
      escalatedCasesCount: escalatedOrOverdueCases.length,
      escalatedCasesList: escalatedOrOverdueCases,
      upcomingWakeUpCallsCount: upcomingWakeUpCalls.length,
      upcomingWakeUpCallsList: upcomingWakeUpCalls,
      activeMovesCount: activeMoves.length,
      activeMovesList: activeMoves,
      totalRooms,
      occupiedRooms,
      vacantReadyRooms,
      dirtyRooms,
      cleaningRooms,
      maintenanceRooms,
      occupancyRate
    };
  }, [reservations, tasks, complaints, wakeUpCalls, roomMoves, rooms]);

  // ==========================================
  // FRONT DESK COORDINATOR - OPERATIONS
  // ==========================================

  // 1. Create Reservation
  const createReservation = useCallback((reservationData) => {
    const newId = `RES-${Math.floor(8050 + Math.random() * 950)}`;
    const newRef = `SO-${Math.floor(8050 + Math.random() * 950)}`;
    const nowIso = new Date().toISOString();

    const newReservation = {
      id: newId,
      reference: newRef,
      guestName: reservationData.guestName.trim(),
      email: reservationData.email?.trim() || '',
      phone: reservationData.phone?.trim() || '',
      vipStatus: reservationData.vipStatus || 'Regular',
      arrivalDate: reservationData.arrivalDate,
      departureDate: reservationData.departureDate,
      nights: Number(reservationData.nights) || 1,
      adults: Number(reservationData.adults) || 1,
      children: Number(reservationData.children) || 0,
      roomType: reservationData.roomType,
      assignedRoom: reservationData.assignedRoom || null,
      status: RESERVATION_STATUS.CONFIRMED,
      identityVerified: false,
      idDocument: null,
      specialRequests: reservationData.specialRequests?.trim() || 'None',
      estimatedArrivalTime: reservationData.estimatedArrivalTime || '15:00',
      checkInTimestamp: null,
      checkInActor: null,
      checkOutTimestamp: null,
      checkOutActor: null,
      folioBalance: 0.0,
      paymentMethod: reservationData.paymentMethod || {
        brand: 'Visa',
        last4: '4812',
        holder: reservationData.guestName.trim(),
        exp: '12/28'
      },
      registrationSigned: false,
      keyCardsIssued: 0,
      notes: reservationData.notes?.trim() || '',
      auditLog: [
        {
          timestamp: nowIso,
          actor: `${frontDeskProfile.name} (Front Desk)`,
          event: 'Reservation Created',
          details: `Created reservation ${newRef} for ${reservationData.guestName}. Room type: ${reservationData.roomType}.`
        }
      ]
    };

    setReservations((prev) => [newReservation, ...prev]);

    // Also initialize an empty folio
    const newFolio = {
      folioId: `FOL-${newId.replace('RES-', '')}`,
      reservationId: newId,
      guestName: newReservation.guestName,
      roomNumber: newReservation.assignedRoom || 'Unassigned',
      status: 'Open',
      charges: [],
      payments: [],
      refunds: [],
      balance: 0.0
    };
    setFolios((prev) => [newFolio, ...prev]);

    showToast(`Created reservation ${newRef} for ${newReservation.guestName}.`, 'success');
    return { success: true, reservation: newReservation };
  }, [frontDeskProfile, showToast]);

  // 2. Update Reservation
  const updateReservation = useCallback((reservationId, updates) => {
    const nowIso = new Date().toISOString();
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id !== reservationId) return r;
        const newAudit = {
          timestamp: nowIso,
          actor: `${frontDeskProfile.name} (Front Desk)`,
          event: 'Reservation Updated',
          details: updates.auditNote || 'Reservation details modified.'
        };
        return {
          ...r,
          ...updates,
          auditLog: [newAudit, ...(r.auditLog || [])]
        };
      })
    );
    showToast(`Reservation updated successfully.`, 'info');
  }, [frontDeskProfile, showToast]);

  // 3. Perform Check-In Workflow (Enforces Identity Verification & Room Cleanliness Clearance)
  const performCheckIn = useCallback(({
    reservationId,
    idType,
    idNumber,
    issuingCountry,
    specialRequests,
    keyCardsIssued = 2,
    targetRoomNumber
  }) => {
    const reservation = reservations.find((r) => r.id === reservationId);
    if (!reservation) {
      showToast('Reservation not found.', 'error');
      return { success: false, error: 'Reservation record not found.' };
    }

    if (reservation.status === RESERVATION_STATUS.CHECKED_IN) {
      showToast('Guest is already checked in.', 'warning');
      return { success: false, error: 'Guest is already checked in.' };
    }

    // MANDATORY ID CHECK
    if (!idType || !idNumber || !idNumber.trim()) {
      showToast('Identity verification failed: ID Type and Number are strictly required.', 'error');
      return {
        success: false,
        error: 'Mandatory Guest Identity Verification required. Record valid ID document before checking in.'
      };
    }

    // ROOM READINESS CHECK
    const roomToAssign = targetRoomNumber || reservation.assignedRoom;
    if (!roomToAssign) {
      showToast('Check-in blocked: No room assigned to reservation.', 'error');
      return { success: false, error: 'No room assigned. Please select an available room.' };
    }

    const roomObj = rooms.find((r) => r.roomNumber === roomToAssign);
    if (!roomObj) {
      showToast(`Room ${roomToAssign} not found in inventory.`, 'error');
      return { success: false, error: `Room ${roomToAssign} does not exist in inventory.` };
    }

    // RESTRICTION: Block check-in to uncleared / dirty / maintenance locked rooms!
    if (roomObj.cleanliness !== ROOM_STATUS.READY) {
      const errMsg = `Check-in BLOCKED: Room ${roomToAssign} is currently "${roomObj.cleanliness}". Only rooms verified as "Ready / Clean & Inspected" can be occupied.`;
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }

    // RESTRICTION: Block check-in to already occupied rooms
    if (roomObj.occupancy === OCCUPANCY_STATUS.OCCUPIED) {
      const errMsg = `Check-in BLOCKED: Room ${roomToAssign} is currently occupied by another guest.`;
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }

    const nowIso = new Date().toISOString();
    const actorStr = `${frontDeskProfile.id} (${frontDeskProfile.name})`;

    // 1. Update Reservation to CHECKED_IN
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id !== reservationId) return r;
        return {
          ...r,
          status: RESERVATION_STATUS.CHECKED_IN,
          assignedRoom: roomToAssign,
          identityVerified: true,
          idDocument: {
            type: idType,
            number: idNumber.trim(),
            issuingCountry: issuingCountry || 'USA',
            verifiedAt: nowIso,
            verifiedBy: actorStr
          },
          checkInTimestamp: nowIso,
          checkInActor: actorStr,
          keyCardsIssued: Number(keyCardsIssued) || 2,
          registrationSigned: true,
          specialRequests: specialRequests ? specialRequests.trim() : r.specialRequests,
          auditLog: [
            {
              timestamp: nowIso,
              actor: `${frontDeskProfile.name} (Front Desk)`,
              event: 'Guest Checked In',
              details: `Identity verified (${idType} ${idNumber.trim()}). Cleared room ${roomToAssign} assigned and ${keyCardsIssued} key cards issued.`
            },
            ...(r.auditLog || [])
          ]
        };
      })
    );

    // 2. Update Room Status to OCCUPIED
    setRooms((prev) =>
      prev.map((rm) => {
        if (rm.roomNumber === roomToAssign) {
          return {
            ...rm,
            occupancy: OCCUPANCY_STATUS.OCCUPIED,
            currentReservationId: reservationId,
            guestName: reservation.guestName
          };
        }
        return rm;
      })
    );

    // 3. Update Folio room number if unassigned
    setFolios((prev) =>
      prev.map((f) => {
        if (f.reservationId === reservationId) {
          return { ...f, roomNumber: roomToAssign };
        }
        return f;
      })
    );

    // 4. Add notification
    const checkInNotif = {
      id: `FNOT-${Date.now()}`,
      type: 'arrival',
      title: `Checked In: ${reservation.guestName} (${roomToAssign})`,
      message: `Verified check-in completed by ${frontDeskProfile.name}. Room ${roomToAssign} occupied.`,
      timestamp: nowIso,
      read: false,
      priority: 'low',
      actionRoute: '/frontdesk/reservations'
    };
    setNotifications((prev) => [checkInNotif, ...prev]);

    showToast(`Checked in ${reservation.guestName} to Room ${roomToAssign} successfully!`, 'success');
    return { success: true };
  }, [reservations, rooms, frontDeskProfile, showToast]);

  // 4. Perform Check-Out Workflow (Triggers Housekeeping Turnover Task)
  const performCheckOut = useCallback(({
    reservationId,
    keyCardsReturned = true,
    settlementNotes = ''
  }) => {
    const reservation = reservations.find((r) => r.id === reservationId);
    if (!reservation) {
      showToast('Reservation not found.', 'error');
      return { success: false, error: 'Reservation record not found.' };
    }

    if (reservation.status !== RESERVATION_STATUS.CHECKED_IN) {
      showToast('Guest is not currently checked in.', 'warning');
      return { success: false, error: 'Only in-house stays can be checked out.' };
    }

    const roomNumber = reservation.assignedRoom;
    const nowIso = new Date().toISOString();
    const actorStr = `${frontDeskProfile.id} (${frontDeskProfile.name})`;

    // 1. Update Reservation to CHECKED_OUT
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id !== reservationId) return r;
        return {
          ...r,
          status: RESERVATION_STATUS.CHECKED_OUT,
          checkOutTimestamp: nowIso,
          checkOutActor: actorStr,
          auditLog: [
            {
              timestamp: nowIso,
              actor: `${frontDeskProfile.name} (Front Desk)`,
              event: 'Guest Checked Out',
              details: `Check-out finalized. Key cards returned: ${keyCardsReturned ? 'Yes' : 'Pending'}. Turnover task dispatched. ${settlementNotes}`
            },
            ...(r.auditLog || [])
          ]
        };
      })
    );

    // 2. Free Room & Mark as DIRTY / Turnover Required (NEVER mark room clean on check-out!)
    if (roomNumber) {
      setRooms((prev) =>
        prev.map((rm) => {
          if (rm.roomNumber === roomNumber) {
            return {
              ...rm,
              occupancy: OCCUPANCY_STATUS.VACANT,
              cleanliness: ROOM_STATUS.DIRTY, // Requires Housekeeping turnover
              currentReservationId: null,
              guestName: null
            };
          }
          return rm;
        })
      );

      // 3. AUTOMATICALLY DISPATCH HOUSEKEEPING TURNOVER TASK IN CENTRAL TASK SYSTEM
      const turnoverTaskId = `TSK-${Math.floor(2000 + Math.random() * 8000)}`;
      const turnoverTask = {
        id: turnoverTaskId,
        title: `Room Turnover Cleaning & Inspection — Room ${roomNumber}`,
        category: TASK_CATEGORY.HOUSEKEEPING,
        location: `Room ${roomNumber}`,
        item: 'Full Room Turnover Sanitization & Linen Refresh',
        quantity: 1,
        priority: TASK_PRIORITY.HIGH,
        status: TASK_STATUS.NEW, // Explicitly unassigned in queue
        assignedTo: null, // Preserved unassigned for dispatcher/supervisor queue
        createdAt: nowIso,
        dueAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(), // 90 min turnaround target
        scheduledStart: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        completedAt: null,
        guestUpdateRequired: false,
        inspectionRequired: true,
        inspectionStatus: INSPECTION_STATUS.PENDING_REVIEW,
        instructions: `Guest ${reservation.guestName} checked out. Strip and sanitize bed linens, disinfect bathroom, restock guest amenities, and request supervisor inspection before clearing for next arrival.`,
        internalNotes: `Auto-generated by Front Desk check-out workflow for reservation ${reservation.reference}. Staff: ${frontDeskProfile.name}.`,
        guestCommunicationHistory: [],
        history: [
          {
            id: `HIS-${Date.now()}`,
            event: 'Task Created',
            details: `Auto-dispatched on guest check-out from Room ${roomNumber}.`,
            timestamp: nowIso,
            actor: `${frontDeskProfile.name} (Front Desk Coordinator)`
          }
        ]
      };

      setTasks((prev) => [turnoverTask, ...prev]);

      // 4. Dispatch notification
      const checkoutNotif = {
        id: `FNOT-${Date.now()}`,
        type: 'departure',
        title: `Check-out: ${reservation.guestName} (Room ${roomNumber})`,
        message: `Turnover task ${turnoverTaskId} dispatched to Housekeeping queue. Room set to Dirty.`,
        timestamp: nowIso,
        read: false,
        priority: 'medium',
        actionRoute: '/frontdesk/check-out'
      };
      setNotifications((prev) => [checkoutNotif, ...prev]);
    }

    showToast(`Checked out ${reservation.guestName}. Room ${roomNumber || ''} marked Dirty and turnover task dispatched.`, 'success');
    return { success: true };
  }, [reservations, frontDeskProfile, showToast]);

  // 5. Create Guest Request (Routes to Department, Supports Unassigned Queue)
  const createFrontDeskGuestRequest = useCallback(({
    guestReference,
    roomNumber,
    category,
    description,
    priority = TASK_PRIORITY.MEDIUM,
    assignedToStaffId = null,
    instructions = '',
    internalNotes = '',
    guestVisibleMessage = '',
    deadlineMinutes = 60
  }) => {
    const newTaskId = `TSK-${Math.floor(3000 + Math.random() * 7000)}`;
    const nowIso = new Date().toISOString();
    const dueIso = new Date(Date.now() + (Number(deadlineMinutes) || 60) * 60 * 1000).toISOString();

    let assignedStaffObj = null;
    let workStatus = TASK_STATUS.NEW;

    if (assignedToStaffId) {
      const staffMember = staffList.find((s) => s.id === assignedToStaffId);
      if (staffMember) {
        assignedStaffObj = {
          id: staffMember.id,
          name: staffMember.name,
          shift: staffMember.shift
        };
        workStatus = TASK_STATUS.ASSIGNED;
      }
    }

    const newTask = {
      id: newTaskId,
      title: description.trim(),
      category: category || TASK_CATEGORY.HOUSEKEEPING,
      location: roomNumber ? `Room ${roomNumber}` : 'Front Desk / Lobby',
      item: description.trim(),
      quantity: 1,
      priority: priority,
      status: workStatus,
      assignedTo: assignedStaffObj, // Can be null (unassigned state)
      createdAt: nowIso,
      dueAt: dueIso,
      scheduledStart: nowIso,
      completedAt: null,
      guestUpdateRequired: Boolean(guestVisibleMessage),
      inspectionRequired: false,
      inspectionStatus: INSPECTION_STATUS.NOT_REQUIRED,
      instructions: instructions?.trim() || description.trim(),
      internalNotes: `Guest: ${guestReference || 'In-House Guest'}. ${internalNotes?.trim() || ''}`,
      guestVisibleNote: guestVisibleMessage?.trim() || '',
      guestCommunicationHistory: guestVisibleMessage
        ? [
            {
              id: `GCOM-${Date.now()}`,
              timestamp: nowIso,
              actor: `${frontDeskProfile.name} (Front Desk)`,
              summary: guestVisibleMessage.trim()
            }
          ]
        : [],
      history: [
        {
          id: `HIS-${Date.now()}`,
          event: 'Task Created',
          details: `Front Desk created request for ${guestReference || 'Guest'}. Category: ${category}.${
            assignedStaffObj ? ` Assigned to ${assignedStaffObj.name}.` : ' Placed in Unassigned Queue.'
          }`,
          timestamp: nowIso,
          actor: `${frontDeskProfile.name} (Front Desk Coordinator)`
        }
      ]
    };

    setTasks((prev) => [newTask, ...prev]);

    // Log to guest communications if message provided
    if (guestVisibleMessage) {
      const commEntry = {
        id: `GCOM-${Date.now()}`,
        reservationId: null,
        guestName: guestReference || 'In-House Guest',
        roomNumber: roomNumber || 'N/A',
        channel: 'In-App Concierge',
        direction: 'Outbound',
        category: 'Service Request Acknowledgement',
        message: guestVisibleMessage.trim(),
        timestamp: nowIso,
        status: 'Delivered (Simulated Gateway)',
        actor: `${frontDeskProfile.name} (Front Desk)`,
        linkedRequestId: newTaskId,
        linkedComplaintId: null
      };
      setGuestCommunications((prev) => [commEntry, ...prev]);
    }

    showToast(`Created guest request ${newTaskId} (${assignedStaffObj ? 'Assigned' : 'Unassigned Queue'}).`, 'success');
    return { success: true, taskId: newTaskId };
  }, [staffList, frontDeskProfile, showToast]);

  // 6. Create Guest Complaint / Case (Routes to Manager/Supervisor & Links to Service Recovery)
  const createFrontDeskCase = useCallback(({
    guestReference,
    roomNumber,
    category,
    severity = 'medium',
    description,
    ownerId = null,
    nextAction = '',
    internalNotes = '',
    guestVisibleMessage = '',
    recoveryAmount = 0,
    recoveryReason = '',
    recoveryType = 'Dining / Beverage Credit'
  }) => {
    const newCaseId = `CMP-${Math.floor(820 + Math.random() * 180)}`;
    const nowIso = new Date().toISOString();
    const resDeadline = new Date(Date.now() + (severity === 'critical' ? 20 : severity === 'high' ? 45 : 90) * 60 * 1000).toISOString();

    let ownerName = `${frontDeskProfile.name} (Front Desk)`;
    let finalOwnerId = frontDeskProfile.id;

    if (ownerId) {
      const foundStaff = staffList.find((s) => s.id === ownerId);
      if (foundStaff) {
        ownerName = `${foundStaff.name} (${foundStaff.role})`;
        finalOwnerId = foundStaff.id;
      }
    }

    const newComplaint = {
      id: newCaseId,
      guestReference: guestReference.trim(),
      roomNumber: roomNumber ? `Room ${roomNumber}` : 'Hotel Property',
      category: category.trim(),
      severity: severity,
      department: 'Front Office & Guest Services',
      owner: ownerName,
      ownerId: finalOwnerId,
      status: COMPLAINT_STATUS.OPEN,
      createdAt: nowIso,
      responseDeadline: resDeadline,
      resolutionDeadline: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      timeOpenDisplay: 'Just Now',
      lastGuestUpdate: guestVisibleMessage
        ? {
            timestamp: nowIso,
            by: `${frontDeskProfile.name} (Front Desk)`,
            summary: guestVisibleMessage.trim()
          }
        : null,
      nextAction: nextAction?.trim() || 'Acknowledge guest and investigate root cause.',
      relatedTaskId: null,
      escalationState: severity === 'critical' ? 'Escalated to Duty Manager' : 'None',
      guestVisibleNote: guestVisibleMessage?.trim() || '',
      internalNotes: internalNotes?.trim() || description.trim(),
      recoveryRequested: Number(recoveryAmount) > 0,
      history: [
        {
          timestamp: nowIso,
          actor: `${frontDeskProfile.name} (Front Desk)`,
          action: 'Case Opened',
          note: `Complaint recorded: "${description.trim()}". Severity: ${severity.toUpperCase()}.`
        }
      ]
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // If service recovery requested, create a recovery request routed to Department Manager
    if (Number(recoveryAmount) > 0) {
      const recoveryId = `REC-${Math.floor(530 + Math.random() * 470)}`;
      const newRecovery = {
        id: recoveryId,
        complaintId: newCaseId,
        taskId: null,
        guestReference: guestReference.trim(),
        requestingEmployee: {
          id: frontDeskProfile.id,
          name: frontDeskProfile.name,
          role: frontDeskProfile.role
        },
        requestType: recoveryType,
        proposedGesture: `$${Number(recoveryAmount).toFixed(2)} ${recoveryType}`,
        amount: Number(recoveryAmount),
        currency: 'USD',
        policyLimit: 250.0,
        isWithinManagerAuthority: Number(recoveryAmount) <= 250.0,
        reason: recoveryReason?.trim() || description.trim(),
        supportingNotes: `Initiated by Front Desk Coordinator for complaint ${newCaseId}. Awaiting Manager approval.`,
        status: RECOVERY_STATUS.PENDING, // Strictly pending manager approval!
        createdAt: nowIso,
        decidedAt: null,
        decidedBy: null,
        decisionReason: '',
        history: [
          {
            timestamp: nowIso,
            actor: `${frontDeskProfile.name} (Front Desk)`,
            action: 'Recovery Requested',
            note: `Submitted $${Number(recoveryAmount).toFixed(2)} recovery request for Manager approval.`
          }
        ]
      };
      setRecoveryRequests((prev) => [newRecovery, ...prev]);
    }

    // Log to guest communications if message provided
    if (guestVisibleMessage) {
      const commEntry = {
        id: `GCOM-${Date.now()}`,
        reservationId: null,
        guestName: guestReference.trim(),
        roomNumber: roomNumber || 'N/A',
        channel: 'In-App Concierge',
        direction: 'Outbound',
        category: 'Complaint Acknowledgement & Apology',
        message: guestVisibleMessage.trim(),
        timestamp: nowIso,
        status: 'Delivered (Simulated Gateway)',
        actor: `${frontDeskProfile.name} (Front Desk)`,
        linkedRequestId: null,
        linkedComplaintId: newCaseId
      };
      setGuestCommunications((prev) => [commEntry, ...prev]);
    }

    showToast(`Case ${newCaseId} opened.${Number(recoveryAmount) > 0 ? ' Service recovery submitted for Manager review.' : ''}`, 'success');
    return { success: true, caseId: newCaseId };
  }, [frontDeskProfile, staffList, showToast]);

  // 7. Create Room Move Request (Enforces Room Cleanliness & Clearance)
  const createRoomMoveRequest = useCallback(({
    reservationId,
    fromRoom,
    toRoom,
    reasonCategory,
    reasonDetails
  }) => {
    const reservation = reservations.find((r) => r.id === reservationId);
    if (!reservation) {
      showToast('Reservation not found.', 'error');
      return { success: false, error: 'Reservation not found.' };
    }

    // DESTINATION ROOM READINESS CHECK
    const destRoomObj = rooms.find((r) => r.roomNumber === toRoom);
    if (!destRoomObj) {
      showToast(`Destination Room ${toRoom} not found.`, 'error');
      return { success: false, error: `Destination Room ${toRoom} does not exist.` };
    }

    // RESTRICTION: Destination must be clean & ready
    if (destRoomObj.cleanliness !== ROOM_STATUS.READY) {
      const errMsg = `Room Move BLOCKED: Destination Room ${toRoom} is currently "${destRoomObj.cleanliness}". Only "Ready / Clean & Inspected" rooms can be selected.`;
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }

    // RESTRICTION: Destination must be vacant
    if (destRoomObj.occupancy === OCCUPANCY_STATUS.OCCUPIED) {
      const errMsg = `Room Move BLOCKED: Destination Room ${toRoom} is currently occupied by another guest.`;
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }

    const newMoveId = `RMV-${Math.floor(210 + Math.random() * 790)}`;
    const nowIso = new Date().toISOString();

    const fromRoomObj = rooms.find((r) => r.roomNumber === fromRoom);

    const newMove = {
      id: newMoveId,
      reservationId: reservationId,
      guestName: reservation.guestName,
      vipStatus: reservation.vipStatus || 'Regular',
      fromRoom: fromRoom,
      toRoom: toRoom,
      fromRoomType: fromRoomObj?.type || reservation.roomType,
      toRoomType: destRoomObj.type,
      reasonCategory: reasonCategory,
      reasonDetails: reasonDetails.trim(),
      status: ROOM_MOVE_STATUS.REQUESTED,
      initiatedBy: {
        id: frontDeskProfile.id,
        name: frontDeskProfile.name,
        role: frontDeskProfile.role
      },
      approvedBy: null,
      destinationRoomClean: true,
      guestNotified: false,
      createdAt: nowIso,
      completedAt: null,
      notes: reasonDetails.trim(),
      auditLog: [
        {
          timestamp: nowIso,
          actor: `${frontDeskProfile.name} (Front Desk)`,
          event: 'Room Move Requested',
          details: `Initiated move request from Room ${fromRoom} to Room ${toRoom}. Reason: ${reasonCategory}.`
        }
      ]
    };

    setRoomMoves((prev) => [newMove, ...prev]);
    showToast(`Room move request ${newMoveId} created for ${reservation.guestName}.`, 'success');
    return { success: true, moveId: newMoveId };
  }, [reservations, rooms, frontDeskProfile, showToast]);

  // 8. Complete Room Move (Transfers Guest, Marks Old Room Dirty, Triggers Turnover)
  const completeRoomMove = useCallback((moveId) => {
    const move = roomMoves.find((m) => m.id === moveId);
    if (!move) {
      showToast('Room move record not found.', 'error');
      return { success: false };
    }

    // Verify destination room again
    const destRoomObj = rooms.find((r) => r.roomNumber === move.toRoom);
    if (destRoomObj && destRoomObj.cleanliness !== ROOM_STATUS.READY) {
      showToast(`Cannot complete move: Room ${move.toRoom} is not ready.`, 'error');
      return { success: false, error: 'Destination room is not cleared.' };
    }

    const nowIso = new Date().toISOString();

    // 1. Update Reservation
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id !== move.reservationId) return r;
        return {
          ...r,
          assignedRoom: move.toRoom,
          auditLog: [
            {
              timestamp: nowIso,
              actor: `${frontDeskProfile.name} (Front Desk)`,
              event: 'Room Move Completed',
              details: `Guest relocated from Room ${move.fromRoom} to Room ${move.toRoom}.`
            },
            ...(r.auditLog || [])
          ]
        };
      })
    );

    // 2. Update Old Room (Vacant + DIRTY) and New Room (OCCUPIED)
    setRooms((prev) =>
      prev.map((rm) => {
        if (rm.roomNumber === move.fromRoom) {
          return {
            ...rm,
            occupancy: OCCUPANCY_STATUS.VACANT,
            cleanliness: ROOM_STATUS.DIRTY, // Requires turnover
            currentReservationId: null,
            guestName: null
          };
        }
        if (rm.roomNumber === move.toRoom) {
          return {
            ...rm,
            occupancy: OCCUPANCY_STATUS.OCCUPIED,
            currentReservationId: move.reservationId,
            guestName: move.guestName
          };
        }
        return rm;
      })
    );

    // 3. Trigger Housekeeping Turnover Task for Vacated Room
    const turnoverTaskId = `TSK-${Math.floor(2000 + Math.random() * 8000)}`;
    const turnoverTask = {
      id: turnoverTaskId,
      title: `Room Turnover Cleaning & Inspection — Room ${move.fromRoom}`,
      category: TASK_CATEGORY.HOUSEKEEPING,
      location: `Room ${move.fromRoom}`,
      item: 'Vacated Room Turnover Sanitization',
      quantity: 1,
      priority: TASK_PRIORITY.HIGH,
      status: TASK_STATUS.NEW,
      assignedTo: null,
      createdAt: nowIso,
      dueAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
      inspectionRequired: true,
      inspectionStatus: INSPECTION_STATUS.PENDING_REVIEW,
      instructions: `Guest moved to Room ${move.toRoom}. Sanitize vacated Room ${move.fromRoom}, change bed linens, restock toiletries, and submit for supervisor inspection.`,
      internalNotes: `Auto-generated by Front Desk room move workflow for move ${move.id}.`,
      history: [
        {
          id: `HIS-${Date.now()}`,
          event: 'Task Created',
          details: `Dispatched following room move from ${move.fromRoom} to ${move.toRoom}.`,
          timestamp: nowIso,
          actor: `${frontDeskProfile.name} (Front Desk Coordinator)`
        }
      ]
    };
    setTasks((prev) => [turnoverTask, ...prev]);

    // 4. Update Move Record
    setRoomMoves((prev) =>
      prev.map((m) => {
        if (m.id !== moveId) return m;
        return {
          ...m,
          status: ROOM_MOVE_STATUS.COMPLETED,
          completedAt: nowIso,
          auditLog: [
            {
              timestamp: nowIso,
              actor: `${frontDeskProfile.name} (Front Desk)`,
              event: 'Room Move Completed',
              details: `Relocation confirmed. Turnover task ${turnoverTaskId} dispatched for Room ${move.fromRoom}.`
            },
            ...(m.auditLog || [])
          ]
        };
      })
    );

    showToast(`Relocated ${move.guestName} to Room ${move.toRoom}. Turnover dispatched for Room ${move.fromRoom}.`, 'success');
    return { success: true };
  }, [roomMoves, rooms, frontDeskProfile, showToast]);

  // 9. Cancel Room Move
  const cancelRoomMove = useCallback((moveId, reason = '') => {
    const nowIso = new Date().toISOString();
    setRoomMoves((prev) =>
      prev.map((m) => {
        if (m.id !== moveId) return m;
        return {
          ...m,
          status: ROOM_MOVE_STATUS.CANCELLED,
          auditLog: [
            {
              timestamp: nowIso,
              actor: `${frontDeskProfile.name} (Front Desk)`,
              event: 'Room Move Cancelled',
              details: reason || 'Move request cancelled by Front Desk.'
            },
            ...(m.auditLog || [])
          ]
        };
      })
    );
    showToast('Room move cancelled.', 'info');
  }, [frontDeskProfile, showToast]);

  // 10. Schedule Wake-up Call
  const scheduleWakeUpCall = useCallback(({
    reservationId,
    guestName,
    roomNumber,
    scheduledDate,
    scheduledTime,
    specialInstructions = ''
  }) => {
    const newWucId = `WUC-${Math.floor(105 + Math.random() * 895)}`;
    const nowIso = new Date().toISOString();

    const newWakeUp = {
      id: newWucId,
      reservationId: reservationId || null,
      guestName: guestName.trim(),
      roomNumber: roomNumber.trim(),
      scheduledDate: scheduledDate,
      scheduledTime: scheduledTime,
      status: WAKE_UP_STATUS.SCHEDULED,
      specialInstructions: specialInstructions?.trim() || 'Standard morning greeting.',
      attempts: [],
      createdAt: nowIso,
      createdBy: `${frontDeskProfile.id} (${frontDeskProfile.name})`
    };

    setWakeUpCalls((prev) => [newWakeUp, ...prev]);
    showToast(`Wake-up call scheduled for Room ${roomNumber} at ${scheduledTime} on ${scheduledDate}.`, 'success');
    return { success: true, id: newWucId };
  }, [frontDeskProfile, showToast]);

  // 11. Record Wake-up Call Attempt / Execution
  const recordWakeUpCallAttempt = useCallback((callId, { status = 'Answered', note = '' }) => {
    const nowIso = new Date().toISOString();
    const finalStatus = status === 'Answered' ? WAKE_UP_STATUS.COMPLETED : status === 'No Answer' ? WAKE_UP_STATUS.FAILED : WAKE_UP_STATUS.RESCHEDULED;

    setWakeUpCalls((prev) =>
      prev.map((w) => {
        if (w.id !== callId) return w;
        const newAttempt = {
          timestamp: nowIso,
          status: status,
          operator: `${frontDeskProfile.id} (${frontDeskProfile.name})`,
          note: note || `Attempt logged as ${status}.`
        };
        return {
          ...w,
          status: finalStatus,
          attempts: [newAttempt, ...(w.attempts || [])]
        };
      })
    );

    showToast(`Wake-up call marked as ${finalStatus}.`, finalStatus === WAKE_UP_STATUS.COMPLETED ? 'success' : 'warning');
    return { success: true };
  }, [frontDeskProfile, showToast]);

  // 12. Send / Log Guest Communication (Simulated Gateway)
  const sendGuestMessage = useCallback(({
    reservationId = null,
    guestName,
    roomNumber = 'N/A',
    channel = 'SMS',
    category = 'General Inquiry',
    message,
    linkedRequestId = null,
    linkedComplaintId = null
  }) => {
    const newComId = `GCOM-${Math.floor(310 + Math.random() * 690)}`;
    const nowIso = new Date().toISOString();

    const newComm = {
      id: newComId,
      reservationId: reservationId,
      guestName: guestName.trim(),
      roomNumber: roomNumber,
      channel: channel,
      direction: 'Outbound',
      category: category,
      message: message.trim(),
      timestamp: nowIso,
      status: 'Delivered (Simulated Gateway)',
      actor: `${frontDeskProfile.name} (Front Desk)`,
      linkedRequestId: linkedRequestId,
      linkedComplaintId: linkedComplaintId
    };

    setGuestCommunications((prev) => [newComm, ...prev]);
    showToast(`Simulated ${channel} message dispatched to ${guestName}.`, 'success');
    return { success: true, id: newComId };
  }, [frontDeskProfile, showToast]);

  // 13. Record Folio Payment
  const recordFolioPayment = useCallback(({
    folioId,
    amount,
    method = 'Visa ending 4812',
    authCode = ''
  }) => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      showToast('Payment amount must be greater than zero.', 'error');
      return { success: false };
    }

    const nowIso = new Date().toISOString();
    const newPayId = `PAY-${Math.floor(500 + Math.random() * 500)}`;
    const genAuth = authCode?.trim() || `AUTH-${Math.floor(10000 + Math.random() * 90000)}`;

    let targetReservationId = null;

    setFolios((prev) =>
      prev.map((f) => {
        if (f.folioId !== folioId) return f;
        targetReservationId = f.reservationId;
        const newPayment = {
          id: newPayId,
          date: nowIso.split('T')[0],
          method: method,
          authCode: genAuth,
          amount: numericAmount,
          status: 'Settled',
          recordedBy: `${frontDeskProfile.id} (${frontDeskProfile.name})`
        };
        const updatedBalance = Math.max(0, Number((f.balance - numericAmount).toFixed(2)));
        return {
          ...f,
          balance: updatedBalance,
          status: updatedBalance === 0 ? 'Settled' : 'Open',
          payments: [newPayment, ...(f.payments || [])]
        };
      })
    );

    if (targetReservationId) {
      setReservations((prev) =>
        prev.map((r) => {
          if (r.id !== targetReservationId) return r;
          const updatedBalance = Math.max(0, Number((r.folioBalance - numericAmount).toFixed(2)));
          return {
            ...r,
            folioBalance: updatedBalance,
            auditLog: [
              {
                timestamp: nowIso,
                actor: `${frontDeskProfile.name} (Front Desk)`,
                event: 'Payment Recorded',
                details: `Processed payment of $${numericAmount.toFixed(2)} via ${method} (${genAuth}). Balance: $${updatedBalance.toFixed(2)}.`
              },
              ...(r.auditLog || [])
            ]
          };
        })
      );
    }

    showToast(`Recorded payment of $${numericAmount.toFixed(2)} (${genAuth}).`, 'success');
    return { success: true };
  }, [frontDeskProfile, showToast]);

  // 14. Post Folio Charge / Incidental
  const postFolioCharge = useCallback(({
    folioId,
    category = 'Incidentals',
    description,
    amount
  }) => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      showToast('Charge amount must be greater than zero.', 'error');
      return { success: false };
    }

    const nowIso = new Date().toISOString();
    const newChgId = `CHG-${Math.floor(400 + Math.random() * 600)}`;
    let targetReservationId = null;

    setFolios((prev) =>
      prev.map((f) => {
        if (f.folioId !== folioId) return f;
        targetReservationId = f.reservationId;
        const newCharge = {
          id: newChgId,
          date: nowIso.split('T')[0],
          category: category,
          description: description.trim(),
          amount: numericAmount
        };
        const updatedBalance = Number((f.balance + numericAmount).toFixed(2));
        return {
          ...f,
          balance: updatedBalance,
          status: 'Open',
          charges: [newCharge, ...(f.charges || [])]
        };
      })
    );

    if (targetReservationId) {
      setReservations((prev) =>
        prev.map((r) => {
          if (r.id !== targetReservationId) return r;
          return {
            ...r,
            folioBalance: Number((r.folioBalance + numericAmount).toFixed(2))
          };
        })
      );
    }

    showToast(`Posted charge of $${numericAmount.toFixed(2)} (${description.trim()}).`, 'success');
    return { success: true };
  }, [showToast]);

  // 15. Initiate Folio Refund Request (Enforces Separation: Front Desk Initiates, Manager Approves)
  const initiateFolioRefund = useCallback(({
    folioId,
    amount,
    reason,
    supportingNotes = ''
  }) => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      showToast('Refund amount must be greater than zero.', 'error');
      return { success: false };
    }

    const folio = folios.find((f) => f.folioId === folioId);
    if (!folio) {
      showToast('Folio not found.', 'error');
      return { success: false };
    }

    const nowIso = new Date().toISOString();
    const newRecId = `REC-${Math.floor(550 + Math.random() * 450)}`;

    // Front Desk cannot self-approve refunds; create recovery request routed to Department Manager
    const refundRequest = {
      id: newRecId,
      complaintId: null,
      taskId: null,
      guestReference: `${folio.guestName} (${folio.roomNumber})`,
      requestingEmployee: {
        id: frontDeskProfile.id,
        name: frontDeskProfile.name,
        role: frontDeskProfile.role
      },
      requestType: 'Folio Billing Refund',
      proposedGesture: `$${numericAmount.toFixed(2)} Credit Card Refund`,
      amount: numericAmount,
      currency: 'USD',
      policyLimit: 250.0,
      isWithinManagerAuthority: numericAmount <= 250.0,
      reason: reason.trim(),
      supportingNotes: `Initiated by Front Desk for Folio ${folioId}. ${supportingNotes?.trim() || ''}`,
      status: RECOVERY_STATUS.PENDING, // Pending Manager Approval
      createdAt: nowIso,
      decidedAt: null,
      decidedBy: null,
      decisionReason: '',
      history: [
        {
          timestamp: nowIso,
          actor: `${frontDeskProfile.name} (Front Desk)`,
          action: 'Refund Initiated',
          note: `Requested $${numericAmount.toFixed(2)} billing refund. Awaiting Department Manager authorization.`
        }
      ]
    };

    setRecoveryRequests((prev) => [refundRequest, ...prev]);

    showToast(`Submitted refund request of $${numericAmount.toFixed(2)} for Department Manager approval.`, 'info');
    return { success: true, pendingApproval: true, requestId: newRecId };
  }, [folios, frontDeskProfile, showToast]);

  // 16. Toggle Financial Access (Allows easy testing of permission guards)
  const toggleFinancialAccess = useCallback(() => {
    setFrontDeskProfile((prev) => {
      const nextAccess = !prev.hasFinancialAccess;
      const updated = {
        ...prev,
        hasFinancialAccess: nextAccess,
        financialPermissions: {
          ...prev.financialPermissions,
          canViewFolio: nextAccess,
          canCollectPayment: nextAccess
        }
      };
      showToast(`Front Desk Financial Permissions: ${nextAccess ? 'ENABLED' : 'DISABLED'} (Test Mode)`, nextAccess ? 'success' : 'warning');
      return updated;
    });
  }, [showToast]);

  // 17. Update Front Desk Profile
  const updateFrontDeskProfile = useCallback((updates) => {
    setFrontDeskProfile((prev) => ({
      ...prev,
      ...updates
    }));
    showToast('Front Desk profile updated.', 'info');
  }, [showToast]);

  // ==========================================
  // FINANCIAL OPERATOR - ACTIONS & SAFEGUARDS
  // ==========================================

  // 1. Audit logger (Immutable Financial Audit Trail)
  const logFinancialAudit = useCallback(({
    action,
    recordReference,
    previousValue = 'N/A',
    newValue = 'N/A',
    reason = 'Standard financial operation',
    approvalReference = 'N/A',
    executionResult = 'SUCCESS',
    providerReference = 'N/A'
  }) => {
    const entry = {
      id: `FAUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor: `${financeProfile.name} (${financeProfile.role} - ${financeProfile.id})`,
      action,
      recordReference,
      previousValue,
      newValue,
      reason,
      approvalReference,
      executionResult,
      providerReference
    };
    setFinancialAuditLogs((prev) => [entry, ...prev]);
    return entry;
  }, [financeProfile]);

  // 2. Toggle granular finance permission (for security & testing)
  const toggleFinancePermission = useCallback((permKey) => {
    setFinanceProfile((prev) => {
      const currentVal = Boolean(prev.permissions[permKey]);
      const nextVal = !currentVal;
      const updated = {
        ...prev,
        permissions: {
          ...prev.permissions,
          [permKey]: nextVal
        }
      };
      showToast(`Financial Permission '${permKey}' is now ${nextVal ? 'ALLOWED' : 'DENIED'}`, nextVal ? 'success' : 'warning');
      return updated;
    });
  }, [showToast]);

  // 3. Update finance profile
  const updateFinanceProfile = useCallback((updates) => {
    setFinanceProfile((prev) => ({
      ...prev,
      ...updates
    }));
    showToast('Financial Operator profile updated successfully.', 'success');
  }, [showToast]);

  // 4. Record Authorized Payment
  const recordFinancialPayment = useCallback(({
    folioId,
    amount,
    paymentMethod = 'Visa •••• 4812',
    notes = ''
  }) => {
    if (!financeProfile.permissions['payment.record']) {
      showToast('Permission Denied: payment.record required to collect payments.', 'error');
      return { success: false, error: 'Permission Denied: payment.record required.' };
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Payment amount must be a positive number.', 'error');
      return { success: false, error: 'Invalid payment amount.' };
    }

    const folio = folios.find((f) => f.folioId === folioId);
    if (!folio) {
      showToast('Folio not found.', 'error');
      return { success: false, error: 'Folio not found.' };
    }

    const newTxnId = `TXN-${Math.floor(9000 + Math.random() * 1000)}`;
    const authCode = `AUTH-${Math.floor(10000 + Math.random() * 90000)}`;
    const providerRef = `ch_3Nx${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`;
    const fee = Number((numAmount * 0.029 + 0.30).toFixed(2));
    const net = Number((numAmount - fee).toFixed(2));
    const nowIso = new Date().toISOString();

    const newTxn = {
      id: newTxnId,
      folioId: folio.folioId,
      reservationId: folio.reservationId,
      guestName: folio.guestName,
      roomNumber: folio.roomNumber,
      type: TRANSACTION_TYPE.PAYMENT,
      amount: numAmount,
      currency: 'USD',
      paymentMethod,
      provider: 'Stripe Payments (Simulated Gateway)',
      providerReference: providerRef,
      authCode,
      status: TRANSACTION_STATUS.SETTLED,
      reconciliationStatus: RECONCILIATION_STATUS.UNRECONCILED,
      batchId: 'BATCH-2026-10-22-CURRENT',
      capturedBy: `${financeProfile.id} (${financeProfile.name})`,
      timestamp: nowIso,
      fee,
      net,
      idempotencyKey: `idemp_${newTxnId}_${Date.now()}`,
      refundableBalance: numAmount,
      refundHistory: [],
      notes,
      timeline: [
        {
          event: 'Payment Authorized & Captured',
          timestamp: nowIso,
          actor: `${financeProfile.name} (${financeProfile.role})`,
          details: `Processed $${numAmount.toFixed(2)} via ${paymentMethod} (${providerRef}).`
        }
      ]
    };

    setFinancialTransactions((prev) => [newTxn, ...prev]);

    // Authoritative Folio Update
    setFolios((prev) =>
      prev.map((f) => {
        if (f.folioId !== folioId) return f;
        const newPaymentItem = {
          id: `PAY-${Date.now().toString().slice(-4)}`,
          date: nowIso.split('T')[0],
          method: paymentMethod,
          authCode,
          amount: numAmount,
          status: 'Settled',
          recordedBy: `${financeProfile.id} (${financeProfile.name})`
        };
        const updatedPayments = [...(f.payments || []), newPaymentItem];
        const totalCharges = (f.charges || []).reduce((acc, c) => acc + Number(c.amount || 0), 0);
        const totalPayments = updatedPayments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
        const totalRefunds = (f.refunds || []).reduce((acc, r) => acc + Number(r.amount || 0), 0);
        const newBalance = Number((totalCharges - totalPayments + totalRefunds).toFixed(2));
        return {
          ...f,
          payments: updatedPayments,
          balance: newBalance,
          status: newBalance <= 0 ? 'Settled' : 'Open'
        };
      })
    );

    logFinancialAudit({
      action: 'RECORD_PAYMENT',
      recordReference: `${newTxnId} / ${folioId}`,
      previousValue: `Folio Balance: $${folio.balance.toFixed(2)}`,
      newValue: `Payment: $${numAmount.toFixed(2)} (Auth: ${authCode})`,
      reason: notes || 'Front desk / financial terminal payment collection',
      approvalReference: 'Authorized by Operator',
      executionResult: 'SUCCESS',
      providerReference: providerRef
    });

    showToast(`Recorded payment of $${numAmount.toFixed(2)} for ${folio.guestName} (${authCode}).`, 'success');
    return { success: true, transaction: newTxn };
  }, [financeProfile, folios, logFinancialAudit, showToast]);

  // 5. Post Auditable Ledger Adjustment
  const postFolioAdjustment = useCallback(({
    folioId,
    amount,
    category = 'Rate Correction',
    description = '',
    rationale = ''
  }) => {
    if (!financeProfile.permissions['folio.adjust']) {
      showToast('Permission Denied: folio.adjust required.', 'error');
      return { success: false, error: 'Permission Denied: folio.adjust required.' };
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount === 0) {
      showToast('Adjustment amount cannot be zero.', 'error');
      return { success: false, error: 'Adjustment cannot be zero.' };
    }

    if (!rationale.trim()) {
      showToast('Mandatory Rationale is required for auditable adjustments.', 'error');
      return { success: false, error: 'Mandatory Rationale is required.' };
    }

    const folio = folios.find((f) => f.folioId === folioId);
    if (!folio) {
      showToast('Folio not found.', 'error');
      return { success: false, error: 'Folio not found.' };
    }

    const newTxnId = `ADJ-${Math.floor(8000 + Math.random() * 1000)}`;
    const nowIso = new Date().toISOString();

    const adjustmentTxn = {
      id: newTxnId,
      folioId: folio.folioId,
      reservationId: folio.reservationId,
      guestName: folio.guestName,
      roomNumber: folio.roomNumber,
      type: TRANSACTION_TYPE.ADJUSTMENT,
      amount: numAmount,
      currency: 'USD',
      paymentMethod: 'Internal Ledger Adjustment',
      provider: 'Internal Financial Ledger',
      providerReference: newTxnId,
      authCode: 'ADJ-APPR',
      status: TRANSACTION_STATUS.SETTLED,
      reconciliationStatus: RECONCILIATION_STATUS.MATCHED,
      batchId: 'BATCH-2026-10-22-CURRENT',
      capturedBy: `${financeProfile.id} (${financeProfile.name})`,
      timestamp: nowIso,
      fee: 0,
      net: numAmount,
      idempotencyKey: `idemp_${newTxnId}`,
      refundableBalance: 0,
      refundHistory: [],
      notes: rationale,
      timeline: [
        {
          event: 'Adjustment Posted',
          timestamp: nowIso,
          actor: `${financeProfile.name} (${financeProfile.role})`,
          details: `${description} - ${rationale}`
        }
      ]
    };

    setFinancialTransactions((prev) => [adjustmentTxn, ...prev]);

    setFolios((prev) =>
      prev.map((f) => {
        if (f.folioId !== folioId) return f;
        const newChargeItem = {
          id: `CHG-ADJ-${Date.now().toString().slice(-4)}`,
          date: nowIso.split('T')[0],
          category: `Adjustment: ${category}`,
          description: `${description} (${rationale})`,
          amount: numAmount
        };
        const updatedCharges = [...(f.charges || []), newChargeItem];
        const totalCharges = updatedCharges.reduce((acc, c) => acc + Number(c.amount || 0), 0);
        const totalPayments = (f.payments || []).reduce((acc, p) => acc + Number(p.amount || 0), 0);
        const totalRefunds = (f.refunds || []).reduce((acc, r) => acc + Number(r.amount || 0), 0);
        const newBalance = Number((totalCharges - totalPayments + totalRefunds).toFixed(2));
        return {
          ...f,
          charges: updatedCharges,
          balance: newBalance
        };
      })
    );

    logFinancialAudit({
      action: 'POST_LEDGER_ADJUSTMENT',
      recordReference: `${newTxnId} / ${folioId}`,
      previousValue: `Balance: $${folio.balance.toFixed(2)}`,
      newValue: `Adjustment: $${numAmount.toFixed(2)}`,
      reason: rationale,
      approvalReference: `Operator ${financeProfile.name}`,
      executionResult: 'SUCCESS',
      providerReference: 'INTERNAL-ADJUSTMENT'
    });

    showToast(`Posted adjustment of $${numAmount.toFixed(2)} for ${folio.guestName}.`, 'success');
    return { success: true, transaction: adjustmentTxn };
  }, [financeProfile, folios, logFinancialAudit, showToast]);

  // 6. Submit Refund Request (Lifecycle Stage 1)
  const submitRefundRequest = useCallback(({
    originalTransactionId,
    amount,
    reason,
    category = 'Service Recovery'
  }) => {
    if (!financeProfile.permissions['refund.request']) {
      showToast('Permission Denied: refund.request required.', 'error');
      return { success: false, error: 'Permission Denied: refund.request required.' };
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Refund amount must be a positive number.', 'error');
      return { success: false, error: 'Refund amount must be positive.' };
    }

    if (!reason.trim()) {
      showToast('A clear reason is required for every refund request.', 'error');
      return { success: false, error: 'Reason is required.' };
    }

    const originalTxn = financialTransactions.find((t) => t.id === originalTransactionId);
    if (!originalTxn) {
      showToast('Original transaction not found in ledger.', 'error');
      return { success: false, error: 'Original transaction not found.' };
    }

    if (originalTxn.status === TRANSACTION_STATUS.FAILED || originalTxn.status === TRANSACTION_STATUS.REVERSED) {
      showToast(`Cannot refund transaction with status '${originalTxn.status}'.`, 'error');
      return { success: false, error: `Invalid transaction status: ${originalTxn.status}` };
    }

    const pendingRefundsForTxn = refundRequests
      .filter((r) => r.originalTransactionId === originalTransactionId && (r.status === REFUND_STATUS.PENDING_APPROVAL || r.status === REFUND_STATUS.APPROVED || r.status === REFUND_STATUS.AWAITING_EXECUTION))
      .reduce((acc, r) => acc + Number(r.amount || 0), 0);

    const availableRefundable = originalTxn.refundableBalance - pendingRefundsForTxn;
    if (numAmount > availableRefundable) {
      showToast(`Requested amount ($${numAmount.toFixed(2)}) exceeds available refundable balance ($${availableRefundable.toFixed(2)}).`, 'error');
      return { success: false, error: 'Amount exceeds refundable balance.' };
    }

    const newRefId = `REF-${Math.floor(5100 + Math.random() * 1000)}`;
    const nowIso = new Date().toISOString();

    const newRequest = {
      id: newRefId,
      originalTransactionId: originalTxn.id,
      folioId: originalTxn.folioId,
      reservationId: originalTxn.reservationId,
      guestName: originalTxn.guestName,
      roomNumber: originalTxn.roomNumber,
      amount: numAmount,
      currency: originalTxn.currency || 'USD',
      originalAmount: originalTxn.amount,
      refundableRemaining: Number((availableRefundable - numAmount).toFixed(2)),
      reason: reason.trim(),
      category,
      status: REFUND_STATUS.PENDING_APPROVAL,
      requester: {
        id: financeProfile.id,
        name: financeProfile.name,
        role: financeProfile.role
      },
      requestedAt: nowIso,
      approver: null,
      approvedAt: null,
      approvalNotes: '',
      executor: null,
      executedAt: null,
      executionNotes: '',
      providerRefundId: null,
      idempotencyKey: `idemp_${newRefId}_${Date.now()}`,
      auditTrail: [
        {
          timestamp: nowIso,
          actor: `${financeProfile.name} (${financeProfile.role})`,
          event: 'Refund Requested',
          details: `Requested $${numAmount.toFixed(2)} refund for ${originalTxn.guestName}. Reason: ${reason}`
        }
      ]
    };

    setRefundRequests((prev) => [newRequest, ...prev]);

    setFinancialNotifications((prev) => [
      {
        id: `FNOT-FIN-${Date.now()}`,
        type: 'refund_approval',
        title: `Refund Pending Approval: $${numAmount.toFixed(2)}`,
        message: `${financeProfile.name} requested refund ${newRefId} for ${originalTxn.guestName}.`,
        timestamp: nowIso,
        read: false,
        priority: numAmount > 250 ? 'high' : 'medium',
        actionRoute: '/finance/refunds'
      },
      ...prev
    ]);

    logFinancialAudit({
      action: 'SUBMIT_REFUND_REQUEST',
      recordReference: `${newRefId} / ${originalTxn.id}`,
      previousValue: `Refundable Balance: $${originalTxn.refundableBalance.toFixed(2)}`,
      newValue: `Status: Pending Approval ($${numAmount.toFixed(2)})`,
      reason: reason.trim(),
      approvalReference: 'Awaiting Independent Approver',
      executionResult: 'PENDING_APPROVAL',
      providerReference: originalTxn.providerReference
    });

    showToast(`Refund request ${newRefId} submitted for independent approval.`, 'info');
    return { success: true, refundRequest: newRequest };
  }, [financeProfile, financialTransactions, refundRequests, logFinancialAudit, showToast]);

  // 7. Approve Refund Request (Separation of Duties Enforced)
  const approveRefundRequest = useCallback(({
    refundId,
    approvalNotes = ''
  }) => {
    if (!financeProfile.permissions['refund.approve']) {
      showToast('Permission Denied: refund.approve required.', 'error');
      return { success: false, error: 'Permission Denied: refund.approve required.' };
    }

    const request = refundRequests.find((r) => r.id === refundId);
    if (!request) {
      showToast('Refund request not found.', 'error');
      return { success: false, error: 'Refund request not found.' };
    }

    if (request.status !== REFUND_STATUS.PENDING_APPROVAL) {
      showToast(`Cannot approve refund in '${request.status}' state.`, 'error');
      return { success: false, error: `Invalid state: ${request.status}` };
    }

    // MANDATORY SAFEGUARD 1: Requester cannot approve their own refund
    if (request.requester?.id === financeProfile.id) {
      const err = 'Separation of Duties Violation: You cannot approve your own refund request. An independent authorized reviewer must approve.';
      showToast(err, 'error');
      return { success: false, error: err };
    }

    // MANDATORY SAFEGUARD 2: Enforce server approval limit
    const approvalLimit = financeProfile.approvalLimitUSD || 1000.00;
    if (request.amount > approvalLimit) {
      const err = `Approval Limit Exceeded: Amount ($${request.amount.toFixed(2)}) exceeds your delegated limit ($${approvalLimit.toFixed(2)}). Escalation to General Manager or CFO is required.`;
      showToast(err, 'error');
      return { success: false, error: err };
    }

    const nowIso = new Date().toISOString();

    setRefundRequests((prev) =>
      prev.map((r) => {
        if (r.id !== refundId) return r;
        return {
          ...r,
          status: REFUND_STATUS.APPROVED,
          approver: {
            id: financeProfile.id,
            name: financeProfile.name,
            role: financeProfile.role
          },
          approvedAt: nowIso,
          approvalNotes: approvalNotes || 'Approved within delegated financial authority.',
          auditTrail: [
            ...r.auditTrail,
            {
              timestamp: nowIso,
              actor: `${financeProfile.name} (${financeProfile.role})`,
              event: 'Refund Approved',
              details: `Approved by ${financeProfile.name}. Limit checked ($${approvalLimit.toFixed(2)}). Notes: ${approvalNotes || 'None'}`
            }
          ]
        };
      })
    );

    setFinancialNotifications((prev) => [
      {
        id: `FNOT-FIN-${Date.now()}`,
        type: 'refund_execution',
        title: `Refund Ready for Gateway Execution: $${request.amount.toFixed(2)}`,
        message: `${refundId} for ${request.guestName} was approved by ${financeProfile.name}.`,
        timestamp: nowIso,
        read: false,
        priority: 'high',
        actionRoute: '/finance/refunds'
      },
      ...prev
    ]);

    logFinancialAudit({
      action: 'APPROVE_REFUND',
      recordReference: `${refundId} / ${request.originalTransactionId}`,
      previousValue: 'Status: Pending Approval',
      newValue: 'Status: Approved',
      reason: approvalNotes || 'Authorized within approval limit',
      approvalReference: `${financeProfile.name} (EMP-${financeProfile.id})`,
      executionResult: 'SUCCESS',
      providerReference: 'N/A'
    });

    showToast(`Refund ${refundId} approved. Queued for payment gateway execution.`, 'success');
    return { success: true };
  }, [financeProfile, refundRequests, logFinancialAudit, showToast]);

  // 8. Reject Refund Request
  const rejectRefundRequest = useCallback(({
    refundId,
    rejectionReason = ''
  }) => {
    if (!financeProfile.permissions['refund.approve']) {
      showToast('Permission Denied: refund.approve required.', 'error');
      return { success: false, error: 'Permission Denied: refund.approve required.' };
    }

    if (!rejectionReason.trim()) {
      showToast('Mandatory rejection reason must be provided.', 'error');
      return { success: false, error: 'Rejection reason is required.' };
    }

    const request = refundRequests.find((r) => r.id === refundId);
    if (!request) {
      showToast('Refund request not found.', 'error');
      return { success: false, error: 'Refund request not found.' };
    }

    const nowIso = new Date().toISOString();

    setRefundRequests((prev) =>
      prev.map((r) => {
        if (r.id !== refundId) return r;
        return {
          ...r,
          status: REFUND_STATUS.REJECTED,
          approver: {
            id: financeProfile.id,
            name: financeProfile.name,
            role: financeProfile.role
          },
          approvedAt: nowIso,
          approvalNotes: `REJECTED: ${rejectionReason.trim()}`,
          auditTrail: [
            ...r.auditTrail,
            {
              timestamp: nowIso,
              actor: `${financeProfile.name} (${financeProfile.role})`,
              event: 'Refund Rejected',
              details: `Rejected by ${financeProfile.name}. Reason: ${rejectionReason.trim()}`
            }
          ]
        };
      })
    );

    logFinancialAudit({
      action: 'REJECT_REFUND',
      recordReference: `${refundId} / ${request.originalTransactionId}`,
      previousValue: 'Status: Pending Approval',
      newValue: 'Status: Rejected',
      reason: rejectionReason.trim(),
      approvalReference: `${financeProfile.name} (EMP-${financeProfile.id})`,
      executionResult: 'REJECTED',
      providerReference: 'N/A'
    });

    showToast(`Refund ${refundId} was rejected. Reason preserved in audit trail.`, 'info');
    return { success: true };
  }, [financeProfile, refundRequests, logFinancialAudit, showToast]);

  // 9. Execute Approved Refund (Gateway Interaction & Authoritative Settlement)
  const executeRefund = useCallback(({
    refundId,
    idempotencyKey = null
  }) => {
    if (!financeProfile.permissions['refund.execute']) {
      showToast('Permission Denied: refund.execute required.', 'error');
      return { success: false, error: 'Permission Denied: refund.execute required.' };
    }

    const request = refundRequests.find((r) => r.id === refundId);
    if (!request) {
      showToast('Refund request not found.', 'error');
      return { success: false, error: 'Refund request not found.' };
    }

    if (request.status !== REFUND_STATUS.APPROVED) {
      showToast(`Cannot execute refund in '${request.status}' state. Must be Approved first.`, 'error');
      return { success: false, error: `Invalid state: ${request.status}` };
    }

    const originalTxn = financialTransactions.find((t) => t.id === request.originalTransactionId);
    if (!originalTxn) {
      showToast('Original transaction missing from ledger.', 'error');
      return { success: false, error: 'Original transaction missing.' };
    }

    if (request.amount > originalTxn.refundableBalance) {
      showToast('Authoritative refundable balance insufficient for execution.', 'error');
      return { success: false, error: 'Insufficient refundable balance.' };
    }

    const nowIso = new Date().toISOString();
    const finalIdempKey = idempotencyKey || request.idempotencyKey || `idemp_exec_${refundId}_${Date.now()}`;
    const providerRefundRef = `re_3Nx${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`;
    const newTxnId = `TXN-${Math.floor(9500 + Math.random() * 500)}`;

    const refundTxn = {
      id: newTxnId,
      folioId: request.folioId,
      reservationId: request.reservationId,
      guestName: request.guestName,
      roomNumber: request.roomNumber,
      type: TRANSACTION_TYPE.REFUND,
      amount: request.amount,
      currency: request.currency,
      paymentMethod: originalTxn.paymentMethod,
      provider: originalTxn.provider,
      providerReference: providerRefundRef,
      authCode: `${refundId}-AUTH`,
      status: TRANSACTION_STATUS.SETTLED,
      reconciliationStatus: RECONCILIATION_STATUS.UNRECONCILED,
      batchId: 'BATCH-2026-10-22-CURRENT',
      capturedBy: `${financeProfile.id} (${financeProfile.name})`,
      timestamp: nowIso,
      fee: -Number((request.amount * 0.029).toFixed(2)),
      net: -request.amount,
      idempotencyKey: finalIdempKey,
      refundableBalance: 0,
      refundHistory: [],
      notes: `Executed refund for ${refundId}: ${request.reason}`,
      timeline: [
        {
          event: 'Refund Dispatched to Gateway',
          timestamp: nowIso,
          actor: `${financeProfile.name} (${financeProfile.role})`,
          details: `Executed via ${originalTxn.provider} (${providerRefundRef}).`
        }
      ]
    };

    setFinancialTransactions((prev) => [
      refundTxn,
      ...prev.map((t) => {
        if (t.id !== originalTxn.id) return t;
        const remaining = Number((t.refundableBalance - request.amount).toFixed(2));
        return {
          ...t,
          refundableBalance: remaining,
          refundHistory: [...(t.refundHistory || []), refundId],
          status: remaining <= 0 ? TRANSACTION_STATUS.REFUNDED : t.status
        };
      })
    ]);

    setRefundRequests((prev) =>
      prev.map((r) => {
        if (r.id !== refundId) return r;
        return {
          ...r,
          status: REFUND_STATUS.COMPLETED,
          executor: {
            id: financeProfile.id,
            name: financeProfile.name,
            role: financeProfile.role
          },
          executedAt: nowIso,
          providerRefundId: providerRefundRef,
          executionNotes: `Executed via gateway (${providerRefundRef}) with idempotency key ${finalIdempKey}.`,
          auditTrail: [
            ...r.auditTrail,
            {
              timestamp: nowIso,
              actor: `${financeProfile.name} (${financeProfile.role})`,
              event: 'Refund Executed',
              details: `Executed via payment provider. Gateway ID: ${providerRefundRef}`
            }
          ]
        };
      })
    );

    setFolios((prev) =>
      prev.map((f) => {
        if (f.folioId !== request.folioId) return f;
        const newRefundEntry = {
          id: `REF-ITEM-${Date.now().toString().slice(-4)}`,
          date: nowIso.split('T')[0],
          amount: request.amount,
          reason: request.reason,
          providerRef: providerRefundRef,
          executedBy: `${financeProfile.id} (${financeProfile.name})`
        };
        const updatedRefunds = [...(f.refunds || []), newRefundEntry];
        const totalCharges = (f.charges || []).reduce((acc, c) => acc + Number(c.amount || 0), 0);
        const totalPayments = (f.payments || []).reduce((acc, p) => acc + Number(p.amount || 0), 0);
        const totalRefunds = updatedRefunds.reduce((acc, r) => acc + Number(r.amount || 0), 0);
        const newBalance = Number((totalCharges - totalPayments + totalRefunds).toFixed(2));
        return {
          ...f,
          refunds: updatedRefunds,
          balance: newBalance,
          status: newBalance <= 0 ? 'Settled' : 'Open'
        };
      })
    );

    logFinancialAudit({
      action: 'EXECUTE_REFUND',
      recordReference: `${refundId} / ${newTxnId}`,
      previousValue: 'Status: Approved',
      newValue: `Status: Completed ($${request.amount.toFixed(2)})`,
      reason: request.reason,
      approvalReference: request.approver ? `${request.approver.name}` : 'Authorized Approver',
      executionResult: 'SUCCESS',
      providerReference: providerRefundRef
    });

    showToast(`Successfully executed refund of $${request.amount.toFixed(2)} via gateway (${providerRefundRef}).`, 'success');
    return { success: true, providerRefundId: providerRefundRef, transactionId: newTxnId };
  }, [financeProfile, refundRequests, financialTransactions, setFolios, logFinancialAudit, showToast]);

  // 10. Run Reconciliation Batch
  const runReconciliationBatch = useCallback(({
    batchId
  }) => {
    if (!financeProfile.permissions['reconciliation.manage']) {
      showToast('Permission Denied: reconciliation.manage required.', 'error');
      return { success: false, error: 'Permission Denied: reconciliation.manage required.' };
    }

    const batch = reconciliationBatches.find((b) => b.batchId === batchId);
    if (!batch) {
      showToast('Batch not found.', 'error');
      return { success: false, error: 'Batch not found.' };
    }

    const nowIso = new Date().toISOString();
    const hasVariance = batch.variance > 0 || batch.unmatchedCount > 0;
    const newStatus = hasVariance ? RECONCILIATION_STATUS.VARIANCE_FLAGGED : RECONCILIATION_STATUS.MATCHED;

    setReconciliationBatches((prev) =>
      prev.map((b) => {
        if (b.batchId !== batchId) return b;
        return {
          ...b,
          status: newStatus,
          reviewedBy: `${financeProfile.id} (${financeProfile.name})`,
          reconciledAt: nowIso
        };
      })
    );

    logFinancialAudit({
      action: 'RUN_RECONCILIATION',
      recordReference: batchId,
      previousValue: `Status: ${batch.status}`,
      newValue: `Status: ${newStatus} (Variance: $${batch.variance.toFixed(2)})`,
      reason: 'Scheduled automated and manual settlement reconciliation',
      approvalReference: 'Operator Action',
      executionResult: newStatus === RECONCILIATION_STATUS.MATCHED ? 'RECONCILED_CLEAN' : 'VARIANCE_FLAGGED',
      providerReference: batch.merchantAccountId
    });

    showToast(
      hasVariance
        ? `Batch ${batchId} reconciled: Variance of $${batch.variance.toFixed(2)} flagged for investigation.`
        : `Batch ${batchId} reconciled successfully with 100% gateway matching.`,
      hasVariance ? 'warning' : 'success'
    );
    return { success: true, status: newStatus };
  }, [financeProfile, reconciliationBatches, logFinancialAudit, showToast]);

  // 11. Manage Financial Discrepancies
  const updateFinancialDiscrepancy = useCallback(({
    discrepancyId,
    status,
    investigationNotes,
    nextAction,
    resolutionDetails
  }) => {
    if (!financeProfile.permissions['discrepancy.manage']) {
      showToast('Permission Denied: discrepancy.manage required.', 'error');
      return { success: false, error: 'Permission Denied: discrepancy.manage required.' };
    }

    const disc = financialDiscrepancies.find((d) => d.id === discrepancyId);
    if (!disc) {
      showToast('Discrepancy not found.', 'error');
      return { success: false, error: 'Discrepancy not found.' };
    }

    const nowIso = new Date().toISOString();

    setFinancialDiscrepancies((prev) =>
      prev.map((d) => {
        if (d.id !== discrepancyId) return d;
        return {
          ...d,
          status: status || d.status,
          investigationNotes: investigationNotes !== undefined ? investigationNotes : d.investigationNotes,
          nextAction: nextAction !== undefined ? nextAction : d.nextAction,
          resolutionDetails: resolutionDetails !== undefined ? resolutionDetails : d.resolutionDetails,
          updatedAt: nowIso
        };
      })
    );

    logFinancialAudit({
      action: 'UPDATE_DISCREPANCY',
      recordReference: discrepancyId,
      previousValue: `Status: ${disc.status}`,
      newValue: `Status: ${status || disc.status}`,
      reason: investigationNotes || 'Updated investigation findings',
      approvalReference: `${financeProfile.name}`,
      executionResult: 'SUCCESS',
      providerReference: disc.linkedTransactionId || 'N/A'
    });

    showToast(`Updated discrepancy ${discrepancyId} (${status || disc.status}).`, 'success');
    return { success: true };
  }, [financeProfile, financialDiscrepancies, logFinancialAudit, showToast]);

  // 12. Export Financial Report with Audit Log
  const exportFinancialReport = useCallback(({
    reportType,
    dateRange = 'All time',
    format = 'CSV'
  }) => {
    if (!financeProfile.permissions['report.export']) {
      showToast('Permission Denied: report.export required to download financial data.', 'error');
      return { success: false, error: 'Permission Denied: report.export required.' };
    }

    logFinancialAudit({
      action: 'EXPORT_FINANCIAL_REPORT',
      recordReference: `REPORT_${reportType.toUpperCase()}`,
      previousValue: 'N/A',
      newValue: `Exported ${format} (${dateRange})`,
      reason: `Authorized data export for ${financeProfile.propertyScope}`,
      approvalReference: 'Audited Operator Access',
      executionResult: 'SUCCESS',
      providerReference: 'SECURE_AUDIT_LOGGED'
    });

    showToast(`Exported ${reportType} (${format}) - Logged in immutable audit trail.`, 'success');
    return { success: true };
  }, [financeProfile, logFinancialAudit, showToast]);

  // Financial Operator Computed KPIs
  const financeKPIs = useMemo(() => {
    const totalPaymentsReceived = financialTransactions
      .filter((t) => t.type === TRANSACTION_TYPE.PAYMENT && (t.status === TRANSACTION_STATUS.SETTLED || t.status === TRANSACTION_STATUS.CAPTURED))
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const awaitingReconciliationCount = financialTransactions
      .filter((t) => t.reconciliationStatus === RECONCILIATION_STATUS.UNRECONCILED && t.status !== TRANSACTION_STATUS.FAILED)
      .length;

    const refundsPendingApprovalCount = refundRequests
      .filter((r) => r.status === REFUND_STATUS.PENDING_APPROVAL)
      .length;

    const refundsAwaitingExecutionCount = refundRequests
      .filter((r) => r.status === REFUND_STATUS.APPROVED)
      .length;

    const openDiscrepanciesCount = financialDiscrepancies
      .filter((d) => d.status === DISCREPANCY_STATUS.OPEN || d.status === DISCREPANCY_STATUS.INVESTIGATING)
      .length;

    const failedReversedCount = financialTransactions
      .filter((t) => t.status === TRANSACTION_STATUS.FAILED || t.status === TRANSACTION_STATUS.REVERSED)
      .length;

    return {
      totalPaymentsReceived,
      awaitingReconciliationCount,
      refundsPendingApprovalCount,
      refundsAwaitingExecutionCount,
      openDiscrepanciesCount,
      failedReversedCount
    };
  }, [financialTransactions, refundRequests, financialDiscrepancies]);

  // -------------------------------------------------------------
  // Security Operations KPIs & Calculations
  // -------------------------------------------------------------
  const securityKPIs = useMemo(() => {
    const activeAlerts = securityAlerts.filter((a) => !a.acknowledged || a.status === 'Active');
    const myActiveIncidents = securityIncidents.filter((inc) => {
      const isMine = inc.assignedTo?.id === 'EMP-601' || (inc.assignedTo?.name && inc.assignedTo.name.includes('Marcus Vance'));
      return isMine && inc.status !== INCIDENT_STATUS.CLOSED;
    });
    const backupAwaiting = securityBackupRequests.filter((b) => b.status === BACKUP_STATUS.REQUESTED || !b.acknowledgedAt);
    const escalationsAwaiting = securityEscalations.filter((e) => !e.acknowledged);
    const pendingHandovers = securityHandovers.filter((h) => h.status === 'Pending Acceptance');
    const awaitingDocumentation = securityIncidents.filter((inc) => {
      return inc.status !== INCIDENT_STATUS.CLOSED && (!inc.notes || inc.notes.length === 0 || !inc.evidenceIds || inc.evidenceIds.length === 0);
    });

    // Secondary metrics
    const safetyLockouts = blockers.filter((b) => b.safetyRestricted && b.status !== BLOCKER_STATUS.RESOLVED);
    const timedIncidents = securityIncidents.filter((inc) => typeof inc.actualResponseMinutes === 'number');
    const avgResponseTime = timedIncidents.length > 0
      ? (timedIncidents.reduce((sum, i) => sum + i.actualResponseMinutes, 0) / timedIncidents.length).toFixed(1)
      : '4.8';

    return {
      activeAlertsCount: activeAlerts.length,
      myActiveIncidentsCount: myActiveIncidents.length,
      backupAwaitingCount: backupAwaiting.length,
      escalationsAwaitingCount: escalationsAwaiting.length,
      pendingHandoversCount: pendingHandovers.length,
      awaitingDocumentationCount: awaitingDocumentation.length,
      safetyLockoutsCount: safetyLockouts.length,
      officersOnDutyCount: 4,
      avgResponseTimeMinutes: avgResponseTime
    };
  }, [securityAlerts, securityIncidents, securityBackupRequests, securityEscalations, securityHandovers, blockers]);

  // Security Responder Actions
  const acknowledgeSecurityAlert = useCallback((alertId) => {
    setSecurityAlerts((prev) =>
      prev.map((alt) => {
        if (alt.id === alertId) {
          return {
            ...alt,
            acknowledged: true,
            acknowledgedBy: 'Marcus Vance (EMP-601)',
            acknowledgedAt: new Date().toISOString(),
            status: 'Investigating'
          };
        }
        return alt;
      })
    );
    showToast(`Alert ${alertId} acknowledged. Incident remains open for response.`, 'info');
  }, [showToast]);

  const createIncidentFromAlert = useCallback((alertId, overrides = {}) => {
    const alert = securityAlerts.find((a) => a.id === alertId);
    const newId = `INC-${800 + securityIncidents.length + 1}`;
    const newIncident = {
      id: newId,
      title: overrides.title || alert?.title || `Incident from Alert ${alertId}`,
      category: overrides.category || alert?.category || 'Security Alert',
      severity: overrides.severity || alert?.severity || INCIDENT_SEVERITY.HIGH,
      location: overrides.location || alert?.location || 'Hotel Grounds',
      status: INCIDENT_STATUS.ACKNOWLEDGED,
      reportedAt: alert?.timestamp || new Date().toISOString(),
      assignedTo: {
        id: 'EMP-601',
        name: 'Marcus Vance',
        role: 'Lead Security Responder',
        radioChannel: 'CH 03'
      },
      reportedBy: alert?.source || 'Security Alarm Telemetry',
      acknowledgedAt: new Date().toISOString(),
      respondingAt: null,
      targetResponseMinutes: alert?.severity === INCIDENT_SEVERITY.EMERGENCY ? 5 : 10,
      actualResponseMinutes: null,
      description: overrides.description || alert?.description || 'Incident initiated from alarm telemetry.',
      nextAction: 'Initiate physical patrol / on-scene verification.',
      notes: [
        {
          id: `NOT-${Date.now()}`,
          author: 'Marcus Vance (EMP-601)',
          timestamp: new Date().toISOString(),
          text: `Converted from alert ${alertId}.`
        }
      ],
      timeline: [
        { event: `Generated from Alert ${alertId}`, actor: 'Marcus Vance', timestamp: new Date().toISOString() },
        { event: 'Assigned to Officer Vance', actor: 'System', timestamp: new Date().toISOString() }
      ],
      evidenceIds: [],
      linkedAlert: alertId,
      closureDetails: null
    };

    setSecurityIncidents((prev) => [newIncident, ...prev]);
    setSecurityAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true, status: 'Linked to Incident', linkedIncidentId: newId } : a))
    );
    showToast(`Created incident ${newId} from alert ${alertId}`, 'success');
    return newIncident;
  }, [securityAlerts, securityIncidents, showToast]);

  const createSecurityIncident = useCallback((incidentData) => {
    const newId = `INC-${800 + securityIncidents.length + 1}`;
    const newIncident = {
      id: newId,
      title: incidentData.title,
      category: incidentData.category || 'Security Occurrence',
      severity: incidentData.severity || INCIDENT_SEVERITY.MEDIUM,
      location: incidentData.location || 'Hotel Grounds',
      status: INCIDENT_STATUS.OPEN,
      reportedAt: new Date().toISOString(),
      assignedTo: incidentData.assignedTo || {
        id: 'EMP-601',
        name: 'Marcus Vance',
        role: 'Lead Security Responder',
        radioChannel: 'CH 03'
      },
      reportedBy: incidentData.reportedBy || 'Marcus Vance (EMP-601)',
      acknowledgedAt: incidentData.acknowledged ? new Date().toISOString() : null,
      respondingAt: null,
      targetResponseMinutes: incidentData.targetResponseMinutes || (incidentData.severity === INCIDENT_SEVERITY.EMERGENCY ? 5 : 15),
      actualResponseMinutes: null,
      description: incidentData.description || '',
      nextAction: incidentData.nextAction || 'Assess situation and confirm responder assignment.',
      notes: incidentData.initialNote ? [
        {
          id: `NOT-${Date.now()}`,
          author: 'Marcus Vance (EMP-601)',
          timestamp: new Date().toISOString(),
          text: incidentData.initialNote
        }
      ] : [],
      timeline: [
        { event: 'Incident Created', actor: 'Marcus Vance', timestamp: new Date().toISOString() }
      ],
      evidenceIds: [],
      linkedBlocker: incidentData.linkedBlocker || null,
      closureDetails: null
    };

    setSecurityIncidents((prev) => [newIncident, ...prev]);
    showToast(`Security Incident ${newId} created successfully.`, 'success');
    return newIncident;
  }, [securityIncidents, showToast]);

  const updateSecurityIncidentStatus = useCallback((incidentId, newStatus, reason = '') => {
    setSecurityIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const nowStr = new Date().toISOString();
          const respondingAt = newStatus === INCIDENT_STATUS.RESPONDING && !inc.respondingAt ? nowStr : inc.respondingAt;
          let actualResponseMinutes = inc.actualResponseMinutes;
          if (newStatus === INCIDENT_STATUS.RESPONDING && inc.reportedAt && !actualResponseMinutes) {
            const diffMin = Math.max(1, Math.round((new Date(nowStr) - new Date(inc.reportedAt)) / 60000));
            actualResponseMinutes = diffMin;
          }
          return {
            ...inc,
            status: newStatus,
            respondingAt,
            actualResponseMinutes,
            timeline: [
              { event: `Status updated to ${newStatus}${reason ? `: ${reason}` : ''}`, actor: 'Marcus Vance', timestamp: nowStr },
              ...(inc.timeline || [])
            ]
          };
        }
        return inc;
      })
    );
    showToast(`Incident ${incidentId} transitioned to ${newStatus}`, 'info');
  }, [showToast]);

  const addSecurityIncidentNote = useCallback((incidentId, noteText) => {
    if (!noteText?.trim()) return;
    const nowStr = new Date().toISOString();
    const newNote = {
      id: `NOT-${Date.now()}`,
      author: 'Marcus Vance (EMP-601)',
      timestamp: nowStr,
      text: noteText.trim()
    };
    setSecurityIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            notes: [...(inc.notes || []), newNote],
            timeline: [
              { event: 'Incident Note Added', actor: 'Marcus Vance', timestamp: nowStr },
              ...(inc.timeline || [])
            ]
          };
        }
        return inc;
      })
    );
    showToast(`Note added to ${incidentId}`, 'success');
  }, [showToast]);

  const requestSecurityBackup = useCallback((backupData) => {
    const newId = `BAK-${300 + securityBackupRequests.length + 1}`;
    const nowStr = new Date().toISOString();
    const newRequest = {
      id: newId,
      incidentId: backupData.incidentId,
      incidentTitle: backupData.incidentTitle || 'Security Incident Assistance',
      location: backupData.location || 'Hotel Premises',
      requestedSupport: backupData.requestedSupport || 'Secondary Officer Standby',
      priority: backupData.priority || INCIDENT_SEVERITY.HIGH,
      requestingOfficer: 'Marcus Vance (EMP-601)',
      requestedAt: nowStr,
      assignedBackupOfficer: null,
      status: BACKUP_STATUS.REQUESTED,
      acknowledgedAt: null,
      arrivedAt: null,
      reason: backupData.reason || 'SOP requires secondary officer presence.'
    };

    setSecurityBackupRequests((prev) => [newRequest, ...prev]);

    if (backupData.incidentId) {
      setSecurityIncidents((prev) =>
        prev.map((inc) => {
          if (inc.id === backupData.incidentId) {
            return {
              ...inc,
              timeline: [
                { event: `Backup Requested (${newId}: ${backupData.requestedSupport})`, actor: 'Marcus Vance', timestamp: nowStr },
                ...(inc.timeline || [])
              ]
            };
          }
          return inc;
        })
      );
    }

    showToast(`Backup request ${newId} dispatched to on-duty security team.`, 'warning');
    return newRequest;
  }, [securityBackupRequests, showToast]);

  const updateBackupRequestStatus = useCallback((requestId, newStatus, officerName = 'Sarah O’Connor (EMP-604)') => {
    const nowStr = new Date().toISOString();
    setSecurityBackupRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const updated = { ...req, status: newStatus };
          if (newStatus === BACKUP_STATUS.ACKNOWLEDGED) {
            updated.acknowledgedAt = nowStr;
            updated.assignedBackupOfficer = req.assignedBackupOfficer || officerName;
          } else if (newStatus === BACKUP_STATUS.RESPONDING) {
            updated.assignedBackupOfficer = req.assignedBackupOfficer || officerName;
            if (!updated.acknowledgedAt) updated.acknowledgedAt = nowStr;
          } else if (newStatus === BACKUP_STATUS.ARRIVED) {
            updated.arrivedAt = nowStr;
          }
          return updated;
        }
        return req;
      })
    );
    showToast(`Backup ${requestId} updated to ${newStatus}`, 'info');
  }, [showToast]);

  const escalateSecurityIncident = useCallback((escalationData) => {
    const newId = `ESC-${200 + securityEscalations.length + 1}`;
    const nowStr = new Date().toISOString();
    const newEscalation = {
      id: newId,
      incidentId: escalationData.incidentId,
      incidentTitle: escalationData.incidentTitle || 'Escalated Security Concern',
      severity: escalationData.severity || INCIDENT_SEVERITY.HIGH,
      reason: escalationData.reason,
      currentOwner: 'Marcus Vance (EMP-601)',
      destinationRole: escalationData.destinationRole || 'Operations Manager & General Manager',
      destinationContact: escalationData.destinationContact || 'Elena Rostova (x2001) / Arthur Pendelton (x1001)',
      escalatedAt: nowStr,
      acknowledged: false,
      acknowledgedBy: null,
      acknowledgedAt: null,
      responseDeadline: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      nextAction: escalationData.nextAction || 'Awaiting executive authorization or command response.'
    };

    setSecurityEscalations((prev) => [newEscalation, ...prev]);

    if (escalationData.incidentId) {
      setSecurityIncidents((prev) =>
        prev.map((inc) => {
          if (inc.id === escalationData.incidentId) {
            return {
              ...inc,
              timeline: [
                { event: `Escalated (${newId}: to ${newEscalation.destinationRole})`, actor: 'Marcus Vance', timestamp: nowStr },
                ...(inc.timeline || [])
              ]
            };
          }
          return inc;
        })
      );
    }

    showToast(`Incident escalated to ${newEscalation.destinationRole} (${newId})`, 'warning');
    return newEscalation;
  }, [securityEscalations, showToast]);

  const uploadSecurityEvidence = useCallback((evidenceData) => {
    const newId = `EVD-${100 + securityEvidence.length + 1}`;
    const nowStr = new Date().toISOString();
    const newEvidence = {
      id: newId,
      incidentId: evidenceData.incidentId,
      title: evidenceData.title,
      category: evidenceData.category || 'Photographic',
      fileType: evidenceData.fileType || 'Image JPEG / 4K Stream',
      fileSize: evidenceData.fileSize || '2.4 MB',
      uploadedBy: 'Marcus Vance (EMP-601)',
      uploadedAt: nowStr,
      isProtected: true, // Evidence records are legally protected from deletion
      chainOfCustody: [
        { action: 'Captured and Encrypted into Digital Vault', actor: 'Marcus Vance', timestamp: nowStr },
        { action: 'SHA-256 Checksum Verified for Chain-of-Custody', actor: 'StayOps Security Vault', timestamp: nowStr }
      ],
      notes: evidenceData.notes || 'Evidence stored with immutable chain-of-custody stamp.'
    };

    setSecurityEvidence((prev) => [newEvidence, ...prev]);

    if (evidenceData.incidentId) {
      setSecurityIncidents((prev) =>
        prev.map((inc) => {
          if (inc.id === evidenceData.incidentId) {
            return {
              ...inc,
              evidenceIds: [...(inc.evidenceIds || []), newId],
              timeline: [
                { event: `Evidence Uploaded (${newId}: ${evidenceData.title})`, actor: 'Marcus Vance', timestamp: nowStr },
                ...(inc.timeline || [])
              ]
            };
          }
          return inc;
        })
      );
    }

    showToast(`Evidence ${newId} encrypted and vaulted with immutable hash.`, 'success');
    return newEvidence;
  }, [securityEvidence, showToast]);

  const createSecurityHandover = useCallback((handoverData) => {
    const newId = `SHO-${500 + securityHandovers.length + 1}`;
    const nowStr = new Date().toISOString();
    const newHandover = {
      id: newId,
      outgoingOfficer: 'Marcus Vance (EMP-601)',
      outgoingShift: handoverData.outgoingShift || 'Night Watch (20:00 – 06:00)',
      incomingOfficer: handoverData.incomingOfficer || 'Gabriel Thorne (EMP-607)',
      incomingShift: handoverData.incomingShift || 'Morning Watch (06:00 – 14:00)',
      status: 'Pending Acceptance',
      submittedAt: nowStr,
      acceptedAt: null,
      watchSummary: handoverData.watchSummary || 'Routine watch completed with active priority investigations.',
      unresolvedItems: handoverData.unresolvedItems || [],
      equipmentChecklist: handoverData.equipmentChecklist || {
        radioHandsets: '8 / 8 accounted for',
        masterKeys: '4 security override fobs secured in safe',
        bodyCameras: '6 units docked and uploading footage',
        firstAidDefibrillator: 'AED battery tested green / pads sealed'
      }
    };

    setSecurityHandovers((prev) => [newHandover, ...prev]);
    showToast(`Shift handover ${newId} logged. Awaiting receiving officer acceptance.`, 'info');
    return newHandover;
  }, [securityHandovers, showToast]);

  const acknowledgeSecurityHandover = useCallback((handoverId, incomingOfficer = 'Gabriel Thorne (EMP-607)') => {
    const nowStr = new Date().toISOString();
    setSecurityHandovers((prev) =>
      prev.map((h) => {
        if (h.id === handoverId) {
          return {
            ...h,
            status: 'Accepted',
            incomingOfficer: h.incomingOfficer || incomingOfficer,
            acceptedAt: nowStr
          };
        }
        return h;
      })
    );
    showToast(`Handover ${handoverId} formally accepted. Watch transfer complete.`, 'success');
  }, [showToast]);

  const closeSecurityIncident = useCallback((incidentId, closureDetails = {}) => {
    const nowStr = new Date().toISOString();
    setSecurityIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: INCIDENT_STATUS.CLOSED,
            closureDetails: {
              closedBy: closureDetails.closedBy || 'Marcus Vance (EMP-601)',
              closedAt: nowStr,
              resolutionSummary: closureDetails.resolutionSummary || 'Incident resolved and verified on scene.',
              policeNotified: !!closureDetails.policeNotified
            },
            timeline: [
              {
                event: `Incident Formally Closed: ${closureDetails.resolutionSummary || 'Resolved'}`,
                actor: 'Marcus Vance',
                timestamp: nowStr
              },
              ...(inc.timeline || [])
            ]
          };
        }
        return inc;
      })
    );
    showToast(`Incident ${incidentId} authorized and closed with audit seal.`, 'success');
  }, [showToast]);

  // ==========================================
  // PLATFORM ADMINISTRATOR ACTIONS & GOVERNANCE
  // ==========================================
  const logAdminEvent = useCallback(({ actor, action, affectedResource, outcome = 'Success', changeSummary, correlationId }) => {
    const newEntry = {
      id: `ADM-LOG-${Math.floor(100 + Math.random() * 899)}`,
      timestamp: new Date().toISOString(),
      actor: actor || `${currentUser?.name || 'Alexandre Vance'} (${currentUser?.id || 'EMP-099'})`,
      action,
      affectedResource,
      outcome,
      changeSummary,
      correlationId: correlationId || `req_${Math.random().toString(36).substring(2, 9)}`
    };
    setAdminAuditLogs((prev) => [newEntry, ...prev]);
    return newEntry;
  }, [currentUser]);

  const addUser = useCallback((userData) => {
    const newId = `EMP-${Math.floor(200 + Math.random() * 799)}`;
    const nowIso = new Date().toISOString();
    const newUser = {
      id: newId,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'Task Fulfiller',
      roleKey: normalizeRole(userData.role || 'Task Fulfiller'),
      department: userData.department || 'Operations Support',
      status: userData.status || 'Active',
      accountStatus: userData.status || 'Active',
      assignedRoles: [userData.role || 'Task Fulfiller'],
      phoneExt: userData.phoneExt || `x${Math.floor(1000 + Math.random() * 8999)}`,
      createdAt: nowIso,
      lastLogin: null,
      mfaEnabled: Boolean(userData.mfaEnabled),
      isProtectedAdmin: false,
      accessHistory: [
        {
          timestamp: nowIso,
          action: 'User Account Provisioned',
          ip: '10.0.4.12',
          terminal: 'NOC-B1'
        }
      ]
    };

    setPlatformUsers((prev) => [newUser, ...prev]);
    logAdminEvent({
      action: 'USER_CREATE',
      affectedResource: `User:${newId} (${newUser.name})`,
      outcome: 'Success',
      changeSummary: `Provisioned new user profile in department ${newUser.department} with role ${newUser.role}.`
    });
    showToast(`User account created for ${newUser.name} (${newId})`, 'success');
    return newUser;
  }, [logAdminEvent, showToast]);

  const updateUser = useCallback((userId, updates) => {
    setPlatformUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            ...updates,
            roleKey: updates.role ? normalizeRole(updates.role) : u.roleKey,
            assignedRoles: updates.role ? [updates.role] : u.assignedRoles
          };
        }
        return u;
      })
    );

    logAdminEvent({
      action: 'USER_UPDATE',
      affectedResource: `User:${userId}`,
      outcome: 'Success',
      changeSummary: `Updated profile attributes for user ${userId}.`
    });
    showToast(`User ${userId} profile updated.`, 'info');
  }, [logAdminEvent, showToast]);

  const toggleUserStatus = useCallback((userId, reason = 'Administrative update') => {
    const target = platformUsers.find((u) => u.id === userId);
    if (!target) return;

    // Guard: Prevent locking out platform by deactivating the last/protected administrator
    if (
      (target.isProtectedAdmin || target.roleKey === 'platform_admin' || target.role?.toLowerCase().includes('admin')) &&
      target.status === 'Active'
    ) {
      const activeAdminCount = platformUsers.filter(
        (u) => (u.roleKey === 'platform_admin' || u.role?.toLowerCase().includes('admin')) && u.status === 'Active'
      ).length;

      if (activeAdminCount <= 1 || target.isProtectedAdmin) {
        showToast('Security Alert: Cannot deactivate the primary or final Platform Administrator account. Access control lock-out prevented.', 'error');
        return;
      }
    }

    const nextStatus = target.status === 'Active' ? 'Inactive' : 'Active';

    setPlatformUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: nextStatus, accountStatus: nextStatus } : u))
    );

    logAdminEvent({
      action: nextStatus === 'Active' ? 'USER_ACTIVATE' : 'USER_DEACTIVATE',
      affectedResource: `User:${userId} (${target.name})`,
      outcome: 'Success',
      changeSummary: `Status transitioned to ${nextStatus}. Justification: ${reason}`
    });

    showToast(`User ${target.name} is now ${nextStatus}.`, 'info');
  }, [platformUsers, logAdminEvent, showToast]);

  const updateUserRole = useCallback((userId, newRoleTitle, reason = 'Role recalibration') => {
    const target = platformUsers.find((u) => u.id === userId);
    if (!target) return;

    const newKey = normalizeRole(newRoleTitle);

    // Guard: Prevent revoking admin from last active admin
    if (
      (target.isProtectedAdmin || target.roleKey === 'platform_admin') &&
      newKey !== 'platform_admin'
    ) {
      const activeAdminCount = platformUsers.filter(
        (u) => (u.roleKey === 'platform_admin' || u.role?.toLowerCase().includes('admin')) && u.status === 'Active'
      ).length;

      if (activeAdminCount <= 1) {
        showToast('Security Alert: Cannot reassign the last remaining active Platform Administrator.', 'error');
        return;
      }
    }

    setPlatformUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            role: newRoleTitle,
            roleKey: newKey,
            assignedRoles: [newRoleTitle]
          };
        }
        return u;
      })
    );

    logAdminEvent({
      action: 'ROLE_ASSIGNMENT_CHANGE',
      affectedResource: `User:${userId} (${target.name})`,
      outcome: 'Success',
      changeSummary: `Assigned role changed from ${target.role} to ${newRoleTitle}. Justification: ${reason}`
    });

    showToast(`Role for ${target.name} updated to ${newRoleTitle}.`, 'success');
  }, [platformUsers, logAdminEvent, showToast]);

  const triggerIntegrationHealthCheck = useCallback((integrationId) => {
    const target = integrations.find((i) => i.id === integrationId);
    if (!target) return;

    const simulatedLatency = Math.floor(15 + Math.random() * 45);
    const nowIso = new Date().toISOString();

    setIntegrations((prev) =>
      prev.map((i) => {
        if (i.id === integrationId) {
          return {
            ...i,
            status: 'Operational',
            latencyMs: simulatedLatency,
            lastCheck: nowIso,
            errorSummary: null,
            diagnostic: `Active ping test passed at ${new Date().toLocaleTimeString()}. Round-trip time: ${simulatedLatency}ms. All health probes responding nominal.`
          };
        }
        return i;
      })
    );

    logAdminEvent({
      action: 'INTEGRATION_HEALTH_CHECK',
      affectedResource: `Integration:${integrationId} (${target.name})`,
      outcome: 'Success',
      changeSummary: `Interactive diagnostic check passed with ${simulatedLatency}ms latency.`
    });

    showToast(`Health check confirmed: ${target.name} is Operational (${simulatedLatency}ms).`, 'success');
  }, [integrations, logAdminEvent, showToast]);

  const updateSystemConfig = useCallback((section, values, auditReason = 'Administrative policy update') => {
    setSystemConfig((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        ...values
      }
    }));

    logAdminEvent({
      action: 'SYSTEM_CONFIG_UPDATE',
      affectedResource: `Config:${section}`,
      outcome: 'Success',
      changeSummary: `Updated configuration settings for section "${section}". Rationale: ${auditReason}`
    });

    showToast(`System settings for ${section} successfully updated and audited.`, 'success');
  }, [logAdminEvent, showToast]);

  const triggerCreateBackup = useCallback((options = {}) => {
    const backupId = `BKP-${new Date().toISOString().slice(0, 10)}-${Math.floor(100 + Math.random() * 899)}`;
    const nowIso = new Date().toISOString();
    const sizeMb = Number((415 + Math.random() * 35).toFixed(1));
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newBackup = {
      id: backupId,
      timestamp: nowIso,
      status: 'Confirmed Success',
      destination: 'AWS S3 Immutable Vault (us-east-1)',
      sizeMb,
      checksum: `sha256:${randomHex}`,
      triggeredBy: `${currentUser?.name || 'Alexandre Vance'} (${currentUser?.id || 'EMP-099'})`,
      retentionDays: 30,
      backupType: options.backupType || 'Full System Snapshot (Ledger, Tasks, Users, Evidence Index)',
      verifyResult: 'Integrity Check Passed (0 corrupted blocks)',
      lastFailure: null
    };

    setBackups((prev) => [newBackup, ...prev]);

    logAdminEvent({
      action: 'CREATE_BACKUP_SNAPSHOT',
      affectedResource: `Backup:${backupId}`,
      outcome: 'Success',
      changeSummary: `Created manual backup snapshot ${backupId} (${sizeMb} MB) with confirmed SHA-256 integrity seal.`
    });

    showToast(`Backup snapshot ${backupId} generated and cryptographically sealed.`, 'success');
    return newBackup;
  }, [currentUser, logAdminEvent, showToast]);

  const triggerRestoreBackup = useCallback((backupId, rationale) => {
    if (!rationale || !rationale.trim()) {
      showToast('A certified business rationale is strictly required to execute recovery.', 'error');
      return false;
    }

    logAdminEvent({
      action: 'RESTORE_BACKUP_EXECUTION',
      affectedResource: `Backup:${backupId}`,
      outcome: 'Success',
      changeSummary: `Authorized restore procedure validated for snapshot ${backupId}. Justification: ${rationale}`
    });

    showToast(`Recovery verification complete for snapshot ${backupId}. System state verified intact.`, 'success');
    return true;
  }, [logAdminEvent, showToast]);

  // ==========================================
  // EXECUTIVE VIEWER/APPROVER ACTIONS & DELEGATION
  // ==========================================
  const approveExecutiveRecovery = useCallback((recoveryId, notes = '') => {
    const request = recoveryRequests.find((r) => r.id === recoveryId);
    if (!request) return;

    // Separation of Duties check: cannot approve own request
    if (request.requestingEmployee?.id === currentUser?.id) {
      showToast('Governance Violation: Separation of duties prevents self-approval of recovery submissions.', 'error');
      return;
    }

    const nowIso = new Date().toISOString();
    setRecoveryRequests((prev) =>
      prev.map((r) => {
        if (r.id === recoveryId) {
          return {
            ...r,
            status: RECOVERY_STATUS.APPROVED,
            decidedAt: nowIso,
            decidedBy: `${currentUser?.name || 'Victoria Montgomery'} (Executive Approver)`,
            decisionReason: notes || 'Authorized under delegated Executive Authority ($10,000 limit)',
            history: [
              ...(r.history || []),
              {
                id: `RHIS-${Date.now()}`,
                timestamp: nowIso,
                actor: `${currentUser?.name || 'Victoria Montgomery'} (Executive Approver)`,
                action: 'Executive Approval Granted',
                details: notes || 'Approved under Executive Authority limit.'
              }
            ]
          };
        }
        return r;
      })
    );

    // If related complaint exists, update it
    if (request.complaintId) {
      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id === request.complaintId) {
            return {
              ...c,
              status: COMPLAINT_STATUS.ACTION_IN_PROGRESS,
              notes: `${c.notes || ''} | Executive recovery ${recoveryId} approved ($${request.amount}).`
            };
          }
          return c;
        })
      );
    }

    showToast(`Executive approval recorded for ${recoveryId} ($${request.amount}).`, 'success');
  }, [recoveryRequests, currentUser, showToast]);

  const rejectExecutiveRecovery = useCallback((recoveryId, reason) => {
    if (!reason || !reason.trim()) {
      showToast('A formal rejection rationale is strictly required for the governance audit trail.', 'error');
      return;
    }

    const nowIso = new Date().toISOString();
    setRecoveryRequests((prev) =>
      prev.map((r) => {
        if (r.id === recoveryId) {
          return {
            ...r,
            status: RECOVERY_STATUS.REJECTED,
            decidedAt: nowIso,
            decidedBy: `${currentUser?.name || 'Victoria Montgomery'} (Executive Approver)`,
            decisionReason: reason,
            history: [
              ...(r.history || []),
              {
                id: `RHIS-${Date.now()}`,
                timestamp: nowIso,
                actor: `${currentUser?.name || 'Victoria Montgomery'} (Executive Approver)`,
                action: 'Executive Request Rejected',
                details: reason
              }
            ]
          };
        }
        return r;
      })
    );

    showToast(`Recovery request ${recoveryId} rejected with audit rationale recorded.`, 'info');
  }, [currentUser, showToast]);

  const requestMoreInfoExecutive = useCallback((requestId, categoryOrNote, maybeNote) => {
    let category = 'recovery';
    let note = '';
    if (maybeNote !== undefined) {
      category = categoryOrNote;
      note = maybeNote;
    } else {
      note = categoryOrNote;
      category = String(requestId).startsWith('REF') ? 'refund' : 'recovery';
    }

    if (!note || !note.trim()) {
      showToast('An inquiry note is required to request additional information.', 'error');
      return;
    }

    const nowIso = new Date().toISOString();

    if (category === 'recovery') {
      setRecoveryRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId) {
            return {
              ...r,
              decisionReason: `Executive Inquiry: ${note}`,
              history: [
                ...(r.history || []),
                {
                  id: `RHIS-${Date.now()}`,
                  timestamp: nowIso,
                  actor: `${currentUser?.name || 'Victoria Montgomery'} (Executive Approver)`,
                  action: 'Information Requested',
                  details: note
                }
              ]
            };
          }
          return r;
        })
      );
    } else if (category === 'refund') {
      setRefundRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId) {
            return {
              ...r,
              approvalNotes: `Executive Inquiry: ${note}`,
              auditTrail: [
                ...(r.auditTrail || []),
                {
                  timestamp: nowIso,
                  actor: currentUser?.name || 'Victoria Montgomery',
                  event: 'Information Requested',
                  details: note
                }
              ]
            };
          }
          return r;
        })
      );
    }

    showToast(`Executive information request dispatched for ${requestId}.`, 'info');
  }, [currentUser, showToast]);

  const approveExecutiveRefund = useCallback((refundId, notes = '') => {
    const request = refundRequests.find((r) => r.id === refundId);
    if (!request) return;

    // Separation of duties: cannot approve own submission
    if (request.requester?.id === currentUser?.id) {
      showToast('Governance Violation: Separation of duties prohibits self-approval of refund requests.', 'error');
      return;
    }

    // Limit check: Executive limit is $10,000
    if (request.amount > 10000) {
      showToast('Authority Limit Exceeded: Amounts greater than $10,000 require Board of Directors sign-off.', 'error');
      return;
    }

    const nowIso = new Date().toISOString();

    // Critical Separation of Duties: Executive APPROVES, but does NOT execute payment!
    // Status transitions to 'Approved', ready for Financial Operator gateway dispatch.
    setRefundRequests((prev) =>
      prev.map((r) => {
        if (r.id === refundId) {
          return {
            ...r,
            status: REFUND_STATUS.APPROVED,
            approver: {
              id: currentUser?.id || 'EMP-001',
              name: currentUser?.name || 'Victoria Montgomery',
              role: currentUser?.role || 'Executive Viewer/Approver'
            },
            approvedAt: nowIso,
            approvalNotes: notes || 'Approved under Executive Authority limit ($10,000.00). Queued for Finance Operator execution.',
            auditTrail: [
              ...(r.auditTrail || []),
              {
                timestamp: nowIso,
                actor: `${currentUser?.name || 'Victoria Montgomery'} (Executive Approver)`,
                event: 'Executive Refund Approved',
                details: `Authorized $${request.amount.toFixed(2)} refund. Queued for Financial Operator gateway execution.`
              }
            ]
          };
        }
        return r;
      })
    );

    // Record in immutable financial audit trail
    const auditRecord = {
      id: `FAUD-EX-${Date.now().toString().slice(-4)}`,
      timestamp: nowIso,
      actor: `${currentUser?.name || 'Victoria Montgomery'} (Executive Approver)`,
      action: 'APPROVE_REFUND',
      recordReference: refundId,
      amount: request.amount,
      reason: notes || 'Executive sign-off granted within $10,000 policy threshold.',
      result: 'Approved - Queued for Gateway Execution'
    };
    setFinancialAuditLogs((prev) => [auditRecord, ...prev]);

    showToast(`Refund ${refundId} ($${request.amount.toFixed(2)}) approved. Ready for Financial Operator execution.`, 'success');
  }, [refundRequests, currentUser, showToast]);

  const rejectExecutiveRefund = useCallback((refundId, reason) => {
    if (!reason || !reason.trim()) {
      showToast('A formal rejection rationale is strictly required for the audit trail.', 'error');
      return;
    }

    const request = refundRequests.find((r) => r.id === refundId);
    const nowIso = new Date().toISOString();

    setRefundRequests((prev) =>
      prev.map((r) => {
        if (r.id === refundId) {
          return {
            ...r,
            status: REFUND_STATUS.REJECTED,
            approver: {
              id: currentUser?.id || 'EMP-001',
              name: currentUser?.name || 'Victoria Montgomery',
              role: currentUser?.role || 'Executive Viewer/Approver'
            },
            approvedAt: nowIso,
            approvalNotes: reason,
            auditTrail: [
              ...(r.auditTrail || []),
              {
                timestamp: nowIso,
                actor: `${currentUser?.name || 'Victoria Montgomery'} (Executive Approver)`,
                event: 'Executive Refund Rejected',
                details: reason
              }
            ]
          };
        }
        return r;
      })
    );

    // Record in financial audit trail
    const auditRecord = {
      id: `FAUD-EX-${Date.now().toString().slice(-4)}`,
      timestamp: nowIso,
      actor: `${currentUser?.name || 'Victoria Montgomery'} (Executive Approver)`,
      action: 'REJECT_REFUND',
      recordReference: refundId,
      amount: request?.amount || 0,
      reason,
      result: 'Rejected'
    };
    setFinancialAuditLogs((prev) => [auditRecord, ...prev]);

    showToast(`Refund ${refundId} rejected by Executive. Reason recorded in audit trail.`, 'info');
  }, [refundRequests, currentUser, showToast]);

  const escalateExecutiveCase = useCallback((caseId, instructions) => {
    showToast(`Executive escalation directive issued for case ${caseId}.`, 'success');
  }, [showToast]);

  const markExecutiveNotificationAsRead = useCallback((notifId) => {
    setExecutiveNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  }, []);

  // ==========================================
  // COMPUTED EXECUTIVE & ADMIN KPIS
  // ==========================================
  const executiveKPIs = useMemo(() => {
    const activeTasks = tasks.filter((t) => t.status !== TASK_STATUS.COMPLETED && t.status !== 'Cancelled');
    const overdueTasks = tasks.filter((t) => isOverdue(t.dueAt, t.status) && t.status !== TASK_STATUS.COMPLETED);
    const openComplaints = complaints.filter(
      (c) => c.status !== COMPLAINT_STATUS.RESOLVED && c.status !== 'Closed'
    );
    const seriousIncidents = securityIncidents.filter(
      (i) => (i.severity === INCIDENT_SEVERITY.EMERGENCY || i.severity === INCIDENT_SEVERITY.HIGH) && i.status !== INCIDENT_STATUS.CLOSED
    );
    const pendingRecovery = recoveryRequests.filter((r) => r.status === RECOVERY_STATUS.PENDING);
    const pendingRefunds = refundRequests.filter((r) => r.status === REFUND_STATUS.PENDING_APPROVAL);

    const slaAnalysis = computeDepartmentSlaMetrics(tasks, slaConfig);

    return {
      totalActiveTasks: activeTasks.length,
      slaComplianceRate: slaAnalysis.slaComplianceRate !== null ? slaAnalysis.slaComplianceRate : 94,
      overdueTasksCount: overdueTasks.length,
      openComplaintsCount: openComplaints.length,
      activeSeriousIncidentsCount: seriousIncidents.length,
      pendingApprovalsCount: pendingRecovery.length + pendingRefunds.length,
      lastRefreshTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }, [tasks, complaints, securityIncidents, recoveryRequests, refundRequests, slaConfig]);

  const adminKPIs = useMemo(() => {
    const activeUsers = platformUsers.filter((u) => u.status === 'Active');
    const pendingAccess = platformUsers.filter((u) => u.status === 'Pending Review');
    const healthyIntegrations = integrations.filter((i) => i.status === 'Operational');

    return {
      totalRegisteredUsers: platformUsers.length,
      activeAccountsCount: activeUsers.length,
      pendingAccessCount: pendingAccess.length,
      healthyIntegrationsCount: healthyIntegrations.length,
      totalIntegrationsCount: integrations.length,
      recentAdminEventsCount: adminAuditLogs.length,
      latestBackup: backups[0] || null
    };
  }, [platformUsers, integrations, adminAuditLogs, backups]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const value = {
    // Shared state
    tasks,
    staff: enrichedStaff,
    rawStaff: staffList,
    notifications,
    unreadNotificationsCount,
    toast,
    showToast,
    hideToast,
    resetToMockData,

    // Dispatcher
    summaryMetrics,
    dispatcherProfile: DISPATCHER_PROFILE,
    createTask,
    assignTask,
    unassignTask,
    updateTask,
    recordDelay,
    recordGuestCommunication,
    escalateTask,

    // Supervisor state & metrics
    supervisorMetrics,
    supervisorProfile: SUPERVISOR_PROFILE,
    blockers,
    correctiveActions,
    handovers,
    recentActivities,
    workloadThresholds,
    setWorkloadThresholds,

    // Supervisor actions
    reassignSupervisorTask,
    inspectTask,
    createBlocker,
    updateBlocker,
    resolveBlocker,
    createCorrectiveAction,
    updateCorrectiveAction,
    resolveCorrectiveAction,
    createHandover,
    acknowledgeHandover,
    escalateSupervisorTask,

    // Department Manager State & Metrics
    managerProfile: MANAGER_PROFILE,
    managerRoleInfo: MANAGER_ROLE_INFO,
    managerMetrics,
    complaints,
    recoveryRequests,
    staffSchedules,
    slaConfig,

    // Department Manager Actions
    approveRecoveryRequest,
    rejectRecoveryRequest,
    escalateRecoveryRequest,
    createRecoveryRequest,
    assignComplaintOwner,
    updateComplaintStatus,
    escalateComplaint,
    updateStaffSchedule,
    managerInterveneTask,
    updateSlaConfig,

    // Front Desk Coordinator State & Role Info
    frontDeskProfile,
    frontDeskRoleInfo: FRONTDESK_ROLE_INFO,
    frontDeskMetrics,
    rooms,
    reservations,
    roomMoves,
    wakeUpCalls,
    guestCommunications,
    frontDeskGuestRequests: tasks,
    frontDeskCases: complaints,
    folios,

    // Front Desk Coordinator Actions
    createReservation,
    updateReservation,
    performCheckIn,
    performCheckOut,
    createFrontDeskGuestRequest,
    createFrontDeskCase,
    createRoomMoveRequest,
    completeRoomMove,
    cancelRoomMove,
    scheduleWakeUpCall,
    recordWakeUpCallAttempt,
    sendGuestMessage,
    recordFolioPayment,
    postFolioCharge,
    initiateFolioRefund,
    toggleFinancialAccess,
    updateFrontDeskProfile,

    // Financial Operator State, Role Info & KPIs
    financeProfile,
    financeRoleInfo: FINANCE_ROLE_INFO,
    financialTransactions,
    refundRequests,
    reconciliationBatches,
    financialDiscrepancies,
    financialAuditLogs,
    financialNotifications,
    financeKPIs,

    // Financial Operator Actions
    logFinancialAudit,
    toggleFinancePermission,
    updateFinanceProfile,
    recordFinancialPayment,
    postFolioAdjustment,
    submitRefundRequest,
    approveRefundRequest,
    rejectRefundRequest,
    executeRefund,
    runReconciliationBatch,
    updateFinancialDiscrepancy,
    exportFinancialReport,

    // Notifications
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,

    // Authentication & Role Session
    currentUser,
    currentRole: normalizeRole(currentUser?.role || currentUser?.roleId),
    login,
    logout,
    switchActiveRole,
    securityProfile: SECURITY_PROFILE,
    securityRoleInfo: SECURITY_ROLE_INFO,
    securityIncidents,
    securityAlerts,
    securityBackupRequests,
    securityEscalations,
    securityEvidence,
    securityHandovers,
    securityKPIs,
    acknowledgeSecurityAlert,
    createIncidentFromAlert,
    createSecurityIncident,
    updateSecurityIncidentStatus,
    addSecurityIncidentNote,
    requestSecurityBackup,
    updateBackupRequestStatus,
    escalateSecurityIncident,
    uploadSecurityEvidence,
    createSecurityHandover,
    acknowledgeSecurityHandover,
    closeSecurityIncident,
    fulfillerProfile: FULFILLER_PROFILE,
    fulfillerRoleInfo: FULFILLER_ROLE_INFO,
    fulfillTaskAction,

    // Platform Administrator State & Actions
    adminProfile: ADMIN_PROFILE,
    adminRoleInfo: ADMIN_ROLE_INFO,
    adminKPIs,
    platformUsers,
    systemConfig,
    integrations,
    adminAuditLogs,
    backups,
    addUser,
    updateUser,
    toggleUserStatus,
    updateUserRole,
    triggerIntegrationHealthCheck,
    updateSystemConfig,
    triggerCreateBackup,
    triggerRestoreBackup,
    logAdminEvent,

    // Executive Viewer/Approver State & Actions
    executiveProfile: EXECUTIVE_PROFILE,
    executiveRoleInfo: EXECUTIVE_ROLE_INFO,
    executiveKPIs,
    policyReviews,
    accessCertifications,
    complianceActions,
    executiveNotifications,
    departmentBenchmarks: DEPARTMENT_HISTORICAL_BENCHMARKS,
    approveExecutiveRecovery,
    rejectExecutiveRecovery,
    requestMoreInfoExecutive,
    approveExecutiveRefund,
    rejectExecutiveRefund,
    escalateExecutiveCase,
    markExecutiveNotificationAsRead
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

export const useTaskContext = useTasks;


