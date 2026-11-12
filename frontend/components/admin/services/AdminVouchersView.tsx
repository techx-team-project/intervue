'use client';

import { adminVoucherApi } from '@/apiRequest/voucher';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminVouchersFilterBar from '@/components/admin/services/vouchers/AdminVouchersFilterBar';
import AdminVouchersMobileList from '@/components/admin/services/vouchers/AdminVouchersMobileList';
import AdminVouchersTable from '@/components/admin/services/vouchers/AdminVouchersTable';
import Pagination from '@/components/common/Pagination';
import { buttonClassName } from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { ROUTES } from '@/constants/routes';
import { recruiterVoucherKeys } from '@/hooks/useRecruiterVouchers';
import { adminVoucherKeys, DEFAULT_VOUCHER_SORT, VOUCHER_PAGE_SIZE_OPTIONS } from '@/lib/admin-vouchers';
import type { Page } from '@/types/api';
import type { AdminVoucher, VoucherDiscountType, VoucherStatus } from '@/types/voucher';
import { getErrorMessage } from '@/utils/error';
import { useQueryClient } from '@tanstack/react-query';
import { FolderKanban, Plus, SearchX, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AdminVouchersViewProps {
  result: Page<AdminVoucher>;
  query: string;
  status: VoucherStatus | '';
  discountType: VoucherDiscountType | '';
  sort: string;
  pageSize: number;
  isFetching: boolean;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: VoucherStatus | '') => void;
  onDiscountTypeChange: (value: VoucherDiscountType | '') => void;
  onSortChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onResetFilters: () => void;
}

export default function AdminVouchersView({
  result,
  query,
  status,
  discountType,
  sort,
  pageSize,
  isFetching,
  onQueryChange,
  onStatusChange,
  onDiscountTypeChange,
  onSortChange,
  onPageChange,
  onPageSizeChange,
  onResetFilters,
}: AdminVouchersViewProps) {
  const queryClient = useQueryClient();
  const [busyVoucherId, setBusyVoucherId] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const vouchers = result.items;
  const hasFilters = Boolean(query.trim() || status || discountType || sort !== DEFAULT_VOUCHER_SORT);

  const handleToggleStatus = async (voucher: AdminVoucher) => {
    const nextActive = voucher.status !== 'ACTIVE';
    setBusyVoucherId(voucher.id);
    try {
      await adminVoucherApi.setStatus(voucher.id, nextActive);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminVoucherKeys.all }),
        queryClient.invalidateQueries({ queryKey: recruiterVoucherKeys.all }),
      ]);
      toast.success(nextActive ? `Voucher "${voucher.code}" activated.` : `Voucher "${voucher.code}" deactivated.`);
    } catch (cause) {
      toast.error(getErrorMessage(cause));
    } finally {
      setBusyVoucherId(null);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      <AdminPageHeader
        className="mb-0"
        description="Manage promotional voucher codes, discount caps, package applicability, and recruiter coupon conditions."
        count={result.totalItems}
        countLabel={hasFilters ? 'matching vouchers' : 'vouchers'}
        actions={
          <>
            <Link
              href={ROUTES.ADMIN_SERVICE_PACKAGES}
              className={buttonClassName({
                variant: 'outline',
                size: 'md',
                className: 'dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850',
              })}
            >
              <FolderKanban className="h-4 w-4" />
              <span>Service packages</span>
            </Link>
            <Link href={ROUTES.ADMIN_SERVICE_VOUCHERS_CREATE} className={buttonClassName({ size: 'md' })}>
              <Plus className="h-4 w-4" />
              <span>New voucher</span>
            </Link>
          </>
        }
      />

      <AdminVouchersFilterBar
        query={query}
        status={status}
        discountType={discountType}
        sort={sort}
        onQueryChange={onQueryChange}
        onStatusChange={onStatusChange}
        onDiscountTypeChange={onDiscountTypeChange}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />

      {vouchers.length === 0 ? (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col items-center justify-center gap-3 rounded-lg border bg-white px-6 py-16 text-center shadow-xs">
          {hasFilters ? <SearchX className="text-outline h-10 w-10" /> : <Ticket className="text-outline h-10 w-10" />}
          <p className="text-navy dark:text-forest-50 text-body-md font-bold">
            {hasFilters ? 'No vouchers match these filters' : 'No vouchers created yet'}
          </p>
          <p className="dark:text-forest-300 text-body-sm text-on-surface-variant max-w-sm">
            {hasFilters
              ? 'Try another code/label keyword or reset status and discount type filters.'
              : 'Create your first voucher to reward recruiters at checkout and in their coupon wallet.'}
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-primary text-body-sm mt-1 cursor-pointer font-bold hover:underline"
            >
              Clear all filters
            </button>
          ) : (
            <Link href={ROUTES.ADMIN_SERVICE_VOUCHERS_CREATE} className={buttonClassName({ size: 'md' })}>
              <Plus className="h-4 w-4" />
              <span>New voucher</span>
            </Link>
          )}
        </div>
      ) : (
        <div className={isFetching ? 'opacity-75 transition-opacity' : 'transition-opacity'}>
          <AdminVouchersTable
            vouchers={vouchers}
            nowMs={nowMs}
            busyVoucherId={busyVoucherId}
            onToggleStatus={handleToggleStatus}
          />
          <AdminVouchersMobileList
            vouchers={vouchers}
            nowMs={nowMs}
            busyVoucherId={busyVoucherId}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      )}

      {result.totalItems > 0 && (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3 shadow-2xs">
          <div className="min-w-0 flex-1">
            <Pagination
              page={result.page + 1}
              pageCount={result.totalPages}
              totalItems={result.totalItems}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </div>
          <div className="w-32 shrink-0">
            <Select
              aria-label="Rows per page"
              value={String(pageSize)}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              options={[...VOUCHER_PAGE_SIZE_OPTIONS]}
              className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50"
            />
          </div>
        </div>
      )}
    </div>
  );
}
