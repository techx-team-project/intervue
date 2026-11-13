'use client';

import CouponWalletCard, { availableToCouponCardData } from '@/components/recruiter/services/CouponWalletCard';
import Modal from '@/components/ui/Modal';
import {
  VOUCHER_MODAL_SIZE_CLASS,
  getVoucherTickServerSnapshot,
  getVoucherTickSnapshot,
  resolveVoucherDisplayConditions,
  subscribeVoucherTick,
} from '@/lib/admin-vouchers';
import type { AvailableVoucher } from '@/types/voucher';
import { CheckCircle2, Info } from 'lucide-react';
import { useSyncExternalStore } from 'react';

interface VoucherConditionsModalProps {
  voucher: AvailableVoucher | null;
  isOpen: boolean;
  applied: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
}

export default function VoucherConditionsModal({
  voucher,
  isOpen,
  applied,
  onClose,
  onSelect,
}: VoucherConditionsModalProps) {
  const nowMs = useSyncExternalStore(subscribeVoucherTick, getVoucherTickSnapshot, getVoucherTickServerSnapshot);

  if (!voucher) return null;
  const conditions = resolveVoucherDisplayConditions(voucher);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      radius="xl"
      className={VOUCHER_MODAL_SIZE_CLASS}
      title={
        <div className="flex items-center gap-2">
          <Info className="text-primary h-5 w-5" />
          <span className="text-on-surface font-bold">Applicable conditions</span>
        </div>
      }
    >
      <div className="space-y-5">
        <CouponWalletCard voucher={availableToCouponCardData(voucher)} variant="available" nowMs={nowMs} hideTooltip />

        <div>
          <p className="text-on-surface text-xs font-bold tracking-wide uppercase">Detailed information</p>
          <ul className="mt-2.5 space-y-2">
            {conditions.map((condition, index) => (
              <li
                key={`${voucher.code}-cond-${index}`}
                className="text-on-surface-variant flex items-start gap-2 text-sm leading-relaxed"
              >
                <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                <span>{condition}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => {
            onSelect(voucher.code);
            onClose();
          }}
          disabled={applied}
          className="bg-primary hover:bg-primary w-full cursor-pointer rounded-lg py-2.5 text-center text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {applied ? 'Already applied' : 'Select this code'}
        </button>
      </div>
    </Modal>
  );
}
