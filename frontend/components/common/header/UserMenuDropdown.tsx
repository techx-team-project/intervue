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
      className="rounded-shape-lg border-outline-variant bg-surface text-on-surface shadow-elevation-2 absolute top-12 right-0 z-50 max-h-[88vh] w-80 overflow-y-auto border p-3.5 sm:w-84"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => e.stopPropagation()}
    >
      <Link
        href="/account"
        onClick={onClose}
        className="border-outline-variant hover:bg-surface-container-low -mx-1 flex items-center gap-3 rounded-xl border-b px-2 pb-3 transition-colors"
      >
        <div className="bg-primary shadow-elevation-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ring-2 ring-emerald-100">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-on-surface truncate text-sm font-bold">{user?.name}</h4>
          <p className="text-on-surface-variant mt-0.5 text-xs font-medium">
            {user?.emailVerified ? 'Tài khoản đã xác thực' : 'Chưa xác thực email'}
          </p>
          <p className="text-outline mt-0.5 truncate text-xs">
            ID {user?.id} <span className="text-outline mx-1">|</span> {user?.email}
          </p>
        </div>
      </Link>

      {isRecruiter && (
        <div className="mt-2.5 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-2.5">
          <div className="flex items-center justify-between pb-1.5">
            <span className="text-label-sm text-on-primary-container font-bold tracking-wider uppercase">
              Dành cho Nhà tuyển dụng
            </span>
          </div>
          <Link
            href={ROUTES.RECRUITER_DASHBOARD}
            onClick={onClose}
            className="bg-primary hover:bg-primary-hover flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-center text-xs font-bold text-white shadow-sm transition"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Vào trang quản trị tuyển dụng</span>
          </Link>
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
            <Link
              href={ROUTES.RECRUITER_JOBS_CREATE}
              onClick={onClose}
              className="text-on-surface hover:text-primary flex items-center gap-1.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-white"
            >
              <PlusCircle className="text-primary h-3.5 w-3.5" />
              <span className="truncate">Đăng tin tuyển dụng</span>
            </Link>
            <Link
              href={ROUTES.RECRUITER_JOBS}
              onClick={onClose}
              className="text-on-surface hover:text-primary flex items-center gap-1.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-white"
            >
              <Briefcase className="text-primary h-3.5 w-3.5" />
              <span className="truncate">Quản lý tin đăng</span>
            </Link>
            <Link
              href={ROUTES.RECRUITER_APPLICATIONS}
              onClick={onClose}
              className="text-on-surface hover:text-primary flex items-center gap-1.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-white"
            >
              <Users className="text-primary h-3.5 w-3.5" />
              <span className="truncate">Hồ sơ ứng tuyển</span>
            </Link>
            <Link
              href={ROUTES.RECRUITER_COMPANY}
              onClick={onClose}
              className="text-on-surface hover:text-primary flex items-center gap-1.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-white"
            >
              <Building2 className="text-primary h-3.5 w-3.5" />
              <span className="truncate">Hồ sơ công ty</span>
            </Link>
          </div>
        </div>
      )}

      <div className="divide-outline-variant mt-1.5 divide-y">
        <div className="py-1">
          <button
            type="button"
            onClick={() => toggleUserAccordion('jobs')}
            className="text-on-surface hover:bg-surface-container-low flex w-full cursor-pointer items-center justify-between rounded-lg px-1.5 py-1.5 text-left font-bold transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-primary-light text-primary flex h-6 w-6 items-center justify-center rounded-md">
                <Briefcase className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm">Quản lý tìm việc</span>
            </div>
            {userAccordions.jobs ? (
              <ChevronUp className="text-outline h-4 w-4" />
            ) : (
              <ChevronDown className="text-outline h-4 w-4" />
            )}
          </button>

          {userAccordions.jobs && (
            <div className="mt-0.5 space-y-0.5 pr-1 pl-8">
              <Link
                href="/account"
                onClick={onClose}
                className="text-on-surface-variant hover:text-primary block rounded-lg px-2 py-1 text-xs transition-colors hover:bg-emerald-50/60"
              >
                Việc làm đã lưu
              </Link>
              <Link
                href="/account"
                onClick={onClose}
                className="text-on-surface-variant hover:text-primary block rounded-lg px-2 py-1 text-xs transition-colors hover:bg-emerald-50/60"
              >
                Việc làm đã ứng tuyển
              </Link>
              <Link
                href="/candidate/job-alerts"
                onClick={onClose}
                className="text-on-surface-variant hover:text-primary block rounded-lg px-2 py-1 text-xs transition-colors hover:bg-emerald-50/60"
              >
                Cài đặt thông báo việc làm (Job Alerts)
              </Link>
              <Link
                href="/account"
                onClick={onClose}
                className="text-on-surface-variant hover:text-primary block rounded-lg px-2 py-1 text-xs transition-colors hover:bg-emerald-50/60"
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
            className="text-on-surface hover:bg-surface-container-low flex w-full cursor-pointer items-center justify-between rounded-lg px-1.5 py-1.5 text-left font-bold transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-primary-light text-primary flex h-6 w-6 items-center justify-center rounded-md">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm">Quản lý CV & Hồ sơ</span>
            </div>
            {userAccordions.cv ? (
              <ChevronUp className="text-outline h-4 w-4" />
            ) : (
              <ChevronDown className="text-outline h-4 w-4" />
            )}
          </button>

          {userAccordions.cv && (
            <div className="mt-0.5 space-y-0.5 pr-1 pl-8">
              <Link
                href={ROUTES.CANDIDATE_PROFILE}
                onClick={onClose}
                className="text-on-surface-variant hover:text-primary block rounded-lg px-2 py-1 text-xs transition-colors hover:bg-emerald-50/60"
              >
                CV của tôi
              </Link>
              <Link
                href={ROUTES.CANDIDATE_PROFILE}
                onClick={onClose}
                className="text-on-surface-variant hover:text-primary block rounded-lg px-2 py-1 text-xs transition-colors hover:bg-emerald-50/60"
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
            className="text-on-surface hover:bg-surface-container-low flex w-full cursor-pointer items-center justify-between rounded-lg px-1.5 py-1.5 text-left font-bold transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-primary-light text-primary flex h-6 w-6 items-center justify-center rounded-md">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm">Bảo mật tài khoản</span>
            </div>
            {userAccordions.security ? (
              <ChevronUp className="text-outline h-4 w-4" />
            ) : (
              <ChevronDown className="text-outline h-4 w-4" />
            )}
          </button>

          {userAccordions.security && (
            <div className="mt-0.5 space-y-0.5 pr-1 pl-8">
              <Link
                href="/account/security"
                onClick={onClose}
                className="text-on-surface-variant hover:text-primary block rounded-lg px-2 py-1 text-xs transition-colors hover:bg-emerald-50/60"
              >
                Cài đặt bảo mật & Phiên đăng nhập
              </Link>
              <Link
                href="/account/password"
                onClick={onClose}
                className="text-on-surface-variant hover:text-primary block rounded-lg px-2 py-1 text-xs transition-colors hover:bg-emerald-50/60"
              >
                Đổi mật khẩu
              </Link>
              <Link
                href="/account/two-factor"
                onClick={onClose}
                className="text-on-surface-variant hover:text-primary block rounded-lg px-2 py-1 text-xs transition-colors hover:bg-emerald-50/60"
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
            className="text-on-surface hover:bg-surface-container-low flex w-full cursor-pointer items-center justify-between rounded-lg px-1.5 py-1.5 text-left font-bold transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-primary-light text-primary flex h-6 w-6 items-center justify-center rounded-md">
                <Award className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm">Nâng cấp tài khoản</span>
            </div>
            {userAccordions.upgrade ? (
              <ChevronUp className="text-outline h-4 w-4" />
            ) : (
              <ChevronDown className="text-outline h-4 w-4" />
            )}
          </button>

          {userAccordions.upgrade && (
            <div className="mt-0.5 space-y-0.5 pr-1 pl-8">
              <Link
                href="/upgrade"
                onClick={onClose}
                className="text-on-surface-variant hover:text-primary block rounded-lg px-2 py-1 text-xs transition-colors hover:bg-emerald-50/60"
              >
                Tài khoản VIP InterVue Pro
              </Link>
              <Link
                href="/gifts"
                onClick={onClose}
                className="text-on-surface-variant hover:text-primary block rounded-lg px-2 py-1 text-xs transition-colors hover:bg-emerald-50/60"
              >
                Kích hoạt mã quà tặng
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="border-outline-variant mt-3 border-t pt-3">
        <button
          type="button"
          disabled={logout.isPending}
          onClick={() => {
            logout.mutate();
            onClose();
          }}
          className="bg-surface-container-high text-on-surface hover:bg-surface-container-high flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="text-on-surface-variant h-4 w-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}

export default UserMenuDropdown;
