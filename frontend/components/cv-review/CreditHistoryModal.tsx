'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import type { CandidateCreditTransaction } from '@/types/cv-review';

const TYPE_LABELS: Record<string, string> = {
  CHARGE: 'Charge',
  REFUND: 'Automatic refund',
  TOPUP: 'Top up',
  INITIAL_GRANT: 'Welcome credit',
};

interface CreditHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions?: CandidateCreditTransaction[];
  currentBalance?: number;
}

export function CreditHistoryModal({
  isOpen,
  onClose,
  transactions = [],
  currentBalance = 0,
}: CreditHistoryModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title="Credit history"
      description={`Current balance: ${currentBalance} credits. Every charge and refund is recorded here.`}
    >
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <p className="text-body-md text-on-surface-variant py-8 text-center">No credit transactions yet.</p>
        ) : (
          <ul className="border-outline-variant divide-outline-variant max-h-96 divide-y overflow-y-auto rounded-xl border">
            {transactions.map((tx) => (
              <li key={tx.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0 space-y-0.5">
                  <p className="text-body-md text-on-surface font-semibold">{TYPE_LABELS[tx.type] ?? tx.type}</p>
                  <p className="text-body-sm text-on-surface-variant">{tx.description}</p>
                  <p className="text-label-md text-on-surface-variant">
                    {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-GB') : ''}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={cn(
                      'font-display text-title-md font-bold',
                      tx.amount < 0 ? 'text-error' : 'text-primary',
                    )}
                  >
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                  </p>
                  <p className="text-label-md text-on-surface-variant">Balance {tx.balanceAfter}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
