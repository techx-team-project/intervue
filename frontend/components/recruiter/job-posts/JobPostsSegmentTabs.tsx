'use client';

import { JOB_SEGMENT_META } from '@/constants/recruiter-job';
import type { RecruiterJobSegment } from '@/types/recruiter-job';

interface JobPostsSegmentTabsProps {
  segment: RecruiterJobSegment;
  onSegmentChange: (segment: RecruiterJobSegment) => void;
  counts: Record<RecruiterJobSegment, number>;
}

const SEGMENT_KEYS: RecruiterJobSegment[] = ['all', 'published', 'pending', 'paused', 'expired', 'draft', 'closed'];

export default function JobPostsSegmentTabs({ segment, onSegmentChange, counts }: JobPostsSegmentTabsProps) {
  return (
    <div className="flex scrollbar-none items-center gap-1.5 overflow-x-auto pb-1">
      <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
        {SEGMENT_KEYS.map((key) => {
          const isActive = segment === key;
          const count = counts[key] ?? 0;
          const meta = JOB_SEGMENT_META[key];

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSegmentChange(key)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
              }`}
            >
              <span>{meta.label}</span>
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                  isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200/80 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
