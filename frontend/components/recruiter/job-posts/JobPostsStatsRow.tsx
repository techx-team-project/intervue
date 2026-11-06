'use client';

import type { RecruiterJobCounts, RecruiterJobSegment } from '@/types/recruiter-job';
import { CheckCircle2, FileText, PauseCircle, TimerOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface JobPostsStatsRowProps {
  counts?: RecruiterJobCounts;
  currentSegment: RecruiterJobSegment;
  onSelectSegment: (segment: RecruiterJobSegment) => void;
}

const CARDS: Array<{
  segment: RecruiterJobSegment;
  label: string;
  hint: string;
  icon: LucideIcon;
  value: (counts: RecruiterJobCounts) => number;
  tone: string;
}> = [
  {
    segment: 'published',
    label: 'Đang tuyển',
    hint: 'Hiển thị với ứng viên',
    icon: CheckCircle2,
    value: (counts) => counts.byStatus.PUBLISHED,
    tone: 'bg-emerald-100 text-emerald-600',
  },
  {
    segment: 'paused',
    label: 'Tạm dừng',
    hint: 'Có thể mở lại bất cứ lúc nào',
    icon: PauseCircle,
    value: (counts) => counts.byStatus.PAUSED,
    tone: 'bg-amber-100 text-amber-600',
  },
  {
    segment: 'draft',
    label: 'Bản nháp',
    hint: 'Chưa đăng',
    icon: FileText,
    value: (counts) => counts.byStatus.DRAFT,
    tone: 'bg-slate-100 text-slate-600',
  },
  {
    segment: 'expired',
    label: 'Hết hạn',
    hint: 'Quá hạn nộp hồ sơ',
    icon: TimerOff,
    value: (counts) => counts.byStatus.EXPIRED,
    tone: 'bg-rose-100 text-rose-600',
  },
];

export default function JobPostsStatsRow({ counts, currentSegment, onSelectSegment }: JobPostsStatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {CARDS.map(({ segment, label, hint, icon: Icon, value, tone }) => (
        <button
          key={segment}
          type="button"
          onClick={() => onSelectSegment(segment)}
          className={`group flex flex-col justify-between rounded-2xl border bg-white p-4 text-left transition-all hover:shadow-md ${
            currentSegment === segment
              ? 'border-emerald-500 ring-2 ring-emerald-500/20'
              : 'border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold tracking-wide text-slate-500 uppercase">{label}</span>
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-navy text-2xl font-black">{counts ? value(counts) : '–'}</p>
            <p className="mt-0.5 text-[11.5px] font-medium text-slate-500">{hint}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
