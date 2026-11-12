import type { InterviewFormat, InterviewStatus } from '@/types/interview';

export const INTERVIEW_PAGE_SIZE = 10;

export const INTERVIEW_STATUS_META: Record<
  InterviewStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  PROPOSED: { label: 'Awaiting candidate', variant: 'info' },
  CONFIRMED: { label: 'Confirmed', variant: 'success' },
  DECLINED: { label: 'Candidate declined', variant: 'danger' },
  RESCHEDULE_REQUESTED: { label: 'Reschedule requested', variant: 'warning' },
  CANCELLED: { label: 'Cancelled', variant: 'default' },
};

export const CANDIDATE_INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  PROPOSED: 'Awaiting your confirmation',
  CONFIRMED: 'You confirmed',
  DECLINED: 'You declined',
  RESCHEDULE_REQUESTED: 'Waiting for the recruiter to reply',
  CANCELLED: 'Cancelled',
};

export const INTERVIEW_FORMAT_LABELS: Record<InterviewFormat, string> = {
  ONLINE: 'Online',
  OFFLINE: 'In person',
};

export const INTERVIEW_DURATION_OPTIONS = [
  { value: '30', label: '30 min' },
  { value: '45', label: '45 min' },
  { value: '60', label: '60 min' },
  { value: '90', label: '90 min' },
  { value: '120', label: '120 min' },
];

export const INTERVIEW_FORMAT_OPTIONS = [
  { value: 'ONLINE', label: 'Online (meeting link)' },
  { value: 'OFFLINE', label: 'In person (address)' },
];

export const INTERVIEW_FILTER_TABS: Array<{ value: InterviewStatus | undefined; label: string }> = [
  { value: undefined, label: 'All' },
  { value: 'PROPOSED', label: 'Pending confirmation' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'RESCHEDULE_REQUESTED', label: 'Reschedule requested' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const ACTIVE_INTERVIEW_STATUSES: InterviewStatus[] = ['PROPOSED', 'CONFIRMED', 'RESCHEDULE_REQUESTED'];
