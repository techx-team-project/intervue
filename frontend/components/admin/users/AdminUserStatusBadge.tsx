import Badge from '@/components/ui/Badge';
import { USER_STATUS_META } from '@/constants/admin-user';
import type { AdminUserStatus } from '@/types/admin-user';
import { Lock } from 'lucide-react';

interface AdminUserStatusBadgeProps {
  status: AdminUserStatus;
}

export default function AdminUserStatusBadge({ status }: AdminUserStatusBadgeProps) {
  const meta = USER_STATUS_META[status];

  return (
    <Badge variant={meta.variant}>
      {status === 'LOCKED' && <Lock className="h-3 w-3" />}
      {meta.label}
    </Badge>
  );
}
