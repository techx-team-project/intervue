'use client';

import { candidateConnectApi } from '@/apiRequest/candidate-connect';
import { patchConversationSummaryInCache } from '@/hooks/connect-cache';
import { createParticipantConnectHooks } from '@/hooks/connect-hooks-shared';
import { postConnectBroadcast } from '@/hooks/useConnectStream';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const INVITATIONS_PAGE_SIZE = 20;
const POLL_MS = 30_000;

const shared = createParticipantConnectHooks('candidate', candidateConnectApi);

export const candidateConnectKeys = shared.keys;
export const useCandidateConversations = shared.useConversationsList;
export const useCandidateConversation = shared.useSingleConversation;
export const useCandidateMessages = shared.useThreadMessages;
export const useCandidateSendMessage = shared.useSendTextMessage;
export const useCandidateSendAttachment = shared.useSendMediaAttachment;
export const useCandidateEditMessage = shared.useEditTextMessage;
export const useCandidateUnsendMessage = shared.useUnsendMessageMutation;
export const useCandidateReactMessage = shared.useReactMutation;
export const useCandidateMarkRead = shared.useMarkReadMutation;
export const useCandidateSendTyping = shared.useTypingMutation;
export const useCandidateBlock = shared.useBlockMutation;
export const useCandidateUnblock = shared.useUnblockMutation;
export const useCandidateReport = shared.useReportMutation;
export const useCandidateUnreadCount = shared.useUnreadTotal;
export const useCandidateRulesAck = shared.useRulesAckQuery;
export const useCandidateAcknowledgeRules = shared.useAcknowledgeRulesMutation;
export const useCandidateMuteStatus = shared.useMuteStatusQuery;
export const useCandidateConnectInvalidation = shared.useInvalidateAll;

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
    onSuccess: (_data, connectionId) => {
      patchConversationSummaryInCache(queryClient, 'candidate', connectionId, (current) => ({
        ...current,
        status: 'ACCEPTED',
        unreadCount: 0,
      }));
      void queryClient.invalidateQueries({ queryKey: candidateConnectKeys.invitations });
      void queryClient.invalidateQueries({ queryKey: candidateConnectKeys.conversations });
      void queryClient.invalidateQueries({ queryKey: candidateConnectKeys.conversation(connectionId) });
      void queryClient.invalidateQueries({ queryKey: candidateConnectKeys.unread });
      postConnectBroadcast({ type: 'INVALIDATE', portal: 'candidate', connectionId });
    },
  });
}

export function useDeclineInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (connectionId: number) => candidateConnectApi.declineInvitation(connectionId),
    onSuccess: (_data, connectionId) => {
      patchConversationSummaryInCache(queryClient, 'candidate', connectionId, (current) => ({
        ...current,
        status: 'DECLINED',
        unreadCount: 0,
      }));
      void queryClient.invalidateQueries({ queryKey: candidateConnectKeys.invitations });
      void queryClient.invalidateQueries({ queryKey: candidateConnectKeys.conversations });
      void queryClient.invalidateQueries({ queryKey: candidateConnectKeys.conversation(connectionId) });
      void queryClient.invalidateQueries({ queryKey: candidateConnectKeys.unread });
      postConnectBroadcast({ type: 'INVALIDATE', portal: 'candidate', connectionId });
    },
  });
}
