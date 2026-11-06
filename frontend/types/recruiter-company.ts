export type VerificationLevelNumber = 1 | 2 | 3;

export type VerificationStepId = 'PHONE' | 'COMPANY' | 'LICENSE' | 'CANDIDATE_AGREEMENT' | 'PLATFORM_AGREEMENT';

export type VerificationStepStatus =
  'NOT_STARTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'ACTION_REQUIRED' | 'EXPIRED' | 'REVOKED';

export type BusinessDocumentType = 'BUSINESS_LICENSE' | 'LETTER_OF_AUTHORIZATION';

export type DocumentReviewStatus =
  'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'MORE_INFO_REQUIRED' | 'REVOKED' | 'EXPIRED';

export type CompanyVerificationStatus = 'UNVERIFIED' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';

export type CompanyMemberRole = 'OWNER' | 'MEMBER';

export type CompanyMemberStatus = 'ACTIVE' | 'LEFT' | 'REVOKED';

export type CompanyLinkState = 'NONE' | 'CHOSEN' | 'SUBMITTED' | 'REJECTED' | 'VERIFIED';

export type AgreementType = 'CANDIDATE_DATA' | 'PLATFORM_DATA';

export type AgreementScope = 'COMPANY' | 'USER';

export type AgreementAcceptanceMode = 'STANDARD_TEMPLATE' | 'CUSTOM_UPLOAD';

export type AgreementStatus = 'ACCEPTED' | 'PENDING_REVIEW' | 'REJECTED';

export interface AdminCompanyAgreementResource {
  id: number;
  scope: AgreementScope;
  companyId: number;
  companyName: string;
  companyTaxCode: string;
  signedByUserId: number;
  signedByName?: string | null;
  signedByEmail?: string | null;
  agreementType: AgreementType;
  acceptanceMode: AgreementAcceptanceMode;
  version: string;
  status: AgreementStatus;
  acceptedAt: string;
  storagePublicId?: string | null;
}

export interface VerificationStepResource {
  stepId: VerificationStepId;
  status: VerificationStepStatus;
  completedAt?: string;
  reviewReason?: string;
  expiresAt?: string;
}

export interface RecruiterVerificationProfileResource {
  level: number;
  stepsCompleted: number;
  stepsTotal: number;
  completionPercent: number;
  canPublish: boolean;
  blockedReason: string | null;
  companyId: number | null;
  linkState: CompanyLinkState;
  steps: VerificationStepResource[];
}

export interface CompanyPhotoResource {
  id: number;
  url: string;
  photoUrl?: string;
  caption?: string;
  sortOrder?: number;
  displayOrder?: number;
}

export interface CompanyResource {
  id: number;
  name: string;
  taxCode: string;
  registeredAddress?: string;
  tradingName?: string;
  businessType?: 'ENTERPRISE' | 'HOUSEHOLD';
  industry?: string;
  website?: string;
  market?: string;
  targetCustomers?: string;
  size?: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  benefits?: string;
  logoUrl?: string;
  photos: CompanyPhotoResource[];
  profileComplete: boolean;
  missingFields: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CompanySummaryResource {
  id: number;
  name: string;
  taxCode: string;
  address?: string;
}

export interface TaxLookupResource {
  taxCode: string;
  name: string;
  tradingName?: string;
  address: string;
  existingOnPlatform: boolean;
  existingCompanyId?: number;
}

export interface BusinessDocumentResource {
  id: number;
  documentType: BusinessDocumentType;
  reviewStatus: DocumentReviewStatus;
  originalFileName: string;
  fileSizeBytes: number;
  contentType: string;
  submittedAt: string;
  submittedByMe: boolean;
  reviewedAt?: string;
  reviewReason?: string;
  expiresAt?: string;
  storagePublicId?: string;
  identityStoragePublicId?: string;
  identityFileName?: string;
  identityBackStoragePublicId?: string;
  identityBackFileName?: string;
}

export interface SaveCompanyProfileRequest {
  tradingName?: string;
  businessType: 'ENTERPRISE' | 'HOUSEHOLD';
  industry?: string;
  website?: string;
  market?: string;
  targetCustomers?: string;
  size?: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  benefits?: string;
}

// Admin Business Verification types
export interface BusinessVerificationSummaryResource {
  total: number;
  pendingReview: number;
  moreInfoRequired: number;
  approved: number;
  rejected: number;
  revoked: number;
  expired: number;
}

export interface AdminBusinessVerificationListResource {
  id: number;
  documentType: BusinessDocumentType;
  reviewStatus: DocumentReviewStatus;
  originalFileName: string;
  submittedAt: string;
  reviewedAt?: string;
  expiresAt?: string;
  companyId: number;
  companyName: string;
  companyTaxCode: string;
  companyVerificationStatus: CompanyVerificationStatus;
  submittedByUserId: number;
  submittedByName: string;
  submittedByEmail: string;
}

export interface AdminCompanyFactsResource {
  id: number;
  name: string;
  tradingName?: string;
  taxCode: string;
  businessType: 'ENTERPRISE' | 'HOUSEHOLD';
  industry?: string;
  size?: string;
  address: string;
  email?: string;
  phone?: string;
  website?: string;
  verificationStatus: CompanyVerificationStatus;
  verified: boolean;
  verifiedAt?: string;
  profileComplete?: boolean;
  memberCount: number;
  createdAt?: string;
}

export interface CompanyMemberResource {
  id: number;
  userId: number;
  name?: string;
  email: string;
  fullName: string;
  role?: CompanyMemberRole;
  status: CompanyMemberStatus;
  joinedAt: string;
  phoneVerified: boolean;
  userAgreementAccepted: boolean;
  canPublish: boolean;
}

export interface AdminBusinessVerificationDetailResource {
  document: BusinessDocumentResource;
  company: AdminCompanyFactsResource;
  submitter: CompanyMemberResource;
  members: CompanyMemberResource[];
  companyDocuments: BusinessDocumentResource[];
}

// Client UI helper types
export interface PhoneVerificationState {
  phoneNumber: string;
  isVerified: boolean;
  verifiedAt?: string;
}

export interface BusinessLicenseState {
  status: DocumentReviewStatus | 'NOT_SUBMITTED';
  documentType?: BusinessDocumentType;
  fileName?: string;
  fileSize?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewReason?: string;
  expiresAt?: string;
  documentId?: number;
  identityFileName?: string;
  identityBackFileName?: string;
  hasIdentity?: boolean;
  hasIdentityBack?: boolean;
}

export interface CandidateAgreementState {
  status: VerificationStepStatus | 'NOT_SUBMITTED';
  agreedAt?: string;
  reviewReason?: string;
}

export interface PlatformAgreementState {
  status: VerificationStepStatus | 'NOT_SUBMITTED';
  agreedAt?: string;
  reviewReason?: string;
}

export interface VerificationChecklistItem {
  id: VerificationStepId;
  order: number;
  title: string;
  description: string;
  status: VerificationStepStatus;
  badgeLabel: string;
  actionLabel: string;
  actionUrl: string;
  completedAt?: string;
  reviewReason?: string;
  expiresAt?: string;
}

export interface RecruiterVerificationProfile {
  level: VerificationLevelNumber;
  levelLabel: string;
  completionPercent: number;
  stepsCompleted: number;
  stepsTotal: number;
  canPublish: boolean;
  blockedReason: string | null;
  companyId: number | null;
  company: CompanyResource | null;
  phone: PhoneVerificationState;
  license: BusinessLicenseState;
  candidateAgreement: CandidateAgreementState;
  platformAgreement: PlatformAgreementState;
  checklist: VerificationChecklistItem[];
  nextStepLabel: string;
  nextStepUrl: string;
}
