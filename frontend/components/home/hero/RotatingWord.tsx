'use client';

import { HERO_ROLE_WORDS } from '@/constants/home/search';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const INTERVAL_MS = 2400;
const OFFSET_CLASSES = [
  'translate-y-0',
  '-translate-y-[1lh]',
  '-translate-y-[2lh]',
  '-translate-y-[3lh]',
  '-translate-y-[4lh]',
  '-translate-y-[5lh]',
  '-translate-y-[6lh]',
];

export default function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % HERO_ROLE_WORDS.length), INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <span className="sr-only">IT</span>
      <span aria-hidden className="text-primary-bright relative inline-block align-bottom">
        <span className="block h-[1lh] overflow-hidden">
          <span className={cn('ease-standard flex flex-col transition-transform duration-500', OFFSET_CLASSES[index])}>
            {HERO_ROLE_WORDS.map((word) => (
              <span key={word} className="block h-[1lh]">
                {word}
              </span>
            ))}
          </span>
        </span>
        <svg viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-3 w-full">
          <path
            d="M2 8 C 40 2, 70 11, 110 6 S 170 3, 198 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </>
  );
}
