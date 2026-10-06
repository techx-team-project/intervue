import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CvTemplatesView from '@/components/cv-templates/CvTemplatesView';
import { getAllCvTemplates, getCvStyles, getCvIndustries } from '@/mocks/cv-template.mock';

export const metadata: Metadata = {
  title: 'Mẫu CV Xin Việc Tiếng Việt Đơn Giản Chuẩn 2026 | InterVue',
  description:
    'Tuyển chọn 21+ mẫu CV tiếng Việt thiết kế đơn giản, chuẩn ATS 2026. Tạo CV online miễn phí, dễ tùy biến màu sắc và tải file PDF chất lượng cao.',
  openGraph: {
    title: 'Tuyển Chọn Mẫu CV Xin Việc Đơn Giản Chuẩn 2026 - InterVue',
    description: 'Tạo CV online miễn phí với các mẫu CV được thiết kế sẵn tối ưu điểm số ATS cho mọi ngành nghề.',
  },
};

export default function CvTemplatesPage() {
  const templates = getAllCvTemplates();
  const styles = getCvStyles();
  const industries = getCvIndustries();

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf9]">
      <Header />
      <main className="flex-1">
        <CvTemplatesView
          initialTemplates={templates}
          styles={styles}
          industries={industries}
          defaultStyleSlug="mau-don-gian"
        />
      </main>
      <Footer />
    </div>
  );
}
