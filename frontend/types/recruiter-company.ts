export type VerificationLevelNumber = 1 | 2 | 3;

export type VerificationStepId = 'phone' | 'company' | 'license' | 'candidate_agreement' | 'platform_agreement';

export type VerificationStepStatus = 'not_started' | 'in_review' | 'approved' | 'rejected' | 'action_required';

export type BusinessDocumentType = 'BUSINESS_LICENSE' | 'LETTER_OF_AUTHORIZATION';

export interface PhoneVerificationState {
  phoneNumber: string;
  isVerified: boolean;
  verifiedAt?: string;
}

export interface BusinessLicenseState {
  status: 'NOT_SUBMITTED' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  documentType?: BusinessDocumentType;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface CandidateAgreementState {
  type: 'STANDARD_TEMPLATE' | 'CUSTOM_UPLOAD';
  status: 'NOT_SUBMITTED' | 'AGREED' | 'PENDING_REVIEW' | 'REJECTED';
  customFileName?: string;
  fileSize?: string;
  agreedAt?: string;
  rejectionReason?: string;
}

export interface PlatformAgreementState {
  isAgreed: boolean;
  agreedAt?: string;
  version: string;
}

export interface CompanySummaryVerification {
  id: string;
  name: string;
  taxCode: string;
  address: string;
  industry: string;
  size: string;
  isCompleted: boolean;
  logoUrl?: string;
}

export interface CompanyDetailData {
  id: string;
  businessType: 'ENTERPRISE' | 'HOUSEHOLD';
  name: string;
  tradingName: string;
  taxCode: string;
  industry: string;
  website: string;
  market: string;
  targetCustomers: string;
  size: string;
  email: string;
  phoneNumber: string;
  address: string;
  description: string;
  benefits: string;
  logoUrl?: string;
  photos: string[];
}

export interface VerificationChecklistItem {
  id: VerificationStepId;
  order: number;
  title: string;
  description: string;
  status: VerificationStepStatus;
  badgeLabel: string;
  actionLabel: string;
  isOptional?: boolean;
  completedAt?: string;
  rejectionReason?: string;
}

export interface RecruiterVerificationProfile {
  level: VerificationLevelNumber;
  levelLabel: string;
  completionPercent: number;
  stepsCompleted: number;
  stepsTotal: number;
  recruiterName: string;
  recruiterEmail: string;
  recruiterCode: string;
  company: CompanySummaryVerification;
  phone: PhoneVerificationState;
  license: BusinessLicenseState;
  candidateAgreement: CandidateAgreementState;
  platformAgreement: PlatformAgreementState;
  checklist: VerificationChecklistItem[];
  nextStepLabel: string;
  updatedAt: string;
}
