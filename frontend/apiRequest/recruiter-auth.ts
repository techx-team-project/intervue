import { request } from '@/apiRequest/http';
import { toRecruiterSession } from '@/lib/auth-portal';
import type { LoginPayload, RegisterPayload } from '@/schemas/auth.schema';
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
};
