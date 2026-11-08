import { Badge } from '@/components/ui/Badge';
import { INTERVIEW_STATUS_META } from '@/constants/interview';
import type { InterviewStatus } from '@/types/interview';

export default function InterviewStatusBadge({ status, label }: { status: InterviewStatus; label?: string }) {
  const meta = INTERVIEW_STATUS_META[status];
  return <Badge variant={meta.variant}>{label ?? meta.label}</Badge>;
}
