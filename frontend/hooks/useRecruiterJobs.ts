'use client';

import { recruiterJobApi, skillApi, type RecruiterJobSearchParams } from '@/apiRequest/recruiter-job';
import type { SaveJobRequest } from '@/types/recruiter-job';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const SKILL_STALE_MS = 5 * 60 * 1000;

export const recruiterJobKeys = {
  all: ['recruiter', 'jobs'] as const,
  list: (params: RecruiterJobSearchParams) => ['recruiter', 'jobs', 'list', params] as const,
  counts: ['recruiter', 'jobs', 'counts'] as const,
  detail: (id: number) => ['recruiter', 'jobs', 'detail', id] as const,
};

export function useRecruiterJobList(params: RecruiterJobSearchParams) {
  return useQuery({
    queryKey: recruiterJobKeys.list(params),
    queryFn: () => recruiterJobApi.search(params),
    placeholderData: keepPreviousData,
  });
}

export function useRecruiterJobCounts() {
  return useQuery({ queryKey: recruiterJobKeys.counts, queryFn: recruiterJobApi.counts });
}

export function useRecruiterJob(id: number | null) {
  return useQuery({
    queryKey: recruiterJobKeys.detail(id ?? 0),
    queryFn: () => recruiterJobApi.get(id as number),
    enabled: id !== null,
  });
}

export function useSkillSuggestions(query: string) {
  return useQuery({
    queryKey: ['skills', query.trim().toLowerCase()],
    queryFn: () => skillApi.suggest(query),
    staleTime: SKILL_STALE_MS,
    placeholderData: keepPreviousData,
  });
}

export function useRecruiterJobMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: recruiterJobKeys.all });

  return {
    create: useMutation({ mutationFn: (data: SaveJobRequest) => recruiterJobApi.create(data), onSuccess: invalidate }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: number; data: SaveJobRequest }) => recruiterJobApi.update(id, data),
      onSuccess: invalidate,
    }),
    publish: useMutation({ mutationFn: recruiterJobApi.publish, onSuccess: invalidate }),
    pause: useMutation({ mutationFn: recruiterJobApi.pause, onSuccess: invalidate }),
    resume: useMutation({ mutationFn: recruiterJobApi.resume, onSuccess: invalidate }),
    close: useMutation({ mutationFn: recruiterJobApi.close, onSuccess: invalidate }),
    retop: useMutation({
      mutationFn: recruiterJobApi.retop,
      onSuccess: () => {
        invalidate();
        void queryClient.invalidateQueries({ queryKey: ['recruiter', 'entitlements'] });
      },
    }),
    remove: useMutation({ mutationFn: recruiterJobApi.remove, onSuccess: invalidate }),
  };
}
