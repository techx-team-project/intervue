'use client';

import { exchangeOAuthCode } from '@/apiRequest/auth-portal';
import Spinner from '@/components/common/Spinner';
import { OAUTH_REDIRECT_STORAGE_KEY } from '@/constants/auth';
import { ROUTES } from '@/constants/routes';
import { startCandidateSession } from '@/hooks/useCandidateSession';
import { startRecruiterSession } from '@/hooks/useRecruiterSession';
import { isApiError } from '@/lib/api-error';
import { AUTH_PORTAL_ROUTES, type OAuthPortal } from '@/lib/auth-portal';
import type { OAuthOutcome } from '@/types/auth';
import { getErrorMessage } from '@/utils/error';
import { sanitizeRedirect } from '@/utils/redirect';
import { homeFor } from '@/utils/role-home';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import InvalidLinkNotice from './InvalidLinkNotice';
import TwoFactorChallengeModal from './TwoFactorChallengeModal';

function clearSavedRedirect() {
  sessionStorage.removeItem(OAUTH_REDIRECT_STORAGE_KEY);
}

type OAuthCallbackStatusProps = {
  portal?: OAuthPortal;
  provider: string;
  code?: string;
  state?: string;
  error?: string;
};

export default function OAuthCallbackStatus({
  portal = 'candidate',
  provider,
  code,
  state,
  error,
}: OAuthCallbackStatusProps) {
  const router = useRouter();
  const routes = AUTH_PORTAL_ROUTES[portal];
  const isRecruiter = portal === 'recruiter';
  const submittedRef = useRef(false);
  const [challengeToken, setChallengeToken] = useState<string | null>(null);

  const finishSignIn = ({ session, newAccount }: OAuthOutcome) => {
    if (!session) return;
    if (isRecruiter) startRecruiterSession(session);
    else startCandidateSession(session);
    const saved = sessionStorage.getItem(OAUTH_REDIRECT_STORAGE_KEY);
    clearSavedRedirect();
    if (newAccount) {
      router.replace(ROUTES.RECRUITER_ONBOARDING);
      return;
    }
    router.replace(sanitizeRedirect(saved, isRecruiter ? ROUTES.RECRUITER_DASHBOARD : homeFor(session.user.roles)));
  };

  const callback = useMutation({
    mutationFn: () => exchangeOAuthCode(portal, provider, { code: code ?? '', state: state ?? '' }),
    onSuccess: (outcome) => {
      if (outcome.tempToken) setChallengeToken(outcome.tempToken);
      else finishSignIn(outcome);
    },
    onError: (err) => {
      clearSavedRedirect();
      if (isApiError(err) && err.code === 'OAUTH_ACCOUNT_NOT_FOUND') {
        toast.info('No account yet. Accept the terms to sign up with Google.');
        router.replace(routes.register);
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
      router.replace(routes.login);
      return;
    }
    if (!code || !state) return;
    submittedRef.current = true;
    mutate();
  }, [error, code, state, mutate, router, routes.login]);

  if (!error && (!code || !state)) {
    return (
      <InvalidLinkNotice
        message="The sign-in link is invalid."
        actionHref={routes.login}
        actionLabel="Back to sign in"
        loginHref={routes.login}
      />
    );
  }

  if (callback.isError && !(isApiError(callback.error) && callback.error.code === 'OAUTH_ACCOUNT_NOT_FOUND')) {
    return (
      <InvalidLinkNotice
        message={getErrorMessage(callback.error)}
        actionHref={routes.login}
        actionLabel="Back to sign in"
        loginHref={routes.login}
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
          portal={portal}
          onSuccess={(session) => {
            setChallengeToken(null);
            finishSignIn({ session, newAccount: false });
          }}
          onCancel={() => {
            clearSavedRedirect();
            router.replace(routes.login);
          }}
        />
      )}
    </div>
  );
}
