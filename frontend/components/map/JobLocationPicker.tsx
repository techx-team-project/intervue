'use client';

import { geocodeAddress } from '@/apiRequest/geocoding';
import { Button } from '@/components/ui/Button';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { toast } from 'sonner';
import type { MapPoint } from './JobLocationPickerMap';

const JobLocationPickerMap = dynamic(() => import('./JobLocationPickerMap'), {
  ssr: false,
  loading: () => <div className="bg-surface-container-low h-64 w-full animate-pulse rounded-xl" />,
});

const COORDINATE_DIGITS = 6;

interface JobLocationPickerProps {
  latitude?: number;
  longitude?: number;
  addressQuery: string;
  onChange: (point: MapPoint | null) => void;
}

function round(value: number) {
  return Number(value.toFixed(COORDINATE_DIGITS));
}

export default function JobLocationPicker({ latitude, longitude, addressQuery, onChange }: JobLocationPickerProps) {
  const [searching, setSearching] = useState(false);
  const value = latitude !== undefined && longitude !== undefined ? { lat: latitude, lng: longitude } : null;

  const select = (point: MapPoint) => onChange({ lat: round(point.lat), lng: round(point.lng) });

  const findByAddress = async () => {
    if (!addressQuery.trim()) {
      toast.info('Nhập địa chỉ hoặc nơi làm việc trước khi tìm trên bản đồ.');
      return;
    }
    setSearching(true);
    try {
      const result = await geocodeAddress(addressQuery.trim());
      if (result) select(result);
      else toast.info('Không tìm thấy địa chỉ này. Bạn hãy bấm trực tiếp lên bản đồ để đặt ghim.');
    } catch {
      toast.error('Không tìm được vị trí lúc này. Bạn hãy bấm trực tiếp lên bản đồ.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-on-surface text-sm font-semibold">Vị trí trên bản đồ (không bắt buộc)</span>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" disabled={searching} onClick={findByAddress}>
            <MapPin className="h-4 w-4" aria-hidden /> {searching ? 'Đang tìm...' : 'Tìm theo địa chỉ'}
          </Button>
          {value && (
            <Button type="button" size="sm" variant="ghost" onClick={() => onChange(null)}>
              Xoá ghim
            </Button>
          )}
        </div>
      </div>
      <JobLocationPickerMap value={value} onChange={select} />
      <p className="text-on-surface-variant text-xs">
        Bấm lên bản đồ hoặc kéo ghim để đặt vị trí. Tin có ghim sẽ hiện trong mục “Việc làm gần tôi” của ứng viên.
      </p>
    </div>
  );
}
