'use client';

import { MapPin, Navigation } from 'lucide-react';

interface CompanyLocationSidebarProps {
  address: string;
  mapEmbedUrl?: string;
}

export default function CompanyLocationSidebar({ address, mapEmbedUrl }: CompanyLocationSidebarProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
      <h3 className="flex items-center gap-1.5 border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
        <MapPin className="h-4 w-4 text-[#00b14f]" />
        <span>Địa điểm công ty</span>
      </h3>

      <div className="mt-3.5">
        <div className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
          <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <span className="font-medium text-slate-700">{address}</span>
        </div>

        {/* Map Embed Container */}
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {mapEmbedUrl ? (
            <iframe
              title="Company Location Map"
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={mapEmbedUrl}
            />
          ) : (
            <div className="flex h-44 w-full items-center justify-center text-xs text-slate-400">
              Bản đồ đang được cập nhật
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
