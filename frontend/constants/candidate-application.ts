import type { CandidateApplicationStatus } from '@/types/candidate-application';

export const CANDIDATE_APPLICATION_STATUS_LABELS: Record<CandidateApplicationStatus, string> = {
  DRAFT: 'Bản nháp',
  APPLIED: 'Đã nộp',
  VIEWED: 'Nhà tuyển dụng đã xem',
  IN_REVIEW: 'Đang xem xét',
  INTERVIEW: 'Phỏng vấn',
  OFFER: 'Đã có đề nghị',
  HIRED: 'Đã trúng tuyển',
  REJECTED: 'Không phù hợp',
  WITHDRAWN: 'Đã rút hồ sơ',
  JOB_CLOSED: 'Tin đã đóng',
};

export const WITHDRAWABLE_STATUSES: CandidateApplicationStatus[] = [
  'APPLIED',
  'VIEWED',
  'IN_REVIEW',
  'INTERVIEW',
  'OFFER',
];

export const MAX_RESUMES = 3;
