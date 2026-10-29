import type { AdminPermission } from '@/types/admin';
import type { RoleType } from '@/types/auth';

export type AdminUserStatus = 'ACTIVE' | 'LOCKED' | 'DELETED';

export type AdminUserSegment = 'all' | 'candidates' | 'recruiters' | 'admins' | 'locked' | 'unverified';

export type AdminUserSort = 'newest' | 'oldest' | 'name' | 'lastLocked';

// Mirrors user_roles: a grant carries who issued it and when it lapses, both of
// which the schema already stores and nothing writes yet.
export interface AdminUserRoleGrant {
  role: RoleType;
  grantedAt: string;
  grantedByName: string | null;
  expiresAt: string | null;
}

export interface AdminUserLock {
  reason: string;
  detail: string | null;
  at: string;
  byName: string;
}

// What locking actually touches on this account, shown before the admin commits.
export interface AdminUserLockImpact {
  activeSessionCount: number;
  publishedJobPostCount: number;
  applicationsInProgressCount: number;
}

export interface AdminUserListItem {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  status: AdminUserStatus;
  emailVerifiedAt: string | null;
  roles: AdminUserRoleGrant[];
  activeSessionCount: number;
  hasTokenReuseIncident: boolean;
  createdAt: string;
  lock: AdminUserLock | null;
  lockImpact: AdminUserLockImpact;
}

// One refresh_tokens row. replacedByTokenId is the rotation chain, and a revoked
// row that is still being presented is what triggers a family-wide revoke.
export interface AdminUserSession {
  id: string;
  createdAt: string;
  expiresAt: string;
  revoked: boolean;
  replacedByTokenId: string | null;
  deviceLabel: string;
  ipAddress: string;
  isCurrent: boolean;
}

export type AdminUserActivityKind =
  | 'accountCreated'
  | 'emailVerified'
  | 'roleGranted'
  | 'roleRevoked'
  | 'locked'
  | 'unlocked'
  | 'sessionsRevoked'
  | 'twoFactorReset'
  | 'passwordResetSent'
  | 'tokenReuseDetected';

export interface AdminUserActivityEntry {
  id: string;
  kind: AdminUserActivityKind;
  summary: string;
  actorName: string | null;
  reason: string | null;
  at: string;
}

export type AdminUserLinkedRecordKey =
  'identityVerification' | 'companyVerification' | 'jobPosts' | 'applications' | 'savedCandidates';

export interface AdminUserLinkedRecord {
  key: AdminUserLinkedRecordKey;
  label: string;
  value: string;
  href: string | null;
}

export interface AdminUserDetail extends AdminUserListItem {
  address: string | null;
  termsAcceptedAt: string | null;
  updatedAt: string;
  twoFactorEnabled: boolean;
  sessions: AdminUserSession[];
  activity: AdminUserActivityEntry[];
  linkedRecords: AdminUserLinkedRecord[];
}

export interface AdminUserSegmentCount {
  segment: AdminUserSegment;
  count: number;
}

export interface AdminUserListData {
  users: AdminUserListItem[];
  segmentCounts: AdminUserSegmentCount[];
  currentAdminId: number;
}

export interface AdminAccountListItem {
  id: number;
  name: string;
  email: string;
  image: string | null;
  status: AdminUserStatus;
  twoFactorEnabled: boolean;
  permissions: AdminPermission[];
  grantedByName: string | null;
  grantedAt: string;
  expiresAt: string | null;
  isCurrentAdmin: boolean;
}

export interface AdminAccountListData {
  accounts: AdminAccountListItem[];
  currentAdminId: number;
}
