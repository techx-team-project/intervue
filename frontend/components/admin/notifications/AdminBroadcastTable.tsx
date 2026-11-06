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
  'dark:text-forest-400 dark:hover:bg-forest-800 cursor-pointer rounded-lg p-1.5 text-slate-400 transition disabled:cursor-not-allowed disabled:opacity-40';

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
      <div className="dark:border-forest-800 dark:bg-forest-900 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-2xs">
        <div className="dark:bg-forest-800 dark:text-forest-400 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Sparkles className="h-6 w-6" />
        </div>
        <h4 className="dark:text-forest-50 mt-3 text-sm font-bold text-slate-900">No announcements yet</h4>
        <p className="dark:text-forest-400 mt-1 text-xs text-slate-500">
          Create an announcement to reach candidates, recruiters or administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="dark:border-forest-800 dark:bg-forest-900 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="dark:border-forest-800 dark:bg-forest-950/60 dark:text-forest-400 border-b border-slate-100 bg-slate-50/70 font-semibold tracking-wider text-slate-500 uppercase">
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
          <tbody className="dark:divide-forest-800 divide-y divide-slate-100">
            {broadcasts.map((broadcast) => {
              const can = broadcastCapabilities(broadcast.status);
              const detailHref = `${ROUTES.ADMIN_CONTENT_ANNOUNCEMENTS}/${broadcast.id}`;
              const readRate =
                broadcast.deliveredCount > 0
                  ? Math.round((broadcast.readCount / broadcast.deliveredCount) * 100)
                  : null;

              return (
                <tr key={broadcast.id} className="dark:hover:bg-forest-850/50 transition-colors hover:bg-slate-50/50">
                  <td className="py-4 pr-4 pl-6">
                    <div className="max-w-md min-w-0">
                      <Link
                        href={detailHref}
                        className="dark:text-forest-50 line-clamp-1 font-bold text-slate-900 transition hover:text-[#00b14f]"
                        title={broadcast.title}
                      >
                        {broadcast.title}
                      </Link>
                      <p className="dark:text-forest-400 mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                        {broadcast.summary}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="dark:bg-forest-800 dark:text-forest-200 inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                      <Users className="h-3 w-3" />
                      {broadcast.audience}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${BROADCAST_STATUS_STYLES[broadcast.status]}`}
                    >
                      {broadcast.status === 'SENT' ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      <span>{broadcast.status}</span>
                    </span>
                  </td>

                  <td className="dark:text-forest-200 px-4 py-4 text-right font-medium whitespace-nowrap text-slate-700">
                    {broadcast.deliveredCount.toLocaleString()}
                  </td>

                  <td className="dark:text-forest-200 px-4 py-4 text-right font-medium whitespace-nowrap text-slate-700">
                    {broadcast.readCount.toLocaleString()}
                    {readRate !== null && (
                      <span className="dark:text-forest-500 ml-1 text-[10px] text-slate-400">({readRate}%)</span>
                    )}
                  </td>

                  <td className="dark:text-forest-400 px-4 py-4 whitespace-nowrap text-slate-500">
                    {formatBroadcastDate(broadcast.scheduledAt)}
                  </td>

                  <td className="dark:text-forest-400 px-4 py-4 whitespace-nowrap text-slate-500">
                    {formatBroadcastDate(broadcast.sentAt)}
                  </td>

                  <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={detailHref}
                        title="View announcement"
                        className={`${ACTION_CLASS} hover:bg-slate-100 hover:text-slate-700`}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      {can.canSend && (
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => onSend(broadcast)}
                          title="Send now"
                          className={`${ACTION_CLASS} hover:bg-emerald-50 hover:text-[#00b14f]`}
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}

                      {can.canEdit && (
                        <Link
                          href={`${detailHref}/edit`}
                          title="Edit announcement"
                          className={`${ACTION_CLASS} hover:bg-slate-100 hover:text-[#00b14f]`}
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
                          className={`${ACTION_CLASS} hover:bg-slate-100 hover:text-slate-700`}
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
