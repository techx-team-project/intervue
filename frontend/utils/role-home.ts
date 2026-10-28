import { ROLES } from '@/constants/auth';
import { ROUTES } from '@/constants/routes';
import type { RoleType } from '@/types/auth';

export function homeFor(roles: readonly RoleType[]): string {
  const recruiterOnly = roles.includes(ROLES.RECRUITER) && !roles.includes(ROLES.CANDIDATE);
  return recruiterOnly ? ROUTES.RECRUITER_DASHBOARD : ROUTES.HOME;
}
