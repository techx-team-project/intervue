import { CompanyVerificationView } from '@/components/recruiter/company/CompanyVerificationView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xác thực tài khoản nhà tuyển dụng | InterVue',
  description:
    'Gia tăng tính bảo mật cho tài khoản nhà tuyển dụng và hoàn thành các bước xác thực doanh nghiệp trên InterVue.',
};

// Force dynamic rendering so the mock fetch delay (and loading.tsx) run on every
// visit instead of only once at build time, matching how a real API call would behave.
export const dynamic = 'force-dynamic';

const MOCK_FETCH_DELAY_MS = 1000;

async function loadVerificationProfile() {
  await new Promise((resolve) => setTimeout(resolve, MOCK_FETCH_DELAY_MS));
}

export default async function CompanyVerificationPage() {
  await loadVerificationProfile();

  return <CompanyVerificationView />;
}
