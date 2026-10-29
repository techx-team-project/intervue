import { cn } from '@/lib/utils';
import type { AdminUserListItem } from '@/types/admin-user';
import { MailCheck, MailWarning, Monitor, ShieldAlert } from 'lucide-react';

interface AdminUserSignalsProps {
  user: AdminUserListItem;
  className?: string;
}

export default function AdminUserSignals({ user, className }: AdminUserSignalsProps) {
  const isVerified = user.emailVerifiedAt !== null;

  return (
    <span className={cn('flex items-center gap-2.5 text-[11.5px]', className)}>
      <span
        title={isVerified ? 'Email verified' : 'Email not verified'}
        className={cn('inline-flex items-center gap-1', isVerified ? 'text-emerald-600' : 'text-amber-600')}
      >
        {isVerified ? <MailCheck className="h-3.5 w-3.5" /> : <MailWarning className="h-3.5 w-3.5" />}
        <span className="sr-only">{isVerified ? 'Email verified' : 'Email not verified'}</span>
      </span>

      <span
        title={`${user.activeSessionCount} active session${user.activeSessionCount === 1 ? '' : 's'}`}
        className="dark:text-forest-300 inline-flex items-center gap-1 text-[#64748b]"
      >
        <Monitor className="h-3.5 w-3.5" />
        {user.activeSessionCount}
      </span>

      {user.hasTokenReuseIncident && (
        <span
          title="A revoked refresh token was presented again — every session was revoked"
          className="inline-flex items-center gap-1 text-rose-600"
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          <span className="sr-only">Token reuse detected</span>
        </span>
      )}
    </span>
  );
}
