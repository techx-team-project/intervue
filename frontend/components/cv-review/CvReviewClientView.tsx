'use client';

import React, { useState, useEffect, useTransition, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  Coins,
  Search,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';
import { getCvReviewQuota, uploadCvForReview, requestCvReview } from '@/apiRequest/ai';
import { candidateCvApi } from '@/apiRequest/candidate-cv';
import { publicJobApi } from '@/apiRequest/public-job';
import { useCandidateCredits } from '@/hooks/useCandidateCredits';
import { useAiPersonalDataConsent } from '@/hooks/useAiPersonalDataConsent';
import { useAuthStore } from '@/store/auth.store';
import type { CvReviewQuota, CvReviewResult } from '@/types/cv-review';
import type { CandidateResume } from '@/types/candidate-application';
import type { PublicJobSummaryResource } from '@/types/public-job';
import { JobFitResultView } from './JobFitResultView';
import { TopupCreditModal } from './TopupCreditModal';
import { CreditHistoryModal } from './CreditHistoryModal';

const POPULAR_POSITIONS = [
  'Backend Java Developer',
  'Frontend React Developer',
  'Fullstack Engineer',
  'Mobile Flutter Developer',
  'Data Analyst / Engineer',
  'DevOps / Cloud Engineer',
];

export default function CvReviewClientView() {
  const searchParams = useSearchParams();
  const urlJobId = searchParams.get('jobId');
  const urlLevel = searchParams.get('level');

  const user = useAuthStore((s) => s.user ?? s.candidate.user);
  const accessToken = useAuthStore((s) => s.accessToken ?? s.candidate.accessToken);
  const isAuthenticated = Boolean(accessToken || user);

  // Review Levels: 1 (General), 2 (Target Role), 3 (Job Fit - Paid)
  const [level, setLevel] = useState<1 | 2 | 3>(urlJobId || urlLevel === '3' ? 3 : 2);
  const [targetPosition, setTargetPosition] = useState('Backend Java Developer');

  // Level 3 Job Selection
  const [jobs, setJobs] = useState<PublicJobSummaryResource[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(urlJobId ? Number(urlJobId) : null);
  const [jobSearchQuery, setJobSearchQuery] = useState('');

  // CV Source: 'resume' (uploaded), 'upload' (pdf), 'text' (raw text)
  const [cvSource, setCvSource] = useState<'resume' | 'upload' | 'text'>('resume');
  const [userResumes, setUserResumes] = useState<CandidateResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');

  // Quota & Credits
  const [quota, setQuota] = useState<CvReviewQuota | null>(null);
  const { data: creditSummary, refetch: refetchCredits } = useCandidateCredits(isAuthenticated);

  // Modals
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Results & Loading
  const [reviewResult, setReviewResult] = useState<CvReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { requestConsent, consentDialog } = useAiPersonalDataConsent();

  // Load Quota & User Resumes & Jobs
  useEffect(() => {
    let active = true;
    if (isAuthenticated) {
      void getCvReviewQuota().then(
        (data) => {
          if (active && data) setQuota(data);
        },
        () => {},
      );

      void candidateCvApi.list().then(
        (list) => {
          if (active && list && list.length > 0) {
            setUserResumes(list);
            const defaultCv = list.find((r) => r.isDefault) ?? list[0];
            setSelectedResumeId(defaultCv.id);
          } else if (active) {
            setCvSource('upload');
          }
        },
        () => {
          if (active) setCvSource('upload');
        },
      );
    }

    void publicJobApi.search({ size: 30 }).then(
      (res) => {
        if (active && res?.items) {
          setJobs(res.items);
          if (!selectedJobId && res.items.length > 0 && !urlJobId) {
            setSelectedJobId(res.items[0].id);
          }
        }
      },
      () => {},
    );

    return () => {
      active = false;
    };
  }, [isAuthenticated, selectedJobId, urlJobId]);

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
    if (level === 2 && !targetPosition.trim()) {
      toast.error('Vui lòng nhập vị trí công việc mục tiêu');
      return;
    }

    if (level === 3 && !selectedJobId) {
      toast.error('Vui lòng chọn một tin tuyển dụng để so khớp');
      return;
    }

    if (level === 3 && (creditSummary?.currentBalance ?? 0) < 1) {
      toast.error('Số dư credit của bạn không đủ. Vui lòng nạp thêm credit để tiếp tục.');
      setIsTopupOpen(true);
      return;
    }

    if (cvSource === 'resume' && !selectedResumeId) {
      toast.error('Vui lòng chọn một CV đã lưu hoặc chuyển sang tải file mới');
      return;
    }

    if (cvSource === 'upload' && !selectedFile) {
      toast.error('Vui lòng chọn file CV định dạng PDF để đánh giá');
      return;
    }

    if (cvSource === 'text' && !cvText.trim()) {
      toast.error('Vui lòng dán nội dung văn bản CV');
      return;
    }

    requestConsent(() => {
      startTransition(async () => {
        setError(null);
        try {
          let result: CvReviewResult;

          if (cvSource === 'upload' && selectedFile) {
            result = await uploadCvForReview(
              selectedFile,
              level === 2 ? targetPosition : undefined,
              level === 3 ? (selectedJobId ?? undefined) : undefined,
            );
          } else {
            result = await requestCvReview({
              resumeId: cvSource === 'resume' ? (selectedResumeId ?? undefined) : undefined,
              cvText: cvSource === 'text' ? cvText : undefined,
              targetPosition: level === 2 ? targetPosition : undefined,
              jobId: level === 3 ? (selectedJobId ?? undefined) : undefined,
              level,
            });
          }

          setReviewResult(result);
          toast.success(
            level === 3 ? 'AI đã hoàn thành so khớp CV với tin tuyển dụng!' : 'AI đã phân tích CV thành công!',
          );

          if (level === 3) {
            void refetchCredits();
          } else {
            const updatedQuota = await getCvReviewQuota().catch(() => null);
            if (updatedQuota) setQuota(updatedQuota);
          }
        } catch (err: unknown) {
          const apiErr = err as { message?: string; status?: number };
          if (apiErr?.status === 402 || apiErr?.message?.includes('INSUFFICIENT_CREDITS')) {
            setError('Số dư credit không đủ để thực hiện đánh giá Level 3. Vui lòng nạp thêm.');
            setIsTopupOpen(true);
          } else if (apiErr?.status === 401 || apiErr?.message?.includes('UNAUTHENTICATED')) {
            setError('Bạn cần đăng nhập tài khoản Ứng viên để sử dụng tính năng đánh giá CV.');
          } else {
            setError(
              apiErr?.message ||
                'Không thể đánh giá CV lúc này. Hệ thống đã tự động bảo lưu/hoàn trả credit nếu có lỗi.',
            );
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

  const filteredJobs = jobs.filter((j) => {
    if (!jobSearchQuery.trim()) return true;
    const q = jobSearchQuery.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.company.name.toLowerCase().includes(q) ||
      (j.city && j.city.toLowerCase().includes(q))
    );
  });

  return (
    <div className="py-8">
      {consentDialog}

      {/* Credit Modals */}
      <TopupCreditModal
        isOpen={isTopupOpen}
        onClose={() => setIsTopupOpen(false)}
        currentBalance={creditSummary?.currentBalance}
      />
      <CreditHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        transactions={creditSummary?.recentTransactions}
        currentBalance={creditSummary?.currentBalance}
      />

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
          Phân tích chuyên sâu 3 cấp độ: Đánh giá chung (Level 1), Theo vị trí mục tiêu (Level 2), và So khớp từng yêu
          cầu với Tin tuyển dụng cụ thể (Level 3).
        </p>

        {/* Quota & Credits Bar */}
        <div className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-3 text-xs">
          {quota && (
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 shadow-2xs">
              <Clock className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                Lượt miễn phí Level 1 & 2:{' '}
                <strong className={quota.remaining > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                  {quota.remaining}/{quota.maxDaily}
                </strong>{' '}
                hôm nay
              </span>
            </div>
          )}

          {isAuthenticated && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-1.5 font-semibold text-amber-900 shadow-2xs">
              <Coins className="h-3.5 w-3.5 text-amber-600" />
              <span>
                Credit Level 3: <strong>{creditSummary?.currentBalance ?? 0} credit</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsTopupOpen(true)}
                className="ml-1 rounded-md bg-amber-600 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-amber-700"
              >
                + Nạp thêm
              </button>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="text-[11px] font-bold text-amber-800 underline hover:text-amber-950"
              >
                Lịch sử
              </button>
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
              <span>Vui lòng đăng nhập tài khoản Ứng viên để lưu lịch sử, quản lý credit và đánh giá CV.</span>
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

        {/* Level 3 Result View */}
        {reviewResult && (reviewResult.reviewLevel === 3 || (reviewResult.requirementMatches?.length ?? 0) > 0) && (
          <JobFitResultView
            result={reviewResult}
            onReset={handleReset}
            onOpenCreditHistory={() => setIsHistoryOpen(true)}
          />
        )}

        {/* Level 1 & 2 Result View */}
        {reviewResult &&
          reviewResult.reviewLevel !== 3 &&
          (!reviewResult.requirementMatches || reviewResult.requirementMatches.length === 0) && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        {reviewResult.fromCache ? 'Kết quả từ bộ nhớ đệm' : 'Đánh giá AI mới'}
                      </span>
                      <span className="text-xs text-slate-500">Mô hình: {reviewResult.modelVersion}</span>
                    </div>
                    <h2 className="mt-2 text-xl font-bold text-slate-900">Báo Cáo Đánh Giá CV Chuẩn ATS</h2>
                  </div>

                  <div
                    className={`flex h-20 w-20 flex-col items-center justify-center rounded-2xl border-2 text-center ${getScoreColor(
                      reviewResult.overallScore,
                    )}`}
                  >
                    <span className="text-2xl font-black">{reviewResult.overallScore}</span>
                    <span className="text-[10px] font-bold tracking-wider uppercase">Điểm ATS</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Tóm Tắt Tổng Quan</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{reviewResult.summary}</p>
                </div>
              </div>

              {/* Quote - Problem - Fix Comments */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Góp Ý Cụ Thể Từng Phần (Quote → Problem → Fix)
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                    {reviewResult.comments.length} nhận xét
                  </span>
                </div>

                <div className="space-y-4">
                  {reviewResult.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 transition hover:border-slate-300"
                    >
                      <div className="border-b border-slate-200/60 bg-white px-4 py-2 text-xs font-bold text-slate-800">
                        Mục: {comment.section}
                      </div>
                      <div className="space-y-2.5 p-4 text-xs">
                        <div className="flex items-start gap-2 text-slate-600">
                          <Quote className="h-4 w-4 shrink-0 text-slate-400" />
                          <div>
                            <span className="font-semibold text-slate-700">Trích dẫn trong CV: </span>
                            <span className="italic">&ldquo;{comment.quote}&rdquo;</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-rose-700">
                          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                          <div>
                            <span className="font-bold">Vấn đề: </span>
                            <span>{comment.problem}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50/80 p-2.5 text-emerald-900">
                          <Wrench className="h-4 w-4 shrink-0 text-emerald-600" />
                          <div>
                            <span className="font-bold">Cách viết lại chuẩn STAR: </span>
                            <span>{comment.fix}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button variant="ghost" onClick={handleReset} className="flex items-center gap-1.5 text-xs">
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Đánh giá lại hoặc thử phiên bản khác</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

        {/* Input Configuration Card */}
        {!reviewResult && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {/* Step 1: Choose Feedback Level */}
            <div className="mb-6">
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase">
                1. Chọn Cấp Độ Đánh Giá AI
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                {/* Level 1 */}
                <button
                  type="button"
                  onClick={() => setLevel(1)}
                  className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition ${
                    level === 1
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      Level 1 · Miễn phí
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-slate-900">Đánh Giá Tổng Quan</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Chấm điểm ATS chung, định dạng và lỗi ngữ pháp cơ bản.
                    </p>
                  </div>
                  <span className="mt-3 text-[11px] font-semibold text-emerald-700">3 lượt / ngày</span>
                </button>

                {/* Level 2 */}
                <button
                  type="button"
                  onClick={() => setLevel(2)}
                  className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition ${
                    level === 2
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      Level 2 · Miễn phí
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-slate-900">Theo Vị Trí Mục Tiêu</h3>
                    <p className="mt-1 text-xs text-slate-500">Tối ưu từ khóa và chuẩn STAR cho vị trí mong muốn.</p>
                  </div>
                  <span className="mt-3 text-[11px] font-semibold text-emerald-700">3 lượt / ngày</span>
                </button>

                {/* Level 3 */}
                <button
                  type="button"
                  onClick={() => setLevel(3)}
                  className={`relative flex flex-col justify-between rounded-2xl border p-4 text-left transition ${
                    level === 3
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-amber-200 bg-amber-50/30 hover:border-amber-300'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2 py-0.5 text-[10px] font-black text-white shadow-2xs">
                    VIP · TASK-82
                  </span>
                  <div>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      Level 3 · Trả phí
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-slate-900">So Khớp Với Việc Làm</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      So sánh từng yêu cầu tuyển dụng với CV, trích bằng chứng & hoàn tiền tự động nếu lỗi.
                    </p>
                  </div>
                  <span className="mt-3 text-[11px] font-bold text-amber-700">1 Credit / lượt</span>
                </button>
              </div>
            </div>

            {/* Target Position (Level 2) */}
            {level === 2 && (
              <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                  Vị trí công việc mục tiêu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={targetPosition}
                  onChange={(e) => setTargetPosition(e.target.value)}
                  placeholder="Ví dụ: Backend Java Developer, React Engineer..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {POPULAR_POSITIONS.map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setTargetPosition(pos)}
                      className={`rounded-lg px-2.5 py-1 text-xs transition ${
                        targetPosition === pos
                          ? 'bg-emerald-600 font-bold text-white'
                          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specific Job Post Selection (Level 3) */}
            {level === 3 && (
              <div className="mb-6 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-xs font-bold tracking-wider text-emerald-950 uppercase">
                    Chọn Tin Tuyển Dụng Cụ Thể Để So Khớp <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-700">Dữ liệu việc làm thực tế</span>
                </div>

                {/* Job Search Input */}
                <div className="relative mb-3">
                  <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={jobSearchQuery}
                    onChange={(e) => setJobSearchQuery(e.target.value)}
                    placeholder="Tìm theo chức danh, công ty hoặc địa điểm..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3.5 pl-9 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Job Selector Dropdown / Cards */}
                <div className="max-h-52 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2">
                  {filteredJobs.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-400">Không tìm thấy tin tuyển dụng phù hợp.</div>
                  ) : (
                    filteredJobs.map((j) => (
                      <button
                        key={j.id}
                        type="button"
                        onClick={() => setSelectedJobId(j.id)}
                        className={`flex w-full items-center justify-between rounded-xl p-2.5 text-left transition ${
                          selectedJobId === j.id
                            ? 'border border-emerald-400 bg-emerald-50 shadow-2xs'
                            : 'border border-transparent hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">{j.title}</p>
                          <p className="text-[11px] text-slate-500">
                            {j.company.name} · {j.city || 'Toàn quốc'}
                          </p>
                        </div>
                        {selectedJobId === j.id && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />}
                      </button>
                    ))
                  )}
                </div>

                {/* Transparency Policy Box */}
                <div className="mt-3 rounded-xl border border-emerald-200 bg-white p-3 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <Coins className="h-3.5 w-3.5 text-amber-500" />
                    <span>Chính sách tính phí & hoàn tiền:</span>
                  </div>
                  <p className="mt-1">
                    Trừ <strong>1 credit</strong> trên mỗi phiên phân tích. Nếu hệ thống AI gặp lỗi kết nối hoặc không
                    phản hồi, credit sẽ <strong>tự động hoàn trả 100%</strong> vào tài khoản. Đánh giá lại cùng 1 CV với
                    cùng 1 công việc sẽ lấy từ bộ nhớ đệm và <strong>không tốn thêm credit</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Choose CV Source */}
            <div className="mb-6">
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase">
                2. Chọn Nguồn CV
              </label>
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                {userResumes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCvSource('resume')}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                      cvSource === 'resume'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    CV đã lưu của tôi ({userResumes.length})
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setCvSource('upload')}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    cvSource === 'upload' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tải lên tệp PDF mới
                </button>
                <button
                  type="button"
                  onClick={() => setCvSource('text')}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    cvSource === 'text' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Dán nội dung văn bản
                </button>
              </div>

              {/* Mode: Resume Select */}
              {cvSource === 'resume' && (
                <div className="mt-4 space-y-2">
                  {userResumes.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedResumeId(r.id)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                        selectedResumeId === r.id
                          ? 'border-emerald-500 bg-emerald-50/60 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-4 w-4 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{r.fileName}</p>
                          <p className="text-[11px] text-slate-400">
                            {r.fileSizeBytes ? `${(r.fileSizeBytes / 1024).toFixed(0)} KB` : ''}
                            {r.isDefault && ' · CV Mặc định'}
                          </p>
                        </div>
                      </div>
                      {selectedResumeId === r.id && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}

              {/* Mode: Upload PDF */}
              {cvSource === 'upload' && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
                    selectedFile
                      ? 'border-emerald-400 bg-emerald-50/50'
                      : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <FileCheck className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500">
                        {(selectedFile.size / 1024).toFixed(0)} KB · Nhấn để chọn file khác
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        <UploadCloud className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                        Kéo thả file CV vào đây hoặc <span className="text-emerald-600 underline">chọn tệp</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        Chỉ hỗ trợ tệp định dạng PDF (.pdf), dung lượng tối đa 10MB
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Mode: Paste Text */}
              {cvSource === 'text' && (
                <div className="mt-4">
                  <textarea
                    rows={8}
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    placeholder="Dán toàn bộ nội dung văn bản CV của bạn vào đây (Kinh nghiệm, Kỹ năng, Học vấn, Dự án...)..."
                    className="w-full rounded-2xl border border-slate-200 p-4 text-xs leading-relaxed text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                {level === 3 ? (
                  <span>
                    Chi phí: <strong>1 credit</strong> · Số dư:{' '}
                    <strong className={creditSummary?.currentBalance ? 'text-emerald-600' : 'text-rose-600'}>
                      {creditSummary?.currentBalance ?? 0} credit
                    </strong>
                  </span>
                ) : (
                  <span>
                    Còn lại:{' '}
                    <strong className={quota?.remaining ? 'text-emerald-600' : 'text-rose-600'}>
                      {quota?.remaining ?? 0}/{quota?.maxDaily ?? 3}
                    </strong>{' '}
                    lượt miễn phí hôm nay
                  </span>
                )}
              </div>

              <Button
                onClick={handleStartReview}
                disabled={isPending}
                size="lg"
                className="flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>AI đang phân tích chuyên sâu...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>
                      {level === 3 ? 'Bắt đầu so khớp với tin tuyển dụng (1 Credit)' : 'Bắt đầu chấm điểm & tối ưu CV'}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
