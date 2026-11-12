export interface PublicJobFilters {
  q: string;
  city: string;
  level: string;
  jobRole: string;
  experienceYears: string;
  contractType: string;
  workingArrangement: string;
  salaryFrom: string;
  currency: string;
  skills: string;
  posted: string;
  sort: string;
}

export type JobFilterKey = keyof PublicJobFilters;

export interface SkillFilter {
  id: number;
  name: string;
}

export interface ActiveJobFilter {
  id: string;
  label: string;
  patch: Partial<PublicJobFilters>;
}
