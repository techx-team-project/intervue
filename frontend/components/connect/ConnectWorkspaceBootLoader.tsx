'use client';

import ConnectBootScreen from '@/components/connect/ConnectBootScreen';
import { useEffect, useState } from 'react';

type ConnectWorkspaceBootLoaderProps = {
  isDataReady: boolean;
  label?: string;
  minDurationMs?: number;
};

type BootPhase = 'loading' | 'completing' | 'fading' | 'done';

export default function ConnectWorkspaceBootLoader({
  isDataReady,
  label = 'Loading conversations, please wait...',
  minDurationMs = 650,
}: ConnectWorkspaceBootLoaderProps) {
  const [progress, setProgress] = useState(20);
  const [phase, setPhase] = useState<BootPhase>('loading');
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const floorTimer = setTimeout(() => {
      setMinElapsed(true);
    }, minDurationMs);
    return () => clearTimeout(floorTimer);
  }, [minDurationMs]);

  useEffect(() => {
    if (phase !== 'loading') return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) return prev;
        return Math.min(88, Math.round(prev + Math.max(2, (88 - prev) * 0.22)));
      });
    }, 90);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'loading' || !isDataReady || !minElapsed) return;
    const raf = requestAnimationFrame(() => {
      setProgress(100);
      setPhase('completing');
    });
    return () => cancelAnimationFrame(raf);
  }, [phase, isDataReady, minElapsed]);

  useEffect(() => {
    if (phase !== 'completing') return;
    const fadeTimer = setTimeout(() => {
      setPhase('fading');
    }, 200);
    return () => clearTimeout(fadeTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'fading') return;
    const doneTimer = setTimeout(() => {
      setPhase('done');
    }, 240);
    return () => clearTimeout(doneTimer);
  }, [phase]);

  if (phase === 'done') return null;

  return <ConnectBootScreen progress={progress} label={label} fading={phase === 'fading'} />;
}
