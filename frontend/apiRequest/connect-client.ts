import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type {
  ConnectMessage,
  ConnectMuteStatus,
  ConnectRulesAck,
  ConnectUnreadCount,
  ConversationSummary,
  LinkPreview,
  MessageReaction,
  ReportReasonCode,
  UnsendScope,
} from '@/types/connect';

export function toConnectQuery(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });
  return query.toString();
}

export type SendMessageInput = {
  body: string;
  clientMessageId?: string;
  replyToMessageId?: number;
  suppressLinkPreview?: boolean;
};

export type SendAttachmentInput = {
  file: File;
  caption?: string;
  clientMessageId?: string;
  replyToMessageId?: number;
};

export type EditMessageInput = {
  body: string;
  suppressLinkPreview?: boolean;
};

export function createParticipantConnectApi(base: string) {
  return {
    conversations: (page: number, size: number) =>
      request<Page<ConversationSummary>>(`${base}/conversations?${toConnectQuery({ page, size })}`),

    conversation: (connectionId: number) => request<ConversationSummary>(`${base}/conversations/${connectionId}`),

    messages: (connectionId: number, page: number, size: number, beforeId?: number) =>
      request<Page<ConnectMessage>>(
        `${base}/conversations/${connectionId}/messages?${toConnectQuery({ page, size, beforeId })}`,
      ),

    sendMessage: (connectionId: number, payload: SendMessageInput) =>
      request<ConnectMessage>(`${base}/conversations/${connectionId}/messages`, {
        method: 'POST',
        body: payload,
      }),

    sendAttachment: (connectionId: number, payload: SendAttachmentInput) => {
      const form = new FormData();
      form.append('file', payload.file);
      if (payload.caption?.trim()) form.append('caption', payload.caption.trim());
      if (payload.clientMessageId) form.append('clientMessageId', payload.clientMessageId);
      if (payload.replyToMessageId !== undefined) form.append('replyToMessageId', String(payload.replyToMessageId));
      return request<ConnectMessage>(`${base}/conversations/${connectionId}/messages/attachment`, {
        method: 'POST',
        body: form,
      });
    },

    editMessage: (connectionId: number, messageId: number, payload: EditMessageInput) =>
      request<ConnectMessage>(`${base}/conversations/${connectionId}/messages/${messageId}`, {
        method: 'PATCH',
        body: payload,
      }),

    unsendMessage: (connectionId: number, messageId: number, scope: UnsendScope) =>
      request<ConnectMessage | null>(`${base}/conversations/${connectionId}/messages/${messageId}/unsend`, {
        method: 'POST',
        body: { scope },
      }),

    reactToMessage: (connectionId: number, messageId: number, emoji: string) =>
      request<MessageReaction[]>(`${base}/conversations/${connectionId}/messages/${messageId}/reactions`, {
        method: 'POST',
        body: { emoji },
      }),

    markAsRead: (connectionId: number, lastReadMessageId?: number) =>
      request<null>(`${base}/conversations/${connectionId}/read`, {
        method: 'POST',
        body: lastReadMessageId !== undefined ? { lastReadMessageId } : {},
      }),

    sendTyping: (connectionId: number, typing: boolean) =>
      request<null>(`${base}/conversations/${connectionId}/typing`, {
        method: 'POST',
        body: { typing },
      }),

    linkPreview: (url: string) => request<LinkPreview | null>(`${base}/link-preview?${toConnectQuery({ url })}`),

    downloadAttachment: (connectionId: number, messageId: number) =>
      request<Blob>(`${base}/conversations/${connectionId}/messages/${messageId}/attachment`, {
        responseType: 'blob',
      }),

    block: (connectionId: number) => request<null>(`${base}/conversations/${connectionId}/block`, { method: 'POST' }),

    unblock: (connectionId: number) =>
      request<null>(`${base}/conversations/${connectionId}/unblock`, { method: 'POST' }),

    report: (connectionId: number, reasonCode: ReportReasonCode, reasonNote?: string) =>
      request<null>(`${base}/conversations/${connectionId}/report`, {
        method: 'POST',
        body: { reasonCode, reasonNote },
      }),

    unreadCount: () => request<ConnectUnreadCount>(`${base}/unread-count`),

    getRulesAck: () => request<ConnectRulesAck>(`${base}/rules-ack`),

    acknowledgeRules: () => request<ConnectRulesAck>(`${base}/rules-ack`, { method: 'POST' }),

    getMuteStatus: () => request<ConnectMuteStatus>(`${base}/mute-status`),
  };
}
