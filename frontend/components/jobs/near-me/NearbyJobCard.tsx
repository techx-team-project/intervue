'use client';

import CompanyLogo from '@/components/jobs/CompanyLogo';
import { JobStatusBadges } from '@/components/jobs/listing/JobCardParts';
import { cn } from '@/lib/utils';
import type { NearbyJobResource, PublicJobSummaryResource } from '@/types/public-job';
import { formatSalary } from '@/utils/public-company';
import { jobFacts } from '@/utils/public-job';
import { ArrowUpRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const MAX_FACT_TAGS = 2;

type NearbyJobCardProps = {
  item: NearbyJobResource;
  isSelected: boolean;
  onSelect: (jobId: number) => void;
  onQuickView: (job: PublicJobSummaryResource) => void;
};

export default function NearbyJobCard({ item, isSelected, onSelect, onQuickView }: NearbyJobCardProps) {
  const { job } = item;
  const ref = useRef<HTMLElement>(null);
  const facts = jobFacts(job).slice(1, 1 + MAX_FACT_TAGS);

  useEffect(() => {
    if (isSelected) ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [isSelected]);

  return (
    <article
      ref={ref}
      className={cn(
        'bg-surface ease-standard rounded-2xl border transition-colors duration-200',
        isSelected ? 'border-primary bg-primary-light' : 'border-outline-variant hover:border-primary/50',
      )}
    >
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={() => onSelect(job.id)}
        className="flex w-full cursor-pointer gap-3 p-4 text-left"
      >
        <CompanyLogo name={job.company.name} src={job.company.logoUrl} className="h-12 w-12 rounded-lg" />
        <span className="min-w-0 flex-1 space-y-2">
          <span className="block">
            <span className="text-label-md text-on-surface-variant block truncate font-semibold tracking-wider uppercase">
              {job.company.name}
            </span>
            <span className="font-display text-title-md text-on-surface mt-0.5 line-clamp-2 block font-bold">
              <JobStatusBadges job={job} />
              {job.title}
            </span>
          </span>
          <span className="flex flex-wrap gap-2">
            <span className="bg-primary-container text-on-primary-container text-label-lg flex items-center gap-1 rounded-full px-3 py-1 font-semibold">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {item.distanceKm} km
            </span>
            {facts.map((fact) => (
              <span
                key={fact}
                className="bg-surface-container-low text-label-lg text-on-surface-variant rounded-full px-3 py-1"
              >
                {fact}
              </span>
            ))}
          </span>
          {item.address && <span className="text-body-sm text-on-surface-variant block truncate">{item.address}</span>}
        </span>
      </button>

      <div className="border-outline-variant flex items-center justify-between gap-3 border-t px-4 py-3">
        <p className="font-display text-title-md text-primary font-bold">{formatSalary(job.salary)}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onQuickView(job)}
            className="text-label-lg text-on-surface-variant hover:text-primary cursor-pointer font-semibold transition-colors hover:underline"
          >
            Quick view
          </button>
          <Link
            href={`/jobs/${job.id}`}
            aria-label={`Open ${job.title}`}
            className="border-outline-variant text-outline hover:bg-primary hover:border-primary flex h-8 w-8 items-center justify-center rounded-full border transition-colors hover:text-white"
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
