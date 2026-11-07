import { ROUTES } from '@/constants/routes';
import type { OAuthPortal } from '@/lib/auth-portal';
import { KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function SetPasswordNotice({ portal = 'candidate' }: { portal?: OAuthPortal }) {
  return (
    <div className="space-y-3 text-sm text-slate-600">
      <p className="flex items-center gap-2 font-semibold text-slate-800">
        <KeyRound className="h-4 w-4 text-slate-400" />
        Set a password first
      </p>
      <p>This account has no password yet. Set one to continue.</p>
      <Link
        href={portal === 'recruiter' ? ROUTES.RECRUITER_ACCOUNT_PASSWORD : ROUTES.ACCOUNT_PASSWORD}
        className="text-primary inline-block font-semibold hover:underline"
      >
        Go to password settings
      </Link>
    </div>
  );
}
