'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Square, RotateCcw, CheckCircle, FileText, ArrowRight } from 'lucide-react';

interface ChecklistItem {
  id: string;
  stage: 'before' | 'day_of' | 'during' | 'after';
  label: string;
  desc: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Before
  {
    id: 'res-company',
    stage: 'before',
    label: 'Nghiên cứu kỹ sản phẩm & văn hóa công ty',
    desc: 'Đọc website, fanpage, báo cáo tài chính/tin tức mới nhất trong 6 tháng qua.',
  },
  {
    id: 'res-star',
    stage: 'before',
    label: 'Chuẩn bị 3 câu chuyện thành tựu theo mô hình STAR',
    desc: 'Chọn 3 case study dự án nổi bật: Situation, Task, Action, Result có số liệu.',
  },
  {
    id: 'res-cv-print',
    stage: 'before',
    label: 'In sẵn 2 - 3 bản CV cứng + Portfolio',
    desc: 'Để trong bìa sơ mi phẳng phiu mang đến buổi phỏng vấn trực tiếp.',
  },
  {
    id: 'res-questions',
    stage: 'before',
    label: 'Chuẩn bị 3 - 5 câu hỏi thông minh hỏi lại nhà tuyển dụng',
    desc: 'Hỏi về mục tiêu 3 tháng đầu, thách thức của team hoặc văn hóa làm việc.',
  },
  // Day of
  {
    id: 'day-clothes',
    stage: 'day_of',
    label: 'Trang phục chỉn chu, lịch sự phù hợp văn hóa',
    desc: 'Áo sơ mi/blazer gọn gàng, kiểm tra tác phong đầu tóc chỉnh tề.',
  },
  {
    id: 'day-early',
    stage: 'day_of',
    label: 'Có mặt sớm trước giờ hẹn 10 - 15 phút',
    desc: 'Tránh kẹt xe, có thời gian thư giãn hít thở sâu và chỉnh trang lại.',
  },
  // During
  {
    id: 'dur-eye',
    stage: 'during',
    label: 'Duy trì giao tiếp ánh mắt & nụ cười tự tin',
    desc: 'Thân thiện, lắng nghe trọn vẹn câu hỏi của hội đồng trước khi trả lời.',
  },
  {
    id: 'dur-truth',
    stage: 'during',
    label: 'Thành thật và tích cực trong mọi câu trả lời',
    desc: 'Không nói dối kinh nghiệm, không nói xấu sếp hoặc công ty cũ.',
  },
  // After
  {
    id: 'aft-thanks',
    stage: 'after',
    label: 'Gửi Email cảm ơn (Thank-you note) trong vòng 24h',
    desc: 'Cảm ơn thời gian phỏng vấn và nhấn mạnh lại sự hào hứng với vị trí.',
  },
];

export default function InterviewPrepChecklist() {
  const [checkedIds, setCheckedIds] = useState<string[]>(['res-company', 'res-star']);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleReset = () => {
    setCheckedIds([]);
  };

  const completedCount = checkedIds.length;
  const totalCount = CHECKLIST_ITEMS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white shadow-xl">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-blue-900 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-200 ring-1 ring-blue-400/30">
                Interactive Checklist
              </span>
              <span className="text-xs text-blue-200">
                Đã chuẩn bị {completedCount}/{totalCount} mục
              </span>
            </div>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Checklist chuẩn bị phỏng vấn thành công
            </h3>
            <p className="mt-1 text-xs text-blue-100/80">
              Đánh dấu các mục đã sẵn sàng để đảm bảo bạn tự tin 100% trước nhà tuyển dụng.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 self-start rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-xs transition hover:bg-white/20 sm:self-center"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Làm lại checklist
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs font-medium text-blue-100">
            <span>Mức độ sẵn sàng</span>
            <span className="font-bold text-white">{progressPercent}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-blue-950/40">
            <div
              className="to-primary h-full bg-linear-to-r from-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Sections */}
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = checkedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`group flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-200 ${
                  isChecked
                    ? 'border-emerald-200 bg-emerald-50/50 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/20'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckCircle className="text-primary h-5 w-5" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-300 group-hover:text-blue-500" />
                  )}
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold transition ${
                      isChecked ? 'text-emerald-950 line-through opacity-85' : 'text-[#0f172a]'
                    }`}
                  >
                    {item.label}
                  </h4>
                  <p className="mt-1 text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Bottom Tool Callouts */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/40 p-4 sm:flex-row sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-blue-950">Chưa có bản CV chuẩn ATS?</h5>
              <p className="text-xs text-blue-800">Khám phá kho mẫu CV chuyên nghiệp được nhà tuyển dụng ưa chuộng</p>
            </div>
          </div>

          <Link
            href="/cv-templates"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-700"
          >
            Tạo CV xin việc ngay
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
