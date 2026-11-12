'use client';

import Link from 'next/link';
import { ArrowRight, RefreshCw } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import RecommendedJobCard from './RecommendedJobCard';
import ProfileNudgeBanner from './ProfileNudgeBanner';

interface RecommendedJobsSectionProps {
  limit?: number;
  showViewAll?: boolean;
  className?: string;
}

export default function RecommendedJobsSection({
  limit = 6,
  showViewAll = true,
  className = '',
}: RecommendedJobsSectionProps) {
  const { data, isLoading, isError, refetch } = useJobRecommendations(limit);

  const items = data?.items ?? [];
  const isFallback = Boolean(data?.fallback);
  const nudgeMessage = data?.nudgeMessage;
  const nudgeActionUrl = data?.nudgeActionUrl ?? '/candidate/profile';

  return (
    <section aria-labelledby="recommended-jobs-title" className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 id="recommended-jobs-title" className="font-display text-display-sm sm:text-display-md text-on-surface">
            {isFallback ? 'Latest Job Opportunities' : 'Recommended for You'}
          </h2>
          <p className="text-title-sm text-on-surface-variant font-normal">
            {isFallback
              ? 'Hand-picked newest openings waiting for applicants across tech hubs'
              : 'Matched specifically with your skills, target role and location preferences'}
          </p>
        </div>

        {showViewAll && (
          <Link
            href="/jobs"
            className="text-title-md text-primary inline-flex items-center gap-1.5 font-semibold transition hover:underline"
          >
            <span>Explore all jobs</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Fallback nudge banner */}
      {isFallback && nudgeMessage && <ProfileNudgeBanner message={nudgeMessage} actionUrl={nudgeActionUrl} />}

      {/* Loading & Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit }, (_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="border-outline-variant bg-surface flex flex-col items-center justify-center rounded-2xl border p-8 text-center">
          <p className="text-body-md text-on-surface-variant">Could not load recommendations at this time.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-label-md text-primary mt-3 inline-flex items-center gap-2 font-bold hover:underline"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try again</span>
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="border-outline-variant bg-surface text-body-md text-on-surface-variant rounded-2xl border p-8 text-center">
          No job recommendations available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <RecommendedJobCard key={item.job.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
