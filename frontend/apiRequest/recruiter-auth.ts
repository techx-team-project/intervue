import { request } from '@/apiRequest/http';
import { toRecruiterSession } from '@/lib/auth-portal';
import type { ForgotPasswordPayload, LoginPayload, RegisterPayload, ResetPasswordPayload } from '@/schemas/auth.schema';
import type { AuthSession, RecruiterAuthPayload } from '@/types/auth';

export const recruiterAuthApi = {
  register: (payload: RegisterPayload): Promise<AuthSession> =>
    request<RecruiterAuthPayload>('/recruiter/auth/register', { method: 'POST', body: payload, auth: false }).then(
      toRecruiterSession,
    ),
  login: (payload: LoginPayload): Promise<AuthSession> =>
    request<RecruiterAuthPayload>('/recruiter/auth/login', { method: 'POST', body: payload, auth: false }).then(
      toRecruiterSession,
    ),
  logout: () => request('/recruiter/auth/logout', { method: 'POST' }),
  verifyEmail: (token: string) =>
    request('/recruiter/auth/verify-email', { method: 'POST', body: { token }, auth: false }),
  confirmEmailChange: (token: string) =>
    request('/recruiter/auth/confirm-email-change', { method: 'POST', body: { token }, auth: false }),
  resendVerification: () => request('/recruiter/auth/resend-verification', { method: 'POST' }),
  forgotPassword: (payload: ForgotPasswordPayload) =>
    request('/recruiter/auth/forgot-password', { method: 'POST', body: payload, auth: false }),
  resetPassword: (payload: ResetPasswordPayload) =>
    request('/recruiter/auth/reset-password', { method: 'POST', body: payload, auth: false }),
};
