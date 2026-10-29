import Badge from '@/components/ui/Badge';
import { USER_STATUS_META } from '@/constants/admin-user';
import type { AdminUserRestriction, AdminUserStatus } from '@/types/admin-user';
import { formatDate } from '@/utils/datetime';
import { Ban, Lock } from 'lucide-react';

interface AdminUserStatusBadgeProps {
  status: AdminUserStatus;
  restriction?: AdminUserRestriction | null;
}

export default function AdminUserStatusBadge({ status, restriction }: AdminUserStatusBadgeProps) {
  const meta = USER_STATUS_META[status];
  const title = restriction
    ? `${restriction.reason} — ${restriction.byName}${restriction.expiresAt ? `, lifts ${formatDate(restriction.expiresAt)}` : ''}`
    : undefined;

  return (
    <Badge variant={meta.variant} title={title}>
      {status === 'LOCKED' && <Lock className="h-3 w-3" />}
      {status === 'BANNED' && <Ban className="h-3 w-3" />}
      {meta.label}
    </Badge>
  );
}
