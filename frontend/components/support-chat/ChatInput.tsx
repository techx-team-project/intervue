'use client';

import React, { useRef, useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  remainingQuota: number | null;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, remainingQuota, disabled = false }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isLoading || disabled) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const isQuotaExhausted = remainingQuota !== null && remainingQuota <= 0;

  return (
    <div className="border-t border-slate-100 bg-white/95 px-3 py-2.5 backdrop-blur-xs sm:px-4 sm:py-3">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading || disabled || isQuotaExhausted}
          rows={1}
          placeholder={isQuotaExhausted ? 'You have used all questions for today...' : 'Ask how to use InterVue...'}
          className="max-h-28 min-h-[42px] flex-1 resize-none rounded-2xl border border-slate-200/90 bg-slate-50/90 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60 sm:text-[13px]"
        />
        <button
          type="submit"
          disabled={!text.trim() || isLoading || disabled || isQuotaExhausted}
          className="flex h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-xs transition-all hover:scale-105 hover:opacity-95 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:hover:scale-100"
          title="Send question"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
