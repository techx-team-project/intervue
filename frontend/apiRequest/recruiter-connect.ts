import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type {
  ConnectMessage,
  ConnectRulesAck,
  ConnectUnreadCount,
  ConversationSummary,
  EligibleCandidate,
  Invitation,
  ReportReasonCode,
} from '@/types/connect';

const BASE = '/recruiter/connect';

function toQuery(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });
  return query.toString();
}

export const recruiterConnectApi = {
  eligibleCandidates: (search: string | undefined, page: number, size: number) =>
    request<Page<EligibleCandidate>>(`${BASE}/eligible-candidates?${toQuery({ search, page, size })}`),

  sendInvitation: (candidateId: number, message: string) =>
    request<Invitation>(`${BASE}/invitations`, { method: 'POST', body: { candidateId, message } }),

  conversations: (page: number, size: number) =>
    request<Page<ConversationSummary>>(`${BASE}/conversations?${toQuery({ page, size })}`),

  messages: (connectionId: number, page: number, size: number) =>
    request<Page<ConnectMessage>>(`${BASE}/conversations/${connectionId}/messages?${toQuery({ page, size })}`),

  sendMessage: (connectionId: number, body: string) =>
    request<ConnectMessage>(`${BASE}/conversations/${connectionId}/messages`, { method: 'POST', body: { body } }),

  sendAttachment: (connectionId: number, file: File, caption?: string) => {
    const form = new FormData();
    form.append('file', file);
    if (caption?.trim()) form.append('caption', caption.trim());
    return request<ConnectMessage>(`${BASE}/conversations/${connectionId}/messages/attachment`, {
      method: 'POST',
      body: form,
    });
  },

  downloadAttachment: (connectionId: number, messageId: number) =>
    request<Blob>(`${BASE}/conversations/${connectionId}/messages/${messageId}/attachment`, {
      responseType: 'blob',
    }),

  block: (connectionId: number) => request<null>(`${BASE}/conversations/${connectionId}/block`, { method: 'POST' }),

  report: (connectionId: number, reasonCode: ReportReasonCode, reasonNote?: string) =>
    request<null>(`${BASE}/conversations/${connectionId}/report`, {
      method: 'POST',
      body: { reasonCode, reasonNote },
    }),

  unreadCount: () => request<ConnectUnreadCount>(`${BASE}/unread-count`),

  getRulesAck: () => request<ConnectRulesAck>(`${BASE}/rules-ack`),

  acknowledgeRules: () => request<ConnectRulesAck>(`${BASE}/rules-ack`, { method: 'POST' }),
};
