'use client';

import { Copy } from 'lucide-react';

interface OrderDetailRowProps {
  label: string;
  value: string;
  onCopy?: () => void;
  copied?: boolean;
  mono?: boolean;
  highlight?: boolean;
}

export default function OrderDetailRow({ label, value, onCopy, copied, mono, highlight }: OrderDetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className="flex items-center gap-2 text-right">
        <span
          className={`font-bold ${mono ? 'font-mono' : ''} ${highlight ? 'text-primary text-base' : 'text-on-surface'}`}
        >
          {value}
        </span>
        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="text-outline hover:text-primary cursor-pointer transition"
            aria-label={`Copy ${label}`}
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
        {copied && <span className="text-xs font-semibold text-emerald-600">Copied</span>}
      </dd>
    </div>
  );
}
