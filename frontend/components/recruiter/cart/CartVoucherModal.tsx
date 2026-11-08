'use client';

import Modal from '@/components/ui/Modal';
import { AVAILABLE_VOUCHERS } from '@/mocks/recruiter-cart.mock';
import type { DiscountVoucher } from '@/types/recruiter-cart';
import { Check, Tag, Ticket } from 'lucide-react';
import { useState } from 'react';

interface CartVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  appliedVoucher: DiscountVoucher | null;
  onApplyVoucher: (code: string) => { success: boolean; message: string };
  onRemoveVoucher: () => void;
  subtotal: number;
}

export default function CartVoucherModal({
  isOpen,
  onClose,
  appliedVoucher,
  onApplyVoucher,
  onRemoveVoucher,
  subtotal,
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

        {/* Available coupons list */}
        <div className="border-outline-variant border-t pt-3">
          <p className="text-outline mb-2.5 text-xs font-bold tracking-wider uppercase">Available for you</p>

          <div className="space-y-2.5">
            {AVAILABLE_VOUCHERS.map((voucher) => {
              const isApplied = appliedVoucher?.code === voucher.code;
              const isEligible = !voucher.minOrderValue || subtotal >= voucher.minOrderValue;

              return (
                <div
                  key={voucher.code}
                  className={`flex items-start justify-between rounded-xl border p-3.5 transition ${
                    isApplied
                      ? 'border-primary bg-emerald-50/40 ring-1 ring-[#00b14f]'
                      : isEligible
                        ? 'border-outline-variant hover:border-primary/50 bg-white'
                        : 'border-outline-variant bg-surface-container-low/60 opacity-60'
                  }`}
                >
                  <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold tracking-wider text-emerald-800">
                        {voucher.code}
                      </span>
                      <span className="text-on-surface text-xs font-bold">{voucher.label}</span>
                    </div>
                    <p className="text-on-surface-variant mt-1 text-xs">{voucher.description}</p>
                    {voucher.minOrderValue && (
                      <p className="text-label-sm text-outline mt-1">
                        Min. order: {voucher.minOrderValue.toLocaleString('vi-VN')} VND
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!isEligible || isApplied}
                    onClick={() => handleApply(voucher.code)}
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      isApplied
                        ? 'bg-emerald-600 text-white'
                        : isEligible
                          ? 'border-primary text-primary hover:bg-primary cursor-pointer border hover:text-white'
                          : 'border-outline-variant text-outline cursor-not-allowed border'
                    }`}
                  >
                    {isApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
