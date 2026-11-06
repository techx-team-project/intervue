'use client';

import Switch from '@/components/ui/Switch';
import { JOB_FORM_ARRANGEMENT_OPTIONS, JOB_FORM_LEVEL_OPTIONS, getJobExpiryDetails } from '@/constants/recruiter-job';
import { ROUTES } from '@/constants/routes';
import type { useJobPostActions } from '@/hooks/useJobPostActions';
import type { JobSalary, RecruiterJobPost } from '@/types/recruiter-job';
import { formatDate } from '@/utils/datetime';
import { optionLabel } from '@/utils/recruiter-job';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import JobPostRowActionsMenu from './JobPostRowActionsMenu';
import JobPostStatusBadge from './JobPostStatusBadge';

const TONE_CLASS = {
  danger: 'text-rose-600',
  warning: 'text-amber-600',
  normal: 'text-slate-700',
  muted: 'text-slate-400',
} as const;

const ROW_GRID = 'lg:grid lg:grid-cols-[32px_minmax(0,3fr)_1.2fr_1.2fr_1.2fr_44px] lg:items-center lg:gap-4';

interface JobPostsListProps {
  jobs: RecruiterJobPost[];
  actions: ReturnType<typeof useJobPostActions>;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
  onConfirm: (request: { title: string; message: string; run: () => void }) => void;
}

function salaryText(salary: JobSalary) {
  if (salary.negotiable) return 'Thỏa thuận';
  if (salary.min == null || salary.max == null) return '—';
  const unit = salary.currency === 'USD' ? 'USD' : 'triệu';
  const divisor = salary.currency === 'USD' ? 1 : 1_000_000;
  return `${salary.min / divisor} – ${salary.max / divisor} ${unit}`;
}

export default function JobPostsList({
  jobs,
  actions,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  isAllSelected,
  onConfirm,
}: JobPostsListProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div
        className={`hidden border-b border-slate-100 bg-slate-50/70 px-4 py-3 text-[11px] font-bold tracking-wide text-slate-500 uppercase lg:grid lg:grid-cols-[32px_minmax(0,3fr)_1.2fr_1.2fr_1.2fr_44px] lg:gap-4`}
      >
        <input
          type="checkbox"
          checked={isAllSelected && jobs.length > 0}
          onChange={onSelectAll}
          aria-label="Chọn tất cả tin trong trang"
          className="h-4 w-4 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
        />
        <span>Tin tuyển dụng</span>
        <span>Trạng thái</span>
        <span>Mức lương</span>
        <span>Hạn nộp</span>
        <span />
      </div>

      <ul className="divide-y divide-slate-100">
        {jobs.map((job) => {
          const isPending = actions.pendingId === job.id || actions.pendingId === 'bulk';
          const isSelected = selectedIds.has(job.id);
          const expiry = getJobExpiryDetails(job.expiresAt, job.status);
          const canToggle = job.status === 'PUBLISHED' || job.status === 'PAUSED';
          const isEditable = job.status === 'DRAFT' || canToggle;
          const rowMenu = (
            <JobPostRowActionsMenu
              job={job}
              isPending={isPending}
              onPause={() => actions.pauseJob(job.id)}
              onReopen={() => actions.reopenJob(job.id)}
              onClose={() =>
                onConfirm({
                  title: 'Đóng tin tuyển dụng?',
                  message: `Tin "${job.title}" sẽ ngừng nhận hồ sơ và không thể mở lại.`,
                  run: () => actions.closeJob(job.id),
                })
              }
              onDuplicate={() => actions.duplicateJob(job.id)}
              onDelete={() =>
                onConfirm({
                  title: 'Xóa bản nháp?',
                  message: `Bản nháp "${job.title}" sẽ bị xóa vĩnh viễn.`,
                  run: () => actions.deleteJob(job.id),
                })
              }
            />
          );

          return (
            <li
              key={job.id}
              className={`flex flex-col gap-3 px-4 py-4 transition-colors ${ROW_GRID} ${
                isSelected ? 'bg-emerald-50/30' : isPending ? 'opacity-50' : 'hover:bg-slate-50/80'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(job.id)}
                aria-label={`Chọn tin ${job.title}`}
                className="hidden h-4 w-4 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 lg:block"
              />

              <div className="min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`${ROUTES.RECRUITER_JOBS}/${job.id}/${isEditable ? 'edit' : 'preview'}`}
                    className="text-navy truncate text-sm font-bold transition-colors hover:text-emerald-600"
                  >
                    {job.title}
                  </Link>
                  <div className="lg:hidden">{rowMenu}</div>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">
                    {optionLabel(JOB_FORM_LEVEL_OPTIONS, job.level)}
                  </span>
                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">
                    {optionLabel(JOB_FORM_ARRANGEMENT_OPTIONS, job.workingArrangement)}
                  </span>
                  {job.location.city && (
                    <span className="flex items-center gap-1 text-[11.5px]">
                      <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                      {job.location.city}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <JobPostStatusBadge status={job.status} />
                {canToggle && (
                  <Switch
                    checked={job.status === 'PUBLISHED'}
                    onChange={() => actions.toggleJobStatus(job.id, job.status)}
                    size="sm"
                    disabled={isPending}
                    ariaLabel={job.status === 'PUBLISHED' ? 'Tạm dừng tin' : 'Mở lại tin'}
                  />
                )}
              </div>

              <p className="text-sm font-semibold text-slate-700">{salaryText(job.salary)}</p>

              <div className="text-xs">
                <span className={`font-bold ${TONE_CLASS[expiry.tone]}`}>{expiry.label}</span>
                {job.expiresAt && <p className="mt-0.5 text-[11px] text-slate-400">{formatDate(job.expiresAt)}</p>}
              </div>

              <div className="hidden justify-end lg:flex">{rowMenu}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
