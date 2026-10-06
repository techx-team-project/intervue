'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CareerTrendingIndustry } from '@/types/career';
import { TrendingUp, FileText, Brain, Calculator, Bot, Mail, CheckCircle2, ChevronRight } from 'lucide-react';

interface CareerSidebarProps {
  trendingIndustries: CareerTrendingIndustry[];
}

export default function CareerSidebar({ trendingIndustries }: CareerSidebarProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
    }
  };

  return (
    <aside className="space-y-6">
      {/* 1. Trending Industries with Salary */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-[#00b14f]">
            <TrendingUp className="h-4 w-4" />
          </div>
          <h3 className="text-base font-bold text-[#171717]">Top ngành nghề khát nhân lực 2026</h3>
        </div>

        <div className="space-y-3">
          {trendingIndustries.map((item, idx) => (
            <Link
              key={item.id}
              href={`/career-orientation/${item.slug}`}
              className="group flex items-center justify-between rounded-xl border border-transparent p-2.5 transition hover:border-[#00b14f]/30 hover:bg-[#f2fbf6]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-[#526475] transition-colors group-hover:bg-[#00b14f] group-hover:text-white">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-[#171717] transition-colors group-hover:text-[#00b14f] sm:text-sm">
                    {item.name}
                  </h4>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#7f878f]">
                    <span className="font-semibold text-[#00b14f]">{item.avgSalary}</span>
                    <span>•</span>
                    <span>{item.jobCount} việc làm</span>
                  </div>
                </div>
              </div>

              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-[#00b14f]">
                {item.demandRate}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. InterVue Career Tools */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs">
        <h3 className="mb-1 text-base font-bold text-[#171717]">Bộ công cụ phát triển sự nghiệp</h3>
        <p className="mb-4 text-xs text-[#7f878f]">Trang bị hành trang chuẩn bị phỏng vấn và thăng tiến</p>

        <div className="space-y-2.5">
          <Link
            href="/candidate/profile"
            className="group flex items-center justify-between rounded-xl border border-gray-100 bg-[#fafafa] p-3 transition hover:border-[#00b14f] hover:bg-[#f2fbf6]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-[#00b14f]">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#171717] transition-colors group-hover:text-[#00b14f] sm:text-sm">
                  Tạo CV Chuẩn ATS
                </p>
                <p className="text-[11px] text-[#7f878f]">Mẫu CV chuyên nghiệp tối ưu điểm số</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#9ca3af] transition-colors group-hover:text-[#00b14f]" />
          </Link>

          <Link
            href="#self-growth"
            className="group flex items-center justify-between rounded-xl border border-gray-100 bg-[#fafafa] p-3 transition hover:border-[#00b14f] hover:bg-[#f2fbf6]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Brain className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#171717] transition-colors group-hover:text-blue-600 sm:text-sm">
                  Trắc nghiệm tính cách MBTI
                </p>
                <p className="text-[11px] text-[#7f878f]">Khám phá 16 nhóm tính cách & nghề phù hợp</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#9ca3af] transition-colors group-hover:text-blue-600" />
          </Link>

          <Link
            href="#salary-calculator"
            className="group flex items-center justify-between rounded-xl border border-gray-100 bg-[#fafafa] p-3 transition hover:border-[#00b14f] hover:bg-[#f2fbf6]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Calculator className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#171717] transition-colors group-hover:text-purple-600 sm:text-sm">
                  Tính lương Gross sang Net
                </p>
                <p className="text-[11px] text-[#7f878f]">Cập nhật biểu thuế TNCN & BHXH mới nhất</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#9ca3af] transition-colors group-hover:text-purple-600" />
          </Link>

          <Link
            href="/jobs"
            className="group flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 transition hover:bg-[#f2fbf6]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00b14f] text-white">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#00b14f] sm:text-sm">Luyện phỏng vấn với AI</p>
                <p className="text-[11px] text-[#526475]">Mô phỏng phỏng vấn thực tế 1-1</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#00b14f]" />
          </Link>
        </div>
      </div>

      {/* 3. Newsletter Subscription */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-[#f2fbf6] to-white p-5 shadow-xs">
        <div className="mb-2 flex items-center gap-2">
          <Mail className="h-5 w-5 text-[#00b14f]" />
          <h3 className="text-sm font-bold text-[#171717]">Nhận bản tin định hướng nghề nghiệp</h3>
        </div>
        <p className="mb-3 text-xs leading-relaxed text-[#526475]">
          Đăng ký để nhận báo cáo lương định kỳ và cẩm nang thăng tiến độc quyền mỗi tuần.
        </p>

        {!isSubscribed ? (
          <form onSubmit={handleSubscribe} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn..."
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-[#171717] placeholder:text-gray-400 focus:border-[#00b14f] focus:ring-1 focus:ring-[#00b14f] focus:outline-hidden"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-[#00b14f] py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#009b44]"
            >
              Đăng ký ngay
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-100/60 p-3 text-xs font-semibold text-[#00b14f]">
            <CheckCircle2 className="h-4 w-4" />
            <span>Cảm ơn bạn đã đăng ký nhận tin!</span>
          </div>
        )}
      </div>
    </aside>
  );
}
