import { ROUTES } from '@/constants/routes';
import type { SuggestedServicePackage } from '@/types/recruiter';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

interface SuggestedServicePackagesProps {
  services: SuggestedServicePackage[];
}

export default function SuggestedServicePackages({ services }: SuggestedServicePackagesProps) {
  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-7">
      <div className="flex items-center justify-between">
        <h2 className="text-navy text-[16px] font-bold">Suggested packages</h2>
        <Link href={ROUTES.RECRUITER_SERVICES} className="text-primary text-[12.5px] font-bold hover:underline">
          View all
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="mt-4 text-[13px] text-[#64748b]">No suggested packages right now.</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className="rounded-xl border border-[#e9eaec] p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary h-4 w-4" />
                <h3 className="text-navy text-[13.5px] font-bold">{service.name}</h3>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#64748b]">{service.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-primary text-[14px] font-black">{service.priceLabel}</span>
                {service.highlight && <span className="text-[11px] text-[#94a3b8]">{service.highlight}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
