'use client';

import React, { useMemo } from 'react';
import type { CareerTableOfContentsItem } from '@/types/career';

interface MarkdownArticleContentProps {
  content: string;
}

function slugifyHeading(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function extractTableOfContents(content: string): CareerTableOfContentsItem[] {
  if (!content) return [];
  const items: CareerTableOfContentsItem[] = [];

  // Check for HTML headings first
  if (content.includes('<h2') || content.includes('<h3')) {
    const regex = /<h([23])(?:\s+[^>]*id="([^"]*)")?[^>]*>(.*?)<\/h\1>/gi;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      const level = match[1] === '2' ? 1 : 2;
      const rawTitle = match[3].replace(/<[^>]+>/g, '').trim();
      const id = match[2] || slugifyHeading(rawTitle);
      if (rawTitle) {
        items.push({ id, title: rawTitle, level });
      }
    }
    if (items.length > 0) return items;
  }

  // Fallback to markdown lines
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      const title = trimmed.replace(/^##\s+/, '').trim();
      items.push({ id: slugifyHeading(title), title, level: 1 });
    } else if (trimmed.startsWith('### ')) {
      const title = trimmed.replace(/^###\s+/, '').trim();
      items.push({ id: slugifyHeading(title), title, level: 2 });
    }
  }

  return items;
}

// Enhance HTML string by ensuring h2 and h3 have anchor IDs matching Table of Contents
function enhanceHtmlHeadings(html: string): string {
  return html.replace(/<h([23])(?:\s+id="([^"]*)")?([^>]*)>(.*?)<\/h\1>/gi, (match, tag, existingId, rest, title) => {
    const cleanTitle = title.replace(/<[^>]+>/g, '').trim();
    const id = existingId || slugifyHeading(cleanTitle);
    const scrollClass = 'scroll-mt-28';
    return `<h${tag} id="${id}" class="${scrollClass}" ${rest}>${title}</h${tag}>`;
  });
}

export default function MarkdownArticleContent({ content }: MarkdownArticleContentProps) {
  const isHtml = useMemo(() => {
    if (!content) return false;
    return (
      content.includes('<p>') ||
      content.includes('<h2>') ||
      content.includes('<h3>') ||
      content.includes('<ul>') ||
      content.includes('<ol>') ||
      content.includes('<blockquote>')
    );
  }, [content]);

  const enhancedHtml = useMemo(() => {
    if (!isHtml) return '';
    return enhanceHtmlHeadings(content);
  }, [content, isHtml]);

  const markdownBlocks = useMemo(() => {
    if (isHtml || !content) return [];
    const lines = content.split('\n');
    const result: Array<
      | { type: 'h2'; title: string; id: string }
      | { type: 'h3'; title: string; id: string }
      | { type: 'highlight'; text: string }
      | { type: 'lead'; text: string }
      | { type: 'list'; items: string[] }
      | { type: 'paragraph'; text: string }
    > = [];

    let currentList: string[] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        result.push({ type: 'list', items: [...currentList] });
        currentList = [];
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        flushList();
        continue;
      }

      if (line.startsWith('## ')) {
        flushList();
        const title = line.replace(/^##\s+/, '').trim();
        result.push({ type: 'h2', title, id: slugifyHeading(title) });
      } else if (line.startsWith('### ')) {
        flushList();
        const title = line.replace(/^###\s+/, '').trim();
        result.push({ type: 'h3', title, id: slugifyHeading(title) });
      } else if (line.startsWith('> 💡') || line.startsWith('>')) {
        flushList();
        const text = line.replace(/^>\s*(💡\s*)?(\*\*Điểm cốt lõi:\*\*)?\s*/, '').trim();
        result.push({ type: 'highlight', text });
      } else if (line.startsWith('*') && line.endsWith('*') && line.length > 2 && !line.startsWith('**')) {
        flushList();
        const text = line.slice(1, -1).trim();
        result.push({ type: 'lead', text });
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        currentList.push(line.replace(/^[-*]\s+/, '').trim());
      } else {
        flushList();
        result.push({ type: 'paragraph', text: line });
      }
    }

    flushList();
    return result;
  }, [content, isHtml]);

  if (isHtml) {
    return (
      <div
        className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800 sm:text-base sm:leading-relaxed [&_a]:font-semibold [&_a]:text-emerald-600 [&_a]:underline hover:[&_a]:text-emerald-800 [&_blockquote]:my-5 [&_blockquote]:rounded-r-2xl [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:bg-emerald-50/50 [&_blockquote]:p-4 [&_blockquote]:text-emerald-950 [&_blockquote]:italic [&_code]:rounded-md [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-emerald-700 [&_em]:text-slate-800 [&_em]:italic [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-slate-100 [&_h2]:pt-6 [&_h2]:pb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 sm:[&_h2]:text-2xl [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:pt-4 [&_h3]:pb-1 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-800 sm:[&_h3]:text-xl [&_hr]:my-6 [&_hr]:border-slate-200 [&_li]:text-slate-700 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6 [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-slate-700 [&_pre]:my-4 [&_pre]:rounded-xl [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-slate-100 [&_strong]:font-bold [&_strong]:text-slate-900 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: enhancedHtml }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {markdownBlocks.map((block, idx) => {
        if (block.type === 'h2') {
          return (
            <h2
              key={idx}
              id={block.id}
              className="scroll-mt-28 border-b border-gray-100 pt-6 pb-2 text-xl font-bold text-[#171717] sm:text-2xl"
            >
              {block.title}
            </h2>
          );
        }

        if (block.type === 'h3') {
          return (
            <h3 key={idx} id={block.id} className="scroll-mt-28 pt-3 text-lg font-bold text-[#1e293b]">
              {block.title}
            </h3>
          );
        }

        if (block.type === 'lead') {
          return (
            <p key={idx} className="text-navy text-sm leading-relaxed font-medium italic sm:text-base">
              {block.text}
            </p>
          );
        }

        if (block.type === 'highlight') {
          return (
            <div
              key={idx}
              className="bg-primary-light my-4 rounded-2xl border border-emerald-100 p-4 text-xs sm:text-sm"
            >
              <div className="text-primary flex items-start gap-2.5 font-semibold">
                <span className="shrink-0 text-base">💡</span>
                <div className="leading-relaxed text-emerald-950">{block.text}</div>
              </div>
            </div>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={idx} className="space-y-2.5 pl-2 text-sm leading-relaxed text-[#334155] sm:text-base">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2.5">
                  <span className="text-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={idx} className="text-sm leading-relaxed text-[#334155] sm:text-base sm:leading-relaxed">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
