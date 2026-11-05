'use client';

import Button from '@/components/ui/Button';
import { useAccountSessions, useRevokeOtherSessions, useRevokeSession } from '@/hooks/useAccountSecurity';
import type { AuthPortal } from '@/lib/auth-portal';
import { getErrorMessage } from '@/utils/error';
import { LogOut } from 'lucide-react';
import SessionRow from './SessionRow';

type ActiveSessionsCardProps = { portal: AuthPortal };

export default function ActiveSessionsCard({ portal }: ActiveSessionsCardProps) {
  const sessions = useAccountSessions(portal);
  const revokeSession = useRevokeSession(portal);
  const revokeOthers = useRevokeOtherSessions(portal);

  const items = sessions.data ?? [];
  const hasOthers = items.some((session) => !session.current);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Sessions & active devices</h2>
          <p className="text-xs text-slate-500">Review and revoke access from devices you do not recognise.</p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasOthers}
          isLoading={revokeOthers.isPending}
          onClick={() => revokeOthers.mutate()}
          leftIcon={<LogOut className="h-3.5 w-3.5" />}
          className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800"
        >
          Sign out of all other devices
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        {sessions.isPending && (
          <div className="space-y-3" aria-busy="true">
            <div className="h-18 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-18 animate-pulse rounded-xl bg-slate-100" />
          </div>
        )}

        {sessions.isError && (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <p className="font-semibold">{getErrorMessage(sessions.error)}</p>
            <button
              type="button"
              onClick={() => sessions.refetch()}
              className="mt-1 cursor-pointer text-xs font-bold underline"
            >
              Try again
            </button>
          </div>
        )}

        {sessions.isSuccess && items.length === 0 && (
          <p className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
            No active sessions found.
          </p>
        )}

        {items.map((session) => (
          <SessionRow
            key={session.id}
            session={session}
            isRevoking={revokeSession.isPending && revokeSession.variables === session.id}
            onRevoke={() => revokeSession.mutate(session.id)}
          />
        ))}
      </div>
    </div>
  );
}
