'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, ChevronDown, Menu, MessageSquare, X } from 'lucide-react';
import JobsDropdown from './header/JobsDropdown';
import CvDropdown from './header/CvDropdown';
import ToolsDropdown from './header/ToolsDropdown';
import CareerDropdown from './header/CareerDropdown';
import UserMenuDropdown from './header/UserMenuDropdown';
import MobileNavDrawer from './header/MobileNavDrawer';

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-xs">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Left Side: Logo & Main Navigation */}
        <div className="flex items-center gap-6 lg:gap-8">
          {/* Logo InterVue */}
          <Link href="/" className="group flex shrink-0 items-center py-1">
            <Image
              src="/intervue-logo.png"
              alt="InterVue"
              width={140}
              height={40}
              priority
              className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden items-center gap-1 text-sm font-medium text-slate-800 lg:flex xl:gap-2">
            {/* 1. Việc làm */}
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

            {/* 2. Tạo CV */}
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

            {/* 3. Công cụ */}
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

            {/* 4. Cẩm nang nghề nghiệp */}
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

            {/* 5. Nâng cấp VIP */}
            <Link
              href="/upgrade"
              className="flex items-center gap-1 rounded-md px-2 py-1 font-bold text-amber-700 transition-colors hover:text-amber-800"
            >
              <span>Nâng cấp VIP</span>
            </Link>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Notifications Bell */}
          <button
            type="button"
            title="Thông báo"
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
              1
            </span>
          </button>

          {/* Messages Chat */}
          <button
            type="button"
            title="Tin nhắn tuyển dụng"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200"
          >
            <MessageSquare className="h-4.5 w-4.5" />
          </button>

          {/* User Account Quick Menu */}
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
              <div className="relative flex h-9.5 w-9.5 items-center justify-center rounded-full bg-linear-to-tr from-emerald-500 via-emerald-600 to-teal-600 text-sm font-black text-white shadow-sm ring-2 ring-emerald-400/30 transition-all hover:ring-emerald-600">
                <span>A</span>
                <div className="absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white ring-1 ring-emerald-200">
                  <ChevronDown className="h-2 w-2 stroke-[2.5] text-emerald-700" />
                </div>
              </div>
            </button>

            {isUserMenuOpen && (
              <UserMenuDropdown
                onClose={() => setIsUserMenuOpen(false)}
                onMouseEnter={handleUserMouseEnter}
                onMouseLeave={handleUserMouseLeave}
              />
            )}
          </div>

          <div className="hidden h-5 w-px bg-slate-200 sm:block" />

          {/* Đăng tuyển & tìm hồ sơ */}
          <button
            type="button"
            className="hidden cursor-pointer rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-200 md:inline-flex"
          >
            Đăng tuyển & tìm hồ sơ
          </button>

          {/* Mobile Menu Toggle */}
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

      {/* Mobile Drawer */}
      <MobileNavDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
