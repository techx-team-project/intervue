'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SlideItem {
  id: number;
  prefix: string;
  highlight: string;
  image: string;
  alt: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 1,
    prefix: 'Track your funnel with ',
    highlight: 'Report',
    image: '/auth/recruiter-banner-01@2x.png',
    alt: 'Track your funnel with Report',
  },
  {
    id: 2,
    prefix: 'Match your candidate with ',
    highlight: 'AI',
    image: '/auth/recruiter-banner-02@2x.png',
    alt: 'Match your candidate with AI',
  },
  {
    id: 3,
    prefix: 'Manage your hiring with ',
    highlight: 'Campaigns',
    image: '/auth/recruiter-banner-03@2x.png',
    alt: 'Manage your hiring with Campaigns',
  },
];

export default function RecruiterRegisterCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  return (
    <aside
      aria-label="InterVue features for recruiters"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="bg-primary-deeper relative flex h-screen w-full flex-col items-center justify-center overflow-hidden select-none"
    >
      {SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={cn(
              'absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out',
              isActive ? 'pointer-events-auto z-10 opacity-100' : 'pointer-events-none z-0 opacity-0',
            )}
          >
            {/* Full-bleed high-res @2x banner image covering 100% of the column edge-to-edge */}
            <div className="absolute inset-0 h-full w-full overflow-hidden">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                unoptimized
                className="h-full w-full object-cover object-center"
              />
              <div className="bg-primary-deeper pointer-events-none absolute inset-x-0 top-0 z-10 h-36" />
              <div className="bg-primary-deeper pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36" />
            </div>

            {/* Overlay caption positioned exactly like TopCV (top: 12-14%) */}
            <div className="absolute inset-x-0 top-[12%] z-20 px-6 text-center xl:top-[13%]">
              <p className="text-xl font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-2xl xl:text-[26px]">
                {slide.prefix}
                <span className="text-primary">{slide.highlight}</span>
              </p>
            </div>
          </div>
        );
      })}

      {/* Pagination indicators placed over the banner */}
      <div
        className="absolute inset-x-0 bottom-[65px] z-30 flex items-center justify-center gap-2.5"
        role="tablist"
        aria-label="Slides"
      >
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${index + 1}: ${slide.prefix}${slide.highlight}`}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00b14f]',
                isActive
                  ? 'bg-primary h-2 w-7 rounded-full shadow-sm shadow-[#00b14f]/50'
                  : 'h-2 w-2 rounded-full bg-white/40 hover:bg-white/70',
              )}
            />
          );
        })}
      </div>

      {/* Brand logo & slogan at the bottom */}
      <div className="absolute inset-x-0 bottom-4 z-30 flex flex-col items-center justify-center text-center">
        <Image
          src="/intervue-logo-white.png"
          alt="InterVue"
          width={130}
          height={32}
          className="h-7 w-auto object-contain opacity-95 drop-shadow-md"
        />
        <p className="text-label-sm mt-1 font-medium tracking-wide text-white/80 drop-shadow">
          Smarter IT hiring with AI
        </p>
      </div>
    </aside>
  );
}
