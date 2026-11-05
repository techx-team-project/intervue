'use client';

import { authApi } from '@/apiRequest/auth';
import { useAuthStore } from '@/store/auth.store';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      if (res.requiresTwoFactor) return;
      if (res.accessToken && res.user) {
        useAuthStore.getState().setSession({ accessToken: res.accessToken, user: res.user }, 'candidate');
        toast.success('Signed in successfully!');
      }
    },
  });
}
