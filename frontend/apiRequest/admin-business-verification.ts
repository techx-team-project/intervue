import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type {
  AdminBusinessVerificationDetailResource,
  AdminBusinessVerificationListResource,
  AdminCompanyAgreementResource,
  BusinessDocumentType,
  BusinessVerificationSummaryResource,
  CompanyMemberResource,
  CompanyVerificationStatus,
  DocumentReviewStatus,
} from '@/types/recruiter-company';

export interface AdminBusinessVerificationQueryParams {
  reviewStatus?: DocumentReviewStatus;
  documentType?: BusinessDocumentType;
  companyVerificationStatus?: CompanyVerificationStatus;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const adminBusinessVerificationApi = {
  search: (params: AdminBusinessVerificationQueryParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.reviewStatus) searchParams.set('reviewStatus', params.reviewStatus);
    if (params.documentType) searchParams.set('documentType', params.documentType);
    if (params.companyVerificationStatus)
      searchParams.set('companyVerificationStatus', params.companyVerificationStatus);
    if (params.keyword?.trim()) searchParams.set('keyword', params.keyword.trim());
    if (params.page !== undefined) searchParams.set('page', String(params.page));
    if (params.size !== undefined) searchParams.set('size', String(params.size));
    if (params.sort) searchParams.set('sort', params.sort);
    const qs = searchParams.toString();
    return request<Page<AdminBusinessVerificationListResource>>(`/admin/business-verification${qs ? `?${qs}` : ''}`);
  },

  getSummary: () => request<BusinessVerificationSummaryResource>('/admin/business-verification/summary'),

  getDetail: (documentId: number) =>
    request<AdminBusinessVerificationDetailResource>(`/admin/business-verification/${documentId}`),

  viewDocumentBlob: (documentId: number) =>
    request<Blob>(`/admin/business-verification/${documentId}/view`, {
      responseType: 'blob',
    }),

  viewIdentityBlob: (documentId: number) =>
    request<Blob>(`/admin/business-verification/${documentId}/identity/view`, {
      responseType: 'blob',
    }),

  viewIdentityBackBlob: (documentId: number) =>
    request<Blob>(`/admin/business-verification/${documentId}/identity-back/view`, {
      responseType: 'blob',
    }),

  searchAgreements: (status?: string, page = 0, size = 10) => {
    const qs = new URLSearchParams();
    if (status) qs.set('status', status);
    qs.set('page', String(page));
    qs.set('size', String(size));
    return request<Page<AdminCompanyAgreementResource>>(`/admin/business-verification/agreements?${qs.toString()}`);
  },

  viewAgreementBlob: (agreementId: number) =>
    request<Blob>(`/admin/business-verification/agreements/${agreementId}/view`, {
      responseType: 'blob',
    }),

  approveAgreement: (agreementId: number) =>
    request<null>(`/admin/business-verification/agreements/${agreementId}/approve`, {
      method: 'POST',
    }),

  rejectAgreement: (agreementId: number, data: { reason: string }) =>
    request<null>(`/admin/business-verification/agreements/${agreementId}/reject`, {
      method: 'POST',
      body: data,
    }),

  approve: (documentId: number, data: { expiresAt?: string } = {}) =>
    request<AdminBusinessVerificationDetailResource>(`/admin/business-verification/${documentId}/approve`, {
      method: 'POST',
      body: data,
    }),

  reject: (documentId: number, data: { reason: string }) =>
    request<AdminBusinessVerificationDetailResource>(`/admin/business-verification/${documentId}/reject`, {
      method: 'POST',
      body: data,
    }),

  requestMoreInformation: (documentId: number, data: { reason: string }) =>
    request<AdminBusinessVerificationDetailResource>(`/admin/business-verification/${documentId}/request-documents`, {
      method: 'POST',
      body: data,
    }),

  revoke: (documentId: number, data: { reason: string }) =>
    request<AdminBusinessVerificationDetailResource>(`/admin/business-verification/${documentId}/revoke`, {
      method: 'POST',
      body: data,
    }),

  getMembers: (companyId: number) => request<CompanyMemberResource[]>(`/admin/companies/${companyId}/members`),

  revokeMember: (companyId: number, userId: number, data: { reason: string }) =>
    request<CompanyMemberResource[]>(`/admin/companies/${companyId}/members/${userId}`, {
      method: 'DELETE',
      body: data,
    }),

  transferOwner: (companyId: number, data: { newOwnerUserId: number; reason: string }) =>
    request<CompanyMemberResource[]>(`/admin/companies/${companyId}/transfer-owner`, {
      method: 'POST',
      body: data,
    }),
};
