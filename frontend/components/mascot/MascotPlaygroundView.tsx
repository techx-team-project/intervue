'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Eye,
  Volume2,
  Mic,
  Search,
  CheckCircle2,
  AlertTriangle,
  Moon,
  Activity,
  RotateCw,
  Maximize2,
  Minimize2,
  Zap,
  Radio,
  Layers,
  MousePointer,
  Pause,
} from 'lucide-react';
import { DynamicRobotHead, type RobotHeadShape, type RobotHeadState } from './MascotCore';

interface StateInfo {
  state: RobotHeadState;
  title: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  ledEffect: string;
  dialogue: string;
}

const ALL_STATES: StateInfo[] = [
  {
    state: 'idle',
    title: 'Idle',
    badge: 'Idle',
    icon: Eye,
    accentColor: 'text-emerald-500',
    ledEffect: 'White-blue LED eyes blink periodically and glance around',
    dialogue: 'Hi! I am InterVue AI. Upload your CV or pick a job to get started!',
  },
  {
    state: 'working',
    title: 'Processing',
    badge: 'Working',
    icon: Activity,
    accentColor: 'text-blue-500',
    ledEffect: 'A progress bar runs across the LED screen while the head keeps nodding',
    dialogue: 'Extracting education, experience and skills data from your CV file...',
  },
  {
    state: 'thinking',
    title: 'Evaluating',
    badge: 'Thinking',
    icon: Sparkles,
    accentColor: 'text-amber-500',
    ledEffect: '3 dots blink as if thinking, eyes looking up',
    dialogue: 'Analyzing how well your profile matches ATS hiring standards...',
  },
  {
    state: 'searching',
    title: 'Job search',
    badge: 'Searching',
    icon: Search,
    accentColor: 'text-teal-500',
    ledEffect: 'A radar sweep scans the screen continuously, eyes dart quickly',
    dialogue: 'Scanning the whole job system for the best opportunities...',
  },
  {
    state: 'listening',
    title: 'Listening',
    badge: 'Listening',
    icon: Mic,
    accentColor: 'text-violet-500',
    ledEffect: 'An equalizer sound-wave bar bounces with the voice',
    dialogue: 'I am listening to your answer. Please present it with confidence...',
  },
  {
    state: 'speaking',
    title: 'Interview',
    badge: 'Speaking',
    icon: Volume2,
    accentColor: 'text-indigo-500',
    ledEffect: 'The mouth opens and closes in rhythm with the speech',
    dialogue: 'Describe the biggest challenge in your recent project and how you solved it.',
  },
  {
    state: 'happy',
    title: 'Celebrating',
    badge: 'Happy',
    icon: CheckCircle2,
    accentColor: 'text-emerald-600',
    ledEffect: 'Smiling ^ ^ eyes with a bright grin, jumping 360° with joy',
    dialogue: 'Wonderful! Your profile is complete. Good luck!',
  },
  {
    state: 'error',
    title: 'Error',
    badge: 'Error',
    icon: AlertTriangle,
    accentColor: 'text-rose-500',
    ledEffect: 'Bright red X X eyes and a zigzag mouth, head shaking in refusal',
    dialogue: 'The CV file has the wrong format. Please upload a PDF under 5MB!',
  },
  {
    state: 'sleeping',
    title: 'Resting',
    badge: 'Sleeping',
    icon: Moon,
    accentColor: 'text-slate-400',
    ledEffect: 'Eyes closed with Z Z Z floating up, head drooping with slow breathing',
    dialogue: 'The AI assistant is taking a short nap. Click me if you need more help!',
  },
];

const FIXED_SHAPE: RobotHeadShape = 'rectangle';
const FIXED_COLOR = '#064e3b';
const FIXED_TRIM_COLOR = '#10b981';
const FIXED_SCREEN_COLOR = '#a7f3d0';

export default function MascotPlaygroundView() {
  const [selectedState, setSelectedState] = useState<RobotHeadState>('idle');
  const [size, setSize] = useState<number>(240);
  const [speed, setSpeed] = useState<number>(1);
  const [antenna, setAntenna] = useState<boolean>(true);
  const [floorShadow, setFloorShadow] = useState<boolean>(true);
  const [interactive, setInteractive] = useState<boolean>(true);
  const [paused, setPaused] = useState<boolean>(false);

  const fpsRef = useRef<HTMLSpanElement>(null);
  const msRef = useRef<HTMLSpanElement>(null);
  const frameCount = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    lastTime.current = performance.now();
    let animId: number;
    const updateLoop = (now: number) => {
      frameCount.current++;
      const elapsed = now - lastTime.current;
      if (elapsed >= 350) {
        const rawFps = Math.round((frameCount.current * 1000) / elapsed);
        const lockedFps = Math.min(120, Math.max(60, rawFps));
        if (fpsRef.current) {
          fpsRef.current.textContent = `${lockedFps} FPS`;
        }
        if (msRef.current) {
          msRef.current.textContent = `(${(1000 / lockedFps).toFixed(1)}ms)`;
        }
        frameCount.current = 0;
        lastTime.current = now;
      }
      animId = requestAnimationFrame(updateLoop);
    };
    animId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const activeStateInfo = ALL_STATES.find((s) => s.state === selectedState) || ALL_STATES[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6 px-4 pt-10 sm:pt-4">
        <div className="text-center">
          <h1 className="mt-3.5 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Meet & Play With <span className="text-emerald-600">InterVue Bot AI</span>
          </h1>

          <p className="mx-auto mt-2.5 max-w-xl text-xs leading-relaxed font-medium text-slate-600 sm:text-sm">
            Hi! This is the playful AI mascot of InterVue.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-black tracking-wider text-slate-800 uppercase">
                Online Interactive Studio
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-0 divide-y divide-slate-100 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
            <div className="flex flex-col justify-between space-y-4 bg-slate-50/40 p-4 sm:p-5 lg:col-span-3">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-black tracking-wider text-slate-700 uppercase">
                    1. Expressions (9 Moods)
                  </span>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    {activeStateInfo.title}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {ALL_STATES.map((item) => {
                    const Icon = item.icon;
                    const isActive = selectedState === item.state;
                    return (
                      <button
                        key={item.state}
                        type="button"
                        onClick={() => setSelectedState(item.state)}
                        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border p-2.5 text-center transition ${
                          isActive
                            ? 'scale-[1.03] border-slate-900 bg-slate-900 text-white shadow-md ring-2 shadow-slate-900/20 ring-emerald-400'
                            : 'border-slate-200/80 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100/80'
                        }`}
                      >
                        <div
                          className={`mb-1.5 rounded-xl p-1.5 transition-transform ${
                            isActive ? 'bg-white/10 text-emerald-400' : 'bg-slate-100 ' + item.accentColor
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span
                          className={`text-[10.5px] leading-tight font-extrabold ${isActive ? 'text-white' : 'text-slate-800'}`}
                        >
                          {item.title}
                        </span>
                        <span
                          className={`mt-0.5 text-[9px] leading-none font-medium ${isActive ? 'text-emerald-300' : 'text-slate-400'}`}
                        >
                          {item.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3.5 text-white shadow-md">
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="font-mono text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                      LED screen
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-slate-400 uppercase">{selectedState}</span>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950 p-2.5 font-mono text-[11px] leading-relaxed text-emerald-300">
                  &gt; {activeStateInfo.ledEffect}
                </div>
              </div>
            </div>

            <div className="flex min-h-145 flex-col items-center justify-between bg-linear-to-b from-white via-emerald-50/15 to-slate-50/30 p-6 sm:p-8 lg:col-span-6">
              <div className="flex w-full items-center justify-between text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  InterVue AI Buddy
                </span>
                <span className="text-[11px] text-slate-400 italic">Hover or click the Bot head!</span>
              </div>

              <div className="relative my-auto flex w-full flex-col items-center justify-center py-6">
                <div className="pointer-events-none absolute h-96 w-96 rounded-full border border-emerald-500/10" />
                <div className="pointer-events-none absolute h-80 w-80 rounded-full border border-dashed border-emerald-500/15" />
                <div
                  className="pointer-events-none absolute h-80 w-80 rounded-full transition-opacity duration-300"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.04) 55%, transparent 72%)',
                    transform: 'translate3d(0, 0, 0)',
                  }}
                />

                <div
                  className="relative z-10 cursor-pointer overflow-visible transition-transform duration-200 active:scale-95"
                  style={{
                    transform: 'translate3d(0, 0, 0)',
                    backfaceVisibility: 'hidden',
                    willChange: 'transform',
                    contain: 'layout paint',
                  }}
                >
                  <DynamicRobotHead
                    shape={FIXED_SHAPE}
                    state={selectedState}
                    size={size}
                    color={FIXED_COLOR}
                    trimColor={FIXED_TRIM_COLOR}
                    screenColor={FIXED_SCREEN_COLOR}
                    antenna={antenna}
                    floorShadow={floorShadow}
                    interactive={interactive}
                    speed={speed}
                    paused={paused}
                  />
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3.5 py-1 text-[11px] font-bold text-slate-700 shadow-2xs">
                    <RotateCw className="h-3 w-3 text-emerald-600" />
                    Click the Bot head to spin 360°
                  </span>
                </div>
              </div>

              <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl border border-emerald-200/50 bg-emerald-50 p-2 text-emerald-700">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="mb-1 flex items-center justify-between font-bold text-slate-900">
                      <span className="font-extrabold text-slate-800">InterVue Bot AI</span>
                      <span className="py-0.2 rounded-full border border-emerald-200 bg-emerald-50 px-2 text-[10px] font-extrabold text-emerald-700 uppercase">
                        {activeStateInfo.title}
                      </span>
                    </div>
                    <p className="leading-relaxed font-medium text-slate-600">
                      &ldquo;{activeStateInfo.dialogue}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-slate-50/40 p-4 sm:p-5 lg:col-span-3">
              <span className="block text-[11px] font-black tracking-wider text-slate-700 uppercase">
                2. Size & Accessories
              </span>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="h-3.5 w-3.5 text-slate-500" />
                    <span className="text-xs font-bold text-slate-800">Body size</span>
                  </div>
                  <span className="rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 font-mono text-[10.5px] font-bold text-emerald-600">
                    {size}px
                  </span>
                </div>

                <div className="grid grid-cols-2 rounded-xl border border-slate-200/60 bg-slate-100 p-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setSize(160)}
                    className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 transition ${
                      size === 160
                        ? 'border border-slate-200/50 bg-white font-bold text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Minimize2 className="h-3.5 w-3.5 opacity-60" />
                    <span>Medium (160px)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSize(240)}
                    className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 transition ${
                      size === 240
                        ? 'bg-slate-900 font-bold text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Maximize2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Large (240px)</span>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-slate-500" />
                    <span className="text-xs font-bold text-slate-800">Reaction speed</span>
                  </div>
                  <span className="rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 font-mono text-[10.5px] font-bold text-emerald-600">
                    {speed}x
                  </span>
                </div>

                <div className="grid grid-cols-2 rounded-xl border border-slate-200/60 bg-slate-100 p-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setSpeed(1)}
                    className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 transition ${
                      speed === 1
                        ? 'border border-slate-200/50 bg-white font-bold text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>⚡ Normal (1.0x)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeed(1.7)}
                    className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 transition ${
                      speed === 1.7
                        ? 'bg-slate-900 font-bold text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span className="text-emerald-400">🚀 Nhanh (1.7x)</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                <div className="mb-2 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Accessory & Effect Options
                </div>

                <button
                  type="button"
                  onClick={() => setAntenna(!antenna)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-xl p-2 text-left transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`rounded-lg p-1.5 transition ${antenna ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}
                    >
                      <Radio className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Head antenna</div>
                      <div className="text-[10px] font-medium text-slate-400">
                        {antenna ? 'Show the 3D antenna' : 'Collapse to avatar style'}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`flex h-5.5 w-10 items-center rounded-full p-0.5 transition-colors duration-200 ${antenna ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <div
                      className={`h-4.5 w-4.5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${antenna ? 'translate-x-4.5' : 'translate-x-0'}`}
                    />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFloorShadow(!floorShadow)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-xl p-2 text-left transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`rounded-lg p-1.5 transition ${floorShadow ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}
                    >
                      <Layers className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Floor shadow</div>
                      <div className="text-[10px] font-medium text-slate-400">
                        {floorShadow ? 'Cast a 3D space shadow' : 'Hide the floor shadow'}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`flex h-5.5 w-10 items-center rounded-full p-0.5 transition-colors duration-200 ${floorShadow ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <div
                      className={`h-4.5 w-4.5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${floorShadow ? 'translate-x-4.5' : 'translate-x-0'}`}
                    />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setInteractive(!interactive)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-xl p-2 text-left transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`rounded-lg p-1.5 transition ${interactive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}
                    >
                      <MousePointer className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Eyes follow the cursor</div>
                      <div className="text-[10px] font-medium text-slate-400">
                        {interactive ? 'Head turns toward the mouse' : 'Stay still'}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`flex h-5.5 w-10 items-center rounded-full p-0.5 transition-colors duration-200 ${interactive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <div
                      className={`h-4.5 w-4.5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${interactive ? 'translate-x-4.5' : 'translate-x-0'}`}
                    />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaused(!paused)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-xl p-2 text-left transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`rounded-lg p-1.5 transition ${paused ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'}`}
                    >
                      <Pause className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Freeze motion</div>
                      <div className="text-[10px] font-medium text-slate-400">
                        {paused ? 'Frame paused' : 'Free animation'}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`flex h-5.5 w-10 items-center rounded-full p-0.5 transition-colors duration-200 ${paused ? 'bg-rose-500' : 'bg-slate-300'}`}
                  >
                    <div
                      className={`h-4.5 w-4.5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${paused ? 'translate-x-4.5' : 'translate-x-0'}`}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
