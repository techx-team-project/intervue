'use client';

import { ROUTES } from '@/constants/routes';
import { useJobQuota } from '@/hooks/useRecruiterJobs';
import { cn } from '@/lib/utils';
import type { JobPostFormData } from '@/schemas/job.schema';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useWatch } from 'react-hook-form';

const MIN_DESCRIPTION_LENGTH = 50;
const MIN_REQUIREMENTS_LENGTH = 20;

function checklistOf(values: JobPostFormData): Array<{ label: string; done: boolean }> {
  const hasSalary = values.salaryNegotiable || (values.salaryMin !== undefined && values.salaryMax !== undefined);
  return [
    { label: 'Tiêu đề', done: values.title.trim().length >= 5 },
    { label: 'Nhóm vị trí', done: values.jobRole !== undefined },
    { label: 'Nơi làm việc', done: values.city.trim().length > 0 },
    { label: 'Mức lương', done: hasSalary },
    { label: 'Kỹ năng', done: values.skills.length > 0 },
    { label: 'Mô tả công việc', done: values.description.trim().length >= MIN_DESCRIPTION_LENGTH },
    { label: 'Yêu cầu ứng viên', done: values.requirements.trim().length >= MIN_REQUIREMENTS_LENGTH },
    { label: 'Hạn nộp hồ sơ', done: values.deadline.length > 0 },
  ];
}

export default function JobFormSidebar() {
  const values = useWatch() as JobPostFormData;
  const items = checklistOf(values);
  const doneCount = items.filter((item) => item.done).length;
  const percent = Math.round((doneCount / items.length) * 100);
  const { data: quota } = useJobQuota();
  const outOfSlots = quota !== undefined && quota.slotRequired && quota.slotsRemaining === 0;

  return (
    <aside
      className="border-outline-variant rounded-xl border bg-white p-5 lg:sticky lg:top-24"
      aria-label="Tiến độ hoàn thành"
    >
      <div className="flex items-baseline justify-between">
        <h3 className="text-navy text-body-md font-bold">Tiến độ hoàn thành</h3>
        <span className="text-body-sm text-on-surface-variant tabular-nums">
          {doneCount}/{items.length}
        </span>
      </div>
      <div
        className="bg-surface-container-high mt-3 h-1.5 overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
      </div>

      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2.5">
            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                item.done ? 'bg-primary border-primary text-white' : 'border-outline bg-white',
              )}
              aria-hidden
            >
              {item.done && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span className={cn('text-body-sm', item.done ? 'text-on-surface' : 'text-on-surface-variant')}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      {quota && (
        <div className="border-outline-variant mt-4 border-t pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-body-sm text-on-surface-variant">Lượt đăng tin còn lại</span>
            <span className="text-navy text-body-md font-bold tabular-nums">{quota.slotsRemaining}</span>
          </div>
          {outOfSlots && (
            <p className="text-body-sm mt-2 rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
              Bạn đã hết lượt.{' '}
              <Link href={ROUTES.RECRUITER_SERVICES} className="font-semibold underline">
                Mua thêm dịch vụ
              </Link>
              .
            </p>
          )}
        </div>
      )}

      <p className="text-body-sm text-on-surface-variant border-outline-variant mt-4 border-t pt-4 leading-relaxed">
        Hoàn tất các mục trên để có thể đăng tin. Bạn vẫn lưu nháp được bất cứ lúc nào.
      </p>
    </aside>
  );
}
