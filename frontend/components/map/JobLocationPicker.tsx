'use client';

import { geocodeAddress } from '@/apiRequest/geocoding';
import { Button } from '@/components/ui/Button';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { MapPoint } from './JobLocationPickerMap';

const JobLocationPickerMap = dynamic(() => import('./JobLocationPickerMap'), {
  ssr: false,
  loading: () => <div className="bg-surface-container-low h-64 w-full animate-pulse rounded-xl" />,
});

const COORDINATE_DIGITS = 6;
const AUTO_SEARCH_DELAY_MS = 1500;

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
  const trimmedQuery = addressQuery.trim();
  const value = latitude !== undefined && longitude !== undefined ? { lat: latitude, lng: longitude } : null;

  const select = (point: MapPoint) => onChange({ lat: round(point.lat), lng: round(point.lng) });

  const debouncedQuery = useDebouncedValue(trimmedQuery, AUTO_SEARCH_DELAY_MS);
  const lastAutoQuery = useRef(debouncedQuery);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    if (debouncedQuery === lastAutoQuery.current) return;
    lastAutoQuery.current = debouncedQuery;
    if (!debouncedQuery) return;
    const controller = new AbortController();
    geocodeAddress(debouncedQuery, controller.signal)
      .then((result) => {
        if (result) onChangeRef.current({ lat: round(result.lat), lng: round(result.lng) });
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [debouncedQuery]);

  const findByAddress = async () => {
    setSearching(true);
    try {
      const result = await geocodeAddress(trimmedQuery);
      if (result) select(result);
      else toast.info('Address not found. Click the map to drop a pin instead.');
    } catch {
      toast.error('Could not find the location right now. Click the map directly.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-on-surface text-sm font-semibold">Map location (optional)</span>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={searching || trimmedQuery === ''}
            onClick={findByAddress}
            leftIcon={<MapPin className="h-4 w-4" aria-hidden />}
          >
            {searching ? 'Searching...' : 'Search by address'}
          </Button>
          {value && (
            <Button type="button" size="sm" variant="ghost" onClick={() => onChange(null)}>
              Remove pin
            </Button>
          )}
        </div>
      </div>
      <JobLocationPickerMap value={value} onChange={select} />
      <p className="text-on-surface-variant text-xs">
        Click the map or drag the pin to set the location. Jobs with a pin appear in candidates&apos; &ldquo;Jobs near
        me&rdquo; section.
      </p>
    </div>
  );
}
