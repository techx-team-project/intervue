import { POPULAR_KEYWORDS } from '@/constants/home/search';
import Link from 'next/link';
import JobDeck from './JobDeck';
import RotatingWord from './RotatingWord';
import SearchBar from './SearchBar';
import TechMarquee from './TechMarquee';

const HERO_KEYWORD_COUNT = 6;

export default function HomeHero() {
  return (
    <section aria-labelledby="home-hero-title" className="bg-primary-deeper relative overflow-hidden pb-28">
      <div aria-hidden className="bg-primary-deep absolute -top-48 -right-40 h-[720px] w-[720px] rounded-full" />
      <div
        aria-hidden
        className="absolute bottom-16 left-[38%] h-[380px] w-[380px] rounded-full border border-white/10"
      />
      <div aria-hidden className="bg-noise absolute inset-0 opacity-[0.07]" />

      <div className="container-page relative grid items-center gap-14 pt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:pt-20">
        <div>
          <p className="text-label-lg text-primary-bright flex items-center gap-3 font-bold tracking-widest uppercase">
            <span aria-hidden className="bg-primary-bright h-px w-10" />
            IT jobs from verified companies
          </p>

          <h1 id="home-hero-title" className="font-display text-display-lg expanded:text-display-xl mt-6 text-white">
            Find <RotatingWord /> jobs
            <br />
            you actually want to do
          </h1>

          <p className="text-title-lg mt-6 max-w-xl font-normal text-white/75">
            You can ask AI to review your CV and practice interviews before applying. The decision to hire always stays
            with the recruiter.
          </p>

          <div className="mt-10 max-w-3xl">
            <SearchBar />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-label-lg text-white/60">Popular:</span>
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

        <JobDeck />
      </div>

      <div className="relative mt-20">
        <TechMarquee />
      </div>
    </section>
  );
}
