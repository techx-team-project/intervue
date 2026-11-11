import Link from 'next/link';
import { Sparkles, MapPin, Briefcase } from 'lucide-react';
import type { JobRecommendationItem } from '@/types/job-recommendation';
import CompanyLogo from '@/components/jobs/CompanyLogo';
import SaveJobButton from '@/components/candidate/saved/SaveJobButton';
import { formatSalary } from '@/utils/public-company';

interface RecommendedJobCardProps {
  item: JobRecommendationItem;
  isFallback?: boolean;
}

export default function RecommendedJobCard({ item, isFallback }: RecommendedJobCardProps) {
  const { job, matchReason, matchedSkills = [] } = item;

  return (
    <article className="group border-outline-variant bg-surface hover:border-primary/40 hover:shadow-elevation-2 relative flex h-full flex-col justify-between rounded-2xl border p-5 shadow-xs transition-all duration-200 hover:-translate-y-1">
      <div className="space-y-3.5">
        {/* Match reason badge */}
        <div className="flex items-center justify-between gap-2">
          <div
            className={`text-label-sm inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-colors ${
              isFallback
                ? 'bg-surface-container-high text-on-surface-variant'
                : 'border-primary/25 border bg-emerald-50 text-emerald-800'
            }`}
          >
            <Sparkles className={`h-3.5 w-3.5 shrink-0 ${isFallback ? 'text-on-surface-variant' : 'text-primary'}`} />
            <span className="line-clamp-1">{matchReason}</span>
          </div>

          <SaveJobButton jobId={job.id} />
        </div>

        {/* Company & Job info */}
        <div className="flex items-start gap-3.5">
          <Link href={`/companies/${job.company.id}`} aria-label={job.company.name} className="shrink-0">
            <CompanyLogo
              name={job.company.name}
              src={job.company.logoUrl}
              className="border-outline-variant h-14 w-14 rounded-xl border object-contain p-1"
            />
          </Link>

          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="text-title-md text-on-surface group-hover:text-primary font-bold transition-colors">
              <Link href={`/jobs/${job.id}`} className="line-clamp-2">
                {job.title}
              </Link>
            </h3>
            <Link
              href={`/companies/${job.company.id}`}
              className="text-body-sm text-on-surface-variant block truncate font-medium hover:underline"
            >
              {job.company.name}
            </Link>
          </div>
        </div>

        {/* Matched skills highlight */}
        {matchedSkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-label-sm text-primary font-semibold">Matched:</span>
            {matchedSkills.map((skill) => (
              <span
                key={skill}
                className="border-primary/30 bg-primary-light text-label-sm text-primary rounded-md border px-2 py-0.5 font-bold"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Meta tags & salary footer */}
      <div className="border-outline-variant/60 mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        <span className="text-label-md text-primary font-bold">{formatSalary(job.salary)}</span>

        <div className="text-body-sm text-on-surface-variant flex flex-wrap items-center gap-3">
          {job.city && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="text-outline h-3.5 w-3.5" />
              <span>{job.city}</span>
            </span>
          )}
          {job.level && (
            <span className="inline-flex items-center gap-1">
              <Briefcase className="text-outline h-3.5 w-3.5" />
              <span>{job.level}</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
