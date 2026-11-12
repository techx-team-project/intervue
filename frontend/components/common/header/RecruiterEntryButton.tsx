'use client';

import { buttonClassName } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function RecruiterEntryButton() {
  return (
    <Link
      href={ROUTES.RECRUITER_LANDING}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClassName({
        variant: 'neutral',
        size: 'md',
        className: 'px-5 font-semibold max-md:hidden',
      })}
    >
      For recruiters
      <ArrowUpRight className="h-4 w-4" aria-hidden />
    </Link>
  );
}
