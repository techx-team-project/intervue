'use client';

import React from 'react';
import { History, ArrowDownLeft, ArrowUpRight, Sparkles, Gift } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { CandidateCreditTransaction } from '@/types/cv-review';

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
  const renderTypeBadge = (type: string) => {
    switch (type) {
      case 'CHARGE':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700">
            <ArrowDownLeft className="h-3 w-3" />
            Trừ credit
          </span>
        );
      case 'REFUND':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
            <ArrowUpRight className="h-3 w-3" />
            Hoàn tiền tự động
          </span>
        );
      case 'TOPUP':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
            <Sparkles className="h-3 w-3" />
            Nạp credit
          </span>
        );
      case 'INITIAL_GRANT':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
            <Gift className="h-3 w-3" />
            Tặng trải nghiệm
          </span>
        );
      default:
        return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">{type}</span>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-emerald-600" />
          <span className="font-extrabold text-slate-900">Lịch Sử Sử Dụng & Giao Dịch Credit</span>
        </div>
      }
      description={`Số dư hiện tại: ${currentBalance} credit. Ghi nhận minh bạch mọi lượt trừ phí và hoàn trả tự động.`}
    >
      <div className="space-y-4 pt-2">
        {transactions.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">Chưa có giao dịch credit nào được ghi nhận.</div>
        ) : (
          <div className="max-h-[380px] divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col gap-2 p-3.5 hover:bg-slate-50/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {renderTypeBadge(tx.type)}
                    <span className="text-xs text-slate-400">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('vi-VN') : ''}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700">{tx.description}</p>
                </div>

                <div className="text-right">
                  <span className={`text-sm font-extrabold ${tx.amount < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount} credit
                  </span>
                  <p className="text-[11px] text-slate-400">Số dư sau: {tx.balanceAfter} credit</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="ghost" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
}
