'use client';

import VoucherTicketCard, {
  ScallopedPercentBadge,
  renderHighlightedVoucherLabel,
} from '@/components/recruiter/services/VoucherTicketCard';
import Modal from '@/components/ui/Modal';
import { useAvailableRecruiterVouchers } from '@/hooks/useRecruiterVouchers';
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
  const availableVouchers = useAvailableRecruiterVouchers(isOpen);

  const applySelectedCode = async (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      setErrorMessage('Enter a voucher code.');
      return;
    }
    setInputCode(code);
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

  const handleApply = () => void applySelectedCode(inputCode);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2">
          <Ticket className="text-primary h-5 w-5" />
          <span className="text-on-surface font-bold">Voucher</span>
        </div>
      }
      description="Enter a voucher code to reduce your recruitment service costs"
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
              placeholder="Enter voucher code"
              className="border-outline text-on-surface placeholder:text-outline focus:border-primary w-full rounded-lg border py-2.5 pr-3 pl-9.5 text-sm font-semibold tracking-wider uppercase placeholder:font-normal placeholder:tracking-normal placeholder:normal-case focus:ring-2 focus:ring-[#00b14f]/20 focus:outline-hidden"
            />
          </div>
          <button
            type="button"
            onClick={handleApply}
            disabled={isApplying}
            className="bg-primary hover:bg-primary cursor-pointer rounded-lg px-5 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isApplying ? 'Checking…' : 'Apply'}
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
                Applied <strong className="font-bold text-emerald-800">{appliedVoucher.code}</strong> —{' '}
                {appliedVoucher.label}, {appliedVoucher.discountAmount.toLocaleString('vi-VN')}đ off
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

        {(availableVouchers.data?.length ?? 0) > 0 && (
          <div className="space-y-2">
            <p className="text-on-surface text-xs font-bold">Available vouchers</p>
            <div className="max-h-52 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] space-y-2.5 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
              {availableVouchers.data!.map((item) => {
                const isActiveCode = appliedVoucher?.code === item.code;
                return (
                  <VoucherTicketCard
                    key={item.code}
                    disabled={isApplying}
                    active={isActiveCode}
                    onClick={() => void applySelectedCode(item.code)}
                  >
                    <ScallopedPercentBadge />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-[#009944]">
                        {renderHighlightedVoucherLabel(item.label)}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-[#009944]/80">
                        <code className="font-mono font-bold text-[#00823a]">{item.code}</code>
                        {item.minOrderValue > 0 && ` · Min. order ${item.minOrderValue.toLocaleString('vi-VN')}đ`}
                        {item.applicablePackages.length > 0 &&
                          ` · Applies to ${item.applicablePackages.length} packages (${item.applicablePackages
                            .slice(0, 2)
                            .map((pkg) => pkg.name)
                            .join(', ')}${item.applicablePackages.length > 2 ? '…' : ''})`}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full border border-[#00b14f]/30 bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#009944]">
                      {isActiveCode ? 'In use' : 'Apply'}
                    </span>
                  </VoucherTicketCard>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-on-surface-variant text-xs leading-relaxed">
          Vouchers are issued per promotion. The discount applies to the value of the services you selected, and VAT is
          calculated after the discount.
        </p>
      </div>
    </Modal>
  );
}
