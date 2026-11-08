import React from 'react';
import { BookOpen } from 'lucide-react';

interface SourceLinksProps {
  sources: string[];
}

function formatSourceTitle(source: string): string {
  if (source.includes(' - ')) {
    const parts = source.split(' - ');
    return parts.slice(1).join(' - ');
  }
  return source.replace(/\.md$/, '');
}

export function SourceLinks({ sources }: SourceLinksProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2.5 border-t border-slate-200/80 pt-2">
      <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-slate-500">
        <BookOpen className="h-3 w-3 text-emerald-600" />
        <span>References:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {sources.map((source) => (
          <span
            key={`source-${source}`}
            title={source}
            className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 ring-1 ring-emerald-200/60 ring-inset"
          >
            <span className="max-w-[240px] truncate">{formatSourceTitle(source)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
