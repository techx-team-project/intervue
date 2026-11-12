import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { SuggestedServicePackage } from '@/types/recruiter';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SuggestedServicePackagesProps {
  services: SuggestedServicePackage[];
}

export default function SuggestedServicePackages({ services }: SuggestedServicePackagesProps) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-navy text-body-lg font-bold">Gói dịch vụ gợi ý</h2>
        <Link href={ROUTES.RECRUITER_SERVICES} className="text-primary text-body-sm font-semibold hover:underline">
          Xem tất cả
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="text-body-md text-on-surface-variant mt-4">Chưa có gói nào được gợi ý.</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {services.map((service, index) => {
            const isFeatured = index === 0;

            return (
              <Link
                key={service.id}
                href={ROUTES.RECRUITER_SERVICES}
                className={cn(
                  'group flex flex-col rounded-xl border p-6 transition',
                  isFeatured
                    ? 'bg-primary-deep border-primary-deep text-white'
                    : 'border-outline-variant hover:border-navy bg-white',
                )}
              >
                {service.highlight && (
                  <span
                    className={cn(
                      'text-label-sm w-fit font-semibold tracking-wide uppercase',
                      isFeatured ? 'text-primary-bright' : 'text-primary',
                    )}
                  >
                    {service.highlight}
                  </span>
                )}
                <h3 className={cn('text-lg font-bold', service.highlight && 'mt-1', !isFeatured && 'text-navy')}>
                  {service.name}
                </h3>
                <p
                  className={cn(
                    'text-body-sm mt-1.5 leading-relaxed',
                    isFeatured ? 'text-white/75' : 'text-on-surface-variant',
                  )}
                >
                  {service.description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className={cn('text-body-lg font-bold tabular-nums', !isFeatured && 'text-navy')}>
                    {service.priceLabel}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
