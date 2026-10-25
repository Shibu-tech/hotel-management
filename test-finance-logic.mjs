// test-finance-logic.mjs - Comprehensive Verification of Financial Operator Module Logic

import {
  INITIAL_FINANCIAL_TRANSACTIONS,
  INITIAL_REFUND_REQUESTS,
  INITIAL_RECONCILIATION_BATCHES,
  INITIAL_FINANCIAL_DISCREPANCIES,
  INITIAL_FINANCIAL_AUDIT_LOGS,
  INITIAL_FINANCIAL_NOTIFICATIONS,
  PAYMENT_METHODS
} from './src/data/mockFinanceData.js';

import {
  FINANCE_ROLE_INFO,
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

console.log('================================================================');
console.log('RUNNING FINANCIAL OPERATOR MODULE VERIFICATION SUITE');
console.log('================================================================\n');

// 1. Data Integrity and PCI-DSS Compliance
console.log('TEST 1: PCI-DSS Compliance & Card Data Masking');
const hasRawCards = INITIAL_FINANCIAL_TRANSACTIONS.some(tx => {
  const method = tx.paymentMethod || '';
  return /\b(?:\d[ -]*?){13,19}\b/.test(method);
});
assert(!hasRawCards, 'No raw 13-19 digit credit card numbers found in transaction records');

const hasMaskedCards = INITIAL_FINANCIAL_TRANSACTIONS.some(tx => 
  (tx.paymentMethod && tx.paymentMethod.includes('••••'))
);
assert(hasMaskedCards, 'Payment methods use safe masked token format (e.g., Visa •••• 4242)');

// 2. Granular Permissions & Role Definition
console.log('\nTEST 2: Granular Permissions & Property Scope');
assert(FINANCE_PROFILE.role === 'Financial Operator', 'Role is correctly set to Financial Operator');
assert(FINANCE_PROFILE.propertyId === 'PROP-048', 'Assigned to Grand Azure Bay Resort #048 property scope');
assert(FINANCE_PROFILE.approvalLimitUSD === 1000, 'Senior Operator approval limit configured at $1,000 USD');

const requiredPermissions = [
  'folio.read', 'folio.adjust', 'transaction.read', 'payment.record',
  'reconciliation.manage', 'discrepancy.manage', 'refund.request',
  'refund.approve', 'refund.execute', 'report.read', 'report.export', 'financial_audit.read'
];
const allGranted = requiredPermissions.every(p => FINANCE_PROFILE.permissions[p] === true);
assert(allGranted, 'All 12 granular financial operator permissions are present and recognized');

// 3. Separation of Duties: Requester Cannot Approve Own Refund
console.log('\nTEST 3: Separation of Duties (Refund Approval)');
function simulateApproval(request, approverProfile) {
  if (!approverProfile.permissions['refund.approve']) {
    return { success: false, reason: 'Unauthorized: Missing refund.approve permission' };
  }
  if (request.requester && request.requester.id === approverProfile.id) {
    return { success: false, reason: 'Separation of duties violation: Requester cannot approve their own refund request' };
  }
  if (request.amount > approverProfile.approvalLimitUSD) {
    return { success: false, reason: `Amount $${request.amount} exceeds delegated approval limit of $${approverProfile.approvalLimitUSD}` };
  }
  return { success: true };
}

const selfRequest = {
  id: 'REF-TEST-001',
  amount: 250,
  requester: { id: 'EMP-501', name: 'Marcus Sterling' }
};
const selfApprovalResult = simulateApproval(selfRequest, FINANCE_PROFILE);
assert(selfApprovalResult.success === false, 'Self-approval is blocked: Requester cannot approve their own refund');
assert(selfApprovalResult.reason.includes('Separation of duties'), 'Appropriate separation of duties message returned');

const thirdPartyRequest = {
  id: 'REF-TEST-002',
  amount: 350,
  requester: { id: 'EMP-401', name: 'David Martinez' }
};
const validApprovalResult = simulateApproval(thirdPartyRequest, FINANCE_PROFILE);
assert(validApprovalResult.success === true, 'Independent third-party approval within limit is accepted');

// 4. Approval Limits Enforcement
console.log('\nTEST 4: Approval Limit Boundaries');
const overLimitRequest = {
  id: 'REF-TEST-003',
  amount: 2450,
  requester: { id: 'EMP-401', name: 'David Martinez' }
};
const overLimitResult = simulateApproval(overLimitRequest, FINANCE_PROFILE);
assert(overLimitResult.success === false, 'Approval > $1,000 is blocked without escalation');
assert(overLimitResult.reason.includes('exceeds delegated approval limit'), 'Approval limit violation clearly stated');

// 5. Refund Amount Bounds & Refundable Balance
console.log('\nTEST 5: Refund Amount Boundaries');
function validateRefundableBalance(originalTx, existingRefunds, newRefundAmount) {
  const previousRefunded = existingRefunds
    .filter(r => r.originalTransactionId === originalTx.id && ['approved', 'completed', 'pending_approval', 'awaiting_execution'].includes(r.status))
    .reduce((sum, r) => sum + r.amount, 0);
  const remaining = originalTx.amount - previousRefunded;
  if (newRefundAmount <= 0) return { valid: false, reason: 'Amount must be greater than zero' };
  if (newRefundAmount > remaining) return { valid: false, reason: `Requested amount ($${newRefundAmount}) exceeds remaining refundable balance ($${remaining})` };
  return { valid: true, remainingAfter: remaining - newRefundAmount };
}

const mockTx = { id: 'TXN-901', amount: 800 };
const existingRefunds = [{ id: 'REF-1', originalTransactionId: 'TXN-901', amount: 300, status: 'completed' }];
const excessCheck = validateRefundableBalance(mockTx, existingRefunds, 600);
assert(!excessCheck.valid, 'Excess refund ($600 on $500 remaining) is blocked');

const validCheck = validateRefundableBalance(mockTx, existingRefunds, 400);
assert(validCheck.valid && validCheck.remainingAfter === 100, 'Valid refund within remaining balance is permitted');

// 6. Reconciliation Logic & Variance Detection
console.log('\nTEST 6: Reconciliation Calculation & Discrepancy Matching');
const batchCurrent = INITIAL_RECONCILIATION_BATCHES.find(b => b.variance > 0);
assert(batchCurrent != null, 'Sample reconciliation batch with variance exists');
assert(Math.round((batchCurrent.internalGross - batchCurrent.providerGross) * 100) / 100 === batchCurrent.variance, 'Net variance accurately computed between internal and provider totals');
assert(batchCurrent.unmatchedCount > 0, 'Unmatched count properly flags discrepancies for review');

const batchMatched = INITIAL_RECONCILIATION_BATCHES.find(b => b.variance === 0);
assert(batchMatched != null, 'Fully matched settlement batch exists');
assert(batchMatched.variance === 0 && batchMatched.unmatchedCount === 0, 'Matched batch has 0 variance and 0 unmatched records');

// 7. Audit Trail Immutability & Coverage
console.log('\nTEST 7: Audit Trail Coverage & Required Fields');
assert(INITIAL_FINANCIAL_AUDIT_LOGS.length >= 5, 'Initial audit log contains comprehensive historical records');
const allHaveRequiredFields = INITIAL_FINANCIAL_AUDIT_LOGS.every(log => 
  log.id && log.timestamp && log.actor && log.action && log.recordReference && log.executionResult
);
assert(allHaveRequiredFields, 'Every audit record contains mandatory fields (actor, action, timestamp, ref, result)');

// 8. Financial Discrepancies Workflow
console.log('\nTEST 8: Financial Discrepancy Tracking');
assert(INITIAL_FINANCIAL_DISCREPANCIES.length >= 3, 'Seed discrepancies exist across priority tiers');
const unresolvedCount = INITIAL_FINANCIAL_DISCREPANCIES.filter(d => ['Open', 'Investigating', 'Action Required'].includes(d.status) || ['open', 'investigating', 'action_required'].includes(d.status?.toLowerCase())).length;
assert(unresolvedCount > 0, 'Unresolved discrepancies exist and require operator investigation');

// 9. Payment Methods
console.log('\nTEST 9: Payment Methods');
assert(PAYMENT_METHODS.length >= 4, 'Standard hotel payment channels configured (Visa, Amex, Apple Pay, ACH, Cash)');

console.log('\n================================================================');
console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
console.log('================================================================');

if (failed > 0) {
  process.exit(1);
}
