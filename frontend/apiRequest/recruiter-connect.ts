import { createParticipantConnectApi, toConnectQuery } from '@/apiRequest/connect-client';
import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type { EligibleCandidate, Invitation } from '@/types/connect';

const BASE = '/recruiter/connect';

export const recruiterConnectApi = {
  ...createParticipantConnectApi(BASE),

  eligibleCandidates: (search: string | undefined, page: number, size: number) =>
    request<Page<EligibleCandidate>>(`${BASE}/eligible-candidates?${toConnectQuery({ search, page, size })}`),

  sendInvitation: (candidateId: number, message: string) =>
    request<Invitation>(`${BASE}/invitations`, { method: 'POST', body: { candidateId, message } }),
};
