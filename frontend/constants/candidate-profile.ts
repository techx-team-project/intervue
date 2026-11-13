import { RECRUITER_CITY_OPTIONS } from '@/constants/recruiter-onboarding';
import type {
  CandidateSection,
  CareerLevel,
  ContractType,
  Gender,
  JobSearchStatus,
  LanguageProficiency,
  SkillCategory,
  SkillLevel,
  WorkMode,
} from '@/types/candidate-profile';

type Option<T extends string> = { value: T; label: string };

export const GENDER_OPTIONS: Option<Gender>[] = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

export const JOB_SEARCH_STATUS_OPTIONS: Option<JobSearchStatus>[] = [
  { value: 'ACTIVELY_LOOKING', label: 'Actively looking for a job' },
  { value: 'OPEN_TO_OFFERS', label: 'Open to offers' },
  { value: 'NOT_LOOKING', label: 'Not looking right now' },
];

export const CAREER_LEVEL_OPTIONS: Option<CareerLevel>[] = [
  { value: 'INTERN', label: 'Intern' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MID', label: 'Mid-level' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead' },
];

export const WORK_MODE_OPTIONS: Option<WorkMode>[] = [
  { value: 'ON_SITE', label: 'On-site' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'FLEXIBLE', label: 'Flexible' },
];

export const CONTRACT_TYPE_OPTIONS: Option<ContractType>[] = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

export const SKILL_CATEGORY_OPTIONS: Option<SkillCategory>[] = [
  { value: 'CORE', label: 'Core skills' },
  { value: 'AI_DATA', label: 'AI and data' },
  { value: 'TOOLS_DEVOPS', label: 'Tools and DevOps' },
  { value: 'SOFT', label: 'Soft skills' },
];

export const SKILL_LEVEL_OPTIONS: Option<SkillLevel>[] = [
  { value: 'BASIC', label: 'Basic' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'PROFICIENT', label: 'Proficient' },
  { value: 'EXPERT', label: 'Expert' },
];

export const LANGUAGE_PROFICIENCY_OPTIONS: Option<LanguageProficiency>[] = [
  { value: 'BASIC', label: 'Basic' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'FLUENT', label: 'Fluent' },
  { value: 'NATIVE', label: 'Native' },
];

export const SECTION_TAG_LIMIT = 15;
export const SECTION_TEXT_LIMIT = 2000;
export const SECTION_MIN_YEAR = 1950;
export const SECTION_MAX_YEAR_AHEAD = 10;
export const SKILL_MAX_YEARS = 50;

export const SECTION_LABELS: Record<CandidateSection, string> = {
  experiences: 'Work experience',
  educations: 'Education',
  projects: 'Project',
  certifications: 'Certification',
  languages: 'Language',
  skills: 'Skill',
};

export function optionLabel<T extends string>(options: Option<T>[], value: T | null): string | null {
  return options.find((option) => option.value === value)?.label ?? null;
}

export const PROFILE_LOCATION_OPTIONS: string[] = RECRUITER_CITY_OPTIONS.filter(
  (option) => option.value !== 'Other',
).map((option) => option.value);

export const PROFILE_INDUSTRY_OPTIONS: string[] = [
  'Software & IT services',
  'Fintech & banking',
  'E-commerce & retail',
  'Education & e-learning',
  'Healthcare',
  'Gaming',
  'Telecommunications',
  'Logistics & supply chain',
  'AI & data',
  'Cybersecurity',
  'Media & advertising',
];

export const PROFILE_LIST_LIMIT = 5;
export const PROFILE_MIN_AGE = 16;
export const PROFILE_MIN_BIRTH_YEAR = 1950;

export const FIELD_ERROR_ALIASES: Record<string, string> = {
  birthYearAllowed: 'birthYear',
  salaryRangeValid: 'salaryMax',
  nameLengthValid: 'name',
  desiredRoleLengthValid: 'desiredRole',
  dateRangeValid: 'endDate',
  yearRangeValid: 'endYear',
  yearBoundsValid: 'startYear',
};

export const IMAGE_ACCEPTED_TYPES: readonly string[] = ['image/jpeg', 'image/png'];

export const IMAGE_ERROR_MESSAGES: Record<string, string> = {
  UNSUPPORTED_FILE_TYPE: 'Only JPEG and PNG images are supported.',
  FILE_TOO_LARGE: 'This image is too large, please choose a smaller one.',
  STORAGE_UNAVAILABLE: 'Image storage is unavailable right now, please try again later.',
};
export const PROFILE_MAX_SALARY_VND = 250_000_000;
