'use client';

import { useState } from 'react';
import { Sparkles, Bot, CheckCircle2, ArrowRight } from 'lucide-react';

interface JobAiInterviewBannerProps {
  jobTitle: string;
}

export default function JobAiInterviewBanner({ jobTitle }: JobAiInterviewBannerProps) {
  const [started, setStarted] = useState(false);

  return (
    <div className="border-primary/30 bg-primary-deeper shadow-elevation-2 relative overflow-hidden rounded-2xl border p-6 text-white sm:p-7">
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <div className="text-primary-bright inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-xs font-bold">
            <Sparkles className="text-primary-bright h-3.5 w-3.5" />
            <span>Tính năng độc quyền InterVue AI</span>
          </div>

          <h3 className="mt-3 text-lg font-bold tracking-tight text-white sm:text-xl">
            Luyện phỏng vấn AI cho vị trí <span className="text-primary-bright">{jobTitle}</span>
          </h3>

          <p className="text-body-md text-outline mt-2 leading-relaxed">
            AI trích xuất yêu cầu công việc từ bản JD này để tạo phòng phỏng vấn giả lập 1:1. Giúp bạn tự tin trả lời
            lưu loát mọi câu hỏi hóc búa của nhà tuyển dụng và nhận đánh giá tức thì.
          </p>

          <div className="text-outline mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="text-primary-bright h-4 w-4" />
              <span>Chấm điểm tư duy nghiệp vụ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="text-primary-bright h-4 w-4" />
              <span>Gợi ý cách trả lời ghi điểm</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="text-primary-bright h-4 w-4" />
              <span>100% bảo mật thông tin</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="bg-primary shadow-primary/40 text-body-md shadow-elevation-1 hover:shadow-elevation-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-extrabold text-white transition hover:bg-[#00c957] active:scale-95"
          >
            <Bot className="h-5 w-5" />
            <span>{started ? 'Đang mở phòng AI...' : 'Luyện phỏng vấn ngay'}</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>

          <div className="text-label-sm text-outline rounded-xl border border-white/10 bg-white/5 p-3">
            <span className="text-primary-bright font-semibold">💡 Câu hỏi mẫu:</span> &ldquo;Khi kiểm tra hóa đơn thuế
            bị sai lệch số liệu so với sổ sách, bạn sẽ xử lý thế nào?&rdquo;
          </div>
        </div>
      </div>
    </div>
  );
}
