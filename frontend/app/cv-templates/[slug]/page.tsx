import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CvTemplatesView from '@/components/cv-templates/CvTemplatesView';
import { getAllCvTemplates, getCvStyles, getCvIndustries } from '@/mocks/cv-template.mock';
import { CV_TEMPLATE_MESSAGES } from '@/constants/cv-templates';

interface CvTemplateSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CvTemplateSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const styles = getCvStyles();
  const currentStyle = styles.find((s) => s.slug === slug);

  const styleName = currentStyle ? currentStyle.name : CV_TEMPLATE_MESSAGES.slugMetadata.defaultStyleName;

  return {
    title: CV_TEMPLATE_MESSAGES.slugMetadata.title(styleName),
    description: CV_TEMPLATE_MESSAGES.slugMetadata.description(styleName),
    openGraph: {
      title: CV_TEMPLATE_MESSAGES.slugMetadata.ogTitle(styleName),
      description: CV_TEMPLATE_MESSAGES.slugMetadata.ogDescription(styleName),
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
    <div className="bg-surface-container-low flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <CvTemplatesView initialTemplates={templates} styles={styles} industries={industries} defaultStyleSlug={slug} />
      </main>
      <Footer />
    </div>
  );
}
