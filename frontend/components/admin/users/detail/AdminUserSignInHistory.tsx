import { cn } from '@/lib/utils';
import type { AdminUserSignIn } from '@/types/admin-user';
import { formatDateTime } from '@/utils/datetime';
import { MapPin, Monitor } from 'lucide-react';
import AdminUserPanel from './AdminUserPanel';

interface AdminUserSignInHistoryProps {
  signIns: AdminUserSignIn[];
}

export default function AdminUserSignInHistory({ signIns }: AdminUserSignInHistoryProps) {
  return (
    <AdminUserPanel
      title="Sign-in history"
      description="Reconstructed from the refresh tokens the account has been issued — one row per successful sign-in."
    >
      {signIns.length === 0 ? (
        <p className="dark:text-forest-300 py-2 text-[12.5px] text-[#64748b]">
          No sign-in has ever been recorded for this account.
        </p>
      ) : (
        <ol className="dark:divide-forest-800 divide-y divide-[#f1f5f9]">
          {signIns.map((signIn) => (
            <li key={signIn.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="dark:bg-forest-850 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <Monitor className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-navy dark:text-forest-50 truncate text-[12.5px] font-bold">{signIn.deviceLabel}</p>
                  <p className="dark:text-forest-300 flex items-center gap-1 text-[11.5px] text-[#64748b]">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {signIn.location} · {signIn.ipAddress}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="dark:text-forest-200 text-[11.5px] font-semibold text-[#475569]">
                  {formatDateTime(signIn.at)}
                </p>
                <p
                  className={cn(
                    'text-[11px] font-bold',
                    signIn.outcome === 'revoked' ? 'text-slate-400' : 'text-emerald-600',
                  )}
                >
                  {signIn.outcome === 'revoked' ? 'Session later revoked' : 'Session still valid'}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </AdminUserPanel>
  );
}
