import type { AuthPortal } from '@/lib/auth-portal';
import { ArrowRight, KeyRound, Smartphone } from 'lucide-react';
import Link from 'next/link';
import AccountEmailRow from './AccountEmailRow';
import AccountPhoneRow from './AccountPhoneRow';

type ProtectionSettingsCardProps = {
  portal: AuthPortal;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  passwordHref: string;
};

export default function ProtectionSettingsCard({
  portal,
  email,
  emailVerified,
  phone,
  phoneVerified,
  passwordHref,
}: ProtectionSettingsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <h2 className="text-base font-bold text-slate-800">Core protection settings</h2>

      <div className="mt-4 divide-y divide-slate-100">
        <AccountEmailRow portal={portal} email={email} verified={emailVerified} />

        <AccountPhoneRow portal={portal} phone={phone} verified={phoneVerified} />

        <div className="flex items-center justify-between py-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">Sign-in password</div>
              <div className="text-xs text-slate-500">Last changed 45 days ago (high security)</div>
            </div>
          </div>
          <Link
            href={passwordHref}
            className="text-primary inline-flex items-center gap-1 text-xs font-bold hover:underline"
          >
            <span>Change password</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">Two-factor authentication</span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                  Not active
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Requires a 6-digit code from Google/Microsoft Authenticator at sign-in
              </div>
            </div>
          </div>
          <Link
            href="/account/two-factor"
            className="bg-primary rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-emerald-700"
          >
            Enable now
          </Link>
        </div>
      </div>
    </div>
  );
}
