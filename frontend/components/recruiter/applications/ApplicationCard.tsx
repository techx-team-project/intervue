'use client';

import { isMovableStatus } from '@/constants/application-status';
import { cn } from '@/lib/utils';
import type { ApplicationStatus, RecruiterApplication } from '@/types/recruiter-application';
import { formatDate, formatRelativeDay } from '@/utils/datetime';
import { Bookmark, CalendarClock, ListChecks, MapPin, Sparkles } from 'lucide-react';
import AiMatchRing from './AiMatchRing';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import ApplicationStatusMenu from './ApplicationStatusMenu';
import CandidateAvatar from './CandidateAvatar';

export type ApplicationCardVariant = 'rich' | 'compact' | 'minimal';

interface ApplicationCardProps {
  application: RecruiterApplication;
  variant?: ApplicationCardVariant;
  isSelected?: boolean;
  isDragging?: boolean;
  isOverlay?: boolean;
  showJobTitle?: boolean;
  showStatusBadge?: boolean;
  onOpen?: () => void;
  onToggleSaved?: () => void;
  onToggleSelected?: () => void;
  onChangeStatus?: (status: ApplicationStatus) => void;
  className?: string;
}

const MAX_VISIBLE_SKILLS = 3;

export default function ApplicationCard({
  application,
  variant = 'rich',
  isSelected = false,
  isDragging = false,
  isOverlay = false,
  showJobTitle = true,
  showStatusBadge = false,
  onOpen,
  onToggleSaved,
  onToggleSelected,
  onChangeStatus,
  className,
}: ApplicationCardProps) {
  const { candidate, aiMatch } = application;
  const visibleSkills = candidate.topSkills.slice(0, MAX_VISIBLE_SKILLS);
  const hiddenSkillCount = candidate.topSkills.length - visibleSkills.length;

  const handleOpen = () => onOpen?.();

  return (
    <article
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={onOpen ? `Open ${candidate.fullName}’s application` : undefined}
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (!onOpen) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleOpen();
        }
      }}
      className={cn(
        'group relative rounded-2xl border bg-white text-left transition',
        onOpen && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md',
        'border-[#e5e9ef] shadow-2xs',
        isSelected && 'border-emerald-300 ring-1 ring-emerald-200',
        isDragging && 'opacity-40',
        isOverlay && 'rotate-2 shadow-2xl',
        variant === 'rich' ? 'p-3.5' : 'p-3',
        className,
      )}
    >
      {!application.isViewed && (
        <span className="bg-primary absolute top-3 -left-1 h-2 w-2 rounded-full shadow-[0_0_0_3px_rgba(0,177,79,0.18)]" />
      )}

      <div className="flex items-start gap-2.5">
        {onToggleSelected && (
          <input
            type="checkbox"
            checked={isSelected}
            aria-label={`Select ${candidate.fullName}’s application`}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => {
              event.stopPropagation();
              onToggleSelected();
            }}
            className="mt-1 h-4.5 w-4.5 shrink-0 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 sm:h-4 sm:w-4"
          />
        )}

        <CandidateAvatar fullName={candidate.fullName} size={variant === 'rich' ? 'md' : 'sm'} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-navy truncate text-[13.5px] font-bold">{candidate.fullName}</p>
              <p className="truncate text-[11.5px] text-[#64748b]">{candidate.title}</p>
            </div>

            <AiMatchRing score={aiMatch.score} size={variant === 'rich' ? 'md' : 'sm'} />
          </div>

          {variant === 'rich' && (
            <p className="mt-1.5 flex items-center gap-1 truncate text-[11.5px] text-[#94a3b8]">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{candidate.location}</span>
              <span className="text-[#cbd5e1]">•</span>
              <span className="shrink-0">{candidate.experienceYears} yrs exp</span>
            </p>
          )}
        </div>
      </div>

      {variant === 'rich' && visibleSkills.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {visibleSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-md border border-[#eef2f7] bg-[#f8fafc] px-1.5 py-0.5 text-[11px] font-semibold text-[#475569]"
            >
              {skill}
            </span>
          ))}
          {hiddenSkillCount > 0 && (
            <span className="rounded-md bg-[#f1f5f9] px-1.5 py-0.5 text-[11px] font-bold text-[#64748b]">
              +{hiddenSkillCount}
            </span>
          )}
        </div>
      )}

      {variant !== 'minimal' && (
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-semibold">
          {application.interview && (
            <span className="inline-flex items-center gap-1 text-violet-600">
              <CalendarClock className="h-3 w-3" />
              {formatDate(application.interview.scheduledAt)}
            </span>
          )}
          {application.screeningAnswers.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[#64748b]">
              <ListChecks className="h-3 w-3" />
              {application.screeningAnswers.length} screening answers
            </span>
          )}
          {application.source === 'AI_RECOMMENDATION' && (
            <span className="text-primary inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI suggested
            </span>
          )}
        </div>
      )}

      {showStatusBadge && (
        <div className="mt-2.5">
          <ApplicationStatusBadge status={application.status} />
        </div>
      )}

      <div
        className={cn(
          'mt-2.5 flex items-center justify-between gap-2 border-t border-[#f1f5f9] pt-2.5',
          variant === 'minimal' && 'mt-2 pt-2',
        )}
      >
        <div className="min-w-0">
          <p className="truncate text-[11px] text-[#94a3b8]">{formatRelativeDay(application.appliedAt)}</p>
          {showJobTitle && <p className="truncate text-[11px] font-semibold text-[#64748b]">{application.jobTitle}</p>}
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          {onToggleSaved && (
            <button
              type="button"
              aria-label={application.isSaved ? 'Remove from saved' : 'Save candidate'}
              aria-pressed={application.isSaved}
              onClick={(event) => {
                event.stopPropagation();
                onToggleSaved();
              }}
              className={cn(
                'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-slate-100 sm:h-7 sm:w-7',
                application.isSaved ? 'text-amber-500' : 'text-slate-400 hover:text-slate-700',
              )}
            >
              <Bookmark className={cn('h-3.5 w-3.5', application.isSaved && 'fill-current')} />
            </button>
          )}

          {onChangeStatus && (
            <div onClick={(event) => event.stopPropagation()}>
              <ApplicationStatusMenu
                currentStatus={application.status}
                onSelect={onChangeStatus}
                trigger="icon"
                disabled={!isMovableStatus(application.status)}
                label={`Change the status of ${candidate.fullName}’s application`}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
