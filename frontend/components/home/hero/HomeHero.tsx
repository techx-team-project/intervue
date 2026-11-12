import { POPULAR_KEYWORDS } from '@/constants/home/search';
import Link from 'next/link';
import JobDeck from './JobDeck';
import RotatingWord from './RotatingWord';
import SearchBar from './SearchBar';
import TechMarquee from './TechMarquee';

const HERO_KEYWORD_COUNT = 6;

export default function HomeHero() {
  return (
    <section aria-labelledby="home-hero-title" className="bg-primary-deeper relative overflow-hidden pb-32">
      <div aria-hidden className="bg-grid mask-fade-b absolute inset-0 opacity-70" />
      <div aria-hidden className="bg-noise absolute inset-0 opacity-[0.06]" />
      <div aria-hidden className="absolute top-24 -right-32 h-[560px] w-[560px] rounded-full border border-white/10" />
      <div aria-hidden className="absolute top-44 -right-10 h-[360px] w-[360px] rounded-full border border-white/5" />

      <div className="container-page relative grid items-center gap-16 pt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:pt-24">
        <div>
          <p className="text-label-lg flex items-center gap-3 font-bold tracking-widest text-white/80 uppercase">
            <span aria-hidden className="bg-primary-bright h-2 w-2 rounded-full" />
            IT jobs from verified companies
          </p>

          <h1
            id="home-hero-title"
            className="font-display mt-7 text-[clamp(2rem,3.5vw,3.25rem)] leading-[1.1] font-bold tracking-[-0.03em] text-white"
          >
            Find <RotatingWord /> jobs
            <br />
            you actually want to do
          </h1>

          <p className="text-body-lg mt-6 max-w-xl font-normal text-white/70">
            Ask AI to review your CV and practice interviews before you apply. The decision to hire always stays with
            the recruiter.
          </p>

          <div className="mt-10 max-w-3xl">
            <SearchBar />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <span className="text-label-lg text-white/50">Popular</span>
            {POPULAR_KEYWORDS.slice(0, HERO_KEYWORD_COUNT).map((keyword) => (
              <Link
                key={keyword}
                href={`/jobs?q=${encodeURIComponent(keyword)}`}
                className="text-label-lg ease-standard hover:text-primary-deeper rounded-full border border-white/20 px-3.5 py-1.5 text-white/85 transition-colors duration-150 hover:border-white hover:bg-white"
              >
                {keyword}
              </Link>
            ))}
          </div>
        </div>

        <JobDeck />
      </div>

      <div className="relative mt-24">
        <TechMarquee />
      </div>
    </section>
  );
}
