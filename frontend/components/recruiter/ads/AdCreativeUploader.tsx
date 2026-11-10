'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useUploadAdCreative } from '@/hooks/useAds';
import type { AdBooking } from '@/types/ads';
import { getErrorMessage } from '@/utils/error';
import { useState } from 'react';

interface AdCreativeUploaderProps {
  booking: AdBooking | null;
  onClose: () => void;
  onUploaded: (message: string) => void;
}

export default function AdCreativeUploader({ booking, onClose, onUploaded }: AdCreativeUploaderProps) {
  const upload = useUploadAdCreative();
  const [file, setFile] = useState<File | null>(null);
  const [targetUrl, setTargetUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!booking || !file) return;
    setError(null);
    upload.mutate(
      { bookingId: booking.id, file, targetUrl: targetUrl.trim(), altText: altText.trim() },
      {
        onSuccess: () => {
          setFile(null);
          setTargetUrl('');
          setAltText('');
          onUploaded('Đã gửi ảnh, chờ quản trị viên duyệt.');
          onClose();
        },
        onError: (cause) => setError(getErrorMessage(cause)),
      },
    );
  };

  return (
    <Modal isOpen={booking !== null} onClose={onClose} title="Tải ảnh banner" maxWidth="lg">
      {booking && (
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
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="text-on-surface-variant mt-1 block w-full text-sm"
              />
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
            Mỗi lần tải ảnh mới đều phải duyệt lại. Tuần đã bắt đầu mà ảnh chưa được duyệt thì vị trí hiển thị nội dung
            của InterVue, <strong>không được bù tuần</strong>.
          </p>

          {error && <p className="mt-3 text-xs font-semibold text-rose-600">{error}</p>}

          <div className="mt-5 flex justify-end gap-3">
            <Button variant="neutral" onClick={onClose}>
              Huỷ
            </Button>
            <Button onClick={submit} disabled={!file || !targetUrl.trim()} isLoading={upload.isPending}>
              Gửi duyệt
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
