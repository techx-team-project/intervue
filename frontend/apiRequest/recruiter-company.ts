import { request } from '@/apiRequest/http';
import type { Page } from '@/types/api';
import type {
  AgreementType,
  BusinessDocumentResource,
  BusinessDocumentType,
  CompanyResource,
  CompanySummaryResource,
  RecruiterVerificationProfileResource,
  SaveCompanyProfileRequest,
  TaxLookupResource,
} from '@/types/recruiter-company';

export const recruiterCompanyApi = {
  // Verification profile
  getVerificationProfile: () => request<RecruiterVerificationProfileResource>('/recruiter/company/verification'),

  // Company management
  getMyCompany: () => request<CompanyResource>('/recruiter/company'),

  createCompany: (data: SaveCompanyProfileRequest) =>
    request<CompanyResource>('/recruiter/company', {
      method: 'POST',
      body: data,
    }),

  updateCompany: (data: SaveCompanyProfileRequest) =>
    request<CompanyResource>('/recruiter/company', {
      method: 'PUT',
      body: data,
    }),

  searchCompanies: (keyword?: string, page = 0, size = 10) => {
    const params = new URLSearchParams();
    if (keyword?.trim()) params.set('q', keyword.trim());
    params.set('page', String(page));
    params.set('size', String(size));
    return request<Page<CompanySummaryResource>>(`/recruiter/company/search?${params.toString()}`);
  },

  lookupTax: (taxCode: string) => {
    const params = new URLSearchParams();
    params.set('taxCode', taxCode.trim());
    return request<TaxLookupResource>(`/recruiter/company/lookup-tax?${params.toString()}`);
  },

  joinCompany: (companyId: number) =>
    request<CompanyResource>('/recruiter/company/join', {
      method: 'POST',
      body: { companyId },
    }),

  leaveCompany: () =>
    request<null>('/recruiter/company/leave', {
      method: 'POST',
    }),

  uploadLogo: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request<CompanyResource>('/recruiter/company/logo', {
      method: 'POST',
      body: formData,
    });
  },

  uploadPhotos: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return request<CompanyResource>('/recruiter/company/photos', {
      method: 'POST',
      body: formData,
    });
  },

  removePhoto: (photoId: number) =>
    request<CompanyResource>(`/recruiter/company/photos/${photoId}`, {
      method: 'DELETE',
    }),

  // Legal documents
  submitDocument: (
    documentType: BusinessDocumentType,
    file: File,
    identityFile?: File | null,
    identityBackFile?: File | null,
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    if (identityFile) {
      formData.append('identityFile', identityFile);
    }
    if (identityBackFile) {
      formData.append('identityBackFile', identityBackFile);
    }
    return request<BusinessDocumentResource>(
      `/recruiter/company/documents?documentType=${encodeURIComponent(documentType)}`,
      {
        method: 'POST',
        body: formData,
      },
    );
  },

  getDocuments: () => request<BusinessDocumentResource[]>('/recruiter/company/documents'),

  viewDocumentBlob: (documentId: number) =>
    request<Blob>(`/recruiter/company/documents/${documentId}/view`, {
      responseType: 'blob',
    }),

  viewIdentityBlob: (documentId: number) =>
    request<Blob>(`/recruiter/company/documents/${documentId}/identity/view`, {
      responseType: 'blob',
    }),

  viewIdentityBackBlob: (documentId: number) =>
    request<Blob>(`/recruiter/company/documents/${documentId}/identity-back/view`, {
      responseType: 'blob',
    }),

  // Agreements
  acceptAgreement: (agreementType: AgreementType) =>
    request<null>('/recruiter/company/agreements', {
      method: 'POST',
      body: { agreementType },
    }),

  acceptCustomAgreement: (agreementType: AgreementType, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request<null>(`/recruiter/company/agreements/custom?agreementType=${encodeURIComponent(agreementType)}`, {
      method: 'POST',
      body: formData,
    });
  },

  getAgreementTemplate: (agreementType: AgreementType) =>
    request<string>(`/recruiter/company/agreements/template/${agreementType}`, {
      responseType: 'text',
    }),
};
