'use client';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { Bell, ChevronDown, Menu, PanelLeftClose, PanelLeftOpen, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import RecruiterUserMenuDropdown from './RecruiterUserMenuDropdown';

interface RecruiterHeaderProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileNav: () => void;
}

export default function RecruiterHeader({
  isSidebarCollapsed,
  onToggleSidebar,
  onOpenMobileNav,
}: RecruiterHeaderProps) {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileNav}
            aria-label="Open the menu"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={isSidebarCollapsed ? 'Expand the menu' : 'Collapse the menu'}
            title={isSidebarCollapsed ? 'Expand the menu' : 'Collapse the menu'}
            className="hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 lg:flex"
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>

          <Link href={ROUTES.RECRUITER_DASHBOARD} className="flex shrink-0 items-center">
            <Image
              src="/intervue-logo.png"
              alt="InterVue"
              width={140}
              height={40}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href={ROUTES.RECRUITER_JOBS}
            className="bg-primary hover:bg-primary-hover hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors sm:inline-flex"
          >
            <Plus className="h-4 w-4" />
            <span>Post a job</span>
          </Link>

          <Link
            href={ROUTES.RECRUITER_NOTIFICATIONS}
            title="Notifications"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 sm:h-9 sm:w-9"
          >
            <Bell className="h-4.5 w-4.5" />
          </Link>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex cursor-pointer items-center rounded-full p-0.5 transition hover:scale-105 active:scale-95"
              aria-label="Account menu"
            >
              <div className="relative flex h-9.5 w-9.5 items-center justify-center rounded-full bg-linear-to-tr from-emerald-500 via-emerald-600 to-teal-600 text-sm font-black text-white shadow-sm ring-2 ring-emerald-400/30">
                <span>{user?.name.charAt(0).toUpperCase()}</span>
                <div className="absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white ring-1 ring-emerald-200">
                  <ChevronDown className="h-2 w-2 stroke-[2.5] text-emerald-700" />
                </div>
              </div>
            </button>

            {isMenuOpen && <RecruiterUserMenuDropdown onClose={() => setIsMenuOpen(false)} />}
          </div>
        </div>
      </div>
    </header>
  );
}
