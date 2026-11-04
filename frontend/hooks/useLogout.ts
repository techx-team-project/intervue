'use client';

import { authApi } from '@/apiRequest/auth';
import { recruiterAuthApi } from '@/apiRequest/recruiter-auth';
import { ROUTES } from '@/constants/routes';
import { isRecruiterPortal } from '@/lib/auth-portal';
import { useMutation } from '@tanstack/react-query';

export function useLogout() {
  return useMutation({
    mutationFn: () => (isRecruiterPortal() ? recruiterAuthApi.logout() : authApi.logout()),
    onSettled: () => window.location.assign(isRecruiterPortal() ? ROUTES.RECRUITER_LOGIN : ROUTES.LOGIN),
  });
}
