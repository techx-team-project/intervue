import AdminAdSlotsPageClient from '@/components/admin/ads/AdminAdSlotsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ad slots | InterVue Admin',
  description: 'Where banners appear, what they cost per week and the house ad fallback.',
};

export default function AdminAdSlotsPage() {
  return <AdminAdSlotsPageClient />;
}
