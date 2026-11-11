'use client';

import Spinner from '@/components/common/Spinner';
import Button from '@/components/ui/Button';
import { useMockInterviewHistory } from '@/hooks/useAiMockInterview';
import type { MockInterviewSummaryResource } from '@/types/ai-mock-interview';
import { formatDate } from '@/utils/datetime';
import { Sparkles, Calendar, Award, ChevronRight, HelpCircle } from 'lucide-react';

interface MockInterviewHistoryListProps {
  onSelectSession: (id: number) => void;
  onStartNew: () => void;
}

export default function MockInterviewHistoryList({ onSelectSession, onStartNew }: MockInterviewHistoryListProps) {
  const { data: history, isLoading, isError, refetch } = useMockInterviewHistory();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <p className="text-sm font-semibold text-rose-700">Unable to load mock interview history.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="space-y-4 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <div className="bg-primary/10 text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-2xl">
          <HelpCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-navy text-base font-bold">No mock interviews yet</h3>
          <p className="mx-auto max-w-md text-xs text-slate-500">
            Start your first AI mock interview tailored to your resume to assess your knowledge and receive in-depth
            feedback.
          </p>
        </div>
        <Button variant="primary" onClick={onStartNew} leftIcon={<Sparkles className="h-4 w-4" />}>
          Start Mock Interview Now
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-navy text-sm font-bold">Saved Interview History ({history.length})</h3>
        <Button variant="primary" size="sm" onClick={onStartNew} leftIcon={<Sparkles className="h-4 w-4" />}>
          New Interview
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {history.map((session: MockInterviewSummaryResource) => {
          const isCompleted = session.status === 'COMPLETED';
          return (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className="hover:border-primary/50 flex cursor-pointer flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-xs sm:flex-row sm:items-center"
            >
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-navy truncate text-sm font-bold">{session.targetRole}</span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    {session.seniorityLevel}
                  </span>
                  <span className="bg-primary/5 text-primary rounded-md px-2 py-0.5 text-[11px] font-bold">
                    {session.focusArea}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(session.createdAt)}
                  </span>
                  <span>•</span>
                  <span>{session.questionCount} questions</span>
                  <span>•</span>
                  <span className={isCompleted ? 'font-semibold text-emerald-700' : 'font-semibold text-amber-700'}>
                    {isCompleted
                      ? 'Completed'
                      : `In Progress (${session.currentQuestionIndex}/${session.questionCount})`}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                {isCompleted && session.overallScore !== null && session.overallScore !== undefined && (
                  <div className="flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-emerald-800">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-black">{session.overallScore}</span>
                    <span className="text-[10px] opacity-75">/100</span>
                  </div>
                )}

                <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>
                  {isCompleted ? 'View Report' : 'Continue'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
