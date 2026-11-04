'use client';

import Switch from '@/components/ui/Switch';
import { useId } from 'react';

type CandidateSwitchRowProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function CandidateSwitchRow({ title, description, checked, onChange }: CandidateSwitchRowProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-3.5"
    >
      <div>
        <p id={titleId} className="text-sm font-semibold text-slate-800">
          {title}
        </p>
        <p id={descriptionId} className="text-xs text-slate-500">
          {description}
        </p>
      </div>
      <Switch checked={checked} onChange={onChange} ariaLabel={title} />
    </div>
  );
}
