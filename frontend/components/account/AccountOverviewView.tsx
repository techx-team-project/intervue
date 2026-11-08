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
      <div className="border-outline-variant rounded-2xl border bg-white p-6 shadow-xs sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="shadow-primary/25 bg-primary shadow-elevation-1 relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white">
              <span>AL</span>
              <span className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white">
                <CheckCircle2 className="text-primary h-4 w-4" />
              </span>
            </div>

            <div>
              <p className="text-body-md text-on-surface-variant font-medium">Chào bạn trở lại,</p>
              <h1 className="text-navy text-xl font-bold sm:text-2xl">An Lâm Hoàng</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="border-primary/30 bg-primary-light text-label-sm text-primary inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-bold">
                  <UserCheck className="text-primary h-3.5 w-3.5" />
                  <span>Tài khoản đã xác thực</span>
                </span>
                <span className="text-body-sm text-outline">•</span>
                <span className="text-body-sm text-on-surface-variant">ID: #IV-88219</span>
              </div>
            </div>
          </div>

          <Link
            href="/profile"
            className="border-primary text-primary text-body-md hover:bg-primary-light inline-flex items-center justify-center gap-2 rounded-full border bg-white px-5 py-2 font-bold shadow-2xs transition active:scale-[0.99]"
          >
            <span>Xem Profile của bạn</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="border-outline-variant rounded-2xl border bg-white p-6 shadow-xs sm:p-7">
        <div className="space-y-6">
          <div className="border-outline-variant flex items-center justify-between border-b pb-5">
            <div className="flex items-start gap-3.5">
              <div className="text-primary bg-primary-light flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-navy text-body-lg font-bold">Gợi ý việc làm</h3>
                <p className="text-body-md text-on-surface-variant mt-0.5">
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
              <span className="text-navy text-body-md ml-3 hidden font-semibold sm:inline">
                {isJobRecommendation ? 'Bật gợi ý' : 'Tắt gợi ý'}
              </span>
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3.5">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    isJobSeeking ? 'text-primary bg-primary-light' : 'text-on-surface-variant bg-gray-100'
                  }`}
                >
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-navy text-body-lg font-bold">Trạng thái tìm việc</h3>
                    <span
                      className={`text-label-sm rounded-full px-2.5 py-0.5 font-bold ${
                        isJobSeeking ? 'bg-primary-container text-primary' : 'text-on-surface-variant bg-gray-100'
                      }`}
                    >
                      {isJobSeeking ? 'Đang Bật tìm việc' : 'Đang Tắt tìm việc'}
                    </span>
                  </div>
                  <p className="text-body-md text-on-surface-variant mt-0.5">
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

            <div className="text-navy text-body-md mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 leading-relaxed">
              <div className="text-primary font-bold">Khi bật tìm việc:</div>
              <ul className="text-on-surface-variant mt-2 space-y-1.5">
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

      <div className="border-outline-variant rounded-2xl border bg-white p-6 shadow-xs sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="bg-primary-light text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-navy text-body-lg font-bold">Cho phép NTD tìm kiếm hồ sơ</h2>
              <p className="text-body-md text-on-surface-variant mt-1">
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

        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="text-navy text-body-md font-bold">Bạn chưa có CV nào trên hệ thống</p>
                <p className="text-body-sm text-on-surface-variant mt-0.5">
                  Tạo CV ngay để bắt đầu nhận lời mời kết nối từ các Nhà tuyển dụng uy tín.
                </p>
              </div>
            </div>

            <Link
              href="/profile"
              className="bg-primary hover:bg-primary-hover text-body-md inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2 font-bold text-white shadow-xs transition-colors"
            >
              <FilePlus className="h-4 w-4" />
              <span>Tạo CV ngay</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-outline-variant rounded-2xl border bg-white p-6 shadow-xs sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-primary h-5 w-5" />
              <h2 className="text-navy text-body-lg font-bold">
                CV của bạn đã đủ tốt? Bao nhiêu NTD đang quan tâm tới Hồ sơ của bạn?
              </h2>
            </div>
            <p className="text-body-md text-on-surface-variant mt-2 leading-relaxed">
              Mỗi lượt Nhà tuyển dụng xem CV mang đến một cơ hội để bạn gần hơn với công việc phù hợp. Nâng cấp chất
              lượng hồ sơ với các công cụ AI của InterVue để tăng đến 300% lượt quan tâm.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/profile"
                className="text-primary text-body-md inline-flex items-center gap-1.5 font-bold hover:underline"
              >
                <span>Tối ưu hóa điểm chuẩn ATS</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <span className="text-outline">•</span>
              <Link
                href="/profile"
                className="text-primary text-body-md inline-flex items-center gap-1.5 font-bold hover:underline"
              >
                <span>Luyện phỏng vấn giả lập AI (STAR)</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="border-outline-variant bg-surface-container-low flex items-center justify-center rounded-2xl border p-6 text-center lg:min-w-50">
            <div>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-navy text-4xl font-bold sm:text-5xl">0</span>
                <span className="text-on-surface-variant text-base font-bold">lượt</span>
              </div>
              <p className="text-body-sm text-outline mt-1 font-medium">Lượt xem trong 30 ngày qua</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
