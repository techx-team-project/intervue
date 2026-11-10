'use client';

import Modal from '@/components/ui/Modal';
import type { DiscountVoucher } from '@/types/recruiter-cart';
import { Check, Tag, Ticket } from 'lucide-react';
import { useState } from 'react';

interface CartVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  appliedVoucher: DiscountVoucher | null;
  onApplyVoucher: (code: string) => { success: boolean; message: string };
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

  const handleApply = (codeToApply?: string) => {
    const code = (codeToApply || inputCode).trim().toUpperCase();
    if (!code) {
      setErrorMessage('Please enter a coupon code.');
      return;
    }
    const res = onApplyVoucher(code);
    if (res.success) {
      setSuccessMessage(res.message);
      setErrorMessage('');
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 700);
    } else {
      setErrorMessage(res.message);
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
          <span className="text-on-surface font-bold">Select coupon</span>
        </div>
      }
      description="Apply promotional discounts to save on your hiring services"
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
              placeholder="Enter coupon code (e.g. INTERVUE10)"
              className="border-outline text-on-surface placeholder:text-outline focus:border-primary w-full rounded-lg border py-2.5 pr-3 pl-9.5 text-sm font-semibold tracking-wider uppercase placeholder:font-normal placeholder:tracking-normal placeholder:normal-case focus:ring-2 focus:ring-[#00b14f]/20 focus:outline-hidden"
            />
          </div>
          <button
            type="button"
            onClick={() => handleApply()}
            className="bg-primary hover:bg-primary cursor-pointer rounded-lg px-5 py-2.5 text-sm font-bold text-white transition"
          >
            Apply
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
                Active coupon: <strong className="font-bold text-emerald-800">{appliedVoucher.code}</strong> (
                {appliedVoucher.label})
              </span>
            </div>
            <button
              type="button"
              onClick={onRemoveVoucher}
              className="cursor-pointer font-semibold text-rose-600 hover:underline"
            >
              Remove
            </button>
          </div>
        )}

        {/* Promotions are issued from Wave 6 onward; nothing to list yet */}
        <div className="border-outline-variant border-t pt-3">
          <p className="text-outline mb-2.5 text-xs font-bold tracking-wider uppercase">Available for you</p>
          <div className="border-outline-variant text-on-surface-variant rounded-xl border border-dashed px-4 py-8 text-center text-xs">
            Hiện chưa có mã ưu đãi nào dành cho tài khoản của bạn.
          </div>
        </div>
      </div>
    </Modal>
  );
}
