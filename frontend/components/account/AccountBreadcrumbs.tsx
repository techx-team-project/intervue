'use client';

import { usePathname } from 'next/navigation';
import Breadcrumb, { BreadcrumbItem } from '@/components/ui/Breadcrumb';

const ROUTE_NAME_MAP: Record<string, string> = {
  '/account': 'Job search & CV settings',
  '/account/security': 'Account security',
  '/account/password': 'Change password',
  '/account/two-factor': 'Two-factor authentication',
  '/account/upgrade': 'Upgrade to VIP',
};

export default function AccountBreadcrumbs() {
  const pathname = usePathname();
  const currentTitle = ROUTE_NAME_MAP[pathname] || 'Account settings';

  const items: BreadcrumbItem[] = [{ label: 'Account', href: '/account' }];

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
