import type { CandidateApplicationStatus } from '@/types/candidate-application';

export const REVIEW_PAGE_SIZE = 10;

export const REVIEW_STATUS_META: Record<
  CandidateApplicationStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  DRAFT: { label: 'Draft', variant: 'default' },
  APPLIED: { label: 'New', variant: 'info' },
  VIEWED: { label: 'Viewed', variant: 'default' },
  IN_REVIEW: { label: 'In review', variant: 'warning' },
  INTERVIEW: { label: 'Interview', variant: 'info' },
  OFFER: { label: 'Offer', variant: 'success' },
  HIRED: { label: 'Hired', variant: 'success' },
  REJECTED: { label: 'Rejected', variant: 'danger' },
  WITHDRAWN: { label: 'Withdrawn', variant: 'default' },
  JOB_CLOSED: { label: 'Job closed', variant: 'default' },
};

export const REVIEW_TABS: Array<{ value: CandidateApplicationStatus | undefined; label: string }> = [
  { value: undefined, label: 'All' },
  { value: 'APPLIED', label: 'New' },
  { value: 'VIEWED', label: 'Viewed' },
  { value: 'IN_REVIEW', label: 'In review' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'HIRED', label: 'Hired' },
  { value: 'REJECTED', label: 'Rejected' },
];

export const REVIEW_ACTION_LABELS: Partial<Record<CandidateApplicationStatus, string>> = {
  IN_REVIEW: 'Start review',
  INTERVIEW: 'Invite to interview',
  OFFER: 'Send offer',
  HIRED: 'Mark as hired',
  REJECTED: 'Reject',
};
