'use client';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useLogout';
import { Bell, BellRing, LogOut, ScrollText, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface AdminUserMenuDropdownProps {
  onClose: () => void;
}

const LINKS = [
  { label: 'Notifications', href: ROUTES.ADMIN_NOTIFICATIONS, icon: Bell },
  { label: 'Audit log', href: ROUTES.ADMIN_AUDIT_LOG, icon: ScrollText },
  { label: 'Security & Two-Factor (2FA)', href: ROUTES.ADMIN_ACCOUNT_SECURITY, icon: ShieldCheck },
  { label: 'Notification preferences', href: ROUTES.ADMIN_ACCOUNT_NOTIFICATIONS, icon: BellRing },
];

export default function AdminUserMenuDropdown({ onClose }: AdminUserMenuDropdownProps) {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <div
      className="border-outline-variant text-on-surface shadow-elevation-2 absolute top-12 right-0 z-50 w-72 overflow-hidden rounded-xl border bg-white p-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 pt-2 pb-3">
        <p className="text-body-md text-on-surface truncate font-bold">{user?.name}</p>
        <p className="text-on-surface-variant mt-0.5 truncate text-xs">{user?.email}</p>
        <span className="text-label-sm mt-2 inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 font-bold tracking-wide text-white uppercase">
          Administrator
        </span>
      </div>

      <div className="border-outline-variant mb-1.5 border-t" />

      <nav className="space-y-0.5">
        {LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="text-body-md text-on-surface hover:bg-surface-container-low hover:text-on-surface flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium transition-colors"
            >
              <Icon className="text-outline h-4 w-4 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-outline-variant my-1.5 border-t" />

      <button
        type="button"
        disabled={logout.isPending}
        onClick={() => logout.mutate()}
        className="text-body-md flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        <span>Sign out</span>
      </button>
    </div>
  );
}
