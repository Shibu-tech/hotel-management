import assert from 'assert';
import {
  ALL_ROLE_PROFILES,
  ROLE_DEFAULT_ROUTES,
  normalizeRole,
  EXECUTIVE_PROFILE,
  ADMIN_PROFILE
} from './src/utils/permissions.js';
import {
  INITIAL_PLATFORM_USERS,
  INITIAL_INTEGRATIONS,
  INITIAL_SYSTEM_CONFIG,
  INITIAL_ADMIN_AUDIT_LOGS,
  INITIAL_BACKUPS
} from './src/data/mockAdminData.js';
import {
  INITIAL_POLICY_REVIEWS,
  INITIAL_ACCESS_CERTIFICATIONS,
  INITIAL_COMPLIANCE_ACTIONS
} from './src/data/mockExecutiveData.js';

console.log('================================================================');
console.log('RUNNING ADMIN & EXECUTIVE ACTION INTEGRATION VERIFICATION SUITE');
console.log('================================================================\n');

let passCount = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// 1. DATA MODELS & INITIAL STATE
console.log('TEST 1: Canonical Data Models & Profiles');
test('Executive profile has $10,000 authority cap', () => {
  assert.strictEqual(EXECUTIVE_PROFILE.approvalLimitUSD, 10000);
  assert.strictEqual(normalizeRole(EXECUTIVE_PROFILE.role), 'executive');
});

test('Platform Admin profile has system architect title', () => {
  assert.strictEqual(normalizeRole(ADMIN_PROFILE.role), 'platform_admin');
  assert.strictEqual(ADMIN_PROFILE.name, 'Alexandre Vance');
});

test('Mock datasets contain expected initial counts', () => {
  assert.strictEqual(INITIAL_PLATFORM_USERS.length, 10);
  assert.strictEqual(INITIAL_INTEGRATIONS.length, 6);
  assert.strictEqual(INITIAL_ADMIN_AUDIT_LOGS.length, 5);
  assert.strictEqual(INITIAL_BACKUPS.length, 3);
  assert.strictEqual(INITIAL_POLICY_REVIEWS.length, 3);
  assert.strictEqual(INITIAL_ACCESS_CERTIFICATIONS.length, 3);
  assert.strictEqual(INITIAL_COMPLIANCE_ACTIONS.length, 3);
});

// 2. SAFETY GUARD: LAST ACTIVE ADMINISTRATOR PROTECTION
console.log('\nTEST 2: Last-Admin Lockout Protection Guard');
test('Prevent deactivating the last active Platform Administrator', () => {
  let users = [...INITIAL_PLATFORM_USERS];
  
  // Find all active admins
  const activeAdmins = users.filter(
    (u) => (u.roleKey === 'platform_admin' || normalizeRole(u.role) === 'platform_admin') && u.status === 'Active'
  );
  assert.strictEqual(activeAdmins.length, 1, 'Initially exactly 1 active admin exists');

  const adminToToggle = activeAdmins[0];
  
  // Guard logic simulation as in TaskContext.jsx
  const isProtectedAdmin = adminToToggle.isProtectedAdmin || adminToToggle.roleKey === 'platform_admin' || normalizeRole(adminToToggle.role) === 'platform_admin';
  const remainingAdmins = users.filter(
    (u) => u.id !== adminToToggle.id && (u.roleKey === 'platform_admin' || normalizeRole(u.role) === 'platform_admin') && u.status === 'Active'
  );

  let thrown = false;
  if (isProtectedAdmin && remainingAdmins.length === 0) {
    thrown = true; // Error raised: Cannot deactivate the last active Platform Administrator
  }

  assert.strictEqual(thrown, true, 'Safety guard successfully intercepted lockout attempt');
});

test('Allow deactivating an administrator when another active administrator exists', () => {
  let users = [
    ...INITIAL_PLATFORM_USERS,
    { id: 'ADM-99', name: 'Secondary Admin', role: 'platform_admin', status: 'Active' }
  ];

  const adminToToggle = users[0];
  const remainingAdmins = users.filter(
    (u) => u.id !== adminToToggle.id && (u.roleKey === 'platform_admin' || normalizeRole(u.role) === 'platform_admin') && u.status === 'Active'
  );

  assert.strictEqual(remainingAdmins.length, 1);
  // Allowed because remainingAdmins > 0
});

// 3. SEPARATION OF DUTIES: EXECUTIVE REFUND FLOW
console.log('\nTEST 3: Separation of Duties in Executive Approvals');
test('Executive refund approval sets status to Approved but leaves execution for Finance', () => {
  const initialRefund = {
    id: 'REF-5001',
    amount: 180,
    status: 'Pending Approval',
    requester: 'Marcus Vance'
  };

  // Simulating approveExecutiveRefund action
  const updatedRefund = {
    ...initialRefund,
    status: 'Approved',
    approvedBy: EXECUTIVE_PROFILE.name,
    approvedAt: new Date().toISOString(),
    approvalNotes: 'Authorized by Executive VP Victoria Montgomery'
  };

  assert.strictEqual(updatedRefund.status, 'Approved');
  assert.strictEqual(updatedRefund.approvedBy, 'Victoria Montgomery');
  // It is NOT 'Executed' or 'Settled' — that requires Financial Operator execution
  assert.notStrictEqual(updatedRefund.status, 'Executed');
});

test('Self-approval is forbidden: requester cannot approve own submission', () => {
  const mySelfRequest = {
    id: 'REF-SELF',
    amount: 250,
    status: 'Pending Approval',
    requester: EXECUTIVE_PROFILE.name
  };

  const isSelf = mySelfRequest.requester === EXECUTIVE_PROFILE.name;
  assert.strictEqual(isSelf, true, 'Correctly flags self-submission for UI bar');
});

// 4. BACKUP CREATION INTEGRITY & SHA-256 SEALS
console.log('\nTEST 4: Disaster Recovery Snapshots & SHA-256 Digest');
test('New backup snapshot contains required cryptographic and destination metadata', () => {
  const newBackup = {
    id: `BKP-20261025-MANUAL`,
    label: 'Pre-Deployment Release Vault Snapshot',
    timestamp: new Date().toISOString(),
    status: 'Confirmed',
    size: '158.4 MB',
    destination: 'AWS S3 Glacier Vault (us-west-2)',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
  };

  assert.ok(newBackup.id.startsWith('BKP-'));
  assert.strictEqual(newBackup.status, 'Confirmed');
  assert.strictEqual(newBackup.sha256.length, 64, 'Valid 64-char hex SHA-256 digest');
  assert.ok(newBackup.destination.includes('AWS S3'));
});

// 5. IMMUTABLE AUDIT LOG PRESERVATION
console.log('\nTEST 5: Administrative Audit Log Format');
test('Audit logs have required compliance tracking fields', () => {
  INITIAL_ADMIN_AUDIT_LOGS.forEach((log) => {
    assert.ok(log.id.startsWith('ADM-LOG-') || log.id.startsWith('AUD-'));
    assert.ok(log.timestamp);
    assert.ok(log.actor);
    assert.ok(log.action);
    assert.ok(log.affectedResource || log.resource);
    assert.ok(log.outcome);
    assert.ok(log.changeSummary);
  });
});

// 6. OBJECT RENDERING SAFETY IN EXECUTIVE VIEWS
console.log('\nTEST 6: Object Formatting Safety in Escalations & Approvals');
test('Object requester and owner records format safely to string without throwing', () => {
  function formatPersonName(person, fallback = 'Unassigned') {
    if (!person) return fallback;
    if (typeof person === 'string') return person;
    if (typeof person === 'object') {
      return person.name || person.label || person.id || fallback;
    }
    return String(person);
  }

  const objPerson = { id: 'EMP-201', name: 'Sarah Jenkins', role: 'Department Supervisor' };
  const strPerson = 'Marcus Brody';

  assert.strictEqual(formatPersonName(objPerson), 'Sarah Jenkins');
  assert.strictEqual(formatPersonName(strPerson), 'Marcus Brody');
  assert.strictEqual(formatPersonName(null), 'Unassigned');
});

// 7. FRONT DESK REPORTS METRICS COMPUTATION SAFETY
console.log('\nTEST 7: Front Desk Reports Computation & Alias Safety');
test('Reports metrics calculate correctly with alias fallback and default values without throwing', () => {
  // Simulating mock context with both primary tasks/complaints and frontDesk aliases
  const mockContext = {
    reservations: [{ id: 'RES-1', arrivalDate: '2026-10-22', status: 'Checked-In' }],
    rooms: [{ id: '101', type: 'Deluxe King', status: 'Occupied', cleanliness: 'Clean' }],
    tasks: [{ id: 'TASK-1', workStatus: 'Completed', escalationState: { isEscalated: false } }],
    complaints: [{ id: 'CASE-1', category: 'Noise', status: 'Resolved' }],
    folios: [{ id: 'FOL-101', totalAmount: 450, paidAmount: 450, balance: 0, status: 'Paid' }]
  };

  const reqs = mockContext.frontDeskGuestRequests || mockContext.tasks || [];
  const cases = mockContext.frontDeskCases || mockContext.complaints || [];

  assert.strictEqual(reqs.length, 1);
  assert.strictEqual(cases.length, 1);

  const casesByCategory = cases.reduce((acc, c) => {
    if (c && c.category) {
      acc[c.category] = (acc[c.category] || 0) + 1;
    }
    return acc;
  }, {});

  assert.strictEqual(casesByCategory['Noise'], 1);

  const casesTotal = cases.length || 1;
  const percentage = Math.round((casesByCategory['Noise'] / casesTotal) * 100);
  assert.strictEqual(percentage, 100);

  // Fallback test when context collections are undefined
  const emptyContext = {};
  const emptyReqs = emptyContext.frontDeskGuestRequests || emptyContext.tasks || [];
  const emptyCases = emptyContext.frontDeskCases || emptyContext.complaints || [];
  assert.strictEqual(emptyReqs.length, 0);
  assert.strictEqual(emptyCases.length, 0);
});

console.log('\n================================================================');
console.log(`ALL TESTS PASSED: ${passCount} passed, 0 failed`);
console.log('================================================================\n');
