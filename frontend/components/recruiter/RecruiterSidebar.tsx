'use client';

import { RECRUITER_NAV_SECTIONS } from '@/constants/recruiter-nav';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useCompanyVerification } from '@/hooks/useCompanyVerification';
import { useUnreadCount } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import { HelpCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface RecruiterSidebarProps {
  isCollapsed: boolean;
  className?: string;
  onNavigate?: () => void;
}

export default function RecruiterSidebar({ isCollapsed, className, onNavigate }: RecruiterSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { profile, company } = useCompanyVerification();
  const { total: unreadNotificationsCount } = useUnreadCount('recruiter');

  const isVerified = profile.canPublish || profile.level === 3;

  return (
    <aside className={cn('scrollbar-on-hover shrink-0 bg-white', isCollapsed ? 'lg:w-20' : 'lg:w-72', className)}>
      <div className={isCollapsed ? 'flex justify-center p-3' : 'p-5'}>
        <div className={isCollapsed ? '' : 'flex items-center gap-3.5'}>
          <div
            className={`from-primary flex shrink-0 items-center justify-center rounded-2xl bg-linear-to-tr to-[#00d660] font-bold text-white shadow-sm ${
              isCollapsed ? 'h-10 w-10 text-base' : 'h-12 w-12 text-lg'
            }`}
          >
            {user?.name.charAt(0).toUpperCase()}
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-label-sm text-on-surface-variant">Recruiter</p>
              <h3 className="text-navy text-body-lg truncate font-bold">{user?.name}</h3>
              <p className="text-body-sm text-on-surface-variant truncate">{company?.name || 'No company linked'}</p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="text-body-sm mt-3 flex items-center gap-1.5">
            <span className="text-on-surface-variant">Account verification:</span>
            <span
              className={cn(
                'font-bold',
                isVerified ? 'text-primary' : profile.level === 2 ? 'text-blue-600' : 'text-amber-600',
              )}
            >
              Level {profile.level}/3
            </span>
            <span title="Finish verification to publish job posts and reach candidates more effectively">
              <HelpCircle className="text-outline h-3.5 w-3.5" />
            </span>
          </div>
        )}

        {!isCollapsed && isVerified && (
          <Link
            href={ROUTES.RECRUITER_COMPANY_VERIFICATION}
            onClick={onNavigate}
            className="bg-primary text-body-sm mt-3 flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 font-bold text-white shadow-xs transition-colors hover:bg-[#009b45]"
          >
            <ShieldCheck className="h-4 w-4 text-white" />
            <span>Verified Enterprise</span>
          </Link>
        )}

        {!isCollapsed && !isVerified && (
          <Link
            href={ROUTES.RECRUITER_COMPANY_VERIFICATION}
            onClick={onNavigate}
            className="bg-primary text-body-sm mt-3 flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 font-bold text-white shadow-xs transition-colors hover:bg-[#009b45]"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>
              Verify Account ({profile.stepsCompleted}/{profile.stepsTotal})
            </span>
          </Link>
        )}
      </div>

      {RECRUITER_NAV_SECTIONS.map((section, sectionIndex) => (
        <nav key={section.title} aria-label={section.title} className="space-y-0.5 px-2 py-1">
          {sectionIndex > 0 && <div className="border-outline-variant mx-1 my-2 border-t" />}

          {section.items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                title={isCollapsed ? item.label : undefined}
                className={`text-body-md flex items-center rounded-xl py-2.5 transition ${
                  isCollapsed ? 'justify-center px-2' : 'justify-between px-2.5'
                } ${isActive ? 'font-bold' : 'text-on-surface-variant hover:bg-surface-container-low font-medium'}`}
              >
                <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                  <span
                    className={`flex shrink-0 items-center justify-center rounded-full transition-colors ${
                      isCollapsed ? 'h-9 w-9' : 'h-8 w-8'
                    } ${isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant'}`}
                  >
                    <Icon className={isCollapsed ? 'h-5 w-5' : 'h-4.5 w-4.5'} />
                  </span>
                  {!isCollapsed && <span className={isActive ? 'text-primary' : ''}>{item.label}</span>}
                </div>

                {!isCollapsed && item.href === ROUTES.RECRUITER_NOTIFICATIONS && unreadNotificationsCount > 0 && (
                  <span className="bg-primary text-label-sm rounded-full px-2 py-0.5 font-bold text-white shadow-2xs">
                    {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                  </span>
                )}

                {!isCollapsed && item.comingSoon && (
                  <span className="bg-surface-container-high text-label-sm text-on-surface-variant rounded-full px-2 py-0.5 font-semibold">
                    Coming soon
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      ))}

      {!isCollapsed && (
        <div className="border-outline-variant text-label-sm mt-4 space-y-1 border-t px-4 pt-4 pb-5">
          {/* TODO: wire to real legal routes once they exist */}
          <a href="#" className="text-primary block hover:underline">
            Privacy policy
          </a>
          <a href="#" className="text-primary block hover:underline">
            Cookie policy
          </a>
          <a href="#" className="text-primary block hover:underline">
            Terms of service
          </a>
          <p className="text-outline pt-2">Version 1.0.0</p>
          <p className="text-outline">© 2024 - 2026 InterVue Vietnam JSC. All rights reserved.</p>
        </div>
      )}
    </aside>
  );
}
