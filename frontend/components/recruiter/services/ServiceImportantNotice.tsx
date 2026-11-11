import { SERVICE_IMPORTANT_NOTICE } from '@/constants/service-package';
import { Info } from 'lucide-react';

export default function ServiceImportantNotice() {
  return (
    <div className="flex gap-3 rounded-lg border-l-4 border-sky-500 bg-sky-50 px-4 py-3.5">
      <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sky-600" />
      <div>
        <p className="text-sm font-bold text-sky-900">{SERVICE_IMPORTANT_NOTICE.title}</p>
        <p className="text-on-surface-variant mt-1 text-sm leading-relaxed">{SERVICE_IMPORTANT_NOTICE.body}</p>
      </div>
    </div>
  );
}
