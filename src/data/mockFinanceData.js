/**
 * StayOps Financial Operator Module - Authoritative Mock Dataset & Domain Models
 * Contains Transactions Ledger, Multi-Stage Refunds, Gateway Settlement Batches,
 * Accounting Discrepancies, Immutable Financial Audit Logs, and Notifications.
 */

const now = Date.now();
const minutesAgo = (m) => new Date(now - m * 60 * 1000).toISOString();
const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString();
const daysAgo = (d) => new Date(now - d * 86400 * 1000).toISOString();
const todayDate = new Date().toISOString().split('T')[0];

export const TRANSACTION_STATUS = {
  AUTHORIZED: 'Authorized',
  CAPTURED: 'Captured',
  SETTLED: 'Settled',
  PENDING: 'Pending',
  FAILED: 'Failed',
  REVERSED: 'Reversed',
  REFUNDED: 'Refunded'
};

export const TRANSACTION_TYPE = {
  PAYMENT: 'Payment (Capture)',
  PRE_AUTH: 'Pre-Authorization',
  REFUND: 'Refund',
  ADJUSTMENT: 'Adjustment / Correction',
  CHARGEBACK: 'Chargeback / Dispute',
  FEE: 'Gateway Processing Fee'
};

export const REFUND_STATUS = {
  DRAFT: 'Draft',
  PENDING_APPROVAL: 'Pending Approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  AWAITING_EXECUTION: 'Awaiting Execution',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled'
};

export const DISCREPANCY_STATUS = {
  OPEN: 'Open',
  INVESTIGATING: 'Investigating',
  RESOLVED: 'Resolved',
  ESCALATED: 'Escalated'
};

export const DISCREPANCY_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
};

export const RECONCILIATION_STATUS = {
  UNRECONCILED: 'Unreconciled',
  MATCHED: 'Matched & Reconciled',
  VARIANCE_FLAGGED: 'Variance Flagged',
  IN_REVIEW: 'In Review'
};

export const PAYMENT_METHODS = [
  { id: 'visa-4812', label: 'Visa •••• 4812 (Chip & PIN)', type: 'credit_card', brand: 'Visa' },
  { id: 'amex-1004', label: 'Amex •••• 1004 (Contactless)', type: 'credit_card', brand: 'Amex' },
  { id: 'mc-9012', label: 'Mastercard •••• 9012 (Apple Pay)', type: 'digital_wallet', brand: 'Mastercard' },
  { id: 'wire-corp', label: 'Corporate Direct Wire / ACH', type: 'bank_transfer', brand: 'ACH' },
  { id: 'cash-front', label: 'Front Desk Cash Drawer #01', type: 'cash', brand: 'Cash' }
];

// AUTHORITATIVE TRANSACTIONS LEDGER
export const INITIAL_FINANCIAL_TRANSACTIONS = [
  {
    id: 'TXN-9021',
    folioId: 'FOL-8041',
    reservationId: 'RES-8041',
    guestName: 'Sophia Chen',
    roomNumber: '412',
    type: TRANSACTION_TYPE.PAYMENT,
    amount: 322.62,
    currency: 'USD',
    paymentMethod: 'Visa •••• 4812',
    provider: 'Stripe Payments (Simulated Gateway)',
    providerReference: 'ch_3Nx08a2eZvKYlo2C17gQYd8Z',
    authCode: 'AUTH-89210',
    status: TRANSACTION_STATUS.SETTLED,
    reconciliationStatus: RECONCILIATION_STATUS.MATCHED,
    batchId: 'BATCH-2026-10-21-A',
    capturedBy: 'EMP-401 (David Martinez)',
    timestamp: daysAgo(1),
    fee: 9.36,
    net: 313.26,
    idempotencyKey: 'idemp_txn_9021_89210',
    refundableBalance: 322.62,
    refundHistory: [],
    timeline: [
      { event: 'Payment Authorized', timestamp: daysAgo(1), actor: 'EMP-401 (David Martinez)', details: 'Auth approved via Terminal #02.' },
      { event: 'Funds Captured', timestamp: daysAgo(1), actor: 'Payment Gateway', details: 'Full capture of $322.62.' },
      { event: 'Settlement Cleared', timestamp: hoursAgo(12), actor: 'Merchant Bank', details: 'Settlement batch BATCH-2026-10-21-A deposited.' }
    ]
  },
  {
    id: 'TXN-9022',
    folioId: 'FOL-8042',
    reservationId: 'RES-8042',
    guestName: 'David Vance',
    roomNumber: '1204',
    type: TRANSACTION_TYPE.PAYMENT,
    amount: 501.20,
    currency: 'USD',
    paymentMethod: 'Amex •••• 1004',
    provider: 'Stripe Payments (Simulated Gateway)',
    providerReference: 'ch_3Nx09b2eZvKYlo2C28hRZe9A',
    authCode: 'AUTH-19042',
    status: TRANSACTION_STATUS.SETTLED,
    reconciliationStatus: RECONCILIATION_STATUS.MATCHED,
    batchId: 'BATCH-2026-10-20-B',
    capturedBy: 'EMP-401 (David Martinez)',
    timestamp: daysAgo(2),
    fee: 17.54,
    net: 483.66,
    idempotencyKey: 'idemp_txn_9022_19042',
    refundableBalance: 426.20,
    refundHistory: ['REF-5001'],
    timeline: [
      { event: 'Payment Authorized', timestamp: daysAgo(2), actor: 'EMP-401 (David Martinez)', details: 'Pre-checkin deposit captured.' },
      { event: 'Settlement Cleared', timestamp: daysAgo(1), actor: 'Merchant Bank', details: 'Batch BATCH-2026-10-20-B settled.' }
    ]
  },
  {
    id: 'TXN-9023',
    folioId: 'FOL-8047',
    reservationId: 'RES-8047',
    guestName: 'Claire Beauchamp',
    roomNumber: '902',
    type: TRANSACTION_TYPE.PAYMENT,
    amount: 540.00,
    currency: 'USD',
    paymentMethod: 'Visa •••• 1102 (Advance OTA)',
    provider: 'Adyen Terminal / OTA Virtual Card (Simulated)',
    providerReference: 'ady_9812480182410',
    authCode: 'AUTH-67210',
    status: TRANSACTION_STATUS.SETTLED,
    reconciliationStatus: RECONCILIATION_STATUS.MATCHED,
    batchId: 'BATCH-2026-10-19-A',
    capturedBy: 'Online Agency GDS Interface',
    timestamp: daysAgo(3),
    fee: 15.66,
    net: 524.34,
    idempotencyKey: 'idemp_txn_9023_67210',
    refundableBalance: 540.00,
    refundHistory: [],
    timeline: [
      { event: 'Advance Deposit Received', timestamp: daysAgo(3), actor: 'GDS Integration', details: 'Pre-paid 3-night rate.' },
      { event: 'Settlement Cleared', timestamp: daysAgo(2), actor: 'Adyen Gateway', details: 'Disbursed to hotel treasury account.' }
    ]
  },
  {
    id: 'TXN-9024',
    folioId: 'FOL-8044',
    reservationId: 'RES-8044',
    guestName: 'Amanda Miller',
    roomNumber: '204',
    type: TRANSACTION_TYPE.PRE_AUTH,
    amount: 250.00,
    currency: 'USD',
    paymentMethod: 'Mastercard •••• 9012',
    provider: 'Stripe Payments (Simulated Gateway)',
    providerReference: 'ch_3Nx11c2eZvKYlo2C39jSZf1B',
    authCode: 'AUTH-45129',
    status: TRANSACTION_STATUS.AUTHORIZED,
    reconciliationStatus: RECONCILIATION_STATUS.UNRECONCILED,
    batchId: null,
    capturedBy: 'EMP-401 (David Martinez)',
    timestamp: hoursAgo(5),
    fee: 0.00,
    net: 250.00,
    idempotencyKey: 'idemp_txn_9024_45129',
    refundableBalance: 0.00,
    refundHistory: [],
    timeline: [
      { event: 'Pre-Authorization Hold Placed', timestamp: hoursAgo(5), actor: 'EMP-401 (David Martinez)', details: 'Incidental hold placed at check-in.' }
    ]
  },
  {
    id: 'TXN-9025',
    folioId: 'FOL-8043',
    reservationId: 'RES-8043',
    guestName: 'Arthur Pendelton',
    roomNumber: '712',
    type: TRANSACTION_TYPE.PAYMENT,
    amount: 1140.00,
    currency: 'USD',
    paymentMethod: 'Amex •••• 5501',
    provider: 'Stripe Payments (Simulated Gateway)',
    providerReference: 'ch_3Nx12d2eZvKYlo2C40kTAg2C',
    authCode: 'AUTH-99120',
    status: TRANSACTION_STATUS.CAPTURED,
    reconciliationStatus: RECONCILIATION_STATUS.UNRECONCILED,
    batchId: 'BATCH-2026-10-22-CURRENT',
    capturedBy: 'EMP-501 (Marcus Sterling)',
    timestamp: hoursAgo(3),
    fee: 39.90,
    net: 1100.10,
    idempotencyKey: 'idemp_txn_9025_99120',
    refundableBalance: 1140.00,
    refundHistory: [],
    timeline: [
      { event: 'Direct Corporate Payment Captured', timestamp: hoursAgo(3), actor: 'EMP-501 (Marcus Sterling)', details: 'Full 3-night suite rate captured.' }
    ]
  },
  {
    id: 'TXN-9026',
    folioId: 'FOL-8042',
    reservationId: 'RES-8042',
    guestName: 'David Vance',
    roomNumber: '1204',
    type: TRANSACTION_TYPE.REFUND,
    amount: 75.00,
    currency: 'USD',
    paymentMethod: 'Amex •••• 1004',
    provider: 'Stripe Payments (Simulated Gateway)',
    providerReference: 're_3Nx09b2eZvKYlo2C28hRZe9A_01',
    authCode: 'REF-5001-AUTH',
    status: TRANSACTION_STATUS.SETTLED,
    reconciliationStatus: RECONCILIATION_STATUS.MATCHED,
    batchId: 'BATCH-2026-10-21-A',
    capturedBy: 'EMP-501 (Marcus Sterling)',
    timestamp: hoursAgo(18),
    fee: -2.62,
    net: -75.00,
    idempotencyKey: 'idemp_ref_5001_exec',
    refundableBalance: 0.00,
    refundHistory: [],
    timeline: [
      { event: 'Refund Initiated', timestamp: hoursAgo(22), actor: 'EMP-401 (David Martinez)', details: 'AC compressor rattling noise compensation.' },
      { event: 'Approved by Manager', timestamp: hoursAgo(20), actor: 'EMP-102 (Elena Rostova)', details: 'Approved under delegated recovery limit.' },
      { event: 'Executed by Finance Operator', timestamp: hoursAgo(18), actor: 'EMP-501 (Marcus Sterling)', details: 'Gateway refund reference re_3Nx09b2e... created.' }
    ]
  },
  {
    id: 'TXN-9027',
    folioId: 'FOL-8045',
    reservationId: 'RES-8045',
    guestName: 'Gregory House',
    roomNumber: '804',
    type: TRANSACTION_TYPE.PAYMENT,
    amount: 245.00,
    currency: 'USD',
    paymentMethod: 'Visa •••• 9921',
    provider: 'Stripe Payments (Simulated Gateway)',
    providerReference: 'ch_3Nx14f2eZvKYlo2C52mVCi4E',
    authCode: 'AUTH-ERR-DECLINE',
    status: TRANSACTION_STATUS.FAILED,
    reconciliationStatus: RECONCILIATION_STATUS.VARIANCE_FLAGGED,
    batchId: null,
    capturedBy: 'EMP-401 (David Martinez)',
    timestamp: hoursAgo(8),
    fee: 0.00,
    net: 0.00,
    idempotencyKey: 'idemp_txn_9027_fail',
    refundableBalance: 0.00,
    refundHistory: [],
    timeline: [
      { event: 'Capture Attempted', timestamp: hoursAgo(8), actor: 'EMP-401 (David Martinez)', details: 'Transaction declined by card issuer: Insufficient Funds (Do Not Honor).' }
    ]
  },
  {
    id: 'TXN-9028',
    folioId: 'FOL-8046',
    reservationId: 'RES-8046',
    guestName: 'Eleanor Vance',
    roomNumber: '506',
    type: TRANSACTION_TYPE.ADJUSTMENT,
    amount: -45.00,
    currency: 'USD',
    paymentMethod: 'Internal Ledger Adjustment',
    provider: 'Internal Financial Ledger',
    providerReference: 'ADJ-8812',
    authCode: 'ADJ-OK',
    status: TRANSACTION_STATUS.SETTLED,
    reconciliationStatus: RECONCILIATION_STATUS.MATCHED,
    batchId: 'BATCH-2026-10-21-A',
    capturedBy: 'EMP-501 (Marcus Sterling)',
    timestamp: hoursAgo(26),
    fee: 0.00,
    net: -45.00,
    idempotencyKey: 'idemp_adj_8812',
    refundableBalance: 0.00,
    refundHistory: [],
    timeline: [
      { event: 'Auditable Adjustment Posted', timestamp: hoursAgo(26), actor: 'EMP-501 (Marcus Sterling)', details: 'Corrected erroneous double-posting of valet parking fee.' }
    ]
  }
];

// REFUND REQUESTS WORKFLOW (Separation of Duties Lifecycle)
export const INITIAL_REFUND_REQUESTS = [
  {
    id: 'REF-5001',
    originalTransactionId: 'TXN-9022',
    folioId: 'FOL-8042',
    reservationId: 'RES-8042',
    guestName: 'David Vance',
    roomNumber: '1204',
    amount: 75.00,
    currency: 'USD',
    originalAmount: 501.20,
    refundableRemaining: 426.20,
    reason: 'AC compressor loud vibration noise in Suite 1204 during night 1.',
    category: 'Service Recovery',
    status: REFUND_STATUS.COMPLETED,
    requester: {
      id: 'EMP-401',
      name: 'David Martinez',
      role: 'Front Desk Coordinator'
    },
    requestedAt: hoursAgo(22),
    approver: {
      id: 'EMP-102',
      name: 'Elena Rostova',
      role: 'Department Manager'
    },
    approvedAt: hoursAgo(20),
    approvalNotes: 'Approved within $250 recovery authorization limit.',
    executor: {
      id: 'EMP-501',
      name: 'Marcus Sterling',
      role: 'Financial Operator'
    },
    executedAt: hoursAgo(18),
    executionNotes: 'Executed via Stripe API. Gateway reference re_3Nx09b2eZvKYlo2C28hRZe9A_01.',
    providerRefundId: 're_3Nx09b2eZvKYlo2C28hRZe9A_01',
    idempotencyKey: 'idemp_ref_5001_exec',
    auditTrail: [
      { timestamp: hoursAgo(22), actor: 'David Martinez', event: 'Refund Requested', details: 'Requested $75.00 for guest disturbance.' },
      { timestamp: hoursAgo(20), actor: 'Elena Rostova', event: 'Refund Approved', details: 'Independent Manager approval recorded.' },
      { timestamp: hoursAgo(18), actor: 'Marcus Sterling', event: 'Refund Executed', details: 'Gateway credit transaction submitted and confirmed.' }
    ]
  },
  {
    id: 'REF-5002',
    originalTransactionId: 'TXN-9021',
    folioId: 'FOL-8041',
    reservationId: 'RES-8041',
    guestName: 'Sophia Chen',
    roomNumber: '412',
    amount: 48.00,
    currency: 'USD',
    originalAmount: 322.62,
    refundableRemaining: 274.62,
    reason: 'Executive Dinner was delivered cold after 90 minute delay.',
    category: 'F&B Dissatisfaction',
    status: REFUND_STATUS.PENDING_APPROVAL,
    requester: {
      id: 'EMP-401',
      name: 'David Martinez',
      role: 'Front Desk Coordinator'
    },
    requestedAt: hoursAgo(2),
    approver: null,
    approvedAt: null,
    approvalNotes: '',
    executor: null,
    executedAt: null,
    executionNotes: '',
    providerRefundId: null,
    idempotencyKey: 'idemp_ref_5002_pend',
    auditTrail: [
      { timestamp: hoursAgo(2), actor: 'David Martinez', event: 'Refund Requested', details: 'Awaiting independent approval from Finance/Manager.' }
    ]
  },
  {
    id: 'REF-5003',
    originalTransactionId: 'TXN-9023',
    folioId: 'FOL-8047',
    reservationId: 'RES-8047',
    guestName: 'Claire Beauchamp',
    roomNumber: '902',
    amount: 180.00,
    currency: 'USD',
    originalAmount: 540.00,
    refundableRemaining: 360.00,
    reason: 'Guest departed 1 night early due to family emergency.',
    category: 'Early Departure Policy',
    status: REFUND_STATUS.APPROVED, // Approved, awaiting execution!
    requester: {
      id: 'EMP-401',
      name: 'David Martinez',
      role: 'Front Desk Coordinator'
    },
    requestedAt: hoursAgo(4),
    approver: {
      id: 'EMP-102',
      name: 'Elena Rostova',
      role: 'Department Manager'
    },
    approvedAt: hoursAgo(1),
    approvalNotes: 'Approved waiver of early departure fee per GM policy.',
    executor: null,
    executedAt: null,
    executionNotes: 'Ready for Financial Operator gateway dispatch.',
    providerRefundId: null,
    idempotencyKey: 'idemp_ref_5003_exec',
    auditTrail: [
      { timestamp: hoursAgo(4), actor: 'David Martinez', event: 'Refund Requested', details: 'Submitted $180 early departure refund.' },
      { timestamp: hoursAgo(1), actor: 'Elena Rostova', event: 'Refund Approved', details: 'Manager sign-off completed. Queued for execution.' }
    ]
  },
  {
    id: 'REF-5004',
    originalTransactionId: 'TXN-9025',
    folioId: 'FOL-8043',
    reservationId: 'RES-8043',
    guestName: 'Arthur Pendelton',
    roomNumber: '712',
    amount: 1200.00,
    currency: 'USD',
    originalAmount: 1140.00,
    refundableRemaining: 1140.00,
    reason: 'Full billing dispute and room cancellation claim.',
    category: 'Billing Dispute',
    status: REFUND_STATUS.REJECTED,
    requester: {
      id: 'EMP-401',
      name: 'David Martinez',
      role: 'Front Desk Coordinator'
    },
    requestedAt: daysAgo(2),
    approver: {
      id: 'EMP-501',
      name: 'Marcus Sterling',
      role: 'Financial Operator'
    },
    approvedAt: daysAgo(2),
    approvalNotes: 'Rejected: Requested refund amount ($1,200) exceeds original transaction value ($1,140.00) and guest completed full stay.',
    executor: null,
    executedAt: null,
    executionNotes: '',
    providerRefundId: null,
    idempotencyKey: 'idemp_ref_5004_rej',
    auditTrail: [
      { timestamp: daysAgo(2), actor: 'David Martinez', event: 'Refund Requested', details: 'Submitted refund request for $1,200.' },
      { timestamp: daysAgo(2), actor: 'Marcus Sterling', event: 'Refund Rejected', details: 'Rejected due to amount exceeding transaction and stay completed.' }
    ]
  }
];

// RECONCILIATION BATCHES
export const INITIAL_RECONCILIATION_BATCHES = [
  {
    batchId: 'BATCH-2026-10-21-A',
    settlementDate: daysAgo(1),
    provider: 'Stripe Payments',
    merchantAccountId: 'acct_1Hq928AzStayOps',
    currency: 'USD',
    internalCount: 3,
    internalGross: 439.82,
    internalFees: 6.74,
    internalNet: 433.08,
    providerCount: 3,
    providerGross: 439.82,
    providerFees: 6.74,
    providerNet: 433.08,
    variance: 0.00,
    matchedCount: 3,
    unmatchedCount: 0,
    status: RECONCILIATION_STATUS.MATCHED,
    reviewedBy: 'EMP-501 (Marcus Sterling)',
    reconciledAt: hoursAgo(10),
    notes: 'All terminal authorizations matched with Stripe payout batch #PO-88219.',
    items: [
      { internalId: 'TXN-9021', providerRef: 'ch_3Nx08a2eZvKYlo2C17gQYd8Z', amount: 322.62, status: 'MATCHED', difference: 0 },
      { internalId: 'TXN-9026', providerRef: 're_3Nx09b2eZvKYlo2C28hRZe9A_01', amount: -75.00, status: 'MATCHED', difference: 0 },
      { internalId: 'TXN-9028', providerRef: 'ADJ-8812', amount: -45.00, status: 'MATCHED', difference: 0 }
    ]
  },
  {
    batchId: 'BATCH-2026-10-20-B',
    settlementDate: daysAgo(2),
    provider: 'Stripe Payments',
    merchantAccountId: 'acct_1Hq928AzStayOps',
    currency: 'USD',
    internalCount: 1,
    internalGross: 501.20,
    internalFees: 17.54,
    internalNet: 483.66,
    providerCount: 1,
    providerGross: 501.20,
    providerFees: 17.54,
    providerNet: 483.66,
    variance: 0.00,
    matchedCount: 1,
    unmatchedCount: 0,
    status: RECONCILIATION_STATUS.MATCHED,
    reviewedBy: 'EMP-501 (Marcus Sterling)',
    reconciledAt: daysAgo(1),
    notes: 'Reconciled with Amex direct settlement payout.',
    items: [
      { internalId: 'TXN-9022', providerRef: 'ch_3Nx09b2eZvKYlo2C28hRZe9A', amount: 501.20, status: 'MATCHED', difference: 0 }
    ]
  },
  {
    batchId: 'BATCH-2026-10-22-CURRENT',
    settlementDate: todayDate,
    provider: 'Stripe & Adyen Hybrid Batch',
    merchantAccountId: 'acct_1Hq928AzStayOps',
    currency: 'USD',
    internalCount: 2,
    internalGross: 1385.00, // TXN-9025 (1140) + TXN-9027 failed (245)
    internalFees: 39.90,
    internalNet: 1345.10,
    providerCount: 1,
    providerGross: 1140.00, // Gateway shows only 1140 because 9027 failed
    providerFees: 39.90,
    providerNet: 1100.10,
    variance: 245.00,
    matchedCount: 1,
    unmatchedCount: 1,
    status: RECONCILIATION_STATUS.VARIANCE_FLAGGED,
    reviewedBy: null,
    reconciledAt: null,
    notes: 'Variance detected: TXN-9027 ($245.00) declined at gateway, internal folio shows pending balance.',
    items: [
      { internalId: 'TXN-9025', providerRef: 'ch_3Nx12d2eZvKYlo2C40kTAg2C', amount: 1140.00, status: 'MATCHED', difference: 0 },
      { internalId: 'TXN-9027', providerRef: 'ch_3Nx14f2eZvKYlo2C52mVCi4E', amount: 245.00, status: 'UNMATCHED', difference: 245.00, reason: 'Gateway Issuer Decline' }
    ]
  }
];

// FINANCIAL DISCREPANCIES TRIAGE & AUDIT
export const INITIAL_FINANCIAL_DISCREPANCIES = [
  {
    id: 'DISC-701',
    linkedTransactionId: 'TXN-9027',
    folioId: 'FOL-8045',
    reservationId: 'RES-8045',
    guestName: 'Gregory House',
    roomNumber: '804',
    type: 'Declined Authorization / Unsettled Room Charge',
    description: 'Guest card was declined during night audit check. Room rate $245.00 uncollected.',
    expectedValue: 245.00,
    recordedValue: 0.00,
    variance: 245.00,
    currency: 'USD',
    priority: DISCREPANCY_PRIORITY.HIGH,
    assignedReviewer: 'Marcus Sterling (Financial Operator)',
    status: DISCREPANCY_STATUS.OPEN,
    deadline: 'Today, 20:00',
    investigationNotes: 'Attempted re-authorization on file card; issuer code remains Do Not Honor. Alerted Front Desk to request replacement card upon return.',
    nextAction: 'Contact guest at front desk or lock electronic key upon next read.',
    resolutionDetails: null,
    createdAt: hoursAgo(8),
    updatedAt: hoursAgo(3)
  },
  {
    id: 'DISC-702',
    linkedTransactionId: 'TXN-9022',
    folioId: 'FOL-8042',
    reservationId: 'RES-8042',
    guestName: 'David Vance',
    roomNumber: '1204',
    type: 'Minibar Consumption Dispute',
    description: 'Guest contends $32.00 minibar charge was already removed by front desk clerk.',
    expectedValue: 0.00,
    recordedValue: 32.00,
    variance: 32.00,
    currency: 'USD',
    priority: DISCREPANCY_PRIORITY.MEDIUM,
    assignedReviewer: 'Marcus Sterling (Financial Operator)',
    status: DISCREPANCY_STATUS.INVESTIGATING,
    deadline: 'Tomorrow, 12:00',
    investigationNotes: 'Housekeeping automated minibar sensor recorded sensor break at 23:14 on Oct 20. Verification photo pending from floor supervisor.',
    nextAction: 'Review supervisor inspection log and apply courtesy adjustment if sensor error.',
    resolutionDetails: null,
    createdAt: hoursAgo(14),
    updatedAt: hoursAgo(1)
  },
  {
    id: 'DISC-703',
    linkedTransactionId: 'TXN-9028',
    folioId: 'FOL-8046',
    reservationId: 'RES-8046',
    guestName: 'Eleanor Vance',
    roomNumber: '506',
    type: 'Double Valet Fee Posting',
    description: 'Valet parking fee was posted twice by night auditor and valet podium.',
    expectedValue: 45.00,
    recordedValue: 90.00,
    variance: 45.00,
    currency: 'USD',
    priority: DISCREPANCY_PRIORITY.LOW,
    assignedReviewer: 'Marcus Sterling (Financial Operator)',
    status: DISCREPANCY_STATUS.RESOLVED,
    deadline: 'Completed',
    investigationNotes: 'Verified duplicate valet ticket #V-4010. Reversed redundant charge via auditable transaction ADJ-8812.',
    nextAction: 'Closed.',
    resolutionDetails: 'Issued $45.00 ledger adjustment ADJ-8812. Folio balance restored to correct total.',
    createdAt: daysAgo(2),
    updatedAt: hoursAgo(26)
  }
];

// READ-ONLY FINANCIAL AUDIT TRAIL
export const INITIAL_FINANCIAL_AUDIT_LOGS = [
  {
    id: 'FAUD-1001',
    timestamp: hoursAgo(2),
    actor: 'Marcus Sterling (Financial Operator - EMP-501)',
    action: 'DISCREPANCY_STATUS_UPDATE',
    recordReference: 'DISC-701',
    previousValue: 'Status: Unassigned',
    newValue: 'Status: Open (Assigned to Marcus Sterling)',
    reason: 'Triage high-priority declined transaction TXN-9027.',
    approvalReference: 'N/A - Operational Investigation',
    executionResult: 'SUCCESS',
    providerReference: 'ch_3Nx14f2eZvKYlo2C52mVCi4E'
  },
  {
    id: 'FAUD-1002',
    timestamp: hoursAgo(3),
    actor: 'Marcus Sterling (Financial Operator - EMP-501)',
    action: 'RECORD_PAYMENT',
    recordReference: 'TXN-9025 / FOL-8043',
    previousValue: 'Folio Balance: $1,140.00',
    newValue: 'Folio Balance: $0.00 (Captured)',
    reason: 'Corporate direct card settlement for Arthur Pendelton suite booking.',
    approvalReference: 'Self-Authorized (Within $1,000 limit)',
    executionResult: 'SUCCESS',
    providerReference: 'ch_3Nx12d2eZvKYlo2C40kTAg2C'
  },
  {
    id: 'FAUD-1003',
    timestamp: hoursAgo(18),
    actor: 'Marcus Sterling (Financial Operator - EMP-501)',
    action: 'EXECUTE_REFUND',
    recordReference: 'REF-5001 / TXN-9026',
    previousValue: 'Status: Approved',
    newValue: 'Status: Completed (Executed)',
    reason: 'AC compressor disturbance service recovery.',
    approvalReference: 'Elena Rostova (Department Manager - EMP-102)',
    executionResult: 'SUCCESS',
    providerReference: 're_3Nx09b2eZvKYlo2C28hRZe9A_01'
  },
  {
    id: 'FAUD-1004',
    timestamp: hoursAgo(20),
    actor: 'Elena Rostova (Department Manager - EMP-102)',
    action: 'APPROVE_REFUND',
    recordReference: 'REF-5001',
    previousValue: 'Status: Pending Approval',
    newValue: 'Status: Approved',
    reason: 'Independent review of Front Desk compensation request.',
    approvalReference: 'Delegated Manager Authority ($250 Limit)',
    executionResult: 'SUCCESS',
    providerReference: 'ch_3Nx09b2eZvKYlo2C28hRZe9A'
  },
  {
    id: 'FAUD-1005',
    timestamp: hoursAgo(26),
    actor: 'Marcus Sterling (Financial Operator - EMP-501)',
    action: 'POST_LEDGER_ADJUSTMENT',
    recordReference: 'ADJ-8812 / FOL-8046',
    previousValue: 'Balance: $90.00',
    newValue: 'Balance: $45.00',
    reason: 'Reversal of erroneous duplicate valet fee posting.',
    approvalReference: 'Marcus Sterling (Financial Operator)',
    executionResult: 'SUCCESS',
    providerReference: 'INTERNAL-CORRECTION'
  }
];

// FINANCIAL OPERATOR NOTIFICATIONS
export const INITIAL_FINANCIAL_NOTIFICATIONS = [
  {
    id: 'FNOT-FIN-01',
    type: 'refund_approval',
    title: 'Refund Request Pending Review: $48.00',
    message: 'Front Desk submitted REF-5002 for Sophia Chen (Folio FOL-8041) due to dinner delay.',
    timestamp: hoursAgo(2),
    read: false,
    priority: 'medium',
    actionRoute: '/finance/refunds'
  },
  {
    id: 'FNOT-FIN-02',
    type: 'refund_execution',
    title: 'Approved Refund Awaiting Execution: $180.00',
    message: 'Manager Elena Rostova approved REF-5003 for Claire Beauchamp. Gateway execution required.',
    timestamp: hoursAgo(1),
    read: false,
    priority: 'high',
    actionRoute: '/finance/refunds'
  },
  {
    id: 'FNOT-FIN-03',
    type: 'discrepancy_alert',
    title: 'Critical Discrepancy: $245.00 Uncollected',
    message: 'Declined transaction TXN-9027 in Room 804 requires front desk replacement card.',
    timestamp: hoursAgo(8),
    read: false,
    priority: 'urgent',
    actionRoute: '/finance/discrepancies'
  },
  {
    id: 'FNOT-FIN-04',
    type: 'reconciliation_variance',
    title: 'Settlement Variance in Current Batch',
    message: 'Batch BATCH-2026-10-22-CURRENT has $245.00 difference between internal and gateway totals.',
    timestamp: hoursAgo(3),
    read: true,
    priority: 'medium',
    actionRoute: '/finance/reconciliation'
  }
];
