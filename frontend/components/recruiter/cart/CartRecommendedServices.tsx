'use client';

import Spinner from '@/components/common/Spinner';
import CartImportantNote from '@/components/recruiter/cart/CartImportantNote';
import AdPackageWeeksModal from '@/components/recruiter/services/AdPackageWeeksModal';
import ServiceCategorySection from '@/components/recruiter/services/ServiceCategorySection';
import { SERVICE_VAT_NOTE } from '@/constants/service-package';
import { useServiceCatalog } from '@/hooks/useServiceCatalog';
import { useServicePackageActions } from '@/hooks/useServicePackageActions';
import { toast } from 'sonner';

/**
 * Displays recommended packages from the highest-priority active category when the recruiter cart is empty, paired with
 * the payment security notice.
 */
export default function CartRecommendedServices() {
  const { data, isPending, isError } = useServiceCatalog();
  const topCategory = data?.categories[0] ?? null;

  const { adSlotsBySlug, pendingTarget, adModal, closeAdModal, handleAddToCart, handleBuyNow } =
    useServicePackageActions({
      onBuyNowSuccess: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });

  if (isError) {
    return null;
  }

  return (
    <section className="space-y-4 pt-2" aria-labelledby="cart-recommended-services-heading">
      <h2 id="cart-recommended-services-heading" className="text-primary text-xl font-bold sm:text-[22px]">
        Dịch vụ đề xuất
      </h2>

      <CartImportantNote size="comfortable" />

      {isPending ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        topCategory && (
          <div className="space-y-4 pt-1">
            <ServiceCategorySection
              category={topCategory}
              adSlotsBySlug={adSlotsBySlug}
              pendingTarget={pendingTarget}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
            <p className="text-sm font-medium text-rose-500">{SERVICE_VAT_NOTE}</p>
          </div>
        )
      )}

      {adModal && (
        <AdPackageWeeksModal
          key={`${adModal.item.id}-${adModal.intent}`}
          isOpen
          onClose={closeAdModal}
          slot={adModal.slot}
          packageItem={adModal.item}
          intent={adModal.intent}
          onAddedToCart={(message) => toast.success(message)}
        />
      )}
    </section>
  );
}
