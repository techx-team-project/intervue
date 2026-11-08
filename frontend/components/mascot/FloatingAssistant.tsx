'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, FileText, Briefcase, MessageSquareCode, Sparkles } from 'lucide-react';
import { DynamicRobotHead, type RobotHeadShape, type RobotHeadState } from './MascotCore';

const FIXED_SHAPE: RobotHeadShape = 'rectangle';
const FIXED_COLOR = '#064e3b';
const FIXED_TRIM_COLOR = '#10b981';
const FIXED_SCREEN_COLOR = '#a7f3d0';

const CUTE_REACTIONS: Array<{ state: RobotHeadState; msg: string }> = [
  {
    state: 'happy',
    msg: 'Hehe, you just poked me! Wishing you a day full of energy for your job hunt!',
  },
  {
    state: 'thinking',
    msg: 'Thinking about whether I have a great job or a useful ATS CV tip for you...',
  },
  {
    state: 'speaking',
    msg: 'Hi! I am InterVue AI. Upload your CV or try a mock interview with me!',
  },
  {
    state: 'searching',
    msg: 'My radar is scanning thousands of well-paid job opportunities with great benefits!',
  },
];

const PERIODIC_GREETINGS: Array<{ state: RobotHeadState; msg: string }> = [
  {
    state: 'happy',
    msg: '👋 Hello! Is your CV ATS-ready yet? Want me to score it for free?',
  },
  {
    state: 'speaking',
    msg: '🚀 Today there are 1,200+ new IT & Business jobs with great benefits. Click me to explore!',
  },
  {
    state: 'thinking',
    msg: '💡 Fun fact: practicing a 1-on-1 mock interview with AI can boost your confidence in front of recruiters a lot!',
  },
  {
    state: 'searching',
    msg: '🔍 My AI radar is scanning great jobs near you. Which position are you looking for?',
  },
  {
    state: 'happy',
    msg: '✨ InterVue Bot AI is always here with you! Click me any time to open the tools!',
  },
];

export function FloatingAssistant() {
  const pathname = usePathname();
  const isHidden = pathname === '/mascot' || pathname.startsWith('/recruiter') || pathname.startsWith('/admin');
  const [showBubble, setShowBubble] = useState(false);
  const [isAutoGreeting, setIsAutoGreeting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [robotState, setRobotState] = useState<RobotHeadState>('idle');
  const [currentMessage, setCurrentMessage] = useState<string>(
    'Hi! I am your little friend InterVue Bot AI. Click me or pick a quick action below!',
  );

  const assistantRef = React.useRef<HTMLElement>(null);
  const autoDismissTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const greetingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const clearAutoDismiss = React.useCallback(() => {
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }
  }, []);

  const startAutoDismiss = React.useCallback(
    (delayMs = 6500) => {
      clearAutoDismiss();
      autoDismissTimerRef.current = setTimeout(() => {
        setShowBubble(false);
        setIsAutoGreeting(false);
        setRobotState('idle');
      }, delayMs);
    },
    [clearAutoDismiss],
  );

  React.useEffect(() => {
    if (!showBubble) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (assistantRef.current && !assistantRef.current.contains(e.target as Node)) {
        clearAutoDismiss();
        setIsAutoGreeting(false);
        setShowBubble(false);
        setRobotState('idle');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBubble, clearAutoDismiss]);

  React.useEffect(() => {
    if (isHidden) return;

    const initialGreetingTimeout = setTimeout(() => {
      setShowBubble((currentShow) => {
        if (!currentShow) {
          const greeting = PERIODIC_GREETINGS[Math.floor(Math.random() * PERIODIC_GREETINGS.length)];
          setRobotState(greeting.state);
          setCurrentMessage(greeting.msg);
          setIsAutoGreeting(true);
          startAutoDismiss(6500);
          return true;
        }
        return currentShow;
      });
    }, 4500);

    greetingIntervalRef.current = setInterval(() => {
      setShowBubble((currentShow) => {
        if (!currentShow) {
          const greeting = PERIODIC_GREETINGS[Math.floor(Math.random() * PERIODIC_GREETINGS.length)];
          setRobotState(greeting.state);
          setCurrentMessage(greeting.msg);
          setIsAutoGreeting(true);
          startAutoDismiss(6500);
          return true;
        }
        return currentShow;
      });
    }, 20000);

    return () => {
      clearTimeout(initialGreetingTimeout);
      if (greetingIntervalRef.current) {
        clearInterval(greetingIntervalRef.current);
      }
      clearAutoDismiss();
    };
  }, [isHidden, startAutoDismiss, clearAutoDismiss]);

  if (isHidden) {
    return null;
  }

  const handleAction = (state: RobotHeadState, msg: string) => {
    clearAutoDismiss();
    setIsAutoGreeting(false);
    setRobotState(state);
    setCurrentMessage(msg);
    setShowBubble(true);
  };

  const handleRobotClick = () => {
    clearAutoDismiss();
    setIsAutoGreeting(false);
    setShowBubble((prev) => {
      const next = !prev;
      if (next) {
        const randomReaction = CUTE_REACTIONS[Math.floor(Math.random() * CUTE_REACTIONS.length)];
        setRobotState(randomReaction.state);
        setCurrentMessage(randomReaction.msg);
      } else {
        setRobotState('idle');
      }
      return next;
    });
  };

  return (
    <aside
      ref={assistantRef}
      className="pointer-events-auto fixed right-4 bottom-4 z-50 select-none sm:right-6 sm:bottom-6"
    >
      <div className="relative">
        {showBubble && (
          <div
            onMouseEnter={() => {
              if (isAutoGreeting) {
                clearAutoDismiss();
              }
            }}
            onMouseLeave={() => {
              if (isAutoGreeting) {
                startAutoDismiss(3500);
              }
            }}
            className="absolute right-0 bottom-full mb-3 w-72 rounded-3xl border border-emerald-100 bg-white/95 p-3.5 shadow-2xl shadow-slate-900/15 transition sm:w-80 sm:p-4"
          >
            <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[11px] font-black tracking-wider text-slate-800 uppercase">InterVue Bot AI</span>
                <span className="py-0.2 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 font-mono text-[9px] font-bold text-emerald-700">
                  {robotState}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  clearAutoDismiss();
                  setIsAutoGreeting(false);
                  setShowBubble(false);
                  setRobotState('idle');
                }}
                className="cursor-pointer rounded-full p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                title="Collapse message"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="mb-3 text-[11.5px] leading-relaxed font-medium text-slate-700 sm:text-xs">
              &ldquo;{currentMessage}&rdquo;
            </p>

            <div className="flex flex-wrap gap-1.5">
              <Link
                href="/cv-templates"
                onClick={() => handleAction('thinking', 'Opening the ATS-ready CV template library to score your CV!')}
                className="inline-flex items-center gap-1 rounded-xl border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-[10.5px] font-bold text-emerald-800 transition hover:bg-emerald-100"
              >
                <FileText className="h-3 w-3 text-emerald-600" />
                <span>ATS CV</span>
              </Link>

              <button
                type="button"
                onClick={() =>
                  handleAction('speaking', 'Ready? Tell me about the biggest challenge in your recent project!')
                }
                className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-100 px-2.5 py-1 text-[10.5px] font-bold text-slate-800 transition hover:bg-slate-200"
              >
                <MessageSquareCode className="h-3 w-3 text-emerald-600" />
                <span>AI interview</span>
              </button>

              <Link
                href="/jobs"
                onClick={() =>
                  handleAction('searching', 'Scanning the radar for all well-paid jobs with great benefits for you!')
                }
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-100 px-2.5 py-1 text-[10.5px] font-bold text-slate-800 transition hover:bg-slate-200"
              >
                <Briefcase className="h-3 w-3 text-emerald-600" />
                <span>Find jobs</span>
              </Link>

              <Link
                href="/mascot"
                className="ml-auto inline-flex items-center gap-1 rounded-xl bg-slate-900 px-2.5 py-1 text-[10.5px] font-bold text-white shadow-xs transition hover:bg-emerald-600"
              >
                <Sparkles className="h-3 w-3 text-emerald-400" />
                <span>Studio 3D</span>
              </Link>
            </div>

            <div className="absolute right-12 -bottom-2 h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-white drop-shadow-xs" />
          </div>
        )}

        <div
          onClick={handleRobotClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative cursor-pointer transition-transform duration-200 active:scale-95"
          style={{
            transform: 'translate3d(0, 0, 0)',
            contain: 'layout paint',
          }}
          title={showBubble ? 'Click to close the chat' : 'Click to chat with the Bot'}
        >
          <DynamicRobotHead
            shape={FIXED_SHAPE}
            state={robotState}
            size={115}
            color={FIXED_COLOR}
            trimColor={FIXED_TRIM_COLOR}
            screenColor={FIXED_SCREEN_COLOR}
            antenna={true}
            floorShadow={false}
            interactive={true}
            paused={!showBubble && !isHovered}
            speed={1.7}
          />
        </div>
      </div>
    </aside>
  );
}
