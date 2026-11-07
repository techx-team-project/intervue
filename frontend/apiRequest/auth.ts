import { request } from '@/apiRequest/http';
import type { ForgotPasswordPayload, LoginPayload, RegisterPayload, ResetPasswordPayload } from '@/schemas/auth.schema';
import type {
  AuthResponsePayload,
  OAuthAuthorizePayload,
  OAuthAuthorizeResult,
  OAuthCallbackPayload,
  AuthSession,
  TwoFactorChallengePayload,
} from '@/types/auth';

export const authApi = {
  register: (payload: RegisterPayload) =>
    request<AuthSession>('/auth/register', { method: 'POST', body: payload, auth: false }),
  login: (payload: LoginPayload) =>
    request<AuthResponsePayload>('/auth/login', { method: 'POST', body: payload, auth: false }),
  oauthAuthorize: (provider: string, payload: OAuthAuthorizePayload) =>
    request<OAuthAuthorizeResult>(`/auth/oauth/${provider}/authorize`, { method: 'POST', body: payload, auth: false }),
  oauthCallback: (provider: string, payload: OAuthCallbackPayload) =>
    request<AuthResponsePayload>(`/auth/oauth/${provider}`, { method: 'POST', body: payload, auth: false }),
  verifyTwoFactor: (payload: TwoFactorChallengePayload) =>
    request<AuthSession>('/auth/verify-2fa', { method: 'POST', body: payload, auth: false }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  verifyEmail: (token: string) => request('/auth/verify-email', { method: 'POST', body: { token }, auth: false }),
  confirmEmailChange: (token: string) =>
    request('/auth/confirm-email-change', { method: 'POST', body: { token }, auth: false }),
  resendVerification: () => request('/auth/resend-verification', { method: 'POST' }),
  forgotPassword: (payload: ForgotPasswordPayload) =>
    request('/auth/forgot-password', { method: 'POST', body: payload, auth: false }),
  resetPassword: (payload: ResetPasswordPayload) =>
    request('/auth/reset-password', { method: 'POST', body: payload, auth: false }),
};
