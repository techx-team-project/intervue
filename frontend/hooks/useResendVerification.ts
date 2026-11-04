'use client';

import { authApiFor } from '@/apiRequest/auth-portal';
import { refreshSession } from '@/apiRequest/http';
import { isApiError } from '@/lib/api-error';
import { isRecruiterPortal } from '@/lib/auth-portal';
import { getErrorMessage } from '@/utils/error';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useResendVerification() {
  return useMutation({
    mutationFn: () => authApiFor(isRecruiterPortal() ? 'recruiter' : 'candidate').resendVerification(),
    onSuccess: () => toast.success('Verification email sent again, please check your inbox.'),
    onError: (error) => {
      toast.error(getErrorMessage(error));
      if (isApiError(error) && error.code === 'EMAIL_ALREADY_VERIFIED') {
        refreshSession().catch(() => undefined);
      }
    },
  });
}
