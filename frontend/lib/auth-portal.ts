import { ROLES } from '@/constants/auth';
import { RECRUITER_AREA_PREFIX, ROUTES } from '@/constants/routes';
import type { AdminAuthPayload, AuthSession, RecruiterAuthPayload } from '@/types/auth';

export function isRecruiterPortal(): boolean {
  return typeof window !== 'undefined' && window.location.pathname.startsWith(RECRUITER_AREA_PREFIX);
}

export function isAdminPortal(): boolean {
  return typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
}

export function getActivePortal(): 'admin' | 'recruiter' | 'candidate' {
  if (isAdminPortal()) return 'admin';
  if (isRecruiterPortal()) return 'recruiter';
  return 'candidate';
}

export function toRecruiterSession({ accessToken, recruiter }: RecruiterAuthPayload): AuthSession {
  if (!accessToken || !recruiter) throw new Error('Missing session data');
  return { accessToken, user: { ...recruiter, roles: [ROLES.RECRUITER] } };
}

export function toAdminSession({ accessToken, admin }: AdminAuthPayload): AuthSession {
  if (!accessToken || !admin) throw new Error('Missing admin session data');
  return {
    accessToken,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      emailVerified: true,
      roles: admin.roles,
      createdAt: admin.lastLoginAt || new Date().toISOString(),
    },
  };
}

export type AuthPortal = 'candidate' | 'recruiter' | 'admin';

export const AUTH_PORTAL_ROUTES: Record<AuthPortal, { home: string; login: string; forgotPassword: string }> = {
  candidate: { home: ROUTES.HOME, login: ROUTES.LOGIN, forgotPassword: ROUTES.FORGOT_PASSWORD },
  recruiter: {
    home: ROUTES.RECRUITER_LANDING,
    login: ROUTES.RECRUITER_LOGIN,
    forgotPassword: ROUTES.RECRUITER_FORGOT_PASSWORD,
  },
  admin: {
    home: '/admin/dashboard',
    login: '/admin/login',
    forgotPassword: '/admin/login',
  },
};
