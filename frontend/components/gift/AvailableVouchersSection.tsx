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
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
          <Gift className="h-3.5 w-3.5" />
          <span>VOUCHER KHẢ DỤNG</span>
        </div>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">Mã quà tặng của bạn</h2>
        <p className="mt-1 text-sm text-slate-500">
          Các ưu đãi đặc biệt dành riêng cho tài khoản của bạn trên InterVue
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {vouchers.map((voucher) => {
          const isCopied = copiedId === voucher.id;

          return (
            <div
              key={voucher.id}
              className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <Badge variant={voucher.type === 'premium' ? 'vip' : 'success'}>{voucher.badgeLabel}</Badge>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>HSD: {voucher.expiryDate}</span>
                  </span>
                </div>

                <h3 className="text-base leading-snug font-bold text-slate-800">{voucher.packageName}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{voucher.description}</p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="font-mono text-xs font-bold text-emerald-600 sm:text-sm">{voucher.code}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(voucher)}
                    className="cursor-pointer p-0.5 text-slate-400 hover:text-slate-600"
                    title="Sao chép mã"
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <Button
                  size="sm"
                  onClick={() => onUseVoucher(voucher)}
                  rightIcon={<Sparkles className="h-3.5 w-3.5" />}
                >
                  Áp dụng
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
