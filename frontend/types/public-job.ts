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

export interface PublicJobCompanyDetail extends PublicJobCompany {
  address?: string;
}

export interface ScreeningSummary {
  questionCount: number;
  requiredCount: number;
  estimatedMinutes: number;
}

export interface PublicJobResource {
  id: number;
  title: string;
  company: PublicJobCompanyDetail;
  level?: JobLevel;
  contractType?: ContractType;
  workingArrangement?: WorkingArrangement;
  location: { city?: string; address?: string };
  salary: JobSalary;
  skills: SkillResource[];
  description?: string;
  requirements?: string;
  benefits?: string;
  openings: number;
  screening: ScreeningSummary;
  deadline?: string;
  publishedAt?: string;
}
