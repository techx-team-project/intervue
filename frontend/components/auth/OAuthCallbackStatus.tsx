'use client';

import { authApi } from '@/apiRequest/auth';
import Spinner from '@/components/common/Spinner';
import { OAUTH_REDIRECT_STORAGE_KEY } from '@/constants/auth';
import { ROUTES } from '@/constants/routes';
import { startCandidateSession } from '@/hooks/useCandidateSession';
import { isApiError } from '@/lib/api-error';
import { getErrorMessage } from '@/utils/error';
import { sanitizeRedirect } from '@/utils/redirect';
import { homeFor } from '@/utils/role-home';
import type { AuthResponsePayload } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import InvalidLinkNotice from './InvalidLinkNotice';
import TwoFactorChallengeModal from './TwoFactorChallengeModal';

function clearSavedRedirect() {
  sessionStorage.removeItem(OAUTH_REDIRECT_STORAGE_KEY);
}

type OAuthCallbackStatusProps = { provider: string; code?: string; state?: string; error?: string };

export default function OAuthCallbackStatus({ provider, code, state, error }: OAuthCallbackStatusProps) {
  const router = useRouter();
  const submittedRef = useRef(false);
  const [challengeToken, setChallengeToken] = useState<string | null>(null);

  const finishSignIn = (res: AuthResponsePayload) => {
    if (!startCandidateSession(res) || !res.user) return;
    const saved = sessionStorage.getItem(OAUTH_REDIRECT_STORAGE_KEY);
    clearSavedRedirect();
    router.replace(sanitizeRedirect(saved, homeFor(res.user.roles)));
  };

  const callback = useMutation({
    mutationFn: () => authApi.oauthCallback(provider, { code: code ?? '', state: state ?? '' }),
    onSuccess: (res) => {
      if (res.requiresTwoFactor && res.tempToken) setChallengeToken(res.tempToken);
      else finishSignIn(res);
    },
    onError: (err) => {
      clearSavedRedirect();
      if (isApiError(err) && err.code === 'OAUTH_ACCOUNT_NOT_FOUND') {
        toast.info('No account yet. Accept the terms to sign up with Google.');
        router.replace(ROUTES.REGISTER);
      }
    },
  });
  const { mutate } = callback;

  useEffect(() => {
    if (submittedRef.current) return;
    if (error) {
      submittedRef.current = true;
      clearSavedRedirect();
      toast.error('Sign-in was cancelled.');
      router.replace(ROUTES.LOGIN);
      return;
    }
    if (!code || !state) return;
    submittedRef.current = true;
    mutate();
  }, [error, code, state, mutate, router]);

  if (!error && (!code || !state)) {
    return (
      <InvalidLinkNotice
        message="The sign-in link is invalid."
        actionHref={ROUTES.LOGIN}
        actionLabel="Back to sign in"
      />
    );
  }

  if (callback.isError && !(isApiError(callback.error) && callback.error.code === 'OAUTH_ACCOUNT_NOT_FOUND')) {
    return (
      <InvalidLinkNotice
        message={getErrorMessage(callback.error)}
        actionHref={ROUTES.LOGIN}
        actionLabel="Back to sign in"
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <Spinner />
      <p className="text-sm text-slate-500">Signing you in...</p>
      {challengeToken && (
        <TwoFactorChallengeModal
          isOpen={true}
          tempToken={challengeToken}
          portal="candidate"
          onSuccess={(session) => {
            setChallengeToken(null);
            finishSignIn({ accessToken: session.accessToken, user: session.user });
          }}
          onCancel={() => {
            clearSavedRedirect();
            router.replace(ROUTES.LOGIN);
          }}
        />
      )}
    </div>
  );
}
