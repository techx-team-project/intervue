'use client';

import React from 'react';
import { CvTemplateItem } from '@/types/cv-template';
import CvPaperPreview from './CvPaperPreview';
import { Eye, Star, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface CvTemplateCardProps {
  template: CvTemplateItem;
  onPreview: (template: CvTemplateItem) => void;
  onUseTemplate: (template: CvTemplateItem) => void;
}

export default function CvTemplateCard({ template, onPreview, onUseTemplate }: CvTemplateCardProps) {
  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#00b14f]/60 hover:shadow-xl">
      <div>
        {/* Top Preview Canvas Container */}
        <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-2">
          {/* Mini dynamic CV Paper preview */}
          <div className="transition-transform duration-500 group-hover:scale-102">
            <CvPaperPreview sampleData={template.sampleData} primaryColor={template.defaultColorHex} isMini={true} />
          </div>

          {/* Top floating badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {template.isHot && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                <Sparkles className="h-2.5 w-2.5" />
                Hot
              </span>
            )}
            {template.isAtsOptimized && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#00b14f] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                <ShieldCheck className="h-2.5 w-2.5" />
                Chuẩn ATS
              </span>
            )}
          </div>

          {/* Hover Action Overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-xl bg-black/40 p-4 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onPreview(template)}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-[#171717] shadow-lg transition hover:bg-gray-100"
            >
              <Eye className="h-3.5 w-3.5 text-[#00b14f]" />
              <span>Xem trước</span>
            </button>

            <button
              type="button"
              onClick={() => onUseTemplate(template)}
              className="flex items-center gap-1.5 rounded-xl bg-[#00b14f] px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-[#009b44]"
            >
              <span>Dùng mẫu</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Title and Meta */}
        <div className="mt-4">
          <h3 className="line-clamp-1 text-sm font-bold text-[#171717] transition-colors group-hover:text-[#00b14f]">
            {template.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#526475]">{template.description}</p>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="rounded bg-emerald-50 px-2 py-0.5 font-semibold text-[#00b14f]">{template.style}</span>
            {template.languages.map((lang, lIdx) => (
              <span key={lIdx} className="rounded bg-gray-100 px-2 py-0.5 text-gray-600">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer: Uses count & CTA buttons */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2 text-[11px] text-[#7f878f]">
          <span className="flex items-center gap-0.5 font-bold text-amber-500">
            <Star className="h-3 w-3 fill-current" />
            {template.rating}
          </span>
          <span>•</span>
          <span>{template.usesCount} dùng</span>
        </div>

        <button
          type="button"
          onClick={() => onUseTemplate(template)}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#00b14f] hover:underline"
        >
          <span>Dùng mẫu</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
