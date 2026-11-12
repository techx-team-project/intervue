import type { PublicJobSummaryResource } from '@/types/public-job';
import type { JobSalary } from '@/types/recruiter-job';

const MINIMUM_SAMPLE = 3;

function midpoint(salary: JobSalary): number | null {
  if (salary.negotiable || salary.min == null || salary.max == null) return null;
  return (salary.min + salary.max) / 2;
}

export type SalaryBenchmark = { sampleSize: number; averageMidpoint: number; deltaPercent: number };

export function benchmarkSalary(salary: JobSalary, similar: PublicJobSummaryResource[]): SalaryBenchmark | null {
  const own = midpoint(salary);
  if (own === null) return null;
  const peers = similar
    .filter((job) => job.salary.currency === salary.currency)
    .map((job) => midpoint(job.salary))
    .filter((value): value is number => value !== null);
  if (peers.length < MINIMUM_SAMPLE) return null;
  const averageMidpoint = peers.reduce((sum, value) => sum + value, 0) / peers.length;
  return {
    sampleSize: peers.length,
    averageMidpoint,
    deltaPercent: Math.round(((own - averageMidpoint) / averageMidpoint) * 100),
  };
}

export function formatAmount(value: number, currency?: string | null): string {
  return currency === 'USD' ? `$${Math.round(value).toLocaleString('en-US')}` : `${Math.round(value / 1_000_000)}M VND`;
}
