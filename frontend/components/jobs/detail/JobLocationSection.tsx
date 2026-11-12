'use client';

import Skeleton from '@/components/ui/Skeleton';
import { CLOSING_SOON_DAYS } from '@/constants/job-filters';
import { JOB_ARRANGEMENT_LABELS } from '@/constants/recruiter-job';
import { cn } from '@/lib/utils';
import type { PublicJobResource } from '@/types/public-job';
import { formatDate } from '@/utils/datetime';
import { daysLeft, deadlineLabel } from '@/utils/public-job';
import { CalendarClock, ExternalLink, Laptop, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import JobDetailSection from './JobDetailSection';

const JobLocationMap = dynamic(() => import('./JobLocationMap'), {
  ssr: false,
  loading: () => <Skeleton className="h-full min-h-64 w-full" />,
});

const DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1&destination=';

export default function JobLocationSection({ job, index }: { job: PublicJobResource; index?: string }) {
  const { latitude, longitude } = job.location;
  const address = [job.location.address, job.location.city].filter(Boolean).join(', ');
  const hasCoordinates = latitude != null && longitude != null;
  const destination = hasCoordinates ? `${latitude},${longitude}` : address;
  const left = daysLeft(job.deadline);

  return (
    <JobDetailSection id="location" title="Location & schedule" index={index}>
      <div className="grid gap-5 md:grid-cols-2">
        <ul className="text-body-md space-y-4">
          <li className="flex gap-3">
            <MapPin className="text-primary mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <div>
              <p className="text-on-surface font-semibold">Work location</p>
              <p className="text-on-surface-variant">{address || 'To be confirmed with the recruiter'}</p>
              {destination && (
                <a
                  href={`${DIRECTIONS_URL}${encodeURIComponent(destination)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-label-lg text-primary mt-1 inline-flex items-center gap-1 font-semibold hover:underline"
                >
                  Get directions
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              )}
            </div>
          </li>
          {job.workingArrangement && (
            <li className="flex gap-3">
              <Laptop className="text-primary mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <div>
                <p className="text-on-surface font-semibold">Work mode</p>
                <p className="text-on-surface-variant">{JOB_ARRANGEMENT_LABELS[job.workingArrangement]}</p>
              </div>
            </li>
          )}
          {job.deadline && (
            <li className="flex gap-3">
              <CalendarClock className="text-primary mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <div>
                <p className="text-on-surface font-semibold">Application deadline</p>
                <p className="text-on-surface-variant">{formatDate(job.deadline)}</p>
                {left !== null && (
                  <p
                    className={cn(
                      'text-label-lg font-semibold',
                      left <= CLOSING_SOON_DAYS ? 'text-error' : 'text-primary',
                    )}
                  >
                    {deadlineLabel(job.deadline)}
                  </p>
                )}
              </div>
            </li>
          )}
        </ul>

        {hasCoordinates && (
          <div className="border-outline-variant h-64 overflow-hidden rounded-xl border md:h-full">
            <JobLocationMap latitude={latitude} longitude={longitude} />
          </div>
        )}
      </div>
    </JobDetailSection>
  );
}
