import HeroPanels from './HeroPanels';
import SearchBar from './SearchBar';

export default function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="from-primary-deep to-primary-deeper relative overflow-hidden bg-linear-to-b"
    >
      <svg
        aria-hidden
        viewBox="0 0 200 400"
        className="pointer-events-none absolute top-0 bottom-0 left-0 hidden h-full w-44 fill-none stroke-white/10 lg:block"
        strokeWidth="18"
      >
        <path d="M-50,50 L80,200 L-50,350" />
        <path d="M-10,50 L120,200 L-10,350" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 200 400"
        className="pointer-events-none absolute top-0 right-0 bottom-0 hidden h-full w-44 fill-none stroke-white/10 lg:block"
        strokeWidth="18"
      >
        <path d="M250,50 L120,200 L250,350" />
        <path d="M210,50 L80,200 L210,350" />
      </svg>

      <div className="container-page relative pt-7 pb-10">
        <h1
          id="home-hero-title"
          className="text-headline-md medium:text-hero text-primary-bright mb-5 text-center font-bold"
        >
          InterVue - Tạo CV, Tìm việc làm, Tuyển dụng hiệu quả
        </h1>
        <SearchBar />
        <div className="mt-8">
          <HeroPanels />
        </div>
      </div>
    </section>
  );
}
