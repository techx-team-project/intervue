'use client';

import { JOB_SEGMENT_META } from '@/constants/recruiter-job';
import type { RecruiterJobSegment } from '@/types/recruiter-job';

interface JobPostsSegmentTabsProps {
  segment: RecruiterJobSegment;
  onSegmentChange: (segment: RecruiterJobSegment) => void;
  counts: Record<RecruiterJobSegment, number>;
}

const SEGMENT_KEYS = Object.keys(JOB_SEGMENT_META) as RecruiterJobSegment[];

export default function JobPostsSegmentTabs({ segment, onSegmentChange, counts }: JobPostsSegmentTabsProps) {
  return (
    <div className="flex scrollbar-none items-center gap-1.5 overflow-x-auto pb-1">
      <div className="bg-surface-container-high flex items-center gap-1 rounded-xl p-1">
        {SEGMENT_KEYS.map((key) => {
          const isActive = segment === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSegmentChange(key)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'text-on-surface bg-white shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface'
              }`}
            >
              <span>{JOB_SEGMENT_META[key].label}</span>
              <span
                className={`text-label-sm flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-bold ${
                  isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container-high/80 text-on-surface-variant'
                }`}
              >
                {counts[key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
