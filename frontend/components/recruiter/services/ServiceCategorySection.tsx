import ServicePackageCard from '@/components/recruiter/services/ServicePackageCard';
import { SERVICE_CATEGORY_ANCHOR_PREFIX } from '@/constants/service-package';
import type { ServiceCategory, ServicePackageCard as ServicePackageCardType } from '@/types/service-package';

interface ServiceCategorySectionProps {
  category: ServiceCategory;
  onPurchaseAction: (item: ServicePackageCardType) => void;
}

export default function ServiceCategorySection({ category, onPurchaseAction }: ServiceCategorySectionProps) {
  return (
    <section id={`${SERVICE_CATEGORY_ANCHOR_PREFIX}${category.code}`} className="scroll-mt-24">
      <h2 className="flex flex-wrap items-center gap-2 text-lg font-bold sm:text-xl">
        <span className="text-primary">{category.name}</span>
        <span className="text-outline-variant" aria-hidden>
          |
        </span>
        <span className="text-on-surface">{category.headline}</span>
      </h2>
      {category.description && (
        <p className="text-on-surface-variant mt-1.5 text-sm leading-relaxed">{category.description}</p>
      )}

      <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {category.packages.map((item) => (
          <ServicePackageCard key={item.id} item={item} onPurchaseAction={onPurchaseAction} />
        ))}
      </div>
    </section>
  );
}
