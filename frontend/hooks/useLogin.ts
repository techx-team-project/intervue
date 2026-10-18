'use client';

import { authApi } from '@/apiRequest/auth';
import { useAuthStore } from '@/store/auth.store';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (session) => {
      useAuthStore.getState().setSession(session);
      toast.success('Signed in successfully!');
    },
  });
}
