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

interface AdminServicePackageTableProps {
  packages: AdminServicePackage[];
  categoriesById: ReadonlyMap<number, AdminServiceCategory>;
  busyPackageId: number | null;
  onToggleActive: (item: AdminServicePackage) => void;
}

export default function AdminServicePackageTable({
  packages,
  categoriesById,
  busyPackageId,
  onToggleActive,
}: AdminServicePackageTableProps) {
  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant hidden overflow-hidden rounded-lg border bg-white shadow-xs lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-xs">
          <thead>
            <tr className="dark:border-forest-800 dark:bg-forest-950/70 dark:text-forest-300 border-outline-variant bg-surface-container-low/70 text-on-surface-variant border-b font-semibold tracking-wider uppercase">
              <th className="w-24 py-3.5 pr-3 pl-5">Order</th>
              <th className="px-4 py-3.5">Package</th>
              <th className="w-48 px-4 py-3.5">Category</th>
              <th className="w-44 px-4 py-3.5 text-right">Pricing & terms</th>
              <th className="w-36 px-4 py-3.5 text-center">Structure</th>
              <th className="w-48 px-4 py-3.5">Visibility</th>
              <th className="w-28 py-3.5 pr-5 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="dark:divide-forest-800 divide-outline-variant divide-y">
            {packages.map((item) => {
              const category = categoriesById.get(item.categoryId);
              const visibilityState = getPackageVisibilityState(item, category);
              const visibilityMeta = PACKAGE_VISIBILITY_META[visibilityState];
              const isLive = isPackageVisibleToRecruiters(item, category);
              const isBusy = busyPackageId === item.id;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-surface-container-low/70 dark:hover:bg-forest-850/60 transition-colors"
                >
                  <td className="py-4 pr-3 pl-5 align-middle">
                    <span className="text-on-surface-variant dark:text-forest-200 font-mono text-xs font-semibold tabular-nums">
                      #{item.displayOrder}
                    </span>
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-wrap items-center gap-1.5">
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
                      {item.badge === 'NEW' && (
                        <span className="rounded bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          NEW
                        </span>
                      )}
                      {item.badge === 'SPECIAL_OFFER' && (
                        <span className="rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-semibold text-orange-700 dark:bg-orange-950/50 dark:text-orange-300">
                          OFFER
                        </span>
                      )}
                      {item.oneTimePerCompany && (
                        <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                          1×/company
                        </span>
                      )}
                    </div>
                    <p className="dark:text-forest-300 text-on-surface-variant mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="font-mono">/{item.slug}</span>
                    </p>
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-navy dark:text-forest-100 font-semibold">
                        {category?.name ?? item.categoryCode}
                      </span>
                      {category && !category.isActive && (
                        <span className="inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          Hidden category
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-right align-middle">
                    <p className="text-navy dark:text-forest-50 text-sm font-bold tabular-nums">
                      {formatPackagePrice(item.price, item.currency)}
                    </p>
                    <p className="dark:text-forest-300 text-on-surface-variant mt-0.5 text-[11px]">
                      {item.validityDays ? `${item.validityDays} days validity` : 'No expiry'}
                      {item.bonusCredits > 0 && ` · +${item.bonusCredits.toLocaleString('en-US')} credit`}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-center align-middle">
                    <p className="text-on-surface dark:text-forest-100 font-semibold tabular-nums">
                      {item.benefits.length} {item.benefits.length === 1 ? 'benefit' : 'benefits'}
                    </p>
                    <p className="dark:text-forest-400 text-on-surface-variant mt-0.5 text-[11px] tabular-nums">
                      {item.sections.length} {item.sections.length === 1 ? 'section' : 'sections'}
                    </p>
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <div className="inline-flex items-center gap-2.5" title={visibilityMeta.tooltip}>
                      <Switch
                        checked={item.status === 'ACTIVE'}
                        onChange={() => onToggleActive(item)}
                        disabled={isBusy}
                        ariaLabel={`Toggle active status for ${item.name}`}
                        size="sm"
                      />
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap',
                          visibilityMeta.pillClass,
                        )}
                      >
                        {visibilityMeta.label}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 pr-5 pl-4 text-right align-middle">
                    <div className="inline-flex items-center justify-end gap-1">
                      {isLive ? (
                        <Link
                          href={`${ROUTES.RECRUITER_SERVICES}/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open live recruiter page"
                          aria-label={`Open live page for ${item.name}`}
                          className="text-on-surface-variant hover:bg-surface-container-high hover:text-navy dark:text-forest-300 dark:hover:bg-forest-800 dark:hover:text-forest-50 rounded-lg p-1.5 transition"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      ) : (
                        <span
                          title={visibilityMeta.tooltip}
                          className="text-outline/50 inline-flex cursor-not-allowed rounded-lg p-1.5"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </span>
                      )}

                      <Link
                        href={`${ROUTES.ADMIN_SERVICE_PACKAGES}/${item.id}/edit`}
                        title="Edit package"
                        aria-label={`Edit ${item.name}`}
                        className="text-on-surface-variant hover:bg-surface-container-high hover:text-navy dark:text-forest-300 dark:hover:bg-forest-800 dark:hover:text-forest-50 rounded-lg p-1.5 transition"
                      >
                        <SquarePen className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
