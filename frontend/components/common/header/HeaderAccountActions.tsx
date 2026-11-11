'use client';

import NotificationDropdown from '@/components/common/NotificationDropdown';
import { buttonClassName } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useCandidateUnreadCount } from '@/hooks/useCandidateConnect';
import { useConnectUnreadCount } from '@/hooks/useRecruiterConnect';
import { useUnreadCount } from '@/hooks/useNotifications';
import { Bell, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import UserMenuDropdown from './UserMenuDropdown';

const MENU_CLOSE_DELAY_MS = 300;

interface HeaderAccountActionsProps {
  portal?: 'candidate' | 'recruiter';
}

export default function HeaderAccountActions({ portal = 'candidate' }: HeaderAccountActionsProps = {}) {
  const { user, status } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const realm = portal === 'recruiter' ? 'recruiter' : 'candidate';
  const isRecruiter = portal === 'recruiter';
  const candidateConnectUnread = useCandidateUnreadCount();
  const recruiterConnectUnread = useConnectUnreadCount();
  const connectUnread = isRecruiter ? recruiterConnectUnread : candidateConnectUnread;
  const { total: unreadCount } = useUnreadCount(realm, Boolean(user));
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
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsUserMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      if (userCloseTimeoutRef.current) {
        clearTimeout(userCloseTimeoutRef.current);
      }
    };
  }, []);

  if (status === 'idle' || status === 'loading') {
    return <div className="bg-surface-container-high h-10 w-24 animate-pulse rounded-full" aria-hidden />;
  }

  if (!user) {
    const isRecruiter = portal === 'recruiter';
    return (
      <div className="hidden items-center gap-2 sm:flex">
        <Link
          href={isRecruiter ? ROUTES.RECRUITER_REGISTER : ROUTES.REGISTER}
          className={buttonClassName({ variant: 'outline', size: 'xl' })}
        >
          Sign up
        </Link>
        <Link href={isRecruiter ? ROUTES.RECRUITER_LOGIN : ROUTES.LOGIN} className={buttonClassName({ size: 'xl' })}>
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 sm:gap-3.5 md:gap-4">
      <div className="relative">
        <button
          type="button"
          aria-label="Notifications"
          aria-expanded={isNotificationOpen}
          onClick={() => setIsNotificationOpen((prev) => !prev)}
          className="state-layer text-on-surface-variant relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
        >
          <Bell className="h-5 w-5" aria-hidden />
          {unreadCount > 0 && (
            <span className="bg-error text-on-error text-label-sm absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <NotificationDropdown
          realm={realm}
          baseRoute={realm === 'recruiter' ? ROUTES.RECRUITER_NOTIFICATIONS : ROUTES.NOTIFICATIONS}
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      </div>

      <Link
        href={isRecruiter ? ROUTES.RECRUITER_MESSAGES : ROUTES.CANDIDATE_CONVERSATIONS}
        title="InterVue Connect"
        className="state-layer text-on-surface-variant relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
      >
        <MessageSquare className="h-5 w-5" aria-hidden />
        {connectUnread > 0 && (
          <span className="bg-error text-on-error text-label-sm absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1">
            {connectUnread > 99 ? '99+' : connectUnread}
          </span>
        )}
      </Link>

      <div
        ref={userMenuRef}
        className="relative"
        onMouseEnter={handleUserMouseEnter}
        onMouseLeave={handleUserMouseLeave}
      >
        <button
          type="button"
          onClick={() => setIsUserMenuOpen((prev) => !prev)}
          aria-label="Account"
          aria-haspopup="menu"
          aria-expanded={isUserMenuOpen}
          className="state-layer flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
        >
          <span className="bg-primary text-on-primary text-title-sm flex h-8 w-8 items-center justify-center rounded-full">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </button>

        {isUserMenuOpen && (
          <UserMenuDropdown
            portal={portal}
            onClose={() => setIsUserMenuOpen(false)}
            onMouseEnter={handleUserMouseEnter}
            onMouseLeave={handleUserMouseLeave}
          />
        )}
      </div>
    </div>
  );
}
