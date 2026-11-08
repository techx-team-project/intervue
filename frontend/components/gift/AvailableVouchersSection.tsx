'use client';

import React, { useState } from 'react';
import { Gift, Copy, Check, Clock, Sparkles } from 'lucide-react';
import { AvailableVoucher } from '@/types/gift';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface AvailableVouchersSectionProps {
  vouchers: AvailableVoucher[];
  onUseVoucher: (voucher: AvailableVoucher) => void;
}

export function AvailableVouchersSection({ vouchers, onUseVoucher }: AvailableVouchersSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (voucher: AvailableVoucher) => {
    navigator.clipboard.writeText(voucher.code);
    setCopiedId(voucher.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mt-14">
      <div className="mb-8 text-center">
        <div className="border-primary/30 bg-primary-light text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold">
          <Gift className="h-3.5 w-3.5" />
          <span>VOUCHER KHẢ DỤNG</span>
        </div>
        <h2 className="text-on-surface mt-2 text-2xl font-extrabold sm:text-3xl">Your gift codes</h2>
        <p className="text-on-surface-variant mt-1 text-sm">Special offers reserved for your InterVue account</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {vouchers.map((voucher) => {
          const isCopied = copiedId === voucher.id;

          return (
            <div
              key={voucher.id}
              className="border-outline-variant hover:border-outline hover:shadow-elevation-1 relative flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-xs transition"
            >
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <Badge variant={voucher.type === 'premium' ? 'vip' : 'success'}>{voucher.badgeLabel}</Badge>
                  <span className="text-outline flex items-center gap-1 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>HSD: {voucher.expiryDate}</span>
                  </span>
                </div>

                <h3 className="text-on-surface text-base leading-snug font-bold">{voucher.packageName}</h3>
                <p className="text-on-surface-variant mt-1.5 text-xs leading-relaxed">{voucher.description}</p>
              </div>

              <div className="border-outline-variant mt-5 flex items-center justify-between gap-3 border-t pt-4">
                <div className="border-outline-variant bg-surface-container-low flex items-center gap-2 rounded-xl border px-3 py-2">
                  <span className="text-primary font-mono text-xs font-bold sm:text-sm">{voucher.code}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(voucher)}
                    className="text-outline hover:text-on-surface-variant cursor-pointer p-0.5"
                    title="Copy code"
                  >
                    {isCopied ? <Check className="text-primary h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <Button
                  size="sm"
                  onClick={() => onUseVoucher(voucher)}
                  rightIcon={<Sparkles className="h-3.5 w-3.5" />}
                >
                  Apply
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AvailableVouchersSection;
