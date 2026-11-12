'use client';

import Spinner from '@/components/common/Spinner';
import AdPackageWeeksModal from '@/components/recruiter/services/AdPackageWeeksModal';
import BackToTopButton from '@/components/recruiter/services/BackToTopButton';
import ServiceCategorySection from '@/components/recruiter/services/ServiceCategorySection';
import ServiceImportantNotice from '@/components/recruiter/services/ServiceImportantNotice';
import ServiceNeedSuggestionModal from '@/components/recruiter/services/ServiceNeedSuggestionModal';
import { ROUTES } from '@/constants/routes';
import { SERVICE_CATEGORY_ANCHOR_PREFIX, SERVICE_NEED_OPTIONS, SERVICE_VAT_NOTE } from '@/constants/service-package';
import { useServiceCatalog } from '@/hooks/useServiceCatalog';
import { useServiceNeedModal } from '@/hooks/useServiceNeedModal';
import { useServicePackageActions, type ServicePackageActionFeedback } from '@/hooks/useServicePackageActions';
import { cn } from '@/lib/utils';
import type { ServiceNeedKey } from '@/types/service-package';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, Check, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function ServiceCatalogView() {
  const { data, isPending, isError, error } = useServiceCatalog();
  const { dismissedForever, dismissForever } = useServiceNeedModal();

  const [autoModalClosed, setAutoModalClosed] = useState(false);
  const [suggestedNeed, setSuggestedNeed] = useState<ServiceNeedKey | null>(null);
  const [feedback, setFeedback] = useState<ServicePackageActionFeedback | null>(null);

  const { adSlotsBySlug, pendingTarget, adModal, closeAdModal, handleAddToCart, handleBuyNow } =
    useServicePackageActions({ onFeedback: setFeedback });

  const categories = useMemo(() => data?.categories ?? [], [data?.categories]);

  const availableNeedKeys = useMemo(() => {
    const keys = new Set<ServiceNeedKey>();
    for (const category of categories) {
      if (category.needKey) keys.add(category.needKey);
    }
    return keys;
  }, [categories]);

  const suggestedCategories = useMemo(
    () => (suggestedNeed ? categories.filter((category) => category.needKey === suggestedNeed) : []),
    [categories, suggestedNeed],
  );

  const isModalOpen = !dismissedForever && !autoModalClosed && categories.length > 0;

  useEffect(() => {
    if (categories.length === 0) return;
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash.startsWith(SERVICE_CATEGORY_ANCHOR_PREFIX)) return;
    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [categories]);

  const scrollToCategoryCode = (code: string) => {
    window.requestAnimationFrame(() => {
      document
        .getElementById(`${SERVICE_CATEGORY_ANCHOR_PREFIX}${code}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleConfirmNeed = (need: ServiceNeedKey) => {
    setAutoModalClosed(true);
    const matches = categories.filter((category) => category.needKey === need);
    if (matches.length === 0) {
      toast.info('No category matches the need you selected yet.');
      return;
    }

    setSuggestedNeed(need);
    scrollToCategoryCode(matches[0].code);
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
      <div className="border-outline-variant text-on-surface-variant rounded-xl border border-dashed bg-white px-6 py-16 text-center text-sm">
        No service packages are currently available.
      </div>
    );
  }

  const suggestedNeedLabel = SERVICE_NEED_OPTIONS.find((item) => item.key === suggestedNeed)?.label;

  return (
    <div className="space-y-8 pb-20">
      <ServiceImportantNotice />

      {suggestedNeed && suggestedCategories.length > 0 && (
        <div className="flex flex-col gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-950 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>Suggested for your need: {suggestedNeedLabel}</span>
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-emerald-800/80">Matching group:</span>
              {suggestedCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => scrollToCategoryCode(category.code)}
                  className="cursor-pointer rounded-full border border-emerald-300 bg-white px-2.5 py-0.5 font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSuggestedNeed(null)}
            aria-label="Hide suggestion"
            className="cursor-pointer self-end rounded p-1 text-emerald-700 transition hover:bg-emerald-100 sm:self-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {feedback && (
        <div
          role={feedback.type === 'error' ? 'alert' : 'status'}
          className={cn(
            'flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold',
            feedback.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-rose-200 bg-rose-50 text-rose-800',
          )}
        >
          <span className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            )}
            {feedback.message}
          </span>
          <span className="flex items-center gap-3">
            {feedback.type === 'success' && (
              <Link href={ROUTES.RECRUITER_CART} className="text-primary font-bold hover:underline">
                View cart
              </Link>
            )}
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="cursor-pointer opacity-70 transition hover:opacity-100"
              aria-label="Dismiss notification"
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
          adSlotsBySlug={adSlotsBySlug}
          pendingTarget={pendingTarget}
          isSuggested={suggestedNeed !== null && category.needKey === suggestedNeed}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      ))}

      <p className="text-sm font-medium text-rose-500">{SERVICE_VAT_NOTE}</p>

      <BackToTopButton />

      {isModalOpen && (
        <ServiceNeedSuggestionModal
          isOpen
          onClose={() => setAutoModalClosed(true)}
          onConfirm={handleConfirmNeed}
          onDismissForever={dismissForever}
          availableNeedKeys={availableNeedKeys}
          allowDismissForever={!dismissedForever}
        />
      )}

      {adModal && (
        <AdPackageWeeksModal
          key={`${adModal.item.id}-${adModal.intent}`}
          isOpen
          onClose={closeAdModal}
          slot={adModal.slot}
          packageItem={adModal.item}
          intent={adModal.intent}
          onAddedToCart={(message) => setFeedback({ type: 'success', message })}
        />
      )}
    </div>
  );
}
