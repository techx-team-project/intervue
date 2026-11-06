'use client';

import { useEffect, useState, useTransition } from 'react';
import { Sparkles, AlertCircle, Quote, Wrench, Clock, ShieldCheck, RefreshCw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getCvReviewQuota, requestCvReview } from '@/apiRequest/ai';
import { useAiPersonalDataConsent } from '@/hooks/useAiPersonalDataConsent';
import type { CvReviewQuota, CvReviewResult } from '@/types/cv-review';

interface CvReviewPanelProps {
  resumeId?: number;
  cvText?: string;
  targetPosition?: string;
  className?: string;
}

export default function CvReviewPanel({ resumeId, cvText, targetPosition, className = '' }: CvReviewPanelProps) {
  const [quota, setQuota] = useState<CvReviewQuota | null>(null);
  const [reviewResult, setReviewResult] = useState<CvReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { requestConsent, consentDialog } = useAiPersonalDataConsent();

  useEffect(() => {
    let active = true;
    void getCvReviewQuota().then(
      (data) => {
        if (active && data) {
          setQuota(data);
        }
      },
      () => {},
    );
    return () => {
      active = false;
    };
  }, []);

  const handleReviewClick = () => {
    requestConsent(() => {
      startTransition(async () => {
        setError(null);
        try {
          const result = await requestCvReview({
            resumeId,
            cvText,
            targetPosition,
          });
          setReviewResult(result);
          const updatedQuota = await getCvReviewQuota().catch(() => null);
          if (updatedQuota) setQuota(updatedQuota);
        } catch (err: unknown) {
          const apiErr = err as { message?: string };
          setError(apiErr?.message || 'Không thể đánh giá CV lúc này. Vui lòng thử lại sau.');
        }
      });
    });
  };

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {consentDialog}

      {/* Header and Quota status */}
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Sparkles className="h-4 w-4" />
            </span>
            <h3 className="text-base font-bold text-slate-800">Đánh giá & Gợi ý cải thiện CV bằng AI</h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Phân tích câu chữ, tối ưu hóa bộ lọc ATS và phát hiện các điểm chưa có số liệu định lượng.
          </p>
        </div>

        {quota && (
          <div className="flex flex-col sm:items-end">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Clock className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                Còn{' '}
                <strong className={quota.remaining > 0 ? 'text-emerald-600' : 'text-red-500'}>
                  {quota.remaining}/{quota.maxDaily}
                </strong>{' '}
                lượt hôm nay
              </span>
            </div>
            <span className="text-[11px] text-slate-400">(Làm mới lúc 00:00 giờ Việt Nam)</span>
          </div>
        )}
      </div>

      {/* Privacy disclaimer - Only Candidate Sees It */}
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
        <span>
          <strong>Bảo mật riêng tư:</strong> Chỉ bạn mới xem được các nhận xét chẩn đoán này. Nhà tuyển dụng không thể
          xem.
        </span>
      </div>

      {/* Action CTA */}
      {!reviewResult && (
        <div className="mt-5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-6 text-center">
          <FileText className="mx-auto mb-2 h-10 w-10 text-slate-400" />
          <p className="mb-1 text-sm font-medium text-slate-700">
            Nhận góp ý chi tiết cho từng dòng kinh nghiệm trong CV
          </p>
          <p className="mx-auto mb-4 max-w-md text-xs text-slate-500">
            Mỗi nhận xét bám sát trích dẫn thực tế từ CV, chỉ ra lý do chưa tối ưu và cung cấp mẫu viết lại chuẩn STAR.
          </p>
          <Button
            onClick={handleReviewClick}
            disabled={isPending || (quota !== null && quota.remaining <= 0)}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Đang phân tích CV...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                Đánh giá CV với AI
              </span>
            )}
          </Button>
          {quota && quota.remaining <= 0 && (
            <p className="mt-2 text-xs text-red-500">
              Bạn đã sử dụng hết 3 lượt đánh giá miễn phí hôm nay. Vui lòng quay lại sau 00:00.
            </p>
          )}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Review Result View */}
      {reviewResult && (
        <div className="mt-5 space-y-4">
          {/* Summary Banner */}
          <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">Tổng quan đánh giá</span>
                {reviewResult.fromCache && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    ⚡ CV không đổi: Đã tải kết quả đã lưu (Không tốn lượt)
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed text-slate-700">{reviewResult.summary}</p>
            </div>
            {reviewResult.overallScore > 0 && (
              <div className="flex shrink-0 flex-col items-center justify-center rounded-lg border border-emerald-200 bg-white px-3 py-2 shadow-xs">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Điểm ATS ước tính</span>
                <span className="text-xl font-black text-emerald-600">{reviewResult.overallScore}/100</span>
              </div>
            )}
          </div>

          {/* Comments List (Quote → Problem → Fix) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Chi tiết các điểm cần hoàn thiện ({reviewResult.comments.length} nhận xét)
            </h4>

            {reviewResult.comments.map((comment, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs transition-colors hover:border-slate-300"
              >
                {comment.section && (
                  <span className="mb-2.5 inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    Mục: {comment.section}
                  </span>
                )}

                {/* 1. Quote from CV */}
                <div className="mb-2.5">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <Quote className="h-3.5 w-3.5" />
                    <span>Trích dẫn từ CV của bạn:</span>
                  </div>
                  <blockquote className="rounded-md border-l-3 border-amber-400 bg-amber-50/70 p-2.5 font-mono text-xs text-slate-800 italic">
                    &ldquo;{comment.quote}&rdquo;
                  </blockquote>
                </div>

                {/* 2. Problem */}
                <div className="mb-2.5">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-red-700">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Vấn đề phát hiện:</span>
                  </div>
                  <p className="rounded-md border border-red-100 bg-red-50/50 p-2.5 text-xs leading-relaxed text-slate-700">
                    {comment.problem}
                  </p>
                </div>

                {/* 3. Fix */}
                <div>
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <Wrench className="h-3.5 w-3.5" />
                    <span>Đề xuất sửa đổi & Câu viết mẫu:</span>
                  </div>
                  <div className="rounded-md border border-emerald-200 bg-emerald-50/80 p-2.5 text-xs leading-relaxed font-medium text-emerald-900">
                    {comment.fix}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Re-analyze button */}
          <div className="pt-2 text-center">
            <Button
              onClick={handleReviewClick}
              disabled={isPending || (quota !== null && quota.remaining <= 0)}
              variant="outline"
              className="border-slate-300 px-4 py-2 text-xs hover:bg-slate-50"
            >
              <RefreshCw className={`mr-1.5 h-3 w-3 ${isPending ? 'animate-spin' : ''}`} />
              Đánh giá lại CV
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
