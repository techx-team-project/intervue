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
    <div className="flex min-h-screen flex-col bg-[#f4f5f5] selection:bg-[#00b14f] selection:text-white">
      {/* 1. Sticky Navigation Header */}
      <Header />

      {/* 2. Main Body Content */}
      <main className="flex-1 pb-12">
        {/* Hero Section: Dark Green background + Title + Search Pill + Left Categories + Right Banner */}
        <HeroSection />

        {/* Featured Jobs Section (Việc làm nổi bật - matches user screenshot) */}
        <FeaturedJobsSection />

        {/* Today's Job Market Dashboard */}
        <MarketDashboardSection />

        {/* Top Companies Pro Showcase */}
        <TopCompaniesSection />

        {/* Top Job Categories */}
        <TopCategoriesSection />

        {/* Career Growth & Personality Tests */}
        <CareerGrowthSection />

        {/* Awards, App Showcase, Impressive Numbers & Ecosystem */}
        <AwardsEcosystemSection />
      </main>

      {/* 3. Comprehensive Footer */}
      <Footer />
    </div>
  );
}
