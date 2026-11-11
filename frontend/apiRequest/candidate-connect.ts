import { createParticipantConnectApi, toConnectQuery } from '@/apiRequest/connect-client';
import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type { ConversationSummary } from '@/types/connect';

const BASE = '/candidate/connect';

export const candidateConnectApi = {
  ...createParticipantConnectApi(BASE),

  invitations: (page: number, size: number) =>
    request<Page<ConversationSummary>>(`${BASE}/invitations?${toConnectQuery({ page, size })}`),

  acceptInvitation: (connectionId: number) =>
    request<null>(`${BASE}/invitations/${connectionId}/accept`, { method: 'POST' }),

  declineInvitation: (connectionId: number) =>
    request<null>(`${BASE}/invitations/${connectionId}/decline`, { method: 'POST' }),
};
