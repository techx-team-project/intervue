'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useUploadAdCreative } from '@/hooks/useAds';
import type { AdBooking } from '@/types/ads';
import { getErrorMessage } from '@/utils/error';
import { useEffect, useState } from 'react';

interface AdCreativeUploaderProps {
  booking: AdBooking | null;
  onClose: () => void;
  onUploaded: (message: string) => void;
}

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Không thể đọc kích thước ảnh đã chọn.'));
    };
    img.src = objectUrl;
  });
}

function AdCreativeUploaderForm({
  booking,
  onClose,
  onUploaded,
}: {
  booking: AdBooking;
  onClose: () => void;
  onUploaded: (message: string) => void;
}) {
  const upload = useUploadAdCreative();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileDimensions, setFileDimensions] = useState<{ width: number; height: number } | null>(null);
  const [targetUrl, setTargetUrl] = useState(booking.creativeTargetUrl ?? '');
  const [altText, setAltText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setError(null);
    setFile(selected);
    setFileDimensions(null);

    if (!selected) {
      setPreviewUrl(null);
      return;
    }

    const nextPreview = URL.createObjectURL(selected);
    setPreviewUrl(nextPreview);

    try {
      const dims = await readImageDimensions(selected);
      setFileDimensions(dims);
      if (booking.width != null && booking.height != null) {
        if (dims.width !== booking.width || dims.height !== booking.height) {
          setError(
            `Ảnh đang có kích thước ${dims.width}×${dims.height}px, yêu cầu đúng ${booking.width}×${booking.height}px.`,
          );
        }
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể đọc tệp ảnh.');
    }
  };

  const hasDimensionMismatch =
    fileDimensions !== null &&
    booking.width != null &&
    booking.height != null &&
    (fileDimensions.width !== booking.width || fileDimensions.height !== booking.height);

  const submit = () => {
    if (!file || hasDimensionMismatch) return;
    setError(null);
    upload.mutate(
      { bookingId: booking.id, file, targetUrl: targetUrl.trim(), altText: altText.trim() },
      {
        onSuccess: () => {
          onUploaded('Đã gửi ảnh, chờ quản trị viên duyệt.');
          onClose();
        },
        onError: (cause) => setError(getErrorMessage(cause)),
      },
    );
  };

  return (
    <>
      <p className="text-on-surface-variant text-sm">
        {booking.slotName} · tuần {booking.weekStart}
      </p>
      <p className="text-on-surface-variant mt-1 text-xs">
        Ảnh phải đúng kích thước{' '}
        <strong>
          {booking.width}×{booking.height}px
        </strong>
        , định dạng JPG hoặc PNG.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label className="text-on-surface text-xs font-bold" htmlFor="ad-creative-file">
            Ảnh banner
          </label>
          <input
            id="ad-creative-file"
            type="file"
            accept="image/png,image/jpeg"
            onChange={(event) => void handleFileChange(event)}
            className="text-on-surface-variant mt-1 block w-full text-sm"
          />
          {previewUrl && (
            <div className="border-outline-variant bg-surface-container-low/50 mt-3 overflow-hidden rounded-xl border p-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Xem trước ảnh banner" className="max-h-36 w-full rounded-lg object-contain" />
              {fileDimensions && (
                <p className="text-on-surface-variant mt-1.5 text-xs tabular-nums">
                  Kích thước tệp: {fileDimensions.width}×{fileDimensions.height}px
                </p>
              )}
            </div>
          )}
        </div>

        <Input
          label="Link đích khi bấm vào"
          value={targetUrl}
          onChange={(event) => setTargetUrl(event.target.value)}
          placeholder="https://congty.vn/tuyen-dung"
        />
        <Input
          label="Mô tả ảnh"
          value={altText}
          onChange={(event) => setAltText(event.target.value)}
          placeholder="Dùng cho trình đọc màn hình"
        />
      </div>

      <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
        Mỗi lần tải ảnh mới đều phải duyệt lại. Tuần đã bắt đầu mà ảnh chưa được duyệt thì vị trí hiển thị nội dung của
        InterVue, <strong>không được bù tuần</strong>.
      </p>

      {error && <p className="mt-3 text-xs font-semibold text-rose-600">{error}</p>}

      <div className="mt-5 flex justify-end gap-3">
        <Button variant="neutral" onClick={onClose}>
          Huỷ
        </Button>
        <Button
          onClick={submit}
          disabled={!file || !targetUrl.trim() || hasDimensionMismatch}
          isLoading={upload.isPending}
        >
          Gửi duyệt
        </Button>
      </div>
    </>
  );
}

export default function AdCreativeUploader({ booking, onClose, onUploaded }: AdCreativeUploaderProps) {
  return (
    <Modal isOpen={booking !== null} onClose={onClose} title="Tải ảnh banner" maxWidth="lg">
      {booking && (
        <AdCreativeUploaderForm key={booking.id} booking={booking} onClose={onClose} onUploaded={onUploaded} />
      )}
    </Modal>
  );
}
