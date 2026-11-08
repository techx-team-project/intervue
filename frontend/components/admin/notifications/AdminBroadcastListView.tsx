'use client';

import AdminBroadcastTable from '@/components/admin/notifications/AdminBroadcastTable';
import AdminUserConfirmDialog from '@/components/admin/users/AdminUserConfirmDialog';
import Pagination from '@/components/common/Pagination';
import { Button } from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { ROUTES } from '@/constants/routes';
import { useAdminBroadcasts } from '@/hooks/useAdminBroadcasts';
import type { AdminBroadcastResource, BroadcastAudience, BroadcastStatus } from '@/types/notification';
import { AlertTriangle, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type PendingAction = { kind: 'send' | 'cancel' | 'delete'; broadcast: AdminBroadcastResource };

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'SENDING', label: 'Sending' },
  { value: 'SENT', label: 'Sent' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const AUDIENCE_OPTIONS = [
  { value: '', label: 'All audiences' },
  { value: 'CANDIDATE', label: 'Candidates' },
  { value: 'RECRUITER', label: 'Recruiters' },
  { value: 'ADMIN', label: 'Administrators' },
];

const ACTION_COPY: Record<PendingAction['kind'], { title: string; confirmLabel: string }> = {
  send: { title: 'Send this announcement now?', confirmLabel: 'Send now' },
  cancel: { title: 'Cancel this announcement?', confirmLabel: 'Cancel announcement' },
  delete: { title: 'Delete this announcement?', confirmLabel: 'Delete' },
};

export default function AdminBroadcastListView() {
  const router = useRouter();
  const {
    broadcasts,
    totalItems,
    totalPages,
    pageSize,
    filters,
    patchFilters,
    isLoading,
    isError,
    refetch,
    send,
    cancel,
    remove,
    duplicate,
    isMutating,
  } = useAdminBroadcasts();

  const [pending, setPending] = useState<PendingAction | null>(null);

  const runPendingAction = async () => {
    if (!pending) return;
    const { kind, broadcast } = pending;
    setPending(null);
    try {
      if (kind === 'send') {
        await send(broadcast.id);
        toast.success('Announcement is being delivered');
      } else if (kind === 'cancel') {
        await cancel(broadcast.id);
        toast.success('Announcement cancelled');
      } else {
        await remove(broadcast.id);
        toast.success('Draft deleted');
      }
    } catch {
      toast.error('Action failed, please try again');
    }
  };

  const handleDuplicate = async (broadcast: AdminBroadcastResource) => {
    try {
      const copy = await duplicate(broadcast);
      toast.success('Draft copy created');
      router.push(`${ROUTES.ADMIN_CONTENT_ANNOUNCEMENTS}/${copy.id}/edit`);
    } catch {
      toast.error('Could not duplicate the announcement');
    }
  };

  const consequencesFor = (action: PendingAction): string[] => {
    if (action.kind === 'send') {
      return [
        `Every active ${action.broadcast.audience.toLowerCase()} account receives this in their notification centre.`,
        'Recipients who switched off system notifications are skipped automatically.',
        'A sent announcement can no longer be edited, cancelled or deleted.',
      ];
    }
    if (action.kind === 'cancel') {
      return ['The announcement will never be delivered.', 'It stays visible here as a cancelled record.'];
    }
    return ['The record is removed permanently.', 'Only announcements that were never delivered can be deleted.'];
  };

  return (
    <div className="space-y-5 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="dark:text-forest-50 text-on-surface text-xl font-bold sm:text-2xl">Announcements</h1>
          <p className="dark:text-forest-400 text-on-surface-variant mt-1 text-xs">
            Broadcast a notice to every candidate, recruiter or administrator.
          </p>
        </div>

        <Link
          href={`${ROUTES.ADMIN_CONTENT_ANNOUNCEMENTS}/create`}
          className="bg-primary hover:bg-primary inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white shadow-xs transition"
        >
          <Plus className="h-4 w-4" />
          <span>New announcement</span>
        </Link>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-44">
          <Select
            options={STATUS_OPTIONS}
            value={filters.status ?? ''}
            onChange={(event) =>
              patchFilters({ status: (event.target.value || undefined) as BroadcastStatus | undefined })
            }
          />
        </div>
        <div className="w-48">
          <Select
            options={AUDIENCE_OPTIONS}
            value={filters.audience ?? ''}
            onChange={(event) =>
              patchFilters({ audience: (event.target.value || undefined) as BroadcastAudience | undefined })
            }
          />
        </div>
      </div>

      {isLoading ? (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant space-y-3 rounded-2xl border bg-white p-6">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="dark:bg-forest-800 bg-surface-container-high h-10 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-2xl border bg-white py-16 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 stroke-[1.5] text-amber-500" />
          <p className="dark:text-forest-300 text-on-surface-variant mt-3 text-sm font-semibold">
            Could not load announcements
          </p>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        </div>
      ) : (
        <>
          <AdminBroadcastTable
            broadcasts={broadcasts}
            disabled={isMutating}
            onSend={(broadcast) => setPending({ kind: 'send', broadcast })}
            onCancel={(broadcast) => setPending({ kind: 'cancel', broadcast })}
            onDelete={(broadcast) => setPending({ kind: 'delete', broadcast })}
            onDuplicate={handleDuplicate}
          />

          {totalPages > 1 && (
            <Pagination
              page={(filters.page ?? 0) + 1}
              pageCount={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={(nextPage) => patchFilters({ page: nextPage - 1 })}
            />
          )}
        </>
      )}

      {pending && (
        <AdminUserConfirmDialog
          title={ACTION_COPY[pending.kind].title}
          description={pending.broadcast.title}
          consequences={consequencesFor(pending)}
          confirmLabel={ACTION_COPY[pending.kind].confirmLabel}
          onClose={() => setPending(null)}
          onConfirm={runPendingAction}
        />
      )}
    </div>
  );
}
