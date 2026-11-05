import { request } from '@/apiRequest/http';
import type { AdminAuthPayload, AdminProfile, TwoFactorChallengePayload } from '@/types/auth';

export type AdminLoginPayload = {
  email: string;
  password: string;
};

export const adminAuthApi = {
  login: (payload: AdminLoginPayload) =>
    request<AdminAuthPayload>('/admin/auth/login', {
      method: 'POST',
      body: payload,
      auth: false,
    }),

  verifyTwoFactor: (payload: TwoFactorChallengePayload) =>
    request<AdminAuthPayload>('/admin/auth/verify-2fa', {
      method: 'POST',
      body: payload,
      auth: false,
    }),

  refresh: () =>
    request<AdminAuthPayload>('/admin/auth/refresh', {
      method: 'POST',
      auth: false,
    }),

  logout: () =>
    request<void>('/admin/auth/logout', {
      method: 'POST',
      auth: true,
    }),

  getMe: () =>
    request<AdminProfile>('/admin/auth/me', {
      method: 'GET',
      auth: true,
    }),
};
