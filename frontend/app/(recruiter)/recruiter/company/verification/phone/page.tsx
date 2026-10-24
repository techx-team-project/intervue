import { PhoneVerificationView } from '@/components/recruiter/company/verification/PhoneVerificationView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xác thực số điện thoại nhà tuyển dụng | InterVue',
  description: 'Xác thực số điện thoại để gia tăng bảo mật tài khoản và nâng cao uy tín tuyển dụng trên InterVue.',
};

export default function PhoneVerificationPage() {
  return <PhoneVerificationView />;
}
