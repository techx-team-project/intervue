'use client';

import { authApi } from '@/apiRequest/auth';
import { refreshSession } from '@/apiRequest/http';
import { useAuthStore } from '@/store/auth.store';
import { useMutation } from '@tanstack/react-query';

export function useVerifyEmail() {
  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: async () => {
      if (useAuthStore.getState().status === 'authenticated') {
        await refreshSession().catch(() => undefined);
      }
    },
  });
}
