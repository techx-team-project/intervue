'use client';

import { authApi } from '@/apiRequest/auth';
import { ROUTES } from '@/constants/routes';
import { useMutation } from '@tanstack/react-query';

export function useLogout() {
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => window.location.assign(ROUTES.LOGIN),
  });
}
