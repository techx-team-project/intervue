'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
  FileText,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useLogout';
import { ROLES } from '@/constants/auth';
import { ROUTES } from '@/constants/routes';
import RoleSwitcher from './RoleSwitcher';

interface UserMenuDropdownProps {
  portal?: 'candidate' | 'recruiter';
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function UserMenuDropdown({ portal = 'candidate', onClose, onMouseEnter, onMouseLeave }: UserMenuDropdownProps) {
  const { user, hasRole } = useAuth();
  const logout = useLogout();
  const isRecruiter = hasRole(ROLES.RECRUITER) || portal === 'recruiter';
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
      className="absolute top-12 right-0 z-50 max-h-[88vh] w-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3.5 text-slate-800 shadow-2xl sm:w-84"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => e.stopPropagation()}
    >
      <Link
        href="/account"
        onClick={onClose}
        className="-mx-1 flex items-center gap-3 rounded-xl border-b border-slate-100 px-2 pb-3 transition-colors hover:bg-slate-50"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-emerald-500 to-emerald-600 text-lg font-black text-white shadow-md ring-2 ring-emerald-100">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-slate-800">{user?.name}</h4>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            {user?.emailVerified ? 'Tài khoản đã xác thực' : 'Chưa xác thực email'}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-400">
            ID {user?.id} <span className="mx-1 text-slate-300">|</span> {user?.email}
          </p>
        </div>
      </Link>

      <RoleSwitcher onNavigate={onClose} className="mt-2" />

      {isRecruiter && (
        <div className="mt-2.5 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-2.5">
          <div className="flex items-center justify-between pb-1.5">
            <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase">
              Dành cho Nhà tuyển dụng
            </span>
          </div>
          <Link
            href={ROUTES.RECRUITER_DASHBOARD}
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-center text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Vào trang quản trị tuyển dụng</span>
          </Link>
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
            <Link
              href={ROUTES.RECRUITER_JOBS_CREATE}
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 font-medium text-slate-700 transition hover:bg-white hover:text-emerald-700"
            >
              <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span className="truncate">Đăng tin tuyển dụng</span>
            </Link>
            <Link
              href={ROUTES.RECRUITER_JOBS}
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 font-medium text-slate-700 transition hover:bg-white hover:text-emerald-700"
            >
              <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
              <span className="truncate">Quản lý tin đăng</span>
            </Link>
            <Link
              href={ROUTES.RECRUITER_APPLICATIONS}
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 font-medium text-slate-700 transition hover:bg-white hover:text-emerald-700"
            >
              <Users className="h-3.5 w-3.5 text-emerald-600" />
              <span className="truncate">Hồ sơ ứng tuyển</span>
            </Link>
            <Link
              href={ROUTES.RECRUITER_COMPANY}
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 font-medium text-slate-700 transition hover:bg-white hover:text-emerald-700"
            >
              <Building2 className="h-3.5 w-3.5 text-emerald-600" />
              <span className="truncate">Hồ sơ công ty</span>
            </Link>
          </div>
        </div>
      )}

      <div className="mt-1.5 divide-y divide-slate-100">
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
                href={ROUTES.CANDIDATE_PROFILE}
                onClick={onClose}
                className="block rounded-lg px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-emerald-50/60 hover:text-emerald-600"
              >
                CV của tôi
              </Link>
              <Link
                href={ROUTES.CANDIDATE_PROFILE}
                onClick={onClose}
                className="block rounded-lg px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-emerald-50/60 hover:text-emerald-600"
              >
                Hồ sơ ứng viên Pro
              </Link>
            </div>
          )}
        </div>

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

      <div className="mt-3 border-t border-slate-100 pt-3">
        <button
          type="button"
          disabled={logout.isPending}
          onClick={() => {
            logout.mutate();
            onClose();
          }}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="h-4 w-4 text-slate-500" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}

export default UserMenuDropdown;
