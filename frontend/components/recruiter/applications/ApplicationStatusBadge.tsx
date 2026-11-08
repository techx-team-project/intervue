import { APPLICATION_STATUS_META } from '@/constants/application-status';
import { cn } from '@/lib/utils';
import type { ApplicationStatus } from '@/types/recruiter-application';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export default function ApplicationStatusBadge({ status, className }: ApplicationStatusBadgeProps) {
  const meta = APPLICATION_STATUS_META[status];

  return (
    <span
      className={cn(
        'text-label-sm inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-bold',
        meta.chipClassName,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}
