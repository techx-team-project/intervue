import RecruiterAdsView from '@/components/recruiter/ads/RecruiterAdsView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quảng cáo banner | InterVue',
  description: 'Đặt chỗ banner theo tuần và quản lý ảnh quảng cáo của doanh nghiệp.',
};

export default function RecruiterAdsPage() {
  return <RecruiterAdsView />;
}
