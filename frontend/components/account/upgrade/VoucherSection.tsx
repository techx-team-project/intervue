'use client';

import React, { useState } from 'react';
import { Gift, CheckCircle2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { VALID_PROMO_CODES } from '@/mocks/upgrade.mock';

export function VoucherSection() {
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [voucherSuccess, setVoucherSuccess] = useState(false);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = voucherCode.trim().toUpperCase();

    if (!trimmed) {
      setVoucherError('Please enter a gift code or voucher.');
      setVoucherSuccess(false);
      return;
    }

    if (VALID_PROMO_CODES.includes(trimmed)) {
      setVoucherError('');
      setVoucherSuccess(true);
    } else {
      setVoucherError('The activation code is invalid or has expired.');
      setVoucherSuccess(false);
    }
  };

  return (
    <section className="border-outline-variant bg-surface-container-low border-y px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="bg-primary-container text-primary mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl">
          <Gift className="h-6 w-6" />
        </div>

        <h2 className="text-on-surface text-xl font-bold sm:text-2xl">Do you have a promo code or partner gift?</h2>
        <p className="text-on-surface-variant mt-1 text-sm">
          Enter a voucher code to activate Education VIP or Pro benefits for free
        </p>

        <form onSubmit={handleApplyVoucher} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Input
              value={voucherCode}
              onChange={(e) => {
                setVoucherCode(e.target.value);
                if (voucherError) setVoucherError('');
              }}
              placeholder="Enter a promo code (e.g. INTERVUEVIP)"
              error={voucherError}
            />
          </div>

          <Button type="submit" className="h-10 px-6 sm:w-auto">
            Activate code
          </Button>
        </form>

        {voucherSuccess && (
          <div className="border-primary/30 bg-primary-light text-primary mt-4 flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-bold">
            <CheckCircle2 className="h-4 w-4" />
            <span>Valid code! Your account plan has been upgraded.</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default VoucherSection;
