'use client';

import { recruiterConnectApi } from '@/apiRequest/recruiter-connect';
import type { ReportReasonCode } from '@/types/connect';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const CONVERSATIONS_PAGE_SIZE = 20;
const MESSAGES_PAGE_SIZE = 30;
const POLL_MS = 30_000;

export const recruiterConnectKeys = {
  conversations: ['connect', 'recruiter', 'conversations'] as const,
  messages: (connectionId: number) => ['connect', 'recruiter', 'messages', connectionId] as const,
  unread: ['connect', 'recruiter', 'unread'] as const,
  rulesAck: ['connect', 'recruiter', 'rules-ack'] as const,
  eligibleCandidates: (search: string) => ['connect', 'recruiter', 'eligible-candidates', search] as const,
};

export function useConversations() {
  const query = useInfiniteQuery({
    queryKey: recruiterConnectKeys.conversations,
    queryFn: ({ pageParam }) => recruiterConnectApi.conversations(pageParam, CONVERSATIONS_PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined),
    refetchInterval: POLL_MS,
  });

  return {
    conversations: query.data?.pages.flatMap((page) => page.items) ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    hasMore: query.hasNextPage,
    loadMore: query.fetchNextPage,
    isLoadingMore: query.isFetchingNextPage,
  };
}

export function useConversationMessages(connectionId: number | null) {
  const query = useInfiniteQuery({
    queryKey: recruiterConnectKeys.messages(connectionId ?? 0),
    queryFn: ({ pageParam }) => recruiterConnectApi.messages(connectionId as number, pageParam, MESSAGES_PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined),
    enabled: connectionId !== null,
  });

  return {
    messages: query.data?.pages.flatMap((page) => page.items) ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    hasOlder: query.hasNextPage,
    loadOlder: query.fetchNextPage,
    isLoadingOlder: query.isFetchingNextPage,
  };
}

export function useSendMessage(connectionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => recruiterConnectApi.sendMessage(connectionId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruiterConnectKeys.messages(connectionId) });
      queryClient.invalidateQueries({ queryKey: recruiterConnectKeys.conversations });
    },
  });
}

export function useSendAttachment(connectionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, caption }: { file: File; caption?: string }) =>
      recruiterConnectApi.sendAttachment(connectionId, file, caption),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruiterConnectKeys.messages(connectionId) });
      queryClient.invalidateQueries({ queryKey: recruiterConnectKeys.conversations });
    },
  });
}

export function useBlockConversation(connectionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => recruiterConnectApi.block(connectionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recruiterConnectKeys.conversations }),
  });
}

export function useReportConversation(connectionId: number) {
  return useMutation({
    mutationFn: ({ reasonCode, reasonNote }: { reasonCode: ReportReasonCode; reasonNote?: string }) =>
      recruiterConnectApi.report(connectionId, reasonCode, reasonNote),
  });
}

export function useConnectUnreadCount() {
  const query = useQuery({
    queryKey: recruiterConnectKeys.unread,
    queryFn: () => recruiterConnectApi.unreadCount(),
    refetchInterval: POLL_MS,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  return query.data?.total ?? 0;
}

export function useRulesAck() {
  return useQuery({
    queryKey: recruiterConnectKeys.rulesAck,
    queryFn: () => recruiterConnectApi.getRulesAck(),
  });
}

export function useAcknowledgeRules() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => recruiterConnectApi.acknowledgeRules(),
    onSuccess: (data) => queryClient.setQueryData(recruiterConnectKeys.rulesAck, data),
  });
}

export function useEligibleCandidates(search: string) {
  const query = useQuery({
    queryKey: recruiterConnectKeys.eligibleCandidates(search),
    queryFn: () => recruiterConnectApi.eligibleCandidates(search || undefined, 0, 10),
  });

  return {
    candidates: query.data?.items ?? [],
    isLoading: query.isLoading,
  };
}

export function useSendInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ candidateId, message }: { candidateId: number; message: string }) =>
      recruiterConnectApi.sendInvitation(candidateId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruiterConnectKeys.conversations });
      queryClient.invalidateQueries({ queryKey: ['connect', 'recruiter', 'eligible-candidates'] });
    },
  });
}

export function useConnectInvalidation() {
  const queryClient = useQueryClient();
  return (connectionId?: number) => {
    queryClient.invalidateQueries({ queryKey: recruiterConnectKeys.conversations });
    queryClient.invalidateQueries({ queryKey: recruiterConnectKeys.unread });
    if (connectionId) {
      queryClient.invalidateQueries({ queryKey: recruiterConnectKeys.messages(connectionId) });
    }
  };
}
