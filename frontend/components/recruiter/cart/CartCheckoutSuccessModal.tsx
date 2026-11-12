'use client';

import { Modal } from '@/components/ui/Modal';
import { ROUTES } from '@/constants/routes';
import type { RecruiterOrder } from '@/types/recruiter-order';
import { formatServicePrice } from '@/utils/service-package';
import { CheckCircle2, Clock, Copy, Info } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface CartCheckoutSuccessModalProps {
  order: RecruiterOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onFinished: () => void;
}

export default function CartCheckoutSuccessModal({
  order,
  isOpen,
  onClose,
  onFinished,
}: CartCheckoutSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(order.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Order created" maxWidth="lg">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <p className="text-on-surface mt-3 text-base font-bold">Your order has been recorded</p>
      </div>

      <dl className="border-outline-variant mt-5 divide-y rounded-xl border">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <dt className="text-on-surface-variant text-sm">Order code</dt>
          <dd className="flex items-center gap-2">
            <span className="text-on-surface font-mono text-sm font-bold">{order.code}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-outline hover:text-primary cursor-pointer transition"
              aria-label="Copy order code"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            {copied && <span className="text-xs font-semibold text-emerald-600">Copied</span>}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <dt className="text-on-surface-variant text-sm">Total (VAT included)</dt>
          <dd className="text-primary text-base font-bold">{formatServicePrice(order.totalAmount, order.currency)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <dt className="text-on-surface-variant flex items-center gap-1.5 text-sm">
            <Clock className="h-4 w-4" />
            Payment due
          </dt>
          <dd className="text-on-surface text-sm font-semibold">{new Date(order.expiresAt).toLocaleString('vi-VN')}</dd>
        </div>
      </dl>

      <div className="mt-4 flex gap-3 rounded-lg border-l-4 border-sky-500 bg-sky-50 px-4 py-3">
        <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sky-600" />
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Bank transfer instructions and the QR code will appear on the order details page once the payment gateway is
          enabled. Your order is held until the due date above.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <Link
          href={`${ROUTES.RECRUITER_ORDERS}/${order.code}`}
          onClick={onFinished}
          className="bg-primary inline-flex h-10 flex-1 items-center justify-center rounded-lg text-sm font-semibold text-white transition hover:brightness-95"
        >
          View order details
        </Link>
        <button
          type="button"
          onClick={onFinished}
          className="border-outline-variant text-on-surface inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border bg-white text-sm font-semibold transition hover:bg-neutral-50"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
