'use client';

import dynamic from 'next/dynamic';
import type { RobotHeadProps, RobotHeadShape, RobotHeadState } from 'robot-heads';

export const DynamicRobotHead = dynamic(() => import('robot-heads').then((mod) => mod.RobotHead), {
  ssr: false,
  loading: () => null,
});

export type { RobotHeadProps, RobotHeadShape, RobotHeadState };
