'use client';

import { authApi } from '@/apiRequest/auth';
import { useAuthStore } from '@/store/auth.store';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useRegister() {
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (session) => {
      useAuthStore.getState().setSession(session);
      toast.success('Account created! Please check your email to verify your account.');
    },
  });
}
