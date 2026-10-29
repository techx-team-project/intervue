import { USER_ROLE_META } from '@/constants/admin-user';
import { isGrantActive } from '@/lib/admin-user';
import { cn } from '@/lib/utils';
import type { AdminUserRoleGrant } from '@/types/admin-user';
import { dayDifferenceFromToday, formatDate } from '@/utils/datetime';
import { Timer } from 'lucide-react';

interface AdminUserRoleChipsProps {
  roles: AdminUserRoleGrant[];
  className?: string;
}

function expiryTitle(grant: AdminUserRoleGrant): string {
  if (!grant.expiresAt) return '';
  const days = dayDifferenceFromToday(grant.expiresAt);
  const horizon = days <= 0 ? 'has expired' : days === 1 ? 'expires tomorrow' : `expires in ${days} days`;
  return `Temporary grant — ${horizon} (${formatDate(grant.expiresAt)})`;
}

export default function AdminUserRoleChips({ roles, className }: AdminUserRoleChipsProps) {
  const active = roles.filter(isGrantActive);

  if (active.length === 0) {
    return <span className="dark:text-forest-400 text-[12px] text-[#94a3b8]">No active role</span>;
  }

  return (
    <span className={cn('flex flex-wrap items-center gap-1', className)}>
      {active.map((grant) => (
        <span
          key={grant.role}
          title={expiryTitle(grant)}
          className={cn(
            'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-bold tracking-wide uppercase ring-1 ring-inset',
            USER_ROLE_META[grant.role].chipClassName,
          )}
        >
          {USER_ROLE_META[grant.role].label}
          {grant.expiresAt && <Timer className="h-3 w-3" />}
        </span>
      ))}
    </span>
  );
}
