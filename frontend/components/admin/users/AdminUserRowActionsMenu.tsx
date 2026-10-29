'use client';

import { ROUTES } from '@/constants/routes';
import type { AdminUserConfirmKind } from '@/hooks/useAdminUserActions';
import type { AdminUserListItem, AdminUserRestrictionKind } from '@/types/admin-user';
import {
  Ban,
  CircleCheck,
  Eye,
  KeyRound,
  Lock,
  LogOut,
  MoreVertical,
  ShieldCheck,
  ShieldOff,
  Unlock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface AdminUserRowActionsMenuProps {
  user: AdminUserListItem;
  lockBlockedReason: string | null;
  banBlockedReason: string | null;
  onRestrict: (kind: AdminUserRestrictionKind, user: AdminUserListItem) => void;
  onConfirm: (kind: AdminUserConfirmKind, user: AdminUserListItem) => void;
}

interface MenuAction {
  key: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
  tone?: 'default' | 'danger';
  disabledReason?: string;
}

const MENU_WIDTH = 224;
const MENU_OFFSET = 6;
const VIEWPORT_PADDING = 12;
const ITEM_HEIGHT = 36;

export default function AdminUserRowActionsMenu({
  user,
  lockBlockedReason,
  banBlockedReason,
  onRestrict,
  onConfirm,
}: AdminUserRowActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeMenu = () => setIsOpen(false);
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', closeMenu);
    window.addEventListener('scroll', closeMenu, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', closeMenu);
      window.removeEventListener('scroll', closeMenu, true);
    };
  }, [isOpen]);

  const detailHref = `${ROUTES.ADMIN_USERS}/${user.id}`;

  const actions: MenuAction[] = [
    { key: 'view', label: 'View details', icon: Eye, href: detailHref },
    { key: 'roles', label: 'Manage roles', icon: ShieldCheck, href: `${detailHref}?tab=roles` },
    {
      key: 'sessions',
      label: 'Revoke all sessions',
      icon: LogOut,
      onClick: () => onConfirm('revokeSessions', user),
      disabledReason: user.activeSessionCount === 0 ? 'No active session on this account' : undefined,
    },
    { key: 'two-factor', label: 'Reset two-factor', icon: ShieldOff, onClick: () => onConfirm('resetTwoFactor', user) },
    {
      key: 'password',
      label: 'Send password reset',
      icon: KeyRound,
      onClick: () => onConfirm('sendPasswordReset', user),
      disabledReason: user.emailVerifiedAt === null ? 'The email address is not verified' : undefined,
    },
  ];

  if (user.status === 'LOCKED') {
    actions.push({ key: 'unlock', label: 'Unlock account', icon: Unlock, onClick: () => onConfirm('unlock', user) });
  } else if (user.status !== 'BANNED') {
    actions.push({
      key: 'lock',
      label: 'Lock account',
      icon: Lock,
      onClick: () => onRestrict('lock', user),
      disabledReason: lockBlockedReason ?? undefined,
    });
  }

  if (user.status === 'BANNED') {
    actions.push({ key: 'unban', label: 'Unban account', icon: CircleCheck, onClick: () => onConfirm('unban', user) });
  } else {
    actions.push({
      key: 'ban',
      label: 'Ban account',
      icon: Ban,
      onClick: () => onRestrict('ban', user),
      tone: 'danger',
      disabledReason: banBlockedReason ?? undefined,
    });
  }

  // Portalled to the body so the menu is not clipped by the horizontally
  // scrollable table wrapper it sits inside.
  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const estimatedHeight = actions.length * ITEM_HEIGHT + 12;
    const fitsBelow = rect.bottom + MENU_OFFSET + estimatedHeight < window.innerHeight - VIEWPORT_PADDING;

    setPosition({
      top: fitsBelow ? rect.bottom + MENU_OFFSET : Math.max(VIEWPORT_PADDING, rect.top - MENU_OFFSET - estimatedHeight),
      left: Math.min(
        Math.max(VIEWPORT_PADDING, rect.right - MENU_WIDTH),
        window.innerWidth - MENU_WIDTH - VIEWPORT_PADDING,
      ),
    });
    setIsOpen(true);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleMenu}
        aria-label={`Actions for ${user.name}`}
        aria-expanded={isOpen}
        className="dark:text-forest-300 dark:hover:bg-forest-850 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 sm:h-8 sm:w-8"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="dark:border-forest-800 dark:bg-forest-900 fixed z-[60] overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-2xl"
          >
            {actions.map((action) => {
              const Icon = action.icon;
              const base =
                'flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] font-medium transition-colors';
              const tone =
                action.tone === 'danger'
                  ? 'text-rose-600'
                  : 'dark:text-forest-100 dark:hover:bg-forest-850 text-slate-700';

              if (action.disabledReason) {
                return (
                  <span
                    key={action.key}
                    title={action.disabledReason}
                    aria-disabled
                    className={`${base} dark:text-forest-400 cursor-not-allowed text-slate-400`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{action.label}</span>
                  </span>
                );
              }

              if (action.href) {
                return (
                  <Link
                    key={action.key}
                    href={action.href}
                    onClick={() => setIsOpen(false)}
                    className={`${base} ${tone} cursor-pointer hover:bg-slate-50`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{action.label}</span>
                  </Link>
                );
              }

              return (
                <button
                  key={action.key}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    action.onClick?.();
                    setIsOpen(false);
                  }}
                  className={`${base} ${tone} cursor-pointer hover:bg-slate-50`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
