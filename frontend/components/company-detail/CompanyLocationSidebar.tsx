'use client';

import { MapPin, Navigation } from 'lucide-react';

interface CompanyLocationSidebarProps {
  address: string;
}

export default function CompanyLocationSidebar({ address }: CompanyLocationSidebarProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
      <h3 className="flex items-center gap-1.5 border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
        <MapPin className="text-primary h-4 w-4" />
        <span>Địa điểm công ty</span>
      </h3>

      <div className="mt-3.5">
        <div className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
          <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <span className="font-medium text-slate-700">{address}</span>
        </div>
      </div>
    </div>
  );
}
