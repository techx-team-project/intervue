'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { useState } from 'react';

const MAX_REASON = 500;

interface AdminJobReasonDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  placeholder: string;
  initialReason?: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function AdminJobReasonDialog({
  title,
  description,
  confirmLabel,
  placeholder,
  initialReason = '',
  isPending,
  onClose,
  onConfirm,
}: AdminJobReasonDialogProps) {
  const [reason, setReason] = useState(initialReason);
  const trimmed = reason.trim();

  return (
    <Modal
      isOpen
      onClose={onClose}
      maxWidth="md"
      title={title}
      description={description}
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
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <Textarea
        label="Reason"
        value={reason}
        maxLength={MAX_REASON}
        rows={4}
        placeholder={placeholder}
        helperText={`${reason.length}/${MAX_REASON}`}
        onChange={(event) => setReason(event.target.value)}
      />
    </Modal>
  );
}
