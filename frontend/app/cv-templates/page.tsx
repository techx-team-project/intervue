import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CvTemplatesView from '@/components/cv-templates/CvTemplatesView';
import { getAllCvTemplates, getCvStyles, getCvIndustries } from '@/mocks/cv-template.mock';
import { CV_TEMPLATE_MESSAGES } from '@/constants/cv-templates';

export const metadata: Metadata = {
  title: CV_TEMPLATE_MESSAGES.pageMetadata.title,
  description: CV_TEMPLATE_MESSAGES.pageMetadata.description,
  openGraph: {
    title: CV_TEMPLATE_MESSAGES.pageMetadata.ogTitle,
    description: CV_TEMPLATE_MESSAGES.pageMetadata.ogDescription,
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
