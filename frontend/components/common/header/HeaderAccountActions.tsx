'use client';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { Bell, ChevronDown, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import UserMenuDropdown from './UserMenuDropdown';

const MENU_CLOSE_DELAY_MS = 300;

export default function HeaderAccountActions() {
  const { user, status } = useAuth();
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
    }, MENU_CLOSE_DELAY_MS);
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

  if (status === 'idle' || status === 'loading') {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-slate-100" aria-hidden />;
  }

  if (!user) {
    return (
      <div className="hidden items-center gap-2 sm:flex">
        <Link
          href={ROUTES.REGISTER}
          className="rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
        >
          Sign up
        </Link>
        <Link
          href={ROUTES.LOGIN}
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        title="Notifications"
        className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200"
      >
        <Bell className="h-4.5 w-4.5" />
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
          1
        </span>
      </button>

      <button
        type="button"
        title="Messages"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200"
      >
        <MessageSquare className="h-4.5 w-4.5" />
      </button>

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
          aria-label="Account menu"
        >
          <div className="relative flex h-9.5 w-9.5 items-center justify-center rounded-full bg-linear-to-tr from-emerald-500 via-emerald-600 to-teal-600 text-sm font-black text-white shadow-sm ring-2 ring-emerald-400/30 transition-all hover:ring-emerald-600">
            <span>{user.name.charAt(0).toUpperCase()}</span>
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
    </>
  );
}
