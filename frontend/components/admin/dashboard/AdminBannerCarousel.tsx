'use client';

import { cn } from '@/lib/utils';
import type { AdminBannerSlide } from '@/types/admin';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface AdminBannerCarouselProps {
  slides: AdminBannerSlide[];
}

const AUTOPLAY_INTERVAL_MS = 6000;

export default function AdminBannerCarousel({ slides }: AdminBannerCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;

      const reachedEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      if (reachedEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }

      const step = (track.children[0] as HTMLElement | undefined)?.clientWidth ?? track.clientWidth;
      track.scrollBy({ left: step + 16, behavior: 'smooth' });
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const step = (track.children[0] as HTMLElement | undefined)?.clientWidth ?? track.clientWidth;
    setActiveIndex(Math.round(track.scrollLeft / (step + 16)));
  };

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const step = (track.children[0] as HTMLElement | undefined)?.clientWidth ?? track.clientWidth;
    track.scrollBy({ left: direction * (step + 16), behavior: 'smooth' });
  };

  if (slides.length === 0) return null;

  return (
    <div className="group relative">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="scrollbar-on-hover flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1"
      >
        {slides.map((slide) => (
          <Link
            key={slide.id}
            href={slide.href}
            className={cn(
              'group/card relative flex min-w-full shrink-0 snap-start overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-md lg:min-w-[calc(50%-0.5rem)]',
              slide.gradientClassName,
            )}
          >
            <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-2 p-5 pr-1 sm:p-6 sm:pr-2">
              <span className="text-[11.5px] font-bold tracking-wider text-white/70 uppercase">{slide.eyebrow}</span>
              <h3 className="max-w-[18rem] text-[17px] leading-snug font-black text-white sm:text-lg">{slide.title}</h3>
              <p className="max-w-[20rem] text-[12.5px] leading-relaxed text-white/80">{slide.description}</p>

              <span className="mt-1.5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-bold text-[#0c2e24] shadow-xs transition-transform group-hover/card:scale-105">
                <span>{slide.ctaLabel}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="relative w-40 shrink-0 self-stretch overflow-hidden sm:w-52 lg:w-60">
              <Image
                src={slide.imageSrc}
                alt={slide.imageAlt}
                fill
                sizes="(max-width: 1024px) 40vw, 25vw"
                className="[mask-image:linear-gradient(to_right,transparent_0%,black_24%,black_100%)] object-cover object-center transition-transform duration-500 group-hover/card:scale-105"
              />
            </div>
          </Link>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => move(-1)}
            title="Previous banner"
            aria-label="Previous banner"
            className="text-navy absolute top-1/2 left-2 z-20 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#e9eaec] bg-white/90 opacity-0 shadow-md transition group-hover:opacity-100 hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => move(1)}
            title="Next banner"
            aria-label="Next banner"
            className="text-navy absolute top-1/2 right-2 z-20 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#e9eaec] bg-white/90 opacity-0 shadow-md transition group-hover:opacity-100 hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="mt-2.5 flex items-center justify-center gap-1.5">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => scrollToIndex(index)}
                title={slide.title}
                aria-label={`Go to banner ${index + 1}`}
                className={cn(
                  'h-1.5 cursor-pointer rounded-full transition-all',
                  activeIndex === index ? 'bg-primary w-5' : 'w-1.5 bg-[#cbd5e1] hover:bg-[#94a3b8]',
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
