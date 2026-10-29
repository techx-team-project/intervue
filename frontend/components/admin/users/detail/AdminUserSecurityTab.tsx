'use client';

import { cn } from '@/lib/utils';
import type { AdminUserListItem } from '@/types/admin-user';
import { KeyRound, ShieldAlert, ShieldCheck, ShieldOff } from 'lucide-react';
import AdminUserPanel from './AdminUserPanel';

interface AdminUserSecurityTabProps {
  user: AdminUserListItem;
  twoFactorEnabled: boolean;
  onResetTwoFactor: () => void;
  onSendPasswordReset: () => void;
}

export default function AdminUserSecurityTab({
  user,
  twoFactorEnabled,
  onResetTwoFactor,
  onSendPasswordReset,
}: AdminUserSecurityTabProps) {
  const isVerified = user.emailVerifiedAt !== null;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <AdminUserPanel title="Two-factor authentication">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
              twoFactorEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600',
            )}
          >
            {twoFactorEnabled ? <ShieldCheck className="h-5 w-5" /> : <ShieldOff className="h-5 w-5" />}
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-navy dark:text-forest-50 text-[13px] font-bold">
              {twoFactorEnabled ? 'Enabled' : 'Not enabled'}
            </p>
            <p className="dark:text-forest-300 mt-0.5 text-[12px] text-[#64748b]">
              {twoFactorEnabled
                ? 'Resetting removes the authenticator secret and every recovery code. Only do it when the user has lost access.'
                : 'The account signs in with its password alone. Nothing to reset.'}
            </p>

            {twoFactorEnabled && (
              <button
                type="button"
                onClick={onResetTwoFactor}
                className="mt-2.5 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-2 text-[12.5px] font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:bg-rose-500/10"
              >
                <ShieldOff className="h-3.5 w-3.5" />
                Reset two-factor
              </button>
            )}
          </div>
        </div>
      </AdminUserPanel>

      <AdminUserPanel title="Password">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
            <KeyRound className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-navy dark:text-forest-50 text-[13px] font-bold">Send a reset link</p>
            <p className="dark:text-forest-300 mt-0.5 text-[12px] text-[#64748b]">
              {isVerified
                ? 'Emails a single-use link. Admins never see or set a password on behalf of a user.'
                : 'The email address is not verified, so a reset link cannot be delivered.'}
            </p>

            <button
              type="button"
              disabled={!isVerified}
              onClick={onSendPasswordReset}
              className="dark:border-forest-800 dark:text-forest-100 dark:hover:bg-forest-850 mt-2.5 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-[12.5px] font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <KeyRound className="h-3.5 w-3.5" />
              Send password reset
            </button>
          </div>
        </div>
      </AdminUserPanel>

      <AdminUserPanel
        title="Security incidents"
        description="Raised by the token rotation guard, not by a human."
        className="xl:col-span-2"
      >
        {user.hasTokenReuseIncident ? (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-rose-800">Refresh token reuse detected</p>
              <p className="mt-1 text-[12.5px] text-rose-700">
                A refresh token was presented after it had already been rotated. Every session on the account was
                revoked automatically. Treat the credentials as compromised and ask the user to change their password.
              </p>
            </div>
          </div>
        ) : (
          <p className="dark:text-forest-300 py-2 text-[12.5px] text-[#64748b]">
            No token reuse has been detected on this account.
          </p>
        )}
      </AdminUserPanel>
    </div>
  );
}
