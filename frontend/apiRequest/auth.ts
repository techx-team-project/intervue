import { request } from '@/apiRequest/http';
import type { ForgotPasswordPayload, LoginPayload, RegisterPayload, ResetPasswordPayload } from '@/schemas/auth.schema';
import type { AuthSession } from '@/types/auth';

export const authApi = {
  register: (payload: RegisterPayload) =>
    request<AuthSession>('/auth/register', { method: 'POST', body: payload, auth: false }),
  login: (payload: LoginPayload) => request<AuthSession>('/auth/login', { method: 'POST', body: payload, auth: false }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  verifyEmail: (token: string) => request('/auth/verify-email', { method: 'POST', body: { token }, auth: false }),
  resendVerification: () => request('/auth/resend-verification', { method: 'POST' }),
  forgotPassword: (payload: ForgotPasswordPayload) =>
    request('/auth/forgot-password', { method: 'POST', body: payload, auth: false }),
  resetPassword: (payload: ResetPasswordPayload) =>
    request('/auth/reset-password', { method: 'POST', body: payload, auth: false }),
};
