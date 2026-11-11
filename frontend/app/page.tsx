import AdSlot from '@/components/common/AdSlot';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import AiShowcaseSection from '@/components/home/ai-showcase/AiShowcaseSection';
import TopCategoriesSection from '@/components/home/categories/TopCategoriesSection';
import HiringCompaniesSection from '@/components/home/companies/HiringCompaniesSection';
import CallToActionSection from '@/components/home/cta/CallToActionSection';
import FeaturedJobsSection from '@/components/home/featured-jobs/FeaturedJobsSection';
import HomeHero from '@/components/home/hero/HomeHero';
import HowItWorksSection from '@/components/home/how-it-works/HowItWorksSection';
import MarketPulse from '@/components/home/pulse/MarketPulse';
import RecommendedJobsSection from '@/components/jobs/recommendations/RecommendedJobsSection';

export default function Home() {
  return (
    <div className="bg-surface text-on-surface flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="bg-primary text-on-primary text-label-lg sr-only z-50 rounded-full px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to main content
      </a>
      <Header />

      <main id="main-content" className="flex-1">
        <HomeHero />
        <AdSlot code="HOME_TOP" className="mx-auto w-full max-w-[1200px] px-4 pt-6" />
        <MarketPulse />
        <div className="container-page pt-12 pb-4">
          <RecommendedJobsSection limit={6} />
        </div>
        <FeaturedJobsSection />
        <TopCategoriesSection />
        <HowItWorksSection />
        <AiShowcaseSection />
        <AdSlot code="HOME_MID" className="mx-auto w-full max-w-[1200px] px-4 py-6" />
        <HiringCompaniesSection />
        <CallToActionSection />
      </main>

      <Footer />
    </div>
  );
}
