import { ROLES } from '@/constants/auth';
import type {
  AdminUserListItem,
  AdminUserRoleGrant,
  AdminUserSegment,
  AdminUserSort,
  AdminUserStatus,
} from '@/types/admin-user';
import type { RoleType } from '@/types/auth';

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

function matchesSearch(user: AdminUserListItem, needle: string): boolean {
  if (needle.length === 0) return true;
  const haystack = [user.name, user.email, user.phone ?? '', String(user.id)].join(' ').toLowerCase();
  return haystack.includes(needle);
}

function compareUsers(left: AdminUserListItem, right: AdminUserListItem, sort: AdminUserSort): number {
  switch (sort) {
    case 'oldest':
      return Date.parse(left.createdAt) - Date.parse(right.createdAt);
    case 'name':
      return left.name.localeCompare(right.name, 'vi');
    case 'lastLocked':
      return Date.parse(right.lock?.at ?? '1970-01-01') - Date.parse(left.lock?.at ?? '1970-01-01');
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

// A role check is not enough to decide whether an admin may act: locking
// yourself, or the last way back into the panel, has to stay impossible.
export function lockBlockedReason(
  user: AdminUserListItem,
  currentAdminId: number,
  users: AdminUserListItem[],
): string | null {
  if (user.id === currentAdminId) return 'You cannot lock your own account';
  if (user.status === 'DELETED') return 'This account is already deleted';
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
