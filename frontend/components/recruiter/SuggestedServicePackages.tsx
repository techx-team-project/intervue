import { ROUTES } from '@/constants/routes';
import type { SuggestedServicePackage } from '@/types/recruiter';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

interface SuggestedServicePackagesProps {
  services: SuggestedServicePackage[];
}

export default function SuggestedServicePackages({ services }: SuggestedServicePackagesProps) {
  return (
    <div className="border-outline-variant rounded-2xl border bg-white p-6 shadow-xs sm:p-7">
      <div className="flex items-center justify-between">
        <h2 className="text-navy text-body-lg font-bold">Suggested packages</h2>
        <Link href={ROUTES.RECRUITER_SERVICES} className="text-primary text-body-sm font-bold hover:underline">
          View all
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="text-body-md text-on-surface-variant mt-4">No suggested packages right now.</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className="border-outline-variant rounded-xl border p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary h-4 w-4" />
                <h3 className="text-navy text-body-md font-bold">{service.name}</h3>
              </div>
              <p className="text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">{service.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-primary text-body-md font-bold">{service.priceLabel}</span>
                {service.highlight && <span className="text-label-sm text-outline">{service.highlight}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
