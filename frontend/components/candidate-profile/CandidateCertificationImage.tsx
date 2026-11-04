'use client';

import { IMAGE_ACCEPTED_TYPES } from '@/constants/candidate-profile';
import { useCertificationImage } from '@/hooks/useCandidateSection';
import { Camera, Trash2 } from 'lucide-react';
import { useRef, type ChangeEvent } from 'react';
import { toast } from 'sonner';

type CandidateCertificationImageProps = {
  id: number;
  name: string;
  imageUrl: string | null;
};

const BUTTON_CLASS =
  'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50';

export default function CandidateCertificationImage({ id, name, imageUrl }: CandidateCertificationImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, remove } = useCertificationImage();
  const busy = upload.isPending || remove.isPending;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!IMAGE_ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Only JPEG and PNG images are supported.');
      return;
    }
    upload.mutate({ id, file });
  };

  return (
    <div className="mt-2 flex items-center gap-3">
      {imageUrl && (
        <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
          <div
            role="img"
            aria-label={`${name} certificate`}
            className="h-16 w-24 rounded-lg border border-slate-200 bg-slate-50 bg-cover bg-center"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          />
        </a>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleChange} />
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className={BUTTON_CLASS}
          title={imageUrl ? 'Change certificate image' : 'Upload certificate image'}
          aria-label={imageUrl ? `Change image for ${name}` : `Upload image for ${name}`}
        >
          <Camera className="h-4 w-4" />
        </button>
        {imageUrl && (
          <button
            type="button"
            disabled={busy}
            onClick={() => remove.mutate(id)}
            className={BUTTON_CLASS}
            title="Remove certificate image"
            aria-label={`Remove image for ${name}`}
          >
            <Trash2 className="h-4 w-4 text-rose-500" />
          </button>
        )}
      </div>
    </div>
  );
}
