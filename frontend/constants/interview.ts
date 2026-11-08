import type { InterviewFormat, InterviewStatus } from '@/types/interview';

export const INTERVIEW_PAGE_SIZE = 10;

export const INTERVIEW_STATUS_META: Record<
  InterviewStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  PROPOSED: { label: 'Chờ ứng viên xác nhận', variant: 'info' },
  CONFIRMED: { label: 'Đã xác nhận', variant: 'success' },
  DECLINED: { label: 'Ứng viên từ chối', variant: 'danger' },
  RESCHEDULE_REQUESTED: { label: 'Xin đổi giờ', variant: 'warning' },
  CANCELLED: { label: 'Đã huỷ', variant: 'default' },
};

export const CANDIDATE_INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  PROPOSED: 'Chờ bạn xác nhận',
  CONFIRMED: 'Bạn đã xác nhận',
  DECLINED: 'Bạn đã từ chối',
  RESCHEDULE_REQUESTED: 'Đang chờ nhà tuyển dụng trả lời',
  CANCELLED: 'Đã huỷ',
};

export const INTERVIEW_FORMAT_LABELS: Record<InterviewFormat, string> = {
  ONLINE: 'Trực tuyến',
  OFFLINE: 'Trực tiếp',
};

export const INTERVIEW_DURATION_OPTIONS = [
  { value: '30', label: '30 phút' },
  { value: '45', label: '45 phút' },
  { value: '60', label: '60 phút' },
  { value: '90', label: '90 phút' },
  { value: '120', label: '120 phút' },
];

export const INTERVIEW_FORMAT_OPTIONS = [
  { value: 'ONLINE', label: 'Trực tuyến (link họp)' },
  { value: 'OFFLINE', label: 'Trực tiếp (địa chỉ)' },
];

export const INTERVIEW_FILTER_TABS: Array<{ value: InterviewStatus | undefined; label: string }> = [
  { value: undefined, label: 'Tất cả' },
  { value: 'PROPOSED', label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'RESCHEDULE_REQUESTED', label: 'Xin đổi giờ' },
  { value: 'DECLINED', label: 'Từ chối' },
  { value: 'CANCELLED', label: 'Đã huỷ' },
];

export const ACTIVE_INTERVIEW_STATUSES: InterviewStatus[] = ['PROPOSED', 'CONFIRMED', 'RESCHEDULE_REQUESTED'];
