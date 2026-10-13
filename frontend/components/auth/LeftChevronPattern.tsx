'use client';

import { useMemo } from 'react';

export default function LeftChevronPattern() {
  // Pre-calculate dot positions for halftone chevron pattern
  const dots = useMemo(() => {
    const list: Array<{ cx: number; cy: number; r: number; opacity: number; key: string }> = [];

    // Parameters for Chevron
    const apexX = 135;
    const apexY = 360;
    const slope = 1.9; // dy / dx
    const bandWidth = 28; // thickness of dotted band
    const stepX = 5.5;
    const stepY = 10.5;

    // Outer and Inner Chevron layers
    const chevronOffsets = [0, -42];

    chevronOffsets.forEach((offset, chevronIdx) => {
      const curApexX = apexX + offset;

      for (let x = 0; x <= curApexX; x += stepX) {
        const distFromApexX = curApexX - x;
        const baseYTop = apexY - distFromApexX * slope;
        const baseYBottom = apexY + distFromApexX * slope;

        // Band of dots perpendicular/vertical to arm
        for (let b = -bandWidth / 2; b <= bandWidth / 2; b += stepY * 0.7) {
          const yTop = baseYTop + b;
          const yBottom = baseYBottom + b;

          // Closeness to center of the band (0 = edge, 1 = center)
          const bandFactor = 1 - Math.abs(b) / (bandWidth / 2);
          // Apex fade factor
          const xFactor = Math.min(1, x / 30);
          const r = Math.max(0.8, 1.2 + bandFactor * 1.8);
          const opacity = Math.max(0.2, (0.35 + bandFactor * 0.55) * xFactor);

          if (yTop >= 10 && yTop <= 710) {
            list.push({
              cx: Math.round(x * 10) / 10,
              cy: Math.round(yTop * 10) / 10,
              r: Math.round(r * 10) / 10,
              opacity: Math.round(opacity * 100) / 100,
              key: `c${chevronIdx}-t-${x}-${b}`,
            });
          }

          if (yBottom >= 10 && yBottom <= 710 && Math.abs(yBottom - yTop) > 6) {
            list.push({
              cx: Math.round(x * 10) / 10,
              cy: Math.round(yBottom * 10) / 10,
              r: Math.round(r * 10) / 10,
              opacity: Math.round(opacity * 100) / 100,
              key: `c${chevronIdx}-b-${x}-${b}`,
            });
          }
        }
      }
    });

    return list;
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-0 z-0 hidden -translate-y-1/2 select-none md:block"
    >
      <svg
        width="160"
        height="720"
        viewBox="0 0 160 720"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {dots.map((dot) => (
          <circle key={dot.key} cx={dot.cx} cy={dot.cy} r={dot.r} fill="#00b14f" fillOpacity={dot.opacity} />
        ))}
      </svg>
    </div>
  );
}
