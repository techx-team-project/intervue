import { request } from '@/apiRequest/http';
import type { JobRecommendationResponse } from '@/types/job-recommendation';

export const jobRecommendationApi = {
  getRecommendations: (limit = 6) => request<JobRecommendationResponse>(`/jobs/recommendations?limit=${limit}`),
};
