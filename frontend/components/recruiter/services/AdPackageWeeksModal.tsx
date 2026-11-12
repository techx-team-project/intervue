'use client';

import Spinner from '@/components/common/Spinner';
import AdWeekPicker from '@/components/recruiter/ads/AdWeekPicker';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ROUTES } from '@/constants/routes';
import { useAdCalendar } from '@/hooks/useAds';
import { useAddToCart } from '@/hooks/useRecruiterCart';
import { isApiError } from '@/lib/api-error';
import type { AdSlot } from '@/types/ads';
import { getErrorMessage } from '@/utils/error';
import { formatServicePrice } from '@/utils/service-package';
import { AlertCircle, CalendarDays, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface AdPackageWeeksModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: AdSlot;
  packageItem: {
    id: number;
    name: string;
    price: number;
    currency: string;
  };
  intent: 'cart' | 'buy';
  onAddedToCart: (message: string) => void;
}

export default function AdPackageWeeksModal({
  isOpen,
  onClose,
  slot,
  packageItem,
  intent,
  onAddedToCart,
}: AdPackageWeeksModalProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const calendar = useAdCalendar(isOpen ? slot.code : null, 12);
  const addToCart = useAddToCart();

  const isNoCompanyError = isApiError(calendar.error) && calendar.error.code === 'NOT_COMPANY_MEMBER';
  const total = packageItem.price * selected.length;

  const toggleWeek = (weekStart: string) => {
    setSubmitError(null);
    setSelected((current) =>
      current.includes(weekStart) ? current.filter((item) => item !== weekStart) : [...current, weekStart],
    );
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      setSubmitError('Please select at least 1 display week.');
      return;
    }

    const weeks = [...selected].sort();
    setSubmitError(null);

    addToCart.mutate(
      { packageId: packageItem.id, quantity: weeks.length, weeks },
      {
        onSuccess: () => {
          onClose();
          if (intent === 'buy') {
            router.push(ROUTES.RECRUITER_CART);
            return;
          }
          const message = `Added "${packageItem.name}" (${weeks.length} weeks) to your cart.`;
          onAddedToCart(message);
          toast.success(message);
        },
        onError: (cause) => {
          const message = getErrorMessage(cause);
          setSubmitError(message);
          toast.error(message);
          void calendar.refetch();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      radius="2xl"
      title={
        <div className="flex items-center gap-2">
          <CalendarDays className="text-primary h-5 w-5 shrink-0" aria-hidden />
          <span>Select display weeks · {packageItem.name}</span>
        </div>
      }
      description={`${slot.name} (${slot.width}×${slot.height}px) · ${formatServicePrice(packageItem.price, packageItem.currency)} / week`}
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <p className="text-on-surface-variant text-sm">
            <strong className="text-on-surface">{selected.length}</strong> weeks selected
            {selected.length > 0 && (
              <>
                {' · '}
                <strong className="text-primary">{formatServicePrice(total, packageItem.currency)}</strong> (excl. VAT)
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="neutral" size="md" radius="lg" onClick={onClose} disabled={addToCart.isPending}>
              Close
            </Button>
            <Button
              variant="primary"
              size="md"
              radius="lg"
              leftIcon={intent === 'cart' ? <ShoppingCart className="h-4 w-4" /> : undefined}
              disabled={selected.length === 0 || calendar.isPending || calendar.isError}
              isLoading={addToCart.isPending}
              onClick={handleSubmit}
            >
              {intent === 'buy' ? 'Continue to payment' : 'Add to cart'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="border-outline-variant bg-surface-container-low/70 text-on-surface-variant rounded-xl border px-3.5 py-2.5 text-xs leading-relaxed">
          Each slot is sold to <strong>only 1 company per week</strong>. Booked weeks are reserved as soon as the order
          is created and go live once the order is paid.
        </div>

        {submitError && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden />
            <span>{submitError}</span>
          </div>
        )}

        {calendar.isPending ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : calendar.isError ? (
          <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-950">
            <p className="flex items-start gap-2 font-semibold">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
              <span>
                {isNoCompanyError
                  ? 'You need to link or complete your company profile before choosing a banner schedule.'
                  : getErrorMessage(calendar.error)}
              </span>
            </p>
            {isNoCompanyError && (
              <div className="flex flex-wrap gap-2 pl-6">
                <Link
                  href={ROUTES.RECRUITER_COMPANY}
                  onClick={onClose}
                  className="bg-primary inline-flex h-8 items-center rounded-lg px-3.5 text-xs font-semibold text-white transition hover:brightness-95"
                >
                  Link company
                </Link>
                <Link
                  href={ROUTES.RECRUITER_ONBOARDING}
                  onClick={onClose}
                  className="border-outline-variant text-on-surface hover:bg-surface-container-low inline-flex h-8 items-center rounded-lg border bg-white px-3.5 text-xs font-semibold transition"
                >
                  Complete setup
                </Link>
              </div>
            )}
          </div>
        ) : (
          <AdWeekPicker weeks={calendar.data?.weeks ?? []} selected={selected} onToggle={toggleWeek} />
        )}
      </div>
    </Modal>
  );
}
