import { REVIEW_STATUS_META } from '@/constants/application-review';
import type { ReviewApplicationHistoryEntry } from '@/types/application-review';
import { formatDateTime } from '@/utils/datetime';

const ACTOR_LABELS = { CANDIDATE: 'Candidate', RECRUITER: 'Recruiter', SYSTEM: 'System' } as const;

export default function ReviewHistoryTimeline({ history }: { history: ReviewApplicationHistoryEntry[] }) {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
      <h3 className="text-sm font-bold text-slate-900">Activity history</h3>
      <ol className="space-y-3 border-l-2 border-slate-100 pl-4">
        {[...history].reverse().map((entry, index) => (
          <li key={`${entry.at}-${index}`} className="relative text-xs">
            <span aria-hidden className="absolute top-1 -left-5.25 h-2 w-2 rounded-full bg-emerald-500" />
            <p className="font-semibold text-slate-800">
              {entry.from ? `${REVIEW_STATUS_META[entry.from].label} → ` : ''}
              {REVIEW_STATUS_META[entry.to].label}
            </p>
            <p className="text-slate-400">
              {ACTOR_LABELS[entry.actorType]} · {formatDateTime(entry.at)}
            </p>
            {entry.note && <p className="mt-0.5 text-slate-600">{entry.note}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}
