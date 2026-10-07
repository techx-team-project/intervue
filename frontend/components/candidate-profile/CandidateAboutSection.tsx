'use client';

import { Edit2, Sparkles, User } from 'lucide-react';

interface CandidateAboutSectionProps {
  bio: string;
  isOwner?: boolean;
  onEdit?: () => void;
}

export default function CandidateAboutSection({ bio, isOwner = true, onEdit }: CandidateAboutSectionProps) {
  return (
    <div className="rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-xs sm:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="text-primary flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
            <User className="h-5 w-5" />
          </div>
          <h2 className="text-navy text-lg font-bold sm:text-xl">Giới thiệu bản thân</h2>
        </div>

        {isOwner && onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="hover:text-primary flex h-8 w-8 items-center justify-center rounded-lg text-[#6f7882] transition-colors hover:bg-[#f4f5f5]"
            title="Chỉnh sửa giới thiệu"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="relative rounded-2xl bg-[#f8fafc] p-5">
        <p className="text-[14.5px] leading-relaxed text-[#334155]">{bio}</p>

        {/* Highlight tags */}
        <div className="text-primary mt-4 flex flex-wrap items-center gap-2 border-t border-[#e2e8f0]/80 pt-3 text-[12px] font-semibold">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/70 px-2.5 py-0.5">
            <Sparkles className="h-3 w-3" /> 6+ Năm kinh nghiệm
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/70 px-2.5 py-0.5">
            <Sparkles className="h-3 w-3" /> Kiến trúc phân tán High-Concurrency
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/70 px-2.5 py-0.5">
            <Sparkles className="h-3 w-3" /> Tích hợp GenAI & LLM
          </span>
        </div>
      </div>
    </div>
  );
}
