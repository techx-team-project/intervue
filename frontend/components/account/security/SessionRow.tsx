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
        session.current ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-100 bg-slate-50 hover:bg-white',
      )}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            session.current ? 'text-primary bg-emerald-100' : 'bg-slate-200 text-slate-500',
          )}
        >
          <Laptop className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-bold text-slate-800">{session.deviceLabel}</span>
            {session.current && (
              <span className="bg-primary shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black text-white">
                This device
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              {session.ipAddress}
              {session.location ? ` • ${session.location}` : ''}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
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
          className="shrink-0 cursor-pointer text-xs font-bold text-rose-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sign out
        </button>
      )}
    </div>
  );
}
