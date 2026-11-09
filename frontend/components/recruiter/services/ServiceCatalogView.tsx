'use client';

import Spinner from '@/components/common/Spinner';
import BackToTopButton from '@/components/recruiter/services/BackToTopButton';
import ServiceCategorySection from '@/components/recruiter/services/ServiceCategorySection';
import ServiceImportantNotice from '@/components/recruiter/services/ServiceImportantNotice';
import ServiceNeedSuggestionModal from '@/components/recruiter/services/ServiceNeedSuggestionModal';
import { SERVICE_CATEGORY_ANCHOR_PREFIX, SERVICE_VAT_NOTE } from '@/constants/service-package';
import { useAddToCart } from '@/hooks/useRecruiterCart';
import { useServiceCatalog } from '@/hooks/useServiceCatalog';
import { useServiceNeedModal } from '@/hooks/useServiceNeedModal';
import type { ServiceNeedKey } from '@/types/service-package';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, Check, X } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function ServiceCatalogView() {
  const { data, isPending, isError, error } = useServiceCatalog();
  const { dismissedForever, dismissForever } = useServiceNeedModal();
  const [modalClosed, setModalClosed] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const router = useRouter();
  const addToCart = useAddToCart();

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
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            {notice}
          </span>
          <span className="flex items-center gap-3">
            <Link href={ROUTES.RECRUITER_CART} className="text-primary font-bold hover:underline">
              Xem giỏ hàng
            </Link>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="cursor-pointer text-emerald-600 transition hover:text-emerald-800"
              aria-label="Đóng thông báo"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        </div>
      )}

      {categories.map((category) => (
        <ServiceCategorySection
          key={category.id}
          category={category}
          isBusy={addToCart.isPending}
          onAddToCart={(item) =>
            addToCart.mutate(
              { packageId: item.id, quantity: 1 },
              {
                onSuccess: () => setNotice(`Đã thêm "${item.name}" vào giỏ hàng.`),
                onError: (cause) => setNotice(getErrorMessage(cause)),
              },
            )
          }
          onBuyNow={(item) =>
            addToCart.mutate(
              { packageId: item.id, quantity: 1 },
              {
                onSuccess: () => router.push(ROUTES.RECRUITER_CART),
                onError: (cause) => setNotice(getErrorMessage(cause)),
              },
            )
          }
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
