'use client';

import { adminUserApi, type AdminUserQueryParams, type AdminUserSummary } from '@/apiRequest/admin-user';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import { USER_PAGE_SIZE, USER_ROLE_META, USER_SORT_OPTIONS, USER_STATUS_META } from '@/constants/admin-user';
import { ROUTES } from '@/constants/routes';
import { useAdminUserActions, type AdminUserConfirmKind } from '@/hooks/useAdminUserActions';
import {
  buildAttentionItemsFromSummary,
  EMPTY_USER_FILTERS,
  hasActiveFilters,
  type AdminUserFilters,
  type AdminUserStats,
} from '@/lib/admin-user';
import type { Page } from '@/types/api';
import type {
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AdminUserAttentionPanel from './AdminUserAttentionPanel';
import AdminUserBulkBar from './AdminUserBulkBar';
import AdminUserSegmentTabs from './AdminUserSegmentTabs';
import AdminUserStatsRow from './AdminUserStatsRow';
import AdminUsersFilterBar from './AdminUsersFilterBar';
import AdminUsersMobileList from './AdminUsersMobileList';
import AdminUsersTable from './AdminUsersTable';

export interface AdminUsersListViewProps {
  initialSummary: AdminUserSummary;
  initialUsersPage: Page<AdminUserListItem>;
  currentAdminId: number;
}

const SEGMENT_VALUES: AdminUserSegment[] = ['all', 'candidates', 'admins', 'banned', 'unverified', 'pendingDeletion'];
const SORT_VALUES = USER_SORT_OPTIONS.map((option) => option.value);
const ROLE_VALUES = Object.keys(USER_ROLE_META) as RoleType[];
const STATUS_VALUES = Object.keys(USER_STATUS_META) as AdminUserStatus[];

function readParam<T extends string>(raw: string | null, allowed: readonly T[], fallback: T): T {
  return raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback;
}

export function toServerParams(filters: AdminUserFilters, page: number): AdminUserQueryParams {
  let role: string | undefined = filters.role || undefined;
  let status: string | undefined = filters.status || undefined;
  let emailVerified: boolean | undefined = undefined;

  switch (filters.segment) {
    case 'candidates':
      role = 'CANDIDATE';
      break;
    case 'admins':
      role = 'ADMIN';
      break;
    case 'banned':
      status = 'BANNED';
      break;
    case 'unverified':
      emailVerified = false;
      break;
    case 'pendingDeletion':
      status = 'PENDING_DELETION';
      break;
  }

  let sortStr = 'createdAt,desc';
  switch (filters.sort) {
    case 'newest':
      sortStr = 'createdAt,desc';
      break;
    case 'oldest':
      sortStr = 'createdAt,asc';
      break;
    case 'name':
      sortStr = 'name,asc';
      break;
    case 'lastSignIn':
      sortStr = 'lastLoginAt,desc';
      break;
    case 'lastRestricted':
      sortStr = 'id,desc';
      break;
  }

  return {
    q: filters.search.trim() || undefined,
    role,
    status,
    emailVerified,
    page: Math.max(0, page - 1),
    size: USER_PAGE_SIZE,
    sort: sortStr,
  };
}

export default function AdminUsersListView({
  initialSummary,
  initialUsersPage,
  currentAdminId,
}: AdminUsersListViewProps) {
  const searchParams = useSearchParams();

  const [summary, setSummary] = useState<AdminUserSummary>(initialSummary);
  const [usersPage, setUsersPage] = useState<Page<AdminUserListItem>>(initialUsersPage);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<AdminUserFilters>(() => ({
    segment: readParam(searchParams.get('segment'), SEGMENT_VALUES, 'all'),
    search: searchParams.get('q') ?? '',
    role: readParam(searchParams.get('role'), ROLE_VALUES, '' as RoleType | ''),
    status: readParam(searchParams.get('status'), STATUS_VALUES, '' as AdminUserStatus | ''),
    sort: readParam(searchParams.get('sort'), SORT_VALUES, 'newest' as AdminUserSort),
  }));
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const hasInitialParams =
        filters.segment !== 'all' ||
        filters.search !== '' ||
        filters.role !== '' ||
        filters.status !== '' ||
        filters.sort !== 'newest';
      if (!hasInitialParams) {
        return;
      }
    }

    let cancelled = false;
    const serverParams = toServerParams(filters, page);

    adminUserApi
      .getUsers(serverParams)
      .then((result) => {
        if (!cancelled) setUsersPage(result);
      })
      .catch(() => {
        // Retain existing view on failure
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  const handleResolved = useCallback(async () => {
    try {
      const [nextSummary, nextPage] = await Promise.all([
        adminUserApi.getUserSummary(),
        adminUserApi.getUsers(toServerParams(filters, page)),
      ]);
      setSummary(nextSummary);
      setUsersPage(nextPage);
    } catch {
      // Retain view on background refresh error
    }
  }, [filters, page]);

  const { users, requestRestrict, requestConfirm, actionModals } = useAdminUserActions(
    usersPage.items,
    currentAdminId,
    handleResolved,
    summary.activeAdminCount,
  );

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
    setIsLoading(true);
    const next = { ...filters, ...patch };
    setFilters(next);
    setPage(1);
    setSelectedIds([]);
    syncUrl(next);
  };

  const clearFilters = () => {
    setIsLoading(true);
    setFilters(EMPTY_USER_FILTERS);
    setPage(1);
    setSelectedIds([]);
    syncUrl(EMPTY_USER_FILTERS);
  };

  const stats: AdminUserStats = useMemo(
    () => ({
      total: summary.total,
      active: summary.active,
      banned: summary.banned,
      unverified: summary.unverified,
      newLast7Days: summary.newLast7Days,
      activeLast7Days: summary.activeLast7Days,
      candidates: summary.candidates,
      admins: summary.admins,
    }),
    [summary],
  );

  const attentionItems = useMemo(() => buildAttentionItemsFromSummary(summary, users), [summary, users]);

  const segmentCounts = useMemo(
    () => [
      { segment: 'all' as const, count: summary.total },
      { segment: 'candidates' as const, count: summary.candidates },
      { segment: 'admins' as const, count: summary.admins },
      { segment: 'banned' as const, count: summary.banned },
      { segment: 'unverified' as const, count: summary.unverified },
      { segment: 'pendingDeletion' as const, count: 0 },
    ],
    [summary],
  );

  const selectedUsers = users.filter((user) => selectedIds.includes(user.id));

  const toggleSelect = (id: number) =>
    setSelectedIds((previous) =>
      previous.includes(id) ? previous.filter((entry) => entry !== id) : [...previous, id],
    );

  const toggleSelectAll = () => {
    const selectable = users.filter((user) => user.id !== currentAdminId).map((user) => user.id);
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
        count={summary.total}
        countLabel="accounts"
        actions={
          <Link
            href={ROUTES.ADMIN_ADMINS}
            className="dark:border-forest-800 dark:text-forest-100 dark:hover:bg-forest-850 border-outline-variant text-body-sm text-on-surface hover:bg-surface-container-low inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 font-bold transition-colors"
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

      <div className={isLoading ? 'pointer-events-none opacity-60 transition-opacity' : 'transition-opacity'}>
        {isLoading && (
          <div className="flex items-center justify-center py-2">
            <Spinner className="h-5 w-5" />
          </div>
        )}

        {usersPage.totalItems === 0 ? (
          <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col items-center justify-center gap-3 rounded-2xl border bg-white px-6 py-16 text-center shadow-xs">
            <UsersRound className="text-outline h-10 w-10" />
            <p className="text-navy dark:text-forest-50 text-body-md font-bold">No account matches these filters</p>
            <p className="dark:text-forest-300 text-body-sm text-on-surface-variant max-w-sm">
              Try a different keyword, or widen the segment, role and status filters.
            </p>
            {hasActiveFilters(filters) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-primary text-body-sm mt-1 cursor-pointer font-bold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <AdminUsersTable
              users={users}
              allUsers={users}
              currentAdminId={currentAdminId}
              selectedIds={selectedIds}
              activeAdminCount={summary.activeAdminCount}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              onRestrict={handleRestrict}
              onConfirm={handleConfirm}
            />

            <AdminUsersMobileList
              users={users}
              allUsers={users}
              currentAdminId={currentAdminId}
              selectedIds={selectedIds}
              activeAdminCount={summary.activeAdminCount}
              onToggleSelect={toggleSelect}
              onRestrict={handleRestrict}
              onConfirm={handleConfirm}
            />

            <Pagination
              page={page}
              pageCount={usersPage.totalPages}
              totalItems={usersPage.totalItems}
              pageSize={USER_PAGE_SIZE}
              onPageChange={(nextPage) => {
                setIsLoading(true);
                setPage(nextPage);
                setSelectedIds([]);
              }}
            />
          </>
        )}
      </div>

      <AdminUserBulkBar
        selectedCount={selectedUsers.length}
        onClear={() => setSelectedIds([])}
        onBan={() => requestRestrict('ban', selectedUsers)}
        onRevokeSessions={() => requestConfirm('revokeSessions', selectedUsers)}
      />

      {actionModals}
    </div>
  );
}
