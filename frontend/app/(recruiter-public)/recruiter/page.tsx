import RecruiterLandingView from '@/components/recruiter/public/RecruiterLandingView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'InterVue Tuyển dụng - Nền tảng tuyển dụng IT ứng dụng AI hàng đầu',
  description:
    'Đăng tin tuyển dụng IT miễn phí, tiếp cận 100.000+ ứng viên lập trình viên chất lượng cao, tự động sàng lọc hồ sơ với AI.',
};

export default function RecruiterLandingPage() {
  return <RecruiterLandingView />;
}
