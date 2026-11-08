'use client';

import React from 'react';
import { DynamicRobotHead, type RobotHeadShape, type RobotHeadState } from './MascotCore';

export type RecruitmentStage =
  | 'idle'
  | 'uploading'
  | 'analyzing'
  | 'searching'
  | 'interview_listen'
  | 'interview_speak'
  | 'success'
  | 'happy'
  | 'error'
  | 'sleeping';

export interface RecruitmentMascotProps {
  stage?: RecruitmentStage;
  message?: string;
  size?: number;
  shape?: RobotHeadShape;
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  trimColor?: string;
  screenColor?: string;
  interactive?: boolean;
  floorShadow?: boolean;
  antenna?: boolean;
  className?: string;
}

const STAGE_CONFIG: Record<RecruitmentStage, { state: RobotHeadState; defaultMsg: string }> = {
  idle: {
    state: 'idle',
    defaultMsg: 'Hi! I am the InterVue AI recruitment assistant, ready to help you.',
  },
  uploading: {
    state: 'working',
    defaultMsg: 'Extracting education and skills information from your CV file...',
  },
  analyzing: {
    state: 'thinking',
    defaultMsg: 'Matching skills and analyzing ATS standard compatibility...',
  },
  searching: {
    state: 'searching',
    defaultMsg: 'Looking for the best job opportunities and compensation...',
  },
  interview_listen: {
    state: 'listening',
    defaultMsg: 'I am listening to your answer. Please present it with confidence...',
  },
  interview_speak: {
    state: 'speaking',
    defaultMsg: 'Briefly introduce one standout real project you are proudest of.',
  },
  success: {
    state: 'happy',
    defaultMsg: 'Wonderful! The action completed successfully. Good luck!',
  },
  happy: {
    state: 'happy',
    defaultMsg: 'Wonderful! The action completed successfully. Good luck!',
  },
  error: {
    state: 'error',
    defaultMsg: 'An error occurred or the file format is not suitable. Please check again!',
  },
  sleeping: {
    state: 'sleeping',
    defaultMsg: 'The AI assistant is resting. See you in your next session!',
  },
};

export function RecruitmentMascot({
  stage = 'idle',
  message,
  size = 120,
  shape = 'rectangle',
  orientation = 'horizontal',
  color = '#064e3b',
  trimColor = '#10b981',
  screenColor = '#a7f3d0',
  interactive = true,
  floorShadow = true,
  antenna = true,
  className = '',
}: RecruitmentMascotProps) {
  const current = STAGE_CONFIG[stage] || STAGE_CONFIG.idle;

  return (
    <div
      className={`flex ${
        orientation === 'vertical' ? 'flex-col items-center text-center' : 'items-center'
      } gap-4 overflow-visible ${className}`}
    >
      <div className="shrink-0 overflow-visible">
        <DynamicRobotHead
          shape={shape}
          state={current.state}
          size={size}
          color={color}
          trimColor={trimColor}
          screenColor={screenColor}
          interactive={interactive}
          floorShadow={floorShadow}
          antenna={antenna}
        />
      </div>

      <div className="relative max-w-sm rounded-2xl border border-emerald-100 bg-white/95 p-4 text-xs font-medium text-slate-700 shadow-sm transition">
        <p className="leading-relaxed">{message || current.defaultMsg}</p>

        {orientation === 'horizontal' ? (
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 border-y-8 border-r-8 border-y-transparent border-r-white drop-shadow-xs" />
        ) : (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-x-8 border-b-8 border-x-transparent border-b-white drop-shadow-xs" />
        )}
      </div>
    </div>
  );
}
