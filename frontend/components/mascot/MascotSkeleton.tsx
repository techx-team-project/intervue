'use client';

import React from 'react';
import { RobotHead, type RobotHeadShape, type RobotHeadState } from 'robot-heads';

export interface MascotSkeletonProps {
  /** Thông điệp hiển thị khi đang tải (mặc định: 'Đang tải dữ liệu...') */
  message?: string;
  /** Kích thước của chú Mascot (px). Mặc định 95px */
  size?: number;
  /** Hình dáng đầu robot: mặc định 'square' (hình vuông) */
  shape?: RobotHeadShape;
  /** Trạng thái biểu cảm của robot: mặc định 'working' */
  state?: RobotHeadState;
  /** Chiều cao tối thiểu của khối */
  minHeight?: string;
  /** Tốc độ chuyển động */
  speed?: number;
  /** Màu vỏ robot */
  color?: string;
  /** Màu viền tai & ăng-ten */
  trimColor?: string;
  /** Màu màn hình LED */
  screenColor?: string;
  /** ClassName bổ sung */
  className?: string;
}

/**
 * Component Skeleton nạp dữ liệu dạng Khối (Block) vạn năng: Sử dụng chú Mascot hình vuông thân thiện kết hợp hiệu ứng
 * Shimmer quét sáng, dùng cho mọi khối nội dung trong toàn hệ thống (danh sách việc làm, biểu đồ, bảng dữ liệu, v.v.)
 */
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
      className={`relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-emerald-100/70 bg-linear-to-b from-white via-emerald-50/25 to-emerald-50/40 p-8 text-center shadow-xs backdrop-blur-xs select-none ${minHeight} ${className}`}
    >
      {/* 1. Lớp tia sáng quét ngang mượt mà (Shimmer Effect) */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2.4s_infinite] bg-linear-to-r from-transparent via-white/70 to-transparent" />

      {/* 2. Khối Mascot Hình vuông ở trung tâm */}
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

        {/* Dòng chữ thông báo nạp dữ liệu & 3 chấm nẩy sóng */}
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

        {/* Thanh placeholder khung xương mô phỏng dữ liệu đang về */}
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
