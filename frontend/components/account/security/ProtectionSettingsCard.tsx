'use client';

import { recruiterTwoFactorApi, userTwoFactorApi } from '@/apiRequest/two-factor';
import { ROUTES } from '@/constants/routes';
import type { AuthPortal } from '@/lib/auth-portal';
import { useQuery } from '@tanstack/react-query';
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
  const isRecruiter = portal === 'recruiter';
  const api = isRecruiter ? recruiterTwoFactorApi : userTwoFactorApi;
  const { data: twoFactorStatus } = useQuery({
    queryKey: [portal, 'two-factor-status'],
    queryFn: () => api.getStatus(),
  });
  const is2FaEnabled = twoFactorStatus?.enabled ?? false;

  return (
    <div className="border-outline-variant rounded-2xl border bg-white p-6 shadow-xs">
      <h2 className="text-on-surface text-base font-bold">Core protection settings</h2>

      <div className="divide-outline-variant mt-4 divide-y">
        <AccountEmailRow portal={portal} email={email} verified={emailVerified} />

        <AccountPhoneRow portal={portal} phone={phone} verified={phoneVerified} />

        <div className="flex items-center justify-between py-4">
          <div className="flex items-start gap-3.5">
            <div className="bg-primary-light text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <div className="text-on-surface text-sm font-bold">Sign-in password</div>
              <div className="text-on-surface-variant text-xs">Last changed 45 days ago (high security)</div>
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
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                is2FaEnabled ? 'bg-primary-light text-primary' : 'bg-amber-50 text-amber-600'
              }`}
            >
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-on-surface text-sm font-bold">Two-factor authentication</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    is2FaEnabled ? 'bg-primary-container text-on-primary-container' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {is2FaEnabled ? 'Active' : 'Not active'}
                </span>
              </div>
              <div className="text-on-surface-variant text-xs">
                Requires a 6-digit code from Google/Microsoft Authenticator at sign-in
              </div>
            </div>
          </div>
          <Link
            href={portal === 'recruiter' ? ROUTES.RECRUITER_ACCOUNT_TWO_FACTOR : '/account/two-factor'}
            className="bg-primary hover:bg-primary-hover rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-2xs transition"
          >
            {is2FaEnabled ? (isRecruiter ? 'Manage' : 'Quản lý') : isRecruiter ? 'Enable now' : 'Kích hoạt ngay'}
          </Link>
        </div>
      </div>
    </div>
  );
}
