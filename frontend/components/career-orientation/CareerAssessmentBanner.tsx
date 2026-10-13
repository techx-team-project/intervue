'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

interface QuestionStep {
  id: number;
  question: string;
  options: {
    label: string;
    sublabel: string;
    recommendedField: string;
    slug: string;
  }[];
}

const QUIZ_STEPS: QuestionStep[] = [
  {
    id: 1,
    question: '1. Mục tiêu thu nhập và phong cách công việc ưu tiên của bạn?',
    options: [
      {
        label: 'Thu nhập đột phá theo năng lực, hoa hồng không giới hạn',
        sublabel: 'Thích giao tiếp, thương lượng, chịu được áp lực KPI',
        recommendedField: 'Nghề Sales & Phát triển kinh doanh',
        slug: 'nhan-vien-sales-la-gi',
      },
      {
        label: 'Thỏa sức sáng tạo, xây dựng thương hiệu & bắt trend số',
        sublabel: 'Yêu thích nội dung, mạng xã hội, phân tích hành vi khách hàng',
        recommendedField: 'Ngành Marketing & Truyền thông số',
        slug: 'nganh-marketing-la-gi-cac-vi-tri-trong-nganh-marketing',
      },
      {
        label: 'Tư duy logic, giải quyết bài toán kỹ thuật & công nghệ',
        sublabel: 'Thích lập trình, thuật toán, AI và tối ưu hóa hệ thống',
        recommendedField: 'Ngành Công nghệ thông tin (IT / AI)',
        slug: 'nganh-cong-nghe-thong-tin-it-la-gi',
      },
      {
        label: 'Tổ chức quy trình, điều phối chuỗi cung ứng & xuất nhập khẩu',
        sublabel: 'Thích làm việc thực tế, giao vận hàng hóa toàn cầu',
        recommendedField: 'Ngành Logistics & Chuỗi cung ứng',
        slug: 'logistics-la-gi',
      },
    ],
  },
  {
    id: 2,
    question: '2. Môi trường làm việc lý tưởng kích hoạt tối đa năng lượng của bạn?',
    options: [
      {
        label: 'Năng động, đa dạng dự án, thử thách liên tục (Agency / Tech)',
        sublabel: 'Học hỏi siêu tốc, tiếp xúc nhiều khách hàng lớn',
        recommendedField: 'Digital Marketing & Performance',
        slug: 'nganh-marketing-la-gi-cac-vi-tri-trong-nganh-marketing',
      },
      {
        label: 'Chuyên nghiệp, đãi ngộ vững vàng, thăng tiến rõ ràng (Tập đoàn)',
        sublabel: 'Quy trình chuẩn chỉnh, phúc lợi cao, mạng lưới đối tác lớn',
        recommendedField: 'Brand Marketing & Quản trị doanh nghiệp',
        slug: 'nganh-marketing-la-gi-cac-vi-tri-trong-nganh-marketing',
      },
      {
        label: 'Linh hoạt, hybrid/remote, chú trọng năng lực thực chiến',
        sublabel: 'Tự do quản lý thời gian, đánh giá theo kết quả đầu ra',
        recommendedField: 'Software Engineering / AI Solutions',
        slug: 'nganh-cong-nghe-thong-tin-it-la-gi',
      },
      {
        label: 'Thực chiến thị trường, thường xuyên mở rộng quan hệ đối ngoại',
        sublabel: 'Gặp gỡ chủ doanh nghiệp, mở rộng tầm ảnh hưởng cá nhân',
        recommendedField: 'B2B Key Account Sales & BD',
        slug: 'nhan-vien-sales-la-gi',
      },
    ],
  },
];

export default function CareerAssessmentBanner() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentStep] = optionIndex;
    setSelectedAnswers(updated);

    if (currentStep < QUIZ_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setIsCompleted(false);
  };

  const currentQuestion = QUIZ_STEPS[currentStep];
  const finalRecommendation = QUIZ_STEPS[0].options[selectedAnswers[0] || 0];

  return (
    <div className="border-primary/30 relative my-8 overflow-hidden rounded-3xl border bg-linear-to-br from-[#023319] via-[#0b4d29] to-[#042413] text-white shadow-xl">
      {/* Decorative background glows */}
      <div className="bg-primary/30 pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Trắc nghiệm nhanh 60 giây</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Khám phá cơ hội nghề nghiệp phù hợp nhất với bạn
            </h3>
            <p className="mt-1 text-xs text-emerald-100/80 sm:text-sm">
              Trả lời 2 câu hỏi ngắn để InterVue gợi ý ngành nghề và lộ trình thăng tiến tối ưu với tính cách của bạn.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-emerald-200">
            <span>Tiến độ:</span>
            <div className="flex items-center gap-1.5">
              {QUIZ_STEPS.map((step, idx) => (
                <div
                  key={step.id}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCompleted || idx <= currentStep ? 'bg-primary w-8' : 'w-4 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quiz Body */}
        {!isCompleted ? (
          <div>
            <h4 className="mb-4 text-base font-semibold text-emerald-100 sm:text-lg">{currentQuestion.question}</h4>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className="group hover:border-primary flex flex-col rounded-2xl border border-white/15 bg-white/10 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-white transition-colors group-hover:text-emerald-300">
                      {opt.label}
                    </span>
                    <span className="group-hover:border-primary group-hover:bg-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/30 text-white">
                      <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                  </div>
                  <span className="mt-2 text-xs text-emerald-100/70">{opt.sublabel}</span>
                </button>
              ))}
            </div>

            {currentStep > 0 && (
              <div className="mt-4 flex justify-start">
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-xs text-emerald-200/80 underline hover:text-white"
                >
                  ← Quay lại câu hỏi trước
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Completion Result */
          <div className="rounded-2xl border border-emerald-400/30 bg-white/10 p-6 backdrop-blur-xs">
            <div className="mb-3 flex items-center gap-3 text-emerald-300">
              <CheckCircle2 className="text-primary h-6 w-6" />
              <span className="text-sm font-semibold tracking-wider uppercase">Kết quả định hướng dành cho bạn</span>
            </div>

            <h4 className="mb-2 text-xl font-bold text-white sm:text-2xl">
              Lĩnh vực phù hợp nhất: {finalRecommendation.recommendedField}
            </h4>
            <p className="mb-5 max-w-2xl text-sm leading-relaxed text-emerald-100/90">
              Dựa trên định hướng mục tiêu thu nhập và môi trường mong muốn, bạn có tiềm năng bứt phá cao nhất trong
              ngành này. Hãy đọc ngay bài phân tích lộ trình chi tiết và mức lương để nắm bắt cơ hội!
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/blog/dinh-huong-nghe-nghiep/${finalRecommendation.slug}`}
                className="bg-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#009b44] hover:shadow-emerald-500/20"
              >
                <span>Xem cẩm nang & lộ trình ngành</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Làm lại trắc nghiệm</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
