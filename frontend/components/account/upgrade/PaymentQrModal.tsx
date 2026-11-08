'use client';

import React, { useState, useEffect } from 'react';
import { Check, CheckCircle2, Copy, Sparkles } from 'lucide-react';
import { UpgradeOrder } from '@/types/upgrade';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { formatCountdown } from '@/lib/utils';

interface PaymentQrModalProps {
  order: UpgradeOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

export function PaymentQrModal({ order, isOpen, onClose, onPaymentSuccess }: PaymentQrModalProps) {
  const [countdown, setCountdown] = useState(900);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || isSuccess) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isSuccess]);

  if (!order) return null;

  const handleModalClose = () => {
    setCountdown(900);
    setIsSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onPaymentSuccess?.();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary h-5 w-5" />
          <span className="text-on-surface font-extrabold">Pay for {order.planName}</span>
        </div>
      }
      description="Scan the VietQR code for an instant 24/7 transfer and automatic activation"
    >
      {isSuccess ? (
        <div className="space-y-4 py-6 text-center">
          <div className="bg-primary-container text-primary mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div>
            <h4 className="text-on-surface text-xl font-bold">{order.planName} activated!</h4>
            <p className="text-on-surface-variant mx-auto mt-2 max-w-sm text-sm">
              Congratulations! All VIP benefits are ready. You can create unlimited CVs and boost your profile right
              now.
            </p>
          </div>

          <div className="pt-4">
            <Button onClick={handleModalClose} className="w-full px-8 sm:w-auto">
              Finish & Continue
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
            <div>
              <p className="text-on-primary-container text-sm font-medium">Plan</p>
              <p className="text-base font-bold text-emerald-950">{order.planName}</p>
              <p className="text-primary text-xs">Duration: {order.periodText}</p>
            </div>
            <div className="text-right">
              <p className="text-on-primary-container text-sm font-medium">Amount due</p>
              <p className="text-primary text-lg font-bold">{order.priceText}</p>
              <p className="text-primary text-xs font-semibold">
                QR code expires in: <span className="text-error font-mono">{formatCountdown(countdown)}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-2">
            <div className="border-outline-variant flex flex-col items-center justify-center rounded-2xl border bg-white p-4 shadow-xs">
              <div className="border-outline-variant bg-surface-container-low relative flex h-48 w-48 items-center justify-center rounded-xl border p-2">
                <img
                  loading="lazy"
                  decoding="async"
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=247_MBBANK_INTERVUE_${order.orderCode}_${order.priceValue}`}
                  alt="VietQR Code"
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="text-on-surface-variant mt-2 text-center text-xs font-medium">
                Open your banking or wallet app to scan the QR code
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-on-surface-variant block text-xs">Beneficiary bank</span>
                <span className="text-on-surface font-bold">MB Bank (Military Bank)</span>
              </div>

              <div>
                <span className="text-on-surface-variant block text-xs">Account number</span>
                <span className="text-on-surface font-mono font-bold">0988 888 8888</span>
              </div>

              <div>
                <span className="text-on-surface-variant block text-xs">Account holder</span>
                <span className="text-on-surface font-bold">CTCP INTERVUE VIETNAM</span>
              </div>

              <div>
                <span className="text-on-surface-variant block text-xs">Transfer note (required)</span>
                <div className="border-outline-variant bg-surface-container-high mt-1 flex items-center justify-between rounded-xl border px-3 py-2">
                  <span className="text-primary font-mono text-sm font-bold">{order.orderCode}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.orderCode)}
                    className="text-on-surface-variant hover:text-primary flex cursor-pointer items-center gap-1 text-xs font-bold"
                  >
                    {copiedCode ? <Check className="text-primary h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={handleConfirmPayment} isLoading={isProcessing} className="w-full py-3 text-base">
              I have completed the transfer
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default PaymentQrModal;
