'use client';

import { HOME_BANNERS } from '@/constants/home/banners';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const AUTOPLAY_INTERVAL_MS = 5000;
const ARROW_CLASS =
  'absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-outline-variant bg-surface text-on-surface shadow-elevation-1 transition-colors duration-150 hover:bg-primary-light';

export default function BannerPanel() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const goTo = (next: number) => setIndex((next + HOME_BANNERS.length) % HOME_BANNERS.length);

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % HOME_BANNERS.length), AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Giới thiệu InterVue"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      className="expanded:aspect-auto expanded:h-90 bg-primary-light relative aspect-1000/360 overflow-hidden rounded-2xl"
    >
      {HOME_BANNERS.map((banner, bannerIndex) => {
        const isActive = bannerIndex === index;
        return (
          <Link
            key={banner.id}
            href={banner.href}
            aria-hidden={!isActive}
            tabIndex={isActive ? 0 : -1}
            className={cn(
              'ease-standard absolute inset-0 transition-opacity',
              isActive ? 'opacity-100 delay-200 duration-500' : 'pointer-events-none opacity-0 duration-200',
            )}
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              priority={bannerIndex === 0}
              sizes="(min-width: 840px) 70vw, 100vw"
              className="object-cover"
            />
          </Link>
        );
      })}

      <button
        type="button"
        aria-label="Banner trước"
        onClick={() => goTo(index - 1)}
        className={cn(ARROW_CLASS, 'left-3')}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Banner tiếp theo"
        onClick={() => goTo(index + 1)}
        className={cn(ARROW_CLASS, 'right-3')}
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {HOME_BANNERS.map((item, dotIndex) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Xem banner ${dotIndex + 1}`}
            aria-current={dotIndex === index}
            onClick={() => setIndex(dotIndex)}
            className={cn(
              'ease-standard h-1 cursor-pointer rounded-full transition-all duration-300',
              dotIndex === index ? 'bg-primary w-6' : 'bg-outline-variant w-3',
            )}
          />
        ))}
      </div>
    </div>
  );
}
