'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface PanelBrandSplashProps {
  variant: 'admin' | 'recruiter';
  theme?: 'light' | 'dark';
  storageKey?: string;
  forceShow?: boolean;
  holdDurationMs?: number;
  fadeDurationMs?: number;
  cooldownMs?: number;
}

// 1.4s hold + 0.5s fade-out = ~1.9s total, giving users enough time to
// comfortably perceive the brand transition without feeling blocked.
const DEFAULT_HOLD_DURATION_MS = 1400;
const DEFAULT_FADE_DURATION_MS = 500;
// 30 minutes cooldown before the splash shows again on normal visits
const DEFAULT_COOLDOWN_MS = 30 * 60 * 1000;

function checkShouldShow(storageKey: string, cooldownMs: number, forceShow?: boolean): boolean {
  if (typeof window === 'undefined') return false;
  if (forceShow) return true;

  // Manual URL override (?splash=1 or ?splash=true) allows testing anytime
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('splash') === '1' || urlParams.get('splash') === 'true') {
    return true;
  }

  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      // First visit ever -> show immediately!
      return true;
    }
    const lastShown = Number(raw);
    if (isNaN(lastShown)) {
      return true;
    }
    // Show again if cooldown duration (e.g. 30 mins) has elapsed
    return Date.now() - lastShown > cooldownMs;
  } catch {
    return true;
  }
}

function getStoredAdminTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  try {
    return localStorage.getItem('intervue.admin.theme') === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export default function PanelBrandSplash({
  variant,
  theme,
  storageKey,
  forceShow,
  holdDurationMs = DEFAULT_HOLD_DURATION_MS,
  fadeDurationMs = DEFAULT_FADE_DURATION_MS,
  cooldownMs = DEFAULT_COOLDOWN_MS,
}: PanelBrandSplashProps) {
  // Use a fresh v2 key to avoid any stale timestamps from previous attempts
  const defaultKey = `intervue.panel.splash.${variant}.v2`;
  const effectiveKey = storageKey ?? defaultKey;

  const [state, setState] = useState<'idle' | 'showing' | 'fading' | 'dismissed'>('idle');
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const willShow = checkShouldShow(effectiveKey, cooldownMs, forceShow);
    if (!willShow) {
      return;
    }

    // Schedule showing on the next animation frame so React initial mount completes cleanly
    const rafId = requestAnimationFrame(() => {
      hasStartedRef.current = true;
      setState('showing');
    });

    const fadeTimer = setTimeout(() => {
      setState('fading');
    }, holdDurationMs);

    const removeTimer = setTimeout(() => {
      setState('dismissed');
      // Record visit timestamp ONLY when the splash actually completes its lifecycle,
      // avoiding React StrictMode double-invocation bugs that prematurely write to localStorage.
      try {
        localStorage.setItem(effectiveKey, String(Date.now()));
      } catch {
        // Ignore quota/permission errors
      }
    }, holdDurationMs + fadeDurationMs);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);

      // If the component unmounted after it had already started showing (e.g. user clicked away),
      // record the timestamp now so it doesn't loop on the next page.
      if (hasStartedRef.current) {
        try {
          localStorage.setItem(effectiveKey, String(Date.now()));
        } catch {
          // Ignore
        }
      }
    };
  }, [cooldownMs, effectiveKey, fadeDurationMs, forceShow, holdDurationMs]);

  if (state === 'idle' || state === 'dismissed') return null;

  const isFading = state === 'fading';
  const isAdmin = variant === 'admin';
  const effectiveTheme = theme ?? (isAdmin ? getStoredAdminTheme() : 'light');
  const isDark = isAdmin && effectiveTheme === 'dark';

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all ease-out ${
        isFading ? 'pointer-events-none scale-[1.03] opacity-0' : 'scale-100 opacity-100'
      } ${isDark ? 'bg-[#04150f]' : 'bg-white'}`}
      style={{
        transitionDuration: `${fadeDurationMs}ms`,
      }}
    >
      <style>{`
        @keyframes splashScaleIn {
          0% { transform: scale(0.90); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes splashProgress {
          0% { width: 0%; }
          30% { width: 40%; }
          75% { width: 85%; }
          100% { width: 100%; }
        }
        @keyframes splashPulseGlow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.18); }
        }
        @keyframes splashShimmerSweep {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }
      `}</style>

      {/* Ambient background glow */}
      {isDark ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 48%, rgba(0, 214, 96, 0.18) 0%, rgba(4, 21, 15, 0.45) 50%, #04150f 85%)',
          }}
        />
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-white" />
      )}

      {/* Center brand block */}
      <div
        className="relative z-10 flex flex-col items-center gap-4 px-6 sm:gap-4.5"
        style={{
          animation: 'splashScaleIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Glow halo behind logo */}
        {isDark ? (
          <div
            className="pointer-events-none absolute -top-8 h-28 w-28 rounded-full bg-emerald-500/20 blur-2xl"
            style={{ animation: 'splashPulseGlow 2.2s ease-in-out infinite' }}
          />
        ) : (
          <div
            className="pointer-events-none absolute -top-6 h-24 w-36 rounded-full bg-emerald-400/8 blur-xl"
            style={{ animation: 'splashPulseGlow 2.2s ease-in-out infinite' }}
          />
        )}

        {/* Logo with shimmer sweep */}
        <div className="relative overflow-hidden">
          {isDark ? (
            <Image
              src="/intervue-logo-white.png"
              alt="InterVue"
              width={1588}
              height={324}
              priority
              className="h-auto w-48 drop-shadow-[0_0_24px_rgba(0,214,96,0.35)] sm:w-56 md:w-64"
            />
          ) : (
            <Image
              src="/intervue-logo-transparent.png"
              alt="InterVue"
              width={948}
              height={258}
              priority
              className="h-auto w-48 mix-blend-multiply sm:w-56 md:w-64"
            />
          )}

          {/* Shimmer light sweep */}
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent"
            style={{
              animation: 'splashShimmerSweep 1.3s ease-in-out infinite',
            }}
          />
        </div>

        {/* Tagline badge */}
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold tracking-[0.26em] uppercase sm:text-[10.5px] ${
              isDark ? 'text-emerald-400/90' : 'text-emerald-700/80'
            }`}
          >
            {isAdmin ? 'Admin Console' : 'Recruiter Workspace'}
          </span>
        </div>

        {/* Micro progress line */}
        <div
          className={`h-[2px] w-32 overflow-hidden rounded-full sm:w-36 ${
            isDark ? 'border border-emerald-800/40 bg-emerald-950/80' : 'bg-slate-200/80'
          }`}
        >
          <div
            className={`h-full rounded-full ${
              isDark
                ? 'bg-linear-to-r from-emerald-500 via-[#00d660] to-emerald-300 shadow-[0_0_8px_rgba(0,214,96,0.6)]'
                : 'from-primary bg-linear-to-r via-[#00b14f] to-[#00d660]'
            }`}
            style={{
              animation: `splashProgress ${holdDurationMs}ms cubic-bezier(0.25, 0.8, 0.25, 1) forwards`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
