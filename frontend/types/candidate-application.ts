import type { ScreeningQuestionResource } from '@/types/recruiter-job';

export type CandidateApplicationStatus =
  | 'DRAFT'
  | 'APPLIED'
  | 'VIEWED'
  | 'IN_REVIEW'
  | 'INTERVIEW'
  | 'OFFER'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'JOB_CLOSED';

export interface CandidateResume {
  id: number;
  fileName: string;
  url: string;
  fileSizeBytes: number;
  contentType: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CandidateApplication {
  id: number;
  status: CandidateApplicationStatus;
  jobId: number;
  jobTitle: string;
  companyId: number;
  companyName: string;
  resumeId?: number;
  cv?: { fileName: string; fileSizeBytes: number };
  coverLetter?: string;
  answers: Array<{ questionId: number; prompt: string; answer: string }>;
  submittedAt?: string;
  viewedAt?: string;
  updatedAt: string;
}

export interface ApplyForm {
  jobId: number;
  jobTitle: string;
  companyName: string;
  open: boolean;
  questions: ScreeningQuestionResource[];
  application?: CandidateApplication;
}

export interface SaveApplicationPayload {
  jobId: number;
  resumeId?: number;
  coverLetter?: string;
  answers: Array<{ questionId: number; answer: string }>;
}
