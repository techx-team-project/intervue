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
    msg: 'Hehe bạn vừa chọc mình nè! Chúc bạn một ngày săn việc tràn đầy năng lượng nha!',
  },
  {
    state: 'thinking',
    msg: 'Đang suy nghĩ xem có công việc xịn hay mẹo CV ATS nào hữu ích cho bạn không đây...',
  },
  {
    state: 'speaking',
    msg: 'Chào bạn! Mình là InterVue AI, tải CV lên hoặc thử phỏng vấn giả lập cùng mình nhé!',
  },
  {
    state: 'searching',
    msg: 'Radar của mình đang rà soát hàng ngàn cơ hội việc làm lương cao đãi ngộ tốt nè!',
  },
];

const PERIODIC_GREETINGS: Array<{ state: RobotHeadState; msg: string }> = [
  {
    state: 'happy',
    msg: '👋 Xin chào! Bạn đã chuẩn bị CV chuẩn ATS chưa? Cần mình hỗ trợ chấm điểm miễn phí không nè?',
  },
  {
    state: 'speaking',
    msg: '🚀 Hôm nay có hơn 1,200+ việc làm IT & Kinh doanh mới đãi ngộ tốt, nhấp vào mình để khám phá nhé!',
  },
  {
    state: 'thinking',
    msg: '💡 Bật mí: Luyện phỏng vấn giả lập 1:1 với AI sẽ giúp bạn tăng 80% tự tin trước nhà tuyển dụng đấy!',
  },
  {
    state: 'searching',
    msg: '🔍 Radar AI của mình đang quét việc làm xịn gần bạn nè, bạn muốn tìm vị trí nào thế?',
  },
  {
    state: 'happy',
    msg: '✨ InterVue Bot AI luôn ở đây đồng hành cùng bạn! Bấm vào mình bất cứ lúc nào để mở công cụ nhé!',
  },
];

export function FloatingAssistant() {
  const pathname = usePathname();
  const [showBubble, setShowBubble] = useState(false);
  const [isAutoGreeting, setIsAutoGreeting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [robotState, setRobotState] = useState<RobotHeadState>('idle');
  const [currentMessage, setCurrentMessage] = useState<string>(
    'Chào bạn! Mình là bạn nhỏ InterVue Bot AI. Nhấp vào mình hoặc chọn tác vụ nhanh bên dưới nhé!',
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
    if (pathname === '/mascot') return;

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
  }, [pathname, startAutoDismiss, clearAutoDismiss]);

  if (pathname === '/mascot') {
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
                title="Thu gọn lời thoại"
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
                onClick={() => handleAction('thinking', 'Đang mở kho mẫu CV chuẩn ATS để chấm điểm cho bạn nhé!')}
                className="inline-flex items-center gap-1 rounded-xl border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-[10.5px] font-bold text-emerald-800 transition hover:bg-emerald-100"
              >
                <FileText className="h-3 w-3 text-emerald-600" />
                <span>Tạo CV ATS</span>
              </Link>

              <button
                type="button"
                onClick={() =>
                  handleAction(
                    'speaking',
                    'Sẵn sàng chưa? Hãy nêu một thử thách lớn nhất trong dự án gần đây của bạn nhé!',
                  )
                }
                className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-100 px-2.5 py-1 text-[10.5px] font-bold text-slate-800 transition hover:bg-slate-200"
              >
                <MessageSquareCode className="h-3 w-3 text-emerald-600" />
                <span>Phỏng vấn AI</span>
              </button>

              <Link
                href="/jobs"
                onClick={() =>
                  handleAction('searching', 'Đang quét radar toàn bộ việc làm lương cao đãi ngộ tốt cho bạn!')
                }
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-100 px-2.5 py-1 text-[10.5px] font-bold text-slate-800 transition hover:bg-slate-200"
              >
                <Briefcase className="h-3 w-3 text-emerald-600" />
                <span>Tìm việc làm</span>
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
          title={showBubble ? 'Nhấp để đóng khung chat' : 'Nhấp để mở khung chat cùng Bot'}
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
