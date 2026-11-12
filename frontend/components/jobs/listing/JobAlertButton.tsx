'use client';

import JobAlertModal from '@/components/candidate/job-alerts/JobAlertModal';
import { ROLES } from '@/constants/auth';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { PublicJobFilters } from '@/types/job-filters';
import { BellPlus } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const ALERT_CITY_NAMES: Record<string, string> = {
  'Hà Nội': 'Hanoi',
  'TP. Hồ Chí Minh': 'Ho Chi Minh City',
  'Đà Nẵng': 'Da Nang',
  'Cần Thơ': 'Can Tho',
  'Hải Phòng': 'Hai Phong',
};

const BUTTON_CLASS =
  'text-body-md text-on-surface hover:bg-surface-container-low hover:text-primary flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-left font-medium transition-colors';

type JobAlertButtonProps = {
  filters: PublicJobFilters;
  className?: string;
};

export default function JobAlertButton({ filters, className }: JobAlertButtonProps) {
  const { user, hasRole } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    const query = searchParams.toString();
    const target = query ? `${pathname}?${query}` : pathname;
    return (
      <Link href={`${ROUTES.LOGIN}?redirect=${encodeURIComponent(target)}`} className={cn(BUTTON_CLASS, className)}>
        <BellPlus className="h-4 w-4" aria-hidden />
        Email me new matches
      </Link>
    );
  }

  if (!hasRole(ROLES.CANDIDATE)) return null;

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={cn(BUTTON_CLASS, className)}>
        <BellPlus className="h-4 w-4" aria-hidden />
        Email me new matches
      </button>
      <JobAlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          setIsOpen(false);
          toast.success('Job alert created. We will email you when new jobs match.');
        }}
        defaultValues={{ keyword: filters.q, city: ALERT_CITY_NAMES[filters.city] ?? '' }}
      />
    </>
  );
}
