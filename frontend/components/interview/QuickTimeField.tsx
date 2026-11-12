'use client';

import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { currentLocalInputValue, localInputValueAfterDays } from '@/utils/datetime';
import { buildQuickSlots } from '@/utils/interview-slots';
import { useState } from 'react';

const MAX_FUTURE_DAYS = 30;

interface QuickTimeFieldProps {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export default function QuickTimeField({ label, value, error, onChange }: QuickTimeFieldProps) {
  const [slots] = useState(buildQuickSlots);

  return (
    <div className="space-y-2">
      <Input
        label={label}
        type="datetime-local"
        value={value}
        min={currentLocalInputValue()}
        max={localInputValueAfterDays(MAX_FUTURE_DAYS)}
        error={error}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="flex flex-wrap gap-1.5">
        {slots.map((slot) => (
          <button
            key={slot.value}
            type="button"
            onClick={() => onChange(slot.value)}
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors',
              value === slot.value
                ? 'border-primary bg-primary text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
            )}
          >
            {slot.label}
          </button>
        ))}
      </div>
    </div>
  );
}
