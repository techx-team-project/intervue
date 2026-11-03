'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, PhoneCall } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useLogout';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  portal?: 'candidate' | 'recruiter';
}

export function MobileNavDrawer({ isOpen, onClose, portal = 'candidate' }: MobileNavDrawerProps) {
  const { user, isLoading } = useAuth();
  const logout = useLogout();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (portal === 'recruiter') {
    return (
      <>
        <div
          className="fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
        <div className="relative z-50 space-y-3 border-t border-slate-200 bg-white px-5 py-4 lg:hidden">
          <Link
            href={ROUTES.HOME}
            onClick={onClose}
            className="flex items-center gap-1.5 py-2 text-sm font-semibold text-slate-600 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Dành cho Người tìm việc</span>
          </Link>
          <Link
            href="/recruiter#features"
            onClick={onClose}
            className="text-navy hover:text-primary block py-2 text-sm font-semibold"
          >
            Giải pháp AI
          </Link>
          <Link
            href="/recruiter#job-posting"
            onClick={onClose}
            className="text-navy hover:text-primary block py-2 text-sm font-semibold"
          >
            Đăng tin tuyển dụng
          </Link>
          <Link
            href="/recruiter#candidate-sourcing"
            onClick={onClose}
            className="text-navy hover:text-primary block py-2 text-sm font-semibold"
          >
            Tìm kiếm hồ sơ
          </Link>
          <Link
            href="/recruiter#pricing"
            onClick={onClose}
            className="text-navy hover:text-primary block py-2 text-sm font-semibold"
          >
            Bảng giá dịch vụ
          </Link>
          <Link
            href="/recruiter#testimonials"
            onClick={onClose}
            className="text-navy hover:text-primary block py-2 text-sm font-semibold"
          >
            Khách hàng
          </Link>
          <div className="border-t border-slate-100 pt-2">
            <a
              href="tel:0812665001"
              className="flex items-center gap-2 py-1.5 text-sm font-bold text-primary"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Hotline hỗ trợ: 0812.665.001</span>
            </a>
          </div>

          {!isLoading && (
            <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
              {user ? (
                <>
                  <Link
                    href={ROUTES.RECRUITER_DASHBOARD}
                    onClick={onClose}
                    className="border-primary text-primary hover:bg-primary-light w-full rounded-xl border py-2.5 text-center text-sm font-semibold transition-colors"
                  >
                    Vào trang quản trị ({user.name})
                  </Link>
                  <button
                    type="button"
                    disabled={logout.isPending}
                    onClick={() => {
                      logout.mutate();
                      onClose();
                    }}
                    className="w-full cursor-pointer rounded-xl bg-slate-100 py-2.5 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={ROUTES.RECRUITER_REGISTER}
                    onClick={onClose}
                    className="border-primary text-primary hover:bg-primary-light w-full rounded-xl border py-2.5 text-center text-sm font-semibold transition-colors"
                  >
                    Đăng ký
                  </Link>
                  <Link
                    href={ROUTES.RECRUITER_LOGIN}
                    onClick={onClose}
                    className="bg-primary hover:bg-primary-hover w-full rounded-xl py-2.5 text-center text-sm font-semibold text-white transition-colors"
                  >
                    Đăng nhập
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-50 space-y-3 border-t border-slate-200 bg-white px-5 py-4 lg:hidden">
        <Link
          href="#feature-jobs"
          onClick={onClose}
          className="text-navy hover:text-primary block py-2 text-sm font-semibold"
        >
          Việc làm
        </Link>
        <Link
          href="/cv-templates"
          onClick={onClose}
          className="text-navy hover:text-primary block py-2 text-sm font-semibold"
        >
          Tạo CV
        </Link>
        <Link
          href="#superior-tool"
          onClick={onClose}
          className="text-navy hover:text-primary block py-2 text-sm font-semibold"
        >
          Công cụ
        </Link>
        <Link href="/blog" onClick={onClose} className="text-navy hover:text-primary block py-2 text-sm font-semibold">
          Cẩm nang nghề nghiệp
        </Link>
        <Link href="/upgrade" onClick={onClose} className="text-navy hover:text-primary block py-2 text-sm font-semibold">
          Nâng cấp VIP
        </Link>
        <Link
          href={ROUTES.RECRUITER_LANDING}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="block rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
        >
          Đăng tuyển & tìm hồ sơ (Dành cho NTD)
        </Link>

        {!isLoading && (
          <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={onClose}
                  className="border-primary text-primary hover:bg-primary-light w-full rounded-xl border py-2.5 text-center text-sm font-semibold transition-colors"
                >
                  {user.name}
                </Link>
                <button
                  type="button"
                  disabled={logout.isPending}
                  onClick={() => {
                    logout.mutate();
                    onClose();
                  }}
                  className="w-full cursor-pointer rounded-xl bg-slate-100 py-2.5 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  href={ROUTES.REGISTER}
                  onClick={onClose}
                  className="border-primary text-primary hover:bg-primary-light w-full rounded-xl border py-2.5 text-center text-sm font-semibold transition-colors"
                >
                  Đăng ký
                </Link>
                <Link
                  href={ROUTES.LOGIN}
                  onClick={onClose}
                  className="bg-primary hover:bg-primary-hover w-full rounded-xl py-2.5 text-center text-sm font-semibold text-white transition-colors"
                >
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default MobileNavDrawer;
