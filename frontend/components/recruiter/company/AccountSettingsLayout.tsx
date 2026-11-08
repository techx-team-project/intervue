'use client';

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ROUTES } from '@/constants/routes';
import { Briefcase, Building2, FileText, KeyRound, RefreshCw, Settings, Share2, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AccountSettingsLayoutProps {
  children: React.ReactNode;
  activeTab: 'company' | 'license' | 'agreements' | 'password' | 'account' | 'needs';
  pageTitle?: string;
  nextStepOverride?: { label: string; href: string };
}

export function AccountSettingsLayout({
  children,
  activeTab,
  pageTitle = 'Account Settings',
}: AccountSettingsLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    {
      id: 'password',
      label: 'Change Password',
      icon: KeyRound,
      href: '#',
      disabled: true,
    },
    {
      id: 'account',
      label: 'Account Profile',
      icon: User,
      href: '#',
      disabled: true,
    },
    {
      id: 'license',
      label: 'Business License & LOA',
      icon: FileText,
      href: ROUTES.RECRUITER_COMPANY_LICENSE,
      isActive: activeTab === 'license' || pathname.includes('/license'),
    },
    {
      id: 'agreements',
      label: 'Personal Data Protection',
      icon: ShieldCheck,
      href: ROUTES.RECRUITER_COMPANY_AGREEMENTS,
      isActive: activeTab === 'agreements' || pathname.includes('/agreements'),
    },
    {
      id: 'company',
      label: 'Company Profile',
      icon: Building2,
      href: ROUTES.RECRUITER_COMPANY,
      isActive:
        activeTab === 'company' || (pathname.startsWith('/recruiter/company') && !pathname.includes('/verification')),
    },
    {
      id: 'needs',
      label: 'Hiring Needs',
      icon: Briefcase,
      href: ROUTES.RECRUITER_COMPANY_NEEDS,
      disabled: false,
      isActive: activeTab === 'needs' || pathname.includes('/needs'),
    },
    {
      id: 'system',
      label: 'Integrations & API',
      icon: Share2,
      href: '#',
      disabled: true,
    },
    {
      id: 'sync',
      label: 'Sync Applications',
      icon: RefreshCw,
      href: '#',
      disabled: true,
    },
    {
      id: 'settings',
      label: 'Preferences',
      icon: Settings,
      href: '#',
      disabled: true,
    },
  ];

  const breadcrumbItems = [
    { label: 'Workspace', href: ROUTES.RECRUITER_DASHBOARD },
    { label: 'Company Verification', href: ROUTES.RECRUITER_COMPANY_VERIFICATION },
    { label: pageTitle },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Main Settings Frame (TopCV Sharp Clean Frame) */}
      <div className="border-outline-variant/90 mx-auto max-w-7xl overflow-hidden rounded-lg border bg-white shadow-2xs">
        {/* Header */}
        <div className="border-outline-variant bg-surface-container-low/80 border-b px-6 py-3.5">
          <h1 className="text-on-surface text-base font-bold sm:text-lg">{pageTitle}</h1>
        </div>

        {/* 2-column settings grid */}
        <div className="grid min-h-[600px] grid-cols-1 md:grid-cols-12">
          {/* Left Settings Sidebar */}
          <aside className="border-outline-variant bg-surface-container-low/40 space-y-1 border-b p-4 md:col-span-4 md:border-r md:border-b-0 lg:col-span-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.disabled) {
                return (
                  <div
                    key={item.id}
                    className="text-outline flex cursor-not-allowed items-center gap-3 rounded-md px-3.5 py-2 text-xs font-medium select-none sm:text-sm"
                  >
                    <Icon className="text-outline h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3.5 py-2 text-xs font-medium transition-colors sm:text-sm ${
                    item.isActive
                      ? 'text-primary bg-emerald-50/80 font-semibold'
                      : 'text-on-surface hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${item.isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </aside>

          {/* Right Main Content */}
          <main className="p-6 md:col-span-8 lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
