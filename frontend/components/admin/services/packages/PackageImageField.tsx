'use client';

import { adminServicePackageApi } from '@/apiRequest/admin-service-package';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/utils/error';
import { ExternalLink, ImageIcon, Upload, X } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { toast } from 'sonner';

interface PackageImageFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
  maxDimensions?: { width: number; height: number };
  minDimensions?: { width: number; height: number };
  onUpload?: (file: File) => Promise<{ url: string; publicId: string }>;
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_RAW_FILE_BYTES = 15 * 1024 * 1024;
const MIN_IMAGE_WIDTH = 160;
const MIN_IMAGE_HEIGHT = 90;
const DEFAULT_MAX_DIMENSIONS = { width: 1200, height: 720 };
const DEFAULT_MIN_DIMENSIONS = { width: MIN_IMAGE_WIDTH, height: MIN_IMAGE_HEIGHT };
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png']);
const CONTROL_DARK_CLASS =
  'dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 dark:placeholder:text-forest-400';

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not read the selected image file.'));
    };
    img.src = objectUrl;
  });
}

async function normalizeUploadImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  minWidth: number,
  minHeight: number,
): Promise<{ file: File; width: number; height: number; scaled: boolean }> {
  const img = await loadImageElement(file);
  const { naturalWidth, naturalHeight } = img;

  if (naturalWidth < minWidth || naturalHeight < minHeight) {
    throw new Error(`Image is too small (${naturalWidth}×${naturalHeight}px). Minimum is ${minWidth}×${minHeight}px.`);
  }

  const ratio = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight, 1);
  if (ratio >= 1) {
    return { file, width: naturalWidth, height: naturalHeight, scaled: false };
  }

  const targetWidth = Math.max(1, Math.round(naturalWidth * ratio));
  const targetHeight = Math.max(1, Math.round(naturalHeight * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { file, width: naturalWidth, height: naturalHeight, scaled: false };
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, outputType, outputType === 'image/jpeg' ? 0.9 : undefined),
  );
  if (!blob) {
    return { file, width: naturalWidth, height: naturalHeight, scaled: false };
  }

  const normalizedFile = new File([blob], file.name, { type: outputType, lastModified: file.lastModified });
  return { file: normalizedFile, width: targetWidth, height: targetHeight, scaled: true };
}

function ImagePreviewThumbnail({ url, onClear }: { url: string; onClear: () => void }) {
  const [hasError, setHasError] = useState(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  return (
    <div className="dark:border-forest-800 dark:bg-forest-950/60 border-outline-variant bg-surface-container-low/50 flex items-center gap-3 rounded-xl border p-2.5">
      <div className="dark:border-forest-700 dark:bg-forest-900 border-outline-variant flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white">
        {hasError ? (
          <ImageIcon className="text-outline h-5 w-5" aria-hidden />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Package artwork preview"
            onLoad={(event) =>
              setDimensions({
                width: event.currentTarget.naturalWidth,
                height: event.currentTarget.naturalHeight,
              })
            }
            onError={() => setHasError(true)}
            className="h-full w-full object-contain"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="dark:text-forest-100 text-on-surface truncate text-xs font-medium">{url}</p>
        {hasError ? (
          <p className="mt-0.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
            Could not load image preview from this URL.
          </p>
        ) : (
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px]">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex items-center gap-1 font-semibold hover:underline"
            >
              <span>Open full image</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            {dimensions && (
              <span className="dark:text-forest-400 text-on-surface-variant tabular-nums">
                · {dimensions.width}×{dimensions.height}px
              </span>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onClear}
        aria-label="Remove image"
        className="text-outline cursor-pointer rounded-lg p-1.5 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function PackageImageField({
  label,
  value,
  onChange,
  error,
  helperText = 'Upload PNG/JPG (max 5 MB) or paste an HTTPS image URL.',
  placeholder = 'https://res.cloudinary.com/...',
  maxDimensions = DEFAULT_MAX_DIMENSIONS,
  minDimensions = DEFAULT_MIN_DIMENSIONS,
  onUpload,
}: PackageImageFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      toast.error('Only PNG and JPG images are supported.');
      event.target.value = '';
      return;
    }
    if (file.size > MAX_RAW_FILE_BYTES) {
      toast.error('Selected image file is too large (max 15 MB before scaling).');
      event.target.value = '';
      return;
    }

    setIsUploading(true);
    try {
      const processed = await normalizeUploadImage(
        file,
        maxDimensions.width,
        maxDimensions.height,
        minDimensions.width,
        minDimensions.height,
      );
      if (processed.file.size > MAX_IMAGE_BYTES) {
        toast.error('Image still exceeds the 5 MB upload limit after scaling.');
        return;
      }
      const uploadImage = onUpload ?? adminServicePackageApi.uploadImage;
      const uploaded = await uploadImage(processed.file);
      onChange(uploaded.url);
      toast.success(
        processed.scaled
          ? `Image scaled proportionally to ${processed.width}×${processed.height}px and uploaded.`
          : `Image uploaded (${processed.width}×${processed.height}px).`,
      );
    } catch (cause) {
      toast.error(cause instanceof Error && !('code' in cause) ? cause.message : getErrorMessage(cause));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const trimmedUrl = value.trim();

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-on-surface dark:text-forest-100 block text-sm font-semibold">
          {label}
        </label>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <Input
            id={inputId}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            className={cn(error ? 'border-error focus:border-error' : undefined, CONTROL_DARK_CLASS)}
            rightElement={
              trimmedUrl ? (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  aria-label="Clear image URL"
                  className="hover:bg-surface-container-high hover:text-on-surface dark:hover:bg-forest-800 cursor-pointer rounded p-0.5 transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : undefined
            }
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={(event) => void handleFileChange(event)}
          className="sr-only"
        />

        <Button
          type="button"
          variant="outline"
          size="md"
          radius="xl"
          isLoading={isUploading}
          leftIcon={<Upload className="h-4 w-4" />}
          onClick={() => fileInputRef.current?.click()}
          className="dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850 h-[42px] shrink-0"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>

      {error && <p className="text-error text-xs font-medium">{error}</p>}
      {!error && helperText && <p className="dark:text-forest-400 text-on-surface-variant text-xs">{helperText}</p>}

      {trimmedUrl && <ImagePreviewThumbnail key={trimmedUrl} url={trimmedUrl} onClear={() => onChange('')} />}
    </div>
  );
}
