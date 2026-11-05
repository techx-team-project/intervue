import { request } from '@/apiRequest/http';
import type {
  AuthResponsePayload,
  RecruiterAuthPayload,
  TrustedDevice,
  TwoFactorChallengePayload,
  TwoFactorSetup,
  TwoFactorStatus,
} from '@/types/auth';

export const userTwoFactorApi = {
  getStatus: () =>
    request<TwoFactorStatus>('/user/two-factor', {
      method: 'GET',
      auth: true,
    }),

  setup: () =>
    request<TwoFactorSetup>('/user/two-factor/setup', {
      method: 'POST',
      auth: true,
    }),

  confirm: (code: string) =>
    request<TwoFactorStatus>('/user/two-factor/confirm', {
      method: 'POST',
      auth: true,
      body: { code },
    }),

  disable: (password?: string) =>
    request<void>(`/user/two-factor/disable${password ? `?password=${encodeURIComponent(password)}` : ''}`, {
      method: 'POST',
      auth: true,
    }),

  verifyChallenge: (payload: TwoFactorChallengePayload) =>
    request<AuthResponsePayload>('/auth/verify-2fa', {
      method: 'POST',
      body: payload,
      auth: false,
    }),
};

export const recruiterTwoFactorApi = {
  getStatus: () =>
    request<TwoFactorStatus>('/recruiter/two-factor', {
      method: 'GET',
      auth: true,
    }),

  setup: () =>
    request<TwoFactorSetup>('/recruiter/two-factor/setup', {
      method: 'POST',
      auth: true,
    }),

  confirm: (code: string) =>
    request<TwoFactorStatus>('/recruiter/two-factor/confirm', {
      method: 'POST',
      auth: true,
      body: { code },
    }),

  disable: (password?: string) =>
    request<void>(`/recruiter/two-factor/disable${password ? `?password=${encodeURIComponent(password)}` : ''}`, {
      method: 'POST',
      auth: true,
    }),

  getTrustedDevices: () =>
    request<TrustedDevice[]>('/recruiter/two-factor/devices', {
      method: 'GET',
      auth: true,
    }),

  revokeTrustedDevice: (id: number) =>
    request<void>(`/recruiter/two-factor/devices/${id}`, {
      method: 'DELETE',
      auth: true,
    }),

  revokeAllTrustedDevices: () =>
    request<void>('/recruiter/two-factor/devices', {
      method: 'DELETE',
      auth: true,
    }),

  regenerateRecoveryCodes: (password: string) =>
    request<string[]>('/recruiter/two-factor/recovery-codes/regenerate', {
      method: 'POST',
      body: { password },
      auth: true,
    }),

  initiateReconfigure: (password: string) =>
    request<TwoFactorSetup>('/recruiter/two-factor/reconfigure/initiate', {
      method: 'POST',
      body: { password },
      auth: true,
    }),

  confirmReconfigure: (code: string) =>
    request<TwoFactorStatus>('/recruiter/two-factor/reconfigure/confirm', {
      method: 'POST',
      body: { code },
      auth: true,
    }),

  verifyChallenge: (payload: TwoFactorChallengePayload) =>
    request<RecruiterAuthPayload>('/recruiter/auth/verify-2fa', {
      method: 'POST',
      body: payload,
      auth: false,
    }),
};
