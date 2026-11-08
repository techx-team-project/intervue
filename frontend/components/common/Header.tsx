'use client';

import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import { buttonClassName } from '@/components/ui/Button';
import { ROLES } from '@/constants/auth';
import {
  CANDIDATE_CV_MENU,
  CANDIDATE_GUIDE_MENU,
  CANDIDATE_JOBS_MENU,
  RECRUITER_NAV_LINKS,
  SUPPORT_EMAIL,
} from '@/constants/header';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { ArrowLeft, Menu, PlusCircle, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import HeaderAccountActions from './header/HeaderAccountActions';
import MobileNavDrawer from './header/MobileNavDrawer';
import NavMenu from './header/NavMenu';
import RecruiterEntryButton from './header/RecruiterEntryButton';

const NAV_LINK_CLASS =
  'text-title-md text-on-surface hover:text-primary ease-standard flex h-12 items-center px-4 whitespace-nowrap transition-colors duration-150';

interface HeaderProps {
  portal?: 'candidate' | 'recruiter';
}

export default function Header({ portal = 'candidate' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, hasRole } = useAuth();
  const isRecruiterPortal = portal === 'recruiter';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const recruiterPostJobHref =
    user && hasRole(ROLES.RECRUITER)
      ? ROUTES.RECRUITER_JOBS_CREATE
      : `${ROUTES.RECRUITER_LOGIN}?redirect=${encodeURIComponent(ROUTES.RECRUITER_JOBS_CREATE)}`;

  return (
    <header
      className={cn(
        'bg-surface border-outline-variant ease-standard sticky top-0 z-50 w-full border-b transition-shadow duration-200',
        isScrolled && 'shadow-elevation-1',
      )}
    >
      <EmailVerificationBanner />
      <div className="flex h-22.5 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link
            href={isRecruiterPortal ? ROUTES.RECRUITER_LANDING : ROUTES.HOME}
            className="flex shrink-0 items-center gap-3"
          >
            <Image
              src="/intervue-logo.png"
              alt="InterVue"
              width={176}
              height={48}
              priority
              className="h-12 w-auto object-contain"
            />
            {isRecruiterPortal && (
              <span className="bg-primary-container text-on-primary-container text-label-md rounded-shape-sm px-2 py-1">
                Recruiter
              </span>
            )}
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
            {isRecruiterPortal ? (
              RECRUITER_NAV_LINKS.map((item) => (
                <Link key={item.href} href={item.href} className={NAV_LINK_CLASS}>
                  {item.label}
                </Link>
              ))
            ) : (
              <>
                <NavMenu label="Jobs" items={CANDIDATE_JOBS_MENU} />
                <NavMenu label="Create CV" items={CANDIDATE_CV_MENU} />
                <NavMenu label="Career guides" items={CANDIDATE_GUIDE_MENU} />
                <a href={`mailto:${SUPPORT_EMAIL}`} className={NAV_LINK_CLASS}>
                  Help
                </a>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isRecruiterPortal && (
            <>
              <Link href={ROUTES.HOME} className={`${NAV_LINK_CLASS} hidden xl:flex`}>
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
                For job seekers
              </Link>
            </>
          )}

          <HeaderAccountActions portal={portal} />

          {!isRecruiterPortal && <RecruiterEntryButton />}

          {isRecruiterPortal && (
            <Link
              href={recruiterPostJobHref}
              className={buttonClassName({ size: 'md', className: 'hidden gap-2 sm:inline-flex' })}
            >
              <PlusCircle className="h-4 w-4" aria-hidden />
              Post a job
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="state-layer text-on-surface flex h-12 w-12 cursor-pointer items-center justify-center rounded-full lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>
      </div>

      <MobileNavDrawer portal={portal} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
