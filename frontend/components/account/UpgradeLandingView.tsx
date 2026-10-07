'use client';

import React, { useState } from 'react';
import { UpgradeOrder } from '@/types/upgrade';
import { PRICING_PLANS, UPGRADE_FAQS, UPGRADE_FEATURES } from '@/mocks/upgrade.mock';
import UpgradeHero from './upgrade/UpgradeHero';
import PricingComparisonTable from './upgrade/PricingComparisonTable';
import PaymentQrModal from './upgrade/PaymentQrModal';
import VoucherSection from './upgrade/VoucherSection';
import PricingFaqSection from './upgrade/PricingFaqSection';

export default function UpgradeLandingView() {
  const [selectedOrder, setSelectedOrder] = useState<UpgradeOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPlan = (planId: 'pro' | 'premium') => {
    const isPro = planId === 'pro';

    const order: UpgradeOrder = {
      planId,
      planName: isPro ? 'Gói tài khoản Pro VIP' : 'Gói tài khoản Premium VIP',
      priceText: isPro ? '50,000 VNĐ' : '500,000 VNĐ',
      priceValue: isPro ? 50000 : 500000,
      periodText: isPro ? '1 tháng' : '1 năm (12 tháng)',
      orderCode: isPro
        ? `IVVIP_PRO_${Math.floor(100000 + Math.random() * 900000)}`
        : `IVVIP_PRE_${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased">
      {/* 1. Header Banner */}
      <UpgradeHero />

      {/* 2. Bảng so sánh quyền lợi (Data-Driven Matrix) */}
      <PricingComparisonTable features={UPGRADE_FEATURES} plans={PRICING_PLANS} onSelectPlan={handleSelectPlan} />

      {/* 3. Khối mã ưu đãi / Voucher */}
      <VoucherSection />

      {/* 4. Câu hỏi thường gặp */}
      <PricingFaqSection faqs={UPGRADE_FAQS} />

      {/* 5. Modal Thanh toán qua VietQR */}
      <PaymentQrModal order={selectedOrder} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
