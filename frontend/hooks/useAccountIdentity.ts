'use client';

import { accountSecurityApiFor } from '@/apiRequest/account-security';
import { AUTH_PORTAL_ROUTES, type AuthPortal } from '@/lib/auth-portal';
import type { ChangeEmailFormData } from '@/schemas/auth.schema';
import { useAuthStore } from '@/store/auth.store';
import { getErrorMessage } from '@/utils/error';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const REDIRECT_DELAY_MS = 2500;

export function useRequestDeletion(portal: AuthPortal = 'candidate') {
  return useMutation({
    mutationFn: () => accountSecurityApiFor(portal).requestDeletion(),
    onSuccess: () => {
      toast.success('Account deletion scheduled in 7 days. Signing in again before then cancels it.', {
        duration: REDIRECT_DELAY_MS * 2,
      });
      setTimeout(() => window.location.assign(AUTH_PORTAL_ROUTES[portal].login), REDIRECT_DELAY_MS);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useSendPhoneOtp(portal: AuthPortal = 'candidate') {
  return useMutation({
    mutationFn: (phone: string) => accountSecurityApiFor(portal).sendPhoneOtp(phone),
  });
}

export function useVerifyPhoneOtp(portal: AuthPortal = 'candidate') {
  return useMutation({
    mutationFn: (code: string) => accountSecurityApiFor(portal).verifyPhoneOtp(code),
    onSuccess: (patch) => {
      const { accessToken, user, setSession } = useAuthStore.getState();
      if (accessToken && user) setSession({ accessToken, user: { ...user, ...patch, roles: user.roles } });
      toast.success('Phone number verified successfully!');
    },
  });
}

export function useRequestEmailChange(portal: AuthPortal = 'candidate') {
  return useMutation({
    mutationFn: (payload: ChangeEmailFormData) => accountSecurityApiFor(portal).requestEmailChange(payload),
    onSuccess: () => toast.success('We sent a confirmation link to your new email.'),
  });
}
