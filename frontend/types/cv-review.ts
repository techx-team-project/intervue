export interface CvReviewComment {
  section: string;
  quote: string;
  problem: string;
  fix: string;
}

export interface JobRequirementMatch {
  requirement: string;
  status: 'MATCH' | 'PARTIAL' | 'MISSING' | string;
  cvEvidence: string;
  explanation: string;
  fitScore: number;
  improvementTip: string;
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
  reviewLevel?: number;
  jobId?: number;
  jobTitle?: string;
  companyName?: string;
  jobFitScore?: number;
  requirementMatches?: JobRequirementMatch[];
  keyStrengths?: string[];
  gapAnalysis?: string[];
  tailoringTips?: string[];
  chargedCredits?: number;
  refunded?: boolean;
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
  jobId?: number;
  level?: number;
}

export interface CandidateCreditTransaction {
  id: number;
  amount: number;
  balanceAfter: number;
  type: 'CHARGE' | 'REFUND' | 'TOPUP' | 'INITIAL_GRANT';
  feature: string;
  referenceId?: string;
  description: string;
  createdAt: string;
}

export interface CandidateCreditSummary {
  candidateId: number;
  currentBalance: number;
  totalCharged: number;
  totalRefunded: number;
  recentTransactions: CandidateCreditTransaction[];
}

export interface TopupCreditsRequest {
  amount: number;
}
