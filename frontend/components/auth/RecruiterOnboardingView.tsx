'use client';

import { ROUTES } from '@/constants/routes';
import { MOCK_GOOGLE_RECRUITER_PROFILE } from '@/mocks/recruiter-onboarding.mock';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { toast } from 'sonner';
import RecruiterAuthSplitLayout from './RecruiterAuthSplitLayout';
import RecruiterOnboarding from './RecruiterOnboarding';

export default function RecruiterOnboardingView() {
  const router = useRouter();

  const isFinishedRef = useRef(false);

  const handleFinish = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    toast.success('Welcome to InterVue for Employers!');
    router.replace(ROUTES.RECRUITER_LANDING);
  };

  return (
    <RecruiterAuthSplitLayout>
      <RecruiterOnboarding startStep="profile" name={MOCK_GOOGLE_RECRUITER_PROFILE.name} onFinish={handleFinish} />
    </RecruiterAuthSplitLayout>
  );
}
