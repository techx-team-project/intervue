'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import type { CreditPrice } from '@/types/credit';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface ConvertCreditsModalProps {
  isOpen: boolean;
  balance: number;
  prices: CreditPrice[];
  onClose: () => void;
  onConfirm: (price: CreditPrice, quantity: number) => void;
  isBusy: boolean;
  error: string | null;
}

export default function ConvertCreditsModal({
  isOpen,
  balance,
  prices,
  onClose,
  onConfirm,
  isBusy,
  error,
}: ConvertCreditsModalProps) {
  const [priceId, setPriceId] = useState('');
  const [quantity, setQuantity] = useState('1');

  const selected = prices.find((price) => String(price.id) === priceId) ?? null;
  const amount = Number(quantity);
  const validQuantity = Number.isInteger(amount) && amount >= 1 && amount <= 50;
  const cost = selected && validQuantity ? selected.creditCost * amount : 0;
  const affordable = cost > 0 && cost <= balance;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Exchange credits for add-ons" maxWidth="lg">
      <p className="text-on-surface-variant text-sm">
        Current balance: <strong className="text-on-surface">{balance.toLocaleString('vi-VN')}</strong> credits
      </p>

      <div className="mt-4 space-y-4">
        <Select
          label="Add-on to exchange"
          value={priceId}
          onChange={(event) => setPriceId(event.target.value)}
          options={[
            { value: '', label: '— Select an add-on —' },
            ...prices.map((price) => ({
              value: String(price.id),
              label: `${price.label} — ${price.creditCost.toLocaleString('vi-VN')} credits`,
            })),
          ]}
        />

        <Input
          label="Quantity"
          type="number"
          min={1}
          max={50}
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
      </div>

      {selected && validQuantity && (
        <p className="mt-4 text-sm">
          Total cost: <strong>{cost.toLocaleString('vi-VN')}</strong> credits · remaining{' '}
          <strong className={affordable ? 'text-emerald-700' : 'text-rose-600'}>
            {affordable ? (balance - cost).toLocaleString('vi-VN') : 'insufficient'}
          </strong>
        </p>
      )}

      <div className="mt-4 flex gap-3 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3">
        <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600" />
        <p className="text-sm leading-relaxed text-amber-900">
          Exchanged credits <strong>cannot be refunded</strong>. The add-on goes to your inventory unactivated, and you
          choose when to apply it to a job later.
        </p>
      </div>

      {error && <p className="mt-3 text-xs font-semibold text-rose-600">{error}</p>}

      <div className="mt-5 flex justify-end gap-3">
        <Button variant="neutral" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() => selected && onConfirm(selected, amount)}
          disabled={!selected || !affordable}
          isLoading={isBusy}
        >
          Confirm exchange
        </Button>
      </div>
    </Modal>
  );
}
