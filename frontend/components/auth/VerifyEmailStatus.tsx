'use client';

import Spinner from '@/components/common/Spinner';
import Button from '@/components/ui/Button';
import { useVerifyEmail } from '@/hooks/useVerifyEmail';
import { AUTH_PORTAL_ROUTES, type AuthPortal } from '@/lib/auth-portal';
import { getErrorMessage } from '@/utils/error';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import InvalidLinkNotice from './InvalidLinkNotice';

type VerifyEmailStatusProps = { token?: string; portal?: AuthPortal };

export default function VerifyEmailStatus({ token, portal = 'candidate' }: VerifyEmailStatusProps) {
  const routes = AUTH_PORTAL_ROUTES[portal];
  const verifyEmail = useVerifyEmail(portal);
  const { mutate } = verifyEmail;
  const submittedRef = useRef(false);

  useEffect(() => {
    // The token is single use, so guard against the Strict Mode double effect
    if (!token || submittedRef.current) return;
    submittedRef.current = true;
    mutate(token);
  }, [token, mutate]);

  if (!token) {
    return (
      <InvalidLinkNotice
        message="The email verification link is invalid."
        actionHref={routes.home}
        loginHref={routes.login}
        actionLabel="Back to home"
      />
    );
  }

  if (verifyEmail.isError) {
    return (
      <InvalidLinkNotice
        message={getErrorMessage(verifyEmail.error)}
        actionHref={routes.home}
        loginHref={routes.login}
        actionLabel="Back to home"
      />
    );
  }

  if (verifyEmail.isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <div className="bg-primary-container text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-full">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-on-surface text-base font-bold">Email verified</h3>
          <p className="text-on-surface-variant mt-1 text-sm leading-relaxed">Your account is ready to use.</p>
        </div>
        <Link href={routes.login} className="block">
          <Button className="w-full rounded-xl py-3 text-sm font-bold">Continue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <Spinner />
      <p className="text-on-surface-variant text-sm">Verifying your email...</p>
    </div>
  );
}
