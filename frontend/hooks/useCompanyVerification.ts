'use client';

import {
  acceptCandidateAgreement,
  acceptPlatformAgreement,
  chooseExistingCompany,
  getNextStepUrl,
  getRecruiterVerificationProfile,
  saveCompanyDetailData,
  setPresetVerificationLevel,
  submitRecruiterBusinessLicense,
  verifyRecruiterPhone,
} from '@/mocks/recruiter-company.mock';
import type {
  BusinessDocumentType,
  CompanyDetailData,
  RecruiterVerificationProfile,
  VerificationLevelNumber,
} from '@/types/recruiter-company';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useCompanyVerification() {
  const [profile, setProfile] = useState<RecruiterVerificationProfile>(() => getRecruiterVerificationProfile());

  // Keep state synced when window regains focus (e.g. navigation back) or localStorage updates
  useEffect(() => {
    const handleSync = () => {
      setProfile(getRecruiterVerificationProfile());
    };
    window.addEventListener('focus', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const refreshProfile = useCallback(() => {
    setProfile(getRecruiterVerificationProfile());
  }, []);

  const handleVerifyPhone = useCallback((phone: string) => {
    const updated = verifyRecruiterPhone(phone);
    setProfile(updated);
    toast.success('Xác thực số điện thoại thành công!');
  }, []);

  const handleSaveCompany = useCallback((data: Partial<CompanyDetailData>) => {
    saveCompanyDetailData(data);
    const updated = getRecruiterVerificationProfile();
    setProfile(updated);
    toast.success('Cập nhật thông tin công ty thành công!');
  }, []);

  const handleChooseCompany = useCallback((companyId: string) => {
    chooseExistingCompany(companyId);
    const updated = getRecruiterVerificationProfile();
    setProfile(updated);
    toast.success('Đã liên kết doanh nghiệp thành công!');
  }, []);

  const handleSubmitLicense = useCallback(
    (params: { documentType: BusinessDocumentType; fileName: string; fileSize: string }) => {
      const updated = submitRecruiterBusinessLicense(params);
      setProfile(updated);
      toast.success('Đã tải lên Giấy đăng ký doanh nghiệp! Đang chờ kiểm duyệt.');
    },
    [],
  );

  const handleAgreeCandidate = useCallback(
    (params: { type: 'STANDARD_TEMPLATE' | 'CUSTOM_UPLOAD'; customFileName?: string }) => {
      const updated = acceptCandidateAgreement(params);
      setProfile(updated);
      toast.success(
        params.type === 'STANDARD_TEMPLATE'
          ? 'Đã xác nhận Thỏa thuận xử lý DLCN với ứng viên!'
          : 'Đã tải lên văn bản thỏa thuận tùy chỉnh! Đang chờ kiểm duyệt.',
      );
    },
    [],
  );

  const handleAgreePlatform = useCallback(() => {
    const updated = acceptPlatformAgreement();
    setProfile(updated);
    toast.success('Đã xác nhận Thỏa thuận xử lý DLCN với InterVue!');
  }, []);

  const handlePresetLevel = useCallback((level: VerificationLevelNumber) => {
    const updated = setPresetVerificationLevel(level);
    setProfile(updated);
    toast.info(`Chuyển trạng thái demo xác thực: Cấp ${level}`);
  }, []);

  const nextStep = getNextStepUrl(profile);

  return {
    profile,
    refreshProfile,
    nextStep,
    handleVerifyPhone,
    handleSaveCompany,
    handleChooseCompany,
    handleSubmitLicense,
    handleAgreeCandidate,
    handleAgreePlatform,
    handlePresetLevel,
  };
}
