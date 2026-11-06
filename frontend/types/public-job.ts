import type { ContractType, JobLevel, JobSalary, SkillResource, WorkingArrangement } from '@/types/recruiter-job';

export interface PublicJobCompany {
  id: number;
  name: string;
  logoUrl?: string;
}

export interface PublicJobSummaryResource {
  id: number;
  title: string;
  company: PublicJobCompany;
  level?: JobLevel;
  contractType?: ContractType;
  workingArrangement?: WorkingArrangement;
  city?: string;
  salary: JobSalary;
  skills: SkillResource[];
  deadline?: string;
  publishedAt?: string;
}
