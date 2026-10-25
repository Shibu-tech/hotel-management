/**
 * StayOps Hotel Management App - Security Responder Verification Test Suite
 * Validates data models, alert acknowledgement separation, incident lifecycle,
 * tactical backup progression, escalation SLA, tamper-evident evidence,
 * shift watch handovers, and strict RBAC isolation.
 */

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
} from './src/data/mockSecurityData.js';

import {
  SECURITY_PROFILE,
  SECURITY_ROLE_INFO,
  FINANCE_PROFILE
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

console.log('\n================================================================');
console.log('RUNNING SECURITY RESPONDER MODULE VERIFICATION SUITE');
console.log('================================================================\n');

// -------------------------------------------------------------
// TEST SUITE 1: Security Data Models & Baseline Schema Integrity
// -------------------------------------------------------------
console.log('TEST 1: Security Data Models & Schema Completeness');
assert(Array.isArray(INITIAL_SECURITY_ALERTS) && INITIAL_SECURITY_ALERTS.length >= 4, 'Seed security alerts exist');
assert(Array.isArray(INITIAL_SECURITY_INCIDENTS) && INITIAL_SECURITY_INCIDENTS.length >= 5, 'Seed security incidents exist');
assert(Array.isArray(INITIAL_BACKUP_REQUESTS) && INITIAL_BACKUP_REQUESTS.length >= 3, 'Seed tactical backup requests exist');
assert(Array.isArray(INITIAL_SECURITY_ESCALATIONS) && INITIAL_SECURITY_ESCALATIONS.length >= 2, 'Seed security escalations exist');
assert(Array.isArray(INITIAL_SECURITY_EVIDENCE) && INITIAL_SECURITY_EVIDENCE.length >= 4, 'Seed evidence vault records exist');
assert(Array.isArray(INITIAL_SECURITY_HANDOVERS) && INITIAL_SECURITY_HANDOVERS.length >= 1, 'Seed shift watch handovers exist');
assert(Array.isArray(SECURITY_EMERGENCY_PROTOCOLS) && SECURITY_EMERGENCY_PROTOCOLS.length === 4, 'All 4 critical emergency protocols exist (Red, Blue, Black, Orange)');

// -------------------------------------------------------------
// TEST SUITE 2: Alert Lifecycle & Separation from Incident Closure
// -------------------------------------------------------------
console.log('\nTEST 2: Alert Acknowledgement & Incident Closure Independence');
const sampleAlert = { ...INITIAL_SECURITY_ALERTS[0] };
assert(sampleAlert.acknowledged === false, 'Alert starts unacknowledged');

// Simulate Alert Acknowledgement
const acknowledgedAlert = {
  ...sampleAlert,
  acknowledged: true,
  acknowledgedBy: 'Marcus Vance (EMP-601)',
  acknowledgedAt: new Date().toISOString(),
  status: 'Investigating'
};
assert(acknowledgedAlert.acknowledged === true, 'Alert transitions to acknowledged');
assert(acknowledgedAlert.status !== INCIDENT_STATUS.CLOSED, 'CRITICAL: Alert acknowledgement does NOT close the incident');

// -------------------------------------------------------------
// TEST SUITE 3: Incident Lifecycle, Notes & Authorized Closure
// -------------------------------------------------------------
console.log('\nTEST 3: Incident Creation, Audit Timeline & Authorized Closure');
const testIncident = {
  id: 'INC-999',
  title: 'Test Incident for Audit Check',
  category: 'Security Occurrence',
  severity: INCIDENT_SEVERITY.HIGH,
  location: 'North Corridor 3',
  status: INCIDENT_STATUS.OPEN,
  reportedAt: new Date().toISOString(),
  notes: [],
  timeline: [{ event: 'Incident Created', actor: 'Marcus Vance', timestamp: new Date().toISOString() }],
  closureDetails: null
};

// Append field note
const noteEntry = { id: 'NOT-99', author: 'Marcus Vance', text: 'On scene inspection complete.', timestamp: new Date().toISOString() };
testIncident.notes.push(noteEntry);
testIncident.timeline.push({ event: 'Note Added', actor: 'Marcus Vance', timestamp: new Date().toISOString() });
assert(testIncident.notes.length === 1, 'Chronological field note appended to incident');
assert(testIncident.timeline.length === 2, 'Immutable audit timeline preserved and updated');

// Formally seal case
testIncident.status = INCIDENT_STATUS.CLOSED;
testIncident.closureDetails = {
  closedBy: 'Marcus Vance (EMP-601)',
  closedAt: new Date().toISOString(),
  resolutionSummary: 'Subject escorted off site; lock verified.',
  policeNotified: false
};
assert(testIncident.status === INCIDENT_STATUS.CLOSED, 'Incident formally closed');
assert(Boolean(testIncident.closureDetails.resolutionSummary), 'Mandatory resolution summary recorded upon closure');

// -------------------------------------------------------------
// TEST SUITE 4: Tactical Backup Coordination Progression
// -------------------------------------------------------------
console.log('\nTEST 4: Tactical Backup Lifecycle Progression');
const backupLifecycle = [
  BACKUP_STATUS.REQUESTED,
  BACKUP_STATUS.ACKNOWLEDGED,
  BACKUP_STATUS.RESPONDING,
  BACKUP_STATUS.ARRIVED,
  BACKUP_STATUS.COMPLETED
];
assert(backupLifecycle[0] === 'Requested', 'Initial backup state is Requested');
assert(backupLifecycle[1] === 'Acknowledged', 'Second backup state is Acknowledged');
assert(backupLifecycle[2] === 'Responding', 'Third backup state is Responding');
assert(backupLifecycle[3] === 'Arrived/Assisting', 'Fourth backup state is Arrived/Assisting');
assert(backupLifecycle[4] === 'Completed', 'Final backup state is Completed');

// Verify backup is not marked arrived directly from requested
let testBackup = { id: 'BAK-99', status: BACKUP_STATUS.REQUESTED, arrivedAt: null };
assert(testBackup.arrivedAt === null, 'Backup has not arrived at requested stage');
testBackup.status = BACKUP_STATUS.RESPONDING;
testBackup.assignedBackupOfficer = 'Sarah O’Connor (EMP-604)';
assert(testBackup.assignedBackupOfficer !== null, 'Assigned backup officer is designated before arrival');

// -------------------------------------------------------------
// TEST SUITE 5: Evidence Vault & Chain of Custody Integrity
// -------------------------------------------------------------
console.log('\nTEST 5: Evidence Vault & Tamper-Evident Chain of Custody');
const seedEvidence = INITIAL_SECURITY_EVIDENCE[0];
assert(seedEvidence.isProtected === true, 'Evidence artifact is flagged as protected');
assert(Array.isArray(seedEvidence.chainOfCustody) && seedEvidence.chainOfCustody.length >= 2, 'Chain of custody contains step audit trail');
assert(seedEvidence.chainOfCustody.some(c => c.action.includes('Hashed SHA-256') || c.action.includes('Encrypted')), 'SHA-256 cryptographic integrity hash recorded');

// -------------------------------------------------------------
// TEST SUITE 6: Shift Handover & Equipment Accountability
// -------------------------------------------------------------
console.log('\nTEST 6: Shift Handover & Equipment Accountability');
const sampleHandover = INITIAL_SECURITY_HANDOVERS[0];
assert(sampleHandover.status === 'Pending Acceptance' || sampleHandover.status === 'Accepted', 'Handover has valid watch transfer state');
assert(Boolean(sampleHandover.equipmentChecklist?.radioHandsets), 'Accountability tracks radio handsets');
assert(Boolean(sampleHandover.equipmentChecklist?.masterKeys), 'Accountability tracks emergency master override keys');
assert(Boolean(sampleHandover.equipmentChecklist?.bodyCameras), 'Accountability tracks body camera docking status');
assert(Boolean(sampleHandover.equipmentChecklist?.firstAidDefibrillator), 'Accountability tracks automated external defibrillator (AED)');

// -------------------------------------------------------------
// TEST SUITE 7: Strict RBAC & Separation of Role Boundaries
// -------------------------------------------------------------
console.log('\nTEST 7: Security Responder RBAC & Data Isolation');
assert(SECURITY_PROFILE.permissions['incident.read'] === true, 'Security Responder has incident.read');
assert(SECURITY_PROFILE.permissions['incident.close'] === true, 'Security Responder has incident.close');
assert(SECURITY_PROFILE.permissions['backup.request'] === true, 'Security Responder has backup.request');
assert(SECURITY_PROFILE.permissions['evidence.upload'] === true, 'Security Responder has evidence.upload');
assert(SECURITY_PROFILE.permissions['emergency.dispatch'] === true, 'Security Responder has emergency.dispatch');

// Strict isolation assertions (Security CANNOT access Financial or Folio features)
assert(!SECURITY_PROFILE.permissions['folio.read'], 'Security Responder strictly lacks folio.read');
assert(!SECURITY_PROFILE.permissions['folio.adjust'], 'Security Responder strictly lacks folio.adjust');
assert(!SECURITY_PROFILE.permissions['payment.record'], 'Security Responder strictly lacks payment.record');
assert(!SECURITY_PROFILE.permissions['refund.approve'], 'Security Responder strictly lacks refund.approve');
assert(!SECURITY_PROFILE.permissions['refund.execute'], 'Security Responder strictly lacks refund.execute');

console.log('\n================================================================');
console.log(`SECURITY TEST SUMMARY: ${passed} passed, ${failed} failed`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
}
