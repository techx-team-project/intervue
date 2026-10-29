'use client';

import Modal from '@/components/ui/Modal';
import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function CartNoticeBanner() {
  const [isOpen, setIsOpen] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-[#fef3c7] bg-[#fffbeb] px-4 py-3 text-[13.5px] text-[#92400e] shadow-xs">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-amber-500" />
          <p className="leading-snug">
            <span>Orders that remain unpaid will be automatically canceled before </span>
            <strong className="font-semibold text-amber-900">October 31, 2026</strong>
            <span>. Please complete payment to avoid order cancellation. </span>
            <button
              type="button"
              onClick={() => setShowDetailModal(true)}
              className="cursor-pointer font-bold text-[#00b14f] underline decoration-[#00b14f]/40 underline-offset-2 transition hover:text-[#00873c] hover:decoration-[#00873c]"
            >
              Learn more
            </button>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-amber-500 transition hover:text-amber-800"
          aria-label="Dismiss notice"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        maxWidth="md"
        title={
          <div className="flex items-center gap-2.5 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <span className="font-bold text-slate-900">Pending Order Reservation Policy</span>
          </div>
        }
      >
        <div className="space-y-3 py-1 text-[13px] leading-relaxed text-slate-600">
          <p>
            To ensure optimal availability of featured job slots and timely tier discounts, each service order is held
            for a maximum of <strong>72 hours</strong> from the time it is placed.
          </p>
          <p>
            After this window, if payment has not been received, the order will be automatically released to free up
            recruitment inventory for other employers.
          </p>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => setShowDetailModal(false)}
            className="cursor-pointer rounded-lg bg-[#00b14f] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#00873c]"
          >
            Got it
          </button>
        </div>
      </Modal>
    </>
  );
}
