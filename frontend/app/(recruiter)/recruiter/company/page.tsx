import { CompanyProfileView } from '@/components/recruiter/company/CompanyProfileView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cập nhật thông tin công ty | InterVue',
  description:
    'Quản lý thông tin pháp nhân, hồ sơ doanh nghiệp và phúc lợi nhân viên trên nền tảng tuyển dụng InterVue.',
};

export default function CompanyProfilePage() {
  return <CompanyProfileView />;
}
