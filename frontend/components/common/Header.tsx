'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Bot, ChevronDown, Menu, PhoneCall, PlusCircle, X } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/auth';
import { useAuth } from '@/hooks/useAuth';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import JobsDropdown from './header/JobsDropdown';
import CvDropdown from './header/CvDropdown';
import ToolsDropdown from './header/ToolsDropdown';
import CareerDropdown from './header/CareerDropdown';
import HeaderAccountActions from './header/HeaderAccountActions';
import MobileNavDrawer from './header/MobileNavDrawer';
import RecruiterEntryButton from './header/RecruiterEntryButton';

interface HeaderProps {
  portal?: 'candidate' | 'recruiter';
}

export default function Header({ portal = 'candidate' }: HeaderProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, hasRole } = useAuth();

  const recruiterPostJobHref =
    user && hasRole(ROLES.RECRUITER)
      ? ROUTES.RECRUITER_JOBS_CREATE
      : `${ROUTES.RECRUITER_LOGIN}?redirect=${encodeURIComponent(ROUTES.RECRUITER_JOBS_CREATE)}`;

  if (portal === 'recruiter') {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-xs">
        <EmailVerificationBanner />
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href={ROUTES.RECRUITER_LANDING} className="group flex shrink-0 items-center gap-2.5 py-1">
              <Image
                src="/intervue-logo.png"
                alt="InterVue"
                width={140}
                height={40}
                priority
                className="h-10 w-auto object-contain transition-transform duration-200"
                style={{ width: 'auto', height: 'auto' }}
              />
              <span className="border-primary/20 bg-primary-light text-primary rounded-md border px-2 py-0.5 text-xs font-bold">
                Nhà tuyển dụng
              </span>
            </Link>

            <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-800 lg:flex xl:gap-6">
              <Link href="/recruiter#features" className="transition-colors hover:text-emerald-600">
                Giải pháp AI
              </Link>
              <Link href="/recruiter#job-posting" className="transition-colors hover:text-emerald-600">
                Đăng tin tuyển dụng
              </Link>
              <Link href="/recruiter#candidate-sourcing" className="transition-colors hover:text-emerald-600">
                Tìm kiếm hồ sơ
              </Link>
              <Link href="/recruiter#pricing" className="transition-colors hover:text-emerald-600">
                Bảng giá dịch vụ
              </Link>
              <Link href="/recruiter#testimonials" className="transition-colors hover:text-emerald-600">
                Khách hàng
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              href="tel:0812665001"
              className="hover:text-primary hidden items-center gap-1.5 text-xs font-bold text-slate-600 transition xl:flex"
            >
              <PhoneCall className="text-primary h-3.5 w-3.5" />
              <span>0812.665.001</span>
            </a>

            <Link
              href={ROUTES.HOME}
              className="hover:text-primary hidden items-center gap-1.5 text-xs font-semibold text-slate-600 transition sm:flex"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Dành cho Người tìm việc</span>
            </Link>

            <div className="hidden h-5 w-px bg-slate-200 sm:block" />

            <HeaderAccountActions portal="recruiter" />

            <Link
              href={recruiterPostJobHref}
              className="bg-primary hover:bg-primary-hover hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors sm:flex"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Đăng tin ngay</span>
            </Link>

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

        <MobileNavDrawer portal={portal} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      </header>
    );
  }

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
              style={{ width: 'auto', height: 'auto' }}
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

          <RecruiterEntryButton />

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

      <MobileNavDrawer portal={portal} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
