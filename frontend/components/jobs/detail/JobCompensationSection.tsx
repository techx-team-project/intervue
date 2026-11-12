import { cn } from '@/lib/utils';
import type { PublicJobResource, PublicJobSummaryResource } from '@/types/public-job';
import { benchmarkSalary, formatAmount } from '@/utils/job-compensation';
import { formatSalary } from '@/utils/public-company';
import { ArrowUpRight, Info } from 'lucide-react';
import Link from 'next/link';
import JobDetailSection from './JobDetailSection';
import SalaryRangeBar from './SalaryRangeBar';

const SIMILAR_RANGE_PERCENT = 3;
const MONTHS_PER_YEAR = 12;
const THIRTEENTH_MONTH_PATTERN = /th[aá]ng\s*13|13(th)?[-\s]*month/i;

type JobCompensationSectionProps = {
  job: PublicJobResource;
  similar: PublicJobSummaryResource[];
  index?: string;
};

type TileProps = { label: string; value: string; hint?: string; accent?: boolean };

function Tile({ label, value, hint, accent }: TileProps) {
  return (
    <div className="border-outline-variant rounded-xl border p-4">
      <dt className="text-label-md text-on-surface-variant font-semibold tracking-wider uppercase">{label}</dt>
      <dd className={cn('font-display mt-1.5 text-xl font-bold', accent ? 'text-primary' : 'text-on-surface')}>
        {value}
      </dd>
      {hint && <p className="text-label-md text-on-surface-variant mt-1">{hint}</p>}
    </div>
  );
}

function marketComparison(deltaPercent: number): string {
  if (Math.abs(deltaPercent) <= SIMILAR_RANGE_PERCENT) return 'On par';
  return `${deltaPercent > 0 ? '+' : '-'}${Math.abs(deltaPercent)}%`;
}

export default function JobCompensationSection({ job, similar, index }: JobCompensationSectionProps) {
  const { salary } = job;
  const benchmark = benchmarkSalary(salary, similar);
  const isNegotiable = salary.negotiable || salary.min == null || salary.max == null;
  const hasThirteenthMonth = THIRTEENTH_MONTH_PATTERN.test(job.benefits ?? '');
  const salaryMin = salary.min ?? 0;
  const salaryMax = salary.max ?? 0;
  const yearlyMonths = hasThirteenthMonth ? MONTHS_PER_YEAR + 1 : MONTHS_PER_YEAR;
  const yearlyRange = `${formatAmount(salaryMin * yearlyMonths, salary.currency)} - ${formatAmount(salaryMax * yearlyMonths, salary.currency)}`;

  return (
    <JobDetailSection id="compensation" title="Compensation" index={index}>
      {isNegotiable ? (
        <div className="bg-surface-container-low rounded-xl p-5">
          <p className="font-display text-title-lg text-on-surface font-bold">Negotiable</p>
          <p className="text-body-md text-on-surface-variant mt-1">
            The recruiter will discuss the salary range with you based on your experience during the interview.
          </p>
        </div>
      ) : (
        <div>
          <div>
            <p className="text-label-md text-on-surface-variant font-semibold tracking-widest uppercase">
              Monthly salary
            </p>
            <p className="font-display text-on-surface text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight font-bold">
              {formatSalary(salary)}
            </p>

            <div className="mt-4">
              <SalaryRangeBar
                min={salaryMin}
                max={salaryMax}
                minLabel={formatAmount(salaryMin, salary.currency)}
                maxLabel={formatAmount(salaryMax, salary.currency)}
                marketAverage={benchmark?.averageMidpoint}
                marketLabel={
                  benchmark ? `Market avg ${formatAmount(benchmark.averageMidpoint, salary.currency)}` : undefined
                }
              />
            </div>

            <dl className="mt-2 grid gap-3 sm:grid-cols-3">
              <Tile
                label="Yearly estimate"
                value={yearlyRange}
                hint={hasThirteenthMonth ? 'Includes 13th month salary' : `${MONTHS_PER_YEAR} months, before bonus`}
              />
              <Tile
                label="Versus similar jobs"
                value={benchmark ? marketComparison(benchmark.deltaPercent) : 'Not enough data'}
                hint={benchmark ? `Based on ${benchmark.sampleSize} similar jobs` : 'Too few similar jobs to compare'}
                accent={benchmark !== null && benchmark.deltaPercent > SIMILAR_RANGE_PERCENT}
              />
              <Tile
                label="Pay basis"
                value={salary.currency === 'USD' ? 'USD' : 'VND'}
                hint="Gross, before personal income tax"
              />
            </dl>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p className="text-label-md text-on-surface-variant flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 shrink-0" aria-hidden />
          The final offer depends on your experience and interview result.
        </p>
        <Link
          href="/blog/che-do-luong-thuong"
          className="text-label-lg text-primary flex items-center gap-1 font-semibold hover:underline"
        >
          Salary and benefits guide
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </JobDetailSection>
  );
}
