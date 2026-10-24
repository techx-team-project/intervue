'use client';

import Breadcrumb from '@/components/ui/Breadcrumb';
import { APPLICATION_SOURCE_LABEL, isMovableStatus } from '@/constants/application-status';
import { ROUTES } from '@/constants/routes';
import { useApplicationActionFlow } from '@/hooks/useApplicationActionFlow';
import { useApplicationBoard } from '@/hooks/useApplicationBoard';
import { cn } from '@/lib/utils';
import type { RecruiterApplication } from '@/types/recruiter-application';
import { formatDate, formatInterviewMoment } from '@/utils/datetime';
import {
  ArrowLeft,
  Bookmark,
  Building2,
  CalendarClock,
  ExternalLink,
  Flag,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Video,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import AiMatchRing, { getAiMatchTone } from './AiMatchRing';
import ApplicationAiMatchPanel from './ApplicationAiMatchPanel';
import ApplicationCvTab from './ApplicationCvTab';
import ApplicationHistoryTab from './ApplicationHistoryTab';
import ApplicationNotesTab from './ApplicationNotesTab';
import ApplicationPipelineStepper from './ApplicationPipelineStepper';
import ApplicationScreeningTab from './ApplicationScreeningTab';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import ApplicationStatusMenu from './ApplicationStatusMenu';
import CandidateAvatar from './CandidateAvatar';

interface ApplicationDetailPageViewProps {
  initialApplication: RecruiterApplication;
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#e5e9ef] bg-white p-4 shadow-xs sm:p-5">
      <div className="mb-3.5">
        <h2 className="text-navy text-[14px] font-bold">{title}</h2>
        {description && <p className="mt-0.5 text-[12px] text-[#64748b]">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function RailCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#e5e9ef] bg-white p-4 shadow-xs">
      <h2 className="text-navy mb-3 text-[13px] font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function ApplicationDetailPageView({ initialApplication }: ApplicationDetailPageViewProps) {
  const board = useApplicationBoard([initialApplication]);
  const { requestStatusChange, requestReport, actionModals } = useApplicationActionFlow(board);

  const application = board.applications[0];
  const { candidate, aiMatch, interview, rejection } = application;
  const tone = getAiMatchTone(aiMatch.score);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb
          showHome={false}
          className="text-[12.5px]"
          items={[
            { label: 'Applications', href: ROUTES.RECRUITER_APPLICATIONS },
            { label: application.jobTitle, href: `${ROUTES.RECRUITER_APPLICATIONS}?job=${application.jobId}` },
            { label: candidate.fullName },
          ]}
        />

        <Link
          href={`${ROUTES.RECRUITER_APPLICATIONS}?job=${application.jobId}`}
          className="group text-navy inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-[#e5e9ef] bg-white px-3.5 py-2 text-[12.5px] font-bold shadow-xs transition-colors hover:border-slate-300 hover:bg-slate-50 sm:self-auto"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to the board
        </Link>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#e5e9ef] bg-white shadow-xs">
        <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-start">
          <CandidateAvatar fullName={candidate.fullName} size="lg" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-navy text-lg font-black break-words sm:text-xl">{candidate.fullName}</h1>
              <ApplicationStatusBadge status={application.status} />
            </div>
            <p className="mt-0.5 text-[13px] text-[#64748b]">
              {candidate.title} • {candidate.experienceYears} years of experience
            </p>

            <div className="mt-3 flex flex-col gap-1.5 text-[12.5px] break-all text-[#475569] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:break-normal">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#94a3b8]" />
                {candidate.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-[#94a3b8]" />
                {candidate.phone}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#94a3b8]" />
                {candidate.location}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] font-semibold text-[#475569]">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-[#94a3b8]" />
                {application.jobTitle}
              </span>
              <span className="text-[#cbd5e1]">•</span>
              <span>Submitted {formatDate(application.appliedAt)}</span>
              <span className="text-[#cbd5e1]">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#94a3b8]" />
                {APPLICATION_SOURCE_LABEL[application.source]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start rounded-2xl border border-[#eef2f7] bg-[#fafbfc] px-4 py-3">
            <AiMatchRing score={aiMatch.score} size="lg" />
            <div>
              <p className="text-[11px] font-bold text-[#94a3b8] uppercase">AI match</p>
              <p className={cn('text-[13px] font-black', tone.text)}>{tone.label}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-[#eef1f5] bg-[#fafbfc] px-4 py-3 sm:px-5">
          <ApplicationStatusMenu
            currentStatus={application.status}
            onSelect={(status) => requestStatusChange([application.id], status)}
            align="left"
            disabled={!isMovableStatus(application.status)}
            label="Change status"
          />

          <button
            type="button"
            onClick={() => board.toggleSaved(application.id)}
            aria-pressed={application.isSaved}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-[12.5px] font-bold transition-colors',
              application.isSaved
                ? 'border-amber-300 bg-amber-50 text-amber-700'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
            )}
          >
            <Bookmark className={cn('h-3.5 w-3.5', application.isSaved && 'fill-current')} />
            {application.isSaved ? 'Saved' : 'Save candidate'}
          </button>

          <Link
            href={`${ROUTES.CANDIDATE_PROFILE}?view=guest`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12.5px] font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="sm:hidden">Profile</span>
            <span className="hidden sm:inline">Candidate profile</span>
          </Link>

          <button
            type="button"
            onClick={() => requestReport(application)}
            className="ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-2.5 py-2 text-[12.5px] font-bold text-rose-600 transition-colors hover:bg-rose-50"
          >
            <Flag className="h-3.5 w-3.5" />
            Report
          </button>
        </div>
      </section>

      <ApplicationPipelineStepper application={application} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-4">
          <Section
            title="InterVue AI match assessment"
            description="Evidence-based suggestions — the final decision is always yours."
          >
            <ApplicationAiMatchPanel aiMatch={aiMatch} />
          </Section>

          <Section title="Screening answers" description="Answered by the candidate when applying to this job post.">
            <ApplicationScreeningTab answers={application.screeningAnswers} />
          </Section>

          <Section title="Attached CV" description="The CV is kept exactly as submitted with this application.">
            <ApplicationCvTab cv={application.cv} candidateName={candidate.fullName} />
          </Section>

          {application.coverLetter && (
            <Section title="Cover letter">
              <p className="text-[12.5px] leading-relaxed text-slate-700">{application.coverLetter}</p>
            </Section>
          )}

          <Section title="Internal notes" description="Visible only inside your company, never to the candidate.">
            <ApplicationNotesTab
              notes={application.internalNotes}
              onAddNote={(content) => board.addNote(application.id, content)}
            />
          </Section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <RailCard title="Quick summary">
            <dl className="space-y-2.5 text-[12.5px]">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#64748b]">AI match</dt>
                <dd className={cn('font-black', tone.text)}>{aiMatch.score}/100</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#64748b]">CV ATS score</dt>
                <dd className="text-navy font-black">{application.cv.atsScore}%</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#64748b]">Experience</dt>
                <dd className="text-navy font-black">{candidate.experienceYears} years</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#64748b]">Last activity</dt>
                <dd className="text-navy font-black">{formatDate(application.lastActivityAt)}</dd>
              </div>
            </dl>

            <div className="mt-3.5 border-t border-[#f1f5f9] pt-3">
              <p className="mb-2 text-[11px] font-bold text-[#94a3b8] uppercase">Top skills</p>
              <div className="flex flex-wrap gap-1.5">
                {candidate.topSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-[#eef2f7] bg-[#f8fafc] px-1.5 py-0.5 text-[11.5px] font-semibold text-[#475569]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </RailCard>

          {interview && (
            <RailCard title="Interview schedule">
              <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-3">
                <p className="flex items-center gap-1.5 text-[12.5px] font-bold text-violet-900">
                  <CalendarClock className="h-3.5 w-3.5 text-violet-500" />
                  {formatInterviewMoment(interview.scheduledAt)}
                </p>
                <p className="mt-1.5 flex items-start gap-1.5 text-[12px] text-violet-800">
                  {interview.mode === 'ONLINE' ? (
                    <Video className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" />
                  ) : (
                    <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" />
                  )}
                  <span className="break-all">
                    {interview.mode === 'ONLINE' ? interview.meetingUrl : interview.location}
                  </span>
                </p>
                {interview.note && <p className="mt-1.5 text-[11.5px] text-violet-700">{interview.note}</p>}
              </div>
            </RailCard>
          )}

          {rejection && (
            <RailCard title="Reason for closing">
              <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3">
                <p className="flex items-start gap-1.5 text-[12.5px] font-bold text-rose-900">
                  <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                  {rejection.reason}
                </p>
                {rejection.detail && (
                  <p className="mt-1.5 text-[12px] leading-relaxed text-rose-800">{rejection.detail}</p>
                )}
                <p className="mt-1.5 text-[11px] text-rose-600">Recorded on {formatDate(rejection.rejectedAt)}</p>
              </div>
            </RailCard>
          )}

          <RailCard title="Status history">
            <ApplicationHistoryTab history={application.statusHistory} />
          </RailCard>
        </aside>
      </div>

      {actionModals}
    </div>
  );
}
