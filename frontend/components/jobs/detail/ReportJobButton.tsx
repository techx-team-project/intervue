'use client';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { Flag } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import ReportJobModal from './ReportJobModal';

type ReportJobButtonProps = {
  jobId: number;
};

export default function ReportJobButton({ jobId }: ReportJobButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, hasRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    if (!isAuthenticated) {
      router.push(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!hasRole('CANDIDATE')) {
      toast.info('Only candidate accounts can report jobs.');
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="text-on-surface-variant hover:text-error text-body-sm inline-flex cursor-pointer items-center gap-1.5 font-medium transition-colors"
      >
        <Flag className="h-3.5 w-3.5" aria-hidden />
        Report this job
      </button>
      <ReportJobModal jobId={jobId} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
