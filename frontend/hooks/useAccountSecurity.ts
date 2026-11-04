'use client';

import { accountSecurityApiFor } from '@/apiRequest/account-security';
import type { AuthPortal } from '@/lib/auth-portal';
import type { ChangePasswordFormData } from '@/schemas/auth.schema';
import { getErrorMessage } from '@/utils/error';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const sessionsKey = (portal: AuthPortal) => ['account-sessions', portal] as const;

export function useAccountSessions(portal: AuthPortal = 'candidate') {
  return useQuery({
    queryKey: sessionsKey(portal),
    queryFn: () => accountSecurityApiFor(portal).sessions(),
  });
}

export function useRevokeSession(portal: AuthPortal = 'candidate') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number) => accountSecurityApiFor(portal).revokeSession(sessionId),
    onSuccess: () => {
      toast.success('Device signed out successfully!');
      return queryClient.invalidateQueries({ queryKey: sessionsKey(portal) });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useRevokeOtherSessions(portal: AuthPortal = 'candidate') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => accountSecurityApiFor(portal).revokeOtherSessions(),
    onSuccess: () => {
      toast.success('Signed out of all other devices!');
      return queryClient.invalidateQueries({ queryKey: sessionsKey(portal) });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useChangePassword(portal: AuthPortal = 'candidate') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangePasswordFormData) => accountSecurityApiFor(portal).changePassword(payload),
    onSuccess: () => {
      toast.success('Password changed successfully!');
      return queryClient.invalidateQueries({ queryKey: sessionsKey(portal) });
    },
  });
}
