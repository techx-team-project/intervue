'use client';

import Modal from '@/components/ui/Modal';
import { formatServicePrice } from '@/utils/service-package';
import { XCircle } from 'lucide-react';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isConfirming: boolean;
  code: string;
  totalAmount: number;
  currency: string;
}

export default function CancelOrderModal({
  isOpen,
  onClose,
  onConfirm,
  isConfirming,
  code,
  totalAmount,
  currency,
}: CancelOrderModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      radius="xl"
      title={
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-rose-600" />
          <span className="text-on-surface font-bold">Cancel this order?</span>
        </div>
      }
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="border-outline-variant bg-surface-container-high text-on-surface hover:bg-surface-container cursor-pointer rounded-lg border px-5 py-2 text-sm font-semibold transition"
          >
            Keep order
          </button>
          <button
            type="button"
            disabled={isConfirming}
            onClick={onConfirm}
            className="cursor-pointer rounded-lg bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isConfirming ? 'Cancelling…' : 'Yes, cancel order'}
          </button>
        </>
      }
    >
      <p className="text-on-surface-variant text-sm leading-relaxed">
        Order <strong className="text-on-surface font-mono">{code}</strong> ({formatServicePrice(totalAmount, currency)}
        ) will be cancelled and can no longer be paid. Any reserved items, such as booked banner weeks, will be released
        back to availability. This action cannot be undone.
      </p>
    </Modal>
  );
}
