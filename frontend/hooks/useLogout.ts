'use client';

import { adminAuthApi } from '@/apiRequest/admin-auth';
import { authApi } from '@/apiRequest/auth';
import { recruiterAuthApi } from '@/apiRequest/recruiter-auth';
import { ROUTES } from '@/constants/routes';
import { isAdminPortal, isRecruiterPortal } from '@/lib/auth-portal';
import { useAuthStore } from '@/store/auth.store';
import { useMutation } from '@tanstack/react-query';

export function useLogout() {
  return useMutation({
    mutationFn: () => {
      if (isAdminPortal()) {
        return adminAuthApi.logout();
      }
      if (isRecruiterPortal()) {
        return recruiterAuthApi.logout();
      }
      return authApi.logout();
    },
    onSettled: () => {
      if (isAdminPortal()) {
        useAuthStore.getState().clearSession('admin');
        window.location.assign(ROUTES.ADMIN_LOGIN);
      } else if (isRecruiterPortal()) {
        useAuthStore.getState().clearSession('recruiter');
        window.location.assign(ROUTES.RECRUITER_LOGIN);
      } else {
        useAuthStore.getState().clearSession('candidate');
        window.location.assign(ROUTES.LOGIN);
      }
    },
  });
}
