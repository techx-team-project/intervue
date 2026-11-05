'use client';

import { authApiFor } from '@/apiRequest/auth-portal';
import type { AuthPortal } from '@/lib/auth-portal';
import { useAuthStore } from '@/store/auth.store';
import { useMutation } from '@tanstack/react-query';

export function useConfirmEmailChange(portal: AuthPortal = 'candidate') {
  return useMutation({
    mutationFn: (token: string) => authApiFor(portal).confirmEmailChange(token),
    onSuccess: () => useAuthStore.getState().clearSession(),
  });
}
