import { INTERVIEW_FORMAT_LABELS } from '@/constants/interview';
import type { Interview } from '@/types/interview';
import { formatInterviewMoment } from '@/utils/datetime';
import { CalendarClock, MapPin, StickyNote, Video } from 'lucide-react';

const URL_PATTERN = /^https?:\/\//i;

export default function InterviewDetails({ interview }: { interview: Interview }) {
  const isLink = URL_PATTERN.test(interview.location);
  const PlaceIcon = interview.format === 'ONLINE' ? Video : MapPin;

  return (
    <ul className="space-y-1.5 text-[13.5px] text-slate-700">
      <li className="flex items-start gap-2">
        <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        <span>
          <span className="font-semibold text-slate-900">{formatInterviewMoment(interview.startsAt)}</span>
          {` · ${interview.durationMinutes} phút`}
        </span>
      </li>
      <li className="flex items-start gap-2">
        <PlaceIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        <span className="min-w-0 break-words">
          {INTERVIEW_FORMAT_LABELS[interview.format]}
          {' · '}
          {isLink ? (
            <a
              href={interview.location}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              {interview.location}
            </a>
          ) : (
            interview.location
          )}
        </span>
      </li>
      {interview.note && (
        <li className="flex items-start gap-2">
          <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          <span className="whitespace-pre-line">{interview.note}</span>
        </li>
      )}
    </ul>
  );
}
