import type { PublicJobSearchParams } from '@/apiRequest/public-job';
import { DEFAULT_CURRENCY, MILLION, POSTED_OPTIONS } from '@/constants/job-filters';
import { JOB_ARRANGEMENT_LABELS, JOB_CONTRACT_LABELS, JOB_LEVEL_LABELS } from '@/constants/recruiter-job';
import type { ActiveJobFilter, JobFilterKey, PublicJobFilters, SkillFilter } from '@/types/job-filters';

export const FILTER_KEYS: JobFilterKey[] = [
  'q',
  'city',
  'level',
  'contractType',
  'workingArrangement',
  'salaryFrom',
  'currency',
  'skills',
  'posted',
  'sort',
];

export const EMPTY_FILTERS: PublicJobFilters = {
  q: '',
  city: '',
  level: '',
  contractType: '',
  workingArrangement: '',
  salaryFrom: '',
  currency: '',
  skills: '',
  posted: '',
  sort: '',
};

export function readFilters(params: URLSearchParams): PublicJobFilters {
  return Object.fromEntries(FILTER_KEYS.map((key) => [key, params.get(key) ?? ''])) as unknown as PublicJobFilters;
}

export function writeFilters(filters: PublicJobFilters, page: number): string {
  const params = new URLSearchParams();
  FILTER_KEYS.forEach((key) => {
    if (filters[key]) params.set(key, filters[key]);
  });
  if (page > 1) params.set('page', String(page));
  return params.toString();
}

export function parseSkillFilters(value: string): SkillFilter[] {
  return value
    .split(',')
    .map((pair) => {
      const separator = pair.indexOf(':');
      return { id: Number(pair.slice(0, separator)), name: pair.slice(separator + 1) };
    })
    .filter((skill) => Number.isInteger(skill.id) && skill.id > 0 && skill.name);
}

export function serializeSkillFilters(skills: SkillFilter[]): string {
  return skills.map((skill) => `${skill.id}:${skill.name}`).join(',');
}

export function toSearchParams(filters: PublicJobFilters, page: number, size: number): PublicJobSearchParams {
  const skills = parseSkillFilters(filters.skills);
  return {
    q: filters.q,
    city: filters.city,
    level: filters.level,
    contractType: filters.contractType,
    workingArrangement: filters.workingArrangement,
    salaryFrom: filters.salaryFrom ? Number(filters.salaryFrom) : undefined,
    currency: filters.salaryFrom ? filters.currency || DEFAULT_CURRENCY : undefined,
    skillIds: skills.length > 0 ? skills.map((skill) => skill.id) : undefined,
    postedWithinDays: filters.posted ? Number(filters.posted) : undefined,
    sort: filters.sort || undefined,
    page: page - 1,
    size,
  };
}

export function formatSalaryFloor(value: string, currency: string): string {
  const amount = Number(value);
  return (currency || DEFAULT_CURRENCY) === DEFAULT_CURRENCY
    ? `${amount / MILLION}M VND`
    : `$${amount.toLocaleString('en-US')}`;
}

export function describeActiveFilters(filters: PublicJobFilters): ActiveJobFilter[] {
  const active: ActiveJobFilter[] = [];
  if (filters.q) active.push({ id: 'q', label: `“${filters.q}”`, patch: { q: '' } });
  if (filters.city) active.push({ id: 'city', label: filters.city, patch: { city: '' } });
  if (filters.level) {
    const label = JOB_LEVEL_LABELS[filters.level as keyof typeof JOB_LEVEL_LABELS] ?? filters.level;
    active.push({ id: 'level', label, patch: { level: '' } });
  }
  if (filters.workingArrangement) {
    const label =
      JOB_ARRANGEMENT_LABELS[filters.workingArrangement as keyof typeof JOB_ARRANGEMENT_LABELS] ??
      filters.workingArrangement;
    active.push({ id: 'workingArrangement', label, patch: { workingArrangement: '' } });
  }
  if (filters.contractType) {
    const label = JOB_CONTRACT_LABELS[filters.contractType as keyof typeof JOB_CONTRACT_LABELS] ?? filters.contractType;
    active.push({ id: 'contractType', label, patch: { contractType: '' } });
  }
  if (filters.salaryFrom) {
    active.push({
      id: 'salaryFrom',
      label: `Pays ${formatSalaryFloor(filters.salaryFrom, filters.currency)}+`,
      patch: { salaryFrom: '', currency: '' },
    });
  }
  if (filters.posted) {
    const label =
      POSTED_OPTIONS.find((option) => option.value === filters.posted)?.label ?? `Last ${filters.posted} days`;
    active.push({ id: 'posted', label: `Posted: ${label.toLowerCase()}`, patch: { posted: '' } });
  }
  const skills = parseSkillFilters(filters.skills);
  skills.forEach((skill) =>
    active.push({
      id: `skill-${skill.id}`,
      label: skill.name,
      patch: { skills: serializeSkillFilters(skills.filter((item) => item.id !== skill.id)) },
    }),
  );
  return active;
}
