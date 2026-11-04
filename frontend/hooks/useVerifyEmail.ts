'use client';

import { authApiFor } from '@/apiRequest/auth-portal';
import { refreshSession } from '@/apiRequest/http';
import type { AuthPortal } from '@/lib/auth-portal';
import { useAuthStore } from '@/store/auth.store';
import { useMutation } from '@tanstack/react-query';

export function useVerifyEmail(portal: AuthPortal = 'candidate') {
  return useMutation({
    mutationFn: (token: string) => authApiFor(portal).verifyEmail(token),
    onSuccess: async () => {
      if (useAuthStore.getState().status === 'authenticated') {
        await refreshSession().catch(() => undefined);
      }
    },
  });
}
