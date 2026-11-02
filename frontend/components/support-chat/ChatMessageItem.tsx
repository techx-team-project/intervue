'use client';

import React, { useEffect, useState } from 'react';
import { Bot, User } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SourceLinks } from './SourceLinks';
import type { ChatMessage } from '@/types/ai-chat';

interface ChatMessageItemProps {
  message: ChatMessage;
  isLatest?: boolean;
}

export function ChatMessageItem({ message, isLatest = false }: ChatMessageItemProps) {
  const isUser = message.role === 'user';
  const shouldAnimateTypewriter = isLatest && !isUser && message.createdAt > 0;

  const [streamedIndex, setStreamedIndex] = useState(shouldAnimateTypewriter ? 0 : -1);

  useEffect(() => {
    if (!shouldAnimateTypewriter) {
      return;
    }

    const words = message.content.split(' ');
    let current = 0;

    const interval = setInterval(() => {
      current += 2;
      if (current >= words.length) {
        setStreamedIndex(-1);
        clearInterval(interval);
      } else {
        setStreamedIndex(current);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [message.content, shouldAnimateTypewriter]);

  const isComplete = streamedIndex === -1;
  const displayedText = isComplete ? message.content : message.content.split(' ').slice(0, streamedIndex).join(' ');

  if (isUser) {
    return (
      <div className="animate-in fade-in-0 slide-in-from-bottom-2 flex justify-end pl-6 duration-200 sm:pl-10">
        <div className="flex max-w-[88%] items-end gap-2 sm:max-w-[85%]">
          <div className="rounded-2xl rounded-tr-xs bg-gradient-to-tr from-emerald-600 to-teal-600 px-3.5 py-2.5 text-xs leading-relaxed text-white shadow-xs sm:text-[13px]">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shadow-2xs">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-2 flex justify-start pr-4 duration-200 sm:pr-8">
      <div className="flex max-w-[96%] items-start gap-2.5 sm:max-w-[92%]">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-800 to-teal-700 text-emerald-200 shadow-xs ring-1 ring-emerald-500/20">
          <Bot className="h-4 w-4 text-emerald-300" />
        </div>
        <div
          onClick={() => {
            if (!isComplete) {
              setStreamedIndex(-1);
            }
          }}
          className="flex-1 rounded-2xl rounded-tl-xs border border-slate-200/80 bg-white p-3.5 shadow-xs transition-shadow hover:shadow-sm sm:p-4"
        >
          <MarkdownRenderer content={displayedText} />
          {!isComplete && (
            <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse rounded-xs bg-emerald-500 align-middle" />
          )}
          {isComplete && message.sources && message.sources.length > 0 && <SourceLinks sources={message.sources} />}
        </div>
      </div>
    </div>
  );
}
