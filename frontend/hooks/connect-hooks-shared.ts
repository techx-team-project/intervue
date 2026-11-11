'use client';

import type {
  createParticipantConnectApi,
  EditMessageInput,
  SendAttachmentInput,
  SendMessageInput,
} from '@/apiRequest/connect-client';
import {
  addOptimisticMessageToCache,
  applyIncomingMessageSummaryPatch,
  buildConnectKeys,
  markOptimisticFailedInCache,
  mergeAndSortMessages,
  patchConversationSummaryInCache,
  patchMessageReactionsInCache,
  removeMessageFromCache,
  upsertMessageInCache,
} from '@/hooks/connect-cache';
import { postConnectBroadcast } from '@/hooks/useConnectStream';
import { useAuthStore } from '@/store/auth.store';
import type { ConnectMessage, ConnectPortal, ReportReasonCode, UnsendScope } from '@/types/connect';
import { extractFirstHttpUrl } from '@/utils/connect-chat';
import { getErrorMessage } from '@/utils/error';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const CONVERSATIONS_PAGE_SIZE = 20;
const MESSAGES_PAGE_SIZE = 30;
const POLL_MS = 30_000;

export function createParticipantConnectHooks(
  portal: ConnectPortal,
  api: ReturnType<typeof createParticipantConnectApi>,
) {
  const keys = buildConnectKeys(portal);
  const actorType = portal === 'recruiter' ? 'RECRUITER' : 'CANDIDATE';

  function useConversationsList() {
    const query = useInfiniteQuery({
      queryKey: keys.conversations,
      queryFn: ({ pageParam }) => api.conversations(pageParam, CONVERSATIONS_PAGE_SIZE),
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

  function useSingleConversation(connectionId: number | null) {
    return useQuery({
      queryKey: keys.conversation(connectionId ?? 0),
      queryFn: () => api.conversation(connectionId as number),
      enabled: connectionId !== null && connectionId > 0,
      retry: false,
    });
  }

  function useConversationByKey(publicId: string | null) {
    return useQuery({
      queryKey: keys.conversationByKey(publicId ?? ''),
      queryFn: () => api.conversation(publicId as string),
      enabled: Boolean(publicId),
      retry: false,
    });
  }

  function useThreadMessages(connectionId: number | null) {
    const query = useInfiniteQuery({
      queryKey: keys.messages(connectionId ?? 0),
      queryFn: ({ pageParam }) => api.messages(connectionId as number, 0, MESSAGES_PAGE_SIZE, pageParam),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) => {
        if (lastPage.page + 1 >= lastPage.totalPages || lastPage.items.length === 0) return undefined;
        let minId = Infinity;
        for (const item of lastPage.items) {
          if (item.id > 0 && item.id < minId) minId = item.id;
        }
        return Number.isFinite(minId) ? minId : undefined;
      },
      enabled: connectionId !== null,
    });

    return {
      messages: mergeAndSortMessages(query.data?.pages),
      isLoading: query.isLoading,
      isError: query.isError,
      hasOlder: query.hasNextPage,
      loadOlder: query.fetchNextPage,
      isLoadingOlder: query.isFetchingNextPage,
      refetch: query.refetch,
    };
  }

  function useSendTextMessage(connectionId: number) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (input: SendMessageInput) => {
        const user = useAuthStore.getState()[portal].user;
        const tempId = -Date.now() - Math.floor(Math.random() * 1000);
        if (input.clientMessageId) {
          const url = input.suppressLinkPreview ? null : extractFirstHttpUrl(input.body);
          const optimistic: ConnectMessage = {
            id: tempId,
            connectionId,
            senderType: actorType,
            senderId: user?.id ?? 0,
            senderName: user?.name ?? 'You',
            clientMessageId: input.clientMessageId,
            replyToMessageId: input.replyToMessageId,
            messageType: url ? 'LINK' : 'TEXT',
            body: input.body,
            linkUrl: url ?? undefined,
            createdAt: new Date().toISOString(),
            reactions: [],
            optimisticStatus: 'SENDING',
          };
          addOptimisticMessageToCache(queryClient, portal, optimistic);
        }
        return api.sendMessage(connectionId, input);
      },
      onSuccess: (created) => {
        upsertMessageInCache(queryClient, portal, created);
        applyIncomingMessageSummaryPatch(queryClient, portal, created, false);
        postConnectBroadcast({ type: 'INVALIDATE', portal, connectionId });
      },
      onError: (error, variables) => {
        if (variables.clientMessageId) {
          markOptimisticFailedInCache(
            queryClient,
            portal,
            connectionId,
            variables.clientMessageId,
            getErrorMessage(error),
          );
        }
        void queryClient.invalidateQueries({ queryKey: keys.muteStatus });
      },
    });
  }

  function useSendMediaAttachment(connectionId: number) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (input: SendAttachmentInput) => {
        const user = useAuthStore.getState()[portal].user;
        const tempId = -Date.now() - Math.floor(Math.random() * 1000);
        if (input.clientMessageId) {
          const isImage = input.file.type === 'image/jpeg' || input.file.type === 'image/png';
          const optimistic: ConnectMessage = {
            id: tempId,
            connectionId,
            senderType: actorType,
            senderId: user?.id ?? 0,
            senderName: user?.name ?? 'You',
            clientMessageId: input.clientMessageId,
            replyToMessageId: input.replyToMessageId,
            messageType: isImage ? 'IMAGE' : 'FILE',
            body: input.caption?.trim() || undefined,
            attachmentFileName: input.file.name,
            attachmentContentType: input.file.type,
            attachmentFileSizeBytes: input.file.size,
            attachmentUrl: isImage ? URL.createObjectURL(input.file) : undefined,
            createdAt: new Date().toISOString(),
            reactions: [],
            optimisticStatus: 'SENDING',
            optimisticFile: input.file,
          };
          addOptimisticMessageToCache(queryClient, portal, optimistic);
        }
        return api.sendAttachment(connectionId, input);
      },
      onSuccess: (created) => {
        upsertMessageInCache(queryClient, portal, created);
        applyIncomingMessageSummaryPatch(queryClient, portal, created, false);
        postConnectBroadcast({ type: 'INVALIDATE', portal, connectionId });
      },
      onError: (error, variables) => {
        if (variables.clientMessageId) {
          markOptimisticFailedInCache(
            queryClient,
            portal,
            connectionId,
            variables.clientMessageId,
            getErrorMessage(error),
          );
        }
        void queryClient.invalidateQueries({ queryKey: keys.muteStatus });
      },
    });
  }

  function useEditTextMessage(connectionId: number) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ messageId, payload }: { messageId: number; payload: EditMessageInput }) =>
        api.editMessage(connectionId, messageId, payload),
      onSuccess: (updated) => {
        upsertMessageInCache(queryClient, portal, updated);
        void queryClient.invalidateQueries({ queryKey: keys.conversations });
        void queryClient.invalidateQueries({ queryKey: keys.conversation(connectionId) });
        postConnectBroadcast({ type: 'INVALIDATE', portal, connectionId });
      },
      onError: () => {
        void queryClient.invalidateQueries({ queryKey: keys.muteStatus });
      },
    });
  }

  function useUnsendMessageMutation(connectionId: number) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ messageId, scope }: { messageId: number; scope: UnsendScope }) =>
        api.unsendMessage(connectionId, messageId, scope),
      onSuccess: (updated, variables) => {
        if (variables.scope === 'ME') {
          removeMessageFromCache(queryClient, portal, connectionId, variables.messageId);
        } else if (updated) {
          upsertMessageInCache(queryClient, portal, updated);
        }
        void queryClient.invalidateQueries({ queryKey: keys.conversations });
        void queryClient.invalidateQueries({ queryKey: keys.conversation(connectionId) });
        postConnectBroadcast({ type: 'INVALIDATE', portal, connectionId });
      },
    });
  }

  function useReactMutation(connectionId: number) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ messageId, emoji }: { messageId: number; emoji: string }) =>
        api.reactToMessage(connectionId, messageId, emoji),
      onSuccess: (reactions, variables) => {
        patchMessageReactionsInCache(queryClient, portal, connectionId, variables.messageId, reactions);
        postConnectBroadcast({ type: 'INVALIDATE', portal, connectionId });
      },
    });
  }

  function useMarkReadMutation(connectionId: number) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (lastReadMessageId?: number) => api.markAsRead(connectionId, lastReadMessageId),
      onSuccess: () => {
        patchConversationSummaryInCache(queryClient, portal, connectionId, (current) => ({
          ...current,
          unreadCount: 0,
        }));
        void queryClient.invalidateQueries({ queryKey: keys.unread });
        postConnectBroadcast({ type: 'READ', portal, connectionId });
      },
    });
  }

  function useTypingMutation(connectionId: number) {
    return useMutation({
      mutationFn: (typing: boolean) => api.sendTyping(connectionId, typing),
    });
  }

  function useBlockMutation(connectionId: number) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: () => api.block(connectionId),
      onSuccess: () => {
        patchConversationSummaryInCache(queryClient, portal, connectionId, (current) => ({
          ...current,
          status: 'BLOCKED',
          blockedByActorType: actorType,
        }));
        void queryClient.invalidateQueries({ queryKey: keys.conversations });
        void queryClient.invalidateQueries({ queryKey: keys.conversation(connectionId) });
        postConnectBroadcast({ type: 'INVALIDATE', portal, connectionId });
      },
    });
  }

  function useUnblockMutation(connectionId: number) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: () => api.unblock(connectionId),
      onSuccess: () => {
        patchConversationSummaryInCache(queryClient, portal, connectionId, (current) => ({
          ...current,
          status: 'ACCEPTED',
          blockedByActorType: undefined,
        }));
        void queryClient.invalidateQueries({ queryKey: keys.conversations });
        void queryClient.invalidateQueries({ queryKey: keys.conversation(connectionId) });
        postConnectBroadcast({ type: 'INVALIDATE', portal, connectionId });
      },
    });
  }

  function useReportMutation(connectionId: number) {
    return useMutation({
      mutationFn: ({ reasonCode, reasonNote }: { reasonCode: ReportReasonCode; reasonNote?: string }) =>
        api.report(connectionId, reasonCode, reasonNote),
    });
  }

  function useUnreadTotal(enabled = true) {
    const query = useQuery({
      queryKey: keys.unread,
      queryFn: () => api.unreadCount(),
      enabled,
      refetchInterval: POLL_MS,
      refetchOnWindowFocus: true,
      staleTime: 0,
    });
    return query.data?.total ?? 0;
  }

  function useRulesAckQuery() {
    return useQuery({
      queryKey: keys.rulesAck,
      queryFn: () => api.getRulesAck(),
    });
  }

  function useAcknowledgeRulesMutation() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: () => api.acknowledgeRules(),
      onSuccess: (data) => queryClient.setQueryData(keys.rulesAck, data),
    });
  }

  function useMuteStatusQuery() {
    return useQuery({
      queryKey: keys.muteStatus,
      queryFn: () => api.getMuteStatus(),
      staleTime: 60_000,
    });
  }

  function useInvalidateAll() {
    const queryClient = useQueryClient();
    return (connectionId?: number) => {
      void queryClient.invalidateQueries({ queryKey: keys.conversations });
      void queryClient.invalidateQueries({ queryKey: keys.invitations });
      void queryClient.invalidateQueries({ queryKey: keys.unread });
      if (connectionId) {
        void queryClient.invalidateQueries({ queryKey: keys.messages(connectionId) });
        void queryClient.invalidateQueries({ queryKey: keys.conversation(connectionId) });
        void queryClient.invalidateQueries({ queryKey: keys.conversationByKeyPrefix });
      }
    };
  }

  return {
    keys,
    useConversationsList,
    useSingleConversation,
    useConversationByKey,
    useThreadMessages,
    useSendTextMessage,
    useSendMediaAttachment,
    useEditTextMessage,
    useUnsendMessageMutation,
    useReactMutation,
    useMarkReadMutation,
    useTypingMutation,
    useBlockMutation,
    useUnblockMutation,
    useReportMutation,
    useUnreadTotal,
    useRulesAckQuery,
    useAcknowledgeRulesMutation,
    useMuteStatusQuery,
    useInvalidateAll,
  };
}
