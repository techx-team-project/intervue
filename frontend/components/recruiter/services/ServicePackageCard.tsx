import ServicePackageBadges from '@/components/recruiter/services/ServicePackageBadges';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { AdSlot } from '@/types/ads';
import type { ServicePackageCard as ServicePackageCardType } from '@/types/service-package';
import { formatServicePrice } from '@/utils/service-package';
import { CalendarDays, Clock, Gift, Loader2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface ServicePackageCardProps {
  item: ServicePackageCardType;
  adSlot?: AdSlot | null;
  onAddToCart: (item: ServicePackageCardType) => void;
  onBuyNow: (item: ServicePackageCardType) => void;
  busyAction?: 'cart' | 'buy' | null;
  disableActions?: boolean;
}

const DEFAULT_ACCENT = '#16a34a';

export default function ServicePackageCard({
  item,
  adSlot,
  onAddToCart,
  onBuyNow,
  busyAction = null,
  disableActions = false,
}: ServicePackageCardProps) {
  const accent = item.accentColor ?? DEFAULT_ACCENT;
  const hasMetadata = Boolean(adSlot || item.validityDays || item.bonusCredits > 0);
  const actionsDisabled = disableActions || busyAction !== null;

  return (
    <article className="border-outline-variant hover:border-navy relative flex flex-col overflow-visible rounded-xl border bg-white transition">
      <span aria-hidden className="h-1 w-full rounded-t-[11px]" style={{ backgroundColor: accent }} />

      {item.vipRibbon && (
        <span className="absolute top-0 right-4 flex h-9 w-7 items-end justify-center bg-amber-400 pb-1 text-[10px] font-extrabold text-amber-900 [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]">
          VIP
        </span>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 pr-10">
          <h3 className="text-on-surface text-lg font-bold tracking-wide">{item.name}</h3>
          <ServicePackageBadges badge={item.badge} bonusCredits={item.bonusCredits} />
        </div>

        <p className="mt-2 text-2xl font-bold" style={{ color: accent }}>
          {formatServicePrice(item.price, item.currency)}
          <span className="ml-0.5 text-rose-500">*</span>
        </p>

        {item.shortDescription && (
          <p className="text-on-surface-variant mt-3 text-sm leading-relaxed">{item.shortDescription}</p>
        )}

        {hasMetadata && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {adSlot && (
              <span className="bg-primary-light text-primary-deep inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium">
                <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Banner {adSlot.width}×{adSlot.height}px · Đặt theo tuần
              </span>
            )}
            {item.validityDays && (
              <span className="bg-surface-container-low text-on-surface-variant inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium">
                <Clock className="text-primary h-3.5 w-3.5 shrink-0" aria-hidden />
                Hiệu lực {item.validityDays} ngày
              </span>
            )}
            {item.bonusCredits > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                <Gift className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden />+
                {item.bonusCredits.toLocaleString('vi-VN')} credits
              </span>
            )}
          </div>
        )}

        {item.oneTimePerCompany && (
          <p className="mt-2.5 text-xs font-semibold text-rose-600">Mỗi doanh nghiệp chỉ được mua và kích hoạt 1 lần</p>
        )}

        <Link
          href={`${ROUTES.RECRUITER_SERVICES}/${item.slug}`}
          className="text-primary mt-3 inline-flex w-fit items-center text-sm font-semibold hover:underline"
        >
          Xem chi tiết ›
        </Link>

        <div className="mt-auto flex gap-2.5 pt-5">
          <button
            type="button"
            onClick={() => onAddToCart(item)}
            disabled={actionsDisabled}
            className={cn(
              'border-primary text-primary inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5',
              'hover:bg-primary-light rounded-lg border bg-white text-sm font-semibold transition active:scale-[0.98]',
              'disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            {busyAction === 'cart' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            {adSlot ? 'Chọn tuần' : 'Thêm vào giỏ'}
          </button>
          <button
            type="button"
            onClick={() => onBuyNow(item)}
            disabled={actionsDisabled}
            className="bg-primary inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg text-sm font-semibold text-white transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busyAction === 'buy' && <Loader2 className="h-4 w-4 animate-spin" />}
            Mua ngay
          </button>
        </div>
      </div>
    </article>
  );
}
