'use client';

import { geocodeAddress } from '@/apiRequest/geocoding';
import { Button, buttonClassName } from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import FilterChipGroup from '@/components/jobs/listing/FilterChipGroup';
import JobQuickView from '@/components/jobs/listing/JobQuickView';
import { MAP_DEFAULT_CENTER, NEARBY_DEFAULT_RADIUS_KM, NEARBY_RADIUS_OPTIONS } from '@/constants/map';
import { useNearbyJobs } from '@/hooks/useNearbyJobs';
import type { PublicJobSummaryResource } from '@/types/public-job';
import { getErrorMessage } from '@/utils/error';
import { MapPinOff } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import NearbyJobCard from './NearbyJobCard';
import type { MapOrigin } from './NearbyJobsMap';
import NearbySearchBar from './NearbySearchBar';

const NearbyJobsMap = dynamic(() => import('./NearbyJobsMap'), {
  ssr: false,
  loading: () => <Skeleton className="h-full min-h-80 w-full rounded-2xl" />,
});

const RADIUS_CHOICES = NEARBY_RADIUS_OPTIONS.map((value) => ({ value: String(value), label: `${value} km` }));
const SKELETON_COUNT = 4;
const COORDINATE_DIGITS = 5;
const LOCATE_TIMEOUT_MS = 10_000;

export default function NearbyJobsView() {
  const [origin, setOrigin] = useState<MapOrigin>({ ...MAP_DEFAULT_CENTER });
  const [radiusKm, setRadiusKm] = useState<number>(NEARBY_DEFAULT_RADIUS_KM);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [quickViewJob, setQuickViewJob] = useState<PublicJobSummaryResource | null>(null);
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const { data: jobs = [], isLoading, isError, error, refetch } = useNearbyJobs({ ...origin, radiusKm });
  const closeQuickView = useCallback(() => setQuickViewJob(null), []);

  const moveOrigin = (next: MapOrigin) => {
    setSelectedJobId(null);
    setOrigin({ lat: Number(next.lat.toFixed(COORDINATE_DIGITS)), lng: Number(next.lng.toFixed(COORDINATE_DIGITS)) });
  };

  const searchAddress = async () => {
    const query = address.trim();
    if (!query) return;
    setIsSearching(true);
    try {
      const result = await geocodeAddress(query);
      if (result) moveOrigin(result);
      else toast.info('We could not find that address. Try a more specific one or click the map.');
    } catch {
      toast.error('Address search is unavailable right now. Please click the map instead.');
    } finally {
      setIsSearching(false);
    }
  };

  const locateMe = () => {
    if (!navigator.geolocation) {
      toast.info('Your browser does not support location. Click the map to pick a spot.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        moveOrigin({ lat: position.coords.latitude, lng: position.coords.longitude });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        toast.info('We could not get your location. Allow location access or click the map to pick a spot.');
      },
      { enableHighAccuracy: false, timeout: LOCATE_TIMEOUT_MS },
    );
  };

  return (
    <>
      <NearbySearchBar
        address={address}
        isSearching={isSearching}
        isLocating={isLocating}
        onAddressChange={setAddress}
        onSearch={searchAddress}
        onLocate={locateMe}
      />

      <div className="container-page space-y-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="nearby-results-title" className="font-display text-title-lg text-on-surface font-bold">
              {isLoading ? 'Searching…' : `${jobs.length} ${jobs.length === 1 ? 'job' : 'jobs'} within ${radiusKm} km`}
            </h2>
            <p className="text-body-md text-on-surface-variant mt-0.5">
              Click anywhere on the map to move the search center.
            </p>
          </div>
          <FilterChipGroup
            ariaLabel="Search radius"
            allowClear={false}
            options={RADIUS_CHOICES}
            value={String(radiusKm)}
            onChange={(value) => setRadiusKm(Number(value))}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[26rem_minmax(0,1fr)]">
          <section
            aria-labelledby="nearby-results-title"
            className="scrollbar-on-hover order-2 space-y-3 lg:order-1 lg:max-h-[calc(100dvh-15rem)] lg:overflow-y-auto lg:pr-1"
          >
            {isLoading &&
              Array.from({ length: SKELETON_COUNT }, (_, index) => (
                <Skeleton key={index} className="h-36 w-full rounded-2xl" />
              ))}

            {isError && (
              <div className="border-error/30 bg-error/10 flex flex-col items-center gap-3 rounded-2xl border px-6 py-10 text-center">
                <p className="text-error text-sm font-semibold">{getErrorMessage(error)}</p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Try again
                </Button>
              </div>
            )}

            {!isLoading && !isError && jobs.length === 0 && (
              <div className="bg-surface border-outline-variant flex flex-col items-center gap-3 rounded-2xl border px-6 py-12 text-center">
                <MapPinOff className="text-outline h-9 w-9" aria-hidden />
                <p className="text-title-md text-on-surface font-semibold">No jobs within {radiusKm} km</p>
                <p className="text-body-md text-on-surface-variant max-w-xs">
                  Try a bigger radius or pick another spot on the map.
                </p>
                <Link href="/jobs" className={buttonClassName({ variant: 'outline', size: 'md' })}>
                  Browse all jobs
                </Link>
              </div>
            )}

            {jobs.map((item) => (
              <NearbyJobCard
                key={item.job.id}
                item={item}
                isSelected={item.job.id === selectedJobId}
                onSelect={setSelectedJobId}
                onQuickView={setQuickViewJob}
              />
            ))}
          </section>

          <div className="border-outline-variant order-1 h-80 overflow-hidden rounded-2xl border lg:sticky lg:top-24 lg:order-2 lg:h-[calc(100dvh-15rem)]">
            <NearbyJobsMap
              origin={origin}
              radiusKm={radiusKm}
              jobs={jobs}
              selectedJobId={selectedJobId}
              onSelect={setSelectedJobId}
              onOriginChange={moveOrigin}
            />
          </div>
        </div>
      </div>

      <JobQuickView job={quickViewJob} onClose={closeQuickView} />
    </>
  );
}
