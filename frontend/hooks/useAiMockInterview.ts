import { candidateMockInterviewApi } from '@/apiRequest/ai-mock-interview';
import type {
  StartMockInterviewRequest,
  SubmitMockAnswerRequest,
  SubmitMockFollowUpRequest,
} from '@/types/ai-mock-interview';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const MOCK_INTERVIEWS_QUERY_KEY = ['candidate-mock-interviews'] as const;
export const mockInterviewDetailKey = (id: number) => ['candidate-mock-interview', id] as const;

export function useMockInterviewHistory() {
  return useQuery({
    queryKey: MOCK_INTERVIEWS_QUERY_KEY,
    queryFn: () => candidateMockInterviewApi.listHistory(),
  });
}

export function useMockInterviewDetail(id: number | null) {
  return useQuery({
    queryKey: id ? mockInterviewDetailKey(id) : ['candidate-mock-interview', 'null'],
    queryFn: () => (id ? candidateMockInterviewApi.getSessionDetail(id) : null),
    enabled: Boolean(id),
  });
}

export function useStartMockInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StartMockInterviewRequest) => candidateMockInterviewApi.startSession(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MOCK_INTERVIEWS_QUERY_KEY });
      if (data?.id) {
        queryClient.setQueryData(mockInterviewDetailKey(data.id), data);
      }
    },
  });
}

export function useSubmitMockAnswer(sessionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, payload }: { questionId: number; payload: SubmitMockAnswerRequest }) =>
      candidateMockInterviewApi.submitAnswer(sessionId, questionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mockInterviewDetailKey(sessionId) });
      queryClient.invalidateQueries({ queryKey: MOCK_INTERVIEWS_QUERY_KEY });
    },
  });
}

export function useSubmitMockFollowUp(sessionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, payload }: { questionId: number; payload: SubmitMockFollowUpRequest }) =>
      candidateMockInterviewApi.submitFollowUp(sessionId, questionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mockInterviewDetailKey(sessionId) });
      queryClient.invalidateQueries({ queryKey: MOCK_INTERVIEWS_QUERY_KEY });
    },
  });
}
