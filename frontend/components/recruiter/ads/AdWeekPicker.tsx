'use client';

import { cn } from '@/lib/utils';
import type { AdWeek } from '@/types/ads';
import { formatDate } from '@/utils/datetime';
import { Check, Lock } from 'lucide-react';

interface AdWeekPickerProps {
  weeks: AdWeek[];
  selected: string[];
  onToggle: (weekStart: string) => void;
}

export default function AdWeekPicker({ weeks, selected, onToggle }: AdWeekPickerProps) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {weeks.map((week) => {
        const isSelected = selected.includes(week.weekStart);
        const disabled = !week.available;
        return (
          <li key={week.weekStart}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onToggle(week.weekStart)}
              aria-pressed={isSelected}
              className={cn(
                'flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition',
                disabled
                  ? 'border-outline-variant bg-surface-container-low text-on-surface-variant cursor-not-allowed'
                  : 'cursor-pointer',
                !disabled && isSelected
                  ? 'border-primary bg-emerald-50 text-emerald-900'
                  : !disabled && 'border-outline-variant hover:border-primary bg-white',
              )}
            >
              <span>
                <span className="font-semibold">{formatDate(week.weekStart)}</span>
                <span className="text-on-surface-variant block text-xs">đến {formatDate(week.weekEnd)}</span>
              </span>
              {disabled ? (
                <span className="text-on-surface-variant flex items-center gap-1 text-xs">
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                  {week.mine ? 'Của bạn' : 'Đã bán'}
                </span>
              ) : (
                isSelected && <Check className="h-4 w-4 text-emerald-700" aria-hidden />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
