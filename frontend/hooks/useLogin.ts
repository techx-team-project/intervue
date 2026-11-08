'use client';

import { authApi } from '@/apiRequest/auth';
import { startCandidateSession } from '@/hooks/useCandidateSession';
import { useMutation } from '@tanstack/react-query';

export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: startCandidateSession,
  });
}
