'use client';

import React, { useMemo } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import type { CareerTableOfContentsItem } from '@/types/career';

interface MarkdownArticleContentProps {
  content: string;
}

export function extractTableOfContents(content: string): CareerTableOfContentsItem[] {
  if (!content) return [];
  const lines = content.split('\n');
  const items: CareerTableOfContentsItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      const title = trimmed.replace(/^##\s+/, '').trim();
      const id = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      items.push({ id, title, level: 1 });
    } else if (trimmed.startsWith('### ')) {
      const title = trimmed.replace(/^###\s+/, '').trim();
      const id = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      items.push({ id, title, level: 2 });
    }
  }

  return items;
}

export default function MarkdownArticleContent({ content }: MarkdownArticleContentProps) {
  const blocks = useMemo(() => {
    if (!content) return [];
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
        const id = title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[đĐ]/g, 'd')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        result.push({ type: 'h2', title, id });
      } else if (line.startsWith('### ')) {
        flushList();
        const title = line.replace(/^###\s+/, '').trim();
        const id = title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[đĐ]/g, 'd')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        result.push({ type: 'h3', title, id });
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
  }, [content]);

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
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
              <div className="text-primary mb-1.5 flex items-center gap-1.5 font-bold">
                <Sparkles className="h-4 w-4" />
                <span>Điểm cốt lõi cần nhớ:</span>
              </div>
              <p className="text-navy leading-relaxed">{block.text}</p>
            </div>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={idx} className="my-2 space-y-2 pl-2 text-sm text-[#374151]">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={idx} className="text-sm leading-relaxed text-[#374151] sm:text-base">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
