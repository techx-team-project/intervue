'use client';

import { MapPin, Navigation } from 'lucide-react';

interface CompanyLocationSidebarProps {
  address: string;
}

export default function CompanyLocationSidebar({ address }: CompanyLocationSidebarProps) {
  return (
    <div className="border-outline-variant/90 overflow-hidden rounded-2xl border bg-white p-5 shadow-2xs">
      <h3 className="border-outline-variant text-on-surface flex items-center gap-1.5 border-b pb-3 text-sm font-bold">
        <MapPin className="text-primary h-4 w-4" />
        <span>Địa điểm công ty</span>
      </h3>

      <div className="mt-3.5">
        <div className="text-on-surface-variant flex items-start gap-2 text-xs leading-relaxed">
          <Navigation className="text-outline mt-0.5 h-4 w-4 shrink-0" />
          <span className="text-on-surface font-medium">{address}</span>
        </div>
      </div>
    </div>
  );
}
