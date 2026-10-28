'use client';

import { buildAdminBreadcrumb } from '@/lib/admin-nav';
import type { AdminPermission } from '@/types/admin';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface AdminPageBarProps {
  permissions?: AdminPermission[];
}

export default function AdminPageBar({ permissions }: AdminPageBarProps) {
  const pathname = usePathname();
  const trail = buildAdminBreadcrumb(pathname, permissions);
  const title = trail.at(-1)?.label ?? 'Admin';

  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 sticky top-18 z-30 border-b border-[#e9eaec] bg-white px-4 py-3.5 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11.5px]">
        {trail.map((entry, index) => (
          <span key={`${entry.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="h-3 w-3 shrink-0 text-[#cbd5e1]" aria-hidden="true" />}
            <span
              className={
                index === trail.length - 1 ? 'text-primary font-semibold' : 'dark:text-forest-400 text-[#94a3b8]'
              }
            >
              {entry.label}
            </span>
          </span>
        ))}
      </nav>

      <h1 className="text-navy dark:text-forest-50 mt-1 truncate text-xl font-black">{title}</h1>
    </div>
  );
}
