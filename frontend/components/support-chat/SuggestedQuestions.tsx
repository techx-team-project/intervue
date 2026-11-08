'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { SUGGESTED_QUESTIONS } from '@/constants/ai-chat';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function SuggestedQuestions({ onSelect, disabled = false }: SuggestedQuestionsProps) {
  return (
    <div className="space-y-2 py-1">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
        <span>Frequently asked:</span>
      </div>
      <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap">
        {SUGGESTED_QUESTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item.question)}
            className="flex cursor-pointer items-center justify-between rounded-xl border border-emerald-100/90 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 shadow-2xs transition-all hover:border-emerald-300 hover:bg-emerald-50/70 hover:text-emerald-900 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>{item.question}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
