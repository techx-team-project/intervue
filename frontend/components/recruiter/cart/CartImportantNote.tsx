'use client';

import { Info } from 'lucide-react';

export default function CartImportantNote() {
  return (
    <div className="text-body-md rounded-xl border border-[#dbeafe] bg-[#f0f7ff] p-4 shadow-xs">
      <div className="flex items-center gap-2 font-bold text-[#1d4ed8]">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1d4ed8] text-white">
          <Info className="h-3.5 w-3.5" />
        </span>
        <h4 className="text-sm font-bold tracking-tight">Important Notice</h4>
      </div>
      <p className="text-body-sm text-on-surface-variant mt-2.5 leading-relaxed">
        To prevent fraudulent impersonation, <strong className="text-on-surface font-semibold">InterVue</strong>{' '}
        strongly advises clients never to transfer funds to any personal accounts. Only make payments to our official,
        verified corporate bank accounts displayed on this platform.
      </p>
    </div>
  );
}
