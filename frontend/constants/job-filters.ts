import type { SkillGroup } from '@/types/recruiter-job';

export const MILLION = 1_000_000;
export const DEFAULT_CURRENCY = 'VND';
export const MAX_SKILL_FILTERS = 10;
export const JOBS_PAGE_SIZE = 12;

export const FILTER_CURRENCIES = [
  { value: 'VND', label: 'VND' },
  { value: 'USD', label: 'USD' },
];

export const SALARY_PRESETS: Record<string, number[]> = {
  VND: [10 * MILLION, 20 * MILLION, 30 * MILLION, 50 * MILLION, 70 * MILLION],
  USD: [1000, 2000, 3000, 5000],
};

export const SKILL_GROUP_FILTER_LABELS: Record<SkillGroup, string> = {
  CORE: 'Core',
  AI_DATA: 'AI & Data',
  TOOLS_DEVOPS: 'Tools & DevOps',
  SOFT_SKILLS: 'Soft skills',
};

export const POSTED_OPTIONS = [
  { value: '1', label: 'Last 24 hours' },
  { value: '3', label: 'Last 3 days' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
];

export const SORT_OPTIONS = [
  { value: '', label: 'Recommended' },
  { value: 'NEWEST', label: 'Newest first' },
  { value: 'SALARY_DESC', label: 'Highest salary' },
  { value: 'DEADLINE_ASC', label: 'Closing soon' },
];

export const NEW_JOB_DAYS = 3;
export const CLOSING_SOON_DAYS = 3;
