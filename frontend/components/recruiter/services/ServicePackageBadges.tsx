import { SERVICE_BADGE_LABEL } from '@/constants/service-package';
import type { ServicePackageBadge } from '@/types/service-package';
import { Gift, Info } from 'lucide-react';

interface ServicePackageBadgesProps {
  badge: ServicePackageBadge;
  bonusCredits?: number;
}

export default function ServicePackageBadges({ badge, bonusCredits = 0 }: ServicePackageBadgesProps) {
  if (badge === 'NONE') return null;

  if (badge === 'NEW') {
    return (
      <span className="rounded-md bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
        {SERVICE_BADGE_LABEL.NEW}
      </span>
    );
  }

  const tooltipText =
    bonusCredits > 0
      ? `Special offer: get ${bonusCredits.toLocaleString('vi-VN')} bonus credits when you activate the package.`
      : 'This package has a special InterVue promotion applied.';

  return (
    <span className="group relative inline-flex items-center">
      <button
        type="button"
        title={tooltipText}
        aria-label={tooltipText}
        className="inline-flex cursor-help items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
      >
        <Gift className="h-3.5 w-3.5" aria-hidden />
        {SERVICE_BADGE_LABEL.SPECIAL_OFFER}
        <Info className="h-3 w-3 opacity-80" aria-hidden />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute top-full left-0 z-20 mt-1.5 w-60 rounded-lg border border-slate-200 bg-slate-900 px-2.5 py-1.5 text-left text-[11px] leading-snug font-normal text-white opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
      >
        {tooltipText}
      </span>
    </span>
  );
}
