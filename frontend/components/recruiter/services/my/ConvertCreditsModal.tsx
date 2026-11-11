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
    <Modal isOpen={isOpen} onClose={onClose} title="Đổi credits lấy tiện ích" maxWidth="lg">
      <p className="text-on-surface-variant text-sm">
        Số dư hiện tại: <strong className="text-on-surface">{balance.toLocaleString('vi-VN')}</strong> credits
      </p>

      <div className="mt-4 space-y-4">
        <Select
          label="Tiện ích muốn đổi"
          value={priceId}
          onChange={(event) => setPriceId(event.target.value)}
          options={[
            { value: '', label: '— Chọn tiện ích —' },
            ...prices.map((price) => ({
              value: String(price.id),
              label: `${price.label} — ${price.creditCost.toLocaleString('vi-VN')} credits`,
            })),
          ]}
        />

        <Input
          label="Số lượng"
          type="number"
          min={1}
          max={50}
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
      </div>

      {selected && validQuantity && (
        <p className="mt-4 text-sm">
          Tổng trừ: <strong>{cost.toLocaleString('vi-VN')}</strong> credits · còn lại{' '}
          <strong className={affordable ? 'text-emerald-700' : 'text-rose-600'}>
            {affordable ? (balance - cost).toLocaleString('vi-VN') : 'không đủ'}
          </strong>
        </p>
      )}

      <div className="mt-4 flex gap-3 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3">
        <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600" />
        <p className="text-sm leading-relaxed text-amber-900">
          Credits đã đổi <strong>không lấy lại được</strong>. Tiện ích vào kho dưới dạng chưa kích hoạt, bạn chọn thời
          điểm áp lên tin sau.
        </p>
      </div>

      {error && <p className="mt-3 text-xs font-semibold text-rose-600">{error}</p>}

      <div className="mt-5 flex justify-end gap-3">
        <Button variant="neutral" onClick={onClose}>
          Huỷ
        </Button>
        <Button
          onClick={() => selected && onConfirm(selected, amount)}
          disabled={!selected || !affordable}
          isLoading={isBusy}
        >
          Xác nhận đổi
        </Button>
      </div>
    </Modal>
  );
}
