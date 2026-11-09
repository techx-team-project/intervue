'use client';

import Spinner from '@/components/common/Spinner';
import BackToTopButton from '@/components/recruiter/services/BackToTopButton';
import ServiceCategorySection from '@/components/recruiter/services/ServiceCategorySection';
import ServiceImportantNotice from '@/components/recruiter/services/ServiceImportantNotice';
import ServiceNeedSuggestionModal from '@/components/recruiter/services/ServiceNeedSuggestionModal';
import { SERVICE_CATEGORY_ANCHOR_PREFIX, SERVICE_VAT_NOTE } from '@/constants/service-package';
import { useServiceCatalog } from '@/hooks/useServiceCatalog';
import { useServiceNeedModal } from '@/hooks/useServiceNeedModal';
import type { ServiceNeedKey } from '@/types/service-package';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function ServiceCatalogView() {
  const { data, isPending, isError, error } = useServiceCatalog();
  const { dismissedForever, dismissForever } = useServiceNeedModal();
  const [modalClosed, setModalClosed] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const categories = data?.categories ?? [];
  const isModalOpen = !dismissedForever && !modalClosed && categories.length > 0;

  const scrollToNeed = (need: ServiceNeedKey) => {
    setModalClosed(true);
    const target = categories.find((category) => category.needKey === need);
    if (!target) return;
    document
      .getElementById(`${SERVICE_CATEGORY_ANCHOR_PREFIX}${target.code}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (isPending) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
        <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
        {getErrorMessage(error)}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="border-outline-variant text-on-surface-variant rounded-lg border border-dashed px-6 py-16 text-center text-sm">
        Chưa có gói dịch vụ nào đang mở bán.
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <ServiceImportantNotice />

      {notice && (
        <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="cursor-pointer text-amber-600 transition hover:text-amber-800"
            aria-label="Đóng thông báo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {categories.map((category) => (
        <ServiceCategorySection
          key={category.id}
          category={category}
          onPurchaseAction={() => setNotice('Giỏ hàng và thanh toán sẽ sẵn sàng trong bản cập nhật tới.')}
        />
      ))}

      <p className="text-sm font-medium text-rose-500">{SERVICE_VAT_NOTE}</p>

      <BackToTopButton />

      <ServiceNeedSuggestionModal
        isOpen={isModalOpen}
        onClose={() => setModalClosed(true)}
        onConfirm={scrollToNeed}
        onDismissForever={dismissForever}
      />
    </div>
  );
}
