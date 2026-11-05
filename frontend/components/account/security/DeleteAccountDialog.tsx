'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useRequestDeletion } from '@/hooks/useAccountIdentity';
import type { AuthPortal } from '@/lib/auth-portal';
import { useState } from 'react';

type DeleteAccountDialogProps = { isOpen: boolean; onClose: () => void; portal: AuthPortal };

const CONFIRM_WORD = 'DELETE';

export default function DeleteAccountDialog({ isOpen, onClose, portal }: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const requestDeletion = useRequestDeletion(portal);
  const isBusy = requestDeletion.isPending || requestDeletion.isSuccess;

  const handleClose = () => {
    if (isBusy) return;
    setConfirmText('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete your account?"
      description="You will be signed out of every device. Your account is deleted permanently after 7 days unless you sign in again before then."
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (confirmText === CONFIRM_WORD) requestDeletion.mutate();
        }}
        className="space-y-4"
      >
        <Input
          label={`Type ${CONFIRM_WORD} to confirm`}
          autoComplete="off"
          value={confirmText}
          onChange={(event) => setConfirmText(event.target.value)}
          placeholder={CONFIRM_WORD}
        />
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isBusy}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" isLoading={isBusy} disabled={confirmText !== CONFIRM_WORD}>
            Delete account
          </Button>
        </div>
      </form>
    </Modal>
  );
}
