import type { CandidateApplicationStatus } from '@/types/candidate-application';

export const REVIEW_PAGE_SIZE = 10;

export const REVIEW_STATUS_META: Record<
  CandidateApplicationStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  DRAFT: { label: 'Bản nháp', variant: 'default' },
  APPLIED: { label: 'Mới nộp', variant: 'info' },
  VIEWED: { label: 'Đã xem', variant: 'default' },
  IN_REVIEW: { label: 'Đang xem xét', variant: 'warning' },
  INTERVIEW: { label: 'Phỏng vấn', variant: 'info' },
  OFFER: { label: 'Đề nghị', variant: 'success' },
  HIRED: { label: 'Đã tuyển', variant: 'success' },
  REJECTED: { label: 'Từ chối', variant: 'danger' },
  WITHDRAWN: { label: 'Ứng viên rút', variant: 'default' },
  JOB_CLOSED: { label: 'Tin đã đóng', variant: 'default' },
};

export const REVIEW_TABS: Array<{ value: CandidateApplicationStatus | undefined; label: string }> = [
  { value: undefined, label: 'Tất cả' },
  { value: 'APPLIED', label: 'Mới nộp' },
  { value: 'VIEWED', label: 'Đã xem' },
  { value: 'IN_REVIEW', label: 'Đang xem xét' },
  { value: 'INTERVIEW', label: 'Phỏng vấn' },
  { value: 'OFFER', label: 'Đề nghị' },
  { value: 'HIRED', label: 'Đã tuyển' },
  { value: 'REJECTED', label: 'Từ chối' },
];

export const REVIEW_ACTION_LABELS: Partial<Record<CandidateApplicationStatus, string>> = {
  IN_REVIEW: 'Xem xét',
  INTERVIEW: 'Mời phỏng vấn',
  OFFER: 'Gửi đề nghị',
  HIRED: 'Đã tuyển',
  REJECTED: 'Từ chối',
};
