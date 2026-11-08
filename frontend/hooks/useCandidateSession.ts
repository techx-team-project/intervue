'use client';

import { useAuthStore } from '@/store/auth.store';
import type { AuthResponsePayload } from '@/types/auth';
import { toast } from 'sonner';

export function startCandidateSession(res: AuthResponsePayload): boolean {
  if (res.requiresTwoFactor || !res.accessToken || !res.user) return false;
  useAuthStore.getState().setSession({ accessToken: res.accessToken, user: res.user }, 'candidate');
  toast.success('Signed in successfully!');
  return true;
}
