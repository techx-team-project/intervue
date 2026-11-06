export interface CvReviewComment {
  section: string;
  quote: string;
  problem: string;
  fix: string;
}

export interface CvReviewResult {
  id?: number;
  candidateProfileId?: number;
  fileHash: string;
  overallScore: number;
  summary: string;
  comments: CvReviewComment[];
  modelVersion: string;
  promptVersion: string;
  fromCache: boolean;
  createdAt?: string;
}

export interface CvReviewQuota {
  usedToday: number;
  remaining: number;
  maxDaily: number;
  resetAt: string;
}

export interface CvReviewRequest {
  resumeId?: number;
  cvText?: string;
  targetPosition?: string;
}
