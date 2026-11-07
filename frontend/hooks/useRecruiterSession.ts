'use client';

import { useAuthStore } from '@/store/auth.store';
import type { AuthSession } from '@/types/auth';
import { toast } from 'sonner';

export function startRecruiterSession(session: AuthSession) {
  useAuthStore.getState().setSession(session, 'recruiter');
  toast.success('Signed in to the employer portal.');
}
