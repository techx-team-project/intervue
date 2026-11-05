'use client';

import { authApiFor } from '@/apiRequest/auth-portal';
import type { AuthPortal } from '@/lib/auth-portal';
import type { ForgotPasswordPayload } from '@/schemas/auth.schema';
import { useMutation } from '@tanstack/react-query';

export function useForgotPassword(portal: AuthPortal = 'candidate') {
  return useMutation({ mutationFn: (payload: ForgotPasswordPayload) => authApiFor(portal).forgotPassword(payload) });
}
