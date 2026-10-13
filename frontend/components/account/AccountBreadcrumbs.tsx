'use client';

import { usePathname } from 'next/navigation';
import Breadcrumb, { BreadcrumbItem } from '@/components/ui/Breadcrumb';

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

  const items: BreadcrumbItem[] = [{ label: 'Quản lý tài khoản', href: '/account' }];

  if (pathname !== '/account') {
    items.push({ label: currentTitle });
  }

  return (
    <div className="border-b border-slate-200 bg-white py-2.5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={items} />
      </div>
    </div>
  );
}
