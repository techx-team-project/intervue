'use client';

import { adminAdApi } from '@/apiRequest/ads';
import { Button } from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import type { AdminAdCreative } from '@/types/ads';
import { formatDate, formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  APPROVED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-rose-50 text-rose-700',
};

export default function AdminAdCreativesView({ initialCreatives }: { initialCreatives: AdminAdCreative[] }) {
  const [creatives, setCreatives] = useState(initialCreatives);
  const [openId, setOpenId] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const review = async (id: number, approve: boolean) => {
    setBusyId(id);
    setError(null);
    try {
      const saved = approve ? await adminAdApi.approve(id) : await adminAdApi.reject(id, reason.trim());
      setCreatives((current) => current.map((item) => (item.id === saved.id ? saved : item)));
      setOpenId(null);
      setReason('');
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5 pb-16">
      <div>
        <h1 className="text-on-surface text-xl font-bold">Banner artwork</h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Nothing goes live until it is approved. A rejected week shows the house ad instead and is not extended.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden />
          {error}
        </div>
      )}

      {creatives.length === 0 ? (
        <div className="border-outline-variant text-on-surface-variant rounded-2xl border border-dashed px-4 py-12 text-center text-sm">
          No artwork has been submitted yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {creatives.map((creative) => (
            <li key={creative.id} className="border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-on-surface font-semibold">
                    {creative.slotName} · {creative.width}×{creative.height}
                  </p>
                  <p className="text-on-surface-variant text-xs">
                    Company #{creative.companyId} · week {creative.weekStart ? formatDate(creative.weekStart) : '—'} ·
                    submitted {formatDateTime(creative.createdAt)}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[creative.status]}`}>
                  {creative.status}
                </span>
              </div>

              <div className="border-outline-variant mt-3 overflow-x-auto rounded-xl border bg-slate-50 p-3">
                {/* Artwork is served from Cloudinary, which is not in next.config images.remotePatterns */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={creative.imageUrl}
                  alt={creative.altText ?? 'Banner artwork'}
                  className="h-auto max-w-full rounded-lg"
                />
              </div>

              <p className="text-on-surface-variant mt-2 text-xs">
                Links to{' '}
                <a
                  href={creative.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary inline-flex items-center gap-1 hover:underline"
                >
                  {creative.targetUrl}
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              </p>

              {creative.rejectionReason && (
                <p className="mt-2 text-xs font-semibold text-rose-600">{creative.rejectionReason}</p>
              )}

              {creative.status === 'PENDING' &&
                (openId === creative.id ? (
                  <div className="mt-4 space-y-3">
                    <Textarea
                      label="Reason (required when rejecting)"
                      rows={2}
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                    />
                    <div className="flex flex-wrap justify-end gap-3">
                      <Button variant="neutral" onClick={() => setOpenId(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="neutral"
                        disabled={reason.trim().length === 0}
                        isLoading={busyId === creative.id}
                        onClick={() => review(creative.id, false)}
                      >
                        Reject
                      </Button>
                      <Button isLoading={busyId === creative.id} onClick={() => review(creative.id, true)}>
                        Approve
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" className="mt-4" onClick={() => setOpenId(creative.id)}>
                    Review
                  </Button>
                ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
