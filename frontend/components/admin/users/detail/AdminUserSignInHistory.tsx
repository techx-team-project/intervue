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
        <p className="dark:text-forest-300 text-body-sm text-on-surface-variant py-2">
          No sign-in has ever been recorded for this account.
        </p>
      ) : (
        <ol className="dark:divide-forest-800 divide-y divide-[#f1f5f9]">
          {signIns.map((signIn) => (
            <li key={signIn.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="dark:bg-forest-850 bg-surface-container-high text-on-surface-variant flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                  <Monitor className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-navy dark:text-forest-50 text-body-sm truncate font-bold">{signIn.deviceLabel}</p>
                  <p className="dark:text-forest-300 text-label-sm text-on-surface-variant flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {signIn.location} · {signIn.ipAddress}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="dark:text-forest-200 text-label-sm text-on-surface-variant font-semibold">
                  {formatDateTime(signIn.at)}
                </p>
                <p
                  className={cn(
                    'text-label-sm font-bold',
                    signIn.outcome === 'revoked' ? 'text-outline' : 'text-emerald-600',
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
