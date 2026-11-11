'use client';

import Spinner from '@/components/common/Spinner';
import { MarkdownRenderer } from '@/components/support-chat/MarkdownRenderer';
import { NumberStepper } from '@/components/ui/NumberStepper';
import { ROUTES } from '@/constants/routes';
import { SERVICE_CATEGORY_ANCHOR_PREFIX, SERVICE_VAT_NOTE } from '@/constants/service-package';
import { useAddToCart } from '@/hooks/useRecruiterCart';
import { useServicePackage } from '@/hooks/useServiceCatalog';
import { isApiError } from '@/lib/api-error';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/utils/error';
import { formatServicePrice } from '@/utils/service-package';
import { AlertCircle, ArrowLeft, Check, CheckCircle2, Clock, Gift, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface ServicePackageDetailViewProps {
  slug: string;
}

type ActionFeedback = {
  type: 'success' | 'error';
  message: string;
};

const DEFAULT_ACCENT = '#16a34a';

export default function ServicePackageDetailView({ slug }: ServicePackageDetailViewProps) {
  const { data, isPending, isError, error } = useServicePackage(slug);
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);
  const router = useRouter();
  const addToCart = useAddToCart();

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
          className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
        >
          {data.categoryName}
        </Link>
      </div>

      <section className="border-outline-variant relative overflow-hidden rounded-xl border bg-gradient-to-r from-emerald-50 via-emerald-50/40 to-white">
        <div className="grid items-center gap-6 p-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="text-on-surface-variant text-sm font-semibold">
              <Link href={backToCategoryHref} className="text-primary hover:underline">
                {data.categoryName}
              </Link>
              <span className="text-outline mx-1.5">|</span>
              <span>{data.categoryHeadline}</span>
            </p>
            <p className="text-on-surface mt-1.5 text-3xl font-extrabold tracking-wide">{data.name}</p>
            {data.shortDescription && (
              <p className="text-on-surface-variant mt-3 flex items-start gap-2 text-sm leading-relaxed">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0" style={{ color: accent }} />
                {data.shortDescription}
              </p>
            )}
          </div>

          {data.heroImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.heroImageUrl}
              alt=""
              className="mx-auto hidden h-auto w-full max-w-[320px] rotate-[-6deg] rounded-lg object-contain shadow-lg lg:block"
            />
          )}
        </div>
      </section>

      {feedback && (
        <div
          role={feedback.type === 'error' ? 'alert' : 'status'}
          className={cn(
            'flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold',
            feedback.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-rose-200 bg-rose-50 text-rose-800',
          )}
        >
          <span className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
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

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <h2 className="text-on-surface text-xl font-bold">Thông tin chi tiết dịch vụ</h2>

          <div className="border-outline-variant grid gap-px overflow-hidden rounded-lg border bg-neutral-200 sm:grid-cols-2">
            <div className="flex items-center gap-2.5 bg-white px-4 py-3.5 text-sm">
              <Clock className="h-4.5 w-4.5 text-emerald-600" />
              <span className="text-on-surface-variant">Thời gian hiệu lực:</span>
              <span className="text-on-surface font-semibold">
                {data.validityDays ? `${data.validityDays} ngày` : 'Không giới hạn'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 bg-white px-4 py-3.5 text-sm">
              <Gift className="h-4.5 w-4.5 text-amber-500" />
              <span className="text-on-surface-variant">Quà tặng:</span>
              <span className="text-on-surface font-semibold">
                {data.bonusCredits > 0 ? `${data.bonusCredits} Credits` : 'Không có'}
              </span>
            </div>
          </div>

          {data.benefits.length > 0 && (
            <div>
              <h3 className="border-primary text-on-surface border-l-[3px] pl-3 text-base font-bold">
                Quyền lợi của gói
              </h3>
              <ul className="mt-3 space-y-2.5">
                {data.benefits.map((benefit) => (
                  <li key={`${benefit.entitlementType}-${benefit.label}`} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" />
                    <span className="text-on-surface-variant leading-relaxed">{benefit.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.sections.map((section) => (
            <div key={section.heading}>
              <h3
                className="text-on-surface border-l-[3px] pl-3 text-base font-bold"
                style={{ borderColor: section.accentColor ?? accent }}
              >
                {section.heading}
              </h3>
              {section.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={section.imageUrl}
                  alt=""
                  className="border-outline-variant mt-3 h-auto w-full rounded-lg border object-contain"
                />
              )}
              {section.body && (
                <MarkdownRenderer
                  content={section.body}
                  className="text-on-surface-variant mt-3 text-sm leading-relaxed"
                />
              )}
            </div>
          ))}
        </div>

        <aside className="lg:sticky lg:top-20">
          <div className="rounded-xl border-2 border-emerald-500 bg-white p-5">
            <p className="text-on-surface text-sm font-semibold">{data.name}</p>

            <p className="mt-3 text-2xl font-bold" style={{ color: accent }}>
              {formatServicePrice(data.price, data.currency)}
              <span className="ml-0.5 text-rose-500">*</span>
            </p>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-on-surface-variant text-sm">Số lượng</span>
              <NumberStepper value={quantity} onChange={setQuantity} min={1} max={99} className="w-32" />
            </div>

            <div className="mt-4 flex flex-col gap-2.5">
              <button
                type="button"
                disabled={addToCart.isPending}
                onClick={() =>
                  addToCart.mutate(
                    { packageId: data.id, quantity },
                    {
                      onSuccess: () => {
                        const message = `Đã thêm "${data.name}" vào giỏ hàng.`;
                        setFeedback({ type: 'success', message });
                        toast.success(message);
                      },
                      onError: (cause) => {
                        const message = getErrorMessage(cause);
                        setFeedback({ type: 'error', message });
                        toast.error(message);
                      },
                    },
                  )
                }
                className="border-primary text-primary inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border bg-white text-sm font-semibold transition hover:bg-emerald-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingCart className="h-4 w-4" />
                Thêm vào giỏ
              </button>
              <button
                type="button"
                disabled={addToCart.isPending}
                onClick={() =>
                  addToCart.mutate(
                    { packageId: data.id, quantity },
                    {
                      onSuccess: () => router.push(ROUTES.RECRUITER_CART),
                      onError: (cause) => {
                        const message = getErrorMessage(cause);
                        setFeedback({ type: 'error', message });
                        toast.error(message);
                      },
                    },
                  )
                }
                className="bg-primary inline-flex h-10 cursor-pointer items-center justify-center rounded-lg text-sm font-semibold text-white transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
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
        </aside>
      </div>
    </div>
  );
}
