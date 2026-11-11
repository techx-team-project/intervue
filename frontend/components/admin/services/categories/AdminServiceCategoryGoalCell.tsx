'use client';

import { SERVICE_NEED_ADMIN_META } from '@/constants/service-package';
import { isKnownServiceNeedKey } from '@/lib/admin-service-categories';
import type { AdminServiceCategory } from '@/types/admin-service-package';

interface AdminServiceCategoryGoalCellProps {
  category: AdminServiceCategory;
  sharedPeers: AdminServiceCategory[];
}

export default function AdminServiceCategoryGoalCell({ category, sharedPeers }: AdminServiceCategoryGoalCellProps) {
  const { needKey } = category;
  if (!needKey) {
    return <span className="dark:text-forest-400 text-outline text-xs">—</span>;
  }

  const meta = isKnownServiceNeedKey(needKey) ? SERVICE_NEED_ADMIN_META[needKey] : null;
  const hasMultiple = sharedPeers.length > 1;
  const tooltip = hasMultiple
    ? `${meta?.summary ?? needKey}. Shared with ${sharedPeers.map((item) => item.name).join(', ')}.`
    : meta?.summary;

  return (
    <div className="space-y-0.5" title={tooltip}>
      <p className="text-on-surface dark:text-forest-100 text-xs font-medium">{meta ? meta.shortLabel : needKey}</p>
      <p className="text-on-surface-variant dark:text-forest-400 text-[11px]">
        <span className="font-mono">{needKey}</span>
        {hasMultiple && category.isActive && <span> · Shared ({sharedPeers.length})</span>}
      </p>
    </div>
  );
}
