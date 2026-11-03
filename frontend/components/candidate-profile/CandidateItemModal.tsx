'use client';

import Modal from '@/components/ui/Modal';
import type { ReactNode } from 'react';

type CandidateItemModalProps = {
  title: string;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function CandidateItemModal({ title, isOpen, isPending, onClose, children }: CandidateItemModalProps) {
  const handleClose = () => {
    if (!isPending) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="2xl" title={title}>
      {children}
    </Modal>
  );
}
