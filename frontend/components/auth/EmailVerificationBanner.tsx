'use client';

import { useAuth } from '@/hooks/useAuth';
import { useResendVerification } from '@/hooks/useResendVerification';
import { MailWarning } from 'lucide-react';

export default function EmailVerificationBanner() {
  const { user, isAuthenticated } = useAuth();
  const resend = useResendVerification();

  if (!isAuthenticated || !user || user.emailVerified) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-amber-50 px-4 py-2 text-xs text-amber-800 sm:text-sm">
      <MailWarning className="h-4 w-4 shrink-0" />
      <span>
        Your email <strong>{user.email}</strong> is not verified yet. Please check your inbox.
      </span>
      <button
        type="button"
        disabled={resend.isPending}
        onClick={() => resend.mutate()}
        className="cursor-pointer font-semibold underline disabled:cursor-not-allowed disabled:opacity-60"
      >
        Resend email
      </button>
    </div>
  );
}
