import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import AwardsEcosystemSection from '@/components/home/awards-ecosystem';
import CareerGrowthSection from '@/components/home/career-growth/CareerGrowthSection';
import FeaturedJobsSection from '@/components/home/featured-jobs/FeaturedJobsSection';
import HeroSection from '@/components/home/hero-section/HeroSection';
import MarketDashboardSection from '@/components/home/market-dashboard/MarketDashboardSection';
import TopCategoriesSection from '@/components/home/top-categories/TopCategoriesSection';
import TopCompaniesSection from '@/components/home/top-companies/TopCompaniesSection';

export default function Home() {
  return (
    <div className="selection:bg-primary flex min-h-screen flex-col bg-[#f4f5f5] selection:text-white">
      <Header />

      <main className="flex-1 pb-12">
        <HeroSection />

        <FeaturedJobsSection />

        <MarketDashboardSection />

        <TopCompaniesSection />

        <TopCategoriesSection />

        <CareerGrowthSection />

        <AwardsEcosystemSection />
      </main>

      <Footer />
    </div>
  );
}
