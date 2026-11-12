import RecruiterAdsView from '@/components/recruiter/ads/RecruiterAdsView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Banner ads | InterVue',
  description: "Book banner slots by week and manage your company's ad creatives.",
};

export default function RecruiterAdsPage() {
  return <RecruiterAdsView />;
}
