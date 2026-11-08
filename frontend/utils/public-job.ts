import { JOB_ARRANGEMENT_LABELS, JOB_CONTRACT_LABELS, JOB_LEVEL_LABELS } from '@/constants/recruiter-job';
import type { PublicJobSummaryResource } from '@/types/public-job';

const DAY_MS = 24 * 60 * 60 * 1000;

export function daysLeft(deadline?: string): number | null {
  if (!deadline) return null;
  const end = new Date(`${deadline}T23:59:59`).getTime();
  return Math.max(0, Math.ceil((end - Date.now()) / DAY_MS));
}

export function deadlineLabel(deadline?: string): string {
  const left = daysLeft(deadline);
  if (left === null) return '';
  return left === 0 ? 'Expires today' : `${left} days left`;
}

export function jobFacts(
  job: Pick<PublicJobSummaryResource, 'city' | 'level' | 'workingArrangement' | 'contractType'>,
): string[] {
  return [
    job.city,
    job.level && JOB_LEVEL_LABELS[job.level],
    job.workingArrangement && JOB_ARRANGEMENT_LABELS[job.workingArrangement],
    job.contractType && JOB_CONTRACT_LABELS[job.contractType],
  ].filter((fact): fact is string => Boolean(fact));
}

export function textLines(text?: string): string[] {
  return (text ?? '')
    .split('\n')
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}
