'use client';

import type { AuthPortal } from '@/lib/auth-portal';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import ChangeEmailDialog from './ChangeEmailDialog';

type AccountEmailRowProps = { portal: AuthPortal; email: string; verified: boolean };

export default function AccountEmailRow({ portal, email, verified }: AccountEmailRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3 py-4">
      <div className="flex min-w-0 items-start gap-3.5">
        <div className="text-primary bg-primary-light flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <Mail className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-on-surface text-sm font-bold">Account email</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                verified ? 'bg-primary-container text-on-primary-container' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {verified ? 'Verified' : 'Not verified'}
            </span>
          </div>
          <div className="text-on-surface-variant truncate text-xs">{email}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-primary shrink-0 cursor-pointer text-xs font-semibold hover:underline"
      >
        Change
      </button>

      <ChangeEmailDialog isOpen={isOpen} onClose={() => setIsOpen(false)} portal={portal} currentEmail={email} />
    </div>
  );
}
