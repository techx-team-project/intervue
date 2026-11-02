'use client';

import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';
import { useState } from 'react';
import BecomeRecruiterDialog from './BecomeRecruiterDialog';

export default function BecomeRecruiterPrompt() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-lg font-bold text-slate-800">Khu vực dành cho nhà tuyển dụng</h1>
      <p className="max-w-md text-sm text-slate-600">
        Tài khoản của bạn chưa có vai trò Nhà tuyển dụng. Bật vai trò này để đăng tin và quản lý hồ sơ ứng tuyển.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => setIsDialogOpen(true)}>Trở thành nhà tuyển dụng</Button>
        <Link href={ROUTES.HOME} className="text-sm font-semibold text-emerald-600 hover:underline">
          Về trang chủ
        </Link>
      </div>
      <BecomeRecruiterDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
}
