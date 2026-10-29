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
            <Receipt className="h-5 w-5 text-[#00b14f]" />
          )}
          <span className="font-bold text-slate-800">
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
            <h3 className="text-xl font-bold text-slate-900">Payment Successful!</h3>
            <p className="mt-1 text-sm text-slate-500">
              Order code: <strong className="font-bold text-slate-800">{order.orderCode}</strong>
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-xs leading-relaxed text-slate-600">
            <div className="flex justify-between border-b border-slate-200/60 py-1">
              <span className="text-slate-500">Total amount paid:</span>
              <span className="font-bold text-emerald-600">{order.totalAmount.toLocaleString('vi-VN')} VND</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 py-1">
              <span className="text-slate-500">Invoice type:</span>
              <span className="font-semibold text-slate-800">
                {order.invoiceType === 'business' ? 'Corporate Electronic VAT Invoice' : 'Individual Invoice'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Invoice recipient email:</span>
              <span className="font-semibold text-slate-800">{order.invoiceData.recipientEmail}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleComplete}
            className="w-full cursor-pointer rounded-xl bg-[#00b14f] py-3 text-sm font-bold text-white transition hover:bg-[#00873c]"
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
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:col-span-5">
              <div className="relative h-44 w-44 overflow-hidden rounded-lg bg-white p-1 shadow-xs ring-1 ring-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt={`VietQR payment for order ${order.orderCode}`}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="mt-2 text-[11px] font-medium text-slate-500">Open Banking App to scan</span>
            </div>

            {/* Bank Transfer info */}
            <div className="space-y-2 text-xs sm:col-span-7">
              <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                <p className="text-[11px] text-slate-400">Beneficiary bank</p>
                <p className="font-bold text-slate-800">{order.bankAccount.bankName}</p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2.5">
                <div>
                  <p className="text-[11px] text-slate-400">Account number</p>
                  <p className="font-mono text-sm font-bold text-emerald-700">{order.bankAccount.accountNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('acc', order.bankAccount.accountNumber)}
                  className="flex cursor-pointer items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-200"
                >
                  {copiedKey === 'acc' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedKey === 'acc' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2.5">
                <div>
                  <p className="text-[11px] text-slate-400">Payment amount</p>
                  <p className="text-sm font-bold text-emerald-600">{order.totalAmount.toLocaleString('vi-VN')} VND</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('amount', String(order.totalAmount))}
                  className="flex cursor-pointer items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-200"
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
                  <p className="text-[11px] text-amber-700">Transfer memo (Required)</p>
                  <p className="font-mono text-xs font-bold text-amber-950">{order.bankAccount.transferSyntax}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('syntax', order.bankAccount.transferSyntax)}
                  className="flex cursor-pointer items-center gap-1 rounded-md bg-amber-200/80 px-2 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-300"
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
              className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Pay later
            </button>
            <button
              type="button"
              disabled={isVerifying}
              onClick={handleConfirmPaid}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#00b14f] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#00873c] disabled:opacity-60"
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
