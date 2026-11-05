import { ROLES } from '@/constants/auth';
import { RECRUITER_AREA_PREFIX, ROUTES } from '@/constants/routes';
import type { AuthSession, RecruiterAuthPayload } from '@/types/auth';

export function isRecruiterPortal(): boolean {
  return typeof window !== 'undefined' && window.location.pathname.startsWith(RECRUITER_AREA_PREFIX);
}

export function toRecruiterSession({ accessToken, recruiter }: RecruiterAuthPayload): AuthSession {
  return { accessToken, user: { ...recruiter, roles: [ROLES.RECRUITER] } };
}

export type AuthPortal = 'candidate' | 'recruiter';

export const AUTH_PORTAL_ROUTES: Record<AuthPortal, { home: string; login: string; forgotPassword: string }> = {
  candidate: { home: ROUTES.HOME, login: ROUTES.LOGIN, forgotPassword: ROUTES.FORGOT_PASSWORD },
  recruiter: {
    home: ROUTES.RECRUITER_LANDING,
    login: ROUTES.RECRUITER_LOGIN,
    forgotPassword: ROUTES.RECRUITER_FORGOT_PASSWORD,
  },
};
