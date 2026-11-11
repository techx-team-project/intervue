'use client';

import { candidateInterviewApi, recruiterInterviewApi } from '@/apiRequest/interview';
import type { InterviewFormValues, InterviewStatus } from '@/types/interview';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const INTERVIEW_COUNTS_POLL_MS = 30_000;

export const interviewKeys = {
  recruiter: ['recruiter', 'interviews'] as const,
  recruiterList: (page: number, status?: InterviewStatus) => ['recruiter', 'interviews', 'list', page, status] as const,
  recruiterRescheduleCount: ['recruiter', 'interviews', 'reschedule-count'] as const,
  forApplication: (applicationId: number) => ['recruiter', 'interviews', 'application', applicationId] as const,
  candidate: ['candidate', 'interviews'] as const,
  candidateList: (page: number) => ['candidate', 'interviews', 'list', page] as const,
};

export function useRecruiterInterviews(page: number, size: number, status?: InterviewStatus) {
  return useQuery({
    queryKey: interviewKeys.recruiterList(page, status),
    queryFn: () => recruiterInterviewApi.search(page, size, status),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}

export function useRecruiterRescheduleCount(enabled = true) {
  const query = useQuery({
    queryKey: interviewKeys.recruiterRescheduleCount,
    queryFn: () => recruiterInterviewApi.search(0, 1, 'RESCHEDULE_REQUESTED'),
    enabled,
    refetchInterval: INTERVIEW_COUNTS_POLL_MS,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  return query.data?.totalItems ?? 0;
}

export function useApplicationInterviews(applicationId: number) {
  return useQuery({
    queryKey: interviewKeys.forApplication(applicationId),
    queryFn: () => recruiterInterviewApi.listForApplication(applicationId),
  });
}

export function useRecruiterInterviewMutations(applicationId: number) {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: interviewKeys.recruiter });
    queryClient.invalidateQueries({ queryKey: ['recruiter', 'applications'] });
  };

  const schedule = useMutation({
    mutationFn: (values: InterviewFormValues) => recruiterInterviewApi.schedule(applicationId, values),
    onSuccess: refresh,
  });
  const update = useMutation({
    mutationFn: ({ id, values }: { id: number; values: InterviewFormValues }) =>
      recruiterInterviewApi.update(id, values),
    onSuccess: refresh,
  });
  const acceptProposal = useMutation({
    mutationFn: (id: number) => recruiterInterviewApi.acceptProposal(id),
    onSuccess: refresh,
  });
  const cancel = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => recruiterInterviewApi.cancel(id, reason),
    onSuccess: refresh,
  });

  return { schedule, update, acceptProposal, cancel };
}

export function useCandidateInterviews(page: number, size: number) {
  return useQuery({
    queryKey: interviewKeys.candidateList(page),
    queryFn: () => candidateInterviewApi.list(page, size),
    placeholderData: keepPreviousData,
  });
}

export function useCandidateInterviewMutations() {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: interviewKeys.candidate });

  const confirm = useMutation({ mutationFn: (id: number) => candidateInterviewApi.confirm(id), onSuccess: refresh });
  const decline = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => candidateInterviewApi.decline(id, reason),
    onSuccess: refresh,
  });
  const requestReschedule = useMutation({
    mutationFn: ({ id, proposedStartsAt, message }: { id: number; proposedStartsAt: string; message?: string }) =>
      candidateInterviewApi.requestReschedule(id, proposedStartsAt, message),
    onSuccess: refresh,
  });

  return { confirm, decline, requestReschedule };
}
