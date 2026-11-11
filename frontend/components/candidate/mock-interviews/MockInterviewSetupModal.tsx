'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useCandidateCvs } from '@/hooks/useCandidateCvs';
import { useStartMockInterview } from '@/hooks/useAiMockInterview';
import type { MockInterviewDetailResource, MockInterviewFocusArea } from '@/types/ai-mock-interview';
import { Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface MockInterviewSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionStarted: (session: MockInterviewDetailResource) => void;
}

const SENIORITY_OPTIONS = ['Intern', 'Fresher', 'Junior', 'Middle', 'Senior', 'Lead'];

const FOCUS_AREAS: { value: MockInterviewFocusArea; label: string; desc: string }[] = [
  { value: 'TECHNICAL', label: 'Kỹ thuật chuyên sâu', desc: 'Đào sâu thuật toán, ngôn ngữ, framework & tối ưu' },
  { value: 'SYSTEM_DESIGN', label: 'Thiết kế hệ thống', desc: 'Kiến trúc microservices, cơ sở dữ liệu & scaling' },
  { value: 'BEHAVIORAL', label: 'Tình huống (Behavioral)', desc: 'Xử lý xung đột, quản lý dự án & văn hóa nhóm' },
  { value: 'MIXED', label: 'Tổng hợp toàn diện', desc: 'Kết hợp kỹ thuật, tư duy kiến trúc và tình huống thực tế' },
];

export default function MockInterviewSetupModal({ isOpen, onClose, onSessionStarted }: MockInterviewSetupModalProps) {
  const { data: resumes } = useCandidateCvs(isOpen);
  const startMutation = useStartMockInterview();

  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [targetRole, setTargetRole] = useState('Senior Java Backend Engineer');
  const [seniorityLevel, setSeniorityLevel] = useState('Senior');
  const [focusArea, setFocusArea] = useState<MockInterviewFocusArea>('MIXED');
  const [questionCount, setQuestionCount] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole.trim()) {
      toast.error('Vui lòng nhập vị trí công việc mục tiêu');
      return;
    }

    try {
      const session = await startMutation.mutateAsync({
        resumeId: selectedResumeId,
        targetRole: targetRole.trim(),
        seniorityLevel,
        focusArea,
        questionCount,
      });
      toast.success('Đã khởi tạo buổi phỏng vấn thử thành công!');
      onClose();
      onSessionStarted(session);
    } catch {
      toast.error('Không thể bắt đầu buổi phỏng vấn. Vui lòng thử lại.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-navy font-bold">Thiết lập buổi phỏng vấn thử cùng AI</span>
        </div>
      }
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* CV Selection */}
        <div>
          <label className="text-navy mb-1.5 block text-xs font-bold">
            1. Chọn CV làm dữ liệu phỏng vấn (Tùy chọn):
          </label>
          <p className="mb-2 text-[11px] text-slate-500">
            AI sẽ đọc kinh nghiệm và kỹ năng trong CV để đặt câu hỏi sát thực tế nhất.
          </p>

          {resumes && resumes.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setSelectedResumeId(null)}
                className={`flex items-center justify-between rounded-xl border p-2.5 text-left text-xs transition-all ${
                  selectedResumeId === null
                    ? 'border-primary bg-primary/5 ring-primary ring-1'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="font-medium text-slate-700">Dùng hồ sơ tài khoản (Mặc định)</span>
                {selectedResumeId === null && <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />}
              </button>

              {resumes.map((cv) => (
                <button
                  key={cv.id}
                  type="button"
                  onClick={() => setSelectedResumeId(cv.id)}
                  className={`flex items-center justify-between rounded-xl border p-2.5 text-left text-xs transition-all ${
                    selectedResumeId === cv.id
                      ? 'border-primary bg-primary/5 ring-primary ring-1'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="text-navy truncate font-medium">{cv.fileName}</span>
                  </div>
                  {selectedResumeId === cv.id && <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Chưa có CV tải lên. AI sẽ phỏng vấn dựa trên mục tiêu bạn chọn.
            </p>
          )}
        </div>

        {/* Target Role & Level */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          <div className="sm:col-span-8">
            <label className="text-navy mb-1.5 block text-xs font-bold">2. Vị trí công việc mục tiêu:</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="VD: Senior Java Backend Developer"
              className="text-navy focus:border-primary w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none"
              required
            />
          </div>

          <div className="sm:col-span-4">
            <label className="text-navy mb-1.5 block text-xs font-bold">Cấp bậc:</label>
            <select
              value={seniorityLevel}
              onChange={(e) => setSeniorityLevel(e.target.value)}
              className="text-navy focus:border-primary w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none"
            >
              {SENIORITY_OPTIONS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Focus Area */}
        <div>
          <label className="text-navy mb-1.5 block text-xs font-bold">3. Định hướng trọng tâm buổi phỏng vấn:</label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {FOCUS_AREAS.map((fa) => (
              <button
                key={fa.value}
                type="button"
                onClick={() => setFocusArea(fa.value)}
                className={`flex flex-col rounded-xl border p-2.5 text-left transition-all ${
                  focusArea === fa.value
                    ? 'border-primary bg-primary/5 ring-primary ring-1'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-navy text-xs font-bold">{fa.label}</span>
                <span className="mt-0.5 text-[11px] text-slate-500">{fa.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question Count (5 - 10) */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-navy text-xs font-bold">4. Số lượng câu hỏi (5 - 10 câu):</label>
            <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-bold">
              {questionCount} câu hỏi
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setQuestionCount(num)}
                className={`flex-1 rounded-xl border py-2 text-xs font-bold transition-all ${
                  questionCount === num
                    ? 'border-primary bg-primary text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            * Mỗi câu hỏi có tối đa 1 câu hỏi đào sâu (follow-up) từ AI nếu câu trả lời cần làm rõ.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
          <Button variant="outline" type="button" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={startMutation.isPending}
            leftIcon={<Sparkles className="h-4 w-4" />}
          >
            Bắt đầu phỏng vấn ngay
          </Button>
        </div>
      </form>
    </Modal>
  );
}
