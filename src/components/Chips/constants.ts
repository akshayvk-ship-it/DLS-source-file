const getText = {
  Success: 'Success',
  Warning: 'Processing',
  Danger: 'Failed',
  Disabled: 'Disabled',
  Neutral: 'Neutral',
  Active: 'Active',
  Attempted: 'Attempted',
  Cancelled: 'Cancelled',
  Chargeback: 'Chargeback',
  Completed: 'Completed',
  Created: 'Created',
  Deleted: 'Deleted',
  Error: 'Error',
  Expired: 'Expired',
  Failed: 'Failed',
  Inactive: 'Inactive',
  Inprocess: 'Inprocess',
  Issued: 'Issued',
  Settled: 'Settled',
  NotSettled: 'Not Settled',
  Paid: 'Paid',
  PaidExpired: 'Paid Expired',
  PartPaid: 'Part Paid',
  PartPaidExpired: 'Part Paid Expired',
  PartiallyPaid: 'Partially Paid',
  PartiallyPaidExpired: 'Partially Paid Expired',
  PaymentAttempted: 'Payment Attempted',
  Pending: 'Pending',
  Processed: 'Processed',
  Processing: 'Processing',
  Published: 'Published',
  Refunded: 'Refunded',
  Rejected: 'Rejected',
  Unpaid: 'Unpaid',
  Unverified: 'Unverified',
  Validated: 'Validated',
  MandateSuccess: 'Mandate Success',
  MandateRejected: 'Mandate Rejected',
  MandatePending: 'Mandate Pending',
  PaidMandateSuccess: 'Paid Mandate Success',
  PaidMandateRejected: 'Paid Mandate Rejected',
  PaidMandatePending: 'Paid Mandate Pending',
};

const successColors = {
  prefixColor: 'bg-fill-success',
  textColor: 'text-text-success',
  borderColor: 'border-border-success-light',
  fillColor: 'bg-fill-success-light',
};

const warningColors = {
  prefixColor: 'bg-fill-caution',
  textColor: 'text-text-caution',
  borderColor: 'border-border-caution-light',
  fillColor: 'bg-fill-caution-light',
};

const neutralColors = {
  prefixColor: 'bg-icon-icon',
  textColor: 'text-text-text',
  borderColor: 'border-border-border',
  fillColor: 'bg-fill-fill-dark',
};

const dangerColors = {
  prefixColor: 'bg-fill-error',
  textColor: 'text-text-error',
  borderColor: 'border-border-error-light',
  fillColor: 'bg-fill-error-light',
};

const processedColors = {
  prefixColor: 'bg-fill-info',
  textColor: 'text-fill-info',
  borderColor: 'border-border-info-light',
  fillColor: 'bg-fill-info-light',
};

const chargebackColors = {
  prefixColor: 'bg-fill-action',
  textColor: 'text-text-action',
  borderColor: 'border-border-action-focused',
  fillColor: 'bg-fill-action-light',
};

const issuedColors = {
  prefixColor: 'bg-[#008080]',
  textColor: 'text-[#008080]',
  borderColor: 'border-[#8BDADA]',
  fillColor: 'bg-[#F6FCFC]',
};

const disabledColors = {
  prefixColor: 'bg-icon-pressed',
  textColor: 'text-text-light',
  borderColor: 'border-border-border-light',
  fillColor: 'bg-fill-disabled',
};

const getColors = {
  Success: successColors,
  Warning: warningColors,
  Danger: dangerColors,
  Neutral: neutralColors,
  Disabled: disabledColors,
  Active: successColors,
  Attempted: warningColors,
  Cancelled: neutralColors,
  Chargeback: chargebackColors,
  Completed: successColors,
  Created: processedColors,
  Deleted: dangerColors,
  Error: dangerColors,
  Expired: neutralColors,
  Failed: dangerColors,
  Inactive: neutralColors,
  Inprocess: processedColors,
  Issued: issuedColors,
  Settled: successColors,
  NotSettled: warningColors,
  Paid: successColors,
  PaidExpired: neutralColors,
  PartPaid: warningColors,
  PartPaidExpired: neutralColors,
  PartiallyPaid: warningColors,
  PartiallyPaidExpired: neutralColors,
  PaymentAttempted: warningColors,
  Pending: warningColors,
  Processed: processedColors,
  Processing: processedColors,
  Published: issuedColors,
  Refunded: chargebackColors,
  Rejected: dangerColors,
  Unpaid: dangerColors,
  Unverified: warningColors,
  Validated: successColors,
  MandateSuccess: successColors,
  MandateRejected: dangerColors,
  MandatePending: warningColors,
  PaidMandateSuccess: successColors,
  PaidMandateRejected: dangerColors,
  PaidMandatePending: warningColors,
};

export { getText, getColors };
