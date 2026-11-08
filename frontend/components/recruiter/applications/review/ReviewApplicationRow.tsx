import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { ReviewApplicationSummary } from '@/types/application-review';
import { formatDate } from '@/utils/datetime';
import Link from 'next/link';
import ReviewStatusBadge from './ReviewStatusBadge';

interface ReviewApplicationRowProps {
  application: ReviewApplicationSummary;
}

export default function ReviewApplicationRow({ application }: ReviewApplicationRowProps) {
  const isNew = application.status === 'APPLIED';
  const initial = application.candidateName.trim().charAt(0).toUpperCase() || '?';

  return (
    <li>
      <Link
        href={`${ROUTES.RECRUITER_APPLICATIONS}/${application.id}`}
        className="flex items-center gap-3.5 p-4 transition-colors hover:bg-slate-50"
      >
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700"
        >
          {initial}
        </span>

        <div className="min-w-0 flex-1">
          <p className={cn('truncate text-sm text-slate-900', isNew ? 'font-extrabold' : 'font-semibold')}>
            {application.candidateName || application.candidateEmail}
          </p>
          <p className="truncate text-xs text-slate-500">
            {application.jobTitle}
            {application.candidateEmail && ` · ${application.candidateEmail}`}
          </p>
        </div>

        <div className="hidden shrink-0 text-right text-xs text-slate-400 sm:block">
          {application.submittedAt && formatDate(application.submittedAt)}
        </div>
        <ReviewStatusBadge status={application.status} />
      </Link>
    </li>
  );
}
