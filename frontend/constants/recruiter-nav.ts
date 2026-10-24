import { ROUTES } from '@/constants/routes';
import {
  BarChart3,
  Bell,
  Bookmark,
  Briefcase,
  Building2,
  CalendarClock,
  ClipboardList,
  KeyRound,
  LayoutDashboard,
  MessageSquare,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface RecruiterNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  comingSoon?: boolean;
}

export interface RecruiterNavSection {
  title: string;
  items: RecruiterNavItem[];
}

export const RECRUITER_NAV_SECTIONS: RecruiterNavSection[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', href: ROUTES.RECRUITER_DASHBOARD, icon: LayoutDashboard }],
  },
  {
    title: 'Hiring',
    items: [
      { label: 'Hiring campaigns', href: ROUTES.RECRUITER_CAMPAIGNS, icon: Briefcase, comingSoon: true },
      { label: 'Job posts', href: ROUTES.RECRUITER_JOBS, icon: ClipboardList },
      { label: 'Applications', href: ROUTES.RECRUITER_APPLICATIONS, icon: Users },
      { label: 'Saved candidates', href: ROUTES.RECRUITER_CANDIDATES_SAVED, icon: Bookmark },
      { label: 'Candidate search', href: ROUTES.RECRUITER_CANDIDATES, icon: Users, comingSoon: true },
      { label: 'Interviews', href: ROUTES.RECRUITER_INTERVIEWS, icon: CalendarClock, comingSoon: true },
      { label: 'Messages', href: ROUTES.RECRUITER_MESSAGES, icon: MessageSquare, comingSoon: true },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'Company profile', href: ROUTES.RECRUITER_COMPANY, icon: Building2 },
      {
        label: 'Company verification',
        href: ROUTES.RECRUITER_COMPANY_VERIFICATION,
        icon: ShieldCheck,
      },
      { label: 'Hiring needs', href: ROUTES.RECRUITER_COMPANY_NEEDS, icon: ClipboardList, comingSoon: true },
    ],
  },
  {
    title: 'Services',
    items: [
      { label: 'Service packages', href: ROUTES.RECRUITER_SERVICES, icon: ShoppingBag, comingSoon: true },
      { label: 'Transaction history', href: ROUTES.RECRUITER_SERVICES_TRANSACTIONS, icon: Receipt, comingSoon: true },
    ],
  },
  {
    title: 'Reports & notifications',
    items: [
      { label: 'Hiring reports', href: ROUTES.RECRUITER_REPORTS, icon: BarChart3, comingSoon: true },
      { label: 'Notifications', href: ROUTES.RECRUITER_NOTIFICATIONS, icon: Bell, comingSoon: true },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Account security', href: '/account/security', icon: ShieldCheck },
      { label: 'Change password', href: '/account/password', icon: KeyRound },
      { label: 'Two-factor authentication', href: '/account/two-factor', icon: Smartphone },
    ],
  },
];
