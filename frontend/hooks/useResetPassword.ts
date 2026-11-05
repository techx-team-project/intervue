'use client';

import { authApiFor } from '@/apiRequest/auth-portal';
import { AUTH_PORTAL_ROUTES, type AuthPortal } from '@/lib/auth-portal';
import type { ResetPasswordPayload } from '@/schemas/auth.schema';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useResetPassword(portal: AuthPortal = 'candidate') {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authApiFor(portal).resetPassword(payload),
    onSuccess: () => {
      toast.success('Password reset successfully! Please sign in again.');
      router.replace(AUTH_PORTAL_ROUTES[portal].login);
    },
  });
}
