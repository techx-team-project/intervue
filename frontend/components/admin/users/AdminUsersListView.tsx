'use client';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { USER_ROLE_META, USER_SORT_OPTIONS, USER_STATUS_META } from '@/constants/admin-user';
import { ROUTES } from '@/constants/routes';
import { useAdminUserActions, type AdminUserConfirmKind } from '@/hooks/useAdminUserActions';
import { countSegment, filterUsers } from '@/lib/admin-user';
import type {
  AdminUserListData,
  AdminUserListItem,
  AdminUserSegment,
  AdminUserSort,
  AdminUserStatus,
} from '@/types/admin-user';
import type { RoleType } from '@/types/auth';
import { ShieldCheck, UsersRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import AdminUserBulkBar from './AdminUserBulkBar';
import AdminUserSegmentTabs from './AdminUserSegmentTabs';
import AdminUsersFilterBar from './AdminUsersFilterBar';
import AdminUsersMobileList from './AdminUsersMobileList';
import AdminUsersTable from './AdminUsersTable';

interface AdminUsersListViewProps {
  data: AdminUserListData;
}

const SEGMENT_VALUES: AdminUserSegment[] = ['all', 'candidates', 'recruiters', 'admins', 'locked', 'unverified'];
const SORT_VALUES = USER_SORT_OPTIONS.map((option) => option.value);

function readParam<T extends string>(raw: string | null, allowed: readonly T[], fallback: T): T {
  return raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback;
}

export default function AdminUsersListView({ data }: AdminUsersListViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { users, requestLock, requestConfirm, actionModals } = useAdminUserActions(data.users, data.currentAdminId);

  const segment = readParam(searchParams.get('segment'), SEGMENT_VALUES, 'all');
  const sort = readParam(searchParams.get('sort'), SORT_VALUES, 'newest' as AdminUserSort);
  const role = readParam(searchParams.get('role'), Object.keys(USER_ROLE_META) as RoleType[], '' as RoleType | '');
  const status = readParam(
    searchParams.get('status'),
    Object.keys(USER_STATUS_META) as AdminUserStatus[],
    '' as AdminUserStatus | '',
  );
  const search = searchParams.get('q') ?? '';

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value.length > 0) next.set(key, value);
    else next.delete(key);
    const query = next.toString();
    router.replace(query.length > 0 ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const visibleUsers = useMemo(
    () => filterUsers(users, { segment, search, role, status, sort }),
    [users, segment, search, role, status, sort],
  );

  const segmentCounts = useMemo(
    () => SEGMENT_VALUES.map((entry) => ({ segment: entry, count: countSegment(users, entry) })),
    [users],
  );

  const selectedUsers = users.filter((user) => selectedIds.includes(user.id));

  const toggleSelect = (id: number) =>
    setSelectedIds((previous) =>
      previous.includes(id) ? previous.filter((entry) => entry !== id) : [...previous, id],
    );

  const toggleSelectAll = () => {
    const selectable = visibleUsers.filter((user) => user.id !== data.currentAdminId).map((user) => user.id);
    const allSelected = selectable.length > 0 && selectable.every((id) => selectedIds.includes(id));
    setSelectedIds(
      allSelected
        ? selectedIds.filter((id) => !selectable.includes(id))
        : [...new Set([...selectedIds, ...selectable])],
    );
  };

  const handleLock = (user: AdminUserListItem) => requestLock([user]);
  const handleConfirm = (kind: AdminUserConfirmKind, user: AdminUserListItem) => requestConfirm(kind, [user]);

  const clearFilters = () => router.replace(pathname, { scroll: false });

  return (
    <div className="space-y-4 pb-20 lg:pb-0">
      <AdminPageHeader
        title="Users"
        description="Every account on the platform. One account can hold several roles at once."
        count={users.length}
        actions={
          <Link
            href={ROUTES.ADMIN_ADMINS}
            className="dark:border-forest-800 dark:text-forest-100 dark:hover:bg-forest-850 inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-[12.5px] font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ShieldCheck className="h-4 w-4" />
            Admin accounts
          </Link>
        }
      />

      <AdminUserSegmentTabs
        active={segment}
        counts={segmentCounts}
        onChange={(value) => setParam('segment', value === 'all' ? '' : value)}
      />

      <AdminUsersFilterBar
        search={search}
        role={role}
        status={status}
        sort={sort}
        onSearchChange={(value) => setParam('q', value)}
        onRoleChange={(value) => setParam('role', value)}
        onStatusChange={(value) => setParam('status', value)}
        onSortChange={(value) => setParam('sort', value === 'newest' ? '' : value)}
      />

      {visibleUsers.length === 0 ? (
        <div className="dark:border-forest-800 dark:bg-forest-900 flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#e2e8f0] bg-white px-6 py-16 text-center shadow-xs">
          <UsersRound className="h-10 w-10 text-[#cbd5e1]" />
          <p className="text-navy dark:text-forest-50 text-[14px] font-bold">No account matches these filters</p>
          <p className="dark:text-forest-300 max-w-sm text-[12.5px] text-[#64748b]">
            Try a different keyword, or widen the segment, role and status filters.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="text-primary mt-1 cursor-pointer text-[12.5px] font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <AdminUsersTable
            users={visibleUsers}
            allUsers={users}
            currentAdminId={data.currentAdminId}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onLock={handleLock}
            onConfirm={handleConfirm}
          />

          <AdminUsersMobileList
            users={visibleUsers}
            allUsers={users}
            currentAdminId={data.currentAdminId}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onLock={handleLock}
            onConfirm={handleConfirm}
          />
        </>
      )}

      <AdminUserBulkBar
        selectedCount={selectedUsers.length}
        onClear={() => setSelectedIds([])}
        onLock={() => requestLock(selectedUsers)}
        onRevokeSessions={() => requestConfirm('revokeSessions', selectedUsers)}
      />

      {actionModals}
    </div>
  );
}
