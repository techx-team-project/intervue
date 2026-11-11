'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import type { MockInterviewDetailResource } from '@/types/ai-mock-interview';
import {
  Sparkles,
  Award,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  History,
  MessageSquare,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface MockInterviewResultViewProps {
  session: MockInterviewDetailResource;
  onStartNew: () => void;
  onViewHistory: () => void;
}

export default function MockInterviewResultView({ session, onStartNew, onViewHistory }: MockInterviewResultViewProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  const toggleExpand = (id: number) => {
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const score = session.overallScore ?? 75;
  const scoreColor =
    score >= 80
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : score >= 65
        ? 'text-blue-700 bg-blue-50 border-blue-200'
        : 'text-amber-700 bg-amber-50 border-amber-200';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary rounded-md px-2.5 py-0.5 text-xs font-bold">
                {session.targetRole}
              </span>
              <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {session.seniorityLevel}
              </span>
            </div>
            <h1 className="text-navy text-2xl font-extrabold sm:text-3xl">Báo cáo kết quả Phỏng vấn thử cùng AI</h1>
            <p className="text-xs text-slate-500">
              Bạn đã hoàn thành toàn bộ {session.questionCount} câu hỏi phỏng vấn mô phỏng thực tế.
            </p>
          </div>

          {/* Overall Score Badge */}
          <div
            className={`flex shrink-0 flex-col items-center justify-center rounded-2xl border px-6 py-4 text-center ${scoreColor}`}
          >
            <span className="text-xs font-bold tracking-wider uppercase">Điểm tổng kết</span>
            <div className="my-1 flex items-baseline gap-1">
              <span className="text-3xl font-black sm:text-4xl">{score}</span>
              <span className="text-sm font-semibold opacity-75">/100</span>
            </div>
            <span className="text-[11px] font-semibold">
              {score >= 80
                ? 'Rất tốt (Sẵn sàng phỏng vấn)'
                : score >= 65
                  ? 'Khá (Đạt yêu cầu cơ bản)'
                  : 'Cần ôn luyện thêm'}
            </span>
          </div>
        </div>

        {/* Overall Feedback */}
        {session.overallFeedback && (
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <h3 className="text-navy mb-2 flex items-center gap-2 text-xs font-bold">
              <Sparkles className="text-primary h-4 w-4" />
              Đánh giá chung từ AI Hiring Lead:
            </h3>
            <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-700">{session.overallFeedback}</p>
          </div>
        )}
      </div>

      {/* 3 Strengths & 3 Improvements Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 3 Strengths */}
        <div className="space-y-4 rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800">
            <Award className="h-5 w-5" />
            <h3 className="text-sm font-bold">3 Điểm mạnh nổi bật (Strengths)</h3>
          </div>
          <ul className="space-y-3">
            {session.strengths && session.strengths.length > 0 ? (
              session.strengths.slice(0, 3).map((st, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-white p-3.5 shadow-2xs"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="text-xs leading-relaxed font-medium text-slate-800">{st}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-400 italic">Không có dữ liệu điểm mạnh</li>
            )}
          </ul>
        </div>

        {/* 3 Improvements */}
        <div className="space-y-4 rounded-3xl border border-amber-200 bg-amber-50/40 p-6 shadow-xs">
          <div className="flex items-center gap-2 text-amber-800">
            <TrendingUp className="h-5 w-5" />
            <h3 className="text-sm font-bold">3 Điểm cần cải thiện (Improvements)</h3>
          </div>
          <ul className="space-y-3">
            {session.improvements && session.improvements.length > 0 ? (
              session.improvements.slice(0, 3).map((imp, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 rounded-xl border border-amber-100 bg-white p-3.5 shadow-2xs"
                >
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <span className="text-xs leading-relaxed font-medium text-slate-800">{imp}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-400 italic">Không có dữ liệu điểm cải thiện</li>
            )}
          </ul>
        </div>
      </div>

      {/* Detailed Transcript Accordion */}
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-navy flex items-center gap-2 text-sm font-bold">
          <History className="text-primary h-4 w-4" />
          Chi tiết câu hỏi & nhận xét từng câu ({session.questions.length} câu)
        </h3>

        <div className="space-y-3 divide-y divide-slate-100">
          {session.questions.map((q) => {
            const isExpanded = Boolean(expandedQuestions[q.id]);
            return (
              <div key={q.id} className="pt-3 first:pt-0">
                <button
                  type="button"
                  onClick={() => toggleExpand(q.id)}
                  className="hover:text-primary flex w-full items-start justify-between gap-3 text-left transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                      {q.questionOrder}
                    </span>
                    <div>
                      <p className="text-navy text-xs font-bold">{q.questionText}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          {q.category}
                        </span>
                        {q.score !== null && q.score !== undefined && (
                          <span className="py-0.2 rounded bg-emerald-50 px-2 text-[11px] font-bold text-emerald-700">
                            {q.score} điểm
                          </span>
                        )}
                        {q.followUpQuestion && (
                          <span className="py-0.2 rounded bg-amber-50 px-2 text-[10px] font-bold text-amber-700">
                            Có câu hỏi follow-up
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs">
                    {/* Candidate Answer */}
                    <div>
                      <p className="mb-1 flex items-center gap-1.5 font-bold text-slate-500">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Câu trả lời của bạn:
                      </p>
                      <p className="leading-relaxed whitespace-pre-wrap text-slate-800">
                        {q.candidateAnswer || 'Chưa có câu trả lời'}
                      </p>
                    </div>

                    {/* Follow-up question & answer if present */}
                    {q.followUpQuestion && (
                      <div className="space-y-1.5 rounded-xl border border-amber-200 bg-amber-50/50 p-3">
                        <p className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                          <HelpCircle className="h-3.5 w-3.5" />
                          Câu hỏi đào sâu (Follow-up):
                        </p>
                        <p className="text-navy font-medium">{q.followUpQuestion}</p>
                        {q.followUpAnswer && (
                          <div className="border-t border-amber-200/50 pt-1.5">
                            <p className="text-[11px] font-semibold text-slate-500">Trả lời follow-up:</p>
                            <p className="text-slate-800">{q.followUpAnswer}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Feedback */}
                    {q.feedback && (
                      <div className="border-primary/20 bg-primary/5 space-y-1 rounded-xl border p-3">
                        <p className="text-navy flex items-center gap-1.5 font-bold">
                          <Sparkles className="text-primary h-3.5 w-3.5" />
                          Nhận xét của AI:
                        </p>
                        <p className="leading-relaxed text-slate-700">{q.feedback}</p>
                      </div>
                    )}

                    {/* Ideal answer */}
                    {q.idealAnswer && (
                      <div className="space-y-1 rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
                        <p className="flex items-center gap-1.5 font-bold text-emerald-800">
                          <Lightbulb className="h-3.5 w-3.5" />
                          Gợi ý câu trả lời chuẩn:
                        </p>
                        <p className="leading-relaxed text-slate-600 italic">{q.idealAnswer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button variant="outline" onClick={onViewHistory} leftIcon={<History className="h-4 w-4" />}>
          Xem lịch sử các buổi phỏng vấn
        </Button>
        <Button variant="primary" onClick={onStartNew} leftIcon={<RefreshCw className="h-4 w-4" />}>
          Bắt đầu buổi phỏng vấn mới
        </Button>
      </div>
    </div>
  );
}
