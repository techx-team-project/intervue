'use client';

import { cn } from '@/lib/utils';
import { ImagePlus } from 'lucide-react';
import { useEffect, useId, useMemo } from 'react';

interface IdentityImageFieldProps {
  label: string;
  hint: string;
  file: File | null;
  error?: string;
  onChange: (file: File | null) => void;
}

export default function IdentityImageField({ label, hint, file, error, onChange }: IdentityImageFieldProps) {
  const inputId = useId();
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-on-surface block text-sm font-semibold">
        {label}
      </label>
      <label
        htmlFor={inputId}
        className={cn(
          'bg-surface-container-low hover:border-primary flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 border-dashed text-center transition-colors',
          error ? 'border-error' : 'border-outline-variant',
        )}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt={label} className="h-full w-full object-cover" />
        ) : (
          <>
            <ImagePlus className="text-on-surface-variant h-6 w-6" aria-hidden />
            <span className="text-on-surface-variant px-3 text-xs">{hint}</span>
          </>
        )}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png"
        className="sr-only"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      {file && <p className="text-on-surface-variant truncate text-xs">{file.name}</p>}
      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  );
}
