'use client';

import ServiceSectionIcon from '@/components/common/ServiceSectionIcon';
import ServicePackageBadges from '@/components/recruiter/services/ServicePackageBadges';
import { getPackageVisibilityState, PACKAGE_VISIBILITY_META } from '@/lib/admin-service-packages';
import { cn } from '@/lib/utils';
import type { SaveServicePackageFormData } from '@/schemas/service-package.schema';
import type { AdminServiceCategory, AdminServicePackage } from '@/types/admin-service-package';
import { formatServicePrice } from '@/utils/service-package';
import { Clock, ExternalLink, Gift, ShoppingCart, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

interface PackageLivePreviewProps {
  values: SaveServicePackageFormData;
  selectedCategory?: AdminServiceCategory;
  editingPackage?: AdminServicePackage;
}

const DEFAULT_ACCENT = '#16a34a';
const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export default function PackageLivePreview({ values, selectedCategory, editingPackage }: PackageLivePreviewProps) {
  const accent = HEX_COLOR_PATTERN.test(values.accentColor.trim()) ? values.accentColor.trim() : DEFAULT_ACCENT;
  const priceNumber = /^\d+$/.test(values.price.trim()) ? Number(values.price.trim()) : 0;
  const validityNumber = /^[1-9]\d*$/.test(values.validityDays.trim()) ? Number(values.validityDays.trim()) : null;
  const bonusCreditsNumber = /^\d+$/.test(values.bonusCredits.trim()) ? Number(values.bonusCredits.trim()) : 0;
  const currency = values.currency.trim().toUpperCase() || 'VND';

  const visibilityState = getPackageVisibilityState({ status: values.status }, selectedCategory);
  const visibilityMeta = PACKAGE_VISIBILITY_META[visibilityState];

  const firstSection = values.sections[0];
  const isLiveRoute = Boolean(editingPackage && visibilityState === 'visible' && values.slug.trim());

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-navy dark:text-forest-50 text-xs font-bold tracking-wider uppercase">
            Recruiter card preview
          </h3>
          <span
            className={cn('inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold', visibilityMeta.pillClass)}
          >
            {visibilityMeta.label}
          </span>
        </div>

        <article className="border-outline-variant relative mt-4 flex flex-col rounded-xl border bg-white shadow-xs">
          <span aria-hidden className="h-1 w-full rounded-t-[11px]" style={{ backgroundColor: accent }} />

          {values.vipRibbon && (
            <span className="absolute top-0 right-4 flex h-9 w-7 items-end justify-center bg-amber-400 pb-1 text-[10px] font-extrabold text-amber-900 [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]">
              VIP
            </span>
          )}

          <div className="p-4">
            <div className="flex flex-wrap items-center gap-2 pr-8">
              <h4 className="text-on-surface text-base font-bold tracking-wide">
                {values.name.trim() || 'PACKAGE NAME'}
              </h4>
              <ServicePackageBadges badge={values.badge} bonusCredits={bonusCreditsNumber} />
            </div>

            <p className="mt-1.5 text-xl font-bold tabular-nums" style={{ color: accent }}>
              {formatServicePrice(priceNumber, currency)}
              <span className="ml-0.5 text-rose-500">*</span>
            </p>

            <p className="text-on-surface-variant mt-2.5 text-xs leading-relaxed">
              {values.shortDescription.trim() || 'Short package description shown to recruiters appears here.'}
            </p>

            {(validityNumber || bonusCreditsNumber > 0) && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {validityNumber && (
                  <span className="bg-surface-container-low text-on-surface-variant inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium">
                    <Clock className="h-3 w-3 text-emerald-600" />
                    Hiệu lực {validityNumber} ngày
                  </span>
                )}
                {bonusCreditsNumber > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                    <Gift className="h-3 w-3 text-amber-500" />+{bonusCreditsNumber.toLocaleString('vi-VN')} credits
                  </span>
                )}
              </div>
            )}

            {values.oneTimePerCompany && (
              <p className="mt-2 text-[11px] font-semibold text-rose-600">
                Mỗi doanh nghiệp chỉ được mua và kích hoạt 1 lần
              </p>
            )}

            <div className="mt-4 flex gap-2">
              <span className="border-primary text-primary inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg border bg-white text-xs font-semibold">
                <ShoppingCart className="h-3.5 w-3.5" />
                Thêm vào giỏ
              </span>
              <span className="bg-primary inline-flex h-8 flex-1 items-center justify-center rounded-lg text-xs font-semibold text-white">
                Buy now
              </span>
            </div>
          </div>
        </article>
      </div>

      <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant space-y-3 rounded-lg border bg-white p-5 text-xs shadow-2xs">
        <h3 className="text-navy dark:text-forest-50 font-bold tracking-wider uppercase">Catalog &amp; detail check</h3>

        <dl className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <dt className="dark:text-forest-400 text-on-surface-variant">Category</dt>
            <dd className="text-navy dark:text-forest-100 font-semibold">
              {selectedCategory ? `${selectedCategory.name} (${selectedCategory.code})` : 'Not selected'}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="dark:text-forest-400 text-on-surface-variant">Recruiter URL</dt>
            <dd className="dark:text-forest-200 font-mono text-[11px]">
              /recruiter/services/{values.slug.trim() || '...'}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="dark:text-forest-400 text-on-surface-variant">Entitlements</dt>
            <dd className="text-navy dark:text-forest-100 font-semibold tabular-nums">
              {values.benefits.length} {values.benefits.length === 1 ? 'benefit' : 'benefits'}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="dark:text-forest-400 text-on-surface-variant">Detail sections</dt>
            <dd className="text-navy dark:text-forest-100 font-semibold tabular-nums">
              {values.sections.length} {values.sections.length === 1 ? 'section' : 'sections'}
            </dd>
          </div>
        </dl>

        {firstSection && firstSection.heading.trim() && (
          <div className="dark:border-forest-800 dark:bg-forest-950/60 border-outline-variant rounded-lg border p-2.5">
            <p className="dark:text-forest-400 text-on-surface-variant mb-1 text-[11px]">
              First detail section preview
            </p>
            <p
              className="text-navy dark:text-forest-100 flex items-center gap-1.5 border-l-2 pl-2 font-semibold"
              style={{
                borderColor: HEX_COLOR_PATTERN.test(firstSection.accentColor.trim())
                  ? firstSection.accentColor.trim()
                  : accent,
              }}
            >
              <ServiceSectionIcon name={firstSection.iconName} className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{firstSection.heading}</span>
            </p>
          </div>
        )}

        {values.status === 'ACTIVE' && values.benefits.length === 0 && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
            <span>This package is marked Active but has 0 entitlement benefits.</span>
          </div>
        )}

        {isLiveRoute && (
          <Link
            href={`${ROUTES.RECRUITER_SERVICES}/${values.slug.trim()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border-outline-variant text-primary hover:bg-surface-container-low dark:border-forest-700 dark:hover:bg-forest-850 flex h-9 items-center justify-center gap-1.5 rounded-lg border font-semibold transition"
          >
            <span>View live recruiter page</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </aside>
  );
}
