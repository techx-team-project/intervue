import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import AiFeaturesSection from '@/components/home/ai-features/AiFeaturesSection';
import HiringCompaniesSection from '@/components/home/companies/HiringCompaniesSection';
import TopCategoriesSection from '@/components/home/categories/TopCategoriesSection';
import FeaturedJobsSection from '@/components/home/featured-jobs/FeaturedJobsSection';
import HomeHero from '@/components/home/hero/HomeHero';
import PersonalBrandSection from '@/components/home/personal-brand/PersonalBrandSection';

export default function Home() {
  return (
    <div className="bg-surface-container-low text-on-surface flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="bg-primary text-on-primary text-label-lg sr-only z-50 rounded-full px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Bỏ qua điều hướng
      </a>
      <Header />

      <main id="main-content" className="flex-1 pb-6">
        <HomeHero />
        <FeaturedJobsSection />
        <HiringCompaniesSection />
        <TopCategoriesSection />
        <PersonalBrandSection />
        <AiFeaturesSection />
      </main>

      <Footer />
    </div>
  );
}
