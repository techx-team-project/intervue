import { ROLES } from '@/constants/auth';
import { RECRUITER_AREA_PREFIX } from '@/constants/routes';
import type { AuthSession, RecruiterAuthPayload } from '@/types/auth';

export function isRecruiterPortal(): boolean {
  return typeof window !== 'undefined' && window.location.pathname.startsWith(RECRUITER_AREA_PREFIX);
}

export function toRecruiterSession({ accessToken, recruiter }: RecruiterAuthPayload): AuthSession {
  return { accessToken, user: { ...recruiter, roles: [ROLES.RECRUITER] } };
}
