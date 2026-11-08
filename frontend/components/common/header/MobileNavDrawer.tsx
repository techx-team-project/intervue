'use client';

import { buttonClassName } from '@/components/ui/Button';
import {
  CANDIDATE_CV_MENU,
  CANDIDATE_GUIDE_MENU,
  CANDIDATE_JOBS_MENU,
  RECRUITER_NAV_LINKS,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_HREF,
} from '@/constants/header';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useLogout';
import { ArrowLeft, PhoneCall } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

const ITEM_CLASS = 'state-layer text-label-lg text-on-surface flex h-12 items-center rounded-full px-4';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  portal?: 'candidate' | 'recruiter';
}

export function MobileNavDrawer({ isOpen, onClose, portal = 'candidate' }: MobileNavDrawerProps) {
  const { user, isLoading } = useAuth();
  const logout = useLogout();
  const isRecruiter = portal === 'recruiter';

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const links = isRecruiter
    ? RECRUITER_NAV_LINKS
    : [...CANDIDATE_JOBS_MENU, ...CANDIDATE_CV_MENU, ...CANDIDATE_GUIDE_MENU];

  return (
    <>
      <div className="fixed inset-0 top-22.5 z-40 bg-black/40 lg:hidden" onClick={onClose} aria-hidden="true" />
      <nav
        aria-label="Điều hướng di động"
        className="bg-surface border-outline-variant relative z-50 space-y-1 border-t px-4 py-4 lg:hidden"
      >
        {isRecruiter && (
          <Link href={ROUTES.HOME} onClick={onClose} className={ITEM_CLASS}>
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
            Dành cho người tìm việc
          </Link>
        )}

        {links.map((item) => (
          <Link key={item.href} href={item.href} onClick={onClose} className={ITEM_CLASS}>
            {item.label}
          </Link>
        ))}

        {isRecruiter ? (
          <a href={SUPPORT_PHONE_HREF} className={ITEM_CLASS}>
            <PhoneCall className="mr-2 h-4 w-4" aria-hidden />
            Hotline: {SUPPORT_PHONE}
          </a>
        ) : (
          <>
            <a href={`mailto:${SUPPORT_EMAIL}`} className={ITEM_CLASS}>
              Trợ giúp
            </a>
            <Link
              href={ROUTES.RECRUITER_LANDING}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className={ITEM_CLASS}
            >
              Dành cho nhà tuyển dụng
            </Link>
          </>
        )}

        {!isLoading && (
          <div className="border-outline-variant flex flex-col gap-2 border-t pt-4">
            {user ? (
              <>
                <Link
                  href={isRecruiter ? ROUTES.RECRUITER_DASHBOARD : '/account'}
                  onClick={onClose}
                  className={buttonClassName({ variant: 'outline' })}
                >
                  {isRecruiter ? `Vào trang quản trị (${user.name})` : user.name}
                </Link>
                <button
                  type="button"
                  disabled={logout.isPending}
                  onClick={() => {
                    logout.mutate();
                    onClose();
                  }}
                  className={buttonClassName({ variant: 'secondary' })}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  href={isRecruiter ? ROUTES.RECRUITER_REGISTER : ROUTES.REGISTER}
                  onClick={onClose}
                  className={buttonClassName({ variant: 'outline' })}
                >
                  Đăng ký
                </Link>
                <Link
                  href={isRecruiter ? ROUTES.RECRUITER_LOGIN : ROUTES.LOGIN}
                  onClick={onClose}
                  className={buttonClassName()}
                >
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

export default MobileNavDrawer;
