import type { CandidateApplicationStatus } from '@/types/candidate-application';

export interface ReviewApplicationSummary {
  id: number;
  status: CandidateApplicationStatus;
  jobId: number;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  viewed: boolean;
  submittedAt?: string;
  updatedAt: string;
}

export interface ReviewApplicationNote {
  id: number;
  authorId: number;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface ReviewApplicationHistoryEntry {
  from?: CandidateApplicationStatus;
  to: CandidateApplicationStatus;
  actorType: 'CANDIDATE' | 'RECRUITER' | 'SYSTEM';
  note?: string;
  at: string;
}

export interface ReviewApplication {
  id: number;
  status: CandidateApplicationStatus;
  jobId: number;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  cv?: { fileName: string; fileSizeBytes: number };
  coverLetter?: string;
  answers: Array<{ questionId: number; prompt: string; answer: string }>;
  history: ReviewApplicationHistoryEntry[];
  notes: ReviewApplicationNote[];
  nextStatuses: CandidateApplicationStatus[];
  submittedAt?: string;
  viewedAt?: string;
  updatedAt: string;
}

export interface ReviewStatusCounts {
  total: number;
  byStatus: Record<CandidateApplicationStatus, number>;
}
