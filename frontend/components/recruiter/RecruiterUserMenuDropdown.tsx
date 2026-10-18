'use client';

import { useLogout } from '@/hooks/useLogout';
import { Building2, KeyRound, LogOut, ShieldCheck, Smartphone } from 'lucide-react';
import Link from 'next/link';

interface RecruiterUserMenuDropdownProps {
  onClose: () => void;
}

const LINKS = [
  { label: 'Hồ sơ công ty', href: '/recruiter/company', icon: Building2 },
  { label: 'Bảo mật tài khoản', href: '/account/security', icon: ShieldCheck },
  { label: 'Đổi mật khẩu', href: '/account/password', icon: KeyRound },
  { label: 'Xác thực 2 bước (2FA)', href: '/account/two-factor', icon: Smartphone },
];

export default function RecruiterUserMenuDropdown({ onClose }: RecruiterUserMenuDropdownProps) {
  const logout = useLogout();

  return (
    <div
      className="absolute top-12 right-0 z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-slate-800 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <nav className="space-y-0.5">
        {LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <Icon className="h-4 w-4 shrink-0 text-slate-400" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="my-1.5 border-t border-slate-100" />

      <button
        type="button"
        disabled={logout.isPending}
        onClick={() => logout.mutate()}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        <span>Sign out</span>
      </button>
    </div>
  );
}
