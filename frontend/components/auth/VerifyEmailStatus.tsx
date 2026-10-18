'use client';

import Spinner from '@/components/common/Spinner';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useVerifyEmail } from '@/hooks/useVerifyEmail';
import { getErrorMessage } from '@/utils/error';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import InvalidLinkNotice from './InvalidLinkNotice';

type VerifyEmailStatusProps = { token?: string };

export default function VerifyEmailStatus({ token }: VerifyEmailStatusProps) {
  const verifyEmail = useVerifyEmail();
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
        actionHref={ROUTES.HOME}
        actionLabel="Back to home"
      />
    );
  }

  if (verifyEmail.isError) {
    return (
      <InvalidLinkNotice
        message={getErrorMessage(verifyEmail.error)}
        actionHref={ROUTES.HOME}
        actionLabel="Back to home"
      />
    );
  }

  if (verifyEmail.isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">Email verified</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">Your account is ready to use.</p>
        </div>
        <Link href={ROUTES.LOGIN} className="block">
          <Button className="w-full rounded-xl py-3 text-sm font-bold">Continue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <Spinner />
      <p className="text-sm text-slate-500">Verifying your email...</p>
    </div>
  );
}
