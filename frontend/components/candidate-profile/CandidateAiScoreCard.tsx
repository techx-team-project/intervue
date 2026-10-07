'use client';

import {
  ArrowRight,
  Bot,
  CheckCircle2,
  FileSearch,
  Flame,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { AiProfileScore } from '@/types/candidate';

interface CandidateAiScoreCardProps {
  aiScore: AiProfileScore;
}

export default function CandidateAiScoreCard({ aiScore }: CandidateAiScoreCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-linear-to-br from-emerald-50/70 via-white to-[#f0fdf4] p-6 shadow-xs sm:p-7">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="from-primary flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-tr to-[#10b981] text-white shadow-md shadow-emerald-500/20">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-navy text-lg font-black sm:text-xl">Chỉ số năng lực InterVue AI</h2>
              <span className="bg-primary inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white shadow-2xs">
                <Sparkles className="h-3 w-3" />
                Verified
              </span>
            </div>
            <p className="text-[13px] text-[#6f7882]">
              Đánh giá tự động từ 16 bài phỏng vấn mô phỏng AI và thuật toán phân tích CV chuẩn ATS
            </p>
          </div>
        </div>

        {/* Overall Index Score Pill */}
        <div className="flex items-center gap-3 self-start rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 shadow-xs sm:self-auto">
          <div className="text-right">
            <div className="text-[11px] font-bold text-[#6f7882] uppercase">Điểm tổng kết</div>
            <div className="text-primary text-[12px] font-bold">Xếp hạng Top {aiScore.topRankPercentile}%</div>
          </div>
          <div className="from-primary flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br to-[#047857] text-xl font-black text-white shadow-inner">
            {aiScore.overallScore}
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {/* Metric 1: ATS Readiness */}
        <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-2xs backdrop-blur-xs">
          <div className="mb-2 flex items-center justify-between text-[#6f7882]">
            <span className="text-[12px] font-bold uppercase">Chuẩn ATS CV</span>
            <FileSearch className="text-primary h-4 w-4" />
          </div>
          <div className="text-navy text-2xl font-black">{aiScore.atsReadiness}%</div>
          <div className="text-primary mt-1 flex items-center gap-1 text-[11.5px] font-medium">
            <CheckCircle2 className="h-3 w-3" /> Tương thích hoàn hảo
          </div>
        </div>

        {/* Metric 2: STAR Methodology */}
        <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-2xs backdrop-blur-xs">
          <div className="mb-2 flex items-center justify-between text-[#6f7882]">
            <span className="text-[12px] font-bold uppercase">Cấu trúc STAR</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-navy text-2xl font-black">{aiScore.starScore}/100</div>
          <div className="mt-1 text-[11.5px] font-medium text-amber-600">Trả lời logic & đo lường</div>
        </div>

        {/* Metric 3: AI Mock Count */}
        <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-2xs backdrop-blur-xs">
          <div className="mb-2 flex items-center justify-between text-[#6f7882]">
            <span className="text-[12px] font-bold uppercase">Luyện phỏng vấn</span>
            <Flame className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-navy text-2xl font-black">{aiScore.mockInterviewCount} buổi</div>
          <div className="mt-1 text-[11.5px] font-medium text-rose-600">Đã hoàn thành</div>
        </div>

        {/* Metric 4: Avg Score */}
        <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-2xs backdrop-blur-xs">
          <div className="mb-2 flex items-center justify-between text-[#6f7882]">
            <span className="text-[12px] font-bold uppercase">Điểm trung bình</span>
            <ShieldCheck className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-navy text-2xl font-black">{aiScore.averageInterviewScore}/10</div>
          <div className="mt-1 text-[11.5px] font-medium text-blue-600">Mức đánh giá Xuất sắc</div>
        </div>
      </div>

      {/* AI Key Insights: Strengths & Suggestions */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Strengths */}
        <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-4">
          <div className="mb-2.5 flex items-center gap-2 text-[13px] font-bold text-[#00873c]">
            <Sparkles className="h-4 w-4" />
            <span>Điểm mạnh nổi bật được AI ghi nhận:</span>
          </div>
          <ul className="text-navy space-y-1.5 text-[12.5px]">
            {aiScore.highlightStrengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggestions */}
        <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-4">
          <div className="mb-2.5 flex items-center gap-2 text-[13px] font-bold text-[#d97706]">
            <Lightbulb className="h-4 w-4" />
            <span>Gợi ý hoàn thiện thêm để chinh phục mức lương cao:</span>
          </div>
          <ul className="text-navy space-y-1.5 text-[12.5px]">
            {aiScore.suggestedImprovements.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-100/80 pt-4">
        <span className="text-[12px] text-[#6f7882]">
          * Điểm số này được hiển thị nổi bật trong hồ sơ gửi tới các nhà tuyển dụng hàng đầu.
        </span>
        <button
          type="button"
          className="bg-primary hover:bg-primary-hover inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold text-white shadow-xs transition-all"
        >
          <span>Luyện phỏng vấn AI ngay</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
