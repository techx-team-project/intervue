import { HIGHLIGHT_ICON } from '@/constants/admin-work';
import { cn } from '@/lib/utils';
import type { AdminHighlight, AdminHighlightTone } from '@/types/admin';

interface AdminHighlightRowProps {
  highlights: AdminHighlight[];
}

const TONE_ICON: Record<AdminHighlightTone, string> = {
  primary: 'bg-primary/10 text-primary',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
  sky: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10',
};

const TONE_GLOW: Record<AdminHighlightTone, string> = {
  primary: 'bg-primary/10',
  amber: 'bg-amber-200/40',
  sky: 'bg-sky-200/40',
  violet: 'bg-violet-200/40',
};

export default function AdminHighlightRow({ highlights }: AdminHighlightRowProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {highlights.map((highlight) => {
        const Icon = HIGHLIGHT_ICON[highlight.key];

        return (
          <article
            key={highlight.key}
            className="dark:border-forest-800 dark:bg-forest-900 relative overflow-hidden rounded-2xl border border-[#e9eaec] bg-white p-4 shadow-xs"
          >
            <span
              aria-hidden="true"
              className={cn('absolute -top-10 -right-10 h-24 w-24 rounded-full blur-2xl', TONE_GLOW[highlight.tone])}
            />

            <div className="relative flex items-start gap-3">
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                  TONE_ICON[highlight.tone],
                )}
              >
                <Icon className="h-5 w-5" />
              </span>

              <div className="min-w-0">
                <p className="dark:text-forest-300 text-[12px] font-semibold text-[#64748b]">{highlight.label}</p>
                <p className="text-navy dark:text-forest-50 mt-0.5 text-2xl leading-none font-black">
                  {highlight.value}
                </p>
                <p className="mt-1 truncate text-[11.5px] text-[#94a3b8]">{highlight.caption}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
