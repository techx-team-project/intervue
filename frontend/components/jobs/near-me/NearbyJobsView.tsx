'use client';

import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/Button';
import { MAP_DEFAULT_CENTER, NEARBY_DEFAULT_RADIUS_KM, NEARBY_RADIUS_OPTIONS } from '@/constants/map';
import { useNearbyJobs } from '@/hooks/useNearbyJobs';
import { cn } from '@/lib/utils';
import { formatSalary } from '@/utils/public-company';
import { getErrorMessage } from '@/utils/error';
import { LocateFixed } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import type { MapOrigin } from './NearbyJobsMap';

const NearbyJobsMap = dynamic(() => import('./NearbyJobsMap'), {
  ssr: false,
  loading: () => <div className="bg-surface-container-low h-full min-h-96 w-full animate-pulse rounded-2xl" />,
});

export default function NearbyJobsView() {
  const [origin, setOrigin] = useState<MapOrigin>({ ...MAP_DEFAULT_CENTER });
  const [radiusKm, setRadiusKm] = useState<number>(NEARBY_DEFAULT_RADIUS_KM);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const { data: jobs = [], isLoading, isError, error, refetch } = useNearbyJobs({ ...origin, radiusKm });

  const moveOrigin = (next: MapOrigin) => {
    setSelectedJobId(null);
    setOrigin({ lat: Number(next.lat.toFixed(5)), lng: Number(next.lng.toFixed(5)) });
  };

  const locateMe = () => {
    if (!navigator.geolocation) {
      toast.info('Trình duyệt không hỗ trợ định vị. Bạn hãy bấm lên bản đồ để chọn vị trí.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        moveOrigin({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocating(false);
        toast.info('Không lấy được vị trí của bạn. Hãy cho phép định vị hoặc bấm lên bản đồ để chọn.');
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  return (
    <div className="container-page space-y-4 py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Việc làm gần tôi</h1>
          <p className="mt-1 text-sm text-slate-500">
            Bấm “Vị trí của tôi” hoặc bấm lên bản đồ để chọn nơi bạn muốn tìm việc quanh đó.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" disabled={locating} onClick={locateMe}>
            <LocateFixed className="h-4 w-4" aria-hidden /> {locating ? 'Đang định vị...' : 'Vị trí của tôi'}
          </Button>
          <div className="flex gap-1.5" role="group" aria-label="Bán kính tìm kiếm">
            {NEARBY_RADIUS_OPTIONS.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={radiusKm === value}
                onClick={() => setRadiusKm(value)}
                className={cn(
                  'cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                  radiusKm === value
                    ? 'border-primary bg-primary text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                )}
              >
                {value} km
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <section
          aria-label="Danh sách việc làm gần bạn"
          className="order-2 space-y-2 lg:order-1 lg:max-h-[34rem] lg:overflow-y-auto"
        >
          {isLoading && (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          )}
          {isError && (
            <div className="space-y-3 py-8 text-center">
              <p className="text-sm font-semibold text-slate-700">{getErrorMessage(error)}</p>
              <Button variant="outline" onClick={() => refetch()}>
                Thử lại
              </Button>
            </div>
          )}
          {!isLoading && !isError && jobs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-10 text-center">
              <p className="text-sm font-semibold text-slate-700">Chưa có tin nào trong bán kính {radiusKm} km</p>
              <p className="mt-1 text-xs text-slate-500">Thử tăng bán kính hoặc chọn một vị trí khác trên bản đồ.</p>
              <Link href="/jobs" className="mt-4 inline-block">
                <Button size="sm">Xem tất cả việc làm</Button>
              </Link>
            </div>
          )}
          {jobs.map((item) => (
            <article
              key={item.job.id}
              className={cn(
                'rounded-xl border bg-white p-3 transition-colors',
                item.job.id === selectedJobId ? 'border-primary bg-primary-light' : 'border-transparent',
              )}
            >
              <button
                type="button"
                onClick={() => setSelectedJobId(item.job.id)}
                className="block w-full cursor-pointer text-left"
              >
                <p className="line-clamp-2 text-sm font-bold text-slate-900">{item.job.title}</p>
                <p className="mt-0.5 truncate text-xs text-slate-600">{item.job.company.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {formatSalary(item.job.salary)} · cách {item.distanceKm} km
                </p>
                {item.address && <p className="mt-0.5 truncate text-xs text-slate-400">{item.address}</p>}
              </button>
              <Link
                href={`/jobs/${item.job.id}`}
                className="text-primary mt-1 inline-block text-xs font-semibold hover:underline"
              >
                Xem chi tiết
              </Link>
            </article>
          ))}
        </section>

        <div className="order-1 h-[28rem] lg:order-2 lg:h-[34rem]">
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
  );
}
