'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Briefcase,
  TrendingUp,
  FileText,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Coins,
  History,
  ShieldCheck,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import type { CvReviewResult } from '@/types/cv-review';

interface JobFitResultViewProps {
  result: CvReviewResult;
  onReset: () => void;
  onOpenCreditHistory?: () => void;
}

export function JobFitResultView({ result, onReset, onOpenCreditHistory }: JobFitResultViewProps) {
  const [filter, setFilter] = useState<'ALL' | 'MATCH' | 'PARTIAL' | 'MISSING'>('ALL');
  const [showAtsComments, setShowAtsComments] = useState(false);

  const fitScore = result.jobFitScore ?? result.overallScore ?? 75;
  const requirementMatches = result.requirementMatches ?? [];

  const filteredMatches = requirementMatches.filter((item) => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  const matchCount = requirementMatches.filter((m) => m.status === 'MATCH').length;
  const partialCount = requirementMatches.filter((m) => m.status === 'PARTIAL').length;
  const missingCount = requirementMatches.filter((m) => m.status === 'MISSING').length;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'MATCH':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Đạt yêu cầu
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            Đáp ứng một phần
          </span>
        );
      case 'MISSING':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-800">
            <XCircle className="h-3.5 w-3.5 text-rose-600" />
            Chưa đáp ứng
          </span>
        );
      default:
        return <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-900 to-teal-950 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-800/40 px-3.5 py-1 text-xs font-bold text-emerald-200">
                <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                <span>CV Feedback Level 3 · So Khớp Chi Tiết Với Tin Tuyển Dụng</span>
              </div>
              <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
                {result.jobTitle || 'Tin tuyển dụng mục tiêu'}
              </h2>
              {result.companyName && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-emerald-200">
                  <Briefcase className="h-4 w-4" />
                  <span>{result.companyName}</span>
                </p>
              )}
            </div>

            {/* Score Badge */}
            <div className="flex items-center gap-4">
              <div
                className={`flex h-24 w-24 flex-col items-center justify-center rounded-2xl border-2 text-center shadow-md ${getScoreColor(
                  fitScore,
                )}`}
              >
                <span className="text-3xl font-black">{fitScore}%</span>
                <span className="text-[11px] font-bold tracking-wider uppercase">Mức Độ Khớp</span>
              </div>
            </div>
          </div>

          {/* Pricing & Refund Status Indicator */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-800/60 pt-4 text-xs text-emerald-200/90">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-lg bg-emerald-800/60 px-2.5 py-1 font-semibold text-emerald-100">
                <Coins className="h-3.5 w-3.5 text-amber-300" />
                {result.fromCache
                  ? 'Tải từ bộ nhớ đệm (0 credit)'
                  : `Đã tính phí: ${result.chargedCredits ?? 1} credit`}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-200/80">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Bảo vệ quyền lợi: Tự động hoàn tiền 100% nếu AI lỗi</span>
              </span>
            </div>

            {onOpenCreditHistory && (
              <button
                type="button"
                onClick={onOpenCreditHistory}
                className="flex items-center gap-1 font-bold text-emerald-200 hover:text-white hover:underline"
              >
                <History className="h-3.5 w-3.5" />
                <span>Xem lịch sử credit</span>
              </button>
            )}
          </div>
        </div>

        {/* Summary text */}
        <div className="p-6">
          <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Đánh Giá Tổng Quan</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{result.summary}</p>
        </div>
      </div>

      {/* Strengths & Gaps & Tailoring 3-Column */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* 3 Strengths */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
          <div className="flex items-center gap-2 font-bold text-emerald-950">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <h4 className="text-sm">3 Điểm Mạnh Nổi Bật</h4>
          </div>
          <ul className="mt-3 space-y-2 text-xs text-slate-700">
            {(result.keyStrengths && result.keyStrengths.length > 0
              ? result.keyStrengths
              : [
                  'Kinh nghiệm chuyên môn phù hợp với vị trí',
                  'Kỹ năng kỹ thuật cốt lõi tương thích',
                  'Nền tảng đào tạo tốt',
                ]
            ).map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-[10px] font-bold text-emerald-800">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3 Gaps */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h4 className="text-sm">3 Khoảng Trống Cần Khắc Phục</h4>
          </div>
          <ul className="mt-3 space-y-2 text-xs text-slate-700">
            {(result.gapAnalysis && result.gapAnalysis.length > 0
              ? result.gapAnalysis
              : [
                  'Cần bổ sung thêm số liệu đo lường kết quả',
                  'Làm rõ các dự án liên quan đến yêu cầu',
                  'Nêu rõ vai trò cá nhân',
                ]
            ).map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-800">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3 Tailoring Tips */}
        <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-5">
          <div className="flex items-center gap-2 font-bold text-teal-950">
            <TrendingUp className="h-4 w-4 text-teal-600" />
            <h4 className="text-sm">3 Lời Khuyên Tối Ưu Trước Khi Nộp</h4>
          </div>
          <ul className="mt-3 space-y-2 text-xs text-slate-700">
            {(result.tailoringTips && result.tailoringTips.length > 0
              ? result.tailoringTips
              : [
                  'Đưa từ khóa sát với JD vào phần Tóm tắt',
                  'Sử dụng mô hình STAR cho dự án tiêu biểu',
                  'Kiểm tra định dạng font chuẩn ATS',
                ]
            ).map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-200 text-[10px] font-bold text-teal-800">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CORE: Per-Requirement Comparison */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              So Sánh Từng Yêu Cầu Tuyển Dụng Với CV (Per-Requirement Comparison)
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Đối chiếu chi tiết từng tiêu chí trong tin tuyển dụng với bằng chứng thực tế từ CV của bạn.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                filter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({requirementMatches.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('MATCH')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                filter === 'MATCH' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Đạt ({matchCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('PARTIAL')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                filter === 'PARTIAL' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Một phần ({partialCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('MISSING')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                filter === 'MISSING' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              Chưa đạt ({missingCount})
            </button>
          </div>
        </div>

        {/* Requirements List */}
        <div className="mt-6 space-y-4">
          {filteredMatches.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">Không có yêu cầu nào trong bộ lọc này.</div>
          ) : (
            filteredMatches.map((item, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition hover:border-slate-300"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{item.requirement}</h4>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {renderStatusBadge(item.status)}
                    <span className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-xs font-bold text-slate-700">
                      {item.fitScore}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
                  {/* CV Evidence Quote */}
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="font-bold text-slate-500">Trích dẫn minh chứng từ CV:</p>
                    <p className="mt-1 text-slate-800 italic">
                      {item.cvEvidence && item.cvEvidence.trim()
                        ? `"${item.cvEvidence}"`
                        : 'Không tìm thấy bằng chứng trong CV'}
                    </p>
                  </div>

                  {/* Explanation */}
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="font-bold text-slate-500">Phân tích chuyên môn:</p>
                    <p className="mt-1 text-slate-700">{item.explanation}</p>
                  </div>
                </div>

                {/* Improvement tip */}
                {item.improvementTip && (
                  <div className="mt-3 rounded-xl border border-teal-100 bg-teal-50/60 p-3 text-xs text-teal-950">
                    <span className="font-bold text-teal-900">💡 Gợi ý cải thiện: </span>
                    <span>{item.improvementTip}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Collapsible General ATS Comments */}
      {result.comments && result.comments.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <button
            type="button"
            onClick={() => setShowAtsComments((prev) => !prev)}
            className="flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-bold text-slate-800">
                Nhận xét văn phong & ATS chuẩn STAR ({result.comments.length} góp ý)
              </span>
            </div>
            {showAtsComments ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {showAtsComments && (
            <div className="mt-4 space-y-3 divide-y divide-slate-100 pt-2">
              {result.comments.map((c, i) => (
                <div key={i} className="space-y-1.5 pt-3 text-xs">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-700">{c.section}</span>
                  <p className="text-slate-600 italic">Trích dẫn: &ldquo;{c.quote}&rdquo;</p>
                  <p className="font-medium text-rose-700">Vấn đề: {c.problem}</p>
                  <p className="font-semibold text-emerald-800">Cách sửa: {c.fix}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <Button variant="ghost" onClick={onReset} className="flex items-center gap-1.5 text-xs">
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Đánh giá lại hoặc chọn công việc khác</span>
        </Button>

        {result.jobId && (
          <Link
            href={`/jobs/${result.jobId}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <span>Ứng tuyển ngay công việc này</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
