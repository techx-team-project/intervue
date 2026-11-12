'use client';

import { CV_TEMPLATE_MESSAGES } from '@/constants/cv-templates';
import type { CvTemplateItem } from '@/types/cv-template';
import { ArrowUpRight, Eye } from 'lucide-react';
import CvPaperPreview from './CvPaperPreview';

interface CvTemplateCardProps {
  template: CvTemplateItem;
  onPreview: (template: CvTemplateItem) => void;
  onUseTemplate: (template: CvTemplateItem) => void;
}

export default function CvTemplateCard({ template, onPreview, onUseTemplate }: CvTemplateCardProps) {
  const { hotBadge, atsBadge, previewBtn, useTemplateBtn, usesCountSuffix } = CV_TEMPLATE_MESSAGES.card;

  return (
    <article className="group bg-surface border-outline-variant ease-standard hover:border-primary hover:shadow-card flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-0.5">
      <div className="bg-surface-container-low relative p-3">
        <CvPaperPreview sampleData={template.sampleData} primaryColor={template.defaultColorHex} isMini />

        <div className="bg-primary-deeper/70 absolute inset-3 flex items-center justify-center rounded-lg opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onPreview(template)}
            className="text-label-lg text-on-surface bg-surface flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 font-semibold"
          >
            <Eye className="h-4 w-4" aria-hidden />
            {previewBtn}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-title-md text-on-surface line-clamp-1 font-bold">{template.title}</h3>
          <p className="text-body-md text-on-surface-variant mt-1 line-clamp-2">{template.description}</p>
        </div>

        <ul className="flex flex-wrap gap-1.5">
          {template.isHot && (
            <li className="bg-primary text-on-primary text-label-md rounded-full px-2.5 py-1 font-bold">{hotBadge}</li>
          )}
          {template.isAtsOptimized && (
            <li className="bg-primary-container text-on-primary-container text-label-md rounded-full px-2.5 py-1 font-bold">
              {atsBadge}
            </li>
          )}
          <li className="bg-surface-container-low text-label-md text-on-surface-variant rounded-full px-2.5 py-1">
            {template.style}
          </li>
          {template.languages.map((language) => (
            <li
              key={language}
              className="bg-surface-container-low text-label-md text-on-surface-variant rounded-full px-2.5 py-1"
            >
              {language}
            </li>
          ))}
        </ul>

        <div className="border-outline-variant mt-auto flex items-center justify-between border-t pt-4">
          <p className="text-label-md text-on-surface-variant">
            <span className="text-on-surface font-semibold">{template.rating}</span> rating · {template.usesCount}{' '}
            {usesCountSuffix}
          </p>
          <button
            type="button"
            onClick={() => onUseTemplate(template)}
            className="text-label-lg text-primary flex cursor-pointer items-center gap-1 font-semibold hover:underline"
          >
            {useTemplateBtn}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}
