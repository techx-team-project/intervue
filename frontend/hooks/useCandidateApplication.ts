'use client';

import { candidateApplicationApi } from '@/apiRequest/candidate-application';
import type { SaveApplicationPayload } from '@/types/candidate-application';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const formKey = (jobId: number) => ['candidate', 'application-form', jobId] as const;

export function useApplyForm(jobId: number, enabled: boolean) {
  return useQuery({
    queryKey: formKey(jobId),
    queryFn: () => candidateApplicationApi.form(jobId),
    enabled,
    staleTime: 0,
  });
}

export function useApplicationMutations(jobId: number) {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: formKey(jobId) });

  const saveDraft = useMutation({
    mutationFn: (payload: SaveApplicationPayload) => candidateApplicationApi.saveDraft(payload),
  });
  const submit = useMutation({
    mutationFn: (payload: SaveApplicationPayload) => candidateApplicationApi.submit(payload),
    onSuccess: refresh,
  });
  const withdraw = useMutation({
    mutationFn: (id: number) => candidateApplicationApi.withdraw(id),
    onSuccess: refresh,
  });
  const reapply = useMutation({
    mutationFn: ({ id, resumeId }: { id: number; resumeId: number }) => candidateApplicationApi.reapply(id, resumeId),
    onSuccess: refresh,
  });

  return { saveDraft, submit, withdraw, reapply };
}
