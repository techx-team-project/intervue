'use client';

import { ROUTES } from '@/constants/routes';
import { useLogout } from '@/hooks/useLogout';
import { Bell, Building2, KeyRound, LogOut, ShieldCheck, Smartphone } from 'lucide-react';
import Link from 'next/link';

interface RecruiterUserMenuDropdownProps {
  onClose: () => void;
}

const LINKS = [
  { label: 'Notifications', href: ROUTES.RECRUITER_NOTIFICATIONS, icon: Bell },
  { label: 'Company profile', href: '/recruiter/company', icon: Building2 },
  { label: 'Account security', href: ROUTES.RECRUITER_ACCOUNT_SECURITY, icon: ShieldCheck },
  { label: 'Change password', href: ROUTES.RECRUITER_ACCOUNT_PASSWORD, icon: KeyRound },
  { label: 'Two-factor authentication', href: ROUTES.RECRUITER_ACCOUNT_TWO_FACTOR, icon: Smartphone },
  { label: 'Notification preferences', href: ROUTES.RECRUITER_ACCOUNT_NOTIFICATIONS, icon: Bell },
];

export default function RecruiterUserMenuDropdown({ onClose }: RecruiterUserMenuDropdownProps) {
  const logout = useLogout();

  return (
    <div
      className="border-outline-variant text-on-surface shadow-elevation-2 absolute top-12 right-0 z-50 w-72 overflow-hidden rounded-2xl border bg-white p-2"
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
