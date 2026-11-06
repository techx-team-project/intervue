import { request } from '@/apiRequest/http';
import type {
  AdminAuthPayload,
  AdminProfile,
  TwoFactorChallengePayload,
  TwoFactorSetup,
  TwoFactorStatus,
} from '@/types/auth';

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

  setupTwoFactor: (tempToken: string) =>
    request<TwoFactorSetup>('/admin/auth/2fa/setup', {
      method: 'POST',
      body: { tempToken },
      auth: false,
    }),

  confirmTwoFactor: (payload: TwoFactorChallengePayload) =>
    request<AdminAuthPayload>('/admin/auth/2fa/confirm', {
      method: 'POST',
      body: payload,
      auth: false,
    }),

  verifyPassword: (password: string) =>
    request<boolean>('/admin/auth/verify-password', {
      method: 'POST',
      body: { password },
      auth: true,
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

export const adminTwoFactorApi = {
  getStatus: () =>
    request<TwoFactorStatus>('/admin/two-factor/status', {
      method: 'GET',
      auth: true,
    }),

  initiateReconfigure: (password: string) =>
    request<TwoFactorSetup>('/admin/two-factor/reconfigure/initiate', {
      method: 'POST',
      body: { password },
      auth: true,
    }),

  confirmReconfigure: (code: string) =>
    request<TwoFactorStatus>('/admin/two-factor/reconfigure/confirm', {
      method: 'POST',
      body: { code },
      auth: true,
    }),

  regenerateRecoveryCodes: (password: string) =>
    request<string[]>('/admin/two-factor/recovery-codes/regenerate', {
      method: 'POST',
      body: { password },
      auth: true,
    }),
};
