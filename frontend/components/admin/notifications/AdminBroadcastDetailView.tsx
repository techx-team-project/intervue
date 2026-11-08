'use client';

import {
  BROADCAST_STATUS_STYLES,
  broadcastCapabilities,
  formatBroadcastDateTime,
} from '@/components/admin/notifications/broadcastActions';
import AdminUserConfirmDialog from '@/components/admin/users/AdminUserConfirmDialog';
import NotificationMarkdown from '@/components/common/NotificationMarkdown';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useAdminBroadcast } from '@/hooks/useAdminBroadcasts';
import { SEVERITY_TONE_CLASSES } from '@/constants/notification';
import { AlertTriangle, ArrowLeft, Ban, Copy, Edit, ExternalLink, Send, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface AdminBroadcastDetailViewProps {
  broadcastId: number;
}

type PendingAction = 'send' | 'cancel' | 'delete';

const ACTION_COPY: Record<PendingAction, { title: string; confirmLabel: string }> = {
  send: { title: 'Send this announcement now?', confirmLabel: 'Send now' },
  cancel: { title: 'Cancel this announcement?', confirmLabel: 'Cancel announcement' },
  delete: { title: 'Delete this announcement?', confirmLabel: 'Delete' },
};

export default function AdminBroadcastDetailView({ broadcastId }: AdminBroadcastDetailViewProps) {
  const router = useRouter();
  const { broadcast, audience, isLoading, isError, send, cancel, remove, duplicate, isSending, isMutating } =
    useAdminBroadcast(broadcastId);
  const [pending, setPending] = useState<PendingAction | null>(null);

  const backBar = (
    <div className="dark:border-forest-800 border-outline-variant flex items-center gap-3 border-b pb-3">
      <Link
        href={ROUTES.ADMIN_CONTENT_ANNOUNCEMENTS}
        className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-200 dark:hover:bg-forest-800 border-outline-variant text-on-surface hover:bg-surface-container-low inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold shadow-2xs transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back</span>
      </Link>
      <h1 className="dark:text-forest-300 text-on-surface text-sm font-bold sm:text-base">Announcement details</h1>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-4 pb-16">
        {backBar}
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant space-y-4 rounded-2xl border bg-white p-6">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="dark:bg-forest-800 bg-surface-container-high h-10 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !broadcast) {
    return (
      <div className="space-y-4 pb-16">
        {backBar}
        <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-2xl border bg-white py-16 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 stroke-[1.5] text-amber-500" />
          <p className="dark:text-forest-300 text-on-surface-variant mt-3 text-sm font-semibold">
            Announcement not found
          </p>
        </div>
      </div>
    );
  }

  const can = broadcastCapabilities(broadcast.status);
  const readRate =
    broadcast.deliveredCount > 0 ? Math.round((broadcast.readCount / broadcast.deliveredCount) * 100) : null;

  const runPendingAction = async () => {
    const action = pending;
    setPending(null);
    if (!action) return;
    try {
      if (action === 'send') {
        await send();
        toast.success('Announcement is being delivered');
      } else if (action === 'cancel') {
        await cancel();
        toast.success('Announcement cancelled');
      } else {
        await remove();
        toast.success('Announcement deleted');
        router.push(ROUTES.ADMIN_CONTENT_ANNOUNCEMENTS);
      }
    } catch {
      toast.error('Action failed, please try again');
    }
  };

  const handleDuplicate = async () => {
    try {
      const copy = await duplicate(broadcast);
      toast.success('Draft copy created');
      router.push(`${ROUTES.ADMIN_CONTENT_ANNOUNCEMENTS}/${copy.id}/edit`);
    } catch {
      toast.error('Could not duplicate the announcement');
    }
  };

  const consequences = (action: PendingAction): string[] => {
    if (action === 'send') {
      return [
        audience
          ? `${audience.estimatedRecipients.toLocaleString()} ${broadcast.audience.toLowerCase()} account(s) will receive it.`
          : 'Every active account in the selected audience will receive it.',
        'Recipients who switched off system notifications are skipped automatically.',
        'A sent announcement can no longer be edited, cancelled or deleted.',
      ];
    }
    if (action === 'cancel') {
      return ['The announcement will never be delivered.', 'It stays visible here as a cancelled record.'];
    }
    return ['The record is removed permanently.', 'Only announcements that were never delivered can be deleted.'];
  };

  return (
    <div className="space-y-4 pb-16">
      {backBar}

      <div className="flex flex-wrap items-center justify-end gap-2">
        {can.canSend && (
          <Button size="sm" disabled={isSending || isMutating} onClick={() => setPending('send')}>
            <Send className="mr-1.5 h-3.5 w-3.5" />
            {isSending ? 'Sending…' : 'Send now'}
          </Button>
        )}
        {can.canEdit && (
          <Link
            href={`${ROUTES.ADMIN_CONTENT_ANNOUNCEMENTS}/${broadcast.id}/edit`}
            className="dark:border-forest-800 dark:bg-forest-850 dark:text-forest-200 dark:hover:bg-forest-800 border-outline-variant text-on-surface hover:bg-surface-container-low inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold transition"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Link>
        )}
        <Button variant="outline" size="sm" disabled={isMutating} onClick={handleDuplicate}>
          <Copy className="mr-1.5 h-3.5 w-3.5" />
          Duplicate
        </Button>
        {can.canCancel && (
          <Button variant="outline" size="sm" disabled={isMutating} onClick={() => setPending('cancel')}>
            <Ban className="mr-1.5 h-3.5 w-3.5" />
            Cancel
          </Button>
        )}
        {can.canDelete && (
          <Button variant="danger" size="sm" disabled={isMutating} onClick={() => setPending('delete')}>
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <article className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-2xl border bg-white p-6 shadow-2xs sm:p-8">
            <div className="dark:border-forest-800 border-outline-variant border-b pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-label-sm inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold ${BROADCAST_STATUS_STYLES[broadcast.status]}`}
                >
                  {broadcast.status}
                </span>
                <span
                  className={`inline-block rounded-md border px-2.5 py-0.5 text-xs font-semibold ${SEVERITY_TONE_CLASSES[broadcast.severity]}`}
                >
                  {broadcast.severity}
                </span>
                <span className="dark:bg-forest-800 dark:text-forest-200 bg-surface-container-high text-label-sm text-on-surface inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold">
                  <Users className="h-3 w-3" />
                  {broadcast.audience}
                </span>
              </div>

              <h2 className="dark:text-forest-50 text-on-surface mt-3 text-lg leading-snug font-bold sm:text-xl lg:text-2xl">
                {broadcast.title}
              </h2>
              <p className="dark:text-forest-300 text-on-surface-variant mt-2 text-sm">{broadcast.summary}</p>
            </div>

            <div className="dark:text-forest-200 text-on-surface mt-6 text-sm leading-relaxed">
              <NotificationMarkdown content={broadcast.bodyMarkdown} />
            </div>

            {broadcast.actionUrl && broadcast.actionLabel && (
              <div className="dark:border-forest-800 border-outline-variant mt-6 border-t pt-5">
                <p className="dark:text-forest-400 text-label-sm text-outline font-bold tracking-wider uppercase">
                  Call to action
                </p>
                <Link
                  href={broadcast.actionUrl}
                  className="bg-primary hover:bg-primary mt-2 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white transition"
                >
                  <span>{broadcast.actionLabel}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <p className="dark:text-forest-500 text-label-sm text-outline mt-2">{broadcast.actionUrl}</p>
              </div>
            )}
          </article>
        </div>

        <aside className="space-y-4">
          <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs">
            <p className="dark:text-forest-400 text-label-sm text-outline font-bold tracking-wider uppercase">
              Delivery
            </p>
            <dl className="mt-3 space-y-3">
              <div className="flex items-baseline justify-between">
                <dt className="dark:text-forest-300 text-on-surface-variant text-xs">Delivered</dt>
                <dd className="dark:text-forest-50 text-on-surface text-xl font-bold">
                  {broadcast.deliveredCount.toLocaleString()}
                </dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="dark:text-forest-300 text-on-surface-variant text-xs">Read</dt>
                <dd className="dark:text-forest-50 text-on-surface text-xl font-bold">
                  {broadcast.readCount.toLocaleString()}
                  {readRate !== null && (
                    <span className="dark:text-forest-400 text-outline ml-1 text-xs font-semibold">({readRate}%)</span>
                  )}
                </dd>
              </div>
              {audience && broadcast.status !== 'SENT' && (
                <div className="flex items-baseline justify-between">
                  <dt className="dark:text-forest-300 text-on-surface-variant text-xs">Will reach</dt>
                  <dd className="dark:text-forest-50 text-on-surface text-xl font-bold">
                    {audience.estimatedRecipients.toLocaleString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs">
            <p className="dark:text-forest-400 text-label-sm text-outline font-bold tracking-wider uppercase">
              Timeline
            </p>
            <dl className="dark:divide-forest-800 divide-outline-variant mt-3 divide-y text-xs">
              {[
                { label: 'Created', value: broadcast.createdAt },
                { label: 'Last updated', value: broadcast.updatedAt },
                { label: 'Scheduled for', value: broadcast.scheduledAt },
                { label: 'Sent at', value: broadcast.sentAt },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 py-2">
                  <dt className="dark:text-forest-400 text-on-surface-variant">{row.label}</dt>
                  <dd className="dark:text-forest-200 text-on-surface text-right font-medium">
                    {formatBroadcastDateTime(row.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>

      {pending && (
        <AdminUserConfirmDialog
          title={ACTION_COPY[pending].title}
          description={broadcast.title}
          consequences={consequences(pending)}
          confirmLabel={ACTION_COPY[pending].confirmLabel}
          onClose={() => setPending(null)}
          onConfirm={runPendingAction}
        />
      )}
    </div>
  );
}
