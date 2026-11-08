'use client';

import {
  BROADCAST_STATUS_STYLES,
  broadcastCapabilities,
  formatBroadcastDate,
} from '@/components/admin/notifications/broadcastActions';
import { ROUTES } from '@/constants/routes';
import type { AdminBroadcastResource } from '@/types/notification';
import { Ban, CheckCircle2, Clock, Copy, Edit, Eye, Send, Sparkles, Trash2, Users } from 'lucide-react';
import Link from 'next/link';

interface AdminBroadcastTableProps {
  broadcasts: AdminBroadcastResource[];
  onSend: (broadcast: AdminBroadcastResource) => void;
  onCancel: (broadcast: AdminBroadcastResource) => void;
  onDelete: (broadcast: AdminBroadcastResource) => void;
  onDuplicate: (broadcast: AdminBroadcastResource) => void;
  disabled?: boolean;
}

const ACTION_CLASS =
  'dark:text-forest-400 dark:hover:bg-forest-800 cursor-pointer rounded-lg p-1.5 text-outline transition disabled:cursor-not-allowed disabled:opacity-40';

export default function AdminBroadcastTable({
  broadcasts,
  onSend,
  onCancel,
  onDelete,
  onDuplicate,
  disabled = false,
}: AdminBroadcastTableProps) {
  if (broadcasts.length === 0) {
    return (
      <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white py-16 text-center shadow-2xs">
        <div className="dark:bg-forest-800 dark:text-forest-400 bg-surface-container-high text-outline flex h-12 w-12 items-center justify-center rounded-2xl">
          <Sparkles className="h-6 w-6" />
        </div>
        <h4 className="dark:text-forest-50 text-on-surface mt-3 text-sm font-bold">No announcements yet</h4>
        <p className="dark:text-forest-400 text-on-surface-variant mt-1 text-xs">
          Create an announcement to reach candidates, recruiters or administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant/80 overflow-hidden rounded-2xl border bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="dark:border-forest-800 dark:bg-forest-950/60 dark:text-forest-400 border-outline-variant bg-surface-container-low/70 text-on-surface-variant border-b font-semibold tracking-wider uppercase">
              <th className="py-3.5 pr-4 pl-6">Announcement</th>
              <th className="px-4 py-3.5">Audience</th>
              <th className="px-4 py-3.5 text-center">Status</th>
              <th className="px-4 py-3.5 text-right">Delivered</th>
              <th className="px-4 py-3.5 text-right">Read</th>
              <th className="px-4 py-3.5">Scheduled</th>
              <th className="px-4 py-3.5">Sent</th>
              <th className="py-3.5 pr-6 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="dark:divide-forest-800 divide-outline-variant divide-y">
            {broadcasts.map((broadcast) => {
              const can = broadcastCapabilities(broadcast.status);
              const detailHref = `${ROUTES.ADMIN_CONTENT_ANNOUNCEMENTS}/${broadcast.id}`;
              const readRate =
                broadcast.deliveredCount > 0
                  ? Math.round((broadcast.readCount / broadcast.deliveredCount) * 100)
                  : null;

              return (
                <tr
                  key={broadcast.id}
                  className="dark:hover:bg-forest-850/50 hover:bg-surface-container-low/50 transition-colors"
                >
                  <td className="py-4 pr-4 pl-6">
                    <div className="max-w-md min-w-0">
                      <Link
                        href={detailHref}
                        className="dark:text-forest-50 text-on-surface hover:text-primary line-clamp-1 font-bold transition"
                        title={broadcast.title}
                      >
                        {broadcast.title}
                      </Link>
                      <p className="dark:text-forest-400 text-label-sm text-outline mt-0.5 line-clamp-1">
                        {broadcast.summary}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="dark:bg-forest-800 dark:text-forest-200 bg-surface-container-high text-label-sm text-on-surface inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold">
                      <Users className="h-3 w-3" />
                      {broadcast.audience}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <span
                      className={`text-label-sm inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold ${BROADCAST_STATUS_STYLES[broadcast.status]}`}
                    >
                      {broadcast.status === 'SENT' ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      <span>{broadcast.status}</span>
                    </span>
                  </td>

                  <td className="dark:text-forest-200 text-on-surface px-4 py-4 text-right font-medium whitespace-nowrap">
                    {broadcast.deliveredCount.toLocaleString()}
                  </td>

                  <td className="dark:text-forest-200 text-on-surface px-4 py-4 text-right font-medium whitespace-nowrap">
                    {broadcast.readCount.toLocaleString()}
                    {readRate !== null && (
                      <span className="dark:text-forest-500 text-label-sm text-outline ml-1">({readRate}%)</span>
                    )}
                  </td>

                  <td className="dark:text-forest-400 text-on-surface-variant px-4 py-4 whitespace-nowrap">
                    {formatBroadcastDate(broadcast.scheduledAt)}
                  </td>

                  <td className="dark:text-forest-400 text-on-surface-variant px-4 py-4 whitespace-nowrap">
                    {formatBroadcastDate(broadcast.sentAt)}
                  </td>

                  <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={detailHref}
                        title="View announcement"
                        className={`${ACTION_CLASS} hover:bg-surface-container-high hover:text-on-surface`}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      {can.canSend && (
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => onSend(broadcast)}
                          title="Send now"
                          className={`${ACTION_CLASS} hover:text-primary hover:bg-emerald-50`}
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}

                      {can.canEdit && (
                        <Link
                          href={`${detailHref}/edit`}
                          title="Edit announcement"
                          className={`${ACTION_CLASS} hover:bg-surface-container-high hover:text-primary`}
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      )}

                      {can.canDuplicate && (
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => onDuplicate(broadcast)}
                          title="Duplicate as a new draft"
                          className={`${ACTION_CLASS} hover:bg-surface-container-high hover:text-on-surface`}
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      )}

                      {can.canCancel && (
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => onCancel(broadcast)}
                          title="Cancel announcement"
                          className={`${ACTION_CLASS} hover:bg-amber-50 hover:text-amber-600`}
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      )}

                      {can.canDelete && (
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => onDelete(broadcast)}
                          title={broadcast.status === 'DRAFT' ? 'Delete draft' : 'Delete cancelled announcement'}
                          className={`${ACTION_CLASS} hover:bg-rose-50 hover:text-rose-600`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
