'use client';

import React, { useEffect, useRef } from 'react';
import { AlertCircle, Bot, RotateCcw, X } from 'lucide-react';
import { ChatInput } from './ChatInput';
import { ChatMessageItem } from './ChatMessageItem';
import { SuggestedQuestions } from './SuggestedQuestions';
import type { ChatContext, ChatMessage } from '@/types/ai-chat';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  context?: ChatContext;
  error: {
    message: string;
    retryAfter?: number | null;
    code?: string;
  } | null;
  onSendMessage: (message: string, faqCode?: string) => void;
  onResetSession: () => void;
}

export function ChatPanel({
  isOpen,
  onClose,
  messages,
  isLoading,
  context,
  error,
  onSendMessage,
  onResetSession,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading, error, isOpen]);

  const showSuggested = messages.length <= 1;

  return (
    <div
      role="dialog"
      aria-label="InterVue support chat"
      aria-hidden={!isOpen}
      className={`fixed right-3 bottom-[105px] left-3 z-50 flex h-[540px] max-h-[calc(100dvh-125px)] w-auto origin-bottom-right flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-2xl shadow-emerald-950/20 backdrop-blur-md transition-all duration-300 ease-out sm:right-6 sm:bottom-[115px] sm:left-auto sm:w-[410px] ${
        isOpen
          ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-3 scale-95 opacity-0'
      }`}
    >
      <div className="flex items-center justify-between border-b border-emerald-900/10 bg-linear-to-r from-emerald-800 via-emerald-700 to-teal-800 px-4 py-3 text-white">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center text-emerald-300 backdrop-blur-xs">
            <Bot className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-wide">InterVue AI Assistant</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onResetSession}
            title="Start a new conversation"
            className="cursor-pointer rounded-xl p-2 text-emerald-100/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close chat"
            className="cursor-pointer rounded-xl p-2 text-emerald-100/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3.5 overflow-y-auto bg-slate-50/70 p-3.5 sm:p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/60 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-track]:bg-transparent"
      >
        {messages.map((message, idx) => (
          <ChatMessageItem key={message.id} message={message} isLatest={idx === messages.length - 1} />
        ))}

        {context?.jobTitle && (
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-3 text-xs text-emerald-950">
            <p className="font-semibold text-emerald-900">
              Viewing: {context.jobTitle} {context.companyName ? `(${context.companyName})` : ''}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => onSendMessage('Match my resume to this job')}
                className="cursor-pointer rounded-lg border border-emerald-300 bg-white px-2.5 py-1 font-medium text-emerald-800 shadow-2xs hover:bg-emerald-100 disabled:opacity-50"
              >
                🎯 Match my resume to this job
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => onSendMessage('Draft a cover letter for this job opening')}
                className="cursor-pointer rounded-lg border border-emerald-300 bg-white px-2.5 py-1 font-medium text-emerald-800 shadow-2xs hover:bg-emerald-100 disabled:opacity-50"
              >
                ✍️ Draft sample cover letter
              </button>
            </div>
          </div>
        )}

        {showSuggested && <SuggestedQuestions onSelect={onSendMessage} disabled={isLoading} />}

        {isLoading && (
          <div className="animate-in fade-in-0 flex justify-start pr-8 duration-200">
            <div className="flex items-center gap-2.5 rounded-2xl rounded-tl-xs border border-emerald-100 bg-white px-4 py-3 shadow-xs">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Bot className="h-3.5 w-3.5 animate-pulse" />
              </div>
              <span className="text-xs text-slate-500">InterVue Bot is writing a reply</span>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-3.5 text-rose-800 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
              <div className="flex-1 text-xs">
                <p className="font-semibold">{error.message}</p>
                {typeof error.retryAfter === 'number' && error.retryAfter > 0 && (
                  <p className="mt-1 text-[11px] text-rose-600">Try again in {error.retryAfter} seconds</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <ChatInput onSend={onSendMessage} isLoading={isLoading} />
    </div>
  );
}
