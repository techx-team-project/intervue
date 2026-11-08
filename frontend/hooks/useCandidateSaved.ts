'use client';

import { companyFollowApi, savedJobApi } from '@/apiRequest/candidate-saved';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/error';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const savedKeys = {
  jobIds: ['candidate', 'saved-jobs', 'ids'] as const,
  jobList: (page: number) => ['candidate', 'saved-jobs', 'list', page] as const,
  companyIds: ['candidate', 'followed-companies', 'ids'] as const,
  companyList: (page: number) => ['candidate', 'followed-companies', 'list', page] as const,
};

export function useIsCandidate() {
  const { isAuthenticated, hasRole } = useAuth();
  return isAuthenticated && hasRole('CANDIDATE');
}

export function useSavedJobIds() {
  const enabled = useIsCandidate();
  return useQuery({ queryKey: savedKeys.jobIds, queryFn: savedJobApi.ids, enabled, staleTime: 60_000 });
}

export function useFollowedCompanyIds() {
  const enabled = useIsCandidate();
  return useQuery({ queryKey: savedKeys.companyIds, queryFn: companyFollowApi.ids, enabled, staleTime: 60_000 });
}

export function useSavedJobs(page: number, size: number) {
  return useQuery({
    queryKey: savedKeys.jobList(page),
    queryFn: () => savedJobApi.list(page, size),
    placeholderData: keepPreviousData,
  });
}

export function useFollowedCompanies(page: number, size: number) {
  return useQuery({
    queryKey: savedKeys.companyList(page),
    queryFn: () => companyFollowApi.list(page, size),
    placeholderData: keepPreviousData,
  });
}

function useIdToggle(
  idsKey: readonly string[],
  listPrefix: readonly string[],
  add: (id: number) => Promise<unknown>,
  remove: (id: number) => Promise<unknown>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => (active ? add(id) : remove(id)),
    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({ queryKey: idsKey });
      const previous = queryClient.getQueryData<number[]>(idsKey);
      queryClient.setQueryData<number[]>(idsKey, (current = []) =>
        active ? [...new Set([...current, id])] : current.filter((value) => value !== id),
      );
      return { previous };
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(idsKey, context?.previous);
      toast.error(getErrorMessage(error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: idsKey });
      queryClient.invalidateQueries({ queryKey: listPrefix });
    },
  });
}

export function useToggleSavedJob() {
  return useIdToggle(savedKeys.jobIds, ['candidate', 'saved-jobs', 'list'], savedJobApi.save, savedJobApi.remove);
}

export function useToggleFollowCompany() {
  return useIdToggle(
    savedKeys.companyIds,
    ['candidate', 'followed-companies', 'list'],
    companyFollowApi.follow,
    companyFollowApi.unfollow,
  );
}
