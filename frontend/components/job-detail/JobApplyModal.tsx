'use client';

import { useState } from 'react';
import { X, Send, FileText, Upload, Sparkles, CheckCircle2, Bot, Check } from 'lucide-react';
import type { JobDetail } from '@/types/job';

interface JobApplyModalProps {
  job: JobDetail;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobApplyModal({ job, isOpen, onClose }: JobApplyModalProps) {
  const [selectedCv, setSelectedCv] = useState<'profile' | 'upload'>('profile');
  const [fullName, setFullName] = useState('Lê Minh Trí');
  const [email, setEmail] = useState('minhtri.le@gmail.com');
  const [phone, setPhone] = useState('0912 345 678');
  const [coverLetter, setCoverLetter] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGenerateAiCoverLetter = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setCoverLetter(
        `Kính gửi Bộ phận Tuyển dụng ${job.company.name},\n\nTôi viết thư này để bày tỏ sự quan tâm sâu sắc tới vị trí ${job.title} tại Quý công ty. Với hơn 5 năm kinh nghiệm thực chiến trong công tác kế toán tổng hợp, quyết toán thuế và lập báo cáo tài chính doanh nghiệp, tôi tự tin có thể đáp ứng xuất sắc các tiêu chuẩn công việc được đề ra trong JD.\n\nTôi thành thạo các phần mềm kế toán chuyên dụng, có tư duy phân tích số liệu sắc bén và tinh thần trách nhiệm cao. Rất mong có cơ hội được trao đổi trực tiếp cùng Quý công ty trong buổi phỏng vấn sắp tới.\n\nTrân trọng cảm ơn!`,
      );
      setIsGeneratingAi(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs duration-200">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 sm:text-lg">Ứng tuyển việc làm</h3>
            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
              {job.title} - {job.company.name}
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSubmitted ? (
          /* SUCCESS STATE */
          <div className="space-y-4 p-8 text-center">
            <div className="animate-in zoom-in mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[#00b14f]">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h4 className="text-xl font-bold text-slate-900">Nộp hồ sơ ứng tuyển thành công!</h4>

            <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-600">
              Hồ sơ của bạn đã được chuyển thẳng tới phòng nhân sự của{' '}
              <strong className="text-slate-800">{job.company.name}</strong>. Nhà tuyển dụng sẽ xem xét và phản hồi
              trong 24-48 giờ làm việc.
            </p>

            <div className="mx-auto max-w-md rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-left text-xs text-slate-700">
              <div className="mb-1 flex items-center gap-1.5 font-bold text-emerald-900">
                <Sparkles className="h-4 w-4 text-[#00b14f]" />
                <span>Gợi ý cho bạn:</span>
              </div>
              <div>
                Trong lúc chờ đợi kết quả, bạn có thể tham gia <strong>Phòng luyện phỏng vấn AI</strong> của InterVue để
                chuẩn bị câu trả lời cho vị trí này!
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="cursor-pointer rounded-xl bg-[#00b14f] px-6 py-2.5 text-sm font-bold text-white shadow-xs transition-all hover:bg-[#009643]"
              >
                Hoàn tất & Đóng
              </button>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            {/* ATS Match banner */}
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-linear-to-r from-emerald-50 to-teal-50 px-4 py-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#00b14f]" />
                <span className="font-medium text-slate-700">Độ tương thích hồ sơ với vị trí:</span>
              </div>
              <span className="rounded-full border border-emerald-200 bg-white px-2 py-0.5 font-extrabold text-[#00873c]">
                {job.atsMatchScore}% Rất phù hợp
              </span>
            </div>

            {/* Choose CV */}
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                Chọn CV ứng tuyển <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* CV đã có */}
                <div
                  onClick={() => setSelectedCv('profile')}
                  className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                    selectedCv === 'profile'
                      ? 'border-[#00b14f] bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#00b14f]" />
                      <span className="text-xs font-bold text-slate-800">CV Kế toán trưởng ATS</span>
                    </div>
                    {selectedCv === 'profile' && <Check className="h-4 w-4 text-[#00b14f]" />}
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500">Cập nhật 2 ngày trước • Chuẩn ATS 92 điểm</p>
                </div>

                {/* Tải CV mới */}
                <div
                  onClick={() => setSelectedCv('upload')}
                  className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                    selectedCv === 'upload'
                      ? 'border-[#00b14f] bg-emerald-50/50 shadow-xs'
                      : 'border-dashed border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-slate-500" />
                      <span className="text-xs font-bold text-slate-800">Tải lên CV mới</span>
                    </div>
                    {selectedCv === 'upload' && <Check className="h-4 w-4 text-[#00b14f]" />}
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500">Hỗ trợ file PDF, DOCX (tối đa 5MB)</p>
                </div>
              </div>
            </div>

            {/* Candidate Info Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Email liên hệ <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none"
                />
              </div>
            </div>

            {/* Cover letter with AI Generator */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Thư giới thiệu (Cover Letter)</label>

                <button
                  type="button"
                  onClick={handleGenerateAiCoverLetter}
                  disabled={isGeneratingAi}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11.5px] font-bold text-[#00b14f] transition-colors hover:bg-emerald-100"
                >
                  <Bot className="h-3.5 w-3.5" />
                  <span>{isGeneratingAi ? 'Đang tạo thư...' : '✨ Viết nhanh bằng AI'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Giới thiệu ngắn gọn kinh nghiệm, kỹ năng nổi bật và lý do bạn phù hợp với vị trí này..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-none"
              />
            </div>

            {/* Terms notice */}
            <div className="text-[11.5px] leading-relaxed text-slate-500">
              Bằng việc nhấn &quot;Nộp hồ sơ ứng tuyển&quot;, bạn đồng ý với Điều khoản dịch vụ và Chính sách quyền
              riêng tư của InterVue.
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r from-[#00b14f] to-[#009643] px-6 py-2.5 text-xs font-extrabold text-white shadow-xs transition-all hover:bg-[#009643] hover:shadow-md disabled:opacity-60"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? 'Đang gửi hồ sơ...' : 'Nộp hồ sơ ứng tuyển'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
