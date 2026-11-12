'use client';

import ServiceSectionIcon from '@/components/common/ServiceSectionIcon';
import Spinner from '@/components/common/Spinner';
import AdWeekPicker from '@/components/recruiter/ads/AdWeekPicker';
import ServicePackageBadges from '@/components/recruiter/services/ServicePackageBadges';
import ServicePackageHeroArtwork from '@/components/recruiter/services/ServicePackageHeroArtwork';
import ServicePackageVouchersCard from '@/components/recruiter/services/ServicePackageVouchersCard';
import { MarkdownRenderer } from '@/components/support-chat/MarkdownRenderer';
import { NumberStepper } from '@/components/ui/NumberStepper';
import { ROUTES } from '@/constants/routes';
import { SERVICE_CATEGORY_ANCHOR_PREFIX, SERVICE_VAT_NOTE } from '@/constants/service-package';
import { useAdCalendar, useAdSlots } from '@/hooks/useAds';
import { useAddToCart } from '@/hooks/useRecruiterCart';
import { useAvailableRecruiterVouchers } from '@/hooks/useRecruiterVouchers';
import { useServicePackage } from '@/hooks/useServiceCatalog';
import { isApiError } from '@/lib/api-error';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { formatServicePrice } from '@/utils/service-package';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Gift,
  Loader2,
  ShoppingCart,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface ServicePackageDetailViewProps {
  slug: string;
}

type ActionFeedback = {
  type: 'success' | 'error';
  message: string;
  requiresCompany?: boolean;
};

const DEFAULT_ACCENT = '#16a34a';

export default function ServicePackageDetailView({ slug }: ServicePackageDetailViewProps) {
  const { data, isPending, isError, error } = useServicePackage(slug);
  const adSlotsQuery = useAdSlots();
  const [quantity, setQuantity] = useState(1);
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);
  const [busyAction, setBusyAction] = useState<'cart' | 'buy' | null>(null);
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);
  const router = useRouter();
  const addToCart = useAddToCart();

  const matchedSlot = useMemo(
    () =>
      data ? ((adSlotsQuery.data ?? []).find((slot) => slot.active && slot.packageSlug === data.slug) ?? null) : null,
    [adSlotsQuery.data, data],
  );
  const adCalendar = useAdCalendar(matchedSlot?.code ?? null, 12);
  const availableVouchers = useAvailableRecruiterVouchers(Boolean(data?.id), data?.id);

  if (isPending) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (isError || !data) {
    const notFound = isApiError(error) && error.code === 'PACKAGE_NOT_AVAILABLE';
    return (
      <div className="border-outline-variant rounded-xl border border-dashed bg-white px-6 py-16 text-center">
        <AlertCircle className="text-on-surface-variant mx-auto h-8 w-8" />
        <p className="text-on-surface mt-3 text-base font-bold">
          {notFound ? 'Không tìm thấy gói dịch vụ' : 'Không tải được gói dịch vụ'}
        </p>
        <p className="text-on-surface-variant mt-1 text-sm">
          {notFound ? 'Gói dịch vụ này hiện đã ngừng mở bán hoặc danh mục đã tạm ẩn.' : getErrorMessage(error)}
        </p>
        <Link
          href={ROUTES.RECRUITER_SERVICES}
          className="bg-primary mt-5 inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-semibold text-white transition hover:brightness-95"
        >
          Quay lại danh sách dịch vụ
        </Link>
      </div>
    );
  }

  const accent = data.accentColor ?? DEFAULT_ACCENT;
  const backToCategoryHref = `${ROUTES.RECRUITER_SERVICES}#${SERVICE_CATEGORY_ANCHOR_PREFIX}${data.categoryCode}`;
  const effectiveQuantity = matchedSlot ? selectedWeeks.length : data.oneTimePerCompany ? 1 : quantity;
  const subtotal = data.price * effectiveQuantity;
  const isNoCompanyCalendarError = isApiError(adCalendar.error) && adCalendar.error.code === 'NOT_COMPANY_MEMBER';

  const toggleWeek = (weekStart: string) => {
    setSelectedWeeks((current) =>
      current.includes(weekStart) ? current.filter((item) => item !== weekStart) : [...current, weekStart],
    );
  };

  const submitAction = (action: 'cart' | 'buy') => {
    if (matchedSlot && selectedWeeks.length === 0) {
      document.getElementById('banner-week-picker')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const warning = 'Vui lòng chọn ít nhất 1 tuần hiển thị ở lịch banner.';
      setFeedback({ type: 'error', message: warning });
      toast.error(warning);
      return;
    }

    const sortedWeeks = matchedSlot ? [...selectedWeeks].sort() : undefined;
    setBusyAction(action);
    addToCart.mutate(
      {
        packageId: data.id,
        quantity: matchedSlot ? selectedWeeks.length : effectiveQuantity,
        weeks: sortedWeeks,
      },
      {
        onSuccess: () => {
          if (action === 'buy') {
            router.push(ROUTES.RECRUITER_CART);
            return;
          }
          const message = sortedWeeks
            ? `Đã thêm "${data.name}" (${sortedWeeks.length} tuần) vào giỏ hàng.`
            : `Đã thêm "${data.name}" vào giỏ hàng.`;
          setFeedback({ type: 'success', message });
          toast.success(message);
        },
        onError: (cause) => {
          const message = getErrorMessage(cause);
          const requiresCompany = isApiError(cause) && cause.code === 'NOT_COMPANY_MEMBER';
          setFeedback({ type: 'error', message, requiresCompany });
          toast.error(message);
          if (matchedSlot) void adCalendar.refetch();
        },
        onSettled: () => setBusyAction(null),
      },
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={backToCategoryHref}
          className="border-outline-variant text-on-surface-variant hover:bg-surface-container-low inline-flex h-9 items-center gap-1.5 rounded-full border bg-white px-3.5 text-sm font-medium transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>
        <h1 className="text-on-surface text-lg font-bold sm:text-xl">Chi tiết dịch vụ</h1>
        <Link
          href={backToCategoryHref}
          className="bg-primary-light text-primary-deep hover:bg-primary-tag rounded-full px-3 py-1 text-xs font-bold transition"
        >
          {data.categoryName}
        </Link>
      </div>

      <section className="border-outline-variant relative overflow-visible rounded-xl border bg-white">
        <ServicePackageHeroArtwork />
        {data.vipRibbon && (
          <span className="absolute top-0 right-5 z-20 flex h-10 w-8 items-end justify-center bg-amber-400 pb-1 text-[11px] font-extrabold text-amber-900 [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]">
            VIP
          </span>
        )}
        <div className="relative z-10 flex min-h-[185px] items-center px-6 py-8 sm:min-h-[240px] sm:px-9 sm:py-10 md:pr-[280px] lg:pr-[390px] xl:pr-[440px]">
          <div className={data.vipRibbon ? 'pr-10 md:pr-0' : undefined}>
            <p className="text-on-surface-variant text-sm font-semibold">
              <Link href={backToCategoryHref} className="text-primary hover:underline">
                {data.categoryName}
              </Link>
              <span className="text-outline mx-1.5">|</span>
              <span>{data.categoryHeadline}</span>
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <p className="text-on-surface text-2xl font-extrabold tracking-wide sm:text-3xl">{data.name}</p>
              <ServicePackageBadges badge={data.badge} bonusCredits={data.bonusCredits} />
            </div>
            {data.shortDescription && (
              <p className="text-on-surface-variant mt-3 flex items-start gap-2 text-sm leading-relaxed">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0" style={{ color: accent }} />
                {data.shortDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      {feedback && (
        <div
          role={feedback.type === 'error' ? 'alert' : 'status'}
          className={cn(
            'flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm font-semibold',
            feedback.type === 'success'
              ? 'border-primary/30 bg-primary-light text-primary-deep'
              : 'border-rose-200 bg-rose-50 text-rose-800',
          )}
        >
          <span className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <Check className="text-primary h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            )}
            {feedback.message}
          </span>
          <span className="flex items-center gap-3">
            {feedback.type === 'success' && (
              <Link href={ROUTES.RECRUITER_CART} className="text-primary font-bold hover:underline">
                Xem giỏ hàng
              </Link>
            )}
            {feedback.requiresCompany && (
              <Link href={ROUTES.RECRUITER_COMPANY} className="font-bold underline">
                Liên kết doanh nghiệp
              </Link>
            )}
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="cursor-pointer opacity-70 transition hover:opacity-100"
              aria-label="Đóng thông báo"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          {matchedSlot && (
            <section id="banner-week-picker" className="border-outline-variant rounded-xl border bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-on-surface flex items-center gap-2 text-base font-bold">
                    <CalendarDays className="text-primary h-4.5 w-4.5 shrink-0" aria-hidden />
                    Chọn tuần hiển thị banner · {matchedSlot.name}
                  </h2>
                  <p className="text-on-surface-variant mt-1 text-xs">
                    Kích thước {matchedSlot.width}×{matchedSlot.height}px · Chỉ 1 doanh nghiệp mỗi tuần.
                  </p>
                </div>
                <span className="bg-primary-light text-primary-deep rounded-full px-2.5 py-1 text-xs font-semibold">
                  {selectedWeeks.length} tuần đã chọn
                </span>
              </div>

              <div className="mt-4">
                {adCalendar.isPending ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : adCalendar.isError ? (
                  <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-950">
                    <p className="flex items-start gap-2 font-semibold">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                      <span>
                        {isNoCompanyCalendarError
                          ? 'Bạn cần liên kết hoặc tạo hồ sơ doanh nghiệp trước khi chọn tuần đặt banner.'
                          : getErrorMessage(adCalendar.error)}
                      </span>
                    </p>
                    {isNoCompanyCalendarError && (
                      <Link
                        href={ROUTES.RECRUITER_COMPANY}
                        className="bg-primary inline-flex h-8 items-center rounded-lg px-3.5 text-xs font-semibold text-white transition hover:brightness-95"
                      >
                        Liên kết doanh nghiệp
                      </Link>
                    )}
                  </div>
                ) : (
                  <AdWeekPicker weeks={adCalendar.data?.weeks ?? []} selected={selectedWeeks} onToggle={toggleWeek} />
                )}
              </div>
            </section>
          )}

          <h2 className="text-on-surface text-xl font-bold">Thông tin chi tiết dịch vụ</h2>

          <div className="border-outline-variant grid gap-px overflow-hidden rounded-lg border bg-neutral-200 sm:grid-cols-2">
            <div className="flex items-center gap-2.5 bg-white px-4 py-3.5 text-sm">
              <Clock className="text-primary h-4.5 w-4.5" />
              <span className="text-on-surface-variant">Thời gian hiệu lực:</span>
              <span className="text-on-surface font-semibold">
                {data.validityDays ? `${data.validityDays} ngày` : 'Không giới hạn'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 bg-white px-4 py-3.5 text-sm">
              <Gift className="h-4.5 w-4.5 text-amber-500" />
              <span className="text-on-surface-variant">Quà tặng:</span>
              <span className="text-on-surface font-semibold">
                {data.bonusCredits > 0 ? `${data.bonusCredits.toLocaleString('vi-VN')} Credits` : 'Không có'}
              </span>
            </div>
          </div>

          {data.benefits.length > 0 && (
            <div>
              <h3 className="border-primary text-on-surface border-l-[3px] pl-3 text-base font-bold">
                Quyền lợi của gói
              </h3>
              <ul className="mt-3 space-y-2.5">
                {data.benefits.map((benefit, index) => (
                  <li
                    key={`${benefit.entitlementType}-${benefit.label}-${index}`}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <CheckCircle2 className="text-primary mt-0.5 h-4.5 w-4.5 shrink-0" />
                    <div className="flex flex-wrap items-center gap-2 leading-relaxed">
                      <span className="text-on-surface-variant">{benefit.label}</span>
                      {benefit.entitlementType === 'JOB_BOOST' && benefit.tier > 1 && (
                        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">
                          Cấp {benefit.tier}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.sections.map((section, index) => {
            const sectionAccent = section.accentColor ?? accent;
            return (
              <div key={`${section.heading}-${index}`}>
                <h3
                  className="text-on-surface flex items-center gap-2 border-l-[3px] pl-3 text-base font-bold"
                  style={{ borderColor: sectionAccent }}
                >
                  <ServiceSectionIcon
                    name={section.iconName}
                    className="h-4.5 w-4.5 shrink-0"
                    style={{ color: sectionAccent }}
                  />
                  <span>{section.heading}</span>
                </h3>
                {section.imageUrl && (
                  <div className="border-primary/20 bg-primary-light mt-3 flex items-center justify-center rounded-xl border p-4 sm:p-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={section.imageUrl}
                      alt={section.heading}
                      className="max-h-[240px] w-auto max-w-full rounded-lg border border-black/5 bg-white object-contain sm:max-h-[280px]"
                    />
                  </div>
                )}
                {section.body && (
                  <MarkdownRenderer
                    content={section.body}
                    className="text-on-surface-variant mt-3 text-sm leading-relaxed"
                  />
                )}
              </div>
            );
          })}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-20">
          <div className="border-primary rounded-xl border-2 bg-white p-5">
            <p className="text-on-surface text-sm font-semibold">{data.name}</p>

            <p className="mt-3 text-2xl font-bold" style={{ color: accent }}>
              {formatServicePrice(data.price, data.currency)}
              <span className="ml-0.5 text-rose-500">*</span>
              {matchedSlot && <span className="text-on-surface-variant ml-1 text-xs font-normal">/ tuần</span>}
            </p>

            {matchedSlot ? (
              <div className="border-outline-variant bg-surface-container-low/60 mt-4 space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-medium">Tuần hiển thị đã chọn</span>
                  <span className="text-on-surface font-bold">{selectedWeeks.length} tuần</span>
                </div>
                {selectedWeeks.length === 0 ? (
                  <a
                    href="#banner-week-picker"
                    className="text-primary inline-block text-xs font-semibold hover:underline"
                  >
                    Chọn ít nhất 1 tuần ở lịch hiển thị ↓
                  </a>
                ) : (
                  <ul className="flex flex-wrap gap-1.5">
                    {[...selectedWeeks].sort().map((week) => (
                      <li
                        key={week}
                        className="bg-primary-light text-primary-deep inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      >
                        {formatDate(week)}
                        <button
                          type="button"
                          onClick={() => toggleWeek(week)}
                          aria-label={`Bỏ tuần ${formatDate(week)}`}
                          className="hover:bg-primary-tag cursor-pointer rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-on-surface-variant text-sm">Số lượng</span>
                <NumberStepper
                  value={effectiveQuantity}
                  onChange={setQuantity}
                  min={1}
                  max={data.oneTimePerCompany ? 1 : 99}
                  disabled={data.oneTimePerCompany}
                  className="w-32"
                />
              </div>
            )}

            {effectiveQuantity > 1 && (
              <div className="border-outline-variant mt-3 flex items-center justify-between border-t pt-3 text-sm">
                <span className="text-on-surface-variant">Tạm tính</span>
                <span className="text-on-surface font-bold">{formatServicePrice(subtotal, data.currency)}</span>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2.5">
              <button
                type="button"
                disabled={busyAction !== null || (matchedSlot !== null && selectedWeeks.length === 0)}
                onClick={() => submitAction('cart')}
                className="border-primary text-primary hover:bg-primary-light inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border bg-white text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busyAction === 'cart' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
                Thêm vào giỏ
              </button>
              <button
                type="button"
                disabled={busyAction !== null || (matchedSlot !== null && selectedWeeks.length === 0)}
                onClick={() => submitAction('buy')}
                className="bg-primary inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg text-sm font-semibold text-white transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busyAction === 'buy' && <Loader2 className="h-4 w-4 animate-spin" />}
                Mua ngay
              </button>
            </div>

            <p className="mt-3 text-xs font-medium text-rose-500">{SERVICE_VAT_NOTE}</p>

            {data.oneTimePerCompany && (
              <p className="mt-2 text-xs font-semibold text-rose-600">
                Mỗi doanh nghiệp chỉ được mua và kích hoạt 1 lần
              </p>
            )}
          </div>

          <ServicePackageVouchersCard vouchers={availableVouchers.data ?? []} />
        </aside>
      </div>
    </div>
  );
}
