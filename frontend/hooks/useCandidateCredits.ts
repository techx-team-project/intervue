import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCandidateCredits, topupCandidateCredits } from '@/apiRequest/candidate-credits';

export const CANDIDATE_CREDITS_QUERY_KEY = ['candidate-credits'] as const;

export function useCandidateCredits(enabled = true) {
  return useQuery({
    queryKey: CANDIDATE_CREDITS_QUERY_KEY,
    queryFn: () => getCandidateCredits(),
    enabled,
    staleTime: 30_000,
  });
}

export function useTopupCandidateCredits() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => topupCandidateCredits(amount),
    onSuccess: (data) => {
      queryClient.setQueryData(CANDIDATE_CREDITS_QUERY_KEY, data);
    },
  });
}
