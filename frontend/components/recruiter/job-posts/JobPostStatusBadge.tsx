import Badge from '@/components/ui/Badge';
import type { JobStatus } from '@/types/recruiter-job';

const STATUS_META: Record<
  JobStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  DRAFT: { label: 'Bản nháp', variant: 'default' },
  PUBLISHED: { label: 'Đang tuyển', variant: 'success' },
  PAUSED: { label: 'Tạm dừng', variant: 'warning' },
  CLOSED: { label: 'Đã đóng', variant: 'default' },
  EXPIRED: { label: 'Hết hạn', variant: 'danger' },
  HIDDEN_BY_ADMIN: { label: 'Bị ẩn', variant: 'danger' },
};

interface JobPostStatusBadgeProps {
  status: JobStatus;
}

export default function JobPostStatusBadge({ status }: JobPostStatusBadgeProps) {
  const meta = STATUS_META[status];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}

export { STATUS_META as JOB_STATUS_META };
