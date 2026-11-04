'use client';

import { ROUTES } from '@/constants/routes';
import Link from 'next/link';

export default function RecruiterEntryButton() {
  return (
    <Link
      href={ROUTES.RECRUITER_LANDING}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden cursor-pointer items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-200 md:inline-flex"
    >
      Đăng tuyển & tìm hồ sơ
    </Link>
  );
}
