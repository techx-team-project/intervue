'use client';

import { analyzeApplicationResume, getResumeMatchQuota } from '@/apiRequest/ai';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const quotaKey = ['recruiter', 'ai', 'resume-match', 'quota'] as const;

export function useResumeMatchQuota() {
  return useQuery({ queryKey: quotaKey, queryFn: getResumeMatchQuota });
}

export function useAnalyzeApplicationResume(applicationId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => analyzeApplicationResume(applicationId),
    onSettled: () => queryClient.invalidateQueries({ queryKey: quotaKey }),
  });
}
