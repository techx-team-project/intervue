'use client';

import FeaturedJobCard from '@/components/home/featured-jobs/FeaturedJobCard';
import Skeleton from '@/components/ui/Skeleton';
import type { PublicJobResource, PublicJobSummaryResource } from '@/types/public-job';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

type RelatedJobsSectionProps = {
  job: PublicJobResource;
  similar: PublicJobSummaryResource[];
  sameCompany: PublicJobSummaryResource[];
  isLoading: boolean;
};

const SKELETON_COUNT = 4;

function JobGrid({ jobs }: { jobs: PublicJobSummaryResource[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {jobs.map((item) => (
        <li key={item.id}>
          <FeaturedJobCard job={item} />
        </li>
      ))}
    </ul>
  );
}

export default function RelatedJobsSection({ job, similar, sameCompany, isLoading }: RelatedJobsSectionProps) {
  if (!isLoading && similar.length === 0 && sameCompany.length === 0) return null;

  return (
    <section id="related" aria-label="Related jobs" className="scroll-mt-32 space-y-8 pt-4">
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <Skeleton key={index} className="h-52 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          {similar.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-title-lg text-on-surface font-bold">Similar jobs you may like</h2>
              <JobGrid jobs={similar} />
            </div>
          )}
          {sameCompany.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-end justify-between gap-3">
                <h2 className="font-display text-title-lg text-on-surface font-bold">
                  More jobs at {job.company.name}
                </h2>
                <Link
                  href={`/companies/${job.company.id}`}
                  className="text-label-lg text-primary flex items-center gap-1 font-semibold hover:underline"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
              <JobGrid jobs={sameCompany} />
            </div>
          )}
        </>
      )}
    </section>
  );
}
