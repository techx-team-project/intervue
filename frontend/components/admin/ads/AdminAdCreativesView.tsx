'use client';

import { adminAdApi } from '@/apiRequest/ads';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdArtworkLightboxModal, { type LightboxArtworkItem } from '@/components/admin/ads/AdArtworkLightboxModal';
import AdminAdCreativesFilterBar from '@/components/admin/ads/creatives/AdminAdCreativesFilterBar';
import AdminAdCreativesMobileList from '@/components/admin/ads/creatives/AdminAdCreativesMobileList';
import AdminAdCreativesTable from '@/components/admin/ads/creatives/AdminAdCreativesTable';
import RejectAdCreativeModal from '@/components/admin/ads/creatives/RejectAdCreativeModal';
import Pagination from '@/components/common/Pagination';
import { buttonClassName } from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { ROUTES } from '@/constants/routes';
import { AD_CREATIVE_PAGE_SIZE_OPTIONS, adminAdKeys, formatIsoWeekRange } from '@/lib/admin-ads';
import type { AdCreativeStatus, AdminAdCreative } from '@/types/ads';
import type { Page } from '@/types/api';
import { getErrorMessage } from '@/utils/error';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Image as ImageIcon, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

interface AdminAdCreativesViewProps {
  result: Page<AdminAdCreative>;
  status: AdCreativeStatus | '';
  pendingCount?: number;
  pageSize: number;
  isFetching: boolean;
  onStatusChange: (status: AdCreativeStatus | '') => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function AdminAdCreativesView({
  result,
  status,
  pendingCount,
  pageSize,
  isFetching,
  onStatusChange,
  onPageChange,
  onPageSizeChange,
}: AdminAdCreativesViewProps) {
  const queryClient = useQueryClient();
  const [busyCreativeId, setBusyCreativeId] = useState<number | null>(null);
  const [rejectTarget, setRejectTarget] = useState<AdminAdCreative | null>(null);
  const [lightboxItem, setLightboxItem] = useState<LightboxArtworkItem | null>(null);

  const creatives = result.items;

  const invalidateCreatives = async () => {
    await queryClient.invalidateQueries({ queryKey: adminAdKeys.all });
  };

  const handleApprove = async (creative: AdminAdCreative) => {
    setBusyCreativeId(creative.id);
    try {
      await adminAdApi.approve(creative.id);
      await invalidateCreatives();
      toast.success(`Artwork for ${creative.slotCode} (Booking #${creative.bookingId}) approved.`);
    } catch (cause) {
      toast.error(getErrorMessage(cause));
    } finally {
      setBusyCreativeId(null);
    }
  };

  const handleConfirmReject = async (creativeId: number, reason: string) => {
    setBusyCreativeId(creativeId);
    try {
      await adminAdApi.reject(creativeId, reason);
      await invalidateCreatives();
      setRejectTarget(null);
      toast.success('Banner artwork rejected and advertiser notified.');
    } catch (cause) {
      toast.error(getErrorMessage(cause));
    } finally {
      setBusyCreativeId(null);
    }
  };

  const handleInspect = (creative: AdminAdCreative) => {
    setLightboxItem({
      title: `${creative.slotCode ?? 'Ad slot'} — ${creative.slotName ?? 'Banner'}`,
      subtitle: `Company #${creative.companyId ?? '—'} · ${formatIsoWeekRange(creative.weekStart, creative.weekEnd)}`,
      imageUrl: creative.imageUrl,
      targetUrl: creative.targetUrl,
      altText: creative.altText,
      width: creative.width,
      height: creative.height,
    });
  };

  const countLabel =
    status === 'PENDING'
      ? 'pending submissions'
      : status === 'APPROVED'
        ? 'approved banners'
        : status === 'REJECTED'
          ? 'rejected banners'
          : 'submissions';

  return (
    <div className="space-y-4 pb-12">
      <AdminPageHeader
        className="mb-0"
        description="Review recruiter banner artwork before it goes live on the storefront. Rejected weeks fall back to the slot's house ad."
        count={result.totalItems}
        countLabel={countLabel}
        actions={
          <Link
            href={ROUTES.ADMIN_ADS_SLOTS}
            className={buttonClassName({
              variant: 'outline',
              size: 'md',
              className: 'dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850',
            })}
          >
            <Megaphone className="h-4 w-4" />
            <span>Manage ad slots</span>
          </Link>
        }
      />

      <AdminAdCreativesFilterBar status={status} pendingCount={pendingCount} onStatusChange={onStatusChange} />

      {creatives.length === 0 ? (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col items-center justify-center gap-3 rounded-lg border bg-white px-6 py-16 text-center shadow-xs">
          {status === 'PENDING' ? (
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          ) : (
            <ImageIcon className="text-outline h-10 w-10" />
          )}
          <p className="text-navy dark:text-forest-50 text-body-md font-bold">
            {status === 'PENDING'
              ? 'All caught up — no artwork waiting for review'
              : status
                ? `No ${status.toLowerCase()} artwork found`
                : 'No artwork has been submitted yet'}
          </p>
          <p className="dark:text-forest-300 text-body-sm text-on-surface-variant max-w-sm">
            {status
              ? 'Switch tabs above to browse artwork in other moderation states.'
              : 'When recruiters upload banners for their booked ad weeks, they will appear here for approval.'}
          </p>
          {status && (
            <button
              type="button"
              onClick={() => onStatusChange('')}
              className="text-primary text-body-sm mt-1 cursor-pointer font-bold hover:underline"
            >
              Show all artwork
            </button>
          )}
        </div>
      ) : (
        <div className={isFetching ? 'opacity-75 transition-opacity' : 'transition-opacity'}>
          <AdminAdCreativesTable
            creatives={creatives}
            busyCreativeId={busyCreativeId}
            onInspect={handleInspect}
            onApprove={handleApprove}
            onOpenReject={setRejectTarget}
          />
          <AdminAdCreativesMobileList
            creatives={creatives}
            busyCreativeId={busyCreativeId}
            onInspect={handleInspect}
            onApprove={handleApprove}
            onOpenReject={setRejectTarget}
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
              options={[...AD_CREATIVE_PAGE_SIZE_OPTIONS]}
              className="dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50"
            />
          </div>
        </div>
      )}

      <RejectAdCreativeModal
        creative={rejectTarget}
        isSubmitting={busyCreativeId !== null && busyCreativeId === rejectTarget?.id}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleConfirmReject}
      />

      <AdArtworkLightboxModal item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </div>
  );
}
