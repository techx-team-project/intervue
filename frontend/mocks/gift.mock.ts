import { AvailableVoucher, GiftFaqItem } from '@/types/gift';

export const AVAILABLE_VOUCHERS: AvailableVoucher[] = [
  {
    id: 'v-1',
    type: 'education',
    packageId: '300',
    packageName: 'Education VIP account (1 year)',
    code: 'EDU-VIP-2026',
    expiryDate: '31/12/2026',
    receivedDate: '01/10/2026',
    tagColor: 'text-amber-700',
    tagBg: 'bg-amber-50',
    titleColor: 'text-amber-600',
    badgeLabel: 'Students & Lecturers',
    description: 'A VIP activation offer for learning, including the full set of CV-creation and course benefits.',
  },
  {
    id: 'v-2',
    type: 'pro',
    packageId: '400',
    packageName: 'Pro VIP account (1 month)',
    code: 'PRO-TRIAL-30D',
    expiryDate: '15/11/2026',
    receivedDate: '05/10/2026',
    tagColor: 'text-blue-700',
    tagBg: 'bg-blue-50',
    titleColor: 'text-blue-600',
    badgeLabel: 'Try Pro',
    description: 'Experience the full Pro features: profile boost to the top and unlimited CV downloads.',
  },
  {
    id: 'v-3',
    type: 'premium',
    packageId: '402',
    packageName: 'Premium VIP account (1 year)',
    code: 'TOPCV-PREMIUM-VIP',
    expiryDate: '30/12/2026',
    receivedDate: '06/10/2026',
    tagColor: 'text-emerald-700',
    tagBg: 'bg-emerald-50',
    titleColor: 'text-emerald-600',
    badgeLabel: 'Top-tier VIP',
    description: 'The highest benefits: Top 1 ranking in recruiter search and in-depth 1-on-1 CV editing support.',
  },
  {
    id: 'v-4',
    type: 'course',
    packageId: '300',
    packageName: 'Gitiho course: Excel Mastery 2026',
    code: 'GITIHO-EXCEL-FREE',
    expiryDate: '31/12/2026',
    receivedDate: 'Member gift',
    tagColor: 'text-purple-700',
    tagBg: 'bg-purple-50',
    titleColor: 'text-purple-600',
    badgeLabel: 'Partner Gitiho',
    description: 'A full set of 50+ hands-on Excel videos from basic to advanced for office workers.',
  },
];

export const GIFT_FAQS: GiftFaqItem[] = [
  {
    q: 'How do I get an InterVue gift code?',
    a: 'InterVue gift codes are usually issued through candidate appreciation programs, job fair events, workshops at universities, education partners, or sent directly to your email.',
  },
  {
    q: 'Which account plans can a gift code be used for?',
    a: 'Each gift code is designed for one or more specific account plans (Education VIP, Pro VIP, Premium VIP). Just choose the matching plan in the selector and press "Apply".',
  },
  {
    q: 'Can I share a gift code with friends?',
    a: 'Yes. Any unredeemed gift code can be used by any candidate account in the system. Once redeemed successfully, the code is permanently linked to that account.',
  },
  {
    q: 'How do I receive the partner (Gitiho) course benefits?',
    a: 'When you redeem the code and agree to share your information with the partner, the system automatically emails instructions to activate your online learning account on Gitiho at your account email within 24 business hours.',
  },
  {
    q: 'Can I redeem an expired gift code?',
    a: 'Unfortunately, gift codes past their expiry date can no longer be redeemed. Please contact the hotline 1900 068 889 (Ext. 2) if you need more details.',
  },
];
