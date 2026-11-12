'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { TOPUP_PACKAGES } from '@/constants/cv-review';
import { useTopupCandidateCredits } from '@/hooks/useCandidateCredits';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const DEFAULT_PACKAGE_AMOUNT = 10;

interface TopupCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance?: number;
}

export function TopupCreditModal({ isOpen, onClose, currentBalance = 0 }: TopupCreditModalProps) {
  const [selectedAmount, setSelectedAmount] = useState(DEFAULT_PACKAGE_AMOUNT);
  const topupMutation = useTopupCandidateCredits();

  const handleTopup = () => {
    topupMutation.mutate(selectedAmount, {
      onSuccess: () => {
        toast.success(`${selectedAmount} credits added to your account.`);
        onClose();
      },
      onError: (err: unknown) => {
        const error = err as { message?: string };
        toast.error(error?.message || 'Could not top up credits right now. Please try again.');
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Top up review credits"
      description={`Current balance: ${currentBalance} credits. A job match review uses 1 credit.`}
    >
      <div className="space-y-5">
        <div role="radiogroup" aria-label="Credit package" className="grid gap-3 sm:grid-cols-3">
          {TOPUP_PACKAGES.map((pkg) => {
            const isSelected = selectedAmount === pkg.amount;
            return (
              <button
                key={pkg.amount}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedAmount(pkg.amount)}
                className={cn(
                  'relative flex cursor-pointer flex-col gap-1 rounded-2xl border p-4 text-left transition-colors',
                  isSelected ? 'border-primary bg-primary-light' : 'border-outline-variant hover:border-primary/60',
                )}
              >
                {pkg.popular && (
                  <span className="bg-primary-container text-on-primary-container absolute -top-2.5 right-3 rounded-full px-2 py-0.5 text-[11px] font-bold">
                    Popular
                  </span>
                )}
                <span className="font-display text-title-md text-on-surface font-bold">{pkg.amount} credits</span>
                <span className="font-display text-title-lg text-primary font-bold">{pkg.price}</span>
                <span className="text-body-sm text-on-surface-variant">{pkg.description}</span>
                <span
                  className={cn(
                    'mt-2 flex h-5 w-5 items-center justify-center self-end rounded-full border',
                    isSelected ? 'border-primary bg-primary text-on-primary' : 'border-outline',
                  )}
                  aria-hidden
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-body-md text-on-surface-variant">
          Credits are available immediately. If the AI fails during an analysis, the credit is refunded automatically.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={topupMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleTopup} isLoading={topupMutation.isPending}>
            Buy {selectedAmount} credits
          </Button>
        </div>
      </div>
    </Modal>
  );
}
