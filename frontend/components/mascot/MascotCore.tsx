'use client';

import dynamic from 'next/dynamic';
import type { RobotHeadProps, RobotHeadShape, RobotHeadState } from 'robot-heads';

/**
 * Dynamic import vô hiệu hóa Server-Side Rendering (SSR) Thư viện robot-heads sử dụng HTML5 Canvas và Window/Document
 * APIs, do đó bắt buộc phải render ở phía Client để tránh lỗi Hydration.
 */
export const DynamicRobotHead = dynamic(() => import('robot-heads').then((mod) => mod.RobotHead), {
  ssr: false,
  loading: () => null,
});

export type { RobotHeadProps, RobotHeadShape, RobotHeadState };
