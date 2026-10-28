import { ROUTES } from '@/constants/routes';
import type { AdminNavSection } from '@/types/admin';
import {
  BadgeCheck,
  Building2,
  FileText,
  Flag,
  LayoutDashboard,
  LifeBuoy,
  Library,
  Package,
  ScrollText,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react';

export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    items: [{ label: 'Dashboard', href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard }],
  },
  {
    id: 'needs-action',
    title: 'Needs action',
    tone: 'action',
    items: [
      {
        label: 'Identity verification',
        href: ROUTES.ADMIN_VERIFICATION_IDENTITY,
        icon: BadgeCheck,
        queue: 'identityVerification',
        permission: 'verification.identity',
        comingSoon: true,
      },
      {
        label: 'Business verification',
        href: ROUTES.ADMIN_VERIFICATION_BUSINESS,
        icon: ShieldCheck,
        queue: 'businessVerification',
        permission: 'verification.business',
        comingSoon: true,
        children: [
          {
            label: 'Company info changes',
            href: ROUTES.ADMIN_VERIFICATION_COMPANY_CHANGES,
            queue: 'companyChanges',
            permission: 'verification.business',
            comingSoon: true,
          },
        ],
      },
      {
        label: 'Job posts',
        href: ROUTES.ADMIN_MODERATION_JOBS,
        icon: FileText,
        queue: 'jobPosts',
        permission: 'moderation.jobs',
        comingSoon: true,
      },
      {
        label: 'Reports',
        href: ROUTES.ADMIN_MODERATION_REPORTS,
        icon: Flag,
        queue: 'reports',
        permission: 'moderation.reports',
        comingSoon: true,
      },
      {
        label: 'Support tickets',
        href: ROUTES.ADMIN_SUPPORT_TICKETS,
        icon: LifeBuoy,
        queue: 'supportTickets',
        permission: 'support.manage',
        comingSoon: true,
        children: [
          {
            label: 'Consultation requests',
            href: ROUTES.ADMIN_SUPPORT_CONSULTATIONS,
            queue: 'consultationRequests',
            permission: 'support.manage',
            comingSoon: true,
          },
        ],
      },
    ],
  },
  {
    id: 'manage',
    title: 'Manage',
    items: [
      {
        label: 'Users',
        icon: Users,
        children: [
          { label: 'All users', href: ROUTES.ADMIN_USERS, permission: 'users.manage', comingSoon: true },
          { label: 'Admin accounts', href: ROUTES.ADMIN_ADMINS, permission: 'users.admins', comingSoon: true },
        ],
      },
      {
        label: 'Companies',
        href: ROUTES.ADMIN_COMPANIES,
        icon: Building2,
        permission: 'users.manage',
        comingSoon: true,
      },
      {
        label: 'Catalogs',
        icon: Library,
        children: [
          { label: 'Positions', href: ROUTES.ADMIN_CATALOG_POSITIONS, permission: 'catalogs.manage', comingSoon: true },
          { label: 'Levels', href: ROUTES.ADMIN_CATALOG_LEVELS, permission: 'catalogs.manage', comingSoon: true },
          { label: 'Skills', href: ROUTES.ADMIN_CATALOG_SKILLS, permission: 'catalogs.manage', comingSoon: true },
          { label: 'Locations', href: ROUTES.ADMIN_CATALOG_LOCATIONS, permission: 'catalogs.manage', comingSoon: true },
          {
            label: 'Minimum wage',
            href: ROUTES.ADMIN_CATALOG_MINIMUM_WAGE,
            permission: 'catalogs.manage',
            comingSoon: true,
          },
        ],
      },
    ],
  },
  {
    id: 'business',
    title: 'Business',
    items: [
      {
        label: 'Services',
        icon: Package,
        children: [
          {
            label: 'Service packages',
            href: ROUTES.ADMIN_SERVICE_PACKAGES,
            permission: 'services.manage',
            comingSoon: true,
          },
          {
            label: 'Pricing & quotas',
            href: ROUTES.ADMIN_SERVICE_PRICING,
            permission: 'services.manage',
            comingSoon: true,
          },
          {
            label: 'Education codes',
            href: ROUTES.ADMIN_EDUCATION_CODES,
            permission: 'services.manage',
            comingSoon: true,
          },
        ],
      },
      {
        label: 'Finance',
        icon: Wallet,
        children: [
          { label: 'Orders', href: ROUTES.ADMIN_FINANCE_ORDERS, permission: 'finance.manage', comingSoon: true },
          {
            label: 'Transactions',
            href: ROUTES.ADMIN_FINANCE_TRANSACTIONS,
            queue: 'unmatchedTransactions',
            permission: 'finance.manage',
            comingSoon: true,
          },
          { label: 'Refunds', href: ROUTES.ADMIN_FINANCE_REFUNDS, permission: 'finance.manage', comingSoon: true },
          {
            label: 'VAT invoices',
            href: ROUTES.ADMIN_FINANCE_VAT_INVOICES,
            queue: 'vatInvoices',
            permission: 'finance.manage',
            comingSoon: true,
          },
          {
            label: 'Revenue reports',
            href: ROUTES.ADMIN_FINANCE_REVENUE,
            permission: 'finance.manage',
            comingSoon: true,
          },
        ],
      },
    ],
  },
  {
    id: 'platform',
    title: 'Platform',
    items: [
      {
        label: 'Content',
        icon: FileText,
        children: [
          { label: 'Blog', href: ROUTES.ADMIN_CONTENT_BLOG, permission: 'content.manage', comingSoon: true },
          { label: 'FAQ', href: ROUTES.ADMIN_CONTENT_FAQ, permission: 'content.manage', comingSoon: true },
          {
            label: 'Featured companies',
            href: ROUTES.ADMIN_CONTENT_FEATURED_COMPANIES,
            permission: 'content.manage',
            comingSoon: true,
          },
          {
            label: 'Chatbot knowledge',
            href: ROUTES.ADMIN_CONTENT_CHATBOT,
            permission: 'content.manage',
            comingSoon: true,
          },
          {
            label: 'Announcements',
            href: ROUTES.ADMIN_CONTENT_ANNOUNCEMENTS,
            permission: 'content.manage',
            comingSoon: true,
          },
        ],
      },
      {
        label: 'Audit log',
        href: ROUTES.ADMIN_AUDIT_LOG,
        icon: ScrollText,
        permission: 'users.admins',
        comingSoon: true,
      },
    ],
  },
];
