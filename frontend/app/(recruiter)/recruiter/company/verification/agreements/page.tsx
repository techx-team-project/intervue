import { PersonalDataProtectionView } from '@/components/recruiter/company/verification/PersonalDataProtectionView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Văn bản xử lý Dữ liệu cá nhân | InterVue',
  description:
    'Thỏa thuận xử lý dữ liệu cá nhân giữa Ứng viên, Nhà tuyển dụng và nền tảng InterVue theo Nghị định 13/2023/NĐ-CP.',
};

export default function PersonalDataProtectionPage() {
  return <PersonalDataProtectionView />;
}
