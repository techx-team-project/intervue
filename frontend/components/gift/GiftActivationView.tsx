'use client';

import React, { useState, useRef } from 'react';
import { AVAILABLE_VOUCHERS, GIFT_FAQS } from '@/mocks/gift.mock';
import { AvailableVoucher } from '@/types/gift';
import GiftActivationForm from './GiftActivationForm';
import AvailableVouchersSection from './AvailableVouchersSection';
import GiftFaqSection from './GiftFaqSection';

export default function GiftActivationView() {
  const formRef = useRef<HTMLDivElement>(null);
  const [packageType, setPackageType] = useState('300');
  const [couponCode, setCouponCode] = useState('');

  const handleUseVoucher = (voucher: AvailableVoucher) => {
    setPackageType(voucher.packageId);
    setCouponCode(voucher.code);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div id="main" className="min-h-screen bg-slate-100 pt-6 pb-16 antialiased sm:pt-8 md:pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* 1. Form Kích hoạt mã */}
        <GiftActivationForm
          formRef={formRef}
          packageType={packageType}
          setPackageType={setPackageType}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          onApplySuccess={() => {}}
        />

        {/* 2. Danh sách mã ưu đãi khả dụng */}
        <AvailableVouchersSection vouchers={AVAILABLE_VOUCHERS} onUseVoucher={handleUseVoucher} />

        {/* 3. Câu hỏi thường gặp */}
        <GiftFaqSection faqs={GIFT_FAQS} />
      </div>
    </div>
  );
}
