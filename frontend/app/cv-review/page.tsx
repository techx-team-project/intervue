import CvReviewClientView from '@/components/cv-review/CvReviewClientView';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'AI CV Review and ATS Score | InterVue',
  description:
    'Get an ATS score and concrete improvements for your CV, tailored to a target role or matched against a real job post.',
};

export default function CvReviewPage() {
  return (
    <div className="bg-surface-container-low flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<p className="text-body-md text-on-surface-variant py-12 text-center">Loading…</p>}>
          <CvReviewClientView />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
