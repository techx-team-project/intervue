'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Search,
  Bookmark,
  Send,
  Sparkles,
  Building2,
  Award,
  FileText,
  FilePlus,
  Compass,
  Mail,
  Calculator,
  Percent,
  ShieldCheck,
  TrendingUp,
  Menu,
  X,
} from 'lucide-react';

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e9eaec] bg-white shadow-xs">
      <div className="flex h-17.5 w-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Left Side: Logo & Main Navigation */}
        <div className="flex items-center gap-6 lg:gap-8">
          {/* Logo InterVue */}
          <Link href="/" className="group flex shrink-0 items-center py-1">
            <img
              src="/intervue-logo.png"
              alt="InterVue - Tiếp lợi thế, Nối thành công"
              className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105 sm:h-11"
            />
          </Link>

          {/* Nav Items */}
          <nav className="hidden items-center gap-1 text-[14.5px] font-medium text-[#263a4d] lg:flex xl:gap-2">
            {/* 1. Việc làm */}
            <div
              className="group relative cursor-pointer py-5"
              onMouseEnter={() => setActiveDropdown('jobs')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:text-[#00b14f]">
                <span>Việc làm</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#7f878f] transition-transform group-hover:rotate-180 group-hover:text-[#00b14f]" />
              </div>

              {activeDropdown === 'jobs' && (
                <div className="animate-in fade-in absolute top-15 left-0 z-50 grid w-125 grid-cols-2 gap-4 rounded-2xl border border-[#e9eaec] bg-white p-5 shadow-2xl duration-150">
                  <div>
                    <div className="mb-2 px-2 text-[12px] font-bold tracking-wider text-[#7f878f] uppercase">
                      Tìm việc làm
                    </div>
                    <div className="space-y-1">
                      <Link
                        href="#feature-jobs"
                        className="flex items-center gap-2.5 rounded-lg p-2 text-[#263a4d] transition-colors hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                      >
                        <Search className="h-4 w-4 text-[#00b14f]" />
                        <span className="text-[14px]">Tìm việc làm mới nhất</span>
                      </Link>
                      <Link
                        href="#feature-jobs"
                        className="flex items-center gap-2.5 rounded-lg p-2 text-[#263a4d] transition-colors hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                      >
                        <Bookmark className="h-4 w-4 text-[#00b14f]" />
                        <span className="text-[14px]">Việc làm đã lưu</span>
                      </Link>
                      <Link
                        href="#feature-jobs"
                        className="flex items-center gap-2.5 rounded-lg p-2 text-[#263a4d] transition-colors hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                      >
                        <Send className="h-4 w-4 text-[#00b14f]" />
                        <span className="text-[14px]">Việc làm đã ứng tuyển</span>
                      </Link>
                      <Link
                        href="#feature-jobs"
                        className="flex items-center gap-2.5 rounded-lg p-2 text-[#263a4d] transition-colors hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                      >
                        <Sparkles className="h-4 w-4 text-[#00b14f]" />
                        <span className="text-[14px]">Việc làm phù hợp</span>
                      </Link>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 px-2 text-[12px] font-bold tracking-wider text-[#7f878f] uppercase">
                      Công ty
                    </div>
                    <div className="space-y-1">
                      <Link
                        href="#top-companies"
                        className="flex items-center gap-2.5 rounded-lg p-2 text-[#263a4d] transition-colors hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                      >
                        <Building2 className="h-4 w-4 text-[#263a4d]" />
                        <span className="text-[14px]">Danh sách công ty</span>
                      </Link>
                      <Link
                        href="#top-companies"
                        className="flex items-center gap-2.5 rounded-lg p-2 text-[#263a4d] transition-colors hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                      >
                        <Award className="h-4 w-4 text-[#d97706]" />
                        <span className="text-[14px]">Top công ty hàng đầu</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Tạo CV */}
            <div
              className="group relative cursor-pointer py-5"
              onMouseEnter={() => setActiveDropdown('cv')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:text-[#00b14f]">
                <span>Tạo CV</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#7f878f] transition-transform group-hover:rotate-180 group-hover:text-[#00b14f]" />
              </div>

              {activeDropdown === 'cv' && (
                <div className="animate-in fade-in absolute top-15 left-0 z-50 w-105 space-y-1 rounded-2xl border border-[#e9eaec] bg-white p-4.5 shadow-2xl duration-150">
                  <Link
                    href="/cv-templates"
                    className="flex items-center gap-3 rounded-lg p-2 text-[#263a4d] transition-colors hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                  >
                    <FilePlus className="h-4 w-4 text-[#00b14f]" />
                    <div>
                      <div className="text-[14px] font-semibold">Tạo CV mới (Builder 2.0)</div>
                      <div className="text-[12px] text-[#7f878f]">Mẫu CV chuyên nghiệp chuẩn ATS</div>
                    </div>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 rounded-lg p-2 text-[#263a4d] transition-colors hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                  >
                    <FileText className="h-4 w-4 text-[#00b14f]" />
                    <div>
                      <div className="text-[14px] font-semibold">Quản lý CV & Hồ sơ</div>
                      <div className="text-[12px] text-[#7f878f]">Xem và chỉnh sửa hồ sơ ứng viên</div>
                    </div>
                  </Link>
                  <Link
                    href="/cv-templates"
                    className="flex items-center gap-3 rounded-lg p-2 text-[#263a4d] transition-colors hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                  >
                    <Compass className="h-4 w-4 text-[#00b14f]" />
                    <div>
                      <div className="text-[14px] font-semibold">Mẫu CV theo ngành nghề</div>
                      <div className="text-[12px] text-[#7f878f]">IT, Marketing, Kế toán, Kinh doanh</div>
                    </div>
                  </Link>
                  <Link
                    href="#self-growth"
                    className="flex items-center gap-3 rounded-lg p-2 text-[#263a4d] transition-colors hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                  >
                    <Mail className="h-4 w-4 text-[#00b14f]" />
                    <div>
                      <div className="text-[14px] font-semibold">Mẫu Cover Letter</div>
                      <div className="text-[12px] text-[#7f878f]">Thư xin việc ấn tượng</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Công cụ */}
            <div
              className="group relative cursor-pointer py-5"
              onMouseEnter={() => setActiveDropdown('tools')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:text-[#00b14f]">
                <span>Công cụ</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#7f878f] transition-transform group-hover:rotate-180 group-hover:text-[#00b14f]" />
              </div>

              {activeDropdown === 'tools' && (
                <div className="animate-in fade-in absolute top-15 -left-10 z-50 grid w-115 grid-cols-2 gap-3 rounded-2xl border border-[#e9eaec] bg-white p-4.5 shadow-2xl duration-150">
                  <div className="space-y-1">
                    <Link
                      href="#superior-tool"
                      className="flex items-center gap-2 rounded-lg p-2 text-[13.5px] text-[#263a4d] transition-colors hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                    >
                      <Calculator className="h-4 w-4 text-[#00b14f]" />
                      <span>Tính lương Gross - Net</span>
                    </Link>
                    <Link
                      href="#superior-tool"
                      className="flex items-center gap-2 rounded-lg p-2 text-[13.5px] text-[#263a4d] transition-colors hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                    >
                      <Percent className="h-4 w-4 text-[#00b14f]" />
                      <span>Tính thuế TNCN</span>
                    </Link>
                    <Link
                      href="#superior-tool"
                      className="flex items-center gap-2 rounded-lg p-2 text-[13.5px] text-[#263a4d] transition-colors hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                    >
                      <ShieldCheck className="h-4 w-4 text-[#00b14f]" />
                      <span>Bảo hiểm thất nghiệp</span>
                    </Link>
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="#self-growth"
                      className="flex items-center gap-2 rounded-lg p-2 text-[13.5px] text-[#263a4d] transition-colors hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                    >
                      <Sparkles className="h-4 w-4 text-[#00b14f]" />
                      <span>Trắc nghiệm MBTI</span>
                    </Link>
                    <Link
                      href="#self-growth"
                      className="flex items-center gap-2 rounded-lg p-2 text-[13.5px] text-[#263a4d] transition-colors hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                    >
                      <Compass className="h-4 w-4 text-[#00b14f]" />
                      <span>Trắc nghiệm MI</span>
                    </Link>
                    <Link
                      href="#superior-tool"
                      className="flex items-center gap-2 rounded-lg p-2 text-[13.5px] text-[#263a4d] transition-colors hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                    >
                      <TrendingUp className="h-4 w-4 text-[#00b14f]" />
                      <span>Tính lãi suất kép</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Cẩm nang nghề nghiệp */}
            <div
              className="group relative cursor-pointer py-5"
              onMouseEnter={() => setActiveDropdown('guide')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:text-[#00b14f]">
                <span>Cẩm nang nghề nghiệp</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#7f878f] transition-transform group-hover:rotate-180 group-hover:text-[#00b14f]" />
              </div>

              {activeDropdown === 'guide' && (
                <div className="animate-in fade-in absolute top-15 left-0 z-50 w-75 space-y-1 rounded-2xl border border-[#e9eaec] bg-white p-3 shadow-2xl duration-150">
                  <Link
                    href="/blog"
                    className="block rounded-lg p-2 text-[14px] font-bold text-[#00b14f] hover:bg-[#f2fbf6]"
                  >
                    Tất cả cẩm nang nghề nghiệp
                  </Link>
                  <Link
                    href="/blog/dinh-huong-nghe-nghiep"
                    className="block rounded-lg p-2 text-[14px] text-[#263a4d] hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                  >
                    Định hướng nghề nghiệp
                  </Link>
                  <Link
                    href="/blog/bi-kip-tim-viec"
                    className="block rounded-lg p-2 text-[14px] text-[#263a4d] hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                  >
                    Bí quyết tìm việc
                  </Link>
                  <Link
                    href="/blog/che-do-luong-thuong"
                    className="block rounded-lg p-2 text-[14px] text-[#263a4d] hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                  >
                    Chế độ lương thưởng
                  </Link>
                  <Link
                    href="/blog/kien-thuc-chuyen-nganh"
                    className="block rounded-lg p-2 text-[14px] text-[#263a4d] hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                  >
                    Kiến thức chuyên ngành
                  </Link>
                </div>
              )}
            </div>

            {/* 5. InterVue Pro */}
            <Link
              href="#top-companies"
              className="flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:text-[#00b14f]"
            >
              <span>InterVue</span>
              <span className="rounded-full bg-[#f59e0b] px-2 py-0.5 text-[11px] font-bold text-white shadow-2xs">
                Pro
              </span>
            </Link>
          </nav>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Đăng ký (pill outline) */}
          <Link
            href="/register"
            className="cursor-pointer rounded-full border border-[#00b14f] bg-white px-5 py-2 text-[14px] font-semibold text-[#00b14f] shadow-2xs transition-all hover:bg-[#f2fbf6]"
          >
            Đăng ký
          </Link>

          {/* Đăng nhập (pill solid green) */}
          <Link
            href="/login"
            className="cursor-pointer rounded-full bg-[#00b14f] px-5 py-2 text-[14px] font-semibold text-white shadow-xs transition-all hover:bg-[#009643]"
          >
            Đăng nhập
          </Link>

          {/* Đăng tuyển & tìm hồ sơ (pill light gray) */}
          <button
            type="button"
            className="hidden cursor-pointer rounded-full bg-[#f4f5f5] px-5 py-2 text-[14px] font-medium text-[#263a4d] transition-colors hover:bg-[#e9eaec] md:inline-flex"
          >
            Đăng tuyển & tìm hồ sơ
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#263a4d] hover:text-[#00b14f] lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="space-y-3 border-t border-[#e9eaec] bg-white px-5 py-4 lg:hidden">
          <Link
            href="#feature-jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[15px] font-semibold text-[#263a4d]"
          >
            Việc làm
          </Link>
          <Link
            href="/cv-templates"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[15px] font-semibold text-[#263a4d]"
          >
            Tạo CV
          </Link>
          <Link
            href="#superior-tool"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[15px] font-semibold text-[#263a4d]"
          >
            Công cụ
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[15px] font-semibold text-[#263a4d]"
          >
            Cẩm nang nghề nghiệp
          </Link>
          <Link
            href="#top-companies"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[15px] font-semibold text-[#263a4d]"
          >
            InterVue Pro
          </Link>
          <div className="flex flex-col gap-2 border-t border-[#e9eaec] pt-3">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full rounded-full border border-[#00b14f] py-2.5 text-center text-sm font-semibold text-[#00b14f]"
            >
              Đăng ký
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full rounded-full bg-[#00b14f] py-2.5 text-center text-sm font-semibold text-white"
            >
              Đăng nhập
            </Link>
            <button className="w-full rounded-full bg-[#f4f5f5] py-2.5 text-sm font-medium text-[#263a4d]">
              Đăng tuyển & tìm hồ sơ
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
