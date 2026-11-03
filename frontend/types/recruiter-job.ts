export type JobStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'PAUSED' | 'CLOSED' | 'EXPIRED' | 'REJECTED';

export type ContractType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP';

export type WorkingArrangement = 'ON_SITE' | 'HYBRID' | 'REMOTE' | 'FLEXIBLE';

export type JobLevel = 'INTERN' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';

export interface JobSalary {
  negotiable: boolean;
  min?: number;
  max?: number;
  currency?: 'VND' | 'USD';
  period?: 'MONTHLY';
}

export type ScreeningQuestionType = 'TEXT' | 'YES_NO' | 'SINGLE_CHOICE';

export interface ScreeningQuestion {
  id: string;
  question: string;
  required: boolean;
  type: ScreeningQuestionType;
  options?: string[];
}

export interface JobLocation {
  city: string;
  district?: string;
  specificAddress?: string;
}

export type RecruiterJobSegment = 'all' | 'published' | 'pending' | 'paused' | 'expired' | 'draft' | 'closed';

export type RecruiterJobSort = 'newest' | 'expiringSoon' | 'mostApplicants' | 'highestSalary';

export interface RecruiterJobPost {
  id: string;
  title: string;
  status: JobStatus;
  level: JobLevel;
  contractType: ContractType;
  workingArrangement: WorkingArrangement;
  location: JobLocation;
  salary: JobSalary;
  skills: string[];
  description: string;
  requirements: string;
  benefits: string;
  screeningQuestions: ScreeningQuestion[];
  recruitsCount: number;
  applicantsCount?: number;
  newApplicantsCount?: number;
  viewsCount?: number;
  isFeatured?: boolean;
  isUrgent?: boolean;
  rejectionReason?: string;
  aiGenerated?: {
    description?: boolean;
    requirements?: boolean;
  };
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  publishedAt?: string;
}
