import Badge from '@/components/ui/Badge';
import { REVIEW_STATUS_META } from '@/constants/application-review';
import type { CandidateApplicationStatus } from '@/types/candidate-application';

export default function ReviewStatusBadge({ status }: { status: CandidateApplicationStatus }) {
  const meta = REVIEW_STATUS_META[status];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
