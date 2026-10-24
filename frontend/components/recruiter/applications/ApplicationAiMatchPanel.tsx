import { cn } from '@/lib/utils';
import type { ApplicationAiMatch } from '@/types/recruiter-application';
import { formatDateTime } from '@/utils/datetime';
import { Bot, CheckCircle2, HelpCircle, Info, MessageCircleQuestion } from 'lucide-react';
import AiMatchRing, { getAiMatchTone } from './AiMatchRing';

interface ApplicationAiMatchPanelProps {
  aiMatch: ApplicationAiMatch;
  className?: string;
}

export default function ApplicationAiMatchPanel({ aiMatch, className }: ApplicationAiMatchPanelProps) {
  const tone = getAiMatchTone(aiMatch.score);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-linear-to-br from-emerald-50/70 via-white to-[#f0fdf4] p-4 sm:p-5">
        <div className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="flex items-start gap-3.5">
          <AiMatchRing score={aiMatch.score} size="lg" />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-navy text-[15px] font-black">Match against this job post</h3>
              <span className={cn('rounded-full bg-white px-2 py-0.5 text-[11px] font-bold shadow-2xs', tone.text)}>
                {tone.label}
              </span>
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#475569]">{aiMatch.summary}</p>
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#94a3b8]">
              <Bot className="h-3.5 w-3.5" />
              {aiMatch.model} • evaluated at {formatDateTime(aiMatch.evaluatedAt)}
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-[#e5e9ef] bg-white p-4">
        <h4 className="mb-2.5 flex items-center gap-2 text-[13px] font-bold text-[#00873c]">
          <CheckCircle2 className="h-4 w-4" />
          Evidence matching the requirements
        </h4>
        <ul className="space-y-2">
          {aiMatch.matchedEvidence.map((evidence) => (
            <li key={evidence} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-slate-700">
              <CheckCircle2 className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{evidence}</span>
            </li>
          ))}
        </ul>
      </section>

      {aiMatch.missingInformation.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
          <h4 className="mb-2.5 flex items-center gap-2 text-[13px] font-bold text-amber-700">
            <HelpCircle className="h-4 w-4" />
            Information missing from the application
          </h4>
          <ul className="space-y-2">
            {aiMatch.missingInformation.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-amber-900">
                <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-[11px] font-semibold text-amber-700">
            Missing information does not mean a missing skill — ask before you conclude.
          </p>
        </section>
      )}

      {aiMatch.askMoreAbout.length > 0 && (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/50 p-4">
          <h4 className="mb-2.5 flex items-center gap-2 text-[13px] font-bold text-violet-700">
            <MessageCircleQuestion className="h-4 w-4" />
            Worth asking about in the interview
          </h4>
          <ul className="space-y-2">
            {aiMatch.askMoreAbout.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-violet-900">
                <MessageCircleQuestion className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
        <p className="text-[11.5px] leading-relaxed text-slate-600">
          InterVue AI only assists with evidence-based evaluation. Hiring decisions always belong to the recruiter — AI
          never accepts or rejects a candidate automatically. Candidates are told when their data is processed by AI.
        </p>
      </div>
    </div>
  );
}
