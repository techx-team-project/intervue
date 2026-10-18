'use client';

import React from 'react';
import { RobotHead, type RobotHeadShape, type RobotHeadState } from 'robot-heads';

export interface MascotSkeletonProps {
  message?: string;
  size?: number;
  shape?: RobotHeadShape;
  state?: RobotHeadState;
  minHeight?: string;
  speed?: number;
  color?: string;
  trimColor?: string;
  screenColor?: string;
  className?: string;
}

export function MascotSkeleton({
  message = 'Đang tải dữ liệu...',
  size = 95,
  shape = 'square',
  state = 'working',
  minHeight = 'min-h-60',
  speed = 1.8,
  color = '#064e3b',
  trimColor = '#10b981',
  screenColor = '#a7f3d0',
  className = '',
}: MascotSkeletonProps) {
  return (
    <div
      className={`relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-emerald-100/70 bg-linear-to-b from-white via-emerald-50/25 to-emerald-50/40 p-8 text-center shadow-xs select-none ${minHeight} ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2.4s_infinite] bg-linear-to-r from-transparent via-white/70 to-transparent" />

      <div className="relative z-10 flex flex-col items-center justify-center">
        <RobotHead
          shape={shape}
          state={state}
          size={size}
          color={color}
          trimColor={trimColor}
          screenColor={screenColor}
          antenna={true}
          floorShadow={true}
          interactive={false}
          speed={speed}
        />

        {message && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[13px] font-semibold text-emerald-900/80">{message}</span>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#00a850] [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#00a850] [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#00a850]" />
            </div>
          </div>
        )}

        <div className="mt-4 flex w-52 flex-col items-center gap-2">
          <div className="h-2 w-full animate-pulse rounded-full bg-emerald-200/60" />
          <div className="h-2 w-3/4 animate-pulse rounded-full bg-emerald-200/40" />
          <div className="h-2 w-1/2 animate-pulse rounded-full bg-emerald-200/30" />
        </div>
      </div>
    </div>
  );
}

export default MascotSkeleton;
