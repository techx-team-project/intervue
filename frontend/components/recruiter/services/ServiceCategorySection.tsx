import ServicePackageCard from '@/components/recruiter/services/ServicePackageCard';
import { SERVICE_CATEGORY_ANCHOR_PREFIX } from '@/constants/service-package';
import { cn } from '@/lib/utils';
import type { ServiceCategory, ServicePackageCard as ServicePackageCardType } from '@/types/service-package';
import { Sparkles } from 'lucide-react';

interface ServiceCategorySectionProps {
  category: ServiceCategory;
  onAddToCart: (item: ServicePackageCardType) => void;
  onBuyNow: (item: ServicePackageCardType) => void;
  isBusy: boolean;
  isSuggested?: boolean;
}

export default function ServiceCategorySection({
  category,
  onAddToCart,
  onBuyNow,
  isBusy,
  isSuggested = false,
}: ServiceCategorySectionProps) {
  return (
    <section
      id={`${SERVICE_CATEGORY_ANCHOR_PREFIX}${category.code}`}
      className={cn(
        'scroll-mt-[calc(var(--recruiter-sticky-top,4.5rem)+1.5rem)] transition-colors',
        isSuggested && 'rounded-2xl border border-emerald-300 bg-emerald-50/35 p-4 sm:p-5',
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex flex-wrap items-center gap-2 text-lg font-bold sm:text-xl">
          <span className="text-primary">{category.name}</span>
          <span className="text-outline-variant" aria-hidden>
            |
          </span>
          <span className="text-on-surface">{category.headline}</span>
        </h2>

        {isSuggested && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            <Sparkles className="h-3 w-3" />
            Gợi ý phù hợp
          </span>
        )}
      </div>

      {category.description && (
        <p className="text-on-surface-variant mt-1.5 text-sm leading-relaxed">{category.description}</p>
      )}

      <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {category.packages.map((item) => (
          <ServicePackageCard key={item.id} item={item} onAddToCart={onAddToCart} onBuyNow={onBuyNow} isBusy={isBusy} />
        ))}
      </div>
    </section>
  );
}
