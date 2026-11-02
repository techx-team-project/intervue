import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type {
  AdminUserActivityEntry,
  AdminUserDetail,
  AdminUserListItem,
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
  recruiters: number;
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
    return request<Page<AdminUserListItem>>(`/admin/users${qs ? `?${qs}` : ''}`);
  },

  getUserSummary: () => request<AdminUserSummary>('/admin/users/summary'),

  getUserDetail: (id: number) => request<AdminUserDetail>(`/admin/users/${id}`),

  banUser: (id: number, body: BanUserPayload) =>
    request<AdminUserDetail>(`/admin/users/${id}/ban`, { method: 'POST', body }),

  unbanUser: (id: number, body?: UnbanUserPayload) =>
    request<AdminUserDetail>(`/admin/users/${id}/unban`, { method: 'POST', body }),

  getUserActivities: (id: number, page = 0, size = 20) =>
    request<Page<AdminUserActivityEntry>>(`/admin/users/${id}/activity?page=${page}&size=${size}`),

  getUserSessions: (id: number) => request<AdminUserSession[]>(`/admin/users/${id}/sessions`),

  revokeSession: (id: number, sessionId: number | string) =>
    request<void>(`/admin/users/${id}/sessions/${sessionId}`, { method: 'DELETE' }),

  revokeAllSessions: (id: number) => request<void>(`/admin/users/${id}/sessions/revoke-all`, { method: 'POST' }),

  getUserSignIns: (id: number, page = 0, size = 20) =>
    request<Page<AdminUserSignIn>>(`/admin/users/${id}/sign-ins?page=${page}&size=${size}`),

  grantRole: (id: number, body: GrantRolePayload) =>
    request<AdminUserDetail>(`/admin/users/${id}/roles`, { method: 'POST', body }),

  revokeRole: (id: number, role: string, body?: RevokeRolePayload) =>
    request<AdminUserDetail>(`/admin/users/${id}/roles/${role}`, { method: 'DELETE', body }),

  resetTwoFactor: (id: number) => request<AdminUserDetail>(`/admin/users/${id}/reset-two-factor`, { method: 'POST' }),

  sendPasswordReset: (id: number) =>
    request<AdminUserDetail>(`/admin/users/${id}/send-password-reset`, { method: 'POST' }),

  cancelDeletion: (id: number) => request<AdminUserDetail>(`/admin/users/${id}/cancel-deletion`, { method: 'POST' }),

  restoreUser: (id: number) => request<AdminUserDetail>(`/admin/users/${id}/restore`, { method: 'POST' }),
};
