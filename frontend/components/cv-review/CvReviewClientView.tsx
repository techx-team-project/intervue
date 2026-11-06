'use client';

import React, { useState, useEffect, useTransition, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  UploadCloud,
  FileText,
  AlertCircle,
  Quote,
  Wrench,
  Clock,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Lock,
  ArrowRight,
  FileCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { getCvReviewQuota, uploadCvForReview, requestCvReview } from '@/apiRequest/ai';
import { useAiPersonalDataConsent } from '@/hooks/useAiPersonalDataConsent';
import { useAuthStore } from '@/store/auth.store';
import type { CvReviewQuota, CvReviewResult } from '@/types/cv-review';

const POPULAR_POSITIONS = [
  'Backend Java Developer',
  'Frontend React Developer',
  'Fullstack Engineer',
  'Mobile Flutter Developer',
  'Data Analyst / Engineer',
  'DevOps / Cloud Engineer',
];

export default function CvReviewClientView() {
  const user = useAuthStore((s) => s.user ?? s.candidate.user);
  const accessToken = useAuthStore((s) => s.accessToken ?? s.candidate.accessToken);
  const isAuthenticated = Boolean(accessToken || user);

  const [targetPosition, setTargetPosition] = useState('Backend Java Developer');
  const [mode, setMode] = useState<'upload' | 'text'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [quota, setQuota] = useState<CvReviewQuota | null>(null);
  const [reviewResult, setReviewResult] = useState<CvReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { requestConsent, consentDialog } = useAiPersonalDataConsent();

  useEffect(() => {
    let active = true;
    if (isAuthenticated) {
      void getCvReviewQuota().then(
        (data) => {
          if (active && data) setQuota(data);
        },
        () => {},
      );
    }
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Vui lòng chọn file định dạng PDF (.pdf)');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File CV không được vượt quá 10MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Vui lòng chọn file định dạng PDF (.pdf)');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleStartReview = () => {
    if (!targetPosition.trim()) {
      toast.error('Vui lòng nhập vị trí công việc mục tiêu');
      return;
    }

    if (mode === 'upload' && !selectedFile) {
      toast.error('Vui lòng chọn file CV định dạng PDF để đánh giá');
      return;
    }

    if (mode === 'text' && !cvText.trim()) {
      toast.error('Vui lòng dán nội dung văn bản CV');
      return;
    }

    requestConsent(() => {
      startTransition(async () => {
        setError(null);
        try {
          let result: CvReviewResult;
          if (mode === 'upload' && selectedFile) {
            result = await uploadCvForReview(selectedFile, targetPosition);
          } else {
            result = await requestCvReview({
              cvText,
              targetPosition,
            });
          }

          setReviewResult(result);
          toast.success('AI đã phân tích CV thành công!');

          const updatedQuota = await getCvReviewQuota().catch(() => null);
          if (updatedQuota) setQuota(updatedQuota);
        } catch (err: unknown) {
          const apiErr = err as { message?: string; status?: number };
          if (apiErr?.status === 401 || apiErr?.message?.includes('UNAUTHENTICATED')) {
            setError('Bạn cần đăng nhập tài khoản Ứng viên để sử dụng tính năng đánh giá CV.');
          } else {
            setError(apiErr?.message || 'Không thể đánh giá CV lúc này. Vui lòng thử lại sau.');
          }
        }
      });
    });
  };

  const handleReset = () => {
    setReviewResult(null);
    setError(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="py-8">
      {consentDialog}

      {/* Hero Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>InterVue AI Career Intelligence</span>
        </div>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          AI Chấm Điểm & Tối Ưu Hóa CV Chuẩn ATS
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-600 sm:text-sm">
          Phân tích chuyên sâu dựa trên mô hình STAR, trích dẫn điểm yếu thực tế và cung cấp câu viết lại mẫu giúp tăng
          tỷ lệ vượt qua bộ lọc ATS lên 85%.
        </p>

        {/* Quota & Privacy Bar */}
        <div className="mx-auto mt-4 flex max-w-xl flex-wrap items-center justify-center gap-3 text-xs">
          {quota && (
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 shadow-2xs">
              <Clock className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                Hạn mức:{' '}
                <strong className={quota.remaining > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                  {quota.remaining}/{quota.maxDaily}
                </strong>{' '}
                lượt hôm nay
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Dữ liệu ẩn danh & riêng tư 100%</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-4xl">
        {!isAuthenticated && (
          <div className="mb-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs sm:flex-row">
            <div className="flex items-center gap-2.5 text-amber-900">
              <Lock className="h-4 w-4 shrink-0 text-amber-700" />
              <span>Vui lòng đăng nhập tài khoản Ứng viên để lưu lịch sử và đánh giá CV.</span>
            </div>
            <Link
              href="/login?redirect=/cv-review"
              className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-amber-600 px-3.5 py-1.5 font-bold text-white transition hover:bg-amber-700"
            >
              Đăng nhập ngay
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* Input Card */}
        {!reviewResult && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* Step 1: Target Position */}
            <div className="mb-6">
              <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-800 uppercase">
                1. Vị trí công việc mục tiêu <span className="text-rose-500">*</span>
              </label>
              <p className="mb-2 text-xs text-slate-500">
                AI sẽ căn cứ vào tiêu chuẩn của vị trí này để chấm điểm độ tương thích và yêu cầu kỹ năng.
              </p>
              <input
                type="text"
                value={targetPosition}
                onChange={(e) => setTargetPosition(e.target.value)}
                placeholder="Ví dụ: Backend Java Developer, Data Analyst..."
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />

              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Gợi ý nhanh:</span>
                {POPULAR_POSITIONS.map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setTargetPosition(pos)}
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                      targetPosition === pos
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Mode Toggle */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-bold tracking-wide text-slate-800 uppercase">
                2. Cung cấp hồ sơ CV của bạn <span className="text-rose-500">*</span>
              </label>
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => setMode('upload')}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition ${
                    mode === 'upload' ? 'bg-white text-emerald-700 shadow-2xs' : 'hover:text-slate-900'
                  }`}
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>Tải file PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('text')}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition ${
                    mode === 'text' ? 'bg-white text-emerald-700 shadow-2xs' : 'hover:text-slate-900'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Dán văn bản CV</span>
                </button>
              </div>
            </div>

            {/* Mode 1: File Upload */}
            {mode === 'upload' ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
                  selectedFile
                    ? 'border-emerald-400 bg-emerald-50/40'
                    : 'border-slate-300 bg-slate-50/60 hover:border-emerald-500 hover:bg-emerald-50/20'
                }`}
              >
                <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />

                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <FileCheck className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-bold text-slate-800">{selectedFile.name}</div>
                    <div className="text-xs text-slate-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Sẵn sàng phân tích
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Chọn file khác
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      Kéo thả file CV vào đây hoặc <span className="text-emerald-700 underline">chọn từ thiết bị</span>
                    </div>
                    <p className="text-xs text-slate-400">Hỗ trợ định dạng PDF (.pdf) dung lượng tối đa 10MB</p>
                  </div>
                )}
              </div>
            ) : (
              /* Mode 2: Paste Text */
              <div>
                <textarea
                  rows={8}
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Dán toàn bộ nội dung CV của bạn (Mục tiêu nghề nghiệp, Kỹ năng, Kinh nghiệm làm việc, Học vấn, Dự án...)"
                  className="w-full rounded-2xl border border-slate-300 p-4 font-mono text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleStartReview}
                disabled={isPending || (quota !== null && quota.remaining <= 0)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50 sm:text-sm"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>AI đang bóc tách và phân tích CV...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Bắt đầu chấm điểm CV với AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Result View */}
        {reviewResult && (
          <div className="space-y-6">
            {/* Header Score Banner */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-6 shadow-sm sm:flex-row sm:items-center">
              <div>
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
                    Báo Cáo Phân Tích CV Chuyên Sâu
                  </span>
                  {reviewResult.fromCache && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                      ⚡ Đã tải từ bộ nhớ đệm (Không tốn lượt)
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900">Vị trí mục tiêu: {targetPosition}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-700 sm:text-sm">{reviewResult.summary}</p>
              </div>

              {/* Overall Score Circle */}
              <div
                className={`flex shrink-0 flex-col items-center justify-center rounded-2xl border-2 px-5 py-4 shadow-sm ${getScoreColor(
                  reviewResult.overallScore,
                )}`}
              >
                <span className="text-[10px] font-bold tracking-wider uppercase">Điểm ATS ước tính</span>
                <span className="text-3xl font-black">{reviewResult.overallScore}</span>
                <span className="text-[10px] font-semibold">/ 100 điểm</span>
              </div>
            </div>

            {/* Comments List (Quote → Problem → Fix) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold tracking-wide text-slate-800 uppercase">
                  Chi tiết chẩn đoán ({reviewResult.comments.length} đề xuất cải thiện)
                </h4>
                <span className="text-xs text-slate-400">Chuẩn STAR & ATS Framework</span>
              </div>

              {reviewResult.comments.map((comment, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:border-slate-300"
                >
                  {comment.section && (
                    <div className="mb-3">
                      <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                        Mục: {comment.section}
                      </span>
                    </div>
                  )}

                  {/* 1. Quote */}
                  <div className="mb-3">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-amber-800">
                      <Quote className="h-3.5 w-3.5 text-amber-600" />
                      <span>Trích dẫn thực tế từ CV của bạn:</span>
                    </div>
                    <blockquote className="rounded-xl border-l-4 border-amber-400 bg-amber-50/70 p-3 font-mono text-xs text-slate-800 italic">
                      &ldquo;{comment.quote}&rdquo;
                    </blockquote>
                  </div>

                  {/* 2. Problem */}
                  <div className="mb-3">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-rose-800">
                      <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                      <span>Vấn đề phát hiện:</span>
                    </div>
                    <p className="rounded-xl border border-rose-100 bg-rose-50/60 p-3 text-xs leading-relaxed text-slate-700">
                      {comment.problem}
                    </p>
                  </div>

                  {/* 3. Fix */}
                  <div>
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                      <Wrench className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Đề xuất sửa đổi & Mẫu viết lại chuẩn STAR:</span>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs leading-relaxed font-medium text-emerald-900">
                      {comment.fix}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Đánh giá lại hoặc chọn CV khác</span>
              </button>

              <Link
                href="/cv-templates"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Áp dụng vào Mẫu CV Builder</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
