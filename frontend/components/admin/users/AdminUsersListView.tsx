'use client';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import Pagination from '@/components/common/Pagination';
import { USER_PAGE_SIZE, USER_ROLE_META, USER_SORT_OPTIONS, USER_STATUS_META } from '@/constants/admin-user';
import { ROUTES } from '@/constants/routes';
import { useAdminUserActions, type AdminUserConfirmKind } from '@/hooks/useAdminUserActions';
import {
  buildAttentionItems,
  buildUserStats,
  countSegment,
  EMPTY_USER_FILTERS,
  filterUsers,
  hasActiveFilters,
  pageCount,
  paginate,
  type AdminUserFilters,
} from '@/lib/admin-user';
import type {
  AdminUserListData,
  AdminUserListItem,
  AdminUserRestrictionKind,
  AdminUserSegment,
  AdminUserSort,
  AdminUserStatus,
} from '@/types/admin-user';
import type { RoleType } from '@/types/auth';
import { ShieldCheck, UsersRound } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import AdminUserAttentionPanel from './AdminUserAttentionPanel';
import AdminUserBulkBar from './AdminUserBulkBar';
import AdminUserSegmentTabs from './AdminUserSegmentTabs';
import AdminUserStatsRow from './AdminUserStatsRow';
import AdminUsersFilterBar from './AdminUsersFilterBar';
import AdminUsersMobileList from './AdminUsersMobileList';
import AdminUsersTable from './AdminUsersTable';

interface AdminUsersListViewProps {
  data: AdminUserListData;
}

const SEGMENT_VALUES: AdminUserSegment[] = [
  'all',
  'candidates',
  'recruiters',
  'admins',
  'locked',
  'banned',
  'unverified',
];
const SORT_VALUES = USER_SORT_OPTIONS.map((option) => option.value);
const ROLE_VALUES = Object.keys(USER_ROLE_META) as RoleType[];
const STATUS_VALUES = Object.keys(USER_STATUS_META) as AdminUserStatus[];

function readParam<T extends string>(raw: string | null, allowed: readonly T[], fallback: T): T {
  return raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback;
}

export default function AdminUsersListView({ data }: AdminUsersListViewProps) {
  const searchParams = useSearchParams();

  // Filters are local state, not derived from the router: going through
  // router.replace re-ran this force-dynamic page on every keystroke, which is
  // what made filtering feel slow. The URL is still kept in sync below so a
  // filtered view stays shareable.
  const [filters, setFilters] = useState<AdminUserFilters>(() => ({
    segment: readParam(searchParams.get('segment'), SEGMENT_VALUES, 'all'),
    search: searchParams.get('q') ?? '',
    role: readParam(searchParams.get('role'), ROLE_VALUES, '' as RoleType | ''),
    status: readParam(searchParams.get('status'), STATUS_VALUES, '' as AdminUserStatus | ''),
    sort: readParam(searchParams.get('sort'), SORT_VALUES, 'newest' as AdminUserSort),
  }));
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { users, requestRestrict, requestConfirm, actionModals } = useAdminUserActions(data.users, data.currentAdminId);

  const syncUrl = (next: AdminUserFilters) => {
    const params = new URLSearchParams();
    if (next.segment !== 'all') params.set('segment', next.segment);
    if (next.search.trim().length > 0) params.set('q', next.search.trim());
    if (next.role !== '') params.set('role', next.role);
    if (next.status !== '') params.set('status', next.status);
    if (next.sort !== 'newest') params.set('sort', next.sort);
    const query = params.toString();
    window.history.replaceState(null, '', query.length > 0 ? `${ROUTES.ADMIN_USERS}?${query}` : ROUTES.ADMIN_USERS);
  };

  const applyFilters = (patch: Partial<AdminUserFilters>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    setPage(1);
    syncUrl(next);
  };

  const clearFilters = () => {
    setFilters(EMPTY_USER_FILTERS);
    setPage(1);
    syncUrl(EMPTY_USER_FILTERS);
  };

  const stats = useMemo(() => buildUserStats(users), [users]);
  const attentionItems = useMemo(() => buildAttentionItems(users), [users]);
  const segmentCounts = useMemo(
    () => SEGMENT_VALUES.map((entry) => ({ segment: entry, count: countSegment(users, entry) })),
    [users],
  );
  const matchedUsers = useMemo(() => filterUsers(users, filters), [users, filters]);

  const totalPages = pageCount(matchedUsers.length, USER_PAGE_SIZE);
  const safePage = Math.min(page, totalPages);
  const visibleUsers = paginate(matchedUsers, safePage, USER_PAGE_SIZE);

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

  const handleRestrict = (kind: AdminUserRestrictionKind, user: AdminUserListItem) => requestRestrict(kind, [user]);
  const handleConfirm = (kind: AdminUserConfirmKind, user: AdminUserListItem) => requestConfirm(kind, [user]);

  return (
    <div className="space-y-4 pb-20 lg:pb-0">
      <AdminPageHeader
        description="Every account on the platform. One account can hold several roles at once."
        count={users.length}
        countLabel="accounts"
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

      <AdminUserStatsRow
        stats={stats}
        activeSegment={filters.segment}
        onSelectSegment={(segment) => applyFilters({ segment, status: '' })}
      />

      <AdminUserAttentionPanel
        items={attentionItems}
        onSelectSegment={(segment) => applyFilters({ segment, status: '' })}
      />

      <AdminUserSegmentTabs
        active={filters.segment}
        counts={segmentCounts}
        onChange={(segment) => applyFilters({ segment })}
      />

      <AdminUsersFilterBar
        search={filters.search}
        role={filters.role}
        status={filters.status}
        sort={filters.sort}
        onSearchChange={(search) => applyFilters({ search })}
        onRoleChange={(role) => applyFilters({ role })}
        onStatusChange={(status) => applyFilters({ status })}
        onSortChange={(sort) => applyFilters({ sort })}
      />

      {matchedUsers.length === 0 ? (
        <div className="dark:border-forest-800 dark:bg-forest-900 flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#e2e8f0] bg-white px-6 py-16 text-center shadow-xs">
          <UsersRound className="h-10 w-10 text-[#cbd5e1]" />
          <p className="text-navy dark:text-forest-50 text-[14px] font-bold">No account matches these filters</p>
          <p className="dark:text-forest-300 max-w-sm text-[12.5px] text-[#64748b]">
            Try a different keyword, or widen the segment, role and status filters.
          </p>
          {hasActiveFilters(filters) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-primary mt-1 cursor-pointer text-[12.5px] font-bold hover:underline"
            >
              Clear all filters
            </button>
          )}
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
            onRestrict={handleRestrict}
            onConfirm={handleConfirm}
          />

          <AdminUsersMobileList
            users={visibleUsers}
            allUsers={users}
            currentAdminId={data.currentAdminId}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onRestrict={handleRestrict}
            onConfirm={handleConfirm}
          />

          <Pagination
            page={safePage}
            pageCount={totalPages}
            totalItems={matchedUsers.length}
            pageSize={USER_PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      <AdminUserBulkBar
        selectedCount={selectedUsers.length}
        onClear={() => setSelectedIds([])}
        onLock={() => requestRestrict('lock', selectedUsers)}
        onBan={() => requestRestrict('ban', selectedUsers)}
        onRevokeSessions={() => requestConfirm('revokeSessions', selectedUsers)}
      />

      {actionModals}
    </div>
  );
}
