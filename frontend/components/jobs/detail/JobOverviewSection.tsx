import { JOB_ARRANGEMENT_LABELS, JOB_CONTRACT_LABELS, JOB_LEVEL_LABELS } from '@/constants/recruiter-job';
import type { PublicJobResource } from '@/types/public-job';
import { formatDate, formatRelativeDay } from '@/utils/datetime';
import { Briefcase, CalendarClock, Clock3, Laptop, TrendingUp, Users, type LucideIcon } from 'lucide-react';
import JobDetailSection from './JobDetailSection';

type Fact = { icon: LucideIcon; label: string; value?: string };

export default function JobOverviewSection({ job, index }: { job: PublicJobResource; index?: string }) {
  const facts: Fact[] = [
    { icon: TrendingUp, label: 'Level', value: job.level && JOB_LEVEL_LABELS[job.level] },
    { icon: Briefcase, label: 'Contract', value: job.contractType && JOB_CONTRACT_LABELS[job.contractType] },
    {
      icon: Laptop,
      label: 'Work mode',
      value: job.workingArrangement && JOB_ARRANGEMENT_LABELS[job.workingArrangement],
    },
    { icon: Users, label: 'Openings', value: `${job.openings} ${job.openings === 1 ? 'position' : 'positions'}` },
    { icon: CalendarClock, label: 'Posted', value: job.publishedAt && formatRelativeDay(job.publishedAt) },
    { icon: Clock3, label: 'Deadline', value: job.deadline && formatDate(job.deadline) },
  ];

  return (
    <JobDetailSection id="overview" title="Overview" index={index}>
      <dl className="grid grid-cols-2 gap-5 sm:grid-cols-3">
        {facts
          .filter((fact) => fact.value)
          .map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="bg-primary-light text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <dt className="text-label-md text-on-surface-variant">{label}</dt>
                <dd className="text-body-md text-on-surface font-semibold">{value}</dd>
              </div>
            </div>
          ))}
      </dl>
    </JobDetailSection>
  );
}
