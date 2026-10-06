'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_NAME_MAP: Record<string, string> = {
  '/account': 'Cài đặt tìm việc & CV',
  '/account/security': 'Bảo mật tài khoản',
  '/account/password': 'Đổi mật khẩu',
  '/account/two-factor': 'Xác thực 2 bước (2FA)',
  '/account/upgrade': 'Nâng cấp tài khoản VIP',
};

export default function AccountBreadcrumbs() {
  const pathname = usePathname();
  const currentTitle = ROUTE_NAME_MAP[pathname] || 'Cài đặt tài khoản';

  return (
    <nav aria-label="Breadcrumb" className="border-b border-[#e2e8f0] bg-white py-2.5">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 text-[13px] text-[#64748b] sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-[#00b14f]">
          <Home className="h-3.5 w-3.5 text-[#94a3b8]" />
          <span>Trang chủ</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-[#cbd5e1]" />
        <Link href="/account" className="transition-colors hover:text-[#00b14f]">
          Quản lý tài khoản
        </Link>
        {pathname !== '/account' && (
          <>
            <ChevronRight className="h-3.5 w-3.5 text-[#cbd5e1]" />
            <span className="font-semibold text-[#1e293b]">{currentTitle}</span>
          </>
        )}
      </div>
    </nav>
  );
}
