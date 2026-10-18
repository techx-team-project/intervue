'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bot, ChevronDown, Menu, X } from 'lucide-react';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import JobsDropdown from './header/JobsDropdown';
import CvDropdown from './header/CvDropdown';
import ToolsDropdown from './header/ToolsDropdown';
import CareerDropdown from './header/CareerDropdown';
import HeaderAccountActions from './header/HeaderAccountActions';
import MobileNavDrawer from './header/MobileNavDrawer';

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-xs">
      <EmailVerificationBanner />
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/" className="group flex shrink-0 items-center py-1">
            <Image
              src="/intervue-logo.png"
              alt="InterVue"
              width={140}
              height={40}
              priority
              className="h-10 w-auto object-contain transition-transform duration-200"
            />
          </Link>

          <nav className="hidden items-center gap-1 text-sm font-medium text-slate-800 lg:flex xl:gap-2">
            <div
              className="group relative cursor-pointer py-5"
              onMouseEnter={() => setActiveDropdown('jobs')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:text-emerald-600">
                <span>Việc làm</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:rotate-180 group-hover:text-emerald-600" />
              </div>
              {activeDropdown === 'jobs' && <JobsDropdown />}
            </div>

            <div
              className="group relative cursor-pointer py-5"
              onMouseEnter={() => setActiveDropdown('cv')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:text-emerald-600">
                <span>Tạo CV</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:rotate-180 group-hover:text-emerald-600" />
              </div>
              {activeDropdown === 'cv' && <CvDropdown />}
            </div>

            <div
              className="group relative cursor-pointer py-5"
              onMouseEnter={() => setActiveDropdown('tools')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:text-emerald-600">
                <span>Công cụ</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:rotate-180 group-hover:text-emerald-600" />
              </div>
              {activeDropdown === 'tools' && <ToolsDropdown />}
            </div>

            <div
              className="group relative cursor-pointer py-5"
              onMouseEnter={() => setActiveDropdown('guide')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:text-emerald-600">
                <span>Cẩm nang nghề nghiệp</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:rotate-180 group-hover:text-emerald-600" />
              </div>
              {activeDropdown === 'guide' && <CareerDropdown />}
            </div>

            <Link
              href="/upgrade"
              className="flex items-center gap-1 rounded-md px-2 py-1 font-bold text-amber-700 transition-colors hover:text-amber-800"
            >
              <span>Nâng cấp VIP</span>
            </Link>

            <Link
              href="/mascot"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 transition hover:bg-emerald-100"
            >
              <Bot className="h-3.5 w-3.5 text-emerald-600" />
              <span>AI Mascot</span>
              <span className="py-0.2 rounded-full bg-emerald-600 px-1.5 text-[9px] font-bold text-white uppercase">
                New
              </span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <HeaderAccountActions />

          <div className="hidden h-5 w-px bg-slate-200 sm:block" />

          <button
            type="button"
            className="hidden cursor-pointer rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-200 md:inline-flex"
          >
            Đăng tuyển & tìm hồ sơ
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="cursor-pointer p-2 text-slate-800 hover:text-emerald-600 lg:hidden"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <MobileNavDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
