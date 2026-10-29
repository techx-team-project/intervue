import type { AdminPermission } from '@/types/admin';
import type { RoleType } from '@/types/auth';

// LOCKED is a reversible security hold; BANNED is policy enforcement that also
// hides the account's public content. Both are lifted by an admin and both stay
// in the activity history.
export type AdminUserStatus = 'ACTIVE' | 'LOCKED' | 'BANNED' | 'DELETED';

export type AdminUserRestrictionKind = 'lock' | 'ban';

export type AdminUserSegment = 'all' | 'candidates' | 'recruiters' | 'admins' | 'locked' | 'banned' | 'unverified';

export type AdminUserSort = 'newest' | 'oldest' | 'name' | 'lastRestricted' | 'lastSignIn';

// Mirrors user_roles: a grant carries who issued it and when it lapses, both of
// which the schema already stores and nothing writes yet.
export interface AdminUserRoleGrant {
  role: RoleType;
  grantedAt: string;
  grantedByName: string | null;
  expiresAt: string | null;
}

export interface AdminUserRestriction {
  kind: AdminUserRestrictionKind;
  reason: string;
  detail: string | null;
  at: string;
  byName: string;
  expiresAt: string | null;
}

// What a restriction actually touches on this account, shown before the admin
// commits to it.
export interface AdminUserRestrictionImpact {
  activeSessionCount: number;
  publishedJobPostCount: number;
  applicationsInProgressCount: number;
  savedCandidateCount: number;
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
  lastSignInAt: string | null;
  restriction: AdminUserRestriction | null;
  restrictionImpact: AdminUserRestrictionImpact;
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
  | 'banned'
  | 'unbanned'
  | 'sessionsRevoked'
  | 'twoFactorReset'
  | 'passwordResetSent'
  | 'tokenReuseDetected';

// Derived from refresh_tokens: every row is one successful sign-in that kept a
// session, so the table doubles as the login history until a dedicated one exists.
export interface AdminUserSignIn {
  id: string;
  at: string;
  deviceLabel: string;
  ipAddress: string;
  location: string;
  outcome: 'success' | 'revoked';
}

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

export interface AdminUserProfileSummary {
  headline: string | null;
  jobSearchStatus: string | null;
  completeness: number;
  cvCount: number;
  identityVerification: 'approved' | 'pending' | 'rejected' | 'not_submitted';
  companyName: string | null;
  companyVerificationLevel: 1 | 2 | 3 | null;
}

export interface AdminUserDetail extends AdminUserListItem {
  address: string | null;
  termsAcceptedAt: string | null;
  updatedAt: string;
  twoFactorEnabled: boolean;
  profile: AdminUserProfileSummary;
  sessions: AdminUserSession[];
  signIns: AdminUserSignIn[];
  activity: AdminUserActivityEntry[];
  linkedRecords: AdminUserLinkedRecord[];
}

export interface AdminUserSegmentCount {
  segment: AdminUserSegment;
  count: number;
}

export interface AdminUserAttentionItem {
  key: string;
  label: string;
  count: number;
  tone: 'danger' | 'warning' | 'info';
  segment?: AdminUserSegment;
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
  lastSignInAt: string | null;
  decisionsLast30Days: number;
}

export interface AdminAccountListData {
  accounts: AdminAccountListItem[];
  currentAdminId: number;
}
