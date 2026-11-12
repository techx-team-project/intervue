'use client';

import { MOCK_RECRUITER_BANNERS } from '@/mocks/recruiter-banners.mock';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const AUTOPLAY_INTERVAL_MS = 5000;

export default function DashboardBannerCarousel() {
  const slides = MOCK_RECRUITER_BANNERS;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const onPrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const onNext = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <div className="group border-outline-variant shadow-elevation-1 relative h-72 overflow-hidden rounded-2xl border">
      {slides.map((slide, index) => {
        const Icon = slide.icon;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              current === index ? 'pointer-events-auto z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'
            }`}
          >
            <Link
              href={slide.href}
              className={`flex h-full w-full flex-col justify-center gap-4 p-8 sm:p-10 ${slide.gradientClassName}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white">
                <Icon className="h-5.5 w-5.5" />
              </div>

              {slide.eyebrow && (
                <span className="text-body-sm font-bold tracking-wide text-white/80 uppercase">{slide.eyebrow}</span>
              )}

              <h2 className="max-w-lg text-xl font-bold text-white sm:text-2xl">{slide.title}</h2>
              <p className="text-body-md max-w-md leading-relaxed text-white/85">{slide.description}</p>

              <span className="text-body-md text-on-surface mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 font-bold">
                <span>{slide.ctaLabel}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        );
      })}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={onPrev}
            className="text-navy border-outline-variant shadow-elevation-1 absolute top-1/2 left-2.5 z-20 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border bg-white/90 transition hover:bg-white"
            title="Previous banner"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="text-navy border-outline-variant shadow-elevation-1 absolute top-1/2 right-2.5 z-20 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border bg-white/90 transition hover:bg-white"
            title="Next banner"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrent(index)}
                className={`cursor-pointer transition ${
                  current === index
                    ? 'bg-primary h-1.5 w-5 rounded-full'
                    : 'h-1.5 w-1.5 rounded-full border border-black/10 bg-white/80 hover:bg-white'
                }`}
                title={`View banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
