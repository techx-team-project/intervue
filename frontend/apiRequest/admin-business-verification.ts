import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type {
  AdminBusinessVerificationDetailResource,
  AdminBusinessVerificationListResource,
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
