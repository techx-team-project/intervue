import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CareerHubView from '@/components/career-orientation/CareerHubView';
import { getAllCareerArticles, getCareerCategories, getTrendingIndustries } from '@/mocks/career-orientation.mock';

export const metadata: Metadata = {
  title: 'Định Hướng Nghề Nghiệp - Cẩm Nang Phát Triển Sự Nghiệp | InterVue',
  description:
    'Khám phá cẩm nang định hướng nghề nghiệp, lộ trình thăng tiến, bảng mức lương các ngành Marketing, IT, Sales, Logistics và bí quyết phỏng vấn thành công cùng InterVue.',
  openGraph: {
    title: 'Định Hướng Nghề Nghiệp & Khám Phá Bản Thân - InterVue',
    description: 'Lộ trình sự nghiệp rõ ràng, cập nhật xu hướng tuyển dụng và mức lương thị trường mới nhất.',
  },
};

export default function CareerOrientationPage() {
  const articles = getAllCareerArticles();
  const categories = getCareerCategories();
  const trendingIndustries = getTrendingIndustries();

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf9]">
      <Header />
      <main className="flex-1">
        <CareerHubView initialArticles={articles} categories={categories} trendingIndustries={trendingIndustries} />
      </main>
      <Footer />
    </div>
  );
}
