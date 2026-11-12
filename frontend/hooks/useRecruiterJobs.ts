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
  history: (id: number, page: number) => ['recruiter', 'jobs', 'history', id, page] as const,
  quota: ['recruiter', 'jobs', 'quota'] as const,
  similar: (title: string, city: string, excludeId?: number) =>
    ['recruiter', 'jobs', 'similar', title, city, excludeId] as const,
  stats: (id: number, days: number) => ['recruiter', 'jobs', 'stats', id, days] as const,
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

export function useJobHistory(id: number | null, page: number, size: number) {
  return useQuery({
    queryKey: recruiterJobKeys.history(id ?? 0, page),
    queryFn: () => recruiterJobApi.history(id as number, page, size),
    enabled: id !== null,
    placeholderData: keepPreviousData,
  });
}

export function useJobStats(id: number | null, days: number) {
  return useQuery({
    queryKey: recruiterJobKeys.stats(id ?? 0, days),
    queryFn: () => recruiterJobApi.stats(id as number, days),
    enabled: id !== null,
    placeholderData: keepPreviousData,
  });
}

export function useJobQuota() {
  return useQuery({ queryKey: recruiterJobKeys.quota, queryFn: recruiterJobApi.quota });
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
    renew: useMutation({
      mutationFn: ({ id, deadline }: { id: number; deadline: string }) => recruiterJobApi.renew(id, deadline),
      onSuccess: () => {
        invalidate();
        void queryClient.invalidateQueries({ queryKey: ['recruiter', 'entitlements'] });
      },
    }),
    remove: useMutation({ mutationFn: recruiterJobApi.remove, onSuccess: invalidate }),
  };
}

export function useSimilarJobs(title: string, city: string, excludeId: number | undefined, enabled: boolean) {
  return useQuery({
    queryKey: recruiterJobKeys.similar(title, city, excludeId),
    queryFn: () => recruiterJobApi.similar(title, city, excludeId),
    enabled: enabled && title.trim() !== '' && city.trim() !== '',
  });
}
