'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { ScrollText } from 'lucide-react';

interface AdminUserConfirmDialogProps {
  title: string;
  description: string;
  consequences: string[];
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AdminUserConfirmDialog({
  title,
  description,
  consequences,
  confirmLabel,
  onClose,
  onConfirm,
}: AdminUserConfirmDialogProps) {
  return (
    <Modal
      isOpen
      onClose={onClose}
      maxWidth="md"
      title={title}
      description={description}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <ul className="text-body-md text-on-surface space-y-1.5">
          {consequences.map((consequence) => (
            <li key={consequence} className="flex gap-2">
              <span aria-hidden className="text-outline">
                •
              </span>
              <span>{consequence}</span>
            </li>
          ))}
        </ul>

        <p className="bg-surface-container-low text-on-surface-variant flex items-start gap-2 rounded-lg px-3 py-2 text-xs">
          <ScrollText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Recorded against your admin account with a timestamp.
        </p>
      </div>
    </Modal>
  );
}
