'use client';

import { recruiterApplicationApi } from '@/apiRequest/recruiter-application';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useReviewApplication } from '@/hooks/useRecruiterApplications';
import { formatDate } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { ArrowLeft, Download, ExternalLink, FileText, Mail } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import ReviewHistoryTimeline from './ReviewHistoryTimeline';
import ReviewNotesPanel from './ReviewNotesPanel';
import ReviewStatusActions from './ReviewStatusActions';
import ReviewStatusBadge from './ReviewStatusBadge';

const MB = 1024 * 1024;

export default function ReviewApplicationDetailView({ applicationId }: { applicationId: number }) {
  const { data: application, isLoading, error, refetch } = useReviewApplication(applicationId);

  const fetchCv = async () => {
    try {
      return await recruiterApplicationApi.downloadCv(applicationId);
    } catch (cause) {
      toast.error(getErrorMessage(cause));
      return null;
    }
  };

  const openCv = async () => {
    const blob = await fetchCv();
    if (blob) window.open(URL.createObjectURL(blob), '_blank', 'noopener');
  };

  const downloadCv = async () => {
    const blob = await fetchCv();
    if (!blob || !application?.cv) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = application.cv.fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm font-semibold text-slate-700">{getErrorMessage(error)}</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Thử lại
          </Button>
          <Link href={ROUTES.RECRUITER_APPLICATIONS}>
            <Button variant="ghost">Về danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link
        href={ROUTES.RECRUITER_APPLICATIONS}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Danh sách hồ sơ
      </Link>

      <header className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-black text-slate-900">
              {application.candidateName || application.candidateEmail}
            </h2>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" aria-hidden />
                {application.candidateEmail}
              </span>
              <span>Ứng tuyển: {application.jobTitle}</span>
              {application.submittedAt && <span>Nộp ngày {formatDate(application.submittedAt)}</span>}
            </p>
          </div>
          <ReviewStatusBadge status={application.status} />
        </div>
        <ReviewStatusActions application={application} />
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900">CV</h3>
            {application.cv ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
                <p className="flex min-w-0 items-center gap-2 text-sm font-medium text-slate-800">
                  <FileText className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                  <span className="truncate">{application.cv.fileName}</span>
                  <span className="shrink-0 text-xs font-normal text-slate-400">
                    {(application.cv.fileSizeBytes / MB).toFixed(1)} MB
                  </span>
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ExternalLink className="h-3.5 w-3.5" />}
                    onClick={openCv}
                  >
                    Xem
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="h-3.5 w-3.5" />}
                    onClick={downloadCv}
                  >
                    Tải xuống
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Hồ sơ này chưa có CV.</p>
            )}
          </section>

          {application.coverLetter && (
            <section className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900">Thư giới thiệu</h3>
              <p className="text-[13.5px] leading-relaxed whitespace-pre-line text-slate-700">
                {application.coverLetter}
              </p>
            </section>
          )}

          {application.answers.length > 0 && (
            <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900">Trả lời câu hỏi sàng lọc</h3>
              <dl className="space-y-3">
                {application.answers.map((answer) => (
                  <div key={answer.questionId}>
                    <dt className="text-xs font-semibold text-slate-500">{answer.prompt}</dt>
                    <dd className="mt-0.5 text-[13.5px] text-slate-800">{answer.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>

        <aside className="space-y-5 lg:col-span-4">
          <ReviewNotesPanel application={application} />
          <ReviewHistoryTimeline history={application.history} />
        </aside>
      </div>
    </div>
  );
}
