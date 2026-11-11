import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type {
  AdminIdentityVerificationResource,
  IdentityDocumentSide,
  IdentityVerificationResource,
  IdentityVerificationStatus,
} from '@/types/identity-verification';

export interface IdentitySubmitPayload {
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  front: File;
  back: File;
  selfie: File;
}

export const identityVerificationApi = {
  status: () => request<IdentityVerificationResource>('/candidate/identity-verification'),

  requestManualReview: () =>
    request<IdentityVerificationResource>('/candidate/identity-verification/manual-review', { method: 'POST' }),

  submit: (payload: IdentitySubmitPayload) => {
    const body = new FormData();
    body.append('fullName', payload.fullName.trim());
    body.append('idNumber', payload.idNumber.trim());
    body.append('dateOfBirth', payload.dateOfBirth);
    body.append('front', payload.front);
    body.append('back', payload.back);
    body.append('selfie', payload.selfie);
    return request<IdentityVerificationResource>('/candidate/identity-verification', { method: 'POST', body });
  },
};

export type AdminIdentitySearchParams = {
  status?: IdentityVerificationStatus;
  q?: string;
  page?: number;
  size?: number;
};

function toQuery(params: AdminIdentitySearchParams) {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.q?.trim()) query.set('q', params.q.trim());
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 10));
  return query.toString();
}

export const adminIdentityVerificationApi = {
  search: (params: AdminIdentitySearchParams) =>
    request<Page<AdminIdentityVerificationResource>>(`/admin/identity-verifications?${toQuery(params)}`),

  document: (id: number, side: IdentityDocumentSide) =>
    request<Blob>(`/admin/identity-verifications/${id}/documents/${side.toUpperCase()}`, { responseType: 'blob' }),

  approve: (id: number) =>
    request<AdminIdentityVerificationResource>(`/admin/identity-verifications/${id}/approve`, { method: 'POST' }),

  reject: (id: number, reason: string) =>
    request<AdminIdentityVerificationResource>(`/admin/identity-verifications/${id}/reject`, {
      method: 'POST',
      body: { reason },
    }),

  grantAttempts: (id: number) =>
    request<AdminIdentityVerificationResource>(`/admin/identity-verifications/${id}/grant-attempts`, {
      method: 'POST',
    }),
};
