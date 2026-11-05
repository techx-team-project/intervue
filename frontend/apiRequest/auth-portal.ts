import { authApi } from '@/apiRequest/auth';
import { recruiterAuthApi } from '@/apiRequest/recruiter-auth';
import type { AuthPortal } from '@/lib/auth-portal';

export function authApiFor(portal: AuthPortal) {
  return portal === 'recruiter' ? recruiterAuthApi : authApi;
}
