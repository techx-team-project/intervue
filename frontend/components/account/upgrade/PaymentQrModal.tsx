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
  const [countdown, setCountdown] = useState(900); // 15 mins
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
          <Sparkles className="h-5 w-5 text-emerald-600" />
          <span className="font-extrabold text-slate-800">Thanh toán {order.planName}</span>
        </div>
      }
      description="Quét mã VietQR chuyển khoản nhanh 24/7 để tự động kích hoạt tài khoản"
    >
      {isSuccess ? (
        <div className="animate-in zoom-in-95 space-y-4 py-6 text-center duration-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div>
            <h4 className="text-xl font-bold text-slate-900">Kích hoạt {order.planName} thành công!</h4>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
              Chúc mừng bạn! Toàn bộ đặc quyền VIP đã sẵn sàng. Bạn có thể tạo CV không giới hạn và đẩy Top hồ sơ ngay
              bây giờ.
            </p>
          </div>

          <div className="pt-4">
            <Button onClick={handleModalClose} className="w-full px-8 sm:w-auto">
              Hoàn tất & Tiếp tục
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Thông tin đơn hàng & Timer */}
          <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
            <div>
              <p className="text-sm font-medium text-emerald-800">Gói đăng ký</p>
              <p className="text-base font-black text-emerald-950">{order.planName}</p>
              <p className="text-xs text-emerald-700">Thời hạn: {order.periodText}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-emerald-800">Số tiền cần thanh toán</p>
              <p className="text-lg font-black text-emerald-600">{order.priceText}</p>
              <p className="text-xs font-semibold text-emerald-700">
                Mã QR hết hạn trong: <span className="font-mono text-rose-600">{formatCountdown(countdown)}</span>
              </p>
            </div>
          </div>

          {/* QR Code & Hướng dẫn */}
          <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-2">
            {/* Cột Trái: Ảnh QR Code */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="relative flex h-48 w-48 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-2">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=247_MBBANK_INTERVUE_${order.orderCode}_${order.priceValue}`}
                  alt="VietQR Code"
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-2 text-center text-xs font-medium text-slate-500">
                Mở app Ngân hàng hoặc Ví để quét mã QR
              </p>
            </div>

            {/* Cột Phải: Thông tin chuyển khoản */}
            <div className="space-y-3 text-sm">
              <div>
                <span className="block text-xs text-slate-500">Ngân hàng thụ hưởng</span>
                <span className="font-bold text-slate-800">MB Bank (Quân Đội)</span>
              </div>

              <div>
                <span className="block text-xs text-slate-500">Số tài khoản</span>
                <span className="font-mono font-bold text-slate-800">0988 888 8888</span>
              </div>

              <div>
                <span className="block text-xs text-slate-500">Chủ tài khoản</span>
                <span className="font-bold text-slate-800">CTCP INTERVUE VIETNAM</span>
              </div>

              <div>
                <span className="block text-xs text-slate-500">Nội dung chuyển khoản (bắt buộc)</span>
                <div className="mt-1 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-100 px-3 py-2">
                  <span className="font-mono text-sm font-bold text-emerald-600">{order.orderCode}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.orderCode)}
                    className="flex cursor-pointer items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700"
                  >
                    {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedCode ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2">
            <Button onClick={handleConfirmPayment} isLoading={isProcessing} className="w-full py-3 text-base">
              Tôi đã chuyển khoản thành công
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default PaymentQrModal;
