export type JobStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'PAUSED' | 'CLOSED' | 'EXPIRED' | 'HIDDEN_BY_ADMIN';

export type ContractType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP';

export type WorkingArrangement = 'ON_SITE' | 'HYBRID' | 'REMOTE' | 'FLEXIBLE';

export type JobLevel = 'INTERN' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';

export type SalaryCurrency = 'VND' | 'USD';

export type SalaryBasis = 'GROSS' | 'NET';

export type JobRole =
  | 'BACKEND'
  | 'FRONTEND'
  | 'FULLSTACK'
  | 'MOBILE'
  | 'DEVOPS'
  | 'QA'
  | 'DATA_AI'
  | 'BA'
  | 'PM'
  | 'UIUX'
  | 'SECURITY'
  | 'OTHER';

export type JobBenefitTag =
  | 'HEALTH_INSURANCE'
  | 'BONUS_13TH_MONTH'
  | 'PERFORMANCE_BONUS'
  | 'LAPTOP'
  | 'TRAINING'
  | 'TEAM_BUILDING'
  | 'FLEXIBLE_HOURS'
  | 'REMOTE_DAYS'
  | 'ANNUAL_LEAVE'
  | 'MEALS';

export type ScreeningQuestionType = 'CHOICE' | 'SHORT_TEXT';

export type SkillGroup = 'CORE' | 'AI_DATA' | 'TOOLS_DEVOPS' | 'SOFT_SKILLS';

export interface JobSalary {
  negotiable: boolean;
  min?: number | null;
  max?: number | null;
  currency?: SalaryCurrency | null;
  basis?: SalaryBasis | null;
}

export interface JobExperience {
  minYears?: number | null;
  maxYears?: number | null;
}

export interface JobLocation {
  city?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface SkillResource {
  id: number;
  name: string;
  group: SkillGroup;
}

export interface ScreeningQuestionResource {
  id: number;
  type: ScreeningQuestionType;
  prompt: string;
  required: boolean;
  options?: string[];
}

export interface SaveScreeningQuestion {
  type: ScreeningQuestionType;
  prompt: string;
  required: boolean;
  options: string[];
}

export interface RecruiterJobSummaryResource {
  id: number;
  title: string;
  status: JobStatus;
  level?: JobLevel;
  contractType?: ContractType;
  workingArrangement?: WorkingArrangement;
  city?: string;
  salary: JobSalary;
  openings: number;
  deadline?: string;
  publishedAt?: string;
  highlightLabel?: 'HOT' | null;
  updatedAt: string;
}

export interface RecruiterJobResource {
  id: number;
  title: string;
  status: JobStatus;
  companyName: string;
  level?: JobLevel;
  jobRole?: JobRole;
  experience?: JobExperience;
  contractType?: ContractType;
  workingArrangement?: WorkingArrangement;
  location: JobLocation;
  salary: JobSalary;
  skills: SkillResource[];
  description?: string;
  requirements?: string;
  benefits?: string;
  benefitTags: JobBenefitTag[];
  hiringSteps: string[];
  screeningQuestions: ScreeningQuestionResource[];
  openings: number;
  deadline?: string;
  publishedAt?: string;
  hiddenReason?: string;
  hiddenAt?: string;
  createdAt: string;
  updatedAt: string;
  highlightLabel?: 'HOT' | null;
  highlightLabelExpiresAt?: string;
  highlighted?: boolean;
  highlightExpiresAt?: string;
}

export type JobHistoryAction =
  | 'JOB_CREATED'
  | 'JOB_UPDATED'
  | 'JOB_PUBLISHED'
  | 'JOB_PAUSED'
  | 'JOB_RESUMED'
  | 'JOB_CLOSED'
  | 'JOB_RENEWED'
  | 'JOB_HIDDEN'
  | 'JOB_RESTORED';

export interface JobHistoryEntry {
  action: JobHistoryAction;
  actorType: 'ADMIN' | 'SYSTEM' | 'USER' | 'RECRUITER';
  detail?: string;
  reason?: string;
  createdAt: string;
}

export interface JobDailyStat {
  date: string;
  views: number;
  applications: number;
}

export interface JobStats {
  totalViews: number;
  totalApplications: number;
  conversionRate?: number;
  daily: JobDailyStat[];
}

export interface JobQuota {
  slotsRemaining: number;
  slotRequired: boolean;
}

export interface RecruiterJobCounts {
  total: number;
  byStatus: Record<JobStatus, number>;
}

export interface SaveJobRequest {
  title: string;
  level?: JobLevel;
  jobRole?: JobRole;
  experience?: { minYears?: number; maxYears?: number };
  contractType?: ContractType;
  workingArrangement?: WorkingArrangement;
  location: { city?: string; address?: string; latitude?: number; longitude?: number };
  salary: { negotiable: boolean; min?: number; max?: number; currency?: SalaryCurrency; basis?: SalaryBasis };
  skillIds: number[];
  description?: string;
  requirements?: string;
  benefits?: string;
  benefitTags?: JobBenefitTag[];
  hiringSteps?: string[];
  deadline?: string;
  openings: number;
  screeningQuestions?: SaveScreeningQuestion[];
}

export type RecruiterJobSegment = 'all' | 'published' | 'paused' | 'expired' | 'draft' | 'closed';

export type RecruiterJobSort = 'newest' | 'expiringSoon' | 'highestSalary';

export interface RecruiterJobPost {
  id: string;
  title: string;
  companyName?: string;
  status: JobStatus;
  level?: JobLevel;
  contractType?: ContractType;
  workingArrangement?: WorkingArrangement;
  location: JobLocation;
  salary: JobSalary;
  skills: string[];
  description?: string;
  requirements?: string;
  benefits?: string;
  screeningQuestions?: ScreeningQuestionResource[];
  recruitsCount: number;
  createdAt?: string;
  updatedAt: string;
  expiresAt?: string;
  publishedAt?: string;
  highlightLabel?: 'HOT' | null;
}

export interface SimilarJob {
  id: number;
  title: string;
  city?: string;
}
