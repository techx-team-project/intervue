'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, FileCheck, ShieldCheck, Sparkles, DownloadCloud } from 'lucide-react';

export default function CvHeroBanner() {
  return (
    <div className="from-primary/10 relative overflow-hidden border-b border-gray-200 bg-linear-to-b via-[#f4fbf7] to-white py-10 lg:py-14">
      {/* Background ambient blurs */}
      <div className="bg-primary/15 pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-[#7f878f]">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/cv-templates" className="hover:text-primary transition-colors">
            Mẫu CV theo style
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary font-semibold">Mẫu CV xin việc tiếng Việt Đơn giản chuẩn 2026</span>
        </nav>

        {/* Hero Content */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="max-w-3xl lg:col-span-8">
            <div className="bg-primary/10 text-primary mb-3 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Thư Viện CV Chuẩn Hóa ATS Tuyển Chọn</span>
            </div>

            <h1 className="text-3xl leading-tight font-black tracking-tight text-[#171717] sm:text-4xl lg:text-5xl">
              Mẫu CV xin việc tiếng Việt <span className="text-primary">Đơn giản</span> chuẩn 2026
            </h1>

            <p className="mt-3 text-base leading-relaxed text-[#526475] sm:text-lg">
              Tuyển chọn các mẫu CV tiếng Việt có thiết kế đơn giản, ưu tiên tính dễ đọc và tối ưu hóa bộ lọc ATS. Dành
              cho ứng viên muốn tập trung vào khả năng truyền tải thông tin đầy đủ, rõ ràng và làm nổi bật thành tựu ấn
              tượng tới nhà tuyển dụng.
            </p>

            {/* Badges row */}
            <div className="text-navy mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 shadow-xs">
                <ShieldCheck className="text-primary h-4 w-4" />
                <span>100% Vượt bộ lọc ATS</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 shadow-xs">
                <FileCheck className="h-4 w-4 text-blue-600" />
                <span>Định dạng A4 chuẩn quốc tế</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 shadow-xs">
                <DownloadCloud className="h-4 w-4 text-purple-600" />
                <span>Xuất file PDF miễn phí</span>
              </div>
            </div>
          </div>

          {/* Right Banner Showcase Visual */}
          <div className="hidden justify-end lg:col-span-4 lg:flex">
            <div className="relative max-w-sm rounded-3xl border border-emerald-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-md">
              <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="text-primary flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#171717]">Tạo CV Chuyên Nghiệp</h3>
                  <p className="text-xs text-[#7f878f]">Chỉ mất 3 phút với InterVue</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-[#526475]">
                <div className="flex items-center justify-between">
                  <span>Mẫu CV sẵn có:</span>
                  <span className="font-bold text-[#171717]">21+ Mẫu</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Lượt ứng viên sử dụng:</span>
                  <span className="text-primary font-bold">850.000+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tỉ lệ gọi phỏng vấn:</span>
                  <span className="font-bold text-emerald-600">+42% so với CV thường</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
