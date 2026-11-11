import type { PublicJobSummaryResource } from '@/types/public-job';

export interface JobRecommendationItem {
  job: PublicJobSummaryResource;
  matchReason: string;
  matchScore: number;
  matchedSkills?: string[];
}

export interface JobRecommendationResponse {
  items: JobRecommendationItem[];
  fallback: boolean;
  fallbackReason?: string | null;
  nudgeMessage?: string | null;
  nudgeActionUrl?: string | null;
}
