import type { PublicCompanyResource } from '@/types/company';
import type { PublicJobSummaryResource } from '@/types/public-job';

export interface SavedJob {
  jobId: number;
  savedAt: string;
  job?: PublicJobSummaryResource;
}

export interface FollowedCompany {
  companyId: number;
  followedAt: string;
  company: PublicCompanyResource;
}
