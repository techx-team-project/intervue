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
      className="border-outline-variant flex items-start justify-between gap-4 rounded-xl border p-3.5"
    >
      <div>
        <p id={titleId} className="text-on-surface text-sm font-semibold">
          {title}
        </p>
        <p id={descriptionId} className="text-on-surface-variant text-xs">
          {description}
        </p>
      </div>
      <Switch checked={checked} onChange={onChange} ariaLabel={title} />
    </div>
  );
}
