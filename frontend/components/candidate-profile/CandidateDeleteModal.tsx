'use client';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Trash2 } from 'lucide-react';

type CandidateDeleteModalProps = {
  isOpen: boolean;
  name: string;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function CandidateDeleteModal({
  isOpen,
  name,
  isPending,
  onConfirm,
  onClose,
}: CandidateDeleteModalProps) {
  const handleClose = () => {
    if (!isPending) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      title="Delete this item?"
      footer={
        <>
          <Button type="button" variant="ghost" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={isPending}
            onClick={onConfirm}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Delete
          </Button>
        </>
      }
    >
      <p className="text-sm wrap-break-word text-slate-600">
        <span className="font-semibold text-slate-800">{name}</span> will be removed from your profile. This cannot be
        undone.
      </p>
    </Modal>
  );
}
