'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useLogout';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const { user, isLoading } = useAuth();
  const logout = useLogout();

  if (!isOpen) return null;

  return (
    <div className="animate-in slide-in-from-top-2 space-y-3 border-t border-slate-200 bg-white px-5 py-4 duration-150 lg:hidden">
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
                onClick={() => logout.mutate()}
                className="w-full cursor-pointer rounded-xl bg-slate-100 py-2.5 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href={ROUTES.REGISTER}
                onClick={onClose}
                className="border-primary text-primary hover:bg-primary-light w-full rounded-xl border py-2.5 text-center text-sm font-semibold transition-colors"
              >
                Sign up
              </Link>
              <Link
                href={ROUTES.LOGIN}
                onClick={onClose}
                className="bg-primary hover:bg-primary-hover w-full rounded-xl py-2.5 text-center text-sm font-semibold text-white transition-colors"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default MobileNavDrawer;
