'use client';

import { buttonClassName } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';

export default function RecruiterEntryButton() {
  return (
    <Link
      href={ROUTES.RECRUITER_LANDING}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClassName({ variant: 'neutral', size: 'xl', className: 'hidden md:inline-flex' })}
    >
      Dành cho nhà tuyển dụng
    </Link>
  );
}
