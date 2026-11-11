'use client';

import type { ConnectPortal } from '@/types/connect';
import { useIsFetching } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type ConnectThreadProgressBarProps = {
  portal: ConnectPortal;
  connectionId: number | null;
  connectionKey?: string | null;
};

type BarPhase = 'idle' | 'active' | 'completing' | 'fading';

export default function ConnectThreadProgressBar({
  portal,
  connectionId,
  connectionKey,
}: ConnectThreadProgressBarProps) {
  const activeThreadFetches = useIsFetching({
    predicate: (query) => {
      const [root, qPortal, resource, qId] = query.queryKey;
      if (root !== 'connect' || qPortal !== portal) return false;
      if (connectionId !== null && qId === connectionId && (resource === 'messages' || resource === 'conversation')) {
        return true;
      }
      return Boolean(connectionKey) && resource === 'conversation-key' && qId === connectionKey;
    },
  });

  const isFetchingThread = activeThreadFetches > 0;
  const [phase, setPhase] = useState<BarPhase>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isFetchingThread) return;
    const raf = requestAnimationFrame(() => {
      setPhase('active');
      setProgress((prev) => (prev < 24 ? 24 : prev));
    });
    return () => cancelAnimationFrame(raf);
  }, [isFetchingThread, connectionId]);

  useEffect(() => {
    if (phase !== 'active') return;
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(86, Math.round(prev + Math.max(2, (86 - prev) * 0.25))));
    }, 90);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'active' || isFetchingThread) return;
    const holdTimer = setTimeout(() => {
      setProgress(100);
      setPhase('completing');
    }, 180);
    return () => clearTimeout(holdTimer);
  }, [phase, isFetchingThread]);

  useEffect(() => {
    if (phase !== 'completing') return;
    const fadeTimer = setTimeout(() => {
      setPhase('fading');
    }, 180);
    return () => clearTimeout(fadeTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'fading') return;
    const resetTimer = setTimeout(() => {
      setPhase('idle');
      setProgress(0);
    }, 200);
    return () => clearTimeout(resetTimer);
  }, [phase]);

  if (phase === 'idle') return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed top-0 right-0 left-0 z-[60] h-[2.5px] bg-transparent transition-opacity duration-200 ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className="bg-primary h-full shadow-[0_0_8px_rgba(0,177,79,0.45)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
