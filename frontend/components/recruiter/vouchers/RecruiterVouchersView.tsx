'use client';

import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import PageHeader from '@/components/recruiter/PageHeader';
import CouponWalletCard, {
  availableToCouponCardData,
  usedToCouponCardData,
} from '@/components/recruiter/services/CouponWalletCard';
import { ROUTES } from '@/constants/routes';
import { useAvailableVoucherWallet, useUsedVoucherWallet } from '@/hooks/useRecruiterVouchers';
import { cn } from '@/lib/utils';
import type { AvailableVoucher, VoucherAccentColor } from '@/types/voucher';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, History, TicketCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

type WalletTab = 'available' | 'used';

const WALLET_PAGE_SIZE = 12;
const VOUCHER_COLOR_ORDER: VoucherAccentColor[] = ['EMERALD', 'AMBER', 'ROSE', 'BLUE'];

function groupAvailableByColor(
  vouchers: AvailableVoucher[],
): Array<{ color: VoucherAccentColor; items: AvailableVoucher[] }> {
  const buckets = new Map<VoucherAccentColor, AvailableVoucher[]>();
  for (const color of VOUCHER_COLOR_ORDER) {
    buckets.set(color, []);
  }
  for (const voucher of vouchers) {
    const color = voucher.accentColor && buckets.has(voucher.accentColor) ? voucher.accentColor : 'EMERALD';
    buckets.get(color)?.push(voucher);
  }
  return VOUCHER_COLOR_ORDER.map((color) => ({ color, items: buckets.get(color) ?? [] })).filter(
    (group) => group.items.length > 0,
  );
}

function parseTab(raw: string | null): WalletTab {
  return raw === 'used' ? 'used' : 'available';
}

function parsePageParam(raw: string | null): number {
  if (!raw || !/^\d+$/.test(raw)) return 1;
  return Math.max(1, Number(raw));
}

export default function RecruiterVouchersView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = parseTab(searchParams.get('tab'));
  const currentPage = parsePageParam(searchParams.get('page'));

  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const availableQuery = useAvailableVoucherWallet(
    activeTab === 'available' ? currentPage - 1 : 0,
    WALLET_PAGE_SIZE,
    activeTab === 'available',
  );
  const usedQuery = useUsedVoucherWallet(
    activeTab === 'used' ? currentPage - 1 : 0,
    WALLET_PAGE_SIZE,
    activeTab === 'used',
  );

  const updateRoute = useCallback(
    (nextTab: WalletTab, nextPage: number) => {
      const next = new URLSearchParams();
      if (nextTab === 'used') next.set('tab', 'used');
      if (nextPage > 1) next.set('page', String(nextPage));
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const activeQuery = activeTab === 'available' ? availableQuery : usedQuery;
  const pageData = activeQuery.data;

  useEffect(() => {
    if (!activeQuery.isFetching && pageData && pageData.totalPages > 0 && currentPage > pageData.totalPages) {
      updateRoute(activeTab, pageData.totalPages);
    }
  }, [activeQuery.isFetching, activeTab, currentPage, pageData, updateRoute]);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      updateRoute(activeTab, nextPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [activeTab, updateRoute],
  );
  const groupedAvailable = useMemo(
    () => groupAvailableByColor(availableQuery.data?.items ?? []),
    [availableQuery.data?.items],
  );

  return (
    <div className="space-y-5 pb-16">
      <PageHeader
        title="Vouchers"
        description="Discount codes and voucher usage history for your company's service purchases"
      />

      <div className="border-outline-variant rounded-xl border bg-white p-5 sm:p-6">
        {/* TopCV-style pill tab strip */}
        <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-100 pb-5" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'available'}
            onClick={() => updateRoute('available', 1)}
            className={cn(
              'inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition',
              activeTab === 'available'
                ? 'bg-[#e6f7ee] text-[#008f3f]'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900',
            )}
          >
            <TicketCheck className="h-4 w-4" />
            <span>Active</span>
            {availableQuery.data && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums',
                  activeTab === 'available' ? 'bg-white/90 text-[#008f3f]' : 'bg-white text-slate-600',
                )}
              >
                {availableQuery.data.totalItems}
              </span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'used'}
            onClick={() => updateRoute('used', 1)}
            className={cn(
              'inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition',
              activeTab === 'used'
                ? 'bg-[#e6f7ee] text-[#008f3f]'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900',
            )}
          >
            <History className="h-4 w-4" />
            <span>Used</span>
            {usedQuery.data && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums',
                  activeTab === 'used' ? 'bg-white/90 text-[#008f3f]' : 'bg-white text-slate-600',
                )}
              >
                {usedQuery.data.totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Body */}
        {activeQuery.isPending && !pageData ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Spinner />
          </div>
        ) : activeQuery.isError ? (
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            {getErrorMessage(activeQuery.error)}
          </div>
        ) : !pageData || pageData.items.length === 0 ? (
          <div className="flex min-h-[430px] flex-col items-center justify-center px-4 py-12 text-center">
            <Image
              src="/images/recruiter/empty-vouchers.png"
              alt="You have no vouchers"
              width={440}
              height={330}
              className="h-auto w-[340px] max-w-full object-contain select-none sm:w-[440px]"
              priority
            />
            <p className="text-on-surface mt-5 text-[15px] font-medium">
              {activeTab === 'used' ? 'You have not used any vouchers' : 'You have no vouchers'}
            </p>
            {activeTab === 'available' && (
              <Link
                href={ROUTES.RECRUITER_SERVICES}
                className="mt-4 inline-flex h-9 items-center justify-center rounded-md border border-[#00b14f]/35 bg-[#f0fdf5] px-4 text-xs font-bold text-[#008f3f] transition hover:bg-[#dcfce7]"
              >
                Explore service packages
              </Link>
            )}
          </div>
        ) : (
          <>
            {activeTab === 'available' ? (
              <div className={cn('mt-6 space-y-4 transition-opacity', activeQuery.isFetching && 'opacity-70')}>
                {groupedAvailable.map((group) => (
                  <div key={group.color} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {group.items.map((voucher) => (
                      <CouponWalletCard
                        key={voucher.code}
                        voucher={availableToCouponCardData(voucher)}
                        variant="available"
                        nowMs={nowMs}
                        ctaHref={ROUTES.RECRUITER_SERVICES}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={cn(
                  'mt-6 grid grid-cols-1 gap-4 transition-opacity md:grid-cols-2 xl:grid-cols-3',
                  activeQuery.isFetching && 'opacity-70',
                )}
              >
                {usedQuery.data?.items.map((voucher) => (
                  <CouponWalletCard
                    key={`${voucher.orderCode}-${voucher.code}`}
                    voucher={usedToCouponCardData(voucher)}
                    variant="used"
                    nowMs={nowMs}
                  />
                ))}
              </div>
            )}

            {pageData.totalPages > 1 && (
              <div className="mt-6 border-t border-slate-100 pt-5">
                <Pagination
                  page={currentPage}
                  pageCount={pageData.totalPages}
                  totalItems={pageData.totalItems}
                  pageSize={WALLET_PAGE_SIZE}
                  onPageChange={handlePageChange}
                  showEdges
                  centered
                  hideSummary
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
