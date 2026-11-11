'use client';

import { candidateConnectApi } from '@/apiRequest/candidate-connect';
import type { ReportReasonCode } from '@/types/connect';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const CONVERSATIONS_PAGE_SIZE = 20;
const INVITATIONS_PAGE_SIZE = 20;
const MESSAGES_PAGE_SIZE = 30;
const POLL_MS = 30_000;

export const candidateConnectKeys = {
  conversations: ['connect', 'candidate', 'conversations'] as const,
  invitations: ['connect', 'candidate', 'invitations'] as const,
  messages: (connectionId: number) => ['connect', 'candidate', 'messages', connectionId] as const,
  unread: ['connect', 'candidate', 'unread'] as const,
  rulesAck: ['connect', 'candidate', 'rules-ack'] as const,
  muteStatus: ['connect', 'candidate', 'mute-status'] as const,
};

export function useCandidateConversations() {
  const query = useInfiniteQuery({
    queryKey: candidateConnectKeys.conversations,
    queryFn: ({ pageParam }) => candidateConnectApi.conversations(pageParam, CONVERSATIONS_PAGE_SIZE),
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

export function useCandidateInvitations() {
  const query = useInfiniteQuery({
    queryKey: candidateConnectKeys.invitations,
    queryFn: ({ pageParam }) => candidateConnectApi.invitations(pageParam, INVITATIONS_PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined),
    refetchInterval: POLL_MS,
  });

  return {
    invitations: query.data?.pages.flatMap((page) => page.items) ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    hasMore: query.hasNextPage,
    loadMore: query.fetchNextPage,
    isLoadingMore: query.isFetchingNextPage,
  };
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (connectionId: number) => candidateConnectApi.acceptInvitation(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateConnectKeys.invitations });
      queryClient.invalidateQueries({ queryKey: candidateConnectKeys.conversations });
      queryClient.invalidateQueries({ queryKey: candidateConnectKeys.unread });
    },
  });
}

export function useDeclineInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (connectionId: number) => candidateConnectApi.declineInvitation(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateConnectKeys.invitations });
    },
  });
}

export function useCandidateMessages(connectionId: number | null) {
  const query = useInfiniteQuery({
    queryKey: candidateConnectKeys.messages(connectionId ?? 0),
    queryFn: ({ pageParam }) => candidateConnectApi.messages(connectionId as number, pageParam, MESSAGES_PAGE_SIZE),
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

export function useCandidateSendMessage(connectionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => candidateConnectApi.sendMessage(connectionId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateConnectKeys.messages(connectionId) });
      queryClient.invalidateQueries({ queryKey: candidateConnectKeys.conversations });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: candidateConnectKeys.muteStatus });
    },
  });
}

export function useCandidateSendAttachment(connectionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, caption }: { file: File; caption?: string }) =>
      candidateConnectApi.sendAttachment(connectionId, file, caption),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateConnectKeys.messages(connectionId) });
      queryClient.invalidateQueries({ queryKey: candidateConnectKeys.conversations });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: candidateConnectKeys.muteStatus });
    },
  });
}

export function useCandidateBlock(connectionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => candidateConnectApi.block(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateConnectKeys.conversations });
    },
  });
}

export function useCandidateReport(connectionId: number) {
  return useMutation({
    mutationFn: ({ reasonCode, reasonNote }: { reasonCode: ReportReasonCode; reasonNote?: string }) =>
      candidateConnectApi.report(connectionId, reasonCode, reasonNote),
  });
}

export function useCandidateUnreadCount() {
  const query = useQuery({
    queryKey: candidateConnectKeys.unread,
    queryFn: () => candidateConnectApi.unreadCount(),
    refetchInterval: POLL_MS,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  return query.data?.total ?? 0;
}

export function useCandidateRulesAck() {
  return useQuery({
    queryKey: candidateConnectKeys.rulesAck,
    queryFn: () => candidateConnectApi.getRulesAck(),
  });
}

export function useCandidateAcknowledgeRules() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => candidateConnectApi.acknowledgeRules(),
    onSuccess: (data) => queryClient.setQueryData(candidateConnectKeys.rulesAck, data),
  });
}

export function useCandidateMuteStatus() {
  return useQuery({
    queryKey: candidateConnectKeys.muteStatus,
    queryFn: () => candidateConnectApi.getMuteStatus(),
    staleTime: 60_000,
  });
}

export function useCandidateConnectInvalidation() {
  const queryClient = useQueryClient();
  return (connectionId?: number) => {
    queryClient.invalidateQueries({ queryKey: candidateConnectKeys.conversations });
    queryClient.invalidateQueries({ queryKey: candidateConnectKeys.invitations });
    queryClient.invalidateQueries({ queryKey: candidateConnectKeys.unread });
    if (connectionId) {
      queryClient.invalidateQueries({ queryKey: candidateConnectKeys.messages(connectionId) });
    }
  };
}
