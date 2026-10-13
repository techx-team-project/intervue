'use client';

import React from 'react';
import { DynamicRobotHead, type RobotHeadShape, type RobotHeadState } from './MascotCore';

export interface MascotAvatarProps {
  /** Trạng thái biểu cảm của robot */
  state?: RobotHeadState;
  /** Kích thước avatar (px). Mặc định 40px */
  size?: number;
  /** Hình dáng đầu robot */
  shape?: RobotHeadShape;
  /** Màu thân robot */
  color?: string;
  /** Màu viền tai và ăng-ten */
  trimColor?: string;
  /** Màu màn hình LED */
  screenColor?: string;
  /** Có tương tác chuột hay không (mặc định false trong avatar để tối ưu hiệu năng) */
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
        antenna={false} // Tắt ăng-ten để đầu robot nở to vừa khít ô tròn avatar
        floorShadow={false} // Tắt bóng sàn để avatar gọn gàng
        interactive={interactive}
      />
    </div>
  );
}
