import { cn } from '@/lib/utils';
import type { AccountSession } from '@/types/account-security';
import { formatRelativeDay } from '@/utils/datetime';
import { Clock, Globe, Laptop } from 'lucide-react';

type SessionRowProps = {
  session: AccountSession;
  isRevoking: boolean;
  onRevoke: () => void;
};

function lastActiveLabel({ current, lastUsedAt }: AccountSession): string {
  if (current) return 'Active now';
  if (!lastUsedAt) return 'Last active: unknown';
  return `Last active: ${formatRelativeDay(lastUsedAt)}`;
}

export default function SessionRow({ session, isRevoking, onRevoke }: SessionRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-xl border p-4 transition',
        session.current
          ? 'border-primary/30 bg-emerald-50/40'
          : 'border-outline-variant bg-surface-container-low hover:bg-white',
      )}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            session.current ? 'text-primary bg-primary-container' : 'bg-surface-container-high text-on-surface-variant',
          )}
        >
          <Laptop className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-on-surface truncate text-sm font-bold">{session.deviceLabel}</span>
            {session.current && (
              <span className="bg-primary text-label-sm shrink-0 rounded-full px-2 py-0.5 font-bold text-white">
                This device
              </span>
            )}
          </div>
          <div className="text-on-surface-variant flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
            <span className="flex items-center gap-1">
              <Globe className="text-outline h-3.5 w-3.5" />
              {session.ipAddress}
              {session.location ? ` • ${session.location}` : ''}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="text-outline h-3.5 w-3.5" />
              {lastActiveLabel(session)}
            </span>
          </div>
        </div>
      </div>

      {!session.current && (
        <button
          type="button"
          disabled={isRevoking}
          onClick={onRevoke}
          className="text-error shrink-0 cursor-pointer text-xs font-bold hover:underline disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sign out
        </button>
      )}
    </div>
  );
}
