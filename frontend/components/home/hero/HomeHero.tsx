import { POPULAR_KEYWORDS } from '@/constants/home/search';
import Link from 'next/link';
import LatestJobsCard from './LatestJobsCard';
import SearchBar from './SearchBar';

const HERO_KEYWORD_COUNT = 6;

export default function HomeHero() {
  return (
    <section aria-labelledby="home-hero-title" className="bg-primary-deeper pb-28">
      <div className="container-page grid items-center gap-14 pt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:pt-20">
        <div>
          <h1 id="home-hero-title" className="font-display text-display-lg expanded:text-display-xl text-white">
            Tìm công việc IT <span className="text-primary-bright">bạn thực sự muốn làm</span>
          </h1>

          <p className="text-title-lg mt-6 max-w-xl font-normal text-white/75">
            Việc làm từ những công ty đã được xác thực. Bạn có thể nhờ AI xem lại CV, còn người quyết định tuyển hay
            không vẫn là nhà tuyển dụng.
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

        <LatestJobsCard />
      </div>
    </section>
  );
}
