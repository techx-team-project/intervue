'use client';

import Button from '@/components/ui/Button';
import type { AuthPortal } from '@/lib/auth-portal';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteAccountDialog from './DeleteAccountDialog';

type DeleteAccountCardProps = { portal: AuthPortal };

export default function DeleteAccountCard({ portal }: DeleteAccountCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-error/30 rounded-2xl border bg-white p-6 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-error text-base font-bold">Delete account</h2>
          <p className="text-on-surface-variant mt-1 text-xs">
            Deleting your account starts a 7-day grace period. Signing in again during that time cancels the deletion;
            after that, the account is removed permanently.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          leftIcon={<Trash2 className="h-3.5 w-3.5" />}
          className="border-error/30 bg-error/10 text-error hover:bg-error/10 hover:text-error"
        >
          Delete account
        </Button>
      </div>

      <DeleteAccountDialog isOpen={isOpen} onClose={() => setIsOpen(false)} portal={portal} />
    </div>
  );
}
