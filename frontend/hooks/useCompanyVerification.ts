'use client';

import { accountSecurityApiFor } from '@/apiRequest/account-security';
import { recruiterCompanyApi } from '@/apiRequest/recruiter-company';
import { VERIFICATION_STEPS_META } from '@/constants/company-verification';
import { ROUTES } from '@/constants/routes';
import { isApiError } from '@/lib/api-error';
import { useAuthStore } from '@/store/auth.store';
import type {
  AgreementType,
  BusinessDocumentResource,
  BusinessDocumentType,
  CompanyResource,
  RecruiterVerificationProfile,
  RecruiterVerificationProfileResource,
  SaveCompanyProfileRequest,
  VerificationChecklistItem,
  VerificationLevelNumber,
  VerificationStepId,
} from '@/types/recruiter-company';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const STEP_ROUTES: Record<VerificationStepId, string> = {
  PHONE: ROUTES.RECRUITER_COMPANY_PHONE_VERIFY,
  COMPANY: ROUTES.RECRUITER_COMPANY,
  LICENSE: ROUTES.RECRUITER_COMPANY_LICENSE,
  CANDIDATE_AGREEMENT: ROUTES.RECRUITER_COMPANY_AGREEMENTS,
  PLATFORM_AGREEMENT: ROUTES.RECRUITER_COMPANY_AGREEMENTS,
};

export function useCompanyVerification() {
  const user = useAuthStore((state) => state.user);
  const [profileResource, setProfileResource] = useState<RecruiterVerificationProfileResource | null>(null);
  const [company, setCompany] = useState<CompanyResource | null>(null);
  const [documents, setDocuments] = useState<BusinessDocumentResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const reload = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setAttempt((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      recruiterCompanyApi.getVerificationProfile().catch(() => null),
      recruiterCompanyApi.getMyCompany().catch((err) => {
        if (isApiError(err) && (err.status === 404 || err.code === 'NOT_FOUND')) {
          return null;
        }
        return null;
      }),
      recruiterCompanyApi.getDocuments().catch(() => [] as BusinessDocumentResource[]),
    ])
      .then(([prof, comp, docs]) => {
        if (cancelled) return;
        setProfileResource(prof);
        setCompany(comp);
        setDocuments(docs || []);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Could not load company verification data');
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  // Derive client RecruiterVerificationProfile
  const profile: RecruiterVerificationProfile = useMemo(() => {
    const rawLevel = (profileResource?.level ?? 1) as VerificationLevelNumber;
    const level: VerificationLevelNumber = rawLevel >= 1 && rawLevel <= 3 ? rawLevel : 1;

    const levelLabels: Record<VerificationLevelNumber, string> = {
      1: 'Level 1: Basic Account',
      2: 'Level 2: Standard Employer',
      3: 'Level 3: Verified Enterprise',
    };

    const latestDoc = documents[0] || null;
    const phoneStep = profileResource?.steps.find((s) => s.stepId === 'PHONE');
    const licenseStep = profileResource?.steps.find((s) => s.stepId === 'LICENSE');
    const candidateAgreementStep = profileResource?.steps.find((s) => s.stepId === 'CANDIDATE_AGREEMENT');
    const platformAgreementStep = profileResource?.steps.find((s) => s.stepId === 'PLATFORM_AGREEMENT');

    const checklist: VerificationChecklistItem[] = VERIFICATION_STEPS_META.map((meta) => {
      const stepData = profileResource?.steps.find((s) => s.stepId === meta.id);
      return {
        id: meta.id,
        order: meta.order,
        title: meta.title,
        description: meta.description,
        status: stepData?.status ?? 'NOT_STARTED',
        badgeLabel: meta.badgeLabel,
        actionLabel: meta.actionLabel,
        actionUrl: STEP_ROUTES[meta.id],
        completedAt: stepData?.completedAt,
        reviewReason: stepData?.reviewReason,
        expiresAt: stepData?.expiresAt,
      };
    });

    // Find next actionable step
    const nextIncomplete = checklist.find((item) => item.status !== 'APPROVED');
    const nextStepLabel = nextIncomplete ? nextIncomplete.actionLabel : 'All steps completed';
    const nextStepUrl = nextIncomplete ? nextIncomplete.actionUrl : ROUTES.RECRUITER_JOBS_CREATE;

    return {
      level,
      levelLabel: levelLabels[level],
      completionPercent: profileResource?.completionPercent ?? 0,
      stepsCompleted: profileResource?.stepsCompleted ?? 0,
      stepsTotal: profileResource?.stepsTotal ?? 5,
      canPublish: profileResource?.canPublish ?? false,
      blockedReason: profileResource?.blockedReason ?? null,
      companyId: profileResource?.companyId ?? company?.id ?? null,
      company,
      phone: {
        phoneNumber: user?.phone || '',
        isVerified: phoneStep?.status === 'APPROVED',
        verifiedAt: phoneStep?.completedAt,
      },
      license: {
        status: latestDoc ? latestDoc.reviewStatus : licenseStep?.status === 'APPROVED' ? 'APPROVED' : 'NOT_SUBMITTED',
        documentType: latestDoc?.documentType,
        fileName: latestDoc?.originalFileName,
        fileSize: latestDoc ? `${(latestDoc.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB` : undefined,
        submittedAt: latestDoc?.submittedAt,
        reviewedAt: latestDoc?.reviewedAt,
        reviewReason: latestDoc?.reviewReason || licenseStep?.reviewReason,
        expiresAt: latestDoc?.expiresAt || licenseStep?.expiresAt,
        documentId: latestDoc?.id,
        identityFileName: latestDoc?.identityFileName,
        identityBackFileName: latestDoc?.identityBackFileName,
        hasIdentity: Boolean(latestDoc?.identityStoragePublicId),
        hasIdentityBack: Boolean(latestDoc?.identityBackStoragePublicId),
      },
      candidateAgreement: {
        status:
          candidateAgreementStep?.status === 'APPROVED'
            ? 'APPROVED'
            : candidateAgreementStep?.status || 'NOT_SUBMITTED',
        agreedAt: candidateAgreementStep?.completedAt,
        reviewReason: candidateAgreementStep?.reviewReason,
      },
      platformAgreement: {
        status:
          platformAgreementStep?.status === 'APPROVED' ? 'APPROVED' : platformAgreementStep?.status || 'NOT_SUBMITTED',
        agreedAt: platformAgreementStep?.completedAt,
        reviewReason: platformAgreementStep?.reviewReason,
      },
      checklist,
      nextStepLabel,
      nextStepUrl,
    };
  }, [profileResource, company, documents, user]);

  // Actions
  const handleSendPhoneOtp = useCallback(async (phone: string) => {
    await accountSecurityApiFor('recruiter').sendPhoneOtp(phone);
    toast.success(`Verification OTP sent to ${phone}`);
  }, []);

  const handleVerifyPhone = useCallback(
    async (otp: string) => {
      const patch = await accountSecurityApiFor('recruiter').verifyPhoneOtp(otp);
      const store = useAuthStore.getState();
      if (store.accessToken && store.user) {
        store.setSession({
          accessToken: store.accessToken,
          user: { ...store.user, ...patch, phoneVerified: true },
        });
      }
      toast.success('Phone number verified successfully!');
      reload();
    },
    [reload],
  );

  const handleSaveCompany = useCallback(
    async (data: SaveCompanyProfileRequest) => {
      let saved: CompanyResource;
      if (company) {
        saved = await recruiterCompanyApi.updateCompany(data);
        toast.success('Company profile updated successfully!');
      } else {
        saved = await recruiterCompanyApi.createCompany(data);
        toast.success('Company created successfully!');
      }
      setCompany(saved);
      reload();
      return saved;
    },
    [company, reload],
  );

  const handleChooseCompany = useCallback(
    async (companyId: number) => {
      const joined = await recruiterCompanyApi.joinCompany(companyId);
      setCompany(joined);
      toast.success(`Joined company: ${joined.name}`);
      reload();
      return joined;
    },
    [reload],
  );

  const handleLeaveCompany = useCallback(async () => {
    await recruiterCompanyApi.leaveCompany();
    setCompany(null);
    toast.success('You have left the company successfully.');
    reload();
  }, [reload]);

  const handleSubmitLicense = useCallback(
    async (params: {
      documentType: BusinessDocumentType;
      file: File;
      identityFile?: File | null;
      identityBackFile?: File | null;
    }) => {
      const doc = await recruiterCompanyApi.submitDocument(
        params.documentType,
        params.file,
        params.identityFile,
        params.identityBackFile,
      );
      toast.success('Document uploaded successfully! It is now under review.');
      reload();
      return doc;
    },
    [reload],
  );

  const handleAgreeCandidate = useCallback(async () => {
    await recruiterCompanyApi.acceptAgreement('CANDIDATE_DATA');
    toast.success('Candidate Data Processing Agreement confirmed!');
    reload();
  }, [reload]);

  const handleAgreePlatform = useCallback(async () => {
    await recruiterCompanyApi.acceptAgreement('PLATFORM_DATA');
    toast.success('Platform Service Agreement confirmed!');
    reload();
  }, [reload]);

  const handleUploadCustomAgreement = useCallback(
    async (agreementType: AgreementType, file: File) => {
      await recruiterCompanyApi.acceptCustomAgreement(agreementType, file);
      toast.success('Custom agreement uploaded! Awaiting manual compliance review.');
      reload();
    },
    [reload],
  );

  const handleUploadLogo = useCallback(async (file: File) => {
    const updated = await recruiterCompanyApi.uploadLogo(file);
    setCompany(updated);
    toast.success('Company logo updated successfully!');
    return updated;
  }, []);

  const handleUploadPhotos = useCallback(async (files: File[]) => {
    const updated = await recruiterCompanyApi.uploadPhotos(files);
    setCompany(updated);
    toast.success('Company workplace photos updated successfully!');
    return updated;
  }, []);

  const handleRemovePhoto = useCallback(async (photoId: number) => {
    const updated = await recruiterCompanyApi.removePhoto(photoId);
    setCompany(updated);
    toast.success('Photo removed.');
    return updated;
  }, []);

  return {
    profile,
    company,
    documents,
    isLoading,
    error,
    refreshProfile: reload,
    handleSendPhoneOtp,
    handleVerifyPhone,
    handleSaveCompany,
    handleChooseCompany,
    handleLeaveCompany,
    handleSubmitLicense,
    handleAgreeCandidate,
    handleAgreePlatform,
    handleUploadCustomAgreement,
    handleUploadLogo,
    handleUploadPhotos,
    handleRemovePhoto,
  };
}
