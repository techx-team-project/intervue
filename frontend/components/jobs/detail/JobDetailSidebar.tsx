'use client';

import FollowCompanyButton from '@/components/candidate/saved/FollowCompanyButton';
import SaveJobButton from '@/components/candidate/saved/SaveJobButton';
import CompanyLogo from '@/components/jobs/CompanyLogo';
import { Button, buttonClassName } from '@/components/ui/Button';
import { useHasApplied } from '@/hooks/useCandidateApplication';
import type { PublicJobResource } from '@/types/public-job';
import { Check, ClipboardList, MapPin, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';
import ReportJobButton from './ReportJobButton';
import ShareJobButton from './ShareJobButton';

type JobDetailSidebarProps = {
  job: PublicJobResource;
  onApply: () => void;
};

export default function JobDetailSidebar({ job, onApply }: JobDetailSidebarProps) {
  const address = [job.location.address, job.location.city].filter(Boolean).join(', ');
  const hasQuestions = job.screening.questionCount > 0;
  const hasApplied = useHasApplied(job.id);

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="bg-surface border-outline-variant space-y-5 rounded-2xl border p-6">
        {hasQuestions && (
          <p className="text-body-sm text-on-surface-variant bg-surface-container-low flex items-start gap-2 rounded-xl px-3.5 py-3">
            <ClipboardList className="text-primary mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Includes {job.screening.questionCount} screening{' '}
            {job.screening.questionCount === 1 ? 'question' : 'questions'}
            {job.screening.requiredCount > 0 && ` (${job.screening.requiredCount} required)`}, about{' '}
            {job.screening.estimatedMinutes} min.
          </p>
        )}

        <div className="space-y-2.5">
          {hasApplied ? (
            <Link
              href="/candidate/applications"
              className={buttonClassName({ variant: 'outline', size: 'xl', className: 'w-full' })}
            >
              <Check className="h-4 w-4" aria-hidden />
              Applied · View application
            </Link>
          ) : (
            <Button size="xl" className="w-full" leftIcon={<Send className="h-4 w-4" aria-hidden />} onClick={onApply}>
              Apply now
            </Button>
          )}
          <Link
            href={`/cv-review?jobId=${job.id}&level=3`}
            className={buttonClassName({ variant: 'outline', size: 'lg', className: 'w-full' })}
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Check CV fit with AI
          </Link>
          <div className="grid grid-cols-2 gap-2.5">
            <SaveJobButton jobId={job.id} variant="labeled" className="h-12 w-full justify-center px-4" />
            <ShareJobButton jobId={job.id} title={job.title} />
          </div>
        </div>

        {address && (
          <p className="text-body-md text-on-surface-variant border-outline-variant flex items-start gap-2 border-t pt-4">
            <MapPin className="text-primary mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {address}
          </p>
        )}

        <div className="border-outline-variant border-t pt-4">
          <ReportJobButton jobId={job.id} />
        </div>
      </div>

      <div className="bg-surface border-outline-variant rounded-2xl border p-6">
        <div className="flex items-center gap-3">
          <CompanyLogo name={job.company.name} src={job.company.logoUrl} className="h-12 w-12 rounded-xl" />
          <div className="min-w-0">
            <p className="font-display text-title-md text-on-surface truncate font-bold">{job.company.name}</p>
            <Link
              href={`/companies/${job.company.id}`}
              className="text-label-lg text-primary font-semibold hover:underline"
            >
              View company page
            </Link>
          </div>
        </div>
        {job.company.address && (
          <p className="text-body-md text-on-surface-variant mt-3 leading-relaxed">{job.company.address}</p>
        )}
        <FollowCompanyButton companyId={job.company.id} className="mt-4 w-full" />
      </div>
    </aside>
  );
}
