'use client';

import { recruiterApplicationApi, type ReviewSearchParams } from '@/apiRequest/recruiter-application';
import type { ReviewApplication } from '@/types/application-review';
import type { CandidateApplicationStatus } from '@/types/candidate-application';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const APPLICATION_COUNTS_POLL_MS = 30_000;

export const reviewKeys = {
  all: ['recruiter', 'applications'] as const,
  list: (params: ReviewSearchParams) => ['recruiter', 'applications', 'list', params] as const,
  counts: (jobId?: number) => ['recruiter', 'applications', 'counts', jobId ?? 0] as const,
  detail: (id: number) => ['recruiter', 'applications', 'detail', id] as const,
};

export function useReviewApplicationList(params: ReviewSearchParams) {
  return useQuery({
    queryKey: reviewKeys.list(params),
    queryFn: () => recruiterApplicationApi.search(params),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}

export function useReviewCounts(jobId?: number, enabled = true) {
  return useQuery({
    queryKey: reviewKeys.counts(jobId),
    queryFn: () => recruiterApplicationApi.counts(jobId),
    enabled,
    refetchInterval: APPLICATION_COUNTS_POLL_MS,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}

export function useReviewApplication(id: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: reviewKeys.detail(id),
    queryFn: async () => {
      const application = await recruiterApplicationApi.open(id);
      void queryClient.invalidateQueries({ queryKey: ['recruiter', 'applications', 'counts'] });
      void queryClient.invalidateQueries({ queryKey: ['recruiter', 'applications', 'list'] });
      return application;
    },
    staleTime: 0,
  });
}

export function useReviewMutations(id: number) {
  const queryClient = useQueryClient();
  const apply = (updated: ReviewApplication) => {
    queryClient.setQueryData(reviewKeys.detail(id), updated);
    queryClient.invalidateQueries({ queryKey: ['recruiter', 'applications', 'list'] });
    queryClient.invalidateQueries({ queryKey: ['recruiter', 'applications', 'counts'] });
  };

  const changeStatus = useMutation({
    mutationFn: ({ status, note }: { status: CandidateApplicationStatus; note?: string }) =>
      recruiterApplicationApi.changeStatus(id, status, note),
    onSuccess: apply,
  });
  const addNote = useMutation({
    mutationFn: (content: string) => recruiterApplicationApi.addNote(id, content),
    onSuccess: apply,
  });
  const deleteNote = useMutation({
    mutationFn: (noteId: number) => recruiterApplicationApi.deleteNote(id, noteId),
    onSuccess: apply,
  });

  return { changeStatus, addNote, deleteNote };
}
