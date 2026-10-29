'use client';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useLogout';
import { Bell, KeyRound, LogOut, ScrollText, ShieldCheck, Smartphone } from 'lucide-react';
import Link from 'next/link';

interface AdminUserMenuDropdownProps {
  onClose: () => void;
}

const LINKS = [
  { label: 'Notifications', href: ROUTES.ADMIN_NOTIFICATIONS, icon: Bell },
  { label: 'Audit log', href: ROUTES.ADMIN_AUDIT_LOG, icon: ScrollText },
  { label: 'Account security', href: '/account/security', icon: ShieldCheck },
  { label: 'Change password', href: '/account/password', icon: KeyRound },
  { label: 'Two-factor authentication', href: '/account/two-factor', icon: Smartphone },
];

export default function AdminUserMenuDropdown({ onClose }: AdminUserMenuDropdownProps) {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <div
      className="absolute top-12 right-0 z-50 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 text-slate-800 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 pt-2 pb-3">
        <p className="truncate text-[13px] font-bold text-slate-900">{user?.name}</p>
        <p className="mt-0.5 truncate text-xs text-slate-500">{user?.email}</p>
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-black tracking-wide text-white uppercase">
          Administrator
        </span>
      </div>

      <div className="mb-1.5 border-t border-slate-100" />

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
