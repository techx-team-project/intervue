'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatAdDimensions } from '@/lib/admin-ads';
import { ExternalLink } from 'lucide-react';

export interface LightboxArtworkItem {
  title: string;
  subtitle?: string;
  imageUrl: string;
  targetUrl?: string | null;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

interface AdArtworkLightboxModalProps {
  item: LightboxArtworkItem | null;
  onClose: () => void;
}

export default function AdArtworkLightboxModal({ item, onClose }: AdArtworkLightboxModalProps) {
  return (
    <Modal
      isOpen={item !== null}
      onClose={onClose}
      title={item?.title ?? 'Banner preview'}
      description={
        item ? `${item.subtitle ? `${item.subtitle} · ` : ''}${formatAdDimensions(item.width, item.height)}` : undefined
      }
      maxWidth="3xl"
      radius="xl"
      footer={
        item?.targetUrl ? (
          <a
            href={item.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary mr-auto inline-flex items-center gap-1.5 text-xs font-semibold hover:underline dark:text-emerald-400"
          >
            <span className="max-w-md truncate">{item.targetUrl}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
        ) : undefined
      }
    >
      {item && (
        <div className="space-y-3">
          <div className="dark:border-forest-700 dark:bg-forest-950 border-outline-variant bg-surface-container-low flex items-center justify-center overflow-hidden rounded-lg border p-3">
            {/* Artwork may live on Cloudinary or external URLs outside next.config images.remotePatterns */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.altText || item.title}
              className="max-h-[60vh] w-auto max-w-full rounded object-contain"
            />
          </div>

          {item.altText && (
            <p className="dark:text-forest-300 text-on-surface-variant text-xs">
              <span className="font-semibold">Alt text:</span> {item.altText}
            </p>
          )}

          <div className="flex justify-end pt-1">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
