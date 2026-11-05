import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type {
  AdminUserActivityEntry,
  AdminUserDetail,
  AdminUserListItem,
  AdminUserProfileSummary,
  AdminUserSession,
  AdminUserSignIn,
} from '@/types/admin-user';

export interface AdminUserQueryParams {
  q?: string;
  role?: string;
  status?: string;
  emailVerified?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export interface AdminUserSummary {
  total: number;
  active: number;
  banned: number;
  unverified: number;
  newLast7Days: number;
  activeLast7Days: number;
  candidates: number;
  admins: number;
  activeAdminCount: number;
  bannedOverAWeek: number;
  unverifiedOverAWeek: number;
  grantsExpiringIn14Days: number;
}

export interface BanUserPayload {
  reason: string;
  detail?: string;
  notifyUser: boolean;
  expiresAt?: string;
}

export interface UnbanUserPayload {
  reason?: string;
}

export interface GrantRolePayload {
  role: string;
  expiresAt?: string;
  reason?: string;
}

export interface RevokeRolePayload {
  reason?: string;
}

// The API answers with the columns the user module owns. Everything below is
// either served by a dedicated endpoint or waits on a module that does not exist
// yet, so it is filled in here rather than left undefined for the views.
type ApiUserListItem = Omit<AdminUserListItem, 'restrictionImpact'>;
type ApiUserDetail = Omit<
  AdminUserDetail,
  'restrictionImpact' | 'twoFactorEnabled' | 'profile' | 'sessions' | 'signIns' | 'activity' | 'linkedRecords'
> &
  Partial<Pick<AdminUserDetail, 'twoFactorEnabled'>>;

const EMPTY_PROFILE: AdminUserProfileSummary = {
  headline: null,
  jobSearchStatus: null,
  completeness: 0,
  cvCount: 0,
  identityVerification: 'not_submitted',
  companyName: null,
  companyVerificationLevel: null,
};

function toListItem(item: ApiUserListItem): AdminUserListItem {
  return {
    ...item,
    restrictionImpact: {
      activeSessionCount: item.activeSessionCount,
      publishedJobPostCount: 0,
      applicationsInProgressCount: 0,
      savedCandidateCount: 0,
    },
  };
}

function toDetail(detail: ApiUserDetail): AdminUserDetail {
  return {
    ...toListItem(detail),
    address: detail.address,
    termsAcceptedAt: detail.termsAcceptedAt,
    updatedAt: detail.updatedAt,
    twoFactorEnabled: detail.twoFactorEnabled ?? false,
    profile: EMPTY_PROFILE,
    sessions: [],
    signIns: [],
    activity: [],
    linkedRecords: [],
  };
}

export const adminUserApi = {
  getUsers: (params?: AdminUserQueryParams) => {
    const query = new URLSearchParams();
    if (params?.q) query.set('q', params.q);
    if (params?.role) query.set('role', params.role);
    if (params?.status) query.set('status', params.status);
    if (params?.emailVerified !== undefined) query.set('emailVerified', String(params.emailVerified));
    if (params?.page !== undefined) query.set('page', String(params.page));
    if (params?.size !== undefined) query.set('size', String(params.size));
    if (params?.sort) query.set('sort', params.sort);
    const qs = query.toString();
    return request<Page<ApiUserListItem>>(`/admin/users${qs ? `?${qs}` : ''}`).then((page) => ({
      ...page,
      items: page.items.map(toListItem),
    }));
  },

  getUserSummary: () => request<AdminUserSummary>('/admin/users/summary'),

  getUserDetail: (id: number) => request<ApiUserDetail>(`/admin/users/${id}`).then(toDetail),

  banUser: (id: number, body: BanUserPayload) =>
    request<ApiUserDetail>(`/admin/users/${id}/ban`, { method: 'POST', body }).then(toDetail),

  unbanUser: (id: number, body?: UnbanUserPayload) =>
    request<ApiUserDetail>(`/admin/users/${id}/unban`, { method: 'POST', body }).then(toDetail),

  getUserActivities: (id: number, page = 0, size = 20) =>
    request<Page<AdminUserActivityEntry>>(`/admin/users/${id}/activity?page=${page}&size=${size}`),

  getUserSessions: (id: number) => request<AdminUserSession[]>(`/admin/users/${id}/sessions`),

  revokeSession: (id: number, sessionId: number | string) =>
    request<void>(`/admin/users/${id}/sessions/${sessionId}`, { method: 'DELETE' }),

  revokeAllSessions: (id: number) => request<void>(`/admin/users/${id}/sessions/revoke-all`, { method: 'POST' }),

  getUserSignIns: (id: number, page = 0, size = 20) =>
    request<Page<AdminUserSignIn>>(`/admin/users/${id}/sign-ins?page=${page}&size=${size}`),

  grantRole: (id: number, body: GrantRolePayload) =>
    request<ApiUserDetail>(`/admin/users/${id}/roles`, { method: 'POST', body }).then(toDetail),

  revokeRole: (id: number, role: string, body?: RevokeRolePayload) =>
    request<ApiUserDetail>(`/admin/users/${id}/roles/${role}`, { method: 'DELETE', body }).then(toDetail),

  resetTwoFactor: (id: number) =>
    request<ApiUserDetail>(`/admin/users/${id}/reset-two-factor`, { method: 'POST' }).then(toDetail),

  sendPasswordReset: (id: number) =>
    request<ApiUserDetail>(`/admin/users/${id}/send-password-reset`, { method: 'POST' }).then(toDetail),

  cancelDeletion: (id: number) =>
    request<ApiUserDetail>(`/admin/users/${id}/cancel-deletion`, { method: 'POST' }).then(toDetail),

  restoreUser: (id: number) => request<ApiUserDetail>(`/admin/users/${id}/restore`, { method: 'POST' }).then(toDetail),
};
