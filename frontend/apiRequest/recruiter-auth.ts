import { request } from '@/apiRequest/http';
import { toRecruiterSession } from '@/lib/auth-portal';
import type { ForgotPasswordPayload, LoginPayload, RegisterPayload, ResetPasswordPayload } from '@/schemas/auth.schema';
import type { RecruiterProfileFormData } from '@/schemas/recruiter.schema';
import type {
  AuthSession,
  OAuthAuthorizePayload,
  OAuthAuthorizeResult,
  OAuthCallbackPayload,
  RecruiterAuthPayload,
  TwoFactorChallengePayload,
  User,
} from '@/types/auth';

export type RecruiterRegisterPayload = RegisterPayload & {
  gender: RecruiterProfileFormData['gender'];
  companyName: string;
  province: string;
  districtWard?: string;
};

export type RecruiterProfilePayload = Omit<RecruiterProfileFormData, 'city'> & { province: string };

export const recruiterAuthApi = {
  register: (payload: RecruiterRegisterPayload): Promise<AuthSession> =>
    request<RecruiterAuthPayload>('/recruiter/auth/register', { method: 'POST', body: payload, auth: false }).then(
      toRecruiterSession,
    ),
  login: (payload: LoginPayload): Promise<RecruiterAuthPayload> =>
    request<RecruiterAuthPayload>('/recruiter/auth/login', { method: 'POST', body: payload, auth: false }),
  oauthAuthorize: (provider: string, payload: OAuthAuthorizePayload) =>
    request<OAuthAuthorizeResult>(`/recruiter/auth/oauth/${provider}/authorize`, {
      method: 'POST',
      body: payload,
      auth: false,
    }),
  oauthCallback: (provider: string, payload: OAuthCallbackPayload) =>
    request<RecruiterAuthPayload>(`/recruiter/auth/oauth/${provider}`, { method: 'POST', body: payload, auth: false }),
  verifyTwoFactor: (payload: TwoFactorChallengePayload): Promise<AuthSession> =>
    request<RecruiterAuthPayload>('/recruiter/auth/verify-2fa', { method: 'POST', body: payload, auth: false }).then(
      toRecruiterSession,
    ),
  updateProfile: (payload: RecruiterProfilePayload) =>
    request<Omit<User, 'roles'>>('/recruiter/me/profile', { method: 'PUT', body: payload }),
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
