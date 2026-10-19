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
    title: 'Tổng quan',
    items: [{ label: 'Bảng tin', href: ROUTES.RECRUITER_DASHBOARD, icon: LayoutDashboard }],
  },
  {
    title: 'Tuyển dụng',
    items: [
      { label: 'Chiến dịch tuyển dụng', href: ROUTES.RECRUITER_CAMPAIGNS, icon: Briefcase, comingSoon: true },
      { label: 'Tin tuyển dụng', href: ROUTES.RECRUITER_JOBS, icon: ClipboardList },
      { label: 'Hồ sơ ứng tuyển', href: ROUTES.RECRUITER_APPLICATIONS, icon: Users },
      { label: 'Ứng viên đã lưu', href: ROUTES.RECRUITER_CANDIDATES_SAVED, icon: Bookmark },
      { label: 'Tìm hồ sơ ứng viên', href: ROUTES.RECRUITER_CANDIDATES, icon: Users, comingSoon: true },
      { label: 'Lịch phỏng vấn', href: ROUTES.RECRUITER_INTERVIEWS, icon: CalendarClock, comingSoon: true },
      { label: 'Tin nhắn', href: ROUTES.RECRUITER_MESSAGES, icon: MessageSquare, comingSoon: true },
    ],
  },
  {
    title: 'Công ty',
    items: [
      { label: 'Hồ sơ công ty', href: ROUTES.RECRUITER_COMPANY, icon: Building2, comingSoon: true },
      {
        label: 'Xác thực doanh nghiệp',
        href: ROUTES.RECRUITER_COMPANY_VERIFICATION,
        icon: ShieldCheck,
        comingSoon: true,
      },
      { label: 'Nhu cầu tuyển dụng', href: ROUTES.RECRUITER_COMPANY_NEEDS, icon: ClipboardList, comingSoon: true },
    ],
  },
  {
    title: 'Dịch vụ',
    items: [
      { label: 'Gói dịch vụ', href: ROUTES.RECRUITER_SERVICES, icon: ShoppingBag, comingSoon: true },
      { label: 'Lịch sử giao dịch', href: ROUTES.RECRUITER_SERVICES_TRANSACTIONS, icon: Receipt, comingSoon: true },
    ],
  },
  {
    title: 'Báo cáo & Thông báo',
    items: [
      { label: 'Báo cáo tuyển dụng', href: ROUTES.RECRUITER_REPORTS, icon: BarChart3, comingSoon: true },
      { label: 'Thông báo', href: ROUTES.RECRUITER_NOTIFICATIONS, icon: Bell, comingSoon: true },
    ],
  },
  {
    title: 'Tài khoản',
    items: [
      { label: 'Bảo mật tài khoản', href: '/account/security', icon: ShieldCheck },
      { label: 'Đổi mật khẩu', href: '/account/password', icon: KeyRound },
      { label: 'Xác thực 2 bước (2FA)', href: '/account/two-factor', icon: Smartphone },
    ],
  },
];
