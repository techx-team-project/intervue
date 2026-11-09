import { SERVICE_BADGE_LABEL } from '@/constants/service-package';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { ServicePackageCard as ServicePackageCardType } from '@/types/service-package';
import { formatServicePrice } from '@/utils/service-package';
import { Gift, Info, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface ServicePackageCardProps {
  item: ServicePackageCardType;
  onPurchaseAction: (item: ServicePackageCardType) => void;
}

const DEFAULT_ACCENT = '#16a34a';

export default function ServicePackageCard({ item, onPurchaseAction }: ServicePackageCardProps) {
  const accent = item.accentColor ?? DEFAULT_ACCENT;

  return (
    <article className="border-outline-variant relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-xs transition hover:shadow-md">
      <span aria-hidden className="h-1 w-full" style={{ backgroundColor: accent }} />

      {item.vipRibbon && (
        <span className="absolute top-0 right-4 flex h-9 w-7 items-end justify-center bg-amber-400 pb-1 text-[10px] font-extrabold text-amber-900 [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]">
          VIP
        </span>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 pr-10">
          <h3 className="text-on-surface text-lg font-bold tracking-wide">{item.name}</h3>
          {item.badge === 'SPECIAL_OFFER' && (
            <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-600">
              <Gift className="h-3.5 w-3.5" />
              {SERVICE_BADGE_LABEL.SPECIAL_OFFER}
              <Info className="h-3 w-3" />
            </span>
          )}
          {item.badge === 'NEW' && (
            <span className="rounded-md bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
              {SERVICE_BADGE_LABEL.NEW}
            </span>
          )}
        </div>

        <p className="mt-2 text-2xl font-bold" style={{ color: accent }}>
          {formatServicePrice(item.price, item.currency)}
          <span className="ml-0.5 text-rose-500">*</span>
        </p>

        {item.shortDescription && (
          <p className="text-on-surface-variant mt-3 text-sm leading-relaxed">{item.shortDescription}</p>
        )}

        {item.oneTimePerCompany && (
          <p className="mt-2 text-xs font-semibold text-rose-600">Mỗi doanh nghiệp chỉ được mua và kích hoạt 1 lần</p>
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
            onClick={() => onPurchaseAction(item)}
            className={cn(
              'border-primary text-primary inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5',
              'rounded-lg border bg-white text-sm font-semibold transition hover:bg-emerald-50 active:scale-[0.98]',
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            Thêm vào giỏ
          </button>
          <button
            type="button"
            onClick={() => onPurchaseAction(item)}
            className="bg-primary inline-flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg text-sm font-semibold text-white transition hover:brightness-95 active:scale-[0.98]"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </article>
  );
}
