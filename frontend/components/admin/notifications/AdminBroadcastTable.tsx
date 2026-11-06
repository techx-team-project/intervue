'use client';

import type { AdminBroadcastResource, BroadcastStatus } from '@/types/notification';
import { Ban, CheckCircle2, Clock, Edit, Send, Sparkles, Trash2, Users } from 'lucide-react';
import Link from 'next/link';

interface AdminBroadcastTableProps {
  broadcasts: AdminBroadcastResource[];
  onSend: (broadcast: AdminBroadcastResource) => void;
  onCancel: (broadcast: AdminBroadcastResource) => void;
  onDelete: (broadcast: AdminBroadcastResource) => void;
  disabled?: boolean;
}

const STATUS_STYLES: Record<BroadcastStatus, string> = {
  DRAFT: 'bg-slate-100 text-slate-600 dark:bg-forest-800 dark:text-forest-300',
  SCHEDULED: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  SENDING: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  SENT: 'bg-emerald-50 text-[#00b14f] dark:bg-emerald-950/40 dark:text-emerald-300',
  CANCELLED: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminBroadcastTable({
  broadcasts,
  onSend,
  onCancel,
  onDelete,
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
              <th className="px-4 py-3.5">Scheduled</th>
              <th className="px-4 py-3.5">Sent</th>
              <th className="py-3.5 pr-6 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="dark:divide-forest-800 divide-y divide-slate-100">
            {broadcasts.map((broadcast) => {
              const isEditable = broadcast.status === 'DRAFT' || broadcast.status === 'SCHEDULED';
              const isSendable = isEditable;
              const isDeletable = broadcast.status === 'DRAFT';

              return (
                <tr key={broadcast.id} className="dark:hover:bg-forest-850/50 transition-colors hover:bg-slate-50/50">
                  <td className="py-4 pr-4 pl-6">
                    <div className="max-w-md min-w-0">
                      {isEditable ? (
                        <Link
                          href={`/admin/content/announcements/${broadcast.id}/edit`}
                          className="dark:text-forest-50 line-clamp-1 font-bold text-slate-900 transition hover:text-[#00b14f]"
                          title={broadcast.title}
                        >
                          {broadcast.title}
                        </Link>
                      ) : (
                        <span className="dark:text-forest-50 line-clamp-1 font-bold text-slate-900">
                          {broadcast.title}
                        </span>
                      )}
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
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${STATUS_STYLES[broadcast.status]}`}
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

                  <td className="dark:text-forest-400 px-4 py-4 whitespace-nowrap text-slate-500">
                    {formatDate(broadcast.scheduledAt)}
                  </td>

                  <td className="dark:text-forest-400 px-4 py-4 whitespace-nowrap text-slate-500">
                    {formatDate(broadcast.sentAt)}
                  </td>

                  <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {isSendable && (
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => onSend(broadcast)}
                          title="Send now"
                          className="dark:text-forest-400 dark:hover:bg-forest-800 cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-emerald-50 hover:text-[#00b14f] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}

                      {isEditable && (
                        <>
                          <Link
                            href={`/admin/content/announcements/${broadcast.id}/edit`}
                            title="Edit announcement"
                            className="dark:text-forest-400 dark:hover:bg-forest-800 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-[#00b14f]"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => onCancel(broadcast)}
                            title="Cancel announcement"
                            className="dark:text-forest-400 dark:hover:bg-forest-800 cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      {isDeletable && (
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => onDelete(broadcast)}
                          title="Delete draft"
                          className="dark:text-forest-400 dark:hover:bg-forest-800 cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
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
