import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function sanitizeHref(url: string): string | null {
  const trimmed = url.trim();
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  ) {
    return trimmed;
  }
  return null;
}

function renderInline(text: string, baseKey: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let remaining = text;
  let keyCounter = 0;

  while (remaining.length > 0) {
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      elements.push(
        <code
          key={`${baseKey}-code-${keyCounter++}`}
          className="rounded-md bg-emerald-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-200/50"
        >
          {codeMatch[1]}
        </code>,
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      elements.push(
        <strong key={`${baseKey}-b-${keyCounter++}`} className="font-semibold text-emerald-950">
          {boldMatch[1]}
        </strong>,
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      elements.push(
        <em key={`${baseKey}-i-${keyCounter++}`} className="text-slate-700 italic">
          {italicMatch[1]}
        </em>,
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const safeUrl = sanitizeHref(linkMatch[2]);
      if (safeUrl) {
        elements.push(
          <a
            key={`${baseKey}-a-${keyCounter++}`}
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-emerald-600 underline underline-offset-2 hover:text-emerald-700"
          >
            {linkText}
          </a>,
        );
      } else {
        elements.push(linkText);
      }
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    const nextSpecialIndex = remaining.search(/[`*[]/);
    if (nextSpecialIndex === -1) {
      elements.push(remaining);
      break;
    } else if (nextSpecialIndex === 0) {
      elements.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      elements.push(remaining.slice(0, nextSpecialIndex));
      remaining = remaining.slice(nextSpecialIndex);
    }
  }

  return elements;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const blocks = content.split('\n\n');

  return (
    <div className={`space-y-2.5 text-xs leading-relaxed text-slate-800 sm:text-[13px] ${className}`}>
      {blocks.map((block, blockIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith('```')) {
          const lines = trimmed.split('\n');
          const codeLines = lines.slice(1, lines[lines.length - 1].startsWith('```') ? -1 : undefined);
          return (
            <pre
              key={`block-pre-${blockIdx}`}
              className="my-2 overflow-x-auto rounded-xl bg-slate-900 p-3 font-mono text-[11px] text-slate-100 shadow-2xs"
            >
              <code>{codeLines.join('\n')}</code>
            </pre>
          );
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={`block-h4-${blockIdx}`} className="mt-2 text-[13.5px] font-bold text-slate-900">
              {renderInline(trimmed.slice(4), `h4-${blockIdx}`)}
            </h4>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={`block-h3-${blockIdx}`} className="mt-2.5 text-[14.5px] font-bold text-slate-900">
              {renderInline(trimmed.slice(3), `h3-${blockIdx}`)}
            </h3>
          );
        }

        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={`block-h2-${blockIdx}`} className="mt-3 text-base font-bold text-slate-900">
              {renderInline(trimmed.slice(2), `h2-${blockIdx}`)}
            </h2>
          );
        }

        const lines = trimmed.split('\n');
        const hasNumberedList = lines.some((l) => /^\s*\d+\.\s+/.test(l));
        if (hasNumberedList && lines.every((l) => /^\s*\d+\.\s+/.test(l) || !l.trim())) {
          return (
            <div key={`block-ol-${blockIdx}`} className="my-1.5 space-y-2">
              {lines.map((line, lineIdx) => {
                const match = line.match(/^\s*(\d+)\.\s+(.*)/);
                if (!match) return null;
                const num = match[1];
                const itemText = match[2];
                return (
                  <div key={`ol-${blockIdx}-item-${lineIdx}`} className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100/90 text-[10.5px] font-bold text-emerald-800 shadow-2xs">
                      {num}
                    </span>
                    <div className="flex-1 pt-0.5 leading-relaxed text-slate-700">
                      {renderInline(itemText, `ol-${blockIdx}-${lineIdx}`)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        const isBulletList = lines.every((l) => /^\s*[-*]\s+/.test(l) || !l.trim());
        if (isBulletList) {
          return (
            <div key={`block-ul-${blockIdx}`} className="my-1.5 space-y-1.5">
              {lines.map((line, lineIdx) => {
                const itemText = line.replace(/^\s*[-*]\s+/, '');
                if (!itemText.trim()) return null;
                return (
                  <div key={`ul-${blockIdx}-item-${lineIdx}`} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <div className="flex-1 leading-relaxed text-slate-700">
                      {renderInline(itemText, `ul-${blockIdx}-${lineIdx}`)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        return (
          <p key={`block-p-${blockIdx}`} className="leading-relaxed text-slate-700">
            {lines.map((line, lineIdx) => (
              <React.Fragment key={`p-${blockIdx}-line-${lineIdx}`}>
                {lineIdx > 0 && <br />}
                {renderInline(line, `p-${blockIdx}-${lineIdx}`)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
