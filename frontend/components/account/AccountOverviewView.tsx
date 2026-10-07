'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  FilePlus,
  Search,
  Sparkles,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

export default function AccountOverviewView() {
  const [isJobSeeking, setIsJobSeeking] = useState(false);
  const [isJobRecommendation, setIsJobRecommendation] = useState(true);
  const [allowRecruiterSearch, setAllowRecruiterSearch] = useState(false);

  return (
    <div className="space-y-6">
      {/* =========================================================================
          KHỐI 1: CHÀO MỪNG & TRẠNG THÁI TÀI KHOẢN
          ========================================================================= */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="from-primary shadow-primary/25 relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-tr to-[#00d660] text-2xl font-black text-white shadow-md">
              <span>AL</span>
              <span className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white">
                <CheckCircle2 className="text-primary h-4 w-4" />
              </span>
            </div>

            <div>
              <p className="text-[13px] font-medium text-[#64748b]">Chào bạn trở lại,</p>
              <h1 className="text-navy text-xl font-black sm:text-2xl">An Lâm Hoàng</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11.5px] font-bold text-[#00873c]">
                  <UserCheck className="text-primary h-3.5 w-3.5" />
                  <span>Tài khoản đã xác thực</span>
                </span>
                <span className="text-[12px] text-[#94a3b8]">•</span>
                <span className="text-[12px] text-[#64748b]">ID: #IV-88219</span>
              </div>
            </div>
          </div>

          <Link
            href="/profile"
            className="border-primary text-primary inline-flex items-center justify-center gap-2 rounded-full border bg-white px-5 py-2 text-[13.5px] font-bold shadow-2xs transition-all hover:bg-emerald-50 active:scale-[0.99]"
          >
            <span>Xem Profile của bạn</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* =========================================================================
          KHỐI 2: TRẠNG THÁI TÌM VIỆC & GỢI Ý VIỆC LÀM
          ========================================================================= */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-7">
        <div className="space-y-6">
          {/* Gợi ý việc làm */}
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-5">
            <div className="flex items-start gap-3.5">
              <div className="text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-navy text-[15px] font-bold">Gợi ý việc làm</h3>
                <p className="mt-0.5 text-[13px] text-[#64748b]">
                  Nhận các công việc phù hợp với kỹ năng và mức lương kỳ vọng của bạn qua thông báo.
                </p>
              </div>
            </div>

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isJobRecommendation}
                onChange={(e) => setIsJobRecommendation(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer peer-checked:bg-primary h-6 w-11 rounded-full bg-[#cbd5e1] peer-focus:outline-none after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
              <span className="text-navy ml-3 hidden text-[13px] font-semibold sm:inline">
                {isJobRecommendation ? 'Bật gợi ý' : 'Tắt gợi ý'}
              </span>
            </label>
          </div>

          {/* Bật / Tắt tìm việc */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3.5">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    isJobSeeking ? 'text-primary bg-emerald-50' : 'bg-gray-100 text-[#64748b]'
                  }`}
                >
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-navy text-[15px] font-bold">Trạng thái tìm việc</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${
                        isJobSeeking ? 'bg-emerald-100 text-[#00873c]' : 'bg-gray-100 text-[#64748b]'
                      }`}
                    >
                      {isJobSeeking ? 'Đang Bật tìm việc' : 'Đang Tắt tìm việc'}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] text-[#64748b]">
                    Chủ động tiếp cận các cơ hội việc làm từ những nhà tuyển dụng hàng đầu.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={isJobSeeking}
                  onChange={(e) => setIsJobSeeking(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer peer-checked:bg-primary h-6 w-11 rounded-full bg-[#cbd5e1] peer-focus:outline-none after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
              </label>
            </div>

            {/* Hộp giải thích chi tiết khi bật tìm việc */}
            <div className="text-navy mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-[13px] leading-relaxed">
              <div className="font-bold text-[#00873c]">Khi bật tìm việc:</div>
              <ul className="mt-2 space-y-1.5 text-[#475569]">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    Nhà tuyển dụng (NTD) có thể tìm thấy và mang đến cho bạn những cơ hội hấp dẫn (Xem thêm tại phần{' '}
                    <strong>Cho phép NTD tìm kiếm bên dưới</strong>).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Hồ sơ của bạn sẽ hiển thị nổi bật trên kết quả tìm kiếm của Nhà tuyển dụng.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          KHỐI 3: CHO PHÉP NTD TÌM KIẾM HỒ SƠ
          ========================================================================= */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-navy text-[16px] font-bold">Cho phép NTD tìm kiếm hồ sơ</h2>
              <p className="mt-1 text-[13px] text-[#64748b]">
                Khi bạn cho phép Nhà tuyển dụng (NTD) tìm kiếm hồ sơ, các NTD uy tín có thể tiếp cận thông tin kinh
                nghiệm làm việc, học vấn, kỹ năng... trên CV của bạn.{' '}
                <Link href="/profile" className="text-primary font-semibold hover:underline">
                  Tìm hiểu thêm
                </Link>
              </p>
            </div>
          </div>

          <label className="relative inline-flex shrink-0 cursor-pointer items-center">
            <input
              type="checkbox"
              checked={allowRecruiterSearch}
              onChange={(e) => setAllowRecruiterSearch(e.target.checked)}
              className="peer sr-only"
            />
            <div className="peer peer-checked:bg-primary h-6 w-11 rounded-full bg-[#cbd5e1] peer-focus:outline-none after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
          </label>
        </div>

        {/* Cảnh báo chưa có CV */}
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="text-navy text-[13.5px] font-bold">Bạn chưa có CV nào trên hệ thống</p>
                <p className="mt-0.5 text-[12.5px] text-[#64748b]">
                  Tạo CV ngay để bắt đầu nhận lời mời kết nối từ các Nhà tuyển dụng uy tín.
                </p>
              </div>
            </div>

            <Link
              href="/profile"
              className="bg-primary hover:bg-primary-hover inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2 text-[13px] font-bold text-white shadow-xs transition-colors"
            >
              <FilePlus className="h-4 w-4" />
              <span>Tạo CV ngay</span>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          KHỐI 4: THỐNG KÊ LƯỢT NTD QUAN TÂM ĐẾN HỒ SƠ
          ========================================================================= */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-primary h-5 w-5" />
              <h2 className="text-navy text-[16px] font-bold">
                CV của bạn đã đủ tốt? Bao nhiêu NTD đang quan tâm tới Hồ sơ của bạn?
              </h2>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-[#64748b]">
              Mỗi lượt Nhà tuyển dụng xem CV mang đến một cơ hội để bạn gần hơn với công việc phù hợp. Nâng cấp chất
              lượng hồ sơ với các công cụ AI của InterVue để tăng đến 300% lượt quan tâm.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/profile"
                className="text-primary inline-flex items-center gap-1.5 text-[13px] font-bold hover:underline"
              >
                <span>Tối ưu hóa điểm chuẩn ATS</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <span className="text-[#cbd5e1]">•</span>
              <Link
                href="/profile"
                className="text-primary inline-flex items-center gap-1.5 text-[13px] font-bold hover:underline"
              >
                <span>Luyện phỏng vấn giả lập AI (STAR)</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Metric Box */}
          <div className="flex items-center justify-center rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-6 text-center lg:min-w-50">
            <div>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-navy text-4xl font-black sm:text-5xl">0</span>
                <span className="text-base font-bold text-[#64748b]">lượt</span>
              </div>
              <p className="mt-1 text-[12px] font-medium text-[#94a3b8]">Lượt xem trong 30 ngày qua</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
