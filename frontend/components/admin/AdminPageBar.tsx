'use client';

import { buildAdminBreadcrumb, isRouteAvailable } from '@/lib/admin-nav';
import type { AdminPermission } from '@/types/admin';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminPageBarProps {
  permissions?: AdminPermission[];
}

export default function AdminPageBar({ permissions }: AdminPageBarProps) {
  const pathname = usePathname();
  const trail = buildAdminBreadcrumb(pathname, permissions);
  const title = trail.at(-1)?.label ?? 'Admin';

  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant sticky top-18 z-30 border-b bg-white px-4 py-3.5 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-label-sm flex flex-wrap items-center gap-1.5">
        {trail.map((entry, index) => {
          const isLast = index === trail.length - 1;

          return (
            <span key={`${entry.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="text-outline h-3 w-3 shrink-0" aria-hidden="true" />}

              {entry.href && !isLast && isRouteAvailable(entry.href) ? (
                <Link
                  href={entry.href}
                  className="dark:text-forest-400 dark:hover:text-forest-100 text-outline hover:text-on-surface-variant transition-colors hover:underline"
                >
                  {entry.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-primary font-semibold' : 'dark:text-forest-400 text-outline'}>
                  {entry.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>

      <h1 className="text-navy dark:text-forest-50 mt-1 truncate text-xl font-bold">{title}</h1>
    </div>
  );
}
