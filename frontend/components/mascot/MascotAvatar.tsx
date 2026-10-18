'use client';

import React from 'react';
import { DynamicRobotHead, type RobotHeadShape, type RobotHeadState } from './MascotCore';

export interface MascotAvatarProps {
  state?: RobotHeadState;
  size?: number;
  shape?: RobotHeadShape;
  color?: string;
  trimColor?: string;
  screenColor?: string;
  interactive?: boolean;
  className?: string;
}

export function MascotAvatar({
  state = 'idle',
  size = 40,
  shape = 'rectangle',
  color = '#064e3b',
  trimColor = '#10b981',
  screenColor = '#a7f3d0',
  interactive = false,
  className = '',
}: MascotAvatarProps) {
  return (
    <div className={`inline-flex shrink-0 items-center justify-center overflow-visible ${className}`}>
      <DynamicRobotHead
        shape={shape}
        state={state}
        size={size}
        color={color}
        trimColor={trimColor}
        screenColor={screenColor}
        antenna={false}
        floorShadow={false}
        interactive={interactive}
      />
    </div>
  );
}
