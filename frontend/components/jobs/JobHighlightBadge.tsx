import { JOB_HIGHLIGHT_LABEL, JOB_HIGHLIGHT_STYLE } from '@/constants/job-highlight';
import { cn } from '@/lib/utils';

type JobHighlightBadgeProps = {
  label: 'HOT';
};

export default function JobHighlightBadge({ label }: JobHighlightBadgeProps) {
  return (
    <span
      className={cn(
        'mr-1.5 inline-block rounded px-1.5 py-0.5 align-middle text-[11px] font-extrabold',
        JOB_HIGHLIGHT_STYLE[label],
      )}
    >
      {JOB_HIGHLIGHT_LABEL[label]}
    </span>
  );
}
