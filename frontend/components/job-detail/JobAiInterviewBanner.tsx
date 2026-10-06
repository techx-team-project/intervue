'use client';

import { useState } from 'react';
import { Sparkles, Bot, CheckCircle2, ArrowRight } from 'lucide-react';

interface JobAiInterviewBannerProps {
  jobTitle: string;
}

export default function JobAiInterviewBanner({ jobTitle }: JobAiInterviewBannerProps) {
  const [started, setStarted] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-linear-to-br from-slate-900 via-[#132d22] to-slate-900 p-6 text-white shadow-lg sm:p-7">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#00b14f]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-teal-500/20 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-emerald-300" />
            <span>Tính năng độc quyền InterVue AI</span>
          </div>

          <h3 className="mt-3 text-lg font-black tracking-tight text-white sm:text-xl">
            Luyện phỏng vấn AI cho vị trí <span className="text-emerald-400">{jobTitle}</span>
          </h3>

          <p className="mt-2 text-[13.5px] leading-relaxed text-slate-300">
            AI trích xuất yêu cầu công việc từ bản JD này để tạo phòng phỏng vấn giả lập 1:1. Giúp bạn tự tin trả lời
            lưu loát mọi câu hỏi hóc búa của nhà tuyển dụng và nhận đánh giá tức thì.
          </p>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Chấm điểm tư duy nghiệp vụ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Gợi ý cách trả lời ghi điểm</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>100% bảo mật thông tin</span>
            </div>
          </div>
        </div>

        {/* Action card */}
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#00b14f] px-6 py-3.5 text-[14.5px] font-extrabold text-white shadow-md shadow-[#00b14f]/40 transition-all hover:bg-[#00c957] hover:shadow-lg active:scale-95"
          >
            <Bot className="h-5 w-5" />
            <span>{started ? 'Đang mở phòng AI...' : 'Luyện phỏng vấn ngay'}</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-[11.5px] text-slate-300 backdrop-blur-xs">
            <span className="font-semibold text-emerald-300">💡 Câu hỏi mẫu:</span> &ldquo;Khi kiểm tra hóa đơn thuế bị
            sai lệch số liệu so với sổ sách, bạn sẽ xử lý thế nào?&rdquo;
          </div>
        </div>
      </div>
    </div>
  );
}
