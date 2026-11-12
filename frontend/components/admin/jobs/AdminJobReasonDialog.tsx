'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { useState } from 'react';

const MAX_REASON = 500;

interface AdminJobHideDialogProps {
  jobTitle: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function AdminJobHideDialog({ jobTitle, isPending, onClose, onConfirm }: AdminJobHideDialogProps) {
  const [reason, setReason] = useState('');
  const trimmed = reason.trim();

  return (
    <Modal
      isOpen
      onClose={onClose}
      maxWidth="md"
      title="Hide this job?"
      description={`"${jobTitle}" leaves search and the recruiter is notified with your reason.`}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="danger"
            isLoading={isPending}
            disabled={trimmed.length === 0}
            onClick={() => onConfirm(trimmed)}
          >
            Hide job
          </Button>
        </div>
      }
    >
      <Textarea
        label="Reason"
        value={reason}
        maxLength={MAX_REASON}
        rows={4}
        placeholder="Tell the recruiter what to fix before the job can be restored"
        helperText={`${reason.length}/${MAX_REASON}`}
        onChange={(event) => setReason(event.target.value)}
      />
    </Modal>
  );
}
