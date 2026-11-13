'use client';

import { ROUTES } from '@/constants/routes';
import { useAdSlots } from '@/hooks/useAds';
import { useAddToCart } from '@/hooks/useRecruiterCart';
import type { AdSlot } from '@/types/ads';
import type { ServicePackageCard as ServicePackageCardType } from '@/types/service-package';
import { getErrorMessage } from '@/utils/error';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export type ServicePackageActionFeedback = {
  type: 'success' | 'error';
  message: string;
};

export type AdPackageModalState = {
  item: ServicePackageCardType;
  slot: AdSlot;
  intent: 'cart' | 'buy';
};

interface UseServicePackageActionsOptions {
  onFeedback?: (feedback: ServicePackageActionFeedback) => void;
  onBuyNowSuccess?: () => void;
}

/** Shared add-to-cart and buy-now handlers for service package card grids. */
export function useServicePackageActions(options: UseServicePackageActionsOptions = {}) {
  const { onFeedback, onBuyNowSuccess } = options;
  const router = useRouter();
  const addToCart = useAddToCart();
  const adSlotsQuery = useAdSlots();

  const [pendingTarget, setPendingTarget] = useState<{ packageId: number; action: 'cart' | 'buy' } | null>(null);
  const [adModal, setAdModal] = useState<AdPackageModalState | null>(null);

  const adSlotsBySlug = useMemo(() => {
    const map = new Map<string, AdSlot>();
    for (const slot of adSlotsQuery.data ?? []) {
      if (slot.active && slot.packageSlug) {
        map.set(slot.packageSlug, slot);
      }
    }
    return map;
  }, [adSlotsQuery.data]);

  const handleAddToCart = (item: ServicePackageCardType) => {
    const matchedSlot = adSlotsBySlug.get(item.slug);
    if (matchedSlot) {
      setAdModal({ item, slot: matchedSlot, intent: 'cart' });
      return;
    }

    setPendingTarget({ packageId: item.id, action: 'cart' });
    addToCart.mutate(
      { packageId: item.id, quantity: 1 },
      {
        onSuccess: () => {
          const message = `Added "${item.name}" to cart.`;
          onFeedback?.({ type: 'success', message });
          toast.success(message);
        },
        onError: (cause) => {
          const message = getErrorMessage(cause);
          onFeedback?.({ type: 'error', message });
          toast.error(message);
        },
        onSettled: () => setPendingTarget(null),
      },
    );
  };

  const handleBuyNow = (item: ServicePackageCardType) => {
    const matchedSlot = adSlotsBySlug.get(item.slug);
    if (matchedSlot) {
      setAdModal({ item, slot: matchedSlot, intent: 'buy' });
      return;
    }

    setPendingTarget({ packageId: item.id, action: 'buy' });
    addToCart.mutate(
      { packageId: item.id, quantity: 1 },
      {
        onSuccess: () => {
          if (onBuyNowSuccess) {
            onBuyNowSuccess();
          } else {
            router.push(ROUTES.RECRUITER_CART);
          }
        },
        onError: (cause) => {
          const message = getErrorMessage(cause);
          onFeedback?.({ type: 'error', message });
          toast.error(message);
        },
        onSettled: () => setPendingTarget(null),
      },
    );
  };

  return {
    adSlotsBySlug,
    pendingTarget,
    adModal,
    closeAdModal: () => setAdModal(null),
    handleAddToCart,
    handleBuyNow,
  };
}
