import type {
  ContractType,
  JobBenefitTag,
  JobExperience,
  JobLevel,
  JobRole,
  JobSalary,
  SkillResource,
  WorkingArrangement,
} from '@/types/recruiter-job';

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
  jobRole?: JobRole;
  contractType?: ContractType;
  workingArrangement?: WorkingArrangement;
  city?: string;
  salary: JobSalary;
  skills: SkillResource[];
  deadline?: string;
  publishedAt?: string;
  highlightLabel?: 'HOT' | null;
  highlighted?: boolean;
}

export interface NearbyJobResource {
  job: PublicJobSummaryResource;
  address?: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
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
  jobRole?: JobRole;
  experience?: JobExperience;
  contractType?: ContractType;
  workingArrangement?: WorkingArrangement;
  location: { city?: string; address?: string; latitude?: number; longitude?: number };
  salary: JobSalary;
  skills: SkillResource[];
  description?: string;
  requirements?: string;
  benefits?: string;
  benefitTags: JobBenefitTag[];
  hiringSteps: string[];
  openings: number;
  screening: ScreeningSummary;
  deadline?: string;
  publishedAt?: string;
  highlightLabel?: 'HOT' | null;
  highlighted?: boolean;
}
