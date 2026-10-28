'use client';

import BecomeRecruiterDialog from '@/components/auth/BecomeRecruiterDialog';
import { ROLES } from '@/constants/auth';
import { REDIRECT_PARAM, ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RecruiterEntryButton() {
  const router = useRouter();
  const { user, isLoading, hasRole } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = () => {
    if (isLoading) return;
    if (!user) {
      router.push(`${ROUTES.LOGIN}?${REDIRECT_PARAM}=${encodeURIComponent(ROUTES.RECRUITER_DASHBOARD)}`);
      return;
    }
    if (hasRole(ROLES.RECRUITER)) {
      router.push(ROUTES.RECRUITER_DASHBOARD);
      return;
    }
    setIsDialogOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="hidden cursor-pointer rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-200 md:inline-flex"
      >
        Đăng tuyển & tìm hồ sơ
      </button>
      <BecomeRecruiterDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
}
