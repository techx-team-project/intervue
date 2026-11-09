export type IdentityVerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type IdentityDocumentSide = 'front' | 'back' | 'selfie';

export interface IdentityVerificationResource {
  status?: IdentityVerificationStatus;
  rejectReason?: string;
  attemptsLeft: number;
  canSubmit: boolean;
  required: boolean;
  fullName?: string;
  idNumberLast4?: string;
  submittedAt?: string;
  reviewedAt?: string;
}

export interface AdminIdentityVerificationResource {
  id: number;
  userId: number;
  userEmail?: string;
  fullName: string;
  dateOfBirth: string;
  idNumberLast4: string;
  status: IdentityVerificationStatus;
  idNumberUsedByAnotherAccount: boolean;
  rejectReason?: string;
  rejectionCount: number;
  attemptLimit: number;
  submittedAt: string;
  reviewedAt?: string;
}
