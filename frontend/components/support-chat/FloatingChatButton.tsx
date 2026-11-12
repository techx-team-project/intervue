'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { DynamicRobotHead, type RobotHeadShape, type RobotHeadState } from '@/components/mascot/MascotCore';
import { hasBottomBar, hasMobileActionBar } from '@/constants/ai-chat';
import { cn } from '@/lib/utils';

const FIXED_SHAPE: RobotHeadShape = 'rectangle';
const FIXED_COLOR = '#064e3b';
const FIXED_TRIM_COLOR = '#10b981';
const FIXED_SCREEN_COLOR = '#a7f3d0';

interface FloatingChatButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  remainingQuota: number | null;
  robotState?: RobotHeadState;
}

export function FloatingChatButton({ isOpen, onToggle, remainingQuota, robotState = 'idle' }: FloatingChatButtonProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [ambientState, setAmbientState] = useState<RobotHeadState>('idle');

  useEffect(() => {
    if (isOpen) return;

    const interval = setInterval(() => {
      setAmbientState((prev) => (prev === 'idle' ? 'happy' : 'idle'));
    }, 8000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (hasBottomBar(pathname)) {
    return null;
  }

  const activeState: RobotHeadState =
    robotState !== 'idle' ? robotState : isHovered ? 'happy' : isOpen ? 'speaking' : ambientState;

  return (
    <aside
      className={cn(
        'pointer-events-auto fixed right-3 z-40 select-none sm:right-6 sm:bottom-6',
        hasMobileActionBar(pathname) ? 'bottom-20' : 'bottom-3',
      )}
    >
      <div className="relative">
        <div
          onClick={onToggle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative cursor-pointer transition-transform duration-200 active:scale-95"
          style={{
            transform: 'translate3d(0, 0, 0)',
            contain: 'layout paint',
          }}
          title={isOpen ? 'Click to close the AI assistant chat' : 'Click to chat with InterVue Bot'}
        >
          <DynamicRobotHead
            shape={FIXED_SHAPE}
            state={activeState}
            size={84}
            color={FIXED_COLOR}
            trimColor={FIXED_TRIM_COLOR}
            screenColor={FIXED_SCREEN_COLOR}
            antenna={true}
            floorShadow={false}
            interactive={true}
            paused={false}
            speed={1.7}
          />

          {remainingQuota !== null && !isOpen && (
            <span className="absolute top-2 left-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold text-white shadow-xs">
              {remainingQuota}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
