'use client';

import { useToggleSavedJob } from '@/hooks/useCandidateSaved';
import { Trash2 } from 'lucide-react';

export default function SavedJobUnavailableCard({ jobId }: { jobId: number }) {
  const toggle = useToggleSavedJob();

  return (
    <article className="bg-surface-container-low flex items-center justify-between gap-3 rounded-xl border border-dashed border-slate-300 p-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-700">Tin tuyển dụng này không còn nhận hồ sơ</p>
        <p className="mt-0.5 text-xs text-slate-500">Tin đã đóng, hết hạn hoặc bị gỡ khỏi trang.</p>
      </div>
      <button
        type="button"
        aria-label="Xoá khỏi danh sách đã lưu"
        title="Xoá khỏi danh sách đã lưu"
        disabled={toggle.isPending}
        onClick={() => toggle.mutate({ id: jobId, active: false })}
        className="hover:text-error flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-black/5"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>
    </article>
  );
}
