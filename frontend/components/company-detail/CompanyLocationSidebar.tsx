'use client';

import { MapPin } from 'lucide-react';

interface CompanyLocationSidebarProps {
  address: string;
}

export default function CompanyLocationSidebar({ address }: CompanyLocationSidebarProps) {
  return (
    <div className="border-outline-variant bg-surface overflow-hidden rounded-2xl border p-6">
      <h3 className="font-display text-title-md text-on-surface font-bold">Company location</h3>

      <p className="text-body-md text-on-surface-variant mt-3 flex items-start gap-2 leading-relaxed">
        <MapPin className="text-primary mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {address}
      </p>
    </div>
  );
}
