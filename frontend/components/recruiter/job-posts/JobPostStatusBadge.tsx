import Badge from '@/components/ui/Badge';
import type { JobStatus } from '@/types/recruiter-job';

const STATUS_META: Record<
  JobStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  DRAFT: { label: 'Draft', variant: 'default' },
  PUBLISHED: { label: 'Hiring', variant: 'success' },
  PAUSED: { label: 'Paused', variant: 'warning' },
  CLOSED: { label: 'Closed', variant: 'default' },
  EXPIRED: { label: 'Expired', variant: 'danger' },
  HIDDEN_BY_ADMIN: { label: 'Hidden', variant: 'danger' },
};

interface JobPostStatusBadgeProps {
  status: JobStatus;
}

export default function JobPostStatusBadge({ status }: JobPostStatusBadgeProps) {
  const meta = STATUS_META[status];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}

export { STATUS_META as JOB_STATUS_META };
