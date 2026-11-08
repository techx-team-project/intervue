'use client';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { toast } from 'sonner';
import RecruiterAuthSplitLayout from './RecruiterAuthSplitLayout';
import RecruiterOnboarding from './RecruiterOnboarding';

export default function RecruiterOnboardingView() {
  const router = useRouter();
  const { user } = useAuth();

  const isFinishedRef = useRef(false);

  const handleFinish = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    toast.success('Welcome to InterVue for Employers!');
    router.replace(ROUTES.RECRUITER_DASHBOARD);
  };

  return (
    <RecruiterAuthSplitLayout>
      <RecruiterOnboarding startStep="profile" name={user?.name ?? ''} onFinish={handleFinish} />
    </RecruiterAuthSplitLayout>
  );
}
