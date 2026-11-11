import type { Page } from '@/types/api';
import type {
  ConnectActorType,
  ConnectMessage,
  ConnectPortal,
  ConversationSummary,
  MessageReaction,
} from '@/types/connect';
import { getMessagePreviewText } from '@/utils/connect-chat';
import type { InfiniteData, QueryClient } from '@tanstack/react-query';

export function buildConnectKeys(portal: ConnectPortal) {
  return {
    conversations: ['connect', portal, 'conversations'] as const,
    conversation: (connectionId: number) => ['connect', portal, 'conversation', connectionId] as const,
    invitations: ['connect', portal, 'invitations'] as const,
    messages: (connectionId: number) => ['connect', portal, 'messages', connectionId] as const,
    unread: ['connect', portal, 'unread'] as const,
    rulesAck: ['connect', portal, 'rules-ack'] as const,
    muteStatus: ['connect', portal, 'mute-status'] as const,
  };
}

export type MessagesInfiniteData = InfiniteData<Page<ConnectMessage>, number | undefined>;
export type ConversationsInfiniteData = InfiniteData<Page<ConversationSummary>, number>;

export function mergeAndSortMessages(pages?: Page<ConnectMessage>[]): ConnectMessage[] {
  if (!pages || pages.length === 0) return [];
  const flat = pages.flatMap((page) => page.items);
  const byId = new Map<number, ConnectMessage>();
  const clientIdsWithServerMsg = new Set<string>();
  const optimistic: ConnectMessage[] = [];

  for (const item of flat) {
    if (item.id > 0) {
      byId.set(item.id, item);
      if (item.clientMessageId) {
        clientIdsWithServerMsg.add(item.clientMessageId);
      }
    }
  }

  for (const item of flat) {
    if (item.id < 0 && (!item.clientMessageId || !clientIdsWithServerMsg.has(item.clientMessageId))) {
      optimistic.push(item);
    }
  }

  const realSorted = Array.from(byId.values()).sort((a, b) => a.id - b.id);
  const optSorted = optimistic.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return [...realSorted, ...optSorted];
}

export function upsertMessageInCache(queryClient: QueryClient, portal: ConnectPortal, message: ConnectMessage) {
  const keys = buildConnectKeys(portal);
  queryClient.setQueryData<MessagesInfiniteData>(keys.messages(message.connectionId), (old) => {
    if (!old || old.pages.length === 0) return old;

    const exists = old.pages.some((page) =>
      page.items.some(
        (item) =>
          item.id === message.id ||
          (Boolean(message.clientMessageId) && item.clientMessageId === message.clientMessageId),
      ),
    );

    if (exists) {
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          items: page.items.map((item) =>
            item.id === message.id ||
            (Boolean(message.clientMessageId) && item.clientMessageId === message.clientMessageId)
              ? message
              : item,
          ),
        })),
      };
    }

    const [first, ...rest] = old.pages;
    return {
      ...old,
      pages: [{ ...first, items: [message, ...first.items] }, ...rest],
    };
  });
}

export function addOptimisticMessageToCache(queryClient: QueryClient, portal: ConnectPortal, message: ConnectMessage) {
  const keys = buildConnectKeys(portal);
  queryClient.setQueryData<MessagesInfiniteData>(keys.messages(message.connectionId), (old) => {
    if (!old || old.pages.length === 0) return old;
    const [first, ...rest] = old.pages;
    const filtered = first.items.filter(
      (item) => !(message.clientMessageId && item.clientMessageId === message.clientMessageId),
    );
    return {
      ...old,
      pages: [{ ...first, items: [message, ...filtered] }, ...rest],
    };
  });
}

export function markOptimisticFailedInCache(
  queryClient: QueryClient,
  portal: ConnectPortal,
  connectionId: number,
  clientMessageId: string,
  errorMessage: string,
) {
  const keys = buildConnectKeys(portal);
  queryClient.setQueryData<MessagesInfiniteData>(keys.messages(connectionId), (old) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        items: page.items.map((item) =>
          item.clientMessageId === clientMessageId && item.id < 0
            ? { ...item, optimisticStatus: 'FAILED' as const, optimisticError: errorMessage }
            : item,
        ),
      })),
    };
  });
}

export function patchMessageReactionsInCache(
  queryClient: QueryClient,
  portal: ConnectPortal,
  connectionId: number,
  messageId: number,
  reactions: MessageReaction[],
) {
  const keys = buildConnectKeys(portal);
  queryClient.setQueryData<MessagesInfiniteData>(keys.messages(connectionId), (old) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        items: page.items.map((item) => (item.id === messageId ? { ...item, reactions } : item)),
      })),
    };
  });
}

export function removeMessageFromCache(
  queryClient: QueryClient,
  portal: ConnectPortal,
  connectionId: number,
  messageId: number,
) {
  const keys = buildConnectKeys(portal);
  queryClient.setQueryData<MessagesInfiniteData>(keys.messages(connectionId), (old) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        items: page.items.filter((item) => item.id !== messageId),
      })),
    };
  });
}

export function patchConversationSummaryInCache(
  queryClient: QueryClient,
  portal: ConnectPortal,
  connectionId: number,
  updater: (current: ConversationSummary) => ConversationSummary,
  moveToTop = false,
) {
  const keys = buildConnectKeys(portal);
  queryClient.setQueryData<ConversationSummary>(keys.conversation(connectionId), (old) => (old ? updater(old) : old));
  queryClient.setQueryData<ConversationsInfiniteData>(keys.conversations, (old) => {
    if (!old || old.pages.length === 0) return old;
    let found: ConversationSummary | null = null;
    const strippedPages = old.pages.map((page) => ({
      ...page,
      items: page.items.filter((item) => {
        if (item.id === connectionId) {
          found = updater(item);
          return !moveToTop;
        }
        return true;
      }),
    }));

    if (!moveToTop) {
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          items: page.items.map((item) => (item.id === connectionId ? updater(item) : item)),
        })),
      };
    }

    if (!found) return old;
    const [first, ...rest] = strippedPages;
    return {
      ...old,
      pages: [{ ...first, items: [found, ...first.items] }, ...rest],
    };
  });
}

export function applyIncomingMessageSummaryPatch(
  queryClient: QueryClient,
  portal: ConnectPortal,
  message: ConnectMessage,
  shouldIncrementUnread: boolean,
) {
  const preview = getMessagePreviewText(message);
  patchConversationSummaryInCache(
    queryClient,
    portal,
    message.connectionId,
    (current) => ({
      ...current,
      lastMessageAt: message.createdAt,
      lastMessagePreview: preview,
      unreadCount: shouldIncrementUnread ? current.unreadCount + 1 : current.unreadCount,
    }),
    true,
  );
}

export function applyPeerReadInCache(
  queryClient: QueryClient,
  portal: ConnectPortal,
  connectionId: number,
  readerType: ConnectActorType,
  lastReadMessageId: number,
  lastReadAt: string,
) {
  const isPeer =
    (portal === 'candidate' && readerType === 'RECRUITER') || (portal === 'recruiter' && readerType === 'CANDIDATE');

  if (isPeer) {
    patchConversationSummaryInCache(queryClient, portal, connectionId, (current) => ({
      ...current,
      peerLastReadMessageId:
        current.peerLastReadMessageId && current.peerLastReadMessageId > lastReadMessageId
          ? current.peerLastReadMessageId
          : lastReadMessageId,
      peerLastReadAt: lastReadAt,
    }));
  } else {
    patchConversationSummaryInCache(queryClient, portal, connectionId, (current) => ({
      ...current,
      unreadCount: 0,
    }));
  }
}
