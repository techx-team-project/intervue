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

      {/* Main Settings Frame */}
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-4">
          <h1 className="text-lg font-bold text-slate-900 sm:text-xl">{pageTitle}</h1>
        </div>

        {/* 2-column settings grid */}
        <div className="grid min-h-[600px] grid-cols-1 md:grid-cols-12">
          {/* Left Settings Sidebar */}
          <aside className="space-y-1 border-b border-slate-200 bg-slate-50/40 p-4 md:col-span-4 md:border-r md:border-b-0 lg:col-span-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.disabled) {
                return (
                  <div
                    key={item.id}
                    className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-400 select-none sm:text-sm"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>{item.label}</span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all sm:text-sm ${
                    item.isActive
                      ? 'bg-emerald-50 font-semibold text-[#00b14f] shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${item.isActive ? 'text-[#00b14f]' : 'text-slate-500'}`} />
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
