import type { ScreeningAnswer } from '@/types/recruiter-application';
import { ListChecks, MessageSquareOff } from 'lucide-react';

interface ApplicationScreeningTabProps {
  answers: ScreeningAnswer[];
}

export default function ApplicationScreeningTab({ answers }: ApplicationScreeningTabProps) {
  if (answers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#e2e8f0] bg-[#fafbfc] py-14 text-center">
        <MessageSquareOff className="h-8 w-8 text-[#cbd5e1]" />
        <p className="text-navy text-[13px] font-bold">This job post has no screening questions</p>
        <p className="max-w-xs text-[11.5px] text-[#94a3b8]">
          You can add screening questions when editing the job post to filter candidates as they apply.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {answers.map((answer, index) => (
        <div key={answer.questionId} className="rounded-2xl border border-[#e5e9ef] bg-white p-3.5">
          <div className="flex items-start gap-2.5">
            <span className="text-navy flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[11.5px] font-black">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-navy text-[12.5px] font-bold">
                {answer.question}
                {answer.required && <span className="ml-1 text-rose-500">*</span>}
              </p>
              <p className="mt-1.5 flex items-start gap-1.5 text-[12.5px] leading-relaxed text-slate-700">
                <ListChecks className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{answer.answer}</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
