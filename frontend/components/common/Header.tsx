'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  Bell,
  Bookmark,
  Briefcase,
  Building2,
  Calculator,
  ChevronDown,
  ChevronUp,
  Compass,
  FilePlus,
  FileText,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Percent,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [userAccordions, setUserAccordions] = useState<{ [key: string]: boolean }>({
    jobs: true,
    cv: true,
    email: false,
    security: false,
    upgrade: false,
  });

  const toggleUserAccordion = (key: string) => {
    setUserAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleUserMouseEnter = () => {
    if (userCloseTimeoutRef.current) {
      clearTimeout(userCloseTimeoutRef.current);
      userCloseTimeoutRef.current = null;
    }
    setIsUserMenuOpen(true);
  };

  const handleUserMouseLeave = () => {
    userCloseTimeoutRef.current = setTimeout(() => {
      setIsUserMenuOpen(false);
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (userCloseTimeoutRef.current) {
        clearTimeout(userCloseTimeoutRef.current);
      }
    };
  }, []);

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
                    href="#self-growth"
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
                    href="#self-growth"
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
                    href="/career-orientation"
                    className="block rounded-lg p-2 text-[14px] text-[#263a4d] hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                  >
                    Định hướng nghề nghiệp
                  </Link>
                  <Link
                    href="#self-growth"
                    className="block rounded-lg p-2 text-[14px] text-[#263a4d] hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                  >
                    Bí quyết tìm việc
                  </Link>
                  <Link
                    href="#self-growth"
                    className="block rounded-lg p-2 text-[14px] text-[#263a4d] hover:bg-[#f2fbf6] hover:text-[#00b14f]"
                  >
                    Chế độ lương thưởng
                  </Link>
                  <Link
                    href="#self-growth"
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
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell */}
          <button
            type="button"
            title="Thông báo"
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#f4f5f5] text-[#263a4d] transition-colors hover:bg-[#e9eaec]"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#e11d48] text-[9.5px] font-bold text-white shadow-2xs">
              1
            </span>
          </button>

          {/* Messages Chat */}
          <button
            type="button"
            title="Tin nhắn tuyển dụng"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#f4f5f5] text-[#263a4d] transition-colors hover:bg-[#e9eaec]"
          >
            <MessageSquare className="h-4.5 w-4.5" />
          </button>

          {/* User Account Quick Menu & Sub-menu */}
          <div
            ref={userMenuRef}
            className="relative"
            onMouseEnter={handleUserMouseEnter}
            onMouseLeave={handleUserMouseLeave}
          >
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex cursor-pointer items-center rounded-full p-0.5 transition-all hover:scale-105 active:scale-95"
              aria-label="Tài khoản cá nhân"
            >
              <div className="relative flex h-9.5 w-9.5 items-center justify-center rounded-full bg-linear-to-tr from-[#00b14f] via-[#00c957] to-[#00d660] text-[15px] font-black text-white shadow-sm ring-2 ring-emerald-400/30 transition-all hover:ring-[#00b14f]">
                <span>A</span>
                <div className="absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white ring-1 ring-emerald-200">
                  <ChevronDown className="h-2 w-2 stroke-[2.5] text-[#00873c]" />
                </div>
              </div>
            </button>

            {isUserMenuOpen && (
              <div
                className="animate-in fade-in zoom-in-95 absolute top-12 right-0 z-50 max-h-[88vh] w-80 scrollbar-none overflow-y-auto rounded-2xl border border-[#e2e8f0] bg-white p-3.5 text-[#263a4d] shadow-2xl duration-150 before:absolute before:-top-3 before:right-0 before:left-0 before:h-3 before:content-[''] sm:w-84 [&::-webkit-scrollbar]:hidden"
                onMouseEnter={handleUserMouseEnter}
                onMouseLeave={handleUserMouseLeave}
                onClick={(e) => e.stopPropagation()}
              >
                {/* 1. Header: Avatar & Info (Direct Link to Account) */}
                <Link
                  href="/account"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="-mx-1 flex items-center gap-3 rounded-xl border-b border-[#f1f5f9] px-1 pb-3 transition-colors hover:bg-slate-50/80"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-[#00b14f] via-[#00c957] to-[#00d660] text-[18px] font-black text-white shadow-md ring-2 shadow-[#00b14f]/20 ring-emerald-100">
                    A
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-[14.5px] font-bold text-[#263a4d]">An Lâm Hoàng</h4>
                    <p className="mt-0.5 text-[11.5px] font-medium text-[#64748b]">Tài khoản đã xác thực</p>
                    <p className="mt-0.5 truncate text-[11px] text-[#94a3b8]">
                      ID 11311666 <span className="mx-1 text-slate-300">|</span> lamhoangan612@gmail.com
                    </p>
                  </div>
                </Link>

                {/* 2. Menu Accordion Groups */}
                <div className="mt-1.5 divide-y divide-[#f8fafc]">
                  {/* Group 1: Quản lý tìm việc (mặc định mở) */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => toggleUserAccordion('jobs')}
                      className="flex w-full cursor-pointer items-center justify-between rounded-lg px-1.5 py-1.5 text-left font-bold text-[#263a4d] transition-colors hover:bg-[#f8fafc]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-[#00b14f]">
                          <Briefcase className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[13.5px]">Quản lý tìm việc</span>
                      </div>
                      {userAccordions.jobs ? (
                        <ChevronUp className="h-4 w-4 text-[#94a3b8]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#94a3b8]" />
                      )}
                    </button>

                    {userAccordions.jobs && (
                      <div className="mt-0.5 space-y-0.5 pr-1 pl-8">
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block rounded-lg px-2 py-1 text-[13px] text-[#475569] transition-colors hover:bg-emerald-50/60 hover:text-[#00b14f]"
                        >
                          Việc làm đã lưu
                        </Link>
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block rounded-lg px-2 py-1 text-[13px] text-[#475569] transition-colors hover:bg-emerald-50/60 hover:text-[#00b14f]"
                        >
                          Việc làm đã ứng tuyển
                        </Link>
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block rounded-lg px-2 py-1 text-[13px] text-[#475569] transition-colors hover:bg-emerald-50/60 hover:text-[#00b14f]"
                        >
                          Việc làm phù hợp với bạn
                        </Link>
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block rounded-lg px-2 py-1 text-[13px] text-[#475569] transition-colors hover:bg-emerald-50/60 hover:text-[#00b14f]"
                        >
                          Cài đặt gợi ý việc làm
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Group 2: Quản lý CV & Cover letter (mặc định mở) */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => toggleUserAccordion('cv')}
                      className="flex w-full cursor-pointer items-center justify-between rounded-lg px-1.5 py-1.5 text-left font-bold text-[#263a4d] transition-colors hover:bg-[#f8fafc]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-[#00b14f]">
                          <FileText className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[13.5px]">Quản lý CV & Cover letter</span>
                      </div>
                      {userAccordions.cv ? (
                        <ChevronUp className="h-4 w-4 text-[#94a3b8]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#94a3b8]" />
                      )}
                    </button>

                    {userAccordions.cv && (
                      <div className="mt-0.5 space-y-0.5 pr-1 pl-8">
                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block rounded-lg px-2 py-1 text-[13px] text-[#475569] transition-colors hover:bg-emerald-50/60 hover:text-[#00b14f]"
                        >
                          CV của tôi
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block rounded-lg px-2 py-1 text-[13px] text-[#475569] transition-colors hover:bg-emerald-50/60 hover:text-[#00b14f]"
                        >
                          Cover Letter của tôi
                        </Link>
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block rounded-lg px-2 py-1 text-[13px] text-[#475569] transition-colors hover:bg-emerald-50/60 hover:text-[#00b14f]"
                        >
                          Nhà tuyển dụng muốn kết nối với bạn
                        </Link>
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block rounded-lg px-2 py-1 text-[13px] text-[#475569] transition-colors hover:bg-emerald-50/60 hover:text-[#00b14f]"
                        >
                          Nhà tuyển dụng xem hồ sơ
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Group 3: Cài đặt email & thông báo (đóng) */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => toggleUserAccordion('email')}
                      className="flex w-full cursor-pointer items-center justify-between rounded-lg px-1.5 py-1.5 text-left font-bold text-[#263a4d] transition-colors hover:bg-[#f8fafc]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-[#00b14f]">
                          <Mail className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[13.5px]">Cài đặt email & thông báo</span>
                      </div>
                      {userAccordions.email ? (
                        <ChevronUp className="h-4 w-4 text-[#94a3b8]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#94a3b8]" />
                      )}
                    </button>

                    {userAccordions.email && (
                      <div className="mt-0.5 space-y-0.5 pr-1 pl-8">
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block rounded-lg px-2 py-1 text-[13px] text-[#475569] transition-colors hover:bg-emerald-50/60 hover:text-[#00b14f]"
                        >
                          Cài đặt thông báo việc làm
                        </Link>
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block rounded-lg px-2 py-1 text-[13px] text-[#475569] transition-colors hover:bg-emerald-50/60 hover:text-[#00b14f]"
                        >
                          Cài đặt email bản tin & gợi ý
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Group 4: Cá nhân & Bảo mật (đóng) */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => toggleUserAccordion('security')}
                      className="flex w-full cursor-pointer items-center justify-between rounded-lg px-1.5 py-1.5 text-left font-bold text-[#263a4d] transition-colors hover:bg-[#f8fafc]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-[#00b14f]">
                          <ShieldCheck className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[13.5px]">Cá nhân & Bảo mật</span>
                      </div>
                      {userAccordions.security ? (
                        <ChevronUp className="h-4 w-4 text-[#94a3b8]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#94a3b8]" />
                      )}
                    </button>

                    {userAccordions.security && (
                      <div className="mt-0.5 space-y-0.5 pr-1 pl-8">
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block rounded-lg px-2 py-1 text-[13px] text-[#475569] transition-colors hover:bg-emerald-50/60 hover:text-[#00b14f]"
                        >
                          Cài đặt thông tin cá nhân
                        </Link>
                        <Link
                          href="/account/security"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block rounded-lg px-2 py-1 text-[13px] text-[#475569] transition-colors hover:bg-emerald-50/60 hover:text-[#00b14f]"
                        >
                          Bảo mật tài khoản
                        </Link>
                        <Link
                          href="/account/password"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block rounded-lg px-2 py-1 text-[13px] text-[#475569] transition-colors hover:bg-emerald-50/60 hover:text-[#00b14f]"
                        >
                          Đổi mật khẩu
                        </Link>
                        <Link
                          href="/account/two-factor"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block rounded-lg px-2 py-1 text-[13px] text-[#475569] transition-colors hover:bg-emerald-50/60 hover:text-[#00b14f]"
                        >
                          Xác thực 2 bước (2FA)
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Group 5: Nâng cấp tài khoản (đóng) */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => toggleUserAccordion('upgrade')}
                      className="flex w-full cursor-pointer items-center justify-between rounded-lg px-1.5 py-1.5 text-left font-bold text-[#263a4d] transition-colors hover:bg-[#f8fafc]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-[#00b14f]">
                          <Award className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[13.5px]">Nâng cấp tài khoản</span>
                      </div>
                      {userAccordions.upgrade ? (
                        <ChevronUp className="h-4 w-4 text-[#94a3b8]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#94a3b8]" />
                      )}
                    </button>

                    {userAccordions.upgrade && (
                      <div className="mt-0.5 space-y-0.5 pr-1 pl-8">
                        <Link
                          href="/upgrade"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block rounded-lg px-2 py-1 text-[13px] text-[#475569] transition-colors hover:bg-emerald-50/60 hover:text-[#00b14f]"
                        >
                          Tài khoản VIP InterVue Pro
                        </Link>
                        <Link
                          href="/upgrade"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block rounded-lg px-2 py-1 text-[13px] text-[#475569] transition-colors hover:bg-emerald-50/60 hover:text-[#00b14f]"
                        >
                          Gói dịch vụ đẩy Top hồ sơ
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Footer: Đăng xuất button */}
                <div className="mt-3 border-t border-[#f1f5f9] pt-3">
                  <Link
                    href="/login"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#f1f5f9] py-2.5 text-[13px] font-semibold text-[#263a4d] transition-colors hover:bg-slate-200"
                  >
                    <LogOut className="h-4 w-4 text-[#64748b]" />
                    <span>Đăng xuất</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="hidden h-5 w-px bg-slate-200 sm:block" />

          {/* Đăng tuyển & tìm hồ sơ (pill light gray) */}
          <button
            type="button"
            className="hidden cursor-pointer rounded-full bg-[#f4f5f5] px-4 py-2 text-[13.5px] font-medium text-[#263a4d] transition-colors hover:bg-[#e9eaec] md:inline-flex"
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
            href="#self-growth"
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
            href="/career-orientation"
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
