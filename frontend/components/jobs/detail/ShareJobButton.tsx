'use client';

import { Button } from '@/components/ui/Button';
import { Check, Share2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type ShareJobButtonProps = {
  jobId: number;
  title: string;
};

const COPIED_RESET_MS = 2500;

export default function ShareJobButton({ jobId, title }: ShareJobButtonProps) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${window.location.origin}/jobs/${jobId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Job link copied.');
      setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      toast.error('Could not share the link. Copy it from the address bar instead.');
    }
  };

  return (
    <Button type="button" variant="outline" size="xl" onClick={share} className="w-full justify-center px-4">
      {copied ? <Check className="h-4 w-4" aria-hidden /> : <Share2 className="h-4 w-4" aria-hidden />}
      {copied ? 'Copied' : 'Share'}
    </Button>
  );
}
