'use client';

import UserAvatar from '@/components/ui/UserAvatar';
import { ROUTES } from '@/constants/routes';
import { lockBlockedReason } from '@/lib/admin-user';
import { cn } from '@/lib/utils';
import type { AdminUserListItem } from '@/types/admin-user';
import { formatDate } from '@/utils/datetime';
import Link from 'next/link';
import AdminUserRoleChips from './AdminUserRoleChips';
import AdminUserRowActionsMenu from './AdminUserRowActionsMenu';
import AdminUserSignals from './AdminUserSignals';
import AdminUserStatusBadge from './AdminUserStatusBadge';
import type { AdminUserConfirmKind } from '@/hooks/useAdminUserActions';

interface AdminUsersTableProps {
  users: AdminUserListItem[];
  allUsers: AdminUserListItem[];
  currentAdminId: number;
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onLock: (user: AdminUserListItem) => void;
  onConfirm: (kind: AdminUserConfirmKind, user: AdminUserListItem) => void;
}

const GRID = 'grid grid-cols-[auto_minmax(0,3fr)_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]';

export default function AdminUsersTable({
  users,
  allUsers,
  currentAdminId,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onLock,
  onConfirm,
}: AdminUsersTableProps) {
  const selectableIds = users.filter((user) => user.id !== currentAdminId).map((user) => user.id);
  const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id));

  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 hidden rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-7 lg:block">
      <div className="overflow-x-auto">
        <div className="min-w-240">
          <div
            className={cn(
              GRID,
              'dark:border-forest-800 items-center gap-4 border-b border-[#f1f5f9] px-2.5 pb-2.5 text-[11px] font-bold tracking-wide text-[#94a3b8] uppercase',
            )}
          >
            <span className="flex items-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                aria-label="Select every account on this page"
                className="accent-primary h-4 w-4 cursor-pointer rounded border-slate-300"
              />
            </span>
            <span>User</span>
            <span>Roles</span>
            <span>Status</span>
            <span>Signals</span>
            <span>Joined</span>
            <span />
          </div>

          <div className="dark:divide-forest-800 divide-y divide-[#f1f5f9]">
            {users.map((user) => {
              const isSelf = user.id === currentAdminId;
              const isSelected = selectedIds.includes(user.id);

              return (
                <div
                  key={user.id}
                  className={cn(
                    GRID,
                    'dark:hover:bg-forest-850/40 items-center gap-4 rounded-lg px-2.5 py-3.5 transition hover:bg-[#f8fafc]',
                    isSelected && 'dark:bg-forest-850/60 bg-[#f1f5f9]',
                  )}
                >
                  <span className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isSelf}
                      onChange={() => onToggleSelect(user.id)}
                      title={isSelf ? 'This is your own account' : undefined}
                      aria-label={`Select ${user.name}`}
                      className="accent-primary h-4 w-4 cursor-pointer rounded border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                    />
                  </span>

                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar fullName={user.name} image={user.image} size="sm" />
                    <div className="min-w-0">
                      <Link
                        href={`${ROUTES.ADMIN_USERS}/${user.id}`}
                        className="text-navy dark:text-forest-50 hover:text-primary block truncate text-[13.5px] font-bold transition-colors"
                      >
                        {user.name}
                        {isSelf && <span className="ml-1.5 text-[11px] font-semibold text-[#94a3b8]">(you)</span>}
                      </Link>
                      <p className="dark:text-forest-300 truncate text-[12px] text-[#64748b]">{user.email}</p>
                    </div>
                  </div>

                  <AdminUserRoleChips roles={user.roles} />

                  <span>
                    <AdminUserStatusBadge status={user.status} />
                  </span>

                  <AdminUserSignals user={user} />

                  <span className="text-[11.5px] text-[#94a3b8]">{formatDate(user.createdAt)}</span>

                  <AdminUserRowActionsMenu
                    user={user}
                    lockBlockedReason={lockBlockedReason(user, currentAdminId, allUsers)}
                    onLock={() => onLock(user)}
                    onUnlock={() => onConfirm('unlock', user)}
                    onRevokeSessions={() => onConfirm('revokeSessions', user)}
                    onResetTwoFactor={() => onConfirm('resetTwoFactor', user)}
                    onSendPasswordReset={() => onConfirm('sendPasswordReset', user)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
