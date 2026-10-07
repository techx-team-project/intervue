'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, Briefcase, ChevronDown, ChevronUp, FileText, LogOut, ShieldCheck } from 'lucide-react';

interface UserMenuDropdownProps {
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function UserMenuDropdown({ onClose, onMouseEnter, onMouseLeave }: UserMenuDropdownProps) {
  const [userAccordions, setUserAccordions] = useState<Record<string, boolean>>({
    jobs: true,
    cv: true,
    security: false,
    upgrade: false,
  });

  const toggleUserAccordion = (key: string) => {
    setUserAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div
      className="animate-in fade-in zoom-in-95 absolute top-12 right-0 z-50 max-h-[88vh] w-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3.5 text-slate-800 shadow-2xl duration-150 sm:w-84"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. Header: Avatar & Info */}
      <Link
        href="/account"
        onClick={onClose}
        className="-mx-1 flex items-center gap-3 rounded-xl border-b border-slate-100 px-2 pb-3 transition-colors hover:bg-slate-50"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-emerald-500 to-emerald-600 text-lg font-black text-white shadow-md ring-2 ring-emerald-100">
          A
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-slate-800">An Lâm Hoàng</h4>
          <p className="mt-0.5 text-xs font-medium text-slate-500">Tài khoản đã xác thực</p>
          <p className="mt-0.5 truncate text-xs text-slate-400">
            ID 11311666 <span className="mx-1 text-slate-300">|</span> lamhoangan612@gmail.com
          </p>
        </div>
      </Link>

      {/* 2. Menu Accordion Groups */}
      <div className="mt-1.5 divide-y divide-slate-100">
        {/* Group 1: Quản lý tìm việc */}
        <div className="py-1">
          <button
            type="button"
            onClick={() => toggleUserAccordion('jobs')}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg px-1.5 py-1.5 text-left font-bold text-slate-800 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                <Briefcase className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm">Quản lý tìm việc</span>
            </div>
            {userAccordions.jobs ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {userAccordions.jobs && (
            <div className="mt-0.5 space-y-0.5 pr-1 pl-8">
              <Link
                href="/account"
                onClick={onClose}
                className="block rounded-lg px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-emerald-50/60 hover:text-emerald-600"
              >
                Việc làm đã lưu
              </Link>
              <Link
                href="/account"
                onClick={onClose}
                className="block rounded-lg px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-emerald-50/60 hover:text-emerald-600"
              >
                Việc làm đã ứng tuyển
              </Link>
              <Link
                href="/account"
                onClick={onClose}
                className="block rounded-lg px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-emerald-50/60 hover:text-emerald-600"
              >
                Việc làm phù hợp với bạn
              </Link>
            </div>
          )}
        </div>

        {/* Group 2: Quản lý CV */}
        <div className="py-1">
          <button
            type="button"
            onClick={() => toggleUserAccordion('cv')}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg px-1.5 py-1.5 text-left font-bold text-slate-800 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm">Quản lý CV & Hồ sơ</span>
            </div>
            {userAccordions.cv ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {userAccordions.cv && (
            <div className="mt-0.5 space-y-0.5 pr-1 pl-8">
              <Link
                href="/profile"
                onClick={onClose}
                className="block rounded-lg px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-emerald-50/60 hover:text-emerald-600"
              >
                CV của tôi
              </Link>
              <Link
                href="/profile"
                onClick={onClose}
                className="block rounded-lg px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-emerald-50/60 hover:text-emerald-600"
              >
                Hồ sơ ứng viên Pro
              </Link>
            </div>
          )}
        </div>

        {/* Group 3: Cài đặt & Bảo mật */}
        <div className="py-1">
          <button
            type="button"
            onClick={() => toggleUserAccordion('security')}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg px-1.5 py-1.5 text-left font-bold text-slate-800 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm">Bảo mật tài khoản</span>
            </div>
            {userAccordions.security ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {userAccordions.security && (
            <div className="mt-0.5 space-y-0.5 pr-1 pl-8">
              <Link
                href="/account/security"
                onClick={onClose}
                className="block rounded-lg px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-emerald-50/60 hover:text-emerald-600"
              >
                Cài đặt bảo mật & Phiên đăng nhập
              </Link>
              <Link
                href="/account/password"
                onClick={onClose}
                className="block rounded-lg px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-emerald-50/60 hover:text-emerald-600"
              >
                Đổi mật khẩu
              </Link>
              <Link
                href="/account/two-factor"
                onClick={onClose}
                className="block rounded-lg px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-emerald-50/60 hover:text-emerald-600"
              >
                Xác thực 2 bước (2FA)
              </Link>
            </div>
          )}
        </div>

        {/* Group 4: Nâng cấp tài khoản */}
        <div className="py-1">
          <button
            type="button"
            onClick={() => toggleUserAccordion('upgrade')}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg px-1.5 py-1.5 text-left font-bold text-slate-800 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                <Award className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm">Nâng cấp tài khoản</span>
            </div>
            {userAccordions.upgrade ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {userAccordions.upgrade && (
            <div className="mt-0.5 space-y-0.5 pr-1 pl-8">
              <Link
                href="/upgrade"
                onClick={onClose}
                className="block rounded-lg px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-emerald-50/60 hover:text-emerald-600"
              >
                Tài khoản VIP InterVue Pro
              </Link>
              <Link
                href="/gifts"
                onClick={onClose}
                className="block rounded-lg px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-emerald-50/60 hover:text-emerald-600"
              >
                Kích hoạt mã quà tặng
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 3. Footer: Đăng xuất button */}
      <div className="mt-3 border-t border-slate-100 pt-3">
        <Link
          href="/login"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200"
        >
          <LogOut className="h-4 w-4 text-slate-500" />
          <span>Đăng xuất</span>
        </Link>
      </div>
    </div>
  );
}

export default UserMenuDropdown;
