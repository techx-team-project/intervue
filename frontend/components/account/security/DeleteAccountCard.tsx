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
    <div className="rounded-2xl border border-rose-200 bg-white p-6 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-rose-700">Delete account</h2>
          <p className="mt-1 text-xs text-slate-500">
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
          className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800"
        >
          Delete account
        </Button>
      </div>

      <DeleteAccountDialog isOpen={isOpen} onClose={() => setIsOpen(false)} portal={portal} />
    </div>
  );
}
