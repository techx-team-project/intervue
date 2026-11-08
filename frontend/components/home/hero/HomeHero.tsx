import { POPULAR_KEYWORDS } from '@/constants/home/search';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import HeroVisual from './HeroVisual';
import SearchBar from './SearchBar';

const HERO_KEYWORD_COUNT = 6;

export default function HomeHero() {
  return (
    <section aria-labelledby="home-hero-title" className="bg-primary-deeper relative overflow-hidden pb-28">
      <div aria-hidden className="bg-grid mask-fade-b absolute inset-0" />

      <div className="container-page relative grid items-center gap-12 pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:pt-20">
        <div>
          <span className="text-label-lg text-primary-bright inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">
            <Sparkles className="h-4 w-4" aria-hidden />
            Nền tảng tuyển dụng IT có AI hỗ trợ
          </span>

          <h1 id="home-hero-title" className="font-display text-display-lg expanded:text-display-xl mt-6 text-white">
            Tìm việc IT phù hợp, <span className="text-primary-bright">nhanh hơn</span> mỗi ngày
          </h1>

          <p className="text-title-lg mt-6 max-w-xl font-normal text-white/75">
            Hàng trăm vị trí từ doanh nghiệp công nghệ đã xác thực. AI giúp bạn hoàn thiện CV và luyện phỏng vấn, còn
            quyết định tuyển dụng luôn thuộc về con người.
          </p>

          <div className="mt-10 max-w-3xl">
            <SearchBar />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-label-lg text-white/60">Tìm nhiều:</span>
            {POPULAR_KEYWORDS.slice(0, HERO_KEYWORD_COUNT).map((keyword) => (
              <Link
                key={keyword}
                href={`/jobs?q=${encodeURIComponent(keyword)}`}
                className="text-label-lg ease-standard hover:text-primary-deeper rounded-full border border-white/20 px-3.5 py-1.5 text-white/90 transition-colors duration-150 hover:border-white hover:bg-white"
              >
                {keyword}
              </Link>
            ))}
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
