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
      planName: isPro ? 'Pro VIP plan' : 'Premium VIP plan',
      priceText: isPro ? '50,000 VND' : '500,000 VND',
      priceValue: isPro ? 50000 : 500000,
      periodText: isPro ? '1 month' : '1 year (12 months)',
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
    <div className="text-on-surface min-h-screen bg-white antialiased">
      <UpgradeHero />

      <PricingComparisonTable features={UPGRADE_FEATURES} plans={PRICING_PLANS} onSelectPlan={handleSelectPlan} />

      <VoucherSection />

      <PricingFaqSection faqs={UPGRADE_FAQS} />

      <PaymentQrModal order={selectedOrder} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
