'use client';

import { IMAGE_ACCEPTED_TYPES } from '@/constants/candidate-profile';
import { useCandidateImage, type CandidateImageKind } from '@/hooks/useCandidateProfile';
import { cn } from '@/lib/utils';
import { Camera, Trash2 } from 'lucide-react';
import { useRef, type ChangeEvent } from 'react';
import { toast } from 'sonner';

type CandidateImageControlsProps = {
  kind: CandidateImageKind;
  hasImage: boolean;
  className?: string;
  uploadLabel: string;
  removeLabel: string;
};

const BUTTON_CLASS =
  'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-outline-variant bg-white text-on-surface shadow-xs transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50';

export default function CandidateImageControls({
  kind,
  hasImage,
  className,
  uploadLabel,
  removeLabel,
}: CandidateImageControlsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, remove } = useCandidateImage(kind);
  const busy = upload.isPending || remove.isPending;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!IMAGE_ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Only JPEG and PNG images are supported.');
      return;
    }
    upload.mutate(file);
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleChange} />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className={BUTTON_CLASS}
        title={uploadLabel}
        aria-label={uploadLabel}
      >
        <Camera className="h-4 w-4" />
      </button>
      {hasImage && (
        <button
          type="button"
          disabled={busy}
          onClick={() => remove.mutate()}
          className={BUTTON_CLASS}
          title={removeLabel}
          aria-label={removeLabel}
        >
          <Trash2 className="text-error h-4 w-4" />
        </button>
      )}
    </div>
  );
}
