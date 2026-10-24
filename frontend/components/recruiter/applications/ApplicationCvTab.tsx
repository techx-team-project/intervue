'use client';

import type { AttachedCv } from '@/types/candidate';
import { Download, Eye, FileCheck2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface ApplicationCvTabProps {
  cv: AttachedCv;
  candidateName: string;
}

export default function ApplicationCvTab({ cv, candidateName }: ApplicationCvTabProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#e5e9ef] bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
              <FileCheck2 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-navy truncate text-[13.5px] font-bold">{cv.fileName}</p>
              <p className="text-[11.5px] text-[#64748b]">
                {cv.fileSize} • Submitted {cv.uploadedAt}
              </p>
              <p className="text-primary mt-1 inline-flex items-center gap-1 text-[11.5px] font-bold">
                <Sparkles className="h-3 w-3" />
                ATS score: {cv.atsScore}%
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => toast.info(`Opening the CV preview for ${candidateName}...`)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-[12.5px] font-bold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </button>
            <button
              type="button"
              onClick={() => toast.success(`Downloaded ${cv.fileName}.`)}
              className="bg-primary hover:bg-primary-hover inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-bold text-white transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download CV
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-72 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#e2e8f0] bg-[#fafbfc] text-center">
        <FileCheck2 className="h-9 w-9 text-[#cbd5e1]" />
        <p className="text-navy text-[13px] font-bold">CV as submitted with this application</p>
        <p className="max-w-xs text-[11.5px] leading-relaxed text-[#94a3b8]">
          The CV viewer will appear here once file storage is connected. This copy is kept as submitted, even if the
          candidate changes the CV in their account.
        </p>
      </div>
    </div>
  );
}
