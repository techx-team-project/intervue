'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { useLogout } from '@/hooks/useLogout';
import {
  ArrowUpCircle,
  Bell,
  Briefcase,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HelpCircle,
  KeyRound,
  LogOut,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User,
} from 'lucide-react';

const MENU_ITEMS = [
  {
    href: '/account',
    label: 'Job search & CV settings',
    icon: Briefcase,
  },
  {
    href: '/upgrade',
    label: 'Upgrade to VIP',
    icon: Sparkles,
  },
  {
    href: '/account/security',
    label: 'Account security',
    icon: ShieldCheck,
  },
  {
    href: '/account/password',
    label: 'Change password',
    icon: KeyRound,
  },
  {
    href: '/account/two-factor',
    label: 'Two-factor authentication',
    icon: Smartphone,
  },
  {
    href: '/account/notification-preferences',
    label: 'Notification preferences',
    icon: Bell,
  },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const logout = useLogout();
  const [isSuggestJob, setIsSuggestJob] = useState(false);
  const [isJobSeeking, setIsJobSeeking] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  return (
    <aside className="w-full shrink-0 space-y-4 lg:w-80">
      <div className="border-outline-variant rounded-2xl border bg-white p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <span className="text-label-sm absolute -top-2 left-1/2 -translate-x-1/2 rounded bg-[#526477] px-1.5 py-0.5 font-bold tracking-wider text-white uppercase shadow-2xs">
              VERIFIED
            </span>

            <div className="bg-surface-container-high text-outline flex h-16 w-16 items-center justify-center overflow-hidden rounded-full ring-2 ring-slate-200/80">
              <User className="text-outline h-10 w-10 translate-y-1" />
            </div>

            <button
              type="button"
              title="Update profile photo"
              className="bg-primary hover:bg-primary-hover absolute -right-0.5 -bottom-0.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-white shadow-sm ring-2 ring-white transition-transform"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-body-sm text-on-surface-variant">Welcome back,</p>
            <h3 className="text-navy text-body-lg truncate font-bold">An Lâm Hoàng</h3>
            <div className="mt-1">
              <span className="text-label-sm inline-block rounded bg-[#526477] px-2 py-0.5 font-semibold text-white">
                Verified account
              </span>
            </div>
            <Link
              href="/upgrade"
              className="text-navy bg-surface-container-low text-label-sm hover:bg-surface-container-high mt-1.5 inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold transition-colors"
            >
              <ArrowUpCircle className="text-primary h-3.5 w-3.5" />
              <span>Upgrade account</span>
            </Link>
          </div>
        </div>

        <div className="border-outline-variant mt-4 border-t pt-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span className="text-navy text-body-md font-bold">Job suggestions</span>
              <button
                type="button"
                title="Turn on notifications about matching job opportunities"
                className="text-outline hover:text-on-surface-variant"
              >
                <HelpCircle className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsSuggestJob(!isSuggestJob)}
              className={`text-label-sm cursor-pointer rounded-full border px-3 py-1 font-bold transition ${
                isSuggestJob
                  ? 'border-primary bg-primary-light text-primary'
                  : 'border-primary text-primary hover:bg-primary-light'
              }`}
            >
              {isSuggestJob ? 'On' : 'Turn on'}
            </button>
          </div>
        </div>

        <div className="border-outline-variant mt-4 border-t pt-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-body-md font-bold ${isJobSeeking ? 'text-primary' : 'text-on-surface-variant'}`}>
              {isJobSeeking ? 'Job search is on' : 'Job search is off'}
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={isJobSeeking}
              onClick={() => setIsJobSeeking(!isJobSeeking)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isJobSeeking ? 'bg-primary' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  isJobSeeking ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="mt-2.5">
            <p className="text-label-sm text-on-surface-variant">When job search is on:</p>
            <div className="text-label-sm text-on-surface-variant mt-1.5 space-y-1.5 leading-relaxed">
              <div className="flex items-start gap-1.5">
                <Check className="text-outline mt-0.5 h-3.5 w-3.5 shrink-0 stroke-2" />
                <span>
                  Recruiters can <strong className="text-navy font-semibold">find you</strong> and bring you relevant
                  opportunities (see the recruiter search setting below).
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <Check className="text-outline mt-0.5 h-3.5 w-3.5 shrink-0 stroke-2" />
                <span>
                  Your profile is <strong className="text-navy font-semibold">highlighted</strong> in recruiter search
                  results.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-outline-variant mt-4 border-t pt-3.5">
          <h4 className="text-navy text-body-md font-bold">Let recruiters find your profile</h4>
          <p className="text-label-sm text-on-surface-variant mt-1 leading-relaxed">
            You do not have a CV yet. Create one to start receiving invitations from trusted recruiters.
          </p>

          <Link
            href={ROUTES.CANDIDATE_PROFILE}
            className="border-primary text-primary text-body-sm hover:bg-primary-light mt-2.5 inline-flex items-center justify-center rounded-full border bg-white px-3.5 py-1 font-bold transition active:scale-[0.98]"
          >
            Create a CV
          </Link>

          <div className="border-outline-variant bg-surface-container-low text-label-sm text-on-surface-variant mt-3 rounded-xl border p-2.5 leading-relaxed">
            <p>
              When you let recruiters search for your profile, trusted recruiters can see the work experience, education
              and skills on your CV.
            </p>

            <button
              type="button"
              onClick={() => setShowMoreInfo(!showMoreInfo)}
              className="text-navy hover:text-primary mt-1.5 flex cursor-pointer items-center gap-1 font-semibold"
            >
              <span>Learn more</span>
              {showMoreInfo ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            {showMoreInfo && (
              <div className="border-outline-variant/70 text-label-sm text-on-surface-variant mt-2 border-t pt-2">
                InterVue only shares your data with companies that passed identity verification. You can change this
                setting at any time in Account settings.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-outline-variant rounded-2xl border bg-white p-3 shadow-xs">
        <div className="text-label-sm text-outline px-3 py-2 font-bold tracking-wider uppercase">Account</div>

        <nav className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-body-md flex items-center justify-between rounded-xl px-3.5 py-2.5 font-medium transition ${
                  isActive
                    ? 'border-primary/30 text-primary border bg-emerald-50/70 font-bold'
                    : 'hover:text-navy text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-outline-variant my-2 border-t" />

        <Link
          href={ROUTES.CANDIDATE_PROFILE}
          className="hover:text-primary text-body-md text-on-surface-variant flex items-center justify-between rounded-xl px-3.5 py-2.5 font-medium transition hover:bg-emerald-50/50"
        >
          <div className="flex items-center gap-3">
            <User className="text-on-surface-variant h-4.5 w-4.5 shrink-0" />
            <span>Candidate profile</span>
          </div>
          <ExternalLink className="text-outline h-3.5 w-3.5" />
        </Link>

        <button
          type="button"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
          className="text-body-md text-error hover:bg-error/10 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          <span>Sign out</span>
        </button>
      </div>

      <div className="bg-primary relative overflow-hidden rounded-2xl p-4 text-white shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-body-lg flex items-center gap-1 font-bold tracking-tight">
              <span className="text-white">inter</span>
              <span className="text-[#00e066]">vue</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#00e066]" />
            </div>

            <div className="text-body-sm mt-2 leading-snug font-bold">Get the InterVue app!</div>
            <p className="text-label-sm mt-1 leading-relaxed text-white/80">
              So you never miss an opportunity from a recruiter
            </p>
          </div>

          <div className="shadow-elevation-1 shrink-0 rounded-xl bg-white p-1.5">
            <svg
              viewBox="0 0 29 29"
              className="h-16 w-16 text-[#0f2c25]"
              fill="currentColor"
              aria-label="App download QR code"
            >
              <path d="M2 2h7v7H2V2zm2 2v3h3V4H4z" />
              <rect x="5" y="5" width="1" height="1" />
              <path d="M20 2h7v7h-7V2zm2 2v3h3V4h-3z" />
              <rect x="23" y="5" width="1" height="1" />
              <path d="M2 20h7v7H2v-7zm2 2v3h3v-3H4z" />
              <rect x="5" y="23" width="1" height="1" />
              <rect x="11" y="3" width="1" height="1" />
              <rect x="13" y="3" width="2" height="1" />
              <rect x="16" y="3" width="1" height="1" />
              <rect x="11" y="5" width="1" height="2" />
              <rect x="14" y="5" width="2" height="1" />
              <rect x="17" y="6" width="1" height="1" />
              <rect x="3" y="11" width="1" height="1" />
              <rect x="5" y="11" width="2" height="1" />
              <rect x="8" y="11" width="1" height="1" />
              <rect x="10" y="10" width="1" height="2" />
              <rect x="12" y="11" width="2" height="1" />
              <rect x="15" y="10" width="2" height="2" />
              <rect x="19" y="11" width="1" height="1" />
              <rect x="22" y="11" width="2" height="1" />
              <rect x="25" y="11" width="1" height="1" />
              <rect x="11" y="14" width="2" height="1" />
              <rect x="14" y="13" width="1" height="2" />
              <rect x="16" y="14" width="2" height="1" />
              <rect x="11" y="17" width="1" height="2" />
              <rect x="13" y="16" width="2" height="1" />
              <rect x="16" y="17" width="1" height="1" />
              <rect x="11" y="21" width="2" height="1" />
              <rect x="14" y="20" width="1" height="2" />
              <rect x="17" y="21" width="2" height="1" />
              <rect x="12" y="24" width="1" height="2" />
              <rect x="15" y="23" width="2" height="1" />
              <rect x="21" y="14" width="2" height="1" />
              <rect x="24" y="15" width="2" height="2" />
              <rect x="20" y="18" width="1" height="2" />
              <rect x="23" y="19" width="2" height="1" />
              <rect x="20" y="23" width="2" height="1" />
              <rect x="24" y="22" width="2" height="2" />
              <rect x="22" y="25" width="2" height="1" />
            </svg>
          </div>
        </div>
      </div>
    </aside>
  );
}
