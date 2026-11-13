import type { RecruiterOrderStatus } from '@/types/recruiter-order';

export const ORDER_STATUS_LABEL: Record<RecruiterOrderStatus, string> = {
  PENDING_PAYMENT: 'Awaiting payment',
  UNDERPAID: 'Underpaid',
  PAID: 'Paid',
  FULFILLED: 'Activated',
  EXPIRED: 'Expired',
  CANCELLED: 'Cancelled',
  REFUND_REQUESTED: 'Refund pending',
  REFUNDED: 'Refunded',
};

export const ORDER_STATUS_STYLE: Record<RecruiterOrderStatus, string> = {
  PENDING_PAYMENT: 'bg-amber-50 text-amber-700',
  UNDERPAID: 'bg-orange-50 text-orange-700',
  PAID: 'bg-sky-50 text-sky-700',
  FULFILLED: 'bg-emerald-50 text-emerald-700',
  EXPIRED: 'bg-neutral-100 text-neutral-600',
  CANCELLED: 'bg-neutral-100 text-neutral-600',
  REFUND_REQUESTED: 'bg-violet-50 text-violet-700',
  REFUNDED: 'bg-violet-50 text-violet-700',
};

export const ORDER_CANCELLABLE: RecruiterOrderStatus[] = ['PENDING_PAYMENT', 'UNDERPAID'];

// Every status has a PDF to view: the real VAT invoice once paid, or an order-confirmation
// document beforehand (or after cancellation) that a recruiter can show their finance team.
export const ORDER_DOCUMENT_STATUSES: RecruiterOrderStatus[] = [
  'PENDING_PAYMENT',
  'UNDERPAID',
  'PAID',
  'FULFILLED',
  'CANCELLED',
  'REFUND_REQUESTED',
  'REFUNDED',
];
