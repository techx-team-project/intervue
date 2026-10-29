'use client';

import AdminUserRoleChips from '@/components/admin/users/AdminUserRoleChips';
import AdminUserStatusBadge from '@/components/admin/users/AdminUserStatusBadge';
import UserAvatar from '@/components/ui/UserAvatar';
import { ROUTES } from '@/constants/routes';
import type { AdminUserListItem, AdminUserRestrictionKind } from '@/types/admin-user';
import { ArrowLeft, Ban, CircleCheck, Lock, LogOut, Unlock } from 'lucide-react';
import Link from 'next/link';

interface AdminUserDetailHeaderProps {
  user: AdminUserListItem;
  isSelf: boolean;
  lockBlockedReason: string | null;
  banBlockedReason: string | null;
  onRestrict: (kind: AdminUserRestrictionKind) => void;
  onLift: (kind: 'unlock' | 'unban') => void;
  onRevokeSessions: () => void;
}

export default function AdminUserDetailHeader({
  user,
  isSelf,
  lockBlockedReason,
  banBlockedReason,
  onRestrict,
  onLift,
  onRevokeSessions,
}: AdminUserDetailHeaderProps) {
  return (
    <header className="dark:border-forest-800 dark:bg-forest-900 rounded-2xl border border-[#e9eaec] bg-white p-4 shadow-xs sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3.5">
          <UserAvatar fullName={user.name} image={user.image} size="lg" />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-navy dark:text-forest-50 truncate text-lg font-black sm:text-xl">{user.name}</h1>
              <span className="dark:bg-forest-850 dark:text-forest-300 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                #{user.id}
              </span>
              {isSelf && (
                <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px] font-bold">
                  Your account
                </span>
              )}
            </div>

            <p className="dark:text-forest-300 mt-0.5 truncate text-[13px] text-[#64748b]">{user.email}</p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <AdminUserStatusBadge status={user.status} restriction={user.restriction} />
              <AdminUserRoleChips roles={user.roles} />
            </div>
          </div>
        </div>

        <Link
          href={ROUTES.ADMIN_USERS}
          className="dark:border-forest-800 dark:text-forest-100 dark:hover:bg-forest-850 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-[12.5px] font-bold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Back to users</span>
        </Link>
      </div>

      <div className="dark:border-forest-800 mt-4 flex flex-wrap items-center gap-2 border-t border-[#f1f5f9] pt-3.5">
        <button
          type="button"
          onClick={onRevokeSessions}
          disabled={user.activeSessionCount === 0}
          title={user.activeSessionCount === 0 ? 'No active session on this account' : undefined}
          className="dark:border-forest-800 dark:text-forest-100 dark:hover:bg-forest-850 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-[12.5px] font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          Revoke sessions
        </button>

        {user.status === 'LOCKED' && (
          <button
            type="button"
            onClick={() => onLift('unlock')}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-2 text-[12.5px] font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/10"
          >
            <Unlock className="h-3.5 w-3.5" />
            Unlock account
          </button>
        )}

        {user.status === 'BANNED' && (
          <button
            type="button"
            onClick={() => onLift('unban')}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-2 text-[12.5px] font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/10"
          >
            <CircleCheck className="h-3.5 w-3.5" />
            Unban account
          </button>
        )}

        {user.status !== 'LOCKED' && user.status !== 'BANNED' && (
          <button
            type="button"
            onClick={() => onRestrict('lock')}
            disabled={lockBlockedReason !== null}
            title={lockBlockedReason ?? undefined}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-2 text-[12.5px] font-bold text-amber-800 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-500/10"
          >
            <Lock className="h-3.5 w-3.5" />
            Lock account
          </button>
        )}

        {user.status !== 'BANNED' && (
          <button
            type="button"
            onClick={() => onRestrict('ban')}
            disabled={banBlockedReason !== null}
            title={banBlockedReason ?? undefined}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-2 text-[12.5px] font-bold text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-rose-500/10"
          >
            <Ban className="h-3.5 w-3.5" />
            Ban account
          </button>
        )}

        {banBlockedReason !== null && user.status !== 'BANNED' && (
          <span className="dark:text-forest-400 text-[11.5px] text-[#94a3b8]">{banBlockedReason}</span>
        )}
      </div>
    </header>
  );
}
