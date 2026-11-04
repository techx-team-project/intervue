import { request } from '@/apiRequest/http';
import type { AuthPortal } from '@/lib/auth-portal';
import type { ChangeEmailFormData, ChangePasswordFormData } from '@/schemas/auth.schema';
import type { AccountSession } from '@/types/account-security';
import type { UserProfilePatch } from '@/types/auth';

const BASE_PATHS: Record<AuthPortal, string> = {
  candidate: '/users/me',
  recruiter: '/recruiter/me',
};

export function accountSecurityApiFor(portal: AuthPortal) {
  const base = BASE_PATHS[portal];

  return {
    changePassword: (payload: ChangePasswordFormData) =>
      request(`${base}/change-password`, { method: 'POST', body: payload }),
    sessions: () => request<AccountSession[]>(`${base}/sessions`),
    revokeSession: (sessionId: number) => request(`${base}/sessions/${sessionId}`, { method: 'DELETE' }),
    revokeOtherSessions: () => request(`${base}/sessions/revoke-others`, { method: 'POST' }),
    requestDeletion: () => request(`${base}/delete-request`, { method: 'POST' }),
    sendPhoneOtp: (phone: string) => request(`${base}/phone/send-otp`, { method: 'POST', body: { phone } }),
    verifyPhoneOtp: (code: string) =>
      request<UserProfilePatch>(`${base}/phone/verify`, { method: 'POST', body: { code } }),
    requestEmailChange: (payload: ChangeEmailFormData) =>
      request(`${base}/email/change-request`, { method: 'POST', body: payload }),
  };
}
