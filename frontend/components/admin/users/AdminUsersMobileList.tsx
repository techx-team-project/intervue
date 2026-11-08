'use client';

import UserAvatar from '@/components/ui/UserAvatar';
import { ROUTES } from '@/constants/routes';
import type { AdminUserConfirmKind } from '@/hooks/useAdminUserActions';
import { restrictBlockedReason } from '@/lib/admin-user';
import { cn } from '@/lib/utils';
import type { AdminUserListItem, AdminUserRestrictionKind } from '@/types/admin-user';
import { formatDate, formatRelativeDay } from '@/utils/datetime';
import { CalendarClock, Clock } from 'lucide-react';
import Link from 'next/link';
import AdminUserRoleChips from './AdminUserRoleChips';
import AdminUserRowActionsMenu from './AdminUserRowActionsMenu';
import AdminUserSignals from './AdminUserSignals';
import AdminUserStatusBadge from './AdminUserStatusBadge';

interface AdminUsersMobileListProps {
  users: AdminUserListItem[];
  allUsers: AdminUserListItem[];
  currentAdminId: number;
  selectedIds: number[];
  activeAdminCount?: number;
  onToggleSelect: (id: number) => void;
  onRestrict: (kind: AdminUserRestrictionKind, user: AdminUserListItem) => void;
  onConfirm: (kind: AdminUserConfirmKind, user: AdminUserListItem) => void;
}

export default function AdminUsersMobileList({
  users,
  allUsers,
  currentAdminId,
  selectedIds,
  activeAdminCount,
  onToggleSelect,
  onRestrict,
  onConfirm,
}: AdminUsersMobileListProps) {
  return (
    <div className="space-y-2.5 lg:hidden">
      {users.map((user) => {
        const isSelf = user.id === currentAdminId;
        const isSelected = selectedIds.includes(user.id);

        return (
          <article
            key={user.id}
            className={cn(
              'dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-2xl border bg-white p-3.5 shadow-xs transition',
              isSelected && 'border-primary/40 dark:bg-forest-850/60 bg-surface-container-low',
            )}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={isSelected}
                disabled={isSelf}
                onChange={() => onToggleSelect(user.id)}
                aria-label={`Select ${user.name}`}
                className="accent-primary border-outline mt-1 h-4 w-4 shrink-0 cursor-pointer rounded disabled:cursor-not-allowed disabled:opacity-40"
              />

              <UserAvatar fullName={user.name} image={user.image} size="sm" />

              <div className="min-w-0 flex-1">
                <Link
                  href={`${ROUTES.ADMIN_USERS}/${user.id}`}
                  className="text-navy dark:text-forest-50 text-body-md block truncate font-bold"
                >
                  {user.name}
                  {isSelf && <span className="text-label-sm text-outline ml-1.5 font-semibold">(you)</span>}
                </Link>
                <p className="dark:text-forest-300 text-body-sm text-on-surface-variant truncate">{user.email}</p>
              </div>

              <AdminUserRowActionsMenu
                user={user}
                banBlockedReason={restrictBlockedReason(user, 'ban', currentAdminId, allUsers, activeAdminCount)}
                onRestrict={onRestrict}
                onConfirm={onConfirm}
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 pl-7">
              <AdminUserStatusBadge status={user.status} restriction={user.restriction} />
              <AdminUserRoleChips roles={user.roles} />
            </div>

            <div className="dark:border-forest-800 border-outline-variant mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-2.5 pl-7">
              <AdminUserSignals user={user} />

              <span className="flex items-center gap-3">
                <span className="text-label-sm text-outline inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {user.lastSignInAt ? formatRelativeDay(user.lastSignInAt) : 'Never'}
                </span>
                <span className="text-label-sm text-outline inline-flex items-center gap-1.5">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {formatDate(user.createdAt)}
                </span>
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
