'use client';

import { cn } from '@/lib/utils';
import type { AdminUserSession } from '@/types/admin-user';
import { formatDateTime } from '@/utils/datetime';
import { LogOut, Monitor, ShieldAlert } from 'lucide-react';
import AdminUserPanel from './AdminUserPanel';

interface AdminUserSessionsTabProps {
  sessions: AdminUserSession[];
  onRevokeAll: () => void;
}

export default function AdminUserSessionsTab({ sessions, onRevokeAll }: AdminUserSessionsTabProps) {
  const active = sessions.filter((session) => !session.revoked);

  return (
    <AdminUserPanel
      title="Sessions & devices"
      description="One row per refresh token. Tokens rotate on every use, so a revoked row that is presented again revokes the whole family."
      actions={
        active.length > 0 ? (
          <button
            type="button"
            onClick={onRevokeAll}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-2 text-[12.5px] font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:bg-rose-500/10"
          >
            <LogOut className="h-3.5 w-3.5" />
            Revoke all sessions
          </button>
        ) : (
          <span className="dark:text-forest-400 text-[11.5px] text-[#94a3b8]">No active session</span>
        )
      }
    >
      {sessions.length === 0 ? (
        <p className="dark:text-forest-300 py-2 text-[12.5px] text-[#64748b]">
          This account has never signed in from a device that kept a session.
        </p>
      ) : (
        <ul className="dark:divide-forest-800 divide-y divide-[#f1f5f9]">
          {sessions.map((session) => (
            <li key={session.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={cn(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    session.revoked ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600',
                  )}
                >
                  {session.replacedByTokenId && session.revoked ? (
                    <ShieldAlert className="h-4 w-4 text-rose-500" />
                  ) : (
                    <Monitor className="h-4 w-4" />
                  )}
                </span>

                <div className="min-w-0">
                  <p className="text-navy dark:text-forest-50 truncate text-[13px] font-bold">
                    {session.deviceLabel}
                    {session.isCurrent && (
                      <span className="bg-primary/10 text-primary ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-black">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="dark:text-forest-300 text-[11.5px] text-[#64748b]">
                    {session.ipAddress} · signed in {formatDateTime(session.createdAt)}
                  </p>
                  {session.replacedByTokenId && (
                    <p className="mt-0.5 text-[11.5px] font-semibold text-rose-600">
                      Presented after it was rotated — every session was revoked
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className={cn('text-[11.5px] font-bold', session.revoked ? 'text-slate-400' : 'text-emerald-600')}>
                  {session.revoked ? 'Revoked' : 'Active'}
                </p>
                <p className="text-[11px] text-[#94a3b8]">
                  {session.revoked ? 'Ended' : 'Expires'} {formatDateTime(session.expiresAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminUserPanel>
  );
}
