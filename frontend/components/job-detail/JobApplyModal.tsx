'use client';

import React, { useState } from 'react';
import { Send, FileText, Upload, Sparkles, CheckCircle2, Bot, Check, HelpCircle } from 'lucide-react';
import type { JobDetail } from '@/types/job';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';
import { generateCoverLetter } from '@/apiRequest/ai';
import { useAiPersonalDataConsent } from '@/hooks/useAiPersonalDataConsent';

interface JobApplyModalProps {
  job: JobDetail;
  isOpen: boolean;
  onClose: () => void;
  isPreviewMode?: boolean;
}

export default function JobApplyModal({ job, isOpen, onClose, isPreviewMode = false }: JobApplyModalProps) {
  const [selectedCv, setSelectedCv] = useState<'profile' | 'upload'>('profile');
  const [fullName, setFullName] = useState('Lê Minh Trí');
  const [email, setEmail] = useState('minhtri.le@gmail.com');
  const [phone, setPhone] = useState('0912 345 678');
  const [coverLetter, setCoverLetter] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { requestConsent, consentDialog } = useAiPersonalDataConsent();

  const handleGenerateAiCoverLetter = () => {
    requestConsent(async () => {
      setIsGeneratingAi(true);
      try {
        const response = await generateCoverLetter({
          jobTitle: job.title,
          companyName: job.company.name,
          jobRequirements: job.requirements || [],
          jobDescription: Array.isArray(job.jobDescription) ? job.jobDescription.join('\n') : '',
          candidateName: fullName,
          cvText:
            selectedCv === 'profile'
              ? `Ứng viên: ${fullName}. Kỹ năng và kinh nghiệm liên quan đến vị trí ${job.title}.`
              : '',
        });

        if (response?.coverLetter) {
          setCoverLetter(response.coverLetter);
          toast.success('Đã tạo bản nháp thư giới thiệu! Bạn hãy kiểm tra và chỉnh sửa trước khi gửi.');
        }
      } catch {
        // Fallback to grounded factual draft if offline/mock
        setCoverLetter(
          `Kính gửi Bộ phận Tuyển dụng ${job.company.name},\n\nTôi viết thư này để bày tỏ nguyện vọng ứng tuyển vào vị trí ${job.title} tại Quý công ty. Dựa trên các yêu cầu công việc được nêu rõ trong thông báo tuyển dụng và quá trình tích lũy kinh nghiệm thực tế của bản thân, tôi tin rằng các kỹ năng chuyên môn của mình hoàn toàn đáp ứng tốt mục tiêu phát triển của dự án.\n\nTôi rất mong có cơ hội được tham gia buổi phỏng vấn để trao đổi chi tiết hơn về những đóng góp có thể mang lại cho ${job.company.name}.\n\nTrân trọng cảm ơn,\n${fullName}`,
        );
        toast.info('Đã tạo bản nháp thư giới thiệu từ dữ kiện công việc. Vui lòng chỉnh sửa trước khi nộp.');
      } finally {
        setIsGeneratingAi(false);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (isPreviewMode) {
        toast.success('Mô phỏng nộp hồ sơ thành công! Đây là màn hình thông báo hoàn tất mà ứng viên sẽ nhìn thấy.');
      }
    }, 700);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      maxWidth="2xl"
      title="Ứng tuyển việc làm"
      description={`${job.title} - ${job.company.name}`}
    >
      {consentDialog}
      {isSubmitted ? (
        <div className="space-y-4 py-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h4 className="text-xl font-bold text-slate-900">Nộp hồ sơ ứng tuyển thành công!</h4>

          <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-600">
            Hồ sơ của bạn đã được chuyển thẳng tới phòng nhân sự của{' '}
            <strong className="text-slate-800">{job.company.name}</strong>. Nhà tuyển dụng sẽ xem xét và phản hồi trong
            24-48 giờ làm việc.
          </p>

          <div className="mx-auto max-w-md rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-left text-xs text-slate-700">
            <div className="mb-1 flex items-center gap-1.5 font-bold text-emerald-900">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Gợi ý cho bạn:</span>
            </div>
            <div>
              Trong lúc chờ đợi kết quả, bạn có thể tham gia <strong>Phòng luyện phỏng vấn AI</strong> của InterVue để
              chuẩn bị câu trả lời cho vị trí này!
            </div>
          </div>

          {isPreviewMode && (
            <div className="mx-auto max-w-md rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-left text-xs text-amber-900">
              <div className="mb-1 flex items-center gap-1.5 font-bold text-amber-950">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>Ghi chú Chế độ Xem trước:</span>
              </div>
              <p className="leading-relaxed text-amber-800">
                Mô phỏng hoàn tất. Ứng viên thật sau khi nộp sẽ được lưu vào mục <strong>Applications</strong> trong
                Recruiter Panel của bạn để chấm điểm AI ATS và lọc hồ sơ.
              </p>
            </div>
          )}

          <div className="flex justify-center gap-3 pt-4">
            <Button onClick={handleResetAndClose} className="px-6">
              Hoàn tất & Đóng
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {isPreviewMode && (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50/90 p-3 text-xs text-amber-900 shadow-2xs">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="font-bold">Chế độ xem trước (Candidate Preview Mode):</p>
                <p className="mt-0.5 text-amber-800">
                  Đây là giao diện nộp CV và câu hỏi tuyển dụng mà ứng viên nhìn thấy. Dữ liệu nộp thử sẽ không được ghi
                  nhận vào hệ thống.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-linear-to-r from-emerald-50 to-teal-50 px-4 py-2.5 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span className="font-medium text-slate-700">Độ tương thích hồ sơ với vị trí:</span>
            </div>
            <span className="rounded-full border border-emerald-200 bg-white px-2 py-0.5 font-extrabold text-emerald-700">
              {job.atsMatchScore}% Rất phù hợp
            </span>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold tracking-wider text-slate-700 uppercase">
              Chọn CV ứng tuyển <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div
                onClick={() => setSelectedCv('profile')}
                className={`cursor-pointer rounded-xl border p-3.5 transition ${
                  selectedCv === 'profile'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">CV Kế toán trưởng ATS</span>
                  </div>
                  {selectedCv === 'profile' && <Check className="h-4 w-4 text-emerald-600" />}
                </div>
                <p className="mt-1.5 text-xs text-slate-500">Cập nhật 2 ngày trước • Chuẩn ATS 92 điểm</p>
              </div>

              <div
                onClick={() => setSelectedCv('upload')}
                className={`cursor-pointer rounded-xl border p-3.5 transition ${
                  selectedCv === 'upload'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-dashed border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-slate-500" />
                    <span className="text-xs font-bold text-slate-800">Tải lên CV mới</span>
                  </div>
                  {selectedCv === 'upload' && <Check className="h-4 w-4 text-emerald-600" />}
                </div>
                <p className="mt-1.5 text-xs text-slate-500">Hỗ trợ file PDF, DOCX (tối đa 5MB)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Họ và tên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Email liên hệ <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Số điện thoại <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Thư giới thiệu (Cover Letter)</label>

              <button
                type="button"
                onClick={handleGenerateAiCoverLetter}
                disabled={isGeneratingAi}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
              >
                <Bot className="h-3.5 w-3.5 text-emerald-600" />
                <span>{isGeneratingAi ? 'Đang tạo thư...' : 'Generate with AI'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Giới thiệu ngắn gọn kinh nghiệm, kỹ năng nổi bật và lý do bạn phù hợp với vị trí này..."
              className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
            <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
              <Sparkles className="h-3 w-3 shrink-0 text-emerald-600" />
              <span>
                Chỉ sử dụng dữ kiện từ CV và tin tuyển dụng. Bạn có thể chỉnh sửa tự do trước khi nộp; thư không bao giờ
                được gửi tự động.
              </span>
            </p>
          </div>

          {/* Screening Questions from Recruiter */}
          {job.screeningQuestions && job.screeningQuestions.length > 0 && (
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-slate-800 uppercase">
                <HelpCircle className="h-4 w-4 text-emerald-600" />
                <span>Câu hỏi sàng lọc ứng viên ({job.screeningQuestions.length})</span>
              </div>

              <div className="space-y-3.5">
                {job.screeningQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      <span className="mr-1 font-bold text-emerald-700">Q{idx + 1}.</span>
                      {q.question} {q.required && <span className="text-rose-500">*</span>}
                    </label>

                    {q.type === 'YES_NO' ? (
                      <div className="flex items-center gap-4">
                        {['Có', 'Không'].map((opt) => (
                          <label key={opt} className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-700">
                            <input
                              type="radio"
                              name={`sq-${q.id}`}
                              checked={answers[q.id] === opt}
                              onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : q.type === 'MULTIPLE_CHOICE' && q.options && q.options.length > 0 ? (
                      <div className="space-y-1.5">
                        {q.options.map((opt) => (
                          <label key={opt} className="flex cursor-pointer items-center gap-2 text-xs text-slate-700">
                            <input
                              type="radio"
                              name={`sq-${q.id}`}
                              checked={answers[q.id] === opt}
                              onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        placeholder="Nhập câu trả lời của bạn..."
                        value={answers[q.id] || ''}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs leading-relaxed text-slate-500">
            Bằng việc nhấn &quot;Nộp hồ sơ ứng tuyển&quot;, bạn đồng ý với Điều khoản dịch vụ và Chính sách quyền riêng
            tư của InterVue.
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
            <Button variant="secondary" size="sm" onClick={handleResetAndClose}>
              Hủy bỏ
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting} leftIcon={<Send className="h-3.5 w-3.5" />}>
              {isPreviewMode ? 'Nộp thử nghiệm (Mô phỏng)' : 'Nộp hồ sơ ứng tuyển'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
