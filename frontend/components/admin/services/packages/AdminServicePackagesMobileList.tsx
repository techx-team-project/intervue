'use client';

import Switch from '@/components/ui/Switch';
import { ROUTES } from '@/constants/routes';
import {
  formatPackagePrice,
  getPackageVisibilityState,
  isPackageVisibleToRecruiters,
  PACKAGE_VISIBILITY_META,
} from '@/lib/admin-service-packages';
import { cn } from '@/lib/utils';
import type { AdminServiceCategory, AdminServicePackage } from '@/types/admin-service-package';
import { ExternalLink, SquarePen } from 'lucide-react';
import Link from 'next/link';

interface AdminServicePackagesMobileListProps {
  packages: AdminServicePackage[];
  categoriesById: ReadonlyMap<number, AdminServiceCategory>;
  busyPackageId: number | null;
  onToggleActive: (item: AdminServicePackage) => void;
}

export default function AdminServicePackagesMobileList({
  packages,
  categoriesById,
  busyPackageId,
  onToggleActive,
}: AdminServicePackagesMobileListProps) {
  return (
    <ul className="space-y-3 lg:hidden">
      {packages.map((item) => {
        const category = categoriesById.get(item.categoryId);
        const visibilityState = getPackageVisibilityState(item, category);
        const visibilityMeta = PACKAGE_VISIBILITY_META[visibilityState];
        const isLive = isPackageVisibleToRecruiters(item, category);
        const isBusy = busyPackageId === item.id;

        return (
          <li
            key={item.id}
            className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white p-4 shadow-2xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-on-surface-variant dark:text-forest-200 font-mono text-xs font-semibold tabular-nums">
                    #{item.displayOrder}
                  </span>
                  <Link
                    href={`${ROUTES.ADMIN_SERVICE_PACKAGES}/${item.id}/edit`}
                    className="text-primary text-sm font-bold hover:underline dark:text-emerald-400"
                  >
                    {item.name}
                  </Link>
                  {item.vipRibbon && (
                    <span className="rounded bg-amber-400/90 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-950">
                      VIP
                    </span>
                  )}
                </div>
                <p className="dark:text-forest-300 text-on-surface-variant mt-1 text-xs">
                  {category?.name ?? item.categoryCode}
                  {category && !category.isActive ? ' (Hidden category)' : ''}
                </p>
              </div>

              <span className="text-navy dark:text-forest-50 shrink-0 text-sm font-bold tabular-nums">
                {formatPackagePrice(item.price, item.currency)}
              </span>
            </div>

            <div className="dark:text-forest-300 text-on-surface-variant mt-2.5 flex flex-wrap gap-2 text-[11px]">
              <span>{item.validityDays ? `${item.validityDays}d validity` : 'No expiry'}</span>
              {item.bonusCredits > 0 && <span>· +{item.bonusCredits.toLocaleString('en-US')} credits</span>}
              <span>· {item.benefits.length} benefits</span>
              <span>· {item.sections.length} sections</span>
            </div>

            <div className="dark:border-forest-800 border-outline-variant mt-3 flex items-center justify-between gap-2 border-t pt-3">
              <div className="inline-flex items-center gap-2">
                <Switch
                  checked={item.status === 'ACTIVE'}
                  onChange={() => onToggleActive(item)}
                  disabled={isBusy}
                  ariaLabel={`Toggle active status for ${item.name}`}
                  size="sm"
                />
                <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', visibilityMeta.pillClass)}>
                  {visibilityMeta.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {isLive && (
                  <Link
                    href={`${ROUTES.RECRUITER_SERVICES}/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open live page for ${item.name}`}
                    className="border-outline-variant text-on-surface-variant dark:border-forest-700 dark:text-forest-200 inline-flex h-8 w-8 items-center justify-center rounded-lg border"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                )}
                <Link
                  href={`${ROUTES.ADMIN_SERVICE_PACKAGES}/${item.id}/edit`}
                  className="border-outline-variant text-primary dark:border-forest-700 inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-semibold dark:text-emerald-400"
                >
                  <SquarePen className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </Link>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
