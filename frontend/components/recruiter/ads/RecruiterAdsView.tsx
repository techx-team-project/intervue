'use client';

import { recruiterCartApi } from '@/apiRequest/recruiter-cart';
import Spinner from '@/components/common/Spinner';
import AdCreativeUploader from '@/components/recruiter/ads/AdCreativeUploader';
import AdWeekPicker from '@/components/recruiter/ads/AdWeekPicker';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useAdBookings, useAdCalendar, useAdSlots } from '@/hooks/useAds';
import { cn } from '@/lib/utils';
import type { AdBooking } from '@/types/ads';
import { formatDate } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { formatServicePrice } from '@/utils/service-package';
import { AlertCircle, Check, ImageUp, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const WEEKS_AHEAD = 12;

const CREATIVE_LABEL: Record<string, string> = {
  PENDING: 'Pending review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export default function RecruiterAdsView() {
  const slots = useAdSlots();
  const bookings = useAdBookings();
  const [slotCode, setSlotCode] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [target, setTarget] = useState<AdBooking | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const activeCode = slotCode ?? slots.data?.[0]?.code ?? null;
  const calendar = useAdCalendar(activeCode, WEEKS_AHEAD);

  if (slots.isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (slots.isError) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
        <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden />
        {getErrorMessage(slots.error)}
      </div>
    );
  }

  const slot = calendar.data?.slot ?? null;
  const total = slot ? slot.pricePerWeek * selected.length : 0;

  const pickSlot = (code: string) => {
    setSlotCode(code);
    setSelected([]);
    setError(null);
  };

  const toggleWeek = (weekStart: string) =>
    setSelected((current) =>
      current.includes(weekStart) ? current.filter((item) => item !== weekStart) : [...current, weekStart],
    );

  const addToCart = async () => {
    if (!slot || selected.length === 0) return;
    setIsAdding(true);
    setError(null);
    try {
      const packageId = await resolvePackageId(slot.packageSlug);
      await recruiterCartApi.addItem(packageId, selected.length, [...selected].sort());
      setSelected([]);
      setNotice('Added to cart. Go to your cart to pay and reserve these weeks.');
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-on-surface flex items-center gap-2 text-xl font-bold">
          <Megaphone className="text-primary h-5 w-5" aria-hidden />
          Banner ads
        </h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Each slot is sold to <strong>one company per week</strong>. The slot is held as soon as you place an order and
          becomes yours once the order is paid.
        </p>
      </div>

      {notice && (
        <div className="border-primary/30 bg-primary-light text-primary-deep flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold">
          <Check className="text-primary h-4 w-4 shrink-0" aria-hidden />
          {notice}
          <Link href={ROUTES.RECRUITER_CART} className="ml-auto underline">
            Go to cart
          </Link>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden />
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {(slots.data ?? []).map((item) => (
          <button
            key={item.code}
            type="button"
            onClick={() => pickSlot(item.code)}
            className={cn(
              'cursor-pointer rounded-xl border px-4 py-2 text-sm font-semibold transition',
              item.code === activeCode
                ? 'border-primary bg-primary-light text-primary-deep'
                : 'border-outline-variant text-on-surface-variant hover:border-primary bg-white',
            )}
          >
            {item.name}
            <span className="text-on-surface-variant block text-xs font-normal">
              {item.width}×{item.height} · {formatServicePrice(item.pricePerWeek, 'VND')}/week
            </span>
          </button>
        ))}
      </div>

      <section className="border-outline-variant rounded-xl border bg-white p-5">
        {calendar.isPending || !slot ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-on-surface text-base font-bold">{slot.name}</h2>
                <p className="text-on-surface-variant mt-0.5 text-xs">{slot.description}</p>
              </div>
              <p className="text-on-surface text-sm font-semibold">
                {formatServicePrice(slot.pricePerWeek, 'VND')} / week
              </p>
            </div>

            <div className="mt-4">
              <AdWeekPicker weeks={calendar.data?.weeks ?? []} selected={selected} onToggle={toggleWeek} />
            </div>

            <div className="border-outline-variant mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
              <p className="text-on-surface-variant text-sm">
                Selected <strong className="text-on-surface">{selected.length}</strong> weeks ·{' '}
                <strong className="text-on-surface">{formatServicePrice(total, 'VND')}</strong> excl. VAT
              </p>
              <Button disabled={selected.length === 0} isLoading={isAdding} onClick={addToCart}>
                Add to cart
              </Button>
            </div>
          </>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-on-surface text-base font-bold">Your schedule</h2>
        {bookings.isPending ? (
          <Spinner />
        ) : (bookings.data ?? []).length === 0 ? (
          <div className="border-outline-variant text-on-surface-variant rounded-xl border border-dashed px-4 py-10 text-center text-sm">
            You have not booked any banner weeks yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {(bookings.data ?? []).map((booking) => (
              <li key={booking.id} className="border-outline-variant rounded-xl border bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-on-surface font-semibold">
                      {booking.slotName}
                      {booking.running && (
                        <span className="bg-primary-light text-primary-deep ml-2 rounded-full px-2 py-0.5 text-xs font-bold">
                          Running
                        </span>
                      )}
                    </p>
                    <p className="text-on-surface-variant text-xs">
                      {formatDate(booking.weekStart)} → {formatDate(booking.weekEnd)} ·{' '}
                      {booking.status === 'RESERVED' ? 'Reserved, awaiting payment' : 'Paid'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-on-surface-variant text-xs">
                      {booking.impressions.toLocaleString('vi-VN')} views · {booking.clicks.toLocaleString('vi-VN')}{' '}
                      clicks
                    </p>
                    {booking.status === 'BOOKED' && (
                      <Button
                        size="sm"
                        variant="neutral"
                        leftIcon={<ImageUp className="h-4 w-4" aria-hidden />}
                        onClick={() => setTarget(booking)}
                      >
                        {booking.creativeStatus ? 'Change image' : 'Upload image'}
                      </Button>
                    )}
                  </div>
                </div>

                {booking.creativeStatus && (
                  <p className="text-on-surface-variant mt-2 text-xs">
                    Image: {CREATIVE_LABEL[booking.creativeStatus]}
                    {booking.rejectionReason && <span className="text-rose-600"> — {booking.rejectionReason}</span>}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <AdCreativeUploader booking={target} onClose={() => setTarget(null)} onUploaded={setNotice} />
    </div>
  );
}

async function resolvePackageId(slug: string | null): Promise<number> {
  if (!slug) throw new Error('This slot is not linked to a service package, please contact InterVue.');
  const { servicePackageApi } = await import('@/apiRequest/service-package');
  const detail = await servicePackageApi.getBySlug(slug);
  return detail.id;
}
