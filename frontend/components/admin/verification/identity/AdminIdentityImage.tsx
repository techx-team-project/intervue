'use client';

import { adminIdentityVerificationApi } from '@/apiRequest/identity-verification';
import Spinner from '@/components/common/Spinner';
import type { IdentityDocumentSide } from '@/types/identity-verification';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

interface AdminIdentityImageProps {
  id: number;
  side: IdentityDocumentSide;
  label: string;
}

export default function AdminIdentityImage({ id, side, label }: AdminIdentityImageProps) {
  const {
    data: blob,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin', 'identity-document', id, side],
    queryFn: () => adminIdentityVerificationApi.document(id, side),
    staleTime: Infinity,
    gcTime: 0,
  });
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return (
    <figure className="space-y-1.5">
      <figcaption className="text-on-surface text-xs font-semibold">{label}</figcaption>
      <div className="bg-surface-container-low flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl">
        {isLoading && <Spinner />}
        {isError && <p className="text-error px-3 text-center text-xs">Không tải được ảnh.</p>}
        {url && (
          <a href={url} target="_blank" rel="noreferrer" className="block h-full w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={label} className="h-full w-full object-contain" />
          </a>
        )}
      </div>
    </figure>
  );
}
