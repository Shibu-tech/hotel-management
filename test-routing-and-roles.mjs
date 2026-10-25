// test-routing-and-roles.mjs - Automated Verification of Role Identification, Route Resolution, and Guard Logic

import {
  normalizeRole,
  ROLE_DEFAULT_ROUTES,
  ALL_ROLE_PROFILES,
  isAuthorizedForRole,
  FINANCE_PROFILE,
  FRONTDESK_PROFILE,
  MANAGER_PROFILE,
  SUPERVISOR_PROFILE,
  DISPATCHER_PROFILE,
  SECURITY_PROFILE,
  FULFILLER_PROFILE,
  EXECUTIVE_PROFILE,
  ADMIN_PROFILE,
  FULFILLER_ROLE_INFO,
  FINANCE_ROLE_INFO,
  FRONTDESK_ROLE_INFO,
  EXECUTIVE_ROLE_INFO,
  ADMIN_ROLE_INFO
} from './src/utils/permissions.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('================================================================');
console.log('RUNNING ROLE IDENTIFICATION & ROUTING VERIFICATION SUITE');
console.log('================================================================\n');

// 1. Role Normalization Tests
console.log('TEST SUITE 1: Role Normalization Across Variants');
assert(normalizeRole('financial_operator') === 'financial_operator', 'Normalizes financial_operator');
assert(normalizeRole('Financial Operator') === 'financial_operator', 'Normalizes "Financial Operator" string');
assert(normalizeRole('finance') === 'financial_operator', 'Normalizes "finance"');
assert(normalizeRole('ROLE_FINANCIAL_OPERATOR') === 'financial_operator', 'Normalizes "ROLE_FINANCIAL_OPERATOR"');

assert(normalizeRole('frontdesk') === 'frontdesk', 'Normalizes frontdesk');
assert(normalizeRole('Front Desk Coordinator') === 'frontdesk', 'Normalizes "Front Desk Coordinator"');
assert(normalizeRole('ROLE_FRONT_DESK_COORDINATOR') === 'frontdesk', 'Normalizes "ROLE_FRONT_DESK_COORDINATOR"');

assert(normalizeRole('department_manager') === 'manager', 'Normalizes department_manager');
assert(normalizeRole('Department Manager') === 'manager', 'Normalizes "Department Manager"');
assert(normalizeRole('ROLE_DEPT_MANAGER') === 'manager', 'Normalizes "ROLE_DEPT_MANAGER"');

assert(normalizeRole('department_supervisor') === 'supervisor', 'Normalizes department_supervisor');
assert(normalizeRole('Department Supervisor') === 'supervisor', 'Normalizes "Department Supervisor"');

assert(normalizeRole('department_dispatcher') === 'dispatcher', 'Normalizes department_dispatcher');
assert(normalizeRole('Department Dispatcher') === 'dispatcher', 'Normalizes "Department Dispatcher"');

assert(normalizeRole('security_responder') === 'security', 'Normalizes security_responder');
assert(normalizeRole('Security Responder') === 'security', 'Normalizes "Security Responder"');
assert(normalizeRole('ROLE_SECURITY_RESPONDER') === 'security', 'Normalizes "ROLE_SECURITY_RESPONDER"');

assert(normalizeRole('task_fulfiller') === 'task_fulfiller', 'Normalizes task_fulfiller');
assert(normalizeRole('Task Fulfiller') === 'task_fulfiller', 'Normalizes "Task Fulfiller"');
assert(normalizeRole('fulfiller') === 'task_fulfiller', 'Normalizes "fulfiller"');
assert(normalizeRole('attendant_runner') === 'task_fulfiller', 'Normalizes "attendant_runner"');
assert(normalizeRole('runner') === 'task_fulfiller', 'Normalizes "runner"');
assert(normalizeRole('ROLE_TASK_FULFILLER') === 'task_fulfiller', 'Normalizes "ROLE_TASK_FULFILLER"');

// New roles normalization
assert(normalizeRole('executive') === 'executive', 'Normalizes executive');
assert(normalizeRole('Executive Viewer/Approver') === 'executive', 'Normalizes "Executive Viewer/Approver"');
assert(normalizeRole('ROLE_EXECUTIVE_APPROVER') === 'executive', 'Normalizes "ROLE_EXECUTIVE_APPROVER"');
assert(normalizeRole('executive_approver') === 'executive', 'Normalizes "executive_approver"');

assert(normalizeRole('platform_admin') === 'platform_admin', 'Normalizes platform_admin');
assert(normalizeRole('Platform Administrator') === 'platform_admin', 'Normalizes "Platform Administrator"');
assert(normalizeRole('admin') === 'platform_admin', 'Normalizes "admin"');
assert(normalizeRole('ROLE_PLATFORM_ADMIN') === 'platform_admin', 'Normalizes "ROLE_PLATFORM_ADMIN"');
assert(normalizeRole('system_admin') === 'platform_admin', 'Normalizes "system_admin"');

// 2. Default Route Mapping
console.log('\nTEST SUITE 2: Default Route Resolution by Role');
assert(ROLE_DEFAULT_ROUTES.financial_operator === '/finance/dashboard', 'financial_operator routes to /finance/dashboard');
assert(ROLE_DEFAULT_ROUTES.frontdesk === '/frontdesk/dashboard', 'frontdesk routes to /frontdesk/dashboard');
assert(ROLE_DEFAULT_ROUTES.manager === '/manager/dashboard', 'manager routes to /manager/dashboard');
assert(ROLE_DEFAULT_ROUTES.supervisor === '/supervisor/dashboard', 'supervisor routes to /supervisor/dashboard');
assert(ROLE_DEFAULT_ROUTES.dispatcher === '/dispatcher/dashboard', 'dispatcher routes to /dispatcher/dashboard');
assert(ROLE_DEFAULT_ROUTES.security === '/security/dashboard', 'security routes to /security/dashboard');
assert(ROLE_DEFAULT_ROUTES.task_fulfiller === '/task-fulfiller/dashboard', 'task_fulfiller routes to /task-fulfiller/dashboard');
assert(ROLE_DEFAULT_ROUTES.executive === '/executive/dashboard', 'executive routes to /executive/dashboard');
assert(ROLE_DEFAULT_ROUTES.platform_admin === '/admin/dashboard', 'platform_admin routes to /admin/dashboard');
assert(ROLE_DEFAULT_ROUTES.admin === '/admin/dashboard', 'admin routes to /admin/dashboard');

// 3. Root Route Redirect Simulation
console.log('\nTEST SUITE 3: Root Route (/) Role-Aware Redirect Resolution');
function resolveRootRedirect(currentUser) {
  if (!currentUser) return '/login';
  const norm = normalizeRole(currentUser.role || currentUser.roleId);
  return ROLE_DEFAULT_ROUTES[norm] || '/finance/dashboard';
}

assert(resolveRootRedirect(FINANCE_PROFILE) === '/finance/dashboard', 'Financial Operator root / redirects to /finance/dashboard');
assert(resolveRootRedirect(FRONTDESK_PROFILE) === '/frontdesk/dashboard', 'Front Desk Coordinator root / redirects to /frontdesk/dashboard');
assert(resolveRootRedirect(MANAGER_PROFILE) === '/manager/dashboard', 'Department Manager root / redirects to /manager/dashboard');
assert(resolveRootRedirect(SECURITY_PROFILE) === '/security/dashboard', 'Security Responder root / redirects to /security/dashboard');
assert(resolveRootRedirect(FULFILLER_PROFILE) === '/task-fulfiller/dashboard', 'Task Fulfiller root / redirects to /task-fulfiller/dashboard');
assert(resolveRootRedirect(EXECUTIVE_PROFILE) === '/executive/dashboard', 'Executive Approver root / redirects to /executive/dashboard');
assert(resolveRootRedirect(ADMIN_PROFILE) === '/admin/dashboard', 'Platform Administrator root / redirects to /admin/dashboard');
assert(resolveRootRedirect(null) === '/login', 'Unauthenticated user root / redirects to /login');

// 4. Protected Route Authorization Checks
console.log('\nTEST SUITE 4: Route Guard Access Control (Enforced Role Boundaries)');
function checkRouteAccess(currentUser, allowedRoles) {
  if (!currentUser) return { authorized: false, reason: 'unauthenticated' };
  const userRole = normalizeRole(currentUser.role || currentUser.roleId);
  const normalizedAllowed = allowedRoles.map(r => normalizeRole(r));
  const hasAccess = normalizedAllowed.includes(userRole);
  return { authorized: hasAccess, userRole };
}

const financeAllowed = ['financial_operator', 'finance', 'ROLE_FINANCIAL_OPERATOR'];
const frontdeskAllowed = ['frontdesk', 'front_desk_coordinator', 'ROLE_FRONT_DESK_COORDINATOR'];
const securityAllowed = ['security', 'security_responder', 'ROLE_SECURITY_RESPONDER'];
const fulfillerAllowed = ['task_fulfiller', 'fulfiller', 'attendant_runner', 'ROLE_TASK_FULFILLER'];
const executiveAllowed = ['executive', 'executive_approver', 'ROLE_EXECUTIVE_APPROVER'];
const adminAllowed = ['platform_admin', 'admin', 'ROLE_PLATFORM_ADMIN'];

// Financial Operator testing
assert(checkRouteAccess(FINANCE_PROFILE, financeAllowed).authorized === true, 'Financial Operator is authorized on /finance/*');
assert(checkRouteAccess(FRONTDESK_PROFILE, financeAllowed).authorized === false, 'Front Desk user is BLOCKED from /finance/*');
assert(checkRouteAccess(MANAGER_PROFILE, financeAllowed).authorized === false, 'Manager is BLOCKED from direct /finance/* access');
assert(checkRouteAccess(FULFILLER_PROFILE, financeAllowed).authorized === false, 'Task Fulfiller is BLOCKED from /finance/* (strict financial isolation)');
assert(checkRouteAccess({ role: 'unknown_role' }, financeAllowed).authorized === false, 'Unknown role is BLOCKED from /finance/*');

// Front Desk testing
assert(checkRouteAccess(FRONTDESK_PROFILE, frontdeskAllowed).authorized === true, 'Front Desk user is authorized on /frontdesk/*');
assert(checkRouteAccess(FINANCE_PROFILE, frontdeskAllowed).authorized === false, 'Financial Operator is BLOCKED from /frontdesk/* (separation of workspaces)');
assert(checkRouteAccess(FULFILLER_PROFILE, frontdeskAllowed).authorized === false, 'Task Fulfiller is BLOCKED from /frontdesk/* (Front Desk only)');

// Security testing
assert(checkRouteAccess(SECURITY_PROFILE, securityAllowed).authorized === true, 'Security Responder is authorized on /security/*');
assert(checkRouteAccess(FINANCE_PROFILE, securityAllowed).authorized === false, 'Financial Operator is BLOCKED from /security/*');
assert(checkRouteAccess(FULFILLER_PROFILE, securityAllowed).authorized === false, 'Task Fulfiller is BLOCKED from /security/*');

// Task Fulfiller testing
assert(checkRouteAccess(FULFILLER_PROFILE, fulfillerAllowed).authorized === true, 'Task Fulfiller is authorized on /task-fulfiller/*');
assert(checkRouteAccess(FINANCE_PROFILE, fulfillerAllowed).authorized === false, 'Financial Operator is BLOCKED from /task-fulfiller/*');
assert(checkRouteAccess(FRONTDESK_PROFILE, fulfillerAllowed).authorized === false, 'Front Desk Coordinator is BLOCKED from /task-fulfiller/*');

// Executive testing
assert(checkRouteAccess(EXECUTIVE_PROFILE, executiveAllowed).authorized === true, 'Executive Approver is authorized on /executive/*');
assert(checkRouteAccess(FINANCE_PROFILE, executiveAllowed).authorized === false, 'Financial Operator is BLOCKED from /executive/*');
assert(checkRouteAccess(ADMIN_PROFILE, executiveAllowed).authorized === false, 'Platform Administrator is BLOCKED from /executive/*');
assert(checkRouteAccess(EXECUTIVE_PROFILE, adminAllowed).authorized === false, 'Executive is BLOCKED from /admin/*');
assert(checkRouteAccess(EXECUTIVE_PROFILE, financeAllowed).authorized === false, 'Executive is BLOCKED from direct /finance/* workspace');

// Platform Admin testing
assert(checkRouteAccess(ADMIN_PROFILE, adminAllowed).authorized === true, 'Platform Administrator is authorized on /admin/*');
assert(checkRouteAccess(FINANCE_PROFILE, adminAllowed).authorized === false, 'Financial Operator is BLOCKED from /admin/*');
assert(checkRouteAccess(FULFILLER_PROFILE, adminAllowed).authorized === false, 'Task Fulfiller is BLOCKED from /admin/*');
assert(checkRouteAccess(ADMIN_PROFILE, financeAllowed).authorized === false, 'Platform Administrator is BLOCKED from /finance/*');

// 5. Session State & Restoration Simulation
console.log('\nTEST SUITE 5: Session Restoration and Stale-State Prevention');
const mockLocalStorage = {};
const STORAGE_KEY = 'stayops_auth_session_v5';

function saveSession(profile) {
  mockLocalStorage[STORAGE_KEY] = JSON.stringify(profile);
}

function restoreSession() {
  const raw = mockLocalStorage[STORAGE_KEY];
  if (!raw) return FINANCE_PROFILE; // Default initial state for this workspace
  try {
    return JSON.parse(raw);
  } catch {
    return FINANCE_PROFILE;
  }
}

// Initial state without localStorage session -> defaults to Financial Operator
const initialRestored = restoreSession();
assert(normalizeRole(initialRestored.role) === 'financial_operator', 'Default unseeded startup resolves to Financial Operator');

// User logs in as Front Desk
saveSession(FRONTDESK_PROFILE);
const frontDeskRestored = restoreSession();
assert(normalizeRole(frontDeskRestored.role) === 'frontdesk', 'Restored session recognizes Front Desk role');
assert(resolveRootRedirect(frontDeskRestored) === '/frontdesk/dashboard', 'Restored Front Desk session routes / to /frontdesk/dashboard');

// User switches to Financial Operator
saveSession(FINANCE_PROFILE);
const financeRestored = restoreSession();
assert(normalizeRole(financeRestored.role) === 'financial_operator', 'Switched session updates to Financial Operator');
assert(resolveRootRedirect(financeRestored) === '/finance/dashboard', 'Switched session routes / to /finance/dashboard');

// User switches to Task Fulfiller
saveSession(FULFILLER_PROFILE);
const fulfillerRestored = restoreSession();
assert(normalizeRole(fulfillerRestored.role) === 'task_fulfiller', 'Switched session updates to Task Fulfiller');
assert(resolveRootRedirect(fulfillerRestored) === '/task-fulfiller/dashboard', 'Switched session routes / to /task-fulfiller/dashboard');

// User switches to Executive Approver
saveSession(EXECUTIVE_PROFILE);
const executiveRestored = restoreSession();
assert(normalizeRole(executiveRestored.role) === 'executive', 'Switched session updates to Executive Approver');
assert(resolveRootRedirect(executiveRestored) === '/executive/dashboard', 'Switched session routes / to /executive/dashboard');

// User switches to Platform Administrator
saveSession(ADMIN_PROFILE);
const adminRestored = restoreSession();
assert(normalizeRole(adminRestored.role) === 'platform_admin', 'Switched session updates to Platform Administrator');
assert(resolveRootRedirect(adminRestored) === '/admin/dashboard', 'Switched session routes / to /admin/dashboard');

// 6. Permissions Separation: Operational vs Executive vs Platform Admin
console.log('\nTEST SUITE 6: Separation of Duties & Financial Permissions Matrix');
assert(FINANCE_PROFILE.approvalLimitUSD === 1000, 'Financial Operator has delegated approval limit of $1,000');
assert(FRONTDESK_ROLE_INFO.delegatedRefundApprovalLimit === 0, 'Front Desk Coordinator approval limit is $0 (cannot self-approve)');
assert(FRONTDESK_PROFILE.financialPermissions.canApproveRefund === false, 'Front Desk canApproveRefund is strictly false');
assert(FRONTDESK_PROFILE.financialPermissions.canExecuteRefund === false, 'Front Desk canExecuteRefund is strictly false');
assert(FINANCE_PROFILE.permissions['refund.approve'] === true, 'Financial Operator refund.approve permission is true');
assert(FINANCE_PROFILE.permissions['refund.execute'] === true, 'Financial Operator refund.execute permission is true');

// Task Fulfiller permissions and strict restrictions
assert(FULFILLER_PROFILE.permissions['task.read'] === true, 'Task Fulfiller has task.read permission');
assert(FULFILLER_PROFILE.permissions['task.update_status'] === true, 'Task Fulfiller has task.update_status permission');
assert(FULFILLER_PROFILE.permissions['task.claim'] === true, 'Task Fulfiller has task.claim permission');
assert(FULFILLER_PROFILE.permissions['task.block'] === true, 'Task Fulfiller has task.block permission');
assert(FULFILLER_PROFILE.permissions['delivery.confirm'] === true, 'Task Fulfiller has delivery.confirm permission');
assert(FULFILLER_PROFILE.permissions['refund.approve'] === undefined, 'Task Fulfiller strictly lacks refund.approve permission');
assert(FULFILLER_PROFILE.permissions['finance.read'] === undefined, 'Task Fulfiller strictly lacks finance.read permission');
assert(FULFILLER_PROFILE.permissions['folio.payment'] === undefined, 'Task Fulfiller strictly lacks folio.payment permission');

// Executive Approver permissions & strict boundaries
assert(EXECUTIVE_PROFILE.approvalLimitUSD === 10000, 'Executive Approver has authority limit of $10,000');
assert(EXECUTIVE_PROFILE.permissions['approval.executive'] === true, 'Executive has approval.executive permission');
assert(EXECUTIVE_PROFILE.permissions['refund.approve'] === true, 'Executive has refund.approve permission');
assert(EXECUTIVE_PROFILE.permissions['recovery.approve'] === true, 'Executive has recovery.approve permission');
assert(EXECUTIVE_PROFILE.permissions['refund.execute'] === undefined, 'Executive strictly lacks refund.execute (Separation of duties: Financial execution reserved for Finance)');
assert(EXECUTIVE_PROFILE.permissions['admin.users'] === undefined, 'Executive strictly lacks admin.users (Separation of administration)');

// Platform Administrator permissions & strict boundaries
assert(ADMIN_PROFILE.permissions['admin.users'] === true, 'Platform Admin has admin.users permission');
assert(ADMIN_PROFILE.permissions['admin.settings'] === true, 'Platform Admin has admin.settings permission');
assert(ADMIN_PROFILE.permissions['admin.audit'] === true, 'Platform Admin has admin.audit permission');
assert(ADMIN_PROFILE.permissions['admin.backups'] === true, 'Platform Admin has admin.backups permission');
assert(ADMIN_PROFILE.permissions['refund.approve'] === undefined, 'Platform Admin strictly lacks refund.approve (Technical admins cannot approve funds)');
assert(ADMIN_PROFILE.permissions['refund.execute'] === undefined, 'Platform Admin strictly lacks refund.execute (Technical admins cannot execute funds)');
assert(ADMIN_PROFILE.permissions['folio.adjust'] === undefined, 'Platform Admin strictly lacks folio.adjust (Cannot alter billing ledgers)');

console.log('\n================================================================');
console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
}
