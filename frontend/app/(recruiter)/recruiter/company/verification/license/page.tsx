import { BusinessLicenseView } from '@/components/recruiter/company/verification/BusinessLicenseView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cập nhật Giấy phép kinh doanh | InterVue',
  description: 'Đăng tải Giấy chứng nhận Đăng ký doanh nghiệp hoặc Giấy ủy quyền để xác thực pháp nhân trên InterVue.',
};

export default function BusinessLicensePage() {
  return <BusinessLicenseView />;
}
