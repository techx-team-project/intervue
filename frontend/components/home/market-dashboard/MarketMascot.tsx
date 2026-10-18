'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DynamicRobotHead, type RobotHeadState } from '@/components/mascot';

interface ScanPhase {
  state: RobotHeadState;
  speed: number;
}

const AUTO_SCAN_PHASES: ScanPhase[] = [
  { state: 'searching', speed: 1.8 },
  { state: 'working', speed: 1.6 },
  { state: 'thinking', speed: 1.4 },
  { state: 'searching', speed: 1.8 },
];

const STAT_SCAN_MODES: Record<number, ScanPhase> = {
  1: { state: 'searching', speed: 2.2 },
  2: { state: 'working', speed: 1.9 },
  3: { state: 'thinking', speed: 1.5 },
};

export interface MarketMascotProps {
  hoveredStat?: number | null;
  className?: string;
}

export function MarketMascot({ hoveredStat = null, className = '' }: MarketMascotProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [deepScanPhase, setDeepScanPhase] = useState<ScanPhase | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const cycleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const deepScanTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (hoveredStat !== null || deepScanPhase !== null) {
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
      return;
    }

    cycleTimerRef.current = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % AUTO_SCAN_PHASES.length);
    }, 4500);

    return () => {
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
    };
  }, [hoveredStat, deepScanPhase]);

  const handleRobotClick = useCallback(() => {
    if (deepScanTimerRef.current) clearTimeout(deepScanTimerRef.current);

    setDeepScanPhase({ state: 'searching', speed: 2.4 });

    deepScanTimerRef.current = setTimeout(() => {
      setDeepScanPhase({ state: 'working', speed: 2.0 });

      deepScanTimerRef.current = setTimeout(() => {
        setDeepScanPhase({ state: 'happy', speed: 1.6 });

        deepScanTimerRef.current = setTimeout(() => {
          setDeepScanPhase(null);
        }, 3000);
      }, 2500);
    }, 2200);
  }, []);

  const currentPhase: ScanPhase =
    deepScanPhase ||
    (hoveredStat && STAT_SCAN_MODES[hoveredStat]
      ? STAT_SCAN_MODES[hoveredStat]
      : isHovered
        ? { state: 'searching', speed: 2.2 }
        : AUTO_SCAN_PHASES[phaseIndex]);

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex flex-col items-center justify-center">
        <div className="pointer-events-none absolute inset-0 -top-6 scale-125 rounded-full bg-[#00e668]/20 blur-3xl" />

        <div
          onClick={handleRobotClick}
          className="relative z-10 cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
          title="Nhấp để tương tác cùng InterVue Bot AI"
        >
          <DynamicRobotHead
            shape="hexagon"
            state={currentPhase.state}
            size={170}
            color="#064e3b"
            trimColor="#10b981"
            screenColor="#a7f3d0"
            antenna={true}
            floorShadow={false}
            interactive={true}
            speed={currentPhase.speed}
          />
        </div>

        <div className="relative mt-0.5 flex flex-col items-center justify-center">
          <div
            className="pointer-events-none absolute -top-24 h-26 w-44 bg-linear-to-t from-[#00e668]/30 via-[#00e668]/8 to-transparent"
            style={{
              clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
            }}
          />

          <div className="pointer-events-none absolute -top-10 h-0.5 w-36 animate-pulse bg-linear-to-r from-transparent via-[#00e668] to-transparent opacity-75 shadow-[0_0_12px_#00e668]" />

          <div className="absolute h-10 w-44 rounded-full bg-[#00e668]/35 blur-lg" />

          <div className="relative flex h-8 w-44 items-center justify-center">
            <div className="absolute inset-0 animate-[spin_10s_linear_infinite] rounded-[50%] border border-dashed border-[#00e668]/50" />

            <div className="absolute inset-1 animate-pulse rounded-[50%] border-2 border-[#00e668]/80 shadow-[0_0_20px_rgba(0,230,104,0.6)]" />

            <div className="absolute inset-2.5 rounded-[50%] border border-[#a7f3d0] shadow-[0_0_10px_rgba(167,243,208,0.7)]" />

            <div className="h-3 w-20 rounded-[50%] bg-linear-to-r from-emerald-400 via-[#00e668] to-emerald-400 opacity-90 blur-[1px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketMascot;
