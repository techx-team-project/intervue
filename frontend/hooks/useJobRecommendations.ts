import { jobRecommendationApi } from '@/apiRequest/job-recommendation';
import { useQuery } from '@tanstack/react-query';

export function useJobRecommendations(limit = 6) {
  return useQuery({
    queryKey: ['job-recommendations', limit],
    queryFn: () => jobRecommendationApi.getRecommendations(limit),
    staleTime: 60 * 1000,
  });
}
