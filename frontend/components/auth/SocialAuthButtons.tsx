'use client';

import { authApiFor } from '@/apiRequest/auth-portal';
import { OAUTH_REDIRECT_STORAGE_KEY } from '@/constants/auth';
import { REDIRECT_PARAM, ROUTES } from '@/constants/routes';
import type { OAuthPortal } from '@/lib/auth-portal';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/utils/error';
import { sanitizeRedirect } from '@/utils/redirect';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { GoogleIcon, LinkedinIcon } from './SocialIcons';

type SocialAuthButtonsProps = {
  portal?: OAuthPortal;
  mode: 'login' | 'register';
  acceptTerms?: boolean;
};

const BUTTON_CLASS =
  'text-navy flex w-full items-center justify-center gap-2.5 rounded-full border border-[#e0e0e0] bg-white px-4 py-2.5 text-[13.5px] font-semibold transition';

export default function SocialAuthButtons({ portal = 'candidate', mode, acceptTerms = false }: SocialAuthButtonsProps) {
  const isRegister = mode === 'register';
  const termsPending = isRegister && !acceptTerms;

  const authorize = useMutation({
    mutationFn: () =>
      authApiFor(portal).oauthAuthorize('google', { intent: isRegister ? 'REGISTER' : 'LOGIN', acceptTerms }),
    onSuccess: ({ authorizationUrl }) => {
      const target = new URLSearchParams(window.location.search).get(REDIRECT_PARAM);
      const redirect = sanitizeRedirect(target, ROUTES.HOME);
      if (target && redirect !== ROUTES.HOME) sessionStorage.setItem(OAUTH_REDIRECT_STORAGE_KEY, redirect);
      else sessionStorage.removeItem(OAUTH_REDIRECT_STORAGE_KEY);
      window.location.assign(authorizationUrl);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={termsPending || authorize.isPending || authorize.isSuccess}
        onClick={() => authorize.mutate()}
        className={cn(
          BUTTON_CLASS,
          'cursor-pointer hover:border-[#cbd5e1] hover:bg-[#f8fafc] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-[#e0e0e0] disabled:hover:bg-white disabled:active:scale-100',
        )}
      >
        <GoogleIcon />
        <span>
          {authorize.isPending || authorize.isSuccess
            ? 'Redirecting...'
            : isRegister
              ? 'Sign up with Google'
              : 'Sign in with Google'}
        </span>
      </button>
      {termsPending && (
        <p className="text-center text-xs text-slate-500">
          Accept the terms {portal === 'recruiter' ? 'above' : 'below'} to continue with Google
        </p>
      )}

      <button type="button" disabled className={cn(BUTTON_CLASS, 'cursor-not-allowed opacity-60')}>
        <LinkedinIcon />
        <span>LinkedIn · Coming soon</span>
      </button>
    </div>
  );
}
