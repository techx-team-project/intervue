'use client';

import Spinner from '@/components/common/Spinner';
import Button from '@/components/ui/Button';
import { useConfirmEmailChange } from '@/hooks/useConfirmEmailChange';
import { AUTH_PORTAL_ROUTES, type AuthPortal } from '@/lib/auth-portal';
import { getErrorMessage } from '@/utils/error';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import InvalidLinkNotice from './InvalidLinkNotice';

type ConfirmEmailChangeStatusProps = { token?: string; portal?: AuthPortal };

export default function ConfirmEmailChangeStatus({ token, portal = 'candidate' }: ConfirmEmailChangeStatusProps) {
  const routes = AUTH_PORTAL_ROUTES[portal];
  const confirmEmailChange = useConfirmEmailChange(portal);
  const { mutate } = confirmEmailChange;
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!token || submittedRef.current) return;
    submittedRef.current = true;
    mutate(token);
  }, [token, mutate]);

  if (!token || confirmEmailChange.isError) {
    return (
      <InvalidLinkNotice
        message={token ? getErrorMessage(confirmEmailChange.error) : 'The email change link is invalid.'}
        actionHref={routes.home}
        loginHref={routes.login}
        actionLabel="Back to home"
      />
    );
  }

  if (confirmEmailChange.isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <div className="bg-primary-container text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-full">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-on-surface text-base font-bold">Email changed</h3>
          <p className="text-on-surface-variant mt-1 text-sm leading-relaxed">
            Your email has been updated and you were signed out of every device. Please sign in again with your new
            email.
          </p>
        </div>
        <Link href={routes.login} className="block">
          <Button className="w-full rounded-xl py-3 text-sm font-bold">Sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <Spinner />
      <p className="text-on-surface-variant text-sm">Confirming your new email...</p>
    </div>
  );
}
