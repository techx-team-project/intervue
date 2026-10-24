'use client';

import Input from '@/components/ui/Input';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { RecruiterApplication } from '@/types/recruiter-application';
import { formatDate } from '@/utils/datetime';
import { Bookmark, BookmarkX, ExternalLink, LayoutDashboard, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import AiMatchRing from './AiMatchRing';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import CandidateAvatar from './CandidateAvatar';

interface SavedCandidatesViewProps {
  initialApplications: RecruiterApplication[];
}

export default function SavedCandidatesView({ initialApplications }: SavedCandidatesViewProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [search, setSearch] = useState('');

  const visibleApplications = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return applications.filter(
      (application) =>
        keyword.length === 0 ||
        application.candidate.fullName.toLowerCase().includes(keyword) ||
        application.candidate.title.toLowerCase().includes(keyword) ||
        application.jobTitle.toLowerCase().includes(keyword) ||
        application.candidate.topSkills.some((skill) => skill.toLowerCase().includes(keyword)),
    );
  }, [applications, search]);

  const unsave = (id: string, fullName: string) => {
    setApplications((previous) => previous.filter((application) => application.id !== id));
    toast.success(`${fullName} removed from your saved list.`);
  };

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-[#e5e9ef] bg-white py-20 text-center shadow-xs">
        <Bookmark className="h-10 w-10 text-[#cbd5e1]" />
        <p className="text-navy text-[14px] font-bold">You have not saved any candidates yet</p>
        <p className="max-w-sm text-[12.5px] text-[#64748b]">
          While reviewing applications, use the bookmark icon on a candidate card to keep track of people you like.
        </p>
        <Link
          href={ROUTES.RECRUITER_APPLICATIONS}
          className="bg-primary hover:bg-primary-hover mt-1 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold text-white transition-colors"
        >
          View applications
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, title, job post or skill..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <p className="text-[12px] font-semibold text-[#64748b]">
          <span className="text-navy font-black">{visibleApplications.length}</span> saved candidates
        </p>
      </div>

      {visibleApplications.length === 0 ? (
        <div className="rounded-2xl border border-[#e5e9ef] bg-white py-16 text-center shadow-xs">
          <p className="text-navy text-[13.5px] font-bold">No matching candidates found</p>
          <p className="mt-1 text-[12px] text-[#64748b]">Try another keyword or clear the search box.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2 2xl:grid-cols-3">
          {visibleApplications.map((application) => (
            <article
              key={application.id}
              className="flex flex-col rounded-2xl border border-[#e5e9ef] bg-white p-4 shadow-xs"
            >
              <div className="flex items-start gap-3">
                <CandidateAvatar fullName={application.candidate.fullName} size="md" />

                <div className="min-w-0 flex-1">
                  <p className="text-navy truncate text-[14px] font-bold">{application.candidate.fullName}</p>
                  <p className="truncate text-[12px] text-[#64748b]">{application.candidate.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11.5px] text-[#94a3b8]">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{application.candidate.location}</span>
                    <span className="text-[#cbd5e1]">•</span>
                    <span className="shrink-0">{application.candidate.experienceYears} yrs exp</span>
                  </p>
                </div>

                <AiMatchRing score={application.aiMatch.score} size="md" />
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {application.candidate.topSkills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-[#eef2f7] bg-[#f8fafc] px-1.5 py-0.5 text-[11px] font-semibold text-[#475569]"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-3 space-y-1.5 border-t border-[#f1f5f9] pt-3">
                <p className="truncate text-[12px] font-semibold text-[#475569]">{application.jobTitle}</p>
                <div className="flex items-center gap-2">
                  <ApplicationStatusBadge status={application.status} />
                  {application.savedAt && (
                    <span className="text-[11px] text-[#94a3b8]">Saved on {formatDate(application.savedAt)}</span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={`${ROUTES.RECRUITER_APPLICATIONS}/${application.id}`}
                  className={cn(
                    'inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-bold text-white transition-colors',
                    'bg-primary hover:bg-primary-hover',
                  )}
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Open application
                </Link>

                <Link
                  href={`${ROUTES.CANDIDATE_PROFILE}?view=guest`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-[12.5px] font-bold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={() => unsave(application.id, application.candidate.fullName)}
                  aria-label={`Remove ${application.candidate.fullName} from saved`}
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-amber-500 transition-colors hover:bg-amber-50"
                >
                  <BookmarkX className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
