'use client';

import { isMovableStatus } from '@/constants/application-status';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { ApplicationStatus, RecruiterApplication } from '@/types/recruiter-application';
import { Bookmark, ExternalLink, Flag } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import AiMatchRing from './AiMatchRing';
import ApplicationAiMatchPanel from './ApplicationAiMatchPanel';
import ApplicationCvTab from './ApplicationCvTab';
import ApplicationHistoryTab from './ApplicationHistoryTab';
import ApplicationNotesTab from './ApplicationNotesTab';
import ApplicationOverviewTab from './ApplicationOverviewTab';
import ApplicationScreeningTab from './ApplicationScreeningTab';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import ApplicationStatusMenu from './ApplicationStatusMenu';
import CandidateAvatar from './CandidateAvatar';

interface ApplicationDetailContentProps {
  application: RecruiterApplication;
  onRequestStatusChange: (status: ApplicationStatus) => void;
  onToggleSaved: () => void;
  onAddNote: (content: string) => void;
  onReport: () => void;
}

type DetailTab = 'OVERVIEW' | 'CV' | 'SCREENING' | 'AI' | 'NOTES' | 'HISTORY';

export default function ApplicationDetailContent({
  application,
  onRequestStatusChange,
  onToggleSaved,
  onAddNote,
  onReport,
}: ApplicationDetailContentProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('OVERVIEW');
  const { candidate } = application;

  const tabs: { id: DetailTab; label: string; count?: number }[] = [
    { id: 'OVERVIEW', label: 'Tổng quan' },
    { id: 'CV', label: 'CV' },
    { id: 'SCREENING', label: 'Sàng lọc', count: application.screeningAnswers.length },
    { id: 'AI', label: 'Đánh giá AI' },
    { id: 'NOTES', label: 'Ghi chú', count: application.internalNotes.length },
    { id: 'HISTORY', label: 'Lịch sử', count: application.statusHistory.length },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-[#eef1f5] px-4 pt-4 pb-0 sm:px-5">
        <div className="flex items-start gap-3">
          <CandidateAvatar fullName={candidate.fullName} size="lg" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-navy truncate text-[16px] font-black">{candidate.fullName}</h2>
              <ApplicationStatusBadge status={application.status} />
            </div>
            <p className="truncate text-[12.5px] text-[#64748b]">{candidate.title}</p>
            <p className="truncate text-[12px] font-semibold text-[#94a3b8]">Ứng tuyển: {application.jobTitle}</p>
          </div>

          <AiMatchRing score={application.aiMatch.score} size="md" />
        </div>

        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <ApplicationStatusMenu
            currentStatus={application.status}
            onSelect={onRequestStatusChange}
            align="left"
            disabled={!isMovableStatus(application.status)}
            label="Chuyển trạng thái"
          />

          <button
            type="button"
            onClick={onToggleSaved}
            aria-pressed={application.isSaved}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-[12.5px] font-bold transition-colors',
              application.isSaved
                ? 'border-amber-300 bg-amber-50 text-amber-700'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
            )}
          >
            <Bookmark className={cn('h-3.5 w-3.5', application.isSaved && 'fill-current')} />
            {application.isSaved ? 'Đã lưu' : 'Lưu ứng viên'}
          </button>

          <Link
            href={`${ROUTES.CANDIDATE_PROFILE}?view=guest`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12.5px] font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Hồ sơ đầy đủ
          </Link>

          <button
            type="button"
            onClick={onReport}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-2.5 py-2 text-[12.5px] font-bold text-rose-600 transition-colors hover:bg-rose-50"
          >
            <Flag className="h-3.5 w-3.5" />
            Báo cáo
          </button>
        </div>

        <nav className="mt-3.5 -mb-px flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id}
              className={cn(
                'shrink-0 cursor-pointer border-b-2 px-3 pb-2.5 text-[12.5px] font-bold transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-[#64748b] hover:text-slate-800',
              )}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1 text-[11px] font-black text-[#94a3b8]">{tab.count}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-[#fafbfc] p-4 sm:p-5">
        {activeTab === 'OVERVIEW' && <ApplicationOverviewTab application={application} />}
        {activeTab === 'CV' && <ApplicationCvTab cv={application.cv} candidateName={candidate.fullName} />}
        {activeTab === 'SCREENING' && <ApplicationScreeningTab answers={application.screeningAnswers} />}
        {activeTab === 'AI' && <ApplicationAiMatchPanel aiMatch={application.aiMatch} />}
        {activeTab === 'NOTES' && <ApplicationNotesTab notes={application.internalNotes} onAddNote={onAddNote} />}
        {activeTab === 'HISTORY' && <ApplicationHistoryTab history={application.statusHistory} />}
      </div>
    </div>
  );
}
