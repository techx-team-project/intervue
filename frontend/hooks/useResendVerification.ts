'use client';

import { authApi } from '@/apiRequest/auth';
import { getErrorMessage } from '@/utils/error';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useResendVerification() {
  return useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: () => toast.success('Verification email sent again, please check your inbox.'),
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
