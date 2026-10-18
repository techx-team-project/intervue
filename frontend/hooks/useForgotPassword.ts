'use client';

import { authApi } from '@/apiRequest/auth';
import { useMutation } from '@tanstack/react-query';

export function useForgotPassword() {
  return useMutation({ mutationFn: authApi.forgotPassword });
}
