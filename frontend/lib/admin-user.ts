import { ADMIN_PERMISSION_ORDER, RESTRICTION_META } from '@/constants/admin-user';
import { ROLES } from '@/constants/auth';
import type { AdminPermission } from '@/types/admin';
import type {
  AdminAccountListItem,
  AdminUserAttentionItem,
  AdminUserListItem,
  AdminUserRestrictionKind,
  AdminUserRoleGrant,
  AdminUserSegment,
  AdminUserSort,
  AdminUserStatus,
} from '@/types/admin-user';
import type { RoleType } from '@/types/auth';

const DAY_MS = 86_400_000;
const STALE_UNVERIFIED_DAYS = 7;
const EXPIRING_GRANT_DAYS = 14;

export function isGrantActive(grant: AdminUserRoleGrant): boolean {
  return grant.expiresAt === null || new Date(grant.expiresAt).getTime() > Date.now();
}

export function activeRoles(user: AdminUserListItem): RoleType[] {
  return user.roles.filter(isGrantActive).map((grant) => grant.role);
}

export function hasActiveRole(user: AdminUserListItem, role: RoleType): boolean {
  return activeRoles(user).includes(role);
}

export function isEmailVerified(user: AdminUserListItem): boolean {
  return user.emailVerifiedAt !== null;
}

export function isRestricted(user: AdminUserListItem): boolean {
  return user.status === 'LOCKED' || user.status === 'BANNED';
}

export function daysSince(iso: string | null): number | null {
  if (iso === null) return null;
  return Math.floor((Date.now() - Date.parse(iso)) / DAY_MS);
}

export function matchesSegment(user: AdminUserListItem, segment: AdminUserSegment): boolean {
  switch (segment) {
    case 'candidates':
      return hasActiveRole(user, ROLES.CANDIDATE);
    case 'recruiters':
      return hasActiveRole(user, ROLES.RECRUITER);
    case 'admins':
      return hasActiveRole(user, ROLES.ADMIN);
    case 'locked':
      return user.status === 'LOCKED';
    case 'banned':
      return user.status === 'BANNED';
    case 'unverified':
      return !isEmailVerified(user);
    case 'all':
    default:
      return true;
  }
}

export function countSegment(users: AdminUserListItem[], segment: AdminUserSegment): number {
  return users.filter((user) => matchesSegment(user, segment)).length;
}

export interface AdminUserFilters {
  segment: AdminUserSegment;
  search: string;
  role: RoleType | '';
  status: AdminUserStatus | '';
  sort: AdminUserSort;
}

export const EMPTY_USER_FILTERS: AdminUserFilters = {
  segment: 'all',
  search: '',
  role: '',
  status: '',
  sort: 'newest',
};

export function hasActiveFilters(filters: AdminUserFilters): boolean {
  return (
    filters.segment !== 'all' ||
    filters.search.trim().length > 0 ||
    filters.role !== '' ||
    filters.status !== '' ||
    filters.sort !== 'newest'
  );
}

function matchesSearch(user: AdminUserListItem, needle: string): boolean {
  if (needle.length === 0) return true;
  const haystack = [user.name, user.email, user.phone ?? '', String(user.id)].join(' ').toLowerCase();
  return haystack.includes(needle);
}

function timestamp(iso: string | null): number {
  return iso === null ? 0 : Date.parse(iso);
}

function compareUsers(left: AdminUserListItem, right: AdminUserListItem, sort: AdminUserSort): number {
  switch (sort) {
    case 'oldest':
      return Date.parse(left.createdAt) - Date.parse(right.createdAt);
    case 'name':
      return left.name.localeCompare(right.name, 'vi');
    case 'lastSignIn':
      return timestamp(right.lastSignInAt) - timestamp(left.lastSignInAt);
    case 'lastRestricted':
      return timestamp(right.restriction?.at ?? null) - timestamp(left.restriction?.at ?? null);
    case 'newest':
    default:
      return Date.parse(right.createdAt) - Date.parse(left.createdAt);
  }
}

export function filterUsers(users: AdminUserListItem[], filters: AdminUserFilters): AdminUserListItem[] {
  const needle = filters.search.trim().toLowerCase();

  return users
    .filter(
      (user) =>
        matchesSegment(user, filters.segment) &&
        matchesSearch(user, needle) &&
        (filters.role === '' || hasActiveRole(user, filters.role)) &&
        (filters.status === '' || user.status === filters.status),
    )
    .sort((left, right) => compareUsers(left, right, filters.sort));
}

export function activeAdminCount(users: AdminUserListItem[]): number {
  return users.filter((user) => user.status === 'ACTIVE' && hasActiveRole(user, ROLES.ADMIN)).length;
}

// A role check is not enough to decide whether an admin may act: restricting
// yourself, or the last way back into the panel, has to stay impossible.
export function restrictBlockedReason(
  user: AdminUserListItem,
  kind: AdminUserRestrictionKind,
  currentAdminId: number,
  users: AdminUserListItem[],
): string | null {
  if (user.id === currentAdminId) return `You cannot ${RESTRICTION_META[kind].verb.toLowerCase()} your own account`;
  if (user.status === 'DELETED') return 'This account is already deleted';
  if (user.status === RESTRICTION_META[kind].status)
    return `This account is already ${kind === 'lock' ? 'locked' : 'banned'}`;
  if (user.status === 'ACTIVE' && hasActiveRole(user, ROLES.ADMIN) && activeAdminCount(users) <= 1) {
    return 'This is the last active admin account';
  }
  return null;
}

export function roleRemovalBlockedReason(
  user: AdminUserListItem,
  role: RoleType,
  currentAdminId: number,
  users: AdminUserListItem[],
): string | null {
  if (!hasActiveRole(user, role)) return 'This role is not active on the account';
  if (role === ROLES.ADMIN && user.id === currentAdminId) return 'You cannot remove your own admin role';
  if (role === ROLES.ADMIN && activeAdminCount(users) <= 1) return 'This is the last active admin account';
  return null;
}

export interface AdminUserStats {
  total: number;
  active: number;
  locked: number;
  banned: number;
  unverified: number;
  newLast7Days: number;
  activeLast7Days: number;
  candidates: number;
  recruiters: number;
  admins: number;
}

export function buildUserStats(users: AdminUserListItem[]): AdminUserStats {
  const within7Days = (iso: string | null) => {
    const days = daysSince(iso);
    return days !== null && days <= 7;
  };

  return {
    total: users.length,
    active: users.filter((user) => user.status === 'ACTIVE').length,
    locked: users.filter((user) => user.status === 'LOCKED').length,
    banned: users.filter((user) => user.status === 'BANNED').length,
    unverified: users.filter((user) => !isEmailVerified(user)).length,
    newLast7Days: users.filter((user) => within7Days(user.createdAt)).length,
    activeLast7Days: users.filter((user) => within7Days(user.lastSignInAt)).length,
    candidates: countSegment(users, 'candidates'),
    recruiters: countSegment(users, 'recruiters'),
    admins: countSegment(users, 'admins'),
  };
}

// Every row is counted from the data on screen — nothing here is a target, an
// SLA or a trend, because none of those exist in the product spec.
export function buildAttentionItems(users: AdminUserListItem[]): AdminUserAttentionItem[] {
  const staleUnverified = users.filter((user) => {
    const days = daysSince(user.createdAt);
    return !isEmailVerified(user) && days !== null && days > STALE_UNVERIFIED_DAYS;
  }).length;

  const tokenReuse = users.filter((user) => user.hasTokenReuseIncident).length;

  const lockedOverAWeek = users.filter((user) => {
    const days = daysSince(user.restriction?.at ?? null);
    return user.status === 'LOCKED' && days !== null && days > STALE_UNVERIFIED_DAYS;
  }).length;

  const expiringGrants = users.filter((user) =>
    user.roles.some((grant) => {
      if (grant.expiresAt === null) return false;
      const remaining = Math.ceil((Date.parse(grant.expiresAt) - Date.now()) / DAY_MS);
      return remaining > 0 && remaining <= EXPIRING_GRANT_DAYS;
    }),
  ).length;

  return [
    { key: 'tokenReuse', label: 'Accounts with refresh-token reuse detected', count: tokenReuse, tone: 'danger' },
    {
      key: 'lockedStale',
      label: `Locked more than ${STALE_UNVERIFIED_DAYS} days with no decision`,
      count: lockedOverAWeek,
      tone: 'warning',
      segment: 'locked',
    },
    {
      key: 'staleUnverified',
      label: `Email still unverified after ${STALE_UNVERIFIED_DAYS} days`,
      count: staleUnverified,
      tone: 'warning',
      segment: 'unverified',
    },
    {
      key: 'expiringGrants',
      label: `Role grants expiring within ${EXPIRING_GRANT_DAYS} days`,
      count: expiringGrants,
      tone: 'info',
    },
  ].filter((item) => item.count > 0) as AdminUserAttentionItem[];
}

const EXPIRING_ADMIN_GRANT_DAYS = 30;

export interface AdminAccountStats {
  total: number;
  active: number;
  withTwoFactor: number;
  expiringGrants: number;
  decisionsLast30Days: number;
  uncoveredPermissions: AdminPermission[];
}

export function buildAdminAccountStats(accounts: AdminAccountListItem[]): AdminAccountStats {
  const active = accounts.filter((account) => account.status === 'ACTIVE');

  return {
    total: accounts.length,
    active: active.length,
    withTwoFactor: active.filter((account) => account.twoFactorEnabled).length,
    expiringGrants: accounts.filter((account) => {
      if (account.expiresAt === null) return false;
      const remaining = Math.ceil((Date.parse(account.expiresAt) - Date.now()) / DAY_MS);
      return remaining > 0 && remaining <= EXPIRING_ADMIN_GRANT_DAYS;
    }).length,
    decisionsLast30Days: accounts.reduce((total, account) => total + account.decisionsLast30Days, 0),
    uncoveredPermissions: ADMIN_PERMISSION_ORDER.filter(
      (permission) => !active.some((account) => account.permissions.includes(permission)),
    ),
  };
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  return items.slice((page - 1) * pageSize, page * pageSize);
}

export function pageCount(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}
