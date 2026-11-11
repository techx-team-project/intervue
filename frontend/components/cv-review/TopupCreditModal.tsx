'use client';

import React, { useState } from 'react';
import { Coins, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useTopupCandidateCredits } from '@/hooks/useCandidateCredits';
import { toast } from 'sonner';

interface TopupCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance?: number;
}

const PACKAGES = [
  { amount: 5, price: '50.000đ', popular: false, desc: '5 lượt đánh giá so khớp công việc (Level 3)' },
  { amount: 10, price: '90.000đ', popular: true, desc: 'Tiết kiệm 10% · Phù hợp đang ứng tuyển tích cực' },
  { amount: 20, price: '160.000đ', popular: false, desc: 'Tiết kiệm 20% · Đánh giá không giới hạn chiến dịch' },
];

export function TopupCreditModal({ isOpen, onClose, currentBalance = 0 }: TopupCreditModalProps) {
  const [selectedAmount, setSelectedAmount] = useState(10);
  const topupMutation = useTopupCandidateCredits();

  const handleTopup = () => {
    topupMutation.mutate(selectedAmount, {
      onSuccess: () => {
        toast.success(`Nạp thành công ${selectedAmount} credit vào tài khoản!`);
        onClose();
      },
      onError: (err: unknown) => {
        const error = err as { message?: string };
        toast.error(error?.message || 'Không thể nạp credit lúc này. Vui lòng thử lại.');
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-amber-500" />
          <span className="font-extrabold text-slate-900">Nạp Credit Đánh Giá CV (Level 3)</span>
        </div>
      }
      description={`Số dư khả dụng hiện tại: ${currentBalance} credit. Mỗi lượt đánh giá so khớp chi tiết sử dụng 1 credit.`}
    >
      <div className="space-y-4 pt-2">
        <div className="grid gap-3 sm:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <button
              key={pkg.amount}
              type="button"
              onClick={() => setSelectedAmount(pkg.amount)}
              className={`relative flex flex-col justify-between rounded-2xl border p-4 text-left transition ${
                selectedAmount === pkg.amount
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/30'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-2.5 right-3 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
                  Phổ biến nhất
                </span>
              )}
              <div>
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Coins className="h-4 w-4 text-amber-500" />
                  <span>{pkg.amount} Credit</span>
                </div>
                <p className="mt-1 text-lg font-black text-emerald-700">{pkg.price}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{pkg.desc}</p>
              </div>
              <div className="mt-3 flex items-center justify-end">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    selectedAmount === pkg.amount ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                  }`}
                >
                  {selectedAmount === pkg.amount && <Check className="h-3 w-3" />}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Chính sách minh bạch & Hoàn tiền tự động:</span>
          </div>
          <p className="mt-1 text-slate-600">
            Credit được kích hoạt ngay lập tức. Nếu hệ thống AI gặp lỗi kỹ thuật trong quá trình phân tích CV, hệ thống
            sẽ
            <strong> tự động hoàn trả 100% credit</strong> ngay lập tức.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button variant="ghost" onClick={onClose} disabled={topupMutation.isPending}>
            Hủy
          </Button>
          <Button onClick={handleTopup} disabled={topupMutation.isPending} className="flex items-center gap-2">
            {topupMutation.isPending ? (
              'Đang xử lý...'
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Nạp ngay {selectedAmount} Credit</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
