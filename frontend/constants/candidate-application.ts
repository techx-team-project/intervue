import type { CandidateApplicationStatus } from '@/types/candidate-application';

export const CANDIDATE_APPLICATION_STATUS_LABELS: Record<CandidateApplicationStatus, string> = {
  DRAFT: 'Draft',
  APPLIED: 'Applied',
  VIEWED: 'Viewed by recruiter',
  IN_REVIEW: 'In review',
  INTERVIEW: 'Interview',
  OFFER: 'Offer received',
  HIRED: 'Hired',
  REJECTED: 'Not a fit',
  WITHDRAWN: 'Withdrawn',
  JOB_CLOSED: 'Job closed',
};

export const WITHDRAWABLE_STATUSES: CandidateApplicationStatus[] = [
  'APPLIED',
  'VIEWED',
  'IN_REVIEW',
  'INTERVIEW',
  'OFFER',
];

export const MAX_RESUMES = 3;
export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
