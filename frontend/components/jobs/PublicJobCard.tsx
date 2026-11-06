import type { PublicJobSummaryResource } from '@/types/public-job';
import { deadlineLabel, jobFacts } from '@/utils/public-job';
import { formatSalary } from '@/utils/public-company';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import CompanyLogo from './CompanyLogo';

const MAX_SKILLS = 4;

interface PublicJobCardProps {
  job: PublicJobSummaryResource;
}

export default function PublicJobCard({ job }: PublicJobCardProps) {
  const facts = jobFacts(job);
  const skills = job.skills.slice(0, MAX_SKILLS);
  const left = deadlineLabel(job.deadline);

  return (
    <article className="hover:border-primary/60 group flex gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:shadow-md">
      <Link href={`/companies/${job.company.id}`} aria-label={job.company.name} className="shrink-0">
        <CompanyLogo name={job.company.name} src={job.company.logoUrl} />
      </Link>

      <div className="min-w-0 flex-1 space-y-1.5">
        <Link href={`/jobs/${job.id}`} className="block">
          <h3 className="group-hover:text-primary line-clamp-2 text-[15px] leading-snug font-bold text-slate-900 transition-colors">
            {job.title}
          </h3>
        </Link>
        <Link href={`/companies/${job.company.id}`} className="block truncate text-xs text-slate-500 hover:underline">
          {job.company.name}
        </Link>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-extrabold text-[#00873c]">
            {formatSalary(job.salary)}
          </span>
          {facts.length > 0 && <span className="text-slate-500">{facts.slice(0, 2).join(' · ')}</span>}
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
              >
                {skill.name}
              </span>
            ))}
          </div>
        )}

        {left && (
          <p className="flex items-center gap-1 pt-0.5 text-[11px] text-slate-400">
            <Clock className="h-3 w-3" aria-hidden />
            {left}
          </p>
        )}
      </div>
    </article>
  );
}
