import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CvTemplatesView from '@/components/cv-templates/CvTemplatesView';
import { getAllCvTemplates, getCvStyles, getCvIndustries } from '@/mocks/cv-template.mock';

interface CvTemplateSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CvTemplateSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const styles = getCvStyles();
  const currentStyle = styles.find((s) => s.slug === slug);

  const styleName = currentStyle ? currentStyle.name : 'Đơn giản';

  return {
    title: `Tuyển Chọn Mẫu CV ${styleName} (Tiếng Việt) Chuẩn 2026 | InterVue`,
    description: `Khám phá các mẫu CV ${styleName} chuẩn ATS 2026. Thiết kế tối ưu hóa khả năng đọc lướt cho nhà tuyển dụng và tương thích hệ thống quét hồ sơ tự động.`,
    openGraph: {
      title: `Mẫu CV Xin Việc ${styleName} - InterVue`,
      description: `Tạo CV ${styleName} miễn phí với hơn 21+ mẫu thiết kế chuyên nghiệp.`,
    },
  };
}

export async function generateStaticParams() {
  const styles = getCvStyles();
  return styles.map((s) => ({
    slug: s.slug,
  }));
}

export default async function CvTemplateSlugPage({ params }: CvTemplateSlugPageProps) {
  const { slug } = await params;
  const templates = getAllCvTemplates();
  const styles = getCvStyles();
  const industries = getCvIndustries();

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf9]">
      <Header />
      <main className="flex-1">
        <CvTemplatesView initialTemplates={templates} styles={styles} industries={industries} defaultStyleSlug={slug} />
      </main>
      <Footer />
    </div>
  );
}
