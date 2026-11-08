'use client';

import Modal from '@/components/ui/Modal';
import { formatCountdown } from '@/lib/utils';
import type { CartCreatedOrder } from '@/types/recruiter-cart';
import { Check, CheckCircle2, Clock, Copy, Receipt, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CartCheckoutSuccessModalProps {
  order: CartCreatedOrder | null;
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
  const [countdown, setCountdown] = useState(900); // 15 mins
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!isOpen || isPaid) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isPaid]);

  if (!order) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleConfirmPaid = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsPaid(true);
    }, 1200);
  };

  const handleComplete = () => {
    setIsPaid(false);
    onFinished();
  };

  const qrUrl = `https://img.vietqr.io/image/MB-0812665001-compact2.png?amount=${order.totalAmount}&addInfo=${encodeURIComponent(
    order.bankAccount.transferSyntax,
  )}&accountName=${encodeURIComponent(order.bankAccount.accountHolder)}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          {isPaid ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <Receipt className="text-primary h-5 w-5" />
          )}
          <span className="text-on-surface font-bold">
            {isPaid ? 'Order Activated Successfully' : 'Service Order Payment'}
          </span>
        </div>
      }
      description={
        isPaid
          ? 'Thank you! Your recruitment service packages are now active in your recruiter account.'
          : 'Scan the VietQR code via your mobile banking app for automatic verification and instant activation'
      }
    >
      {isPaid ? (
        <div className="space-y-5 py-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
          </div>

          <div>
            <h3 className="text-on-surface text-xl font-bold">Payment Successful!</h3>
            <p className="text-on-surface-variant mt-1 text-sm">
              Order code: <strong className="text-on-surface font-bold">{order.orderCode}</strong>
            </p>
          </div>

          <div className="border-outline-variant bg-surface-container-low text-on-surface-variant rounded-xl border p-4 text-left text-xs leading-relaxed">
            <div className="border-outline-variant/60 flex justify-between border-b py-1">
              <span className="text-on-surface-variant">Total amount paid:</span>
              <span className="font-bold text-emerald-600">{order.totalAmount.toLocaleString('vi-VN')} VND</span>
            </div>
            <div className="border-outline-variant/60 flex justify-between border-b py-1">
              <span className="text-on-surface-variant">Invoice type:</span>
              <span className="text-on-surface font-semibold">
                {order.invoiceType === 'business' ? 'Corporate Electronic VAT Invoice' : 'Individual Invoice'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-on-surface-variant">Invoice recipient email:</span>
              <span className="text-on-surface font-semibold">{order.invoiceData.recipientEmail}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleComplete}
            className="bg-primary hover:bg-primary w-full cursor-pointer rounded-xl py-3 text-sm font-bold text-white transition"
          >
            Return to Cart
          </button>
        </div>
      ) : (
        <div className="space-y-4 py-1">
          {/* Top urgency banner */}
          <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-800">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              <span>Order reserved for:</span>
            </div>
            <span className="rounded-md bg-amber-200/70 px-2 py-0.5 font-mono text-xs font-bold text-amber-900">
              {formatCountdown(countdown)}
            </span>
          </div>

          {/* QR code and Transfer details side by side */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-center">
            {/* VietQR */}
            <div className="border-outline-variant bg-surface-container-low/50 flex flex-col items-center justify-center rounded-xl border p-3 sm:col-span-5">
              <div className="relative h-44 w-44 overflow-hidden rounded-lg bg-white p-1 shadow-xs ring-1 ring-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt={`VietQR payment for order ${order.orderCode}`}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-label-sm text-on-surface-variant mt-2 font-medium">Open Banking App to scan</span>
            </div>

            {/* Bank Transfer info */}
            <div className="space-y-2 text-xs sm:col-span-7">
              <div className="border-outline-variant rounded-lg border bg-white p-2.5">
                <p className="text-label-sm text-outline">Beneficiary bank</p>
                <p className="text-on-surface font-bold">{order.bankAccount.bankName}</p>
              </div>

              <div className="border-outline-variant flex items-center justify-between rounded-lg border bg-white p-2.5">
                <div>
                  <p className="text-label-sm text-outline">Account number</p>
                  <p className="font-mono text-sm font-bold text-emerald-700">{order.bankAccount.accountNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('acc', order.bankAccount.accountNumber)}
                  className="bg-surface-container-high text-label-sm text-on-surface-variant hover:bg-surface-container-high flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 font-semibold"
                >
                  {copiedKey === 'acc' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedKey === 'acc' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="border-outline-variant flex items-center justify-between rounded-lg border bg-white p-2.5">
                <div>
                  <p className="text-label-sm text-outline">Payment amount</p>
                  <p className="text-sm font-bold text-emerald-600">{order.totalAmount.toLocaleString('vi-VN')} VND</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('amount', String(order.totalAmount))}
                  className="bg-surface-container-high text-label-sm text-on-surface-variant hover:bg-surface-container-high flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 font-semibold"
                >
                  {copiedKey === 'amount' ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copiedKey === 'amount' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/50 p-2.5">
                <div>
                  <p className="text-label-sm text-amber-700">Transfer memo (Required)</p>
                  <p className="font-mono text-xs font-bold text-amber-950">{order.bankAccount.transferSyntax}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('syntax', order.bankAccount.transferSyntax)}
                  className="text-label-sm flex cursor-pointer items-center gap-1 rounded-md bg-amber-200/80 px-2 py-1 font-bold text-amber-900 hover:bg-amber-300"
                >
                  {copiedKey === 'syntax' ? (
                    <Check className="h-3 w-3 text-emerald-700" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copiedKey === 'syntax' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="border-outline text-on-surface-variant hover:bg-surface-container-high cursor-pointer rounded-lg border px-4 py-2.5 text-xs font-semibold transition"
            >
              Pay later
            </button>
            <button
              type="button"
              disabled={isVerifying}
              onClick={handleConfirmPaid}
              className="bg-primary hover:bg-primary flex cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold text-white shadow-sm transition disabled:opacity-60"
            >
              {isVerifying ? (
                <span>Verifying payment...</span>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>I have completed payment</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
