'use client';

import Modal from '@/components/ui/Modal';
import type { VoucherPreview } from '@/types/voucher';
import { Check, Tag, Ticket } from 'lucide-react';
import { useState } from 'react';

interface CartVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  appliedVoucher: VoucherPreview | null;
  onApplyVoucher: (code: string) => Promise<{ success: boolean; message: string }>;
  onRemoveVoucher: () => void;
}

export default function CartVoucherModal({
  isOpen,
  onClose,
  appliedVoucher,
  onApplyVoucher,
  onRemoveVoucher,
}: CartVoucherModalProps) {
  const [inputCode, setInputCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    const code = inputCode.trim().toUpperCase();
    if (!code) {
      setErrorMessage('Hãy nhập mã ưu đãi.');
      return;
    }
    setIsApplying(true);
    const result = await onApplyVoucher(code);
    setIsApplying(false);
    if (result.success) {
      setSuccessMessage(result.message);
      setErrorMessage('');
    } else {
      setErrorMessage(result.message);
      setSuccessMessage('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2">
          <Ticket className="text-primary h-5 w-5" />
          <span className="text-on-surface font-bold">Mã ưu đãi</span>
        </div>
      }
      description="Nhập mã ưu đãi để giảm chi phí dịch vụ tuyển dụng"
    >
      <div className="space-y-4 py-2">
        {/* Manual code input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="text-outline absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value.toUpperCase());
                setErrorMessage('');
              }}
              placeholder="Nhập mã ưu đãi"
              className="border-outline text-on-surface placeholder:text-outline focus:border-primary w-full rounded-lg border py-2.5 pr-3 pl-9.5 text-sm font-semibold tracking-wider uppercase placeholder:font-normal placeholder:tracking-normal placeholder:normal-case focus:ring-2 focus:ring-[#00b14f]/20 focus:outline-hidden"
            />
          </div>
          <button
            type="button"
            onClick={handleApply}
            disabled={isApplying}
            className="bg-primary hover:bg-primary cursor-pointer rounded-lg px-5 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isApplying ? 'Đang kiểm tra…' : 'Áp dụng'}
          </button>
        </div>

        {errorMessage && <p className="text-xs font-semibold text-rose-600">{errorMessage}</p>}
        {successMessage && <p className="text-xs font-semibold text-emerald-600">{successMessage}</p>}

        {appliedVoucher && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Check className="h-3 w-3 stroke-[3]" />
              </span>
              <span className="text-emerald-900">
                Đang áp dụng <strong className="font-bold text-emerald-800">{appliedVoucher.code}</strong> —{' '}
                {appliedVoucher.label}, giảm {appliedVoucher.discountAmount.toLocaleString('vi-VN')}đ
              </span>
            </div>
            <button
              type="button"
              onClick={onRemoveVoucher}
              className="cursor-pointer font-semibold text-rose-600 hover:underline"
            >
              Gỡ mã
            </button>
          </div>
        )}

        <p className="text-on-surface-variant text-xs leading-relaxed">
          Mã ưu đãi được phát riêng theo chương trình. Mức giảm tính trên giá trị các dịch vụ bạn đang chọn, VAT tính
          sau khi đã giảm.
        </p>
      </div>
    </Modal>
  );
}
